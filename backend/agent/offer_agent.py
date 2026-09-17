from tools.message_analysis import extract_message_entities
from data.known_patterns import RISKY_CHANNELS

class OfferAgent:
    """
    Evaluates job offer details, channel risk, salary claims,
    urgency tactics, and upfront payment or data extortion indicators.
    """

    def analyze(self, job_title: str, channel: str = "", raw_message: str = "", payment_asked: str = "No", payment_purpose: str = "", payment_amount: str = "") -> dict:
        channel_lower = (channel or "").lower()
        extracted = extract_message_entities(raw_message) if raw_message else {}
        warnings = []
        facts = []
        payment_detected = False
        payment_details = {}

        # 1. Channel Analysis
        for rc_key, rc_info in RISKY_CHANNELS.items():
            if rc_key in channel_lower:
                warnings.append(f"Channel '{channel}': {rc_info['description']}")
                break
        if not warnings and channel:
            facts.append(f"Recruitment initiated through {channel}.")

        # 2. Payment Analysis
        msg_payment = extracted.get("payment_info", {})
        if payment_asked in ["Yes", "yes", True] or msg_payment.get("payment_detected"):
            payment_detected = True
            amount = payment_amount or msg_payment.get("amount") or "Unspecified"
            purpose = payment_purpose or ", ".join(msg_payment.get("reasons", [])) or "Equipment / Processing Fee"
            payment_details = {
                "detected": True,
                "amount": amount,
                "purpose": purpose,
                "warning": "Legitimate employers never charge candidates for job application, onboarding equipment, or background checks."
            }
            warnings.append(f"Upfront payment request detected for '{purpose}' ({amount}).")

        # 3. Urgency Analysis
        urgency = extracted.get("urgency_info", {})
        if urgency.get("is_urgent"):
            warnings.append(urgency.get("explanation"))

        # 4. Sensitive Data Analysis
        sensitive = extracted.get("sensitive_info", {})
        if sensitive.get("sensitive_data_requested"):
            warnings.append(sensitive.get("explanation"))

        # Status determination
        if payment_detected or sensitive.get("sensitive_data_requested"):
            status = "High Concern"
            finding = "Upfront payment or sensitive credentials requested."
        elif warnings:
            status = "Warning Indicator" if len(warnings) > 1 else "Needs Verification"
            finding = "Job offer exhibits non-standard recruitment indicators."
        else:
            status = "Low Concern"
            finding = "Offer description exhibits standard professional communication patterns."

        return {
            "status": status,
            "finding": finding,
            "explanation": warnings[0] if warnings else "Standard job offer specifications.",
            "payment_detected": payment_detected,
            "payment_details": payment_details,
            "extracted_entities": extracted,
            "warnings": warnings,
            "facts": facts
        }

offer_agent = OfferAgent()
