from datetime import datetime
from typing import Dict, Any, List

class ReportAgent:
    """
    Assembles the final Opportunity Verification Report and compiles
    the visual Agent Investigation Trace (audit log).
    """

    def compile_report(self,
                       user_inputs: Dict[str, Any],
                       evidence_locker: List[Dict[str, Any]],
                       risk_assessment: Dict[str, Any],
                       audit_trace: List[Dict[str, Any]]) -> Dict[str, Any]:

        now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        report = {
            "title": "OPPORTUNITY VERIFICATION REPORT",
            "date": now_str,
            "company": user_inputs.get("company_name", "Not Specified"),
            "job": user_inputs.get("job_title", "Not Specified"),
            "recruitment_channel": user_inputs.get("recruitment_channel", "Not Specified"),
            "website": user_inputs.get("website", "None provided"),
            "recruiter": user_inputs.get("recruiter_email", "None provided"),
            "assessment": risk_assessment["assessment"],
            "summary": risk_assessment["summary"],
            "explanation": risk_assessment["explanation"],
            "payment_detected": risk_assessment.get("payment_warning", False),
            "insufficient_evidence": risk_assessment.get("insufficient_evidence", False),
            "categories": risk_assessment["categories"],
            "evidence_locker": evidence_locker,
            "audit_trace": audit_trace,
            "safety_checklist": self._generate_safety_checklist(risk_assessment.get("payment_warning", False)),
            "disclaimer": "TrustHire AI provides verification assistance and risk indicators. It does not guarantee that an opportunity or company is legitimate or fraudulent."
        }
        return report

    def _generate_safety_checklist(self, payment_detected: bool) -> List[Dict[str, Any]]:
        base_checklist = [
            {"id": 1, "task": "Verify the company independently via official business registers or corporate directories.", "recommended": True},
            {"id": 2, "task": "Verify recruiter identity on professional networks (e.g., LinkedIn) and match corporate domain.", "recommended": True},
            {"id": 3, "task": "Confirm job requisition exists on the company's official careers portal.", "recommended": True},
            {"id": 4, "task": "Confirm corporate switchboard or general HR telephone contact.", "recommended": True},
            {"id": 5, "task": "Never share passwords, OTP codes, card CVVs, or bank logins with recruiters.", "recommended": True}
        ]
        if payment_detected:
            base_checklist.insert(0, {
                "id": 0,
                "task": "CRITICAL: Review payment demand. Do NOT transfer funds, buy gift cards, or wire money for onboarding equipment/training.",
                "recommended": True,
                "is_critical": True
            })
        return base_checklist

report_agent = ReportAgent()
