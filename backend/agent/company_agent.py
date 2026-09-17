from tools.company_lookup import lookup_company
from tools.domain_analysis import extract_domain

class CompanyAgent:
    """
    Analyzes company identity, checks against public registers,
    and identifies inconsistencies with user-supplied websites or emails.
    """

    def analyze(self, company_name: str, website: str = "", recruiter_email: str = "") -> dict:
        if not company_name or len(company_name.strip()) < 2:
            return {
                "status": "Inconclusive",
                "finding": "Company name is missing or insufficient.",
                "explanation": "Cannot perform identity verification without a valid corporate or organization name.",
                "verified_entity": False,
                "inconsistency_found": False
            }

        lookup = lookup_company(company_name)
        web_domain = extract_domain(website) if website else ""
        inconsistencies = []

        if lookup["found"]:
            info = lookup["data"]
            official_domains = info.get("domains", [])
            
            # Check if user-provided website contradicts official domain
            if web_domain and not any(web_domain == od or web_domain.endswith("." + od) for od in official_domains):
                inconsistencies.append(
                    f"Supplied website domain '{web_domain}' does not match recognized official domains for {info['official_name']} ({', '.join(official_domains)})."
                )

            # Check recruiter email domain against website / official domain
            target_dom = web_domain or (official_domains[0] if official_domains else "")
            if recruiter_email and target_dom:
                rec_dom = extract_domain(recruiter_email)
                if rec_dom and rec_dom != target_dom:
                    inconsistencies.append(
                        f"The recruiter email domain (@{rec_dom}) does not match the supplied company website domain (@{target_dom})."
                    )

            return {
                "status": "Verified Public Entity" if not inconsistencies else "Needs Verification",
                "finding": f"Matches registered entity: {info['official_name']}." if not inconsistencies else (inconsistencies[0] if len(inconsistencies) == 1 else "Claimed public brand with mismatched website domain."),
                "explanation": inconsistencies[0] if inconsistencies else f"Entity is registered. Standard protocol: {info.get('standard_hiring_process')}",
                "data": info,
                "inconsistency_found": len(inconsistencies) > 0,
                "inconsistencies": inconsistencies
            }
        else:
            # Check recruiter email domain against website for unlisted companies
            if recruiter_email and web_domain:
                rec_dom = extract_domain(recruiter_email)
                if rec_dom and rec_dom != web_domain:
                    inconsistencies.append(
                        f"The recruiter email domain (@{rec_dom}) does not match the supplied company website domain (@{web_domain})."
                    )

            # Responsible AI: State that entity is unlisted or independent, not automatically fake
            return {
                "status": "Needs Verification",
                "finding": inconsistencies[0] if inconsistencies else "Unlisted or private organization.",
                "explanation": inconsistencies[0] if inconsistencies else f"'{company_name}' was not located in high-cap enterprise directories. This is normal for startups or local businesses, but independent verification of business registry records is recommended.",
                "data": lookup.get("data"),
                "inconsistency_found": len(inconsistencies) > 0,
                "inconsistencies": inconsistencies
            }

company_agent = CompanyAgent()
