from typing import Dict, Any, List

class RiskAgent:
    """
    Evaluates evidence across all dimensions to assign an objective risk assessment.
    Core Rule: Never claim '100% Genuine' or '100% Scam'.
    Assessments:
    - LOW CONCERN
    - NEEDS VERIFICATION
    - MULTIPLE WARNING SIGNS
    - HIGH CONCERN
    - INCONCLUSIVE
    """

    def evaluate(self,
                 user_inputs: Dict[str, Any],
                 evidence_locker: List[Dict[str, Any]],
                 company_result: Dict[str, Any],
                 recruiter_result: Dict[str, Any],
                 offer_result: Dict[str, Any],
                 website_result: Dict[str, Any]) -> Dict[str, Any]:

        comp_name = (user_inputs.get("company_name") or "").strip()
        job_title = (user_inputs.get("job_title") or "").strip()
        website = (user_inputs.get("website") or "").strip()
        rec_email = (user_inputs.get("recruiter_email") or "").strip()
        raw_msg = (user_inputs.get("raw_message") or "").strip()
        channel = (user_inputs.get("recruitment_channel") or "").strip()
        payment_detected = offer_result.get("payment_detected", False)

        # 1. Negative Test / Uncertainty Check (Insufficient Evidence)
        # If user only enters company and title without website, recruiter email, or message
        has_secondary_info = bool(website or rec_email or raw_msg or (channel and channel.lower() not in ["other", ""]))
        if (not has_secondary_info) or (len(comp_name) < 4 and len(job_title) < 5 and not website and not rec_email):
            return {
                "assessment": "INCONCLUSIVE",
                "summary": "Insufficient evidence provided to verify this opportunity.",
                "explanation": "TrustHire AI refuses to guess or invent company information without supporting verification data. Please provide the company's website, recruiter contact, or original job message so the agent can continue.",
                "payment_warning": False,
                "categories": self._build_categories(
                    "Inconclusive", "Inconclusive", "Unknown", "Inconclusive",
                    "Not Detected", "Unknown", "Inconclusive", "Insufficient Data"
                ),
                "insufficient_evidence": True
            }

        # Count warning indicators and high concerns
        high_concerns = [e for e in evidence_locker if e["status"] == "High Concern"]
        warning_signs = [e for e in evidence_locker if e["status"] == "Warning Indicator"]
        
        has_typosquat = any("mimics established company" in e["finding"].lower() for e in evidence_locker)
        has_urgency = any("urgency" in e["finding"].lower() or "expires" in e["finding"].lower() for e in evidence_locker)
        has_risky_channel = any("whatsapp" in e["finding"].lower() or "telegram" in e["finding"].lower() for e in evidence_locker)
        has_mismatch = recruiter_result.get("inconsistency_found", False)

        # 2. Risk Classification Decision Matrix
        if payment_detected or len(high_concerns) > 0:
            assessment = "HIGH CONCERN"
            summary = "High concern detected due to upfront payment demand or sensitive credential harvesting."
            explanation = "An upfront payment request or critical credential demand was detected. Legitimate corporate employers do not ask candidates to pay for equipment, software licenses, or training."
        elif has_typosquat or (has_urgency and (has_risky_channel or has_mismatch)) or (has_risky_channel and len(warning_signs) >= 2):
            assessment = "MULTIPLE WARNING SIGNS"
            summary = "Multiple elevated risk indicators identified across recruiter domain, channel, or pacing."
            explanation = "Investigation revealed compounding discrepancies such as off-domain recruiter communication, anonymous chat recruiting, or spoofed domains requiring heightened caution."
        elif has_mismatch or len(warning_signs) >= 1:
            assessment = "NEEDS VERIFICATION"
            summary = "Information requires independent corroboration before sharing personal data."
            explanation = "Key details (such as a personal email provider or unlisted corporate registry) should be confirmed directly with the company's verified HR team before proceeding."
        else:
            assessment = "LOW CONCERN"
            summary = "Opportunity displays characteristics consistent with standard recruitment practices."
            explanation = "Identified corporate domain alignment and standard hiring communications. As a best practice, verify the job requisition on the company's official careers portal."

        # Category status synthesis
        cat_company = company_result.get("status", "Needs Verification")
        cat_website = website_result.get("status", "Needs Verification")
        cat_recruiter = recruiter_result.get("status", "Needs Verification")
        cat_offer = offer_result.get("status", "Low Concern")
        cat_payment = "High Concern (Fee Requested)" if payment_detected else "Low Concern (No Upfront Fees)"
        cat_channel = "Warning Indicator" if channel.lower() in ["whatsapp", "telegram", "sms"] else "Low Concern"
        cat_consistency = "Needs Verification" if recruiter_result.get("inconsistency_found") or company_result.get("inconsistency_found") else "Low Concern"
        cat_evidence = "Strong" if len(evidence_locker) >= 4 else "Moderate"

        categories = self._build_categories(
            cat_company, cat_website, cat_recruiter, cat_offer,
            cat_payment, cat_channel, cat_consistency, cat_evidence
        )

        return {
            "assessment": assessment,
            "summary": summary,
            "explanation": explanation,
            "payment_warning": payment_detected,
            "categories": categories,
            "insufficient_evidence": False
        }

    def _build_categories(self, company, website, recruiter, offer, payment, channel, consistency, quality) -> Dict[str, Any]:
        return {
            "company_identity": {
                "name": "Company Identity",
                "status": company,
                "finding": "Registry & Entity Matching",
                "explanation": "Evaluates corporate registration and existence in public business directories."
            },
            "website": {
                "name": "Website & Domain",
                "status": website,
                "finding": "Domain Security & Authenticity",
                "explanation": "Evaluates domain syntax, security protocol, and top-level domain credibility."
            },
            "recruiter": {
                "name": "Recruiter Contact",
                "status": recruiter,
                "finding": "Email & Domain Ownership",
                "explanation": "Distinguishes between verified corporate domains and free/personal mailboxes."
            },
            "job_offer": {
                "name": "Job Offer Terms",
                "status": offer,
                "finding": "Role & Compensation Plausibility",
                "explanation": "Reviews compensation claims, work arrangements, and scope of responsibilities."
            },
            "payment_request": {
                "name": "Payment Request",
                "status": payment,
                "finding": "Upfront Financial Demand Check",
                "explanation": "Checks for equipment deposits, training fees, background check charges, or crypto."
            },
            "communication": {
                "name": "Communication Channel",
                "status": channel,
                "finding": "Channel Traceability",
                "explanation": "Flags anonymous or ephemeral platforms lacking institutional security."
            },
            "consistency": {
                "name": "Information Consistency",
                "status": consistency,
                "finding": "Cross-Artifact Alignment",
                "explanation": "Ensures recruiter email matches website and company corporate identity."
            },
            "evidence_quality": {
                "name": "Evidence Quality",
                "status": quality,
                "finding": "Forensic Data Completeness",
                "explanation": "Measures depth and reliability of user-provided and extracted artifacts."
            }
        }

risk_agent = RiskAgent()
