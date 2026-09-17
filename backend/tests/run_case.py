import requests
import json

payload = {
    "company_name": "ABC Technologies",
    "job_title": "Work From Home Data Entry",
    "recruitment_channel": "Email",
    "website": "https://abc-technologies.example",
    "recruiter_email": "recruiter@gmail.com",
    "payment_asked": "Yes",
    "payment_purpose": "Registration fee",
    "payment_amount": "₹2,999",
    "raw_message": "ABC Technologies is hiring for Work From Home Data Entry. You must pay a one-time ₹2,999 registration fee to complete onboarding."
}

res = requests.post("http://127.0.0.1:5000/api/verify/job-full", json={
    "user_email": "candidate@trusthire.ai",
    "inputs": payload
}).json()

print("ASSESSMENT:", res["assessment"])
print("SUMMARY:", res["summary"])
print("PAYMENT_DETECTED:", res["payment_detected"])
print("\nEVIDENCE LOCKER:")
for item in res["evidence_locker"]:
    print(f"- [{item['status']}] ({item['category']}) {item['finding']}: {item['explanation']}")

print("\nAUDIT TRACE:")
for step in res["audit_trace"]:
    print(f"Step {step['step']}: {step['action']} -> {step['result']} (Next: {step['next_decision']})")
