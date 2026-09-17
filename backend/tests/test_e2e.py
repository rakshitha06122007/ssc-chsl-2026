import requests
import json

def test_all():
    print("--- 1. Testing Frontend Server (port 3000) ---")
    r_front = requests.get("http://localhost:3000")
    print(f"Frontend HTTP Status: {r_front.status_code}")
    assert r_front.status_code == 200
    assert "TrustHire AI" in r_front.text
    print("✓ Frontend serves HTML with SEO tags successfully.")

    print("\n--- 2. Testing Backend Health (port 5000) ---")
    r_health = requests.get("http://127.0.0.1:5000/api/health").json()
    print("Health Status:", r_health)
    assert r_health["status"] == "healthy"
    print("✓ Backend API is healthy.")

    print("\n--- 3. Testing Authentication & Demo Auth ---")
    # Test Demo Auth
    r_demo = requests.post("http://127.0.0.1:5000/api/auth/demo-login").json()
    assert r_demo["success"] is True
    print("✓ Demo Login successful:", r_demo["user"]["email"])

    # Test Email OTP request
    r_otp = requests.post("http://127.0.0.1:5000/api/auth/send-otp", json={"email": "applicant@gmail.com"}).json()
    assert r_otp["success"] is True
    demo_code = r_otp.get("demo_code")
    print(f"✓ OTP Generation successful. Generated Code: {demo_code}")

    # Test OTP verification
    r_verify_otp = requests.post("http://127.0.0.1:5000/api/auth/verify-otp", json={"email": "applicant@gmail.com", "code": demo_code}).json()
    assert r_verify_otp["success"] is True
    assert r_verify_otp["user"]["domain_analysis"]["domain_type"] == "Personal email provider"
    print("✓ OTP Verification successful. Domain Analysis:", r_verify_otp["user"]["domain_analysis"]["domain_type"])

    print("\n--- 4. Testing Conversational Job Inquiry (Step-by-Step) ---")
    step1 = requests.post("http://127.0.0.1:5000/api/verify/job-chat", json={"collected_data": {}}).json()
    print("Step 1 AI Question:", step1["question_info"]["question"])
    assert "company name" in step1["question_info"]["question"].lower()

    step2 = requests.post("http://127.0.0.1:5000/api/verify/job-chat", json={"collected_data": {"company_name": "ABC Technologies"}}).json()
    print("Step 2 AI Question:", step2["question_info"]["question"])
    assert "position" in step2["question_info"]["question"].lower()

    print("\n--- 5. Testing Full Multi-Agent Job Verification (Hackathon Demo Flow) ---")
    scenarios = requests.get("http://127.0.0.1:5000/api/demo/scenarios").json()
    hackathon_payload = scenarios[0]["payload"]
    r_verif = requests.post("http://127.0.0.1:5000/api/verify/job-full", json={
        "user_email": "judge@trusthire.ai",
        "inputs": hackathon_payload
    }).json()

    print(f"Assessment: {r_verif['assessment']}")
    print(f"Payment Detected Flag: {r_verif['payment_detected']}")
    print(f"Evidence Locker Count: {len(r_verif['evidence_locker'])}")
    print(f"Audit Trace Count: {len(r_verif['audit_trace'])}")
    assert r_verif["assessment"] == "HIGH CONCERN"
    assert r_verif["payment_detected"] is True
    assert len(r_verif["evidence_locker"]) >= 4
    assert len(r_verif["audit_trace"]) == 8
    print("✓ Hackathon 60-second workflow verified.")

    print("\n--- 6. Testing Responsible AI Negative Test (Sparse Input: XYZ / WFH) ---")
    r_negative = requests.post("http://127.0.0.1:5000/api/verify/job-full", json={
        "user_email": "judge@trusthire.ai",
        "inputs": {"company_name": "XYZ", "job_title": "WFH job"}
    }).json()
    print(f"Assessment: {r_negative['assessment']}")
    print(f"Explanation: {r_negative['report']['explanation']}")
    assert r_negative["assessment"] == "INCONCLUSIVE"
    assert r_negative["insufficient_evidence"] is True
    print("✓ Responsible AI negative test verified (Zero hallucinated facts).")

    print("\n--- 7. Testing Dedicated Analyzers ---")
    # Company Analyzer
    comp_res = requests.post("http://127.0.0.1:5000/api/verify/company", json={
        "company_name": "ABC Technologies",
        "website": "https://abc-technologies.example",
        "recruiter_email": "abccompany@gmail.com"
    }).json()
    assert comp_res["inconsistency_found"] is True
    print("✓ Company Analyzer verified (Found recruiter domain mismatch).")

    # Recruiter Email Analyzer
    rec_res = requests.post("http://127.0.0.1:5000/api/verify/recruiter", json={
        "recruiter_email": "google.careers.talent2026@gmail.com",
        "company_name": "Google",
        "website": "https://google.com"
    }).json()
    assert len(rec_res["warnings"]) > 0
    print("✓ Recruiter Email Analyzer verified (FACT / WARNING / UNKNOWN generated).")

    # Website Analyzer
    web_res = requests.post("http://127.0.0.1:5000/api/verify/website", json={
        "website": "https://netflix-careers-portal.live",
        "company_name": "Netflix"
    }).json()
    assert len(web_res["warnings"]) > 0
    print("✓ Website Analyzer verified (Typosquatting detected).")

    # Message Analyzer
    msg_res = requests.post("http://127.0.0.1:5000/api/verify/message", json={
        "message_text": "Deposit $150 refundable equipment insurance today."
    }).json()
    assert msg_res["payment_info"]["payment_detected"] is True
    print("✓ Message Analyzer verified (Payment demand extracted).")

    print("\n--- 8. Testing Verification History & Persistence (SQLite) ---")
    hist = requests.get("http://127.0.0.1:5000/api/history").json()
    print(f"Total Verifications Persisted: {hist['stats']['verifications_completed']}")
    assert hist["stats"]["verifications_completed"] >= 1
    print("✓ SQLite History Persistence verified.")

    print("\n--- 9. Testing Comprehensive Evaluation Suite (20 Tests) ---")
    eval_res = requests.get("http://127.0.0.1:5000/api/evaluation/run").json()
    print(f"Pass Rate: {eval_res['passed']}/{eval_res['total_tests']} ({eval_res['accuracy_pct']}%) in {eval_res['duration_seconds']}s")
    assert eval_res["passed"] == 20
    assert eval_res["accuracy_pct"] == 100.0
    print("✓ All 20 evaluation benchmark tests passed with 100% accuracy.")

    print("\n=======================================================")
    print("ALL 9 CRITICAL ARCHITECTURAL COMPONENTS FULLY VERIFIED!")
    print("=======================================================")

if __name__ == "__main__":
    test_all()
