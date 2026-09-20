import os
import sys
import json
import time
from functools import wraps
from pathlib import Path
from flask import Flask, request, jsonify, send_from_directory, make_response
from flask_cors import CORS

BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE_DIR))

from app.config import (
    PORT, 
    DEMO_AUTH_MODE, 
    get_smtp_config, 
    load_dotenv,
    FRONTEND_URL,
    SESSION_COOKIE_NAME,
    SESSION_COOKIE_HTTPONLY,
    SESSION_COOKIE_SAMESITE,
    SESSION_COOKIE_SECURE,
    SESSION_LIFETIME_DAYS
)
from app.database import init_db, get_db
from app.auth import (
    generate_and_send_otp,
    verify_otp_code,
    register_account,
    login_with_password,
    request_password_reset,
    reset_password_with_otp,
    validate_session_token,
    revoke_user_session
)
from tools.domain_analysis import classify_email_domain
from agent.orchestrator import orchestrator
from agent.company_agent import company_agent
from agent.recruiter_agent import recruiter_agent
from agent.website_agent import website_agent
from tools.message_analysis import extract_message_entities
from data.demo_scenarios import DEMO_SCENARIOS
from evaluation.eval_runner import run_evaluation

# Initialize SQLite tables
init_db()

app = Flask(__name__)

# Configure CORS securely for the frontend domain with credentials support
allowed_origins = list({
    FRONTEND_URL.rstrip("/"),
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5173",
    "http://127.0.0.1:5173"
})
CORS(app, resources={r"/api/*": {"origins": allowed_origins}}, supports_credentials=True)

# ----------------- AUTHENTICATION MIDDLEWARE -----------------
def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = request.cookies.get(SESSION_COOKIE_NAME)
        user = validate_session_token(token)
        if not user:
            return jsonify({"success": False, "message": "Authentication required. Please sign in."}), 401
        request.current_user = user
        return f(*args, **kwargs)
    return decorated_function

@app.route("/api/health", methods=["GET"])
def health():
    smtp_cfg = get_smtp_config()
    smtp_ready = bool(smtp_cfg["host"] and smtp_cfg["user"] and smtp_cfg["password"])
    return jsonify({
        "status": "healthy",
        "app": "TrustHire AI Backend",
        "demo_mode": DEMO_AUTH_MODE,
        "smtp_configured": smtp_ready,
        "timestamp": time.time()
    })

# ----------------- AUTHENTICATION -----------------
@app.route("/api/auth/me", methods=["GET"])
def get_current_user():
    token = request.cookies.get(SESSION_COOKIE_NAME)
    user = validate_session_token(token)
    if not user:
        return jsonify({"authenticated": False, "user": None}), 401
    return jsonify({"authenticated": True, "user": user})

@app.route("/api/auth/register", methods=["POST"])
def register_user():
    data = request.get_json() or {}
    email = data.get("email", "")
    password = data.get("password", "")
    success, msg, code = register_account(email, password)
    if not success:
        return jsonify({"success": False, "message": msg}), 400
    resp_data = {"success": True, "message": msg}
    if code:
        resp_data["code"] = code
    return jsonify(resp_data)

@app.route("/api/auth/login", methods=["POST"])
def login_user():
    data = request.get_json() or {}
    email = data.get("email", "")
    password = data.get("password", "")
    success, msg, user_info, session_token = login_with_password(email, password, client_ip=request.remote_addr)
    if not success:
        return jsonify({"success": False, "message": msg, **user_info}), 401
    
    resp = make_response(jsonify({"success": True, "message": msg, "user": user_info}))
    if session_token:
        resp.set_cookie(
            SESSION_COOKIE_NAME,
            session_token,
            max_age=SESSION_LIFETIME_DAYS * 86400,
            httponly=SESSION_COOKIE_HTTPONLY,
            secure=SESSION_COOKIE_SECURE,
            samesite=SESSION_COOKIE_SAMESITE,
            path="/"
        )
    return resp

@app.route("/api/auth/verify-otp", methods=["POST"])
def verify_user_otp():
    data = request.get_json() or {}
    email = data.get("email", "")
    code = data.get("code") or data.get("otp") or ""
    password = data.get("password")
    success, msg, user_info, session_token = verify_otp_code(email, code, password=password)
    if not success:
        return jsonify({"success": False, "message": msg}), 400
    
    resp = make_response(jsonify({"success": True, "message": msg, "user": user_info}))
    if session_token:
        resp.set_cookie(
            SESSION_COOKIE_NAME,
            session_token,
            max_age=SESSION_LIFETIME_DAYS * 86400,
            httponly=SESSION_COOKIE_HTTPONLY,
            secure=SESSION_COOKIE_SECURE,
            samesite=SESSION_COOKIE_SAMESITE,
            path="/"
        )
    return resp

