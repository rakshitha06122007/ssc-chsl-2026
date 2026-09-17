FREE_EMAIL_PROVIDERS = {
    "gmail.com", "googlemail.com", "yahoo.com", "yahoo.co.in", "yahoo.co.uk",
    "hotmail.com", "outlook.com", "live.com", "msn.com",
    "proton.me", "protonmail.com", "icloud.com", "me.com",
    "mail.ru", "yandex.com", "yandex.ru", "aol.com", "zoho.com",
    "gmx.com", "gmx.net", "tutanota.com", "fastmail.com"
}

SUSPICIOUS_PAYMENT_REASONS = [
    "registration", "registration fee",
    "training", "training kit", "training fee",
    "security deposit", "refundable deposit",
    "equipment", "home office equipment", "laptop security", "macbook deposit",
    "background verification", "background check fee", "id card fee",
    "onboarding software", "software license fee", "visa processing",
    "courier charge", "delivery fee"
]

RISKY_CHANNELS = {
    "telegram": {
        "risk_level": "Elevated Caution",
        "description": "Scammers frequently use Telegram for anonymous hiring chats without enterprise traceability."
    },
    "whatsapp": {
        "risk_level": "Elevated Caution",
        "description": "Direct WhatsApp unsolicited outreach is a common vehicle for impersonation and task-scams."
    },
    "sms": {
        "risk_level": "Elevated Caution",
        "description": "Unsolicited SMS hiring texts usually lack verifiable company origins."
    }
}

ESTABLISHED_TECH_COMPANIES = {
    "google": ["google.com", "alphabet.com"],
    "microsoft": ["microsoft.com"],
    "amazon": ["amazon.com", "amazon.jobs"],
    "apple": ["apple.com"],
    "meta": ["meta.com", "facebook.com"],
    "netflix": ["netflix.com"],
    "salesforce": ["salesforce.com"],
    "adobe": ["adobe.com"],
    "ibm": ["ibm.com"],
    "infosys": ["infosys.com"],
    "tcs": ["tcs.com", "tataconsultancy.com"],
    "wipro": ["wipro.com"],
    "accenture": ["accenture.com"]
}

SENSITIVE_PATTERNS = [
    r"\b\d{4}[ -]?\d{4}[ -]?\d{4}[ -]?\d{4}\b", # Credit card
    r"\b\d{3}-\d{2}-\d{4}\b",                    # SSN
    r"\b(cvv|cvc|pin|otp)\b",                    # Credentials
    r"\b(bank account|routing number)\b",        # Banking
]
