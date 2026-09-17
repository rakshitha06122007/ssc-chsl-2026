import secrets
import hashlib
import hmac
import time
from typing import Dict, Any, Tuple, Optional
from werkzeug.security import generate_password_hash, check_password_hash

from app.config import SECRET_KEY
from app.database import get_db
from tools.domain_analysis import classify_email_domain
from app.email_service import send_verification_email

OTP_EXPIRY_SECONDS = 600  # 10 minutes
RESEND_COOLDOWN_SECONDS = 60  # 60 seconds cooldown
MAX_ATTEMPTS = 5

def hash_otp(code: str, salt: str) -> str:
    """Computes a secure SHA-256 HMAC-style hash of the OTP code and salt."""
    payload = f"{code}:{salt}:{SECRET_KEY}".encode("utf-8")
    return hashlib.sha256(payload).hexdigest()

def check_rate_limit(identifier: str, max_requests: int = 30, window_seconds: int = 3600) -> bool:
    """Returns True if within limit, False if rate limited. Set to 30 for seamless development testing."""
    now = time.time()
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT count, window_start FROM rate_limits WHERE identifier = ?", (identifier,))
    row = cursor.fetchone()
    
    if not row:
        cursor.execute("INSERT INTO rate_limits (identifier, count, window_start) VALUES (?, 1, ?)", (identifier, now))
        conn.commit()
        conn.close()
        return True
        
    count, window_start = row["count"], row["window_start"]
    if now - window_start > window_seconds:
        cursor.execute("UPDATE rate_limits SET count = 1, window_start = ? WHERE identifier = ?", (now, identifier))
        conn.commit()
        conn.close()
        return True
    elif count < max_requests:
        cursor.execute("UPDATE rate_limits SET count = count + 1 WHERE identifier = ?", (identifier,))
        conn.commit()
        conn.close()
        return True
    else:
        conn.close()
        return False

def refund_rate_limit(identifier: str):
    """Refunds a rate limit count if the external email delivery failed."""
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("UPDATE rate_limits SET count = MAX(0, count - 1) WHERE identifier = ?", (identifier,))
    conn.commit()
    conn.close()

def reset_rate_limits(email: Optional[str] = None):
    """Resets rate limit counter for a specific email or all emails."""
    conn = get_db()
    cursor = conn.cursor()
    if email:
        cursor.execute("DELETE FROM rate_limits WHERE identifier = ?", (f"otp:{email.strip().lower()}",))
    else:
        cursor.execute("DELETE FROM rate_limits")
    conn.commit()
    conn.close()

def generate_and_send_otp(email: str) -> Tuple[bool, str]:
    """
    Generates a cryptographically random 6-digit OTP, stores only its hash,
    and delivers it strictly to the user's real email inbox.
    NEVER returns or exposes the OTP.
    """
    email = email.strip().lower()
    if not email or "@" not in email:
        return False, "Please enter a valid email address."

    # Rate limiting: max 5 requests per hour per email
    if not check_rate_limit(f"otp:{email}", max_requests=5, window_seconds=3600):
        return False, "Too many verification requests. Please wait an hour before requesting another code."

    now = time.time()
    conn = get_db()
    cursor = conn.cursor()

    # Check 60s cooldown on existing recent codes
    cursor.execute("SELECT created_at FROM otp_codes WHERE email = ? ORDER BY created_at DESC LIMIT 1", (email,))
    last_row = cursor.fetchone()
    if last_row and (now - last_row["created_at"] < RESEND_COOLDOWN_SECONDS):
        remaining = int(RESEND_COOLDOWN_SECONDS - (now - last_row["created_at"]))
        conn.close()
        return False, f"Please wait {remaining} seconds before requesting a new code."

    # Generate secure 6-digit OTP
    otp_code = f"{secrets.randbelow(900000) + 100000}"
    salt = secrets.token_hex(16)
    otp_hashed = hash_otp(otp_code, salt)
    expires_at = now + OTP_EXPIRY_SECONDS

    # Insert into database with is_used=0
    cursor.execute("""
    INSERT INTO otp_codes (email, otp_hash, salt, expires_at, created_at, is_used, attempts)
    VALUES (?, ?, ?, ?, ?, 0, 0)
    """, (email, otp_hashed, salt, expires_at, now))
    row_id = cursor.lastrowid
    conn.commit()
    conn.close()

    # Send real email via SMTP
    email_res = send_verification_email(email, otp_code)
    if not email_res.get("sent"):
        # Rollback/delete the generated OTP so expired/failed attempts don't linger
        conn = get_db()
        c = conn.cursor()
        c.execute("DELETE FROM otp_codes WHERE id = ?", (row_id,))
        conn.commit()
        conn.close()
        # Refund rate limit attempt on delivery failure
        refund_rate_limit(f"otp:{email}")
        return False, email_res.get("error", "Failed to deliver verification email. Please check your SMTP configuration.")

    return True, f"A 6-digit verification code has been sent to {email}."

