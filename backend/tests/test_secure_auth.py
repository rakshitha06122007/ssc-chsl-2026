import sys
import time
import secrets
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE_DIR))

from app.database import init_db, get_db
from app.auth import (
    hash_otp,
    generate_and_send_otp,
    verify_otp_code,
    register_account,
    login_with_password,
    OTP_EXPIRY_SECONDS,
    RESEND_COOLDOWN_SECONDS
)
from app.main import app

def run_tests():
    print("=== Starting Secure Authentication & Email OTP Test Suite ===")
    init_db()

    # 1. Test Cryptographic Hash Generation
    code = "582914"
    salt = secrets.token_hex(16)
    h1 = hash_otp(code, salt)
    h2 = hash_otp(code, salt)
    h_diff = hash_otp("582915", salt)
    assert h1 == h2, "Hash must be deterministic for identical code and salt"
    assert h1 != h_diff, "Hash must differ for different codes"
    print("✓ PASS: Cryptographic OTP hashing verified.")

    # 2. Test OTP Database Storage (No Plaintext)
    test_email = f"test_{int(time.time())}@example.com"
    salt_db = secrets.token_hex(16)
    code_test = "739102"
    otp_hash = hash_otp(code_test, salt_db)
    now = time.time()
    
    conn = get_db()
    c = conn.cursor()
    c.execute("""
    INSERT INTO otp_codes (email, otp_hash, salt, expires_at, created_at, is_used, attempts)
    VALUES (?, ?, ?, ?, ?, 0, 0)
    """, (test_email, otp_hash, salt_db, now + 600, now))
    conn.commit()
    
    # Query database to confirm no plaintext OTP exists
    c.execute("SELECT * FROM otp_codes WHERE email = ?", (test_email,))
    row = dict(c.fetchone())
    conn.close()
    
    assert "otp_hash" in row and row["otp_hash"] == otp_hash
    assert code_test not in str(row.values()), "Plaintext OTP must NEVER be stored in database!"
    print("✓ PASS: Database stores only salted hash, zero plaintext OTP.")

    # 3. Test OTP Verification Success & Single-Use Enforcement
    success, msg, user_info = verify_otp_code(test_email, code_test, password="SecurePassword123!")
    assert success, f"OTP verification should succeed: {msg}"
    assert user_info["email"] == test_email
    assert user_info["is_verified"] is True
    print("✓ PASS: Initial OTP verification successful.")

    # Second attempt with same OTP MUST FAIL (Single-use)
    success_replay, msg_replay, _ = verify_otp_code(test_email, code_test)
    assert not success_replay, "Replaying the same OTP MUST fail!"
    print("✓ PASS: Single-use enforcement verified (replay rejected).")

    # 4. Test 10-Minute Expiration Enforcement
    expired_email = f"expired_{int(time.time())}@example.com"
    exp_salt = secrets.token_hex(16)
    exp_code = "654321"
    exp_hash = hash_otp(exp_code, exp_salt)
    
    conn = get_db()
    c = conn.cursor()
    # Insert code expired 10 seconds ago
    c.execute("""
    INSERT INTO otp_codes (email, otp_hash, salt, expires_at, created_at, is_used, attempts)
    VALUES (?, ?, ?, ?, ?, 0, 0)
    """, (expired_email, exp_hash, exp_salt, now - 10, now - 610))
    conn.commit()
    conn.close()

    success_exp, msg_exp, _ = verify_otp_code(expired_email, exp_code)
    assert not success_exp, "Expired OTP must be rejected!"
    assert "expired" in msg_exp.lower()
    print("✓ PASS: 10-minute expiry strictly enforced.")

    # 5. Test 60-Second Resend Cooldown
    cooldown_email = f"cooldown_{int(time.time())}@example.com"
    conn = get_db()
    c = conn.cursor()
    c.execute("""
    INSERT INTO otp_codes (email, otp_hash, salt, expires_at, created_at, is_used, attempts)
    VALUES (?, ?, ?, ?, ?, 0, 0)
    """, (cooldown_email, "somehash", "somesalt", now + 600, now - 20)) # Created 20s ago
    conn.commit()
    conn.close()

    success_cd, msg_cd = generate_and_send_otp(cooldown_email)
    assert not success_cd, "Should be rejected under 60-second cooldown"
    assert "seconds" in msg_cd.lower()
    print(f"✓ PASS: 60-second cooldown enforced: '{msg_cd}'.")

    # 6. Test Password Login with Verified Account Requirement
    user_email = f"user_{int(time.time())}@example.com"
    pwd = "MySecretPassword2026!"
    
    # Register account (creates unverified account)
    conn = get_db()
    c = conn.cursor()
    from werkzeug.security import generate_password_hash
    c.execute("""
    INSERT INTO users (email, password_hash, is_verified, domain_type, created_at)
    VALUES (?, ?, 0, 'public_webmail', ?)
    """, (user_email, generate_password_hash(pwd), now))
    conn.commit()
    conn.close()

    # Attempt to log in BEFORE verification -> MUST FAIL
    login_ok, login_msg, _ = login_with_password(user_email, pwd)
    assert not login_ok, "Unverified account must NOT be allowed to log in!"
    assert "not verified" in login_msg.lower()
    print("✓ PASS: Unverified account login correctly blocked.")

    # Now verify the user
    conn = get_db()
    c = conn.cursor()
    c.execute("UPDATE users SET is_verified = 1 WHERE email = ?", (user_email,))
    conn.commit()
    conn.close()

    # Attempt login after verification -> MUST SUCCEED
    login_ok, login_msg, user_data = login_with_password(user_email, pwd)
    assert login_ok, f"Verified user login should succeed: {login_msg}"
    assert user_data["email"] == user_email
    print("✓ PASS: Verified user email & password sign-in successful.")

    # Bad password -> MUST FAIL
    bad_login_ok, _, _ = login_with_password(user_email, "WrongPassword!")
    assert not bad_login_ok, "Bad password must be rejected!"
    print("✓ PASS: Incorrect password rejected.")

    # 7. Test Flask API Endpoint Privacy (Zero OTP Leaks)
    client = app.test_client()
    res = client.post("/api/auth/send-otp", json={"email": "api_test@example.com"})
    data = res.get_json()
    assert "code" not in data, "API must NEVER return code!"
    assert "demo_code" not in data, "API must NEVER return demo_code!"
    assert "otp" not in data, "API must NEVER return otp!"
    print("✓ PASS: API endpoints strictly leak ZERO OTP data.")

    print("\n🎉 ALL SECURE AUTHENTICATION & EMAIL OTP TESTS PASSED SUCCESSFULLY!")

if __name__ == "__main__":
    run_tests()
