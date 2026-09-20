"""
TrustHire AI — End-to-End Security & Session Test Suite
Tests:
1. Removed public SMTP configuration endpoint returns 404
2. User registration and secure PBKDF2 password hashing
3. Email OTP generation & verification with session cookie creation
4. Session persistence and /api/auth/me validation
5. Protected API routes access control (401 when unauthorized)
6. Report ownership isolation between distinct users (A cannot see or delete B's reports)
7. Logout and session invalidation
"""

import sys
import os
import unittest
from unittest.mock import patch

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.main import app
from app.database import get_db, init_db
from app.config import SESSION_COOKIE_NAME

class TestTrustHireSecureAuth(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        init_db()
        cls.client = app.test_client()

    def setUp(self):
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM rate_limits")
        cursor.execute("DELETE FROM otp_codes")
        cursor.execute("DELETE FROM sessions")
        cursor.execute("DELETE FROM users WHERE email LIKE '%example.com'")
        cursor.execute("DELETE FROM verifications WHERE user_email LIKE '%example.com'")
        conn.commit()
        conn.close()

    def test_01_public_smtp_endpoint_removed(self):
        """Verify public SMTP endpoint returns 404 and cannot be exploited."""
        res = self.client.get('/api/auth/smtp-config')
        self.assertEqual(res.status_code, 404, "Public SMTP configuration endpoint should be removed")

    @patch('app.auth.send_verification_email')
    def test_02_registration_and_otp_verification(self, mock_email):
        """Test registration, OTP delivery, and verified account activation with session cookie."""
        mock_email.return_value = {"sent": True, "error": None}

        test_email = "tester_pwa_01@example.com"
        test_pw = "SecurePwaPass!2026"

        # Register
        res = self.client.post('/api/auth/register', json={
            'email': test_email,
            'password': test_pw
        })
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertTrue(data['success'])

        # Verify email was dispatched with a valid 6-digit OTP
        mock_email.assert_called_once()
        sent_to, otp = mock_email.call_args[0]
        self.assertEqual(sent_to, test_email)
        self.assertEqual(len(otp), 6)
        self.assertTrue(otp.isdigit())

        # Verify password is not plaintext in DB
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute("SELECT password_hash, is_verified FROM users WHERE email = ?", (test_email,))
        row = cursor.fetchone()
        self.assertTrue(row['password_hash'].startswith(('scrypt:', 'pbkdf2:')))
        self.assertEqual(row['is_verified'], 0)
        conn.close()

        # Verify OTP
        verify_res = self.client.post('/api/auth/verify-otp', json={
            'email': test_email,
            'otp': otp
        })
        self.assertEqual(verify_res.status_code, 200)
        v_data = verify_res.get_json()
        self.assertTrue(v_data['success'])
        self.assertTrue(v_data['user']['is_verified'])

        # Check session cookie exists
        cookies = verify_res.headers.getlist('Set-Cookie')
        has_session_cookie = any(SESSION_COOKIE_NAME in c for c in cookies)
        self.assertTrue(has_session_cookie, "Session cookie should be set upon OTP verification")

    @patch('app.auth.send_verification_email')
    def test_03_login_authentication_and_me_endpoint(self, mock_email):
        """Test login with credentials and verifying /api/auth/me session."""
        mock_email.return_value = {"sent": True, "error": None}

        test_email = "tester_pwa_02@example.com"
        test_pw = "MyPassphrase#789"

        # Register and verify
        self.client.post('/api/auth/register', json={'email': test_email, 'password': test_pw})
        _, otp = mock_email.call_args[0]
        self.client.post('/api/auth/verify-otp', json={'email': test_email, 'otp': otp})

        # New isolated client session
        client = app.test_client()

        # Try wrong password first
        bad_res = client.post('/api/auth/login', json={'email': test_email, 'password': 'WrongPassword!'})
        self.assertEqual(bad_res.status_code, 401)

        # Login with correct password
        login_res = client.post('/api/auth/login', json={'email': test_email, 'password': test_pw})
        self.assertEqual(login_res.status_code, 200)
        l_data = login_res.get_json()
        self.assertTrue(l_data['success'])
        self.assertEqual(l_data['user']['email'], test_email)

        # Access /api/auth/me with the active session cookie
        me_res = client.get('/api/auth/me')
        self.assertEqual(me_res.status_code, 200)
        me_data = me_res.get_json()
        self.assertTrue(me_data['authenticated'])
        self.assertEqual(me_data['user']['email'], test_email)

        # Logout
        logout_res = client.post('/api/auth/logout')
        self.assertEqual(logout_res.status_code, 200)

        # Verify /api/auth/me is now unauthenticated
        me_res_after = client.get('/api/auth/me')
        self.assertEqual(me_res_after.status_code, 401)

    def test_04_unauthenticated_api_protection(self):
        """Verify unauthenticated requests to protected endpoints return 401."""
        client = app.test_client()

        res_history = client.get('/api/history')
        self.assertEqual(res_history.status_code, 401)

        res_verify = client.post('/api/verify/job-full', json={'job_text': 'Remote position'})
        self.assertEqual(res_verify.status_code, 401)

        res_del = client.delete('/api/history/999')
        self.assertEqual(res_del.status_code, 401)

    @patch('app.auth.send_verification_email')
    def test_05_report_ownership_isolation(self, mock_email):
        """Verify User A cannot view or delete reports created by User B."""
        mock_email.return_value = {"sent": True, "error": None}

        email_a = "user_alpha@example.com"
        pw_a = "AlphaPass#2026"
        email_b = "user_beta@example.com"
        pw_b = "BetaPass#2026"

        for em, pw in [(email_a, pw_a), (email_b, pw_b)]:
            self.client.post('/api/auth/register', json={'email': em, 'password': pw})
            _, otp = mock_email.call_args[0]
            self.client.post('/api/auth/verify-otp', json={'email': em, 'otp': otp})

        # Client A logs in and runs job verification
        client_a = app.test_client()
        client_a.post('/api/auth/login', json={'email': email_a, 'password': pw_a})

        job_res = client_a.post('/api/verify/job-full', json={
            'job_text': 'Looking for an AI engineer at TechNova. Apply via secure portal with resume.',
            'job_title': 'Senior AI Researcher',
            'company_name': 'TechNova Systems',
            'job_url': 'https://technova.example.com/careers/ai',
            'recruiter_email': 'hr@technova.example.com'
        })
        self.assertEqual(job_res.status_code, 200)
        report_a = job_res.get_json()['report']
        report_id = report_a['id']

        # Verify Report exists in User A's history
        hist_a = client_a.get('/api/history').get_json()
        ids_a = [r['id'] for r in hist_a['history']]
        self.assertIn(report_id, ids_a)

        # Client B logs in
        client_b = app.test_client()
        client_b.post('/api/auth/login', json={'email': email_b, 'password': pw_b})

        # Verify Report does NOT exist in User B's history
        hist_b = client_b.get('/api/history').get_json()
        ids_b = [r['id'] for r in hist_b['history']]
        self.assertNotIn(report_id, ids_b, "User B must not see User A's reports")

        # User B attempts to delete User A's report -> Must return 404
        del_res = client_b.delete(f'/api/history/{report_id}')
        self.assertEqual(del_res.status_code, 404, "User B must not be able to delete User A's report")

        # User A deletes their own report -> Must succeed
        del_a = client_a.delete(f'/api/history/{report_id}')
        self.assertEqual(del_a.status_code, 200)

if __name__ == '__main__':
    unittest.main()
