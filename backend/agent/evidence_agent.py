from typing import List, Dict, Any

class EvidenceAgent:
    """
    Compiles forensic findings into the Evidence Locker.
    Categorizes evidence strictly into:
    - User Provided
    - Verified Evidence
    - AI Analysis
    - Unknown
    """

    def compile_evidence(self,
                         user_inputs: Dict[str, Any],
                         company_result: Dict[str, Any],
                         recruiter_result: Dict[str, Any],
                         offer_result: Dict[str, Any],
                         website_result: Dict[str, Any]) -> List[Dict[str, Any]]:
        locker = []
        idx = 1

        # 1. Company evidence
        comp_name = user_inputs.get("company_name", "").strip()
        if comp_name:
            locker.append({
                "id": f"EV-{idx:03d}",
                "finding": f"Claimed employer: {comp_name}",
                "source": "User Provided Information",
                "category": "User Provided",
                "status": "Needs Verification",
                "explanation": "Candidate reported this entity as the hiring party."
            })
            idx += 1

        if company_result.get("data"):
            is_verified = company_result["data"].get("verified_entity", False)
            locker.append({
                "id": f"EV-{idx:03d}",
                "finding": company_result["finding"],
                "source": "Public Company Directory Lookup",
                "category": "Verified Evidence" if is_verified else "AI Analysis",
                "status": "Low Concern" if is_verified and not company_result.get("inconsistency_found") else "Needs Verification",
                "explanation": company_result["explanation"]
            })
            idx += 1

        # 2. Recruiter email evidence
        rec_email = user_inputs.get("recruiter_email", "").strip()
        if rec_email:
            domain_info = recruiter_result.get("domain_info", {})
            dom_type = domain_info.get("domain_type", "Unknown")
            is_free = domain_info.get("is_free_provider", False)
            locker.append({
                "id": f"EV-{idx:03d}",
                "finding": f"Recruiter contact: {rec_email} ({dom_type})",
                "source": "User-provided recruiter contact",
                "category": "User Provided",
                "status": "Warning Indicator" if is_free else "Low Concern",
                "explanation": domain_info.get("explanation", "Provided recruiter email.")
            })
            idx += 1

        # Recruiter consistency
        consistency = recruiter_result.get("consistency_info", {})
        if consistency.get("status") in ["Needs Verification", "Mismatch"]:
            locker.append({
                "id": f"EV-{idx:03d}",
                "finding": consistency.get("explanation", "Recruiter email domain mismatch."),
                "source": "Cross-Domain Consistency Analyzer",
                "category": "AI Analysis",
                "status": "Needs Verification",
                "explanation": "The supplied recruiter email domain does not match the company website domain provided by the user."
            })
            idx += 1

        # 3. Recruitment Channel
        channel = user_inputs.get("recruitment_channel", "").strip()
        if channel:
            is_risky = channel.lower() in ["whatsapp", "telegram", "sms"]
            locker.append({
                "id": f"EV-{idx:03d}",
                "finding": f"Recruitment conducted through {channel}",
                "source": "User Provided Information",
                "category": "User Provided",
                "status": "Warning Indicator" if is_risky else "Low Concern",
                "explanation": f"Recruiting via {channel} lacks standard corporate authentication controls." if is_risky else f"Standard recruitment interaction platform."
            })
            idx += 1

        # 4. Payment Evidence
        if offer_result.get("payment_detected"):
            p_details = offer_result.get("payment_details", {})
            amount = p_details.get("amount", "Unspecified")
            purpose = p_details.get("purpose", "Fee/Deposit")
            locker.append({
                "id": f"EV-{idx:03d}",
                "finding": f"Upfront payment requested: {amount} for {purpose}",
                "source": "Job Offer / Message Analyzer",
                "category": "Verified Evidence",
                "status": "High Concern",
                "explanation": "An upfront payment request was detected. Standard corporate employment in all jurisdictions never charges applicants for equipment, training materials, or application processing."
            })
            idx += 1

        # 5. Website Evidence
        website = user_inputs.get("website", "").strip()
        if website and website_result.get("domain"):
            locker.append({
                "id": f"EV-{idx:03d}",
                "finding": website_result["finding"],
                "source": "Domain & Protocol Verification Engine",
                "category": "AI Analysis",
                "status": website_result["status"],
                "explanation": website_result["explanation"]
            })
            idx += 1
            for ww in website_result.get("warnings", []):
                locker.append({
                    "id": f"EV-{idx:03d}",
                    "finding": ww,
                    "source": "Domain Security Analysis",
                    "category": "AI Analysis",
                    "status": "Warning Indicator",
                    "explanation": "Domain pattern requiring caution."
                })
                idx += 1
        elif not website or website.lower() in ["none", "none provided", "n/a", "no"]:
            locker.append({
                "id": f"EV-{idx:03d}",
                "finding": "No corporate website provided.",
                "source": "User-supplied inquiry inputs",
                "category": "Unknown",
                "status": "Needs Verification",
                "explanation": "Missing company web presence hinders domain-level cross verification."
            })
            idx += 1

        # 6. Additional warnings (including sensitive data requests)
        for w in offer_result.get("warnings", []):
            if "payment" not in w.lower() and "channel" not in w.lower():
                is_sensitive = "sensitive personal or financial information" in w.lower() or "bank details" in w.lower() or "ssn" in w.lower() or "card details" in w.lower()
                locker.append({
                    "id": f"EV-{idx:03d}",
                    "finding": w,
                    "source": "Offer Content Forensic Engine",
                    "category": "AI Analysis",
                    "status": "High Concern" if is_sensitive else "Warning Indicator",
                    "explanation": "Critical security credential harvesting detected." if is_sensitive else "Identified pattern in offer terms requiring independent confirmation."
                })
                idx += 1

        return locker

evidence_agent = EvidenceAgent()