@app.route("/api/auth/send-otp", methods=["POST"])
def send_otp():
    data = request.get_json() or {}
    email = data.get("email", "")
    success, msg, code = generate_and_send_otp(email)
    if not success:
        return jsonify({"success": False, "message": msg}), 400
    resp_data = {"success": True, "message": msg}
    if code:
        resp_data["code"] = code
    return jsonify(resp_data)

@app.route("/api/auth/logout", methods=["POST"])
def logout_user():
    token = request.cookies.get(SESSION_COOKIE_NAME)
    revoke_user_session(token)
    resp = make_response(jsonify({"success": True, "message": "Logged out successfully."}))
    resp.delete_cookie(SESSION_COOKIE_NAME, path="/")
    return resp

@app.route("/api/auth/forgot-password", methods=["POST"])
def forgot_password():
    data = request.get_json() or {}
    email = data.get("email", "")
    success, msg = request_password_reset(email)
    if not success:
        return jsonify({"success": False, "message": msg}), 400
    return jsonify({"success": True, "message": msg})

@app.route("/api/auth/reset-password", methods=["POST"])
def reset_password():
    data = request.get_json() or {}
    email = data.get("email", "")
    code = data.get("code", "")
    new_password = data.get("new_password", "")
    success, msg = reset_password_with_otp(email, code, new_password)
    if not success:
        return jsonify({"success": False, "message": msg}), 400
    return jsonify({"success": True, "message": msg})

# ----------------- USER PROFILE & SETTINGS -----------------
@app.route("/api/user/profile", methods=["GET"])
@login_required
def get_user_profile():
    return jsonify({
        "success": True,
        "user": request.current_user
    })

@app.route("/api/user/settings", methods=["GET", "PUT"])
@login_required
def handle_user_settings():
    return jsonify({
        "success": True,
        "settings": {
            "theme": "dark",
            "notifications": True,
            "security_alerts": True
        }
    })

# ----------------- EMAIL DOMAIN ANALYSIS -----------------
@app.route("/api/verify/email-domain", methods=["POST"])
def analyze_email_domain():
    data = request.get_json() or {}
    email = data.get("email", "")
    res = classify_email_domain(email)
    return jsonify(res)

# ----------------- CONVERSATIONAL JOB VERIFICATION -----------------
@app.route("/api/verify/job-chat", methods=["POST"])
def job_chat_step():
    data = request.get_json() or {}
    collected = data.get("collected_data", {})
    res = orchestrator.process_chat_step(collected)
    return jsonify(res)

