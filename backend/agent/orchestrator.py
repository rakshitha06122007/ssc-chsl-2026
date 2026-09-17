from typing import Dict, Any, List
from agent.question_agent import question_agent
from agent.company_agent import company_agent
from agent.recruiter_agent import recruiter_agent
from agent.offer_agent import offer_agent
from agent.website_agent import website_agent
from agent.evidence_agent import evidence_agent
from agent.risk_agent import risk_agent
from agent.report_agent import report_agent
from tools.message_analysis import extract_message_entities

class VerificationOrchestrator:
    """
    Master Orchestration Engine for TrustHire AI.
    Executes the multi-step agentic lifecycle:
    ASK -> COLLECT -> INVESTIGATE -> ANALYZE -> DECIDE -> EXPLAIN -> LOG
    """

    def process_chat_step(self, collected_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Handles the conversational single-question progression.
        """
        # If user provided a raw message, auto-extract entities to populate missing fields
        raw_msg = collected_data.get("raw_message", "").strip()
        if raw_msg and (not collected_data.get("company_name") or not collected_data.get("job_title")):
            extracted = extract_message_entities(raw_msg)
            if not collected_data.get("company_name") and extracted.get("extracted_company"):
                collected_data["company_name"] = extracted["extracted_company"]
            if not collected_data.get("job_title") and extracted.get("extracted_position"):
                collected_data["job_title"] = extracted["extracted_position"]
            if not collected_data.get("recruitment_channel") and extracted.get("channel"):
                collected_data["recruitment_channel"] = extracted["channel"]

        next_step_info = question_agent.evaluate_and_get_next(collected_data)
        return {
            "status": "in_progress" if next_step_info["step"] != "complete" else "ready",
            "question_info": next_step_info,
            "collected_data": collected_data
        }

    def run_full_investigation(self, user_inputs: Dict[str, Any]) -> Dict[str, Any]:
        """
        Executes the agentic pipeline, compiles evidence locker, computes assessment,
        and records the audit trace.
        """
        audit_trace = []

        # 1. LOG: Information Collection
        comp = user_inputs.get("company_name", "").strip()
        pos = user_inputs.get("job_title", "").strip()
        channel = user_inputs.get("recruitment_channel", "Direct").strip()
        web = user_inputs.get("website", "").strip()
        rec = user_inputs.get("recruiter_email", "").strip()
        msg = user_inputs.get("raw_message", "").strip()
        p_asked = user_inputs.get("payment_asked", "No")
        p_purpose = user_inputs.get("payment_purpose", "")
        p_amt = user_inputs.get("payment_amount", "")

        audit_trace.append({
            "step": 1,
            "action": "Collected opportunity parameters",
            "result": f"Gathered entity target '{comp or 'Unknown'}', role '{pos or 'Unspecified'}', and channel '{channel}'.",
            "next_decision": "Perform information completeness check."
        })

        # 2. LOG: Information Completeness Check
        is_sparse = not (web or rec or msg or (channel and channel.lower() not in ["other", ""]))
        audit_trace.append({
            "step": 2,
            "action": "Checked information completeness",
            "result": "Low forensic coverage (minimal inputs)" if is_sparse else "Sufficient multi-point artifacts available for cross-domain investigation.",
            "next_decision": "Dispatch specialized agents to examine offer text, recruiter contact, and corporate registration."
        })

        # 3. ANALYZE: Offer & Compensation
        offer_res = offer_agent.analyze(
            job_title=pos,
            channel=channel,
            raw_message=msg,
            payment_asked=p_asked,
            payment_purpose=p_purpose,
            payment_amount=p_amt
        )
        audit_trace.append({
            "step": 3,
            "action": "Analyzed job offer & payment cues",
            "result": f"Payment flag: {offer_res['payment_detected']}. Found {len(offer_res['warnings'])} offer-level warning indicators.",
            "next_decision": "Execute domain and recruiter mailbox analysis."
        })

        # 4. ANALYZE: Recruiter Contact
        recruiter_res = recruiter_agent.analyze(
            recruiter_email=rec,
            company_name=comp,
            website=web
        )
        audit_trace.append({
            "step": 4,
            "action": "Analyzed recruiter domain & consistency",
            "result": recruiter_res["finding"],
            "next_decision": "Cross-reference claimed company identity with public registries."
        })

        # 5. INVESTIGATE: Company Identity
        company_res = company_agent.analyze(
            company_name=comp,
            website=web,
            recruiter_email=rec
        )
        audit_trace.append({
            "step": 5,
            "action": "Compared company identity against public records",
            "result": company_res["finding"],
            "next_decision": "Inspect website security headers and domain structure."
        })

        # 6. INVESTIGATE: Website & Domain
        website_res = website_agent.analyze(
            website=web,
            company_name=comp
        )
        audit_trace.append({
            "step": 6,
            "action": "Inspected website domain structure",
            "result": website_res["finding"],
            "next_decision": "Identify cross-domain inconsistencies and assemble Evidence Locker."
        })

        # 7. DECIDE: Synthesize Evidence Locker
        locker = evidence_agent.compile_evidence(
            user_inputs=user_inputs,
            company_result=company_res,
            recruiter_result=recruiter_res,
            offer_result=offer_res,
            website_result=website_res
        )
        audit_trace.append({
            "step": 7,
            "action": "Identified cross-domain inconsistencies & assembled Evidence Locker",
            "result": f"Assembled {len(locker)} catalogued evidence findings across 4 standardized classifications.",
            "next_decision": "Execute multi-dimensional risk analysis."
        })

        # 8. EXPLAIN & ASSESS: Risk Assessment
        risk_res = risk_agent.evaluate(
            user_inputs=user_inputs,
            evidence_locker=locker,
            company_result=company_res,
            recruiter_result=recruiter_res,
            offer_result=offer_res,
            website_result=website_res
        )
        audit_trace.append({
            "step": 8,
            "action": "Computed balanced risk assessment",
            "result": f"Assessment: {risk_res['assessment']}. (Zero speculative claims, evidence-grounded).",
            "next_decision": "Generate final Opportunity Verification Report & safety checklist."
        })

        # 9. LOG: Final Report Formulation
        final_report = report_agent.compile_report(
            user_inputs=user_inputs,
            evidence_locker=locker,
            risk_assessment=risk_res,
            audit_trace=audit_trace
        )

        return {
            "report": final_report,
            "evidence_locker": locker,
            "audit_trace": audit_trace,
            "assessment": risk_res["assessment"],
            "summary": risk_res["summary"],
            "payment_detected": risk_res.get("payment_warning", False),
            "insufficient_evidence": risk_res.get("insufficient_evidence", False)
        }

orchestrator = VerificationOrchestrator()
