import os
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from app.config import get_smtp_config

def send_verification_email(to_email: str, otp_code: str) -> dict:
    """
    Sends a real 6-digit OTP verification email via SMTP.
    Supports Gmail, Outlook, Amazon SES, SendGrid, Resend, or custom SMTP servers.
    Never logs or leaks the OTP code to client responses or insecure logs.
    """
    cfg = get_smtp_config()
    host = cfg["host"]
    port = cfg["port"]
    user = cfg["user"]
    password = cfg["password"]
    from_addr = cfg["from_addr"] or user or "TrustHire AI <no-reply@trusthire.ai>"
    use_tls = cfg["use_tls"]

    if not host or not user or not password:
        print(f"[Email Service] SMTP configuration missing. host='{host}', user='{user}'")
        return {
            "sent": False,
            "error": "SMTP credentials not configured in backend environment (.env). Please configure SMTP_USER and SMTP_PASSWORD."
        }

    print(f"[Email Service] Connecting to {host}:{port} via TLS to send verification email to {to_email} (from {user})...")
    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = f"{otp_code} is your TrustHire AI verification code"
        msg["From"] = from_addr
        msg["To"] = to_email

        # Plain-text alternative
        plain_text = f"""Hello,

Your TrustHire AI verification code is: {otp_code}

This code expires in 10 minutes. Please enter this code on the website to verify your email address.

Security notice: TrustHire AI will never ask you for your password or verification code. Never share this code with anyone.

TrustHire AI Security Team
Verify Before You Trust. Verify Before You Pay.
"""

        # Branded HTML version
        html_text = f"""<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #090d16; color: #ffffff; padding: 24px; margin: 0; }}
    .card {{ max-width: 520px; margin: 0 auto; background-color: #0d1322; border: 1px solid #1e293b; border-radius: 16px; padding: 32px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }}
    .logo-container {{ text-align: center; margin-bottom: 20px; }}
    .logo {{ display: inline-block; background: linear-gradient(135deg, #00f2fe 0%, #4facfe 100%); width: 48px; height: 48px; border-radius: 12px; line-height: 48px; text-align: center; font-size: 24px; color: #000; font-weight: bold; }}
    .title {{ font-size: 22px; font-weight: 800; color: #ffffff; margin-bottom: 8px; text-align: center; }}
    .subtitle {{ font-size: 13px; color: #94a3b8; line-height: 1.6; margin-bottom: 24px; text-align: center; }}
    .code-box {{ background-color: #090d16; border: 2px dashed #00f2fe; border-radius: 12px; padding: 20px; text-align: center; margin: 24px 0; }}
    .code {{ font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace; font-size: 38px; font-weight: 900; letter-spacing: 10px; color: #00f2fe; }}
    .expiry {{ font-size: 12px; color: #64748b; margin-top: 10px; }}
    .safety-card {{ background-color: rgba(6, 182, 212, 0.08); border-left: 4px solid #06b6d4; padding: 12px 16px; border-radius: 6px; font-size: 12px; color: #a5f3fc; margin-top: 24px; line-height: 1.5; }}
    .footer {{ font-size: 11px; color: #64748b; margin-top: 24px; border-top: 1px solid #1e293b; padding-top: 16px; text-align: center; line-height: 1.5; }}
  </style>
</head>
<body>
  <div class="card">
    <div class="logo-container">
      <div class="logo">🛡️</div>
    </div>
    <div class="title">Verify Your Email Address</div>
    <div class="subtitle">Enter the 6-digit verification code below in TrustHire AI to confirm your account:</div>

    <div class="code-box">
      <div class="code">{otp_code}</div>
      <div class="expiry">Valid for 10 minutes &bull; One-time use only</div>
    </div>

    <div class="safety-card">
      <strong>TrustHire Safety Principle:</strong> Legitimate employers and verification platforms will never ask you to pay upfront fees for equipment, software, or background checks.
    </div>

    <div class="footer">
      TrustHire AI &bull; Verify Before You Trust. Verify Before You Pay.<br>
      If you did not request this verification code, you can safely ignore this email.
    </div>
  </div>
</body>
</html>
"""

        msg.attach(MIMEText(plain_text, "plain"))
        msg.attach(MIMEText(html_text, "html"))

        # Connect to SMTP Server with 4s timeout
        if port == 465:
            server = smtplib.SMTP_SSL(host, port, timeout=4)
        else:
            server = smtplib.SMTP(host, port, timeout=4)
            if use_tls:
                server.starttls()

        server.login(user, password)
        server.send_message(msg)
        server.quit()

        print(f"[Email Service] SUCCESS: Verification email dispatched successfully to {to_email}!")
        return {
            "sent": True,
            "error": None,
            "message": f"Verification code sent to {to_email}."
        }
    except smtplib.SMTPAuthenticationError as e:
        print(f"[Email Service ERROR] Google SMTP Authentication Failed (535 Bad Credentials). Regular password was rejected. User: {user}")
        return {
            "sent": False,
            "error": "Google rejected the login (Bad Credentials). Google does NOT accept regular passwords for SMTP. You must use a 16-character Google 'App Password'. Create one at https://myaccount.google.com/apppasswords and paste it as SMTP_PASSWORD."
        }
    except Exception as e:
        error_msg = str(e)
        print(f"[Email Service ERROR] SMTP delivery failed to {to_email}: {error_msg}")
        return {
            "sent": False,
            "error": f"Email delivery failed: {error_msg}"
        }
