DEMO_SCENARIOS = [
    {
        "id": "hackathon-demo",
        "title": "60-Second Hackathon Demo Flow",
        "badge": "Judge Favorite (60s)",
        "description": "Rapid complete agent investigation: WFH offer with upfront equipment fee and mismatched recruiter email. Full trace in seconds.",
        "payload": {
            "company_name": "ABC Technologies",
            "job_title": "Remote Data Support Specialist",
            "recruitment_channel": "Telegram",
            "website": "https://abc-technologies.example",
            "recruiter_email": "abccompany.hr@gmail.com",
            "payment_asked": "Yes",
            "payment_purpose": "Equipment deposit",
            "payment_amount": "$150",
            "raw_message": "Congratulations! You have been selected for the Data Support role at ABC Technologies ($42/hr). You must immediately deposit $150 refundable equipment insurance to receive your Apple MacBook Pro kit via FedEx today. Offer expires in 4 hours."
        }
    },
    {
        "id": "scenario-1",
        "title": "Scenario 1: Standard Corporate Opportunity",
        "badge": "Low Concern",
        "description": "Legitimate enterprise posting with corporate domain matching, standard recruitment stages, and zero fee demands.",
        "payload": {
            "company_name": "Microsoft Corporation",
            "job_title": "Senior Cloud Solutions Architect",
            "recruitment_channel": "LinkedIn",
            "website": "https://microsoft.com",
            "recruiter_email": "recruiting-team@microsoft.com",
            "payment_asked": "No",
            "payment_purpose": "",
            "payment_amount": "",
            "raw_message": "Hello, our talent acquisition team reviewed your cloud architecture background on LinkedIn and would like to invite you for a preliminary video conversation regarding a Cloud Solutions Architect role at Microsoft."
        }
    },
    {
        "id": "scenario-2",
        "title": "Scenario 2: Upfront Payment Request",
        "badge": "High Concern (Fee)",
        "description": "Recruiter promises an exorbitant WFH rate but demands a $250 background verification deposit before scheduling an interview.",
        "payload": {
            "company_name": "Global Tech Ventures",
            "job_title": "Entry Level Operations Clerk",
            "recruitment_channel": "Email",
            "website": "https://globaltechventures.top",
            "recruiter_email": "hiring@globaltechventures.top",
            "payment_asked": "Yes",
            "payment_purpose": "Background verification fee",
            "payment_amount": "$250",
            "raw_message": "Your profile has been approved for our remote operations position at $55/hr. To finalize onboarding, transfer $250 for your mandatory third-party background screening check via Zelle or wire transfer."
        }
    },
    {
        "id": "scenario-3",
        "title": "Scenario 3: Recruiter Domain Mismatch",
        "badge": "Needs Verification",
        "description": "Company claims to be a well-known brand, but the recruiter communicates strictly through a personal Gmail address.",
        "payload": {
            "company_name": "Google LLC",
            "job_title": "Customer Experience Associate",
            "recruitment_channel": "Email",
            "website": "https://google.com",
            "recruiter_email": "google.talent.recruiting2026@gmail.com",
            "payment_asked": "No",
            "payment_purpose": "",
            "payment_amount": "",
            "raw_message": "We have an open remote customer role at Google. Submit your resume to google.talent.recruiting2026@gmail.com for expedited review."
        }
    },
    {
        "id": "scenario-4",
        "title": "Scenario 4: Insufficient Information (Negative Test)",
        "badge": "Inconclusive (Responsible AI)",
        "description": "Sparse inputs testing responsible AI behavior. Agent refuses to invent data and properly reports insufficient evidence.",
        "payload": {
            "company_name": "XYZ",
            "job_title": "WFH job",
            "recruitment_channel": "Other",
            "website": "",
            "recruiter_email": "",
            "payment_asked": "No",
            "payment_purpose": "",
            "payment_amount": "",
            "raw_message": ""
        }
    },
    {
        "id": "scenario-5",
        "title": "Scenario 5: Extreme Urgency Pressure",
        "badge": "Multiple Warning Signs",
        "description": "Unsolicited text message offering instant hiring with no interview, pressuring candidate to sign and reply within 1 hour.",
        "payload": {
            "company_name": "Apex Logistics Ltd",
            "job_title": "Package Forwarding Coordinator",
            "recruitment_channel": "WhatsApp",
            "website": "https://apexlogistics.site",
            "recruiter_email": "apexrecruiter@yahoo.com",
            "payment_asked": "No",
            "payment_purpose": "",
            "payment_amount": "",
            "raw_message": "URGENT HIRING: We have 2 slots left today only. Start immediately, no interview required, earn $4,000/month forwarding shipments from home. Confirm within 60 minutes or offer will be forfeited."
        }
    },
    {
        "id": "scenario-6",
        "title": "Scenario 6: Credential Harvesting / Suspicious Duties",
        "badge": "High Concern (Credentials)",
        "description": "Requests full Social Security Number, bank routing numbers, and direct deposit voided check before any interview or contract.",
        "payload": {
            "company_name": "Synergy Consulting Group",
            "job_title": "Administrative Assistant",
            "recruitment_channel": "Email",
            "website": "https://synergy-consulting.info",
            "recruiter_email": "hr@synergy-consulting.info",
            "payment_asked": "No",
            "payment_purpose": "",
            "payment_amount": "",
            "raw_message": "Welcome to Synergy Consulting. Please reply with your full SSN, driver's license scan, and online banking direct deposit credentials so we can initialize your payroll file prior to your initial manager phone screen."
        }
    }
]
