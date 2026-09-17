from typing import Dict, Any, List

class QuestionAgent:
    """
    Evaluates current state of gathered opportunity data,
    determines information completeness, and dynamically generates the
    next most relevant question without overwhelming the user with a giant form.
    """

    def evaluate_and_get_next(self, collected_data: Dict[str, Any]) -> Dict[str, Any]:
        company = collected_data.get("company_name", "").strip()
        position = collected_data.get("job_title", "").strip()
        channel = collected_data.get("recruitment_channel", "").strip()
        website = collected_data.get("website", "").strip()
        recruiter_email = collected_data.get("recruiter_email", "").strip()
        payment_asked = collected_data.get("payment_asked") # None, "Yes", "No", "Not sure"
        payment_purpose = collected_data.get("payment_purpose", "").strip()
        payment_amount = collected_data.get("payment_amount", "").strip()
        raw_message = collected_data.get("raw_message", "").strip()

        # Step 1: Company Name
        if not company:
            return {
                "step": "company_name",
                "question": "Let's investigate this opportunity. What is the company name?",
                "field": "company_name",
                "input_type": "text",
                "placeholder": "e.g., ABC Technologies, Google, InnovateCorp",
                "options": [],
                "completeness_score": 10,
                "can_investigate_now": False
            }

        # Step 2: Position
        if not position:
            return {
                "step": "job_title",
                "question": f"What position or job title were you offered at {company}?",
                "field": "job_title",
                "input_type": "text",
                "placeholder": "e.g., Remote Data Entry Specialist, Customer Support Associate",
                "options": [],
                "completeness_score": 25,
                "can_investigate_now": False
            }

        # Step 3: Recruitment Channel
        if not channel:
            return {
                "step": "recruitment_channel",
                "question": "How did the recruiter or hiring team initially contact you?",
                "field": "recruitment_channel",
                "input_type": "select",
                "placeholder": "Select recruitment channel",
                "options": ["Email", "WhatsApp", "Telegram", "LinkedIn", "Job Portal (Indeed/ZipRecruiter)", "Phone / SMS", "Other"],
                "completeness_score": 40,
                "can_investigate_now": False
            }

        # Step 4: Company Website
        if not website and not collected_data.get("website_skipped"):
            return {
                "step": "website",
                "question": "What official company website or job posting URL did they provide?",
                "field": "website",
                "input_type": "text",
                "placeholder": "e.g., https://abctechnologies.com or 'None provided'",
                "options": ["None provided", "Not sure yet"],
                "can_skip": True,
                "completeness_score": 55,
                "can_investigate_now": False
            }

        # Step 5: Recruiter Email
        if not recruiter_email and not collected_data.get("recruiter_email_skipped"):
            return {
                "step": "recruiter_email",
                "question": "What is the recruiter's email address or sender handle?",
                "field": "recruiter_email",
                "input_type": "text",
                "placeholder": "e.g., recruiter@company.com or abccompany@gmail.com",
                "options": ["Not provided", "Communicating only via chat"],
                "can_skip": True,
                "completeness_score": 70,
                "can_investigate_now": False
            }

        # Step 6: Payment question
        if payment_asked is None:
            return {
                "step": "payment_asked",
                "question": "Did they ask you to pay any money or deposit at any point?",
                "field": "payment_asked",
                "input_type": "select",
                "placeholder": "Select an answer",
                "options": ["Yes", "No", "Not sure"],
                "completeness_score": 80,
                "can_investigate_now": False
            }

        # Step 6b: If payment is YES, inquire about purpose
        if payment_asked == "Yes" and not payment_purpose:
            return {
                "step": "payment_purpose",
                "question": "What was the payment supposedly for?",
                "field": "payment_purpose",
                "input_type": "select",
                "placeholder": "Select purpose",
                "options": ["Registration", "Training", "Security deposit", "Equipment", "Background verification", "Other"],
                "completeness_score": 85,
                "can_investigate_now": False
            }

        # Step 6c: If payment is YES, inquire about amount
        if payment_asked == "Yes" and not payment_amount:
            return {
                "step": "payment_amount",
                "question": "How much money or cryptocurrency were you asked to pay or deposit?",
                "field": "payment_amount",
                "input_type": "text",
                "placeholder": "e.g., $150 or ₹5,000 or 100 USDT",
                "options": [],
                "completeness_score": 90,
                "can_investigate_now": False
            }

        # Step 7: Offer / Message text
        if not raw_message and not collected_data.get("message_skipped"):
            return {
                "step": "raw_message",
                "question": "Do you have the original job message, offer letter, or chat text? You can paste it here to let the agent extract additional forensic evidence.",
                "field": "raw_message",
                "input_type": "textarea",
                "placeholder": "Paste the email or chat offer text here...",
                "options": [],
                "can_skip": True,
                "completeness_score": 95,
                "can_investigate_now": True
            }

        # Sufficient information collected
        return {
            "step": "complete",
            "question": "We have sufficient information to execute the full verification investigation.",
            "field": None,
            "input_type": "none",
            "options": [],
            "completeness_score": 100,
            "can_investigate_now": True
        }

question_agent = QuestionAgent()