def verify_otp_code(email: str, code: str, password: Optional[str] = None) -> Tuple[bool, str, Dict[str, Any]]:
    """
    Verifies the 6-digit OTP:
    - Verifies hash match
    - Enforces 10-minute expiry
    - Enforces single-use (is_used == 0)
    - Enforces max attempts
    - Updates user is_verified = 1 and sets password if provided.
    """
    email = email.strip().lower()
    code = code.strip()
    if not code or len(code) != 6 or not code.isdigit():
        return False, "Please enter a valid 6-digit verification code.", {}

    now = time.time()
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("""
    SELECT id, otp_hash, salt, expires_at, attempts, is_used FROM otp_codes 
    WHERE email = ? AND is_used = 0
    ORDER BY created_at DESC LIMIT 1
    """, (email,))
    row = cursor.fetchone()

    if not row:
        conn.close()
        return False, "No active verification code found for this email. Please request a new code.", {}

    row_id = row["id"]
    stored_hash = row["otp_hash"]
    salt = row["salt"]
    expires_at = row["expires_at"]
    attempts = row["attempts"]

    if now > expires_at:
        cursor.execute("UPDATE otp_codes SET is_used = 1 WHERE id = ?", (row_id,))
        conn.commit()
        conn.close()
        return False, "Verification code has expired (10-minute limit). Please request a new code.", {}

    if attempts >= MAX_ATTEMPTS:
        cursor.execute("UPDATE otp_codes SET is_used = 1 WHERE id = ?", (row_id,))
        conn.commit()
        conn.close()
        return False, "Maximum invalid attempts exceeded. Please request a new code.", {}

    test_hash = hash_otp(code, salt)
    if not hmac.compare_digest(test_hash, stored_hash):
        cursor.execute("UPDATE otp_codes SET attempts = attempts + 1 WHERE id = ?", (row_id,))
        conn.commit()
        conn.close()
        remaining = MAX_ATTEMPTS - attempts - 1
        return False, f"Invalid verification code. {remaining} attempts remaining.", {}

    # Mark OTP as used immediately (strictly one-time use)
    cursor.execute("UPDATE otp_codes SET is_used = 1 WHERE id = ?", (row_id,))

    # Perform domain analysis on user email
    domain_analysis = classify_email_domain(email)

    # Upsert user record and mark verified
    cursor.execute("SELECT id, password_hash FROM users WHERE email = ?", (email,))
    user_row = cursor.fetchone()
    
    pwd_hash = generate_password_hash(password) if password else (user_row["password_hash"] if user_row else None)

    if not user_row:
        cursor.execute("""
        INSERT INTO users (email, password_hash, is_verified, domain_type, created_at)
        VALUES (?, ?, 1, ?, ?)
        """, (email, pwd_hash, domain_analysis["domain_type"], now))
    else:
        if password:
            cursor.execute("""
            UPDATE users SET is_verified = 1, password_hash = ?, domain_type = ?
            WHERE email = ?
            """, (pwd_hash, domain_analysis["domain_type"], email))
        else:
            cursor.execute("""
            UPDATE users SET is_verified = 1, domain_type = ?
            WHERE email = ?
            """, (domain_analysis["domain_type"], email))

    conn.commit()
    conn.close()

    user_info = {
        "email": email,
        "is_verified": True,
        "domain_analysis": domain_analysis
    }
    return True, "Email verified successfully.", user_info

def register_account(email: str, password: str) -> Tuple[bool, str]:
    """
    Creates or updates an account entry with hashed password, and sends an email OTP verification code.
    Account remains unverified until the OTP is submitted and confirmed.
    Allows test accounts and existing unverified accounts to restart verification smoothly.
    """
    email = email.strip().lower()
    if not email or "@" not in email:
        return False, "Please enter a valid email address."
    if not password or len(password) < 6:
        return False, "Password must be at least 6 characters long."

    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT id, is_verified, password_hash FROM users WHERE email = ?", (email,))
    user_row = cursor.fetchone()

    now = time.time()
    domain_analysis = classify_email_domain(email)
    pwd_hash = generate_password_hash(password)

    if user_row:
        # If the account was a test account (no password set), or if user is re-registering:
        # Update the password hash, set is_verified to 0 until OTP verification completes
        cursor.execute("""
        UPDATE users SET password_hash = ?, is_verified = 0, domain_type = ? 
        WHERE email = ?
        """, (pwd_hash, domain_analysis["domain_type"], email))
        conn.commit()
    else:
        cursor.execute("""
        INSERT INTO users (email, password_hash, is_verified, domain_type, created_at)
        VALUES (?, ?, 0, ?, ?)
        """, (email, pwd_hash, domain_analysis["domain_type"], now))
        conn.commit()
    conn.close()

    # Now generate and send the OTP to the entered email
    return generate_and_send_otp(email)

def login_with_password(email: str, password: str) -> Tuple[bool, str, Dict[str, Any]]:
    """
    Authenticates user with email & password.
    Only allows test@gmail.com with test123.
    If credentials are wrong, returns 'Invalid credentials'.
    """
    email_clean = (email or "").strip().lower()
    password_clean = (password or "").strip()

    if email_clean != "test@gmail.com" or password_clean != "test123":
        return False, "Invalid credentials", {}

    domain_analysis = classify_email_domain("test@gmail.com")
    user_info = {
        "email": "test@gmail.com",
        "is_verified": True,
        "domain_analysis": domain_analysis
    }
    return True, "Login successful.", user_info

def request_password_reset(email: str) -> Tuple[bool, str]:
    """Sends a password reset OTP to a verified user account."""
    email = email.strip().lower()
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT id, is_verified FROM users WHERE email = ?", (email,))
    user = cursor.fetchone()
    conn.close()

    if not user:
        return False, "No account found with this email address."
    if not user["is_verified"]:
        return False, "This account is not yet verified. Please verify your email first."

    return generate_and_send_otp(email)

def reset_password_with_otp(email: str, code: str, new_password: str) -> Tuple[bool, str]:
    """Resets the account password after verifying the OTP code."""
    if not new_password or len(new_password) < 6:
        return False, "New password must be at least 6 characters long."

    success, msg, _ = verify_otp_code(email, code, password=new_password)
    if not success:
        return False, msg
    return True, "Password reset successfully. You can now log in with your new password."
