from tools.domain_analysis import extract_domain, check_typosquatting

class WebsiteAgent:
    """
    Analyzes website URLs, checks for domain spoofing, TLD risk,
    and protocol encryption. Avoids claiming website appearance proves legitimacy.
    """

    def analyze(self, website: str, company_name: str = "") -> dict:
        if not website or website.lower() in ["none", "none provided", "n/a", "no"]:
            return {
                "status": "Inconclusive",
                "finding": "No official website provided.",
                "explanation": "Opportunity lacks a verifiable corporate web presence.",
                "domain": "",
                "warnings": ["No corporate website provided to confirm organizational identity."],
                "facts": []
            }

        domain = extract_domain(website)
        warnings = []
        facts = [f"Domain: {domain}"]

        # Protocol check
        if website.startswith("http://"):
            warnings.append("Website does not enforce HTTPS secure protocol.")
        elif website.startswith("https://"):
            facts.append("Enforces HTTPS encryption.")

        # TLD check
        suspicious_tlds = [".xyz", ".top", ".buzz", ".work", ".site", ".live", ".guru", ".click"]
        if any(domain.endswith(tld) for tld in suspicious_tlds):
            warnings.append(f"Domain uses a high-churn top-level domain ({domain.split('.')[-1]}), frequently utilized in temporary campaign setups.")

        # Typosquatting / Impersonation check
        if company_name:
            typo = check_typosquatting(company_name, domain)
            if typo["is_typosquat"]:
                warnings.append(typo["warning"])

        if warnings:
            status = "Warning Indicator" if len(warnings) > 1 else "Needs Verification"
            finding = "Website exhibits non-standard domain or security properties."
        else:
            status = "Low Concern"
            finding = "Website domain structure aligns with standard corporate presence."

        return {
            "status": status,
            "finding": finding,
            "explanation": warnings[0] if warnings else "Website domain structure verified.",
            "domain": domain,
            "warnings": warnings,
            "facts": facts
        }

website_agent = WebsiteAgent()
