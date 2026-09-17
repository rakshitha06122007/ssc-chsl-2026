import re

KNOWN_ENTERPRISES = {
    "google": {
        "official_name": "Google LLC / Alphabet Inc.",
        "domains": ["google.com", "careers.google.com"],
        "hq": "Mountain View, CA, USA",
        "industry": "Technology / Cloud / Search",
        "verified_entity": True,
        "standard_hiring_process": "Conducts multi-stage technical and behavioral interviews. Google never requests payments for equipment or training from job candidates."
    },
    "microsoft": {
        "official_name": "Microsoft Corporation",
        "domains": ["microsoft.com", "careers.microsoft.com"],
        "hq": "Redmond, WA, USA",
        "industry": "Technology / Cloud / Software",
        "verified_entity": True,
        "standard_hiring_process": "Uses formal applicant tracking systems via microsoft.com email addresses. Never asks candidates to purchase their own equipment with reimbursement checks."
    },
    "amazon": {
        "official_name": "Amazon.com, Inc.",
        "domains": ["amazon.com", "amazon.jobs"],
        "hq": "Seattle, WA, USA",
        "industry": "E-Commerce / Cloud Computing",
        "verified_entity": True,
        "standard_hiring_process": "Official communications come strictly from @amazon.com or @amazon.jobs."
    },
    "meta": {
        "official_name": "Meta Platforms, Inc.",
        "domains": ["meta.com", "metacareers.com"],
        "hq": "Menlo Park, CA, USA",
        "industry": "Social Media / AI / VR",
        "verified_entity": True,
        "standard_hiring_process": "Uses metacareers.com and verified recruiters."
    },
    "apple": {
        "official_name": "Apple Inc.",
        "domains": ["apple.com", "jobs.apple.com"],
        "hq": "Cupertino, CA, USA",
        "industry": "Consumer Electronics / Software",
        "verified_entity": True,
        "standard_hiring_process": "Never communicates official hiring via Telegram or personal emails."
    },
    "netflix": {
        "official_name": "Netflix, Inc.",
        "domains": ["netflix.com", "jobs.netflix.com"],
        "hq": "Los Gatos, CA, USA",
        "industry": "Entertainment / Streaming",
        "verified_entity": True,
        "standard_hiring_process": "Official hiring conducted via jobs.netflix.com."
    },
    "infosys": {
        "official_name": "Infosys Limited",
        "domains": ["infosys.com", "career.infosys.com"],
        "hq": "Bengaluru, India",
        "industry": "IT Services & Consulting",
        "verified_entity": True,
        "standard_hiring_process": "Does not charge registration fees or security deposits for interviews."
    },
    "tcs": {
        "official_name": "Tata Consultancy Services Limited",
        "domains": ["tcs.com", "tcsion.com"],
        "hq": "Mumbai, India",
        "industry": "IT Services & Consulting",
        "verified_entity": True,
        "standard_hiring_process": "Does not conduct recruitment solely over WhatsApp or demand security money."
    },
    "abc technologies": {
        "official_name": "ABC Technologies Inc.",
        "domains": ["abc-technologies.example", "abctechnologies.com"],
        "hq": "Toronto, Canada",
        "industry": "Automotive / Manufacturing & Software",
        "verified_entity": True,
        "standard_hiring_process": "Direct communications through corporate domain."
    },
    "accenture": {
        "official_name": "Accenture plc",
        "domains": ["accenture.com"],
        "hq": "Dublin, Ireland",
        "industry": "Information Technology & Consulting",
        "verified_entity": True,
        "standard_hiring_process": "Conducts all recruitment communications via verified @accenture.com emails."
    }
}

def lookup_company(name: str) -> dict:
    if not name or not name.strip():
        return {
            "found": False,
            "status": "Inconclusive",
            "message": "No company name provided.",
            "data": None
        }
        
    clean_name = name.strip().lower()
    clean_key = re.sub(r"[^a-zA-Z0-9\s]", "", clean_name)
    
    # Direct or partial match
    for key, info in KNOWN_ENTERPRISES.items():
        if key in clean_key or clean_key in key:
            return {
                "found": True,
                "status": "Recognized Public Enterprise",
                "message": f"Identified matched public entity: {info['official_name']}.",
                "data": info
            }
            
    # For small/medium/unlisted businesses: handle realistically without fabricating
    # Responsible AI: State that entity is not in top public registry, needs manual verification
    return {
        "found": False,
        "status": "Independent or Unlisted Organization",
        "message": f"Company '{name}' is not in the curated high-cap registry. This is common for startups, private firms, or localized agencies. Independent verification of registration records (e.g. state/provincial filings) is recommended.",
        "data": {
            "official_name": name,
            "domains": [],
            "hq": "Location verification required",
            "industry": "General Business",
            "verified_entity": False,
            "standard_hiring_process": "Verify business registration on official state/national registry."
        }
    }