@app.route("/api/verify/job-full", methods=["POST"])
@login_required
def run_full_verification():
    data = request.get_json() or {}
    user_id = request.current_user["id"]
    user_email = request.current_user["email"]
    user_inputs = data.get("inputs", {})

    investigation = orchestrator.run_full_investigation(user_inputs)
    report = investigation["report"]
    locker = investigation["evidence_locker"]
    trace = investigation["audit_trace"]

    # Save record to SQLite history with user_id and user_email
    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute("""
        INSERT INTO verifications (
            user_email, user_id, company_name, job_title, recruitment_channel,
            website, recruiter_email, assessment, summary,
            payment_detected, evidence_locker_json, audit_trace_json,
            full_report_json, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            user_email,
            user_id,
            user_inputs.get("company_name", "Unknown"),
            user_inputs.get("job_title", "Unspecified"),
            user_inputs.get("recruitment_channel", ""),
            user_inputs.get("website", ""),
            user_inputs.get("recruiter_email", ""),
            investigation["assessment"],
            investigation["summary"],
            1 if investigation["payment_detected"] else 0,
            json.dumps(locker),
            json.dumps(trace),
            json.dumps(report),
            time.time()
        ))
        verif_id = cursor.lastrowid
        conn.commit()
        conn.close()
        investigation["id"] = verif_id
        if isinstance(report, dict):
            report["id"] = verif_id
    except Exception as e:
        print("[Database Save Error]", e)

    return jsonify(investigation)

# ----------------- DEDICATED ANALYZERS -----------------
@app.route("/api/verify/company", methods=["POST"])
def verify_company_endpoint():
    data = request.get_json() or {}
    company_name = data.get("company_name", "")
    website = data.get("website", "")
    recruiter_email = data.get("recruiter_email", "")
    res = company_agent.analyze(company_name, website, recruiter_email)
    return jsonify(res)

@app.route("/api/verify/recruiter", methods=["POST"])
def verify_recruiter_endpoint():
    data = request.get_json() or {}
    email = data.get("recruiter_email", "")
    company_name = data.get("company_name", "")
    website = data.get("website", "")
    res = recruiter_agent.analyze(email, company_name, website)
    return jsonify(res)

@app.route("/api/verify/website", methods=["POST"])
def verify_website_endpoint():
    data = request.get_json() or {}
    website = data.get("website", "")
    company_name = data.get("company_name", "")
    res = website_agent.analyze(website, company_name)
    return jsonify(res)

@app.route("/api/verify/message", methods=["POST"])
def verify_message_endpoint():
    data = request.get_json() or {}
    message_text = data.get("message_text", "")
    res = extract_message_entities(message_text)
    return jsonify(res)

# ----------------- HISTORY & STATS (USER-SCOPED) -----------------
@app.route("/api/history", methods=["GET"])
@login_required
def get_history():
    user_id = request.current_user["id"]
    user_email = request.current_user["email"]

    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
    SELECT id, user_email, company_name, job_title, assessment,
           summary, payment_detected, created_at, full_report_json
    FROM verifications 
    WHERE user_id = ? OR user_email = ?
    ORDER BY created_at DESC LIMIT 50
    """, (user_id, user_email))
    rows = cursor.fetchall()
    
    # Calculate statistics isolated to this user
    cursor.execute("""
    SELECT COUNT(*) as total FROM verifications 
    WHERE user_id = ? OR user_email = ?
    """, (user_id, user_email))
    total_verifs = cursor.fetchone()["total"]

    cursor.execute("""
    SELECT COUNT(*) as needs_verif FROM verifications 
    WHERE (user_id = ? OR user_email = ?) 
      AND assessment IN ('NEEDS VERIFICATION', 'MULTIPLE WARNING SIGNS')
    """, (user_id, user_email))
    needs_verif = cursor.fetchone()["needs_verif"]

    cursor.execute("""
    SELECT COUNT(*) as high_concern FROM verifications 
    WHERE (user_id = ? OR user_email = ?) 
      AND assessment = 'HIGH CONCERN'
    """, (user_id, user_email))
    high_concern = cursor.fetchone()["high_concern"]

    conn.close()

    history_items = []
    for r in rows:
        history_items.append({
            "id": r["id"],
            "user_email": r["user_email"],
            "company_name": r["company_name"],
            "job_title": r["job_title"],
            "assessment": r["assessment"],
            "summary": r["summary"],
            "payment_detected": bool(r["payment_detected"]),
            "created_at": time.strftime("%Y-%m-%d %H:%M", time.localtime(r["created_at"])) if r["created_at"] else "Recently",
            "report": json.loads(r["full_report_json"]) if r["full_report_json"] else None
        })

    return jsonify({
        "stats": {
            "verifications_completed": total_verifs,
            "needs_verification": needs_verif,
            "high_concern_cases": high_concern,
            "saved_reports": len(history_items)
        },
        "history": history_items
    })

@app.route("/api/history/<int:item_id>", methods=["DELETE"])
@login_required
def delete_history_item(item_id):
    user_id = request.current_user["id"]
    user_email = request.current_user["email"]

    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
    DELETE FROM verifications 
    WHERE id = ? AND (user_id = ? OR user_email = ?)
    """, (item_id, user_id, user_email))
    deleted_count = cursor.rowcount
    conn.commit()
    conn.close()

    if deleted_count == 0:
        return jsonify({"success": False, "message": "Verification record not found or unauthorized."}), 404

    return jsonify({"success": True, "message": "Verification record removed."})

# ----------------- DEMO SCENARIOS -----------------
@app.route("/api/demo/scenarios", methods=["GET"])
def get_demo_scenarios():
    return jsonify(DEMO_SCENARIOS)

# ----------------- EVALUATION SUITE -----------------
@app.route("/api/evaluation/run", methods=["GET", "POST"])
def run_eval_endpoint():
    eval_res = run_evaluation()
    return jsonify(eval_res)

DIST_DIR = BASE_DIR.parent / "frontend" / "dist"

# ----------------- FRONTEND STATIC & SPA ROUTING -----------------
@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve_frontend(path):
    if path.startswith("api/"):
        return jsonify({"error": "API endpoint not found"}), 404
    if path and (DIST_DIR / path).exists():
        return send_from_directory(DIST_DIR, path)
    if (DIST_DIR / "index.html").exists():
        return send_from_directory(DIST_DIR, "index.html")
    return jsonify({"error": "Frontend build not found"}), 404

if __name__ == "__main__":
    print(f"TrustHire AI Agent Server starting on port {PORT}...")
    app.run(host="0.0.0.0", port=PORT, debug=False)
