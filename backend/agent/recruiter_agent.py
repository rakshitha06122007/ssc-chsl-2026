from tools.domain_analysis import classify_email_domain, check_domain_consistency, check_typosquatting

class RecruiterAgent:
    """
    Analyzes recruiter email, domain reputation, typosquatting flags,
    and cross-checks consistency with the claimed employer website.
    """

    def analyze(self, recruiter_email: str, company_name: str = "", website: str = "") -> dict:
        if not recruiter_email or len(recruiter_email.strip()) < 3:
            return {
                "status": "Unknown",
                "finding": "No recruiter email address provided.",
                "explanation": "Could not analyze recruiter domain. Inquiries conducted strictly through direct messaging or anonymous channels require higher caution.",
                "is_personal": False,
                "inconsistency_found": False,
                "facts": [],
                "warnings": [],
                "unknowns": ["Recruiter identity unverified"],
                "ai_analysis": "Without an official email address, candidate should verify the recruiter's identity on professional platforms like LinkedIn."
            }

        domain_info = classify_email_domain(recruiter_email)
        facts = [f"Recruiter Email: {recruiter_email}", f"Domain Type: {domain_info['domain_type']}"]
        warnings = []
        unknowns = []
        inconsistency = False

        # Domain type check
        if domain_info["is_free_provider"]:
            warnings.append("Recruiter communicates via a free/personal email service (e.g., @gmail, @yahoo). Legitimate enterprises typically contact via company-owned domain.")
        else:
            facts.append(f"Custom private domain in use (@{domain_info['domain']})")

        # Typosquatting check
        typo = check_typosquatting(company_name, domain_info["domain"])
        if typo["is_typosquat"]:
            warnings.append(typo["warning"])
            inconsistency = True

        # Consistency with company website
        consistency_info = check_domain_consistency(website, recruiter_email)
        if consistency_info["consistent"] is False:
            warnings.append(consistency_info["explanation"])
            inconsistency = True
        elif consistency_info["consistent"] is True:
            facts.append("Recruiter email domain directly matches company website domain.")

        # Determine overall recruiter status
        if warnings:
            status = "Warning Indicator" if len(warnings) > 1 or typo["is_typosquat"] else "Needs Verification"
            finding = "Recruiter email domain differs from corporate website." if consistency_info["consistent"] is False else "Personal email provider used."
        else:
            status = "Low Concern"
            finding = "Recruiter uses an authentic domain aligned with company identity."

        return {
            "status": status,
            "finding": finding,
            "explanation": warnings[0] if warnings else domain_info["explanation"],
            "domain_info": domain_info,
            "consistency_info": consistency_info,
            "is_personal": domain_info["is_free_provider"],
            "inconsistency_found": inconsistency,
            "facts": facts,
            "warnings": warnings,
            "unknowns": unknowns,
            "ai_analysis": "While some legitimate recruiters or agencies use personal email addresses or third-party domains, candidate should independently cross-reference the recruiter's identity on company directories."
        }

recruiter_agent = RecruiterAgent()
