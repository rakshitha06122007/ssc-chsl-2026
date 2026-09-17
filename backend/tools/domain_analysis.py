import re
from urllib.parse import urlparse
from data.known_patterns import FREE_EMAIL_PROVIDERS, ESTABLISHED_TECH_COMPANIES

def extract_domain(input_str: str) -> str:
    if not input_str:
        return ""
    input_str = input_str.strip().lower()
    
    # Check if it's an email
    if "@" in input_str:
        return input_str.split("@")[-1].strip()
    
    # Clean URL scheme if missing
    if not input_str.startswith(("http://", "https://")):
        input_str = "https://" + input_str
    
    try:
        parsed = urlparse(input_str)
        netloc = parsed.netloc or parsed.path
        # Strip port and www
        netloc = re.sub(r":\d+$", "", netloc)
        if netloc.startswith("www."):
            netloc = netloc[4:]
        # Extract base domain and tld (e.g., career.google.com -> google.com or career.google.co.uk)
        parts = netloc.split("/")
        return parts[0].strip()
    except Exception:
        return input_str.strip()

def classify_email_domain(email: str) -> dict:
    if not email or "@" not in email:
        return {
            "email": email or "",
            "domain": "",
            "domain_type": "Invalid or Missing Email",
            "is_free_provider": False,
            "explanation": "No valid email address was supplied for domain analysis."
        }
    
    domain = email.split("@")[-1].lower().strip()
    is_free = domain in FREE_EMAIL_PROVIDERS or any(domain.endswith("." + p) for p in FREE_EMAIL_PROVIDERS)
    
    if is_free:
        return {
            "email": email,
            "domain": domain,
            "domain_type": "Personal email provider",
            "is_free_provider": True,
            "explanation": "This does not by itself indicate fraud. Some legitimate recruiters communicate through personal email accounts, but independent verification may be useful."
        }
    else:
        return {
            "email": email,
            "domain": domain,
            "domain_type": "Company domain",
            "is_free_provider": False,
            "explanation": "The email uses a private custom domain. While a company domain provides branded identity, independent verification of the recruiter's authority is recommended."
        }

def get_base_brand(domain: str) -> str:
    cleaned = re.sub(r"\.(com|org|net|io|co|ai|in|uk|de|tech|info|xyz|app|online|site)$", "", domain)
    cleaned = re.sub(r"^(mail|recruitment|careers?|jobs?|hr|team|global|support)\.", "", cleaned)
    return cleaned

def check_domain_consistency(website: str, recruiter_email: str) -> dict:
    if not website or not recruiter_email:
        return {
            "consistent": None,
            "status": "Inconclusive",
            "explanation": "Insufficient information to correlate website domain and recruiter email domain."
        }
    
    web_dom = extract_domain(website)
    email_dom = extract_domain(recruiter_email)
    
    if not web_dom or not email_dom:
        return {
            "consistent": None,
            "status": "Inconclusive",
            "explanation": "Could not parse domain from provided inputs."
        }
        
    if web_dom == email_dom:
        return {
            "consistent": True,
            "status": "Consistent",
            "explanation": f"Recruiter email domain (@{email_dom}) directly matches the official company website domain ({web_dom})."
        }
        
    if email_dom in FREE_EMAIL_PROVIDERS:
        return {
            "consistent": False,
            "status": "Needs Verification",
            "explanation": f"The recruiter communicates from a personal email provider (@{email_dom}) rather than the company website domain (@{web_dom})."
        }
        
    # Check if subdomains or related brands
    brand_web = get_base_brand(web_dom)
    brand_email = get_base_brand(email_dom)
    
    if brand_web in email_dom or brand_email in web_dom:
        return {
            "consistent": True,
            "status": "Subdomain / Related Domain",
            "explanation": f"Recruiter domain (@{email_dom}) appears closely related to website domain ({web_dom})."
        }
        
    return {
        "consistent": False,
        "status": "Mismatch",
        "explanation": f"Recruiter email domain (@{email_dom}) does not match the company website domain ({web_dom}). Independent verification required."
    }

def check_typosquatting(claimed_company: str, domain: str) -> dict:
    claimed_clean = re.sub(r"[^a-zA-Z0-9]", "", claimed_company.lower())
    dom_clean = domain.lower()
    
    # Check known companies
    for comp_name, legit_domains in ESTABLISHED_TECH_COMPANIES.items():
        if comp_name in claimed_clean:
            if dom_clean not in legit_domains and not any(dom_clean.endswith("." + d) for d in legit_domains):
                # Check suspicious hyphenation or character replacement
                suspicious_patterns = [
                    f"{comp_name}-career", f"{comp_name}-job", f"{comp_name}-hiring",
                    f"{comp_name}-hr", f"{comp_name}recruitment", f"{comp_name}-global",
                    comp_name.replace("o", "0"), comp_name.replace("i", "1"), comp_name.replace("l", "1")
                ]
                if any(p in dom_clean for p in suspicious_patterns) or comp_name in dom_clean:
                    return {
                        "is_typosquat": True,
                        "warning": f"Domain '{domain}' mimics established company '{comp_name.capitalize()}' but is not an official domain ({', '.join(legit_domains)})."
                    }
    return {"is_typosquat": False, "warning": None}
