import re
from data.known_patterns import SUSPICIOUS_PAYMENT_REASONS, SENSITIVE_PATTERNS

def extract_salary(text: str) -> str:
    patterns = [
        r"(\$\s?[\d,]+(?:\.\d+)?(?:\s?-\s?\$\s?[\d,]+)?(?:\s?(?:per|\/)\s?(?:hr|hour|day|week|month|year|yr|annum))?)",
        r"(₹\s?[\d,]+(?:\s?-\s?₹\s?[\d,]+)?(?:\s?(?:per|\/)\s?(?:month|year|lpa))?)",
        r"(£\s?[\d,]+(?:\s?-\s?£\s?[\d,]+)?)",
        r"(\b[\d,]+\s?USD|\b[\d,]+\s?EUR|\b[\d,]+\s?INR)",
        r"(\b\d{1,2}\s?LPA\b)"
    ]
    for p in patterns:
        m = re.search(p, text, re.IGNORECASE)
        if m:
            return m.group(1).strip()
    return "Not explicitly specified"

def detect_payment_requests(text: str) -> dict:
    text_lower = text.lower()
    detected = False
    reasons = []
    amount_found = None
    
    # Exclude payroll direct deposit phrases
    cleaned_for_payment = re.sub(r"\bdirect\s+deposit\b", "payroll_deposit", text_lower)

    # Check suspicious payment keywords
    for r in SUSPICIOUS_PAYMENT_REASONS:
        if r in cleaned_for_payment:
            detected = True
            reasons.append(r)
            
    # Check payment verbs/terms
    payment_cues = ["pay", "wire", "refundable deposit", "security deposit", "registration charge", "send money", "crypto", "usdt", "gift card", "transfer money"]
    for cue in payment_cues:
        if re.search(r"\b" + re.escape(cue) + r"\b", cleaned_for_payment):
            detected = True
            if cue not in reasons:
                reasons.append(cue)
                
    # Search for dollar/currency amount associated with payment
    amount_match = re.search(r"(?:pay|deposit|fee|charge|cost|amount\s*of)\s*[:\$₹£€]?\s*(\d[\d,]*(?:\.\d{2})?)\s*(?:usd|dollars|inr|in rupees|usdt|refundable)?", cleaned_for_payment)
    if amount_match:
        amount_found = amount_match.group(1)
        detected = True

    return {
        "payment_detected": detected,
        "reasons": list(set(reasons)),
        "amount": amount_found or ("Unspecified amount" if detected else None),
        "explanation": f"Detected payment or financial deposit cues: {', '.join(reasons)}" if detected else "No upfront fee or payment request detected."
    }

def detect_urgency(text: str) -> dict:
    urgency_patterns = [
        r"\b(immediately|urgent|today only|within \d+ hours?|instant hire|no interview needed|asap|limited slots|offer expires today)\b"
    ]
    found = []
    for pat in urgency_patterns:
        matches = re.findall(pat, text, re.IGNORECASE)
        if matches:
            found.extend(matches)
            
    is_urgent = len(found) > 0
    return {
        "is_urgent": is_urgent,
        "cues": list(set(found)),
        "explanation": f"High urgency language detected ({', '.join(set(found))}). Rushing applicants to accept offers without standard interview stages is a recognized risk indicator." if is_urgent else "Standard communication pacing."
    }

def detect_sensitive_data_requests(text: str) -> dict:
    found = []
    text_lower = text.lower()
    
    triggers = [
        ("bank details", ["bank account", "routing number", "direct deposit form with voided check"]),
        ("card details", ["credit card", "debit card", "cvv", "card number"]),
        ("government credentials", ["ssn", "social security", "national id", "passport copy before interview", "pan card"]),
        ("security credentials", ["otp", "verification code", "pin", "password"])
    ]
    
    for category, terms in triggers:
        for t in terms:
            if t in text_lower:
                found.append(f"{category} ('{t}')")
                
    return {
        "sensitive_data_requested": len(found) > 0,
        "items": found,
        "explanation": f"Warning: Message requests sensitive personal or financial information: {', '.join(found)}." if found else "No premature sensitive data requests detected."
    }

def extract_message_entities(text: str) -> dict:
    if not text:
        return {}
        
    salary = extract_salary(text)
    payment_info = detect_payment_requests(text)
    urgency_info = detect_urgency(text)
    sensitive_info = detect_sensitive_data_requests(text)
    
    # Try to find company name
    comp_match = re.search(r"(?:at|with|from|joining)\s+([A-Z][A-Za-z0-9\s&]{2,30}?)(?:\s+(?:is hiring|team|Inc|LLC|Ltd|Technologies|Corporation|\.|\n|,))", text)
    company_candidate = comp_match.group(1).strip() if comp_match else None
    
    # Try to find position
    pos_match = re.search(r"(?:role of|position of|hiring for|as an?|job title:?)\s+([A-Za-z\s]{3,35}?)(?:\.|\n|,|at|with|salary|\$)", text, re.IGNORECASE)
    position_candidate = pos_match.group(1).strip() if pos_match else None
    
    # Channel detection
    channel = "Direct / Email"
    text_lower = text.lower()
    if "telegram" in text_lower or "t.me/" in text_lower:
        channel = "Telegram"
    elif "whatsapp" in text_lower or "wa.me/" in text_lower:
        channel = "WhatsApp"
    elif "linkedin" in text_lower:
        channel = "LinkedIn"
        
    return {
        "extracted_company": company_candidate,
        "extracted_position": position_candidate,
        "salary": salary,
        "channel": channel,
        "payment_info": payment_info,
        "urgency_info": urgency_info,
        "sensitive_info": sensitive_info,
        "raw_length": len(text)
    }
