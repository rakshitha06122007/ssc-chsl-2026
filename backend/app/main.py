import os
import sys
import json
import time
from pathlib import Path
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS

BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE_DIR))

from app.config import PORT, DEMO_AUTH_MODE, get_smtp_config, load_dotenv
from app.database import init_db, get_db
from app.auth import (
    generate_and_send_otp,
    verify_otp_code,
    register_account,
    login_with_password,
    request_password_reset,
    reset_password_with_otp,
    reset_rate_limits
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
CORS(app, resources={r"/api/*": {"origins": "*"}})

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
@app.route("/api/auth/send-otp", methods=["POST"])
def send_otp():
    data = request.get_json() or {}
    email = data.get("email", "")
    success, msg = generate_and_send_otp(email)
    if not success:
        return jsonify({"success": False, "message": msg}), 400
    return jsonify({"success": True, "message": msg})

@app.route("/api/auth/verify-otp", methods=["POST"])
def verify_user_otp():
    data = request.get_json() or {}
    email = data.get("email", "")
    code = data.get("code", "")
    password = data.get("password")
    success, msg, user_info = verify_otp_code(email, code, password=password)
    if not success:
        return jsonify({"success": False, "message": msg}), 400
    return jsonify({"success": True, "message": msg, "user": user_info})

@app.route("/api/auth/register", methods=["POST"])
def register_user():
    data = request.get_json() or {}
    email = data.get("email", "")
    password = data.get("password", "")
    success, msg = register_account(email, password)
    if not success:
        return jsonify({"success": False, "message": msg}), 400
    return jsonify({"success": True, "message": msg})

@app.route("/api/auth/login", methods=["POST"])
def login_user():
    data = request.get_json() or {}
    email = data.get("email", "")
    password = data.get("password", "")
    success, msg, user_info = login_with_password(email, password)
    if not success:
        return jsonify({"success": False, "message": msg}), 401
    return jsonify({"success": True, "message": msg, "user": user_info})

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

@app.route("/api/auth/reset-rate-limit", methods=["POST"])
def reset_rate_limit_endpoint():
    data = request.get_json() or {}
    email = data.get("email")
    reset_rate_limits(email)
    return jsonify({"success": True, "message": "Rate limits reset successfully."})

@app.route("/api/auth/smtp-config", methods=["GET", "POST"])
def smtp_configuration():
    if request.method == "GET":
        cfg = get_smtp_config()
        return jsonify({
            "configured": bool(cfg["host"] and cfg["user"] and cfg["password"]),
            "host": cfg["host"],
            "port": cfg["port"],
            "user": cfg["user"],
            "from_addr": cfg["from_addr"],
            "use_tls": cfg["use_tls"]
        })
    
    # POST to update SMTP configuration in .env
    data = request.get_json() or {}
    host = data.get("host", "").strip()
    port = str(data.get("port", 587)).strip()
    user = data.get("user", "").strip()
    password = data.get("password", "").strip()
    from_addr = data.get("from_addr", "").strip() or user
    use_tls = "true" if data.get("use_tls", True) else "false"

    if not host or not user or not password:
        return jsonify({"success": False, "message": "Host, user email, and password are required."}), 400

    env_path = BASE_DIR / ".env"
    env_content = f"""# TrustHire AI SMTP Configuration
SMTP_HOST={host}
SMTP_PORT={port}
SMTP_USER={user}
SMTP_PASSWORD={password}
SMTP_FROM={from_addr}
SMTP_USE_TLS={use_tls}
DEMO_AUTH_MODE=false
"""
    try:
        with open(env_path, "w", encoding="utf-8") as f:
            f.write(env_content)
        load_dotenv()
        return jsonify({"success": True, "message": "SMTP configuration saved. Verification emails will now be sent directly to recipient inboxes!"})
    except Exception as e:
        return jsonify({"success": False, "message": f"Failed to save configuration: {e}"}), 500

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
def run_full_verification():
    data = request.get_json() or {}
    user_email = data.get("user_email", "anonymous@trusthire.ai")
    user_inputs = data.get("inputs", {})

    investigation = orchestrator.run_full_investigation(user_inputs)
    report = investigation["report"]
    locker = investigation["evidence_locker"]
    trace = investigation["audit_trace"]

    # Save record to SQLite history
    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute("""
        INSERT INTO verifications (
            user_email, company_name, job_title, recruitment_channel,
            website, recruiter_email, assessment, summary,
            payment_detected, evidence_locker_json, audit_trace_json,
            full_report_json, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            user_email,
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

# ----------------- HISTORY & STATS -----------------
@app.route("/api/history", methods=["GET"])
def get_history():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
    SELECT id, user_email, company_name, job_title, assessment,
           summary, payment_detected, created_at, full_report_json
    FROM verifications ORDER BY created_at DESC LIMIT 50
    """)
    rows = cursor.fetchall()
    
    # Also calculate dashboard statistics
    cursor.execute("SELECT COUNT(*) as total FROM verifications")
    total_verifs = cursor.fetchone()["total"]

    cursor.execute("SELECT COUNT(*) as needs_verif FROM verifications WHERE assessment IN ('NEEDS VERIFICATION', 'MULTIPLE WARNING SIGNS')")
    needs_verif = cursor.fetchone()["needs_verif"]

    cursor.execute("SELECT COUNT(*) as high_concern FROM verifications WHERE assessment = 'HIGH CONCERN'")
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
def delete_history_item(item_id):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM verifications WHERE id = ?", (item_id,))
    conn.commit()
    conn.close()
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
    if path and (DIST_DIR / path).exists():
        return send_from_directory(DIST_DIR, path)
    if (DIST_DIR / "index.html").exists():
        return send_from_directory(DIST_DIR, "index.html")
    return jsonify({"error": "Frontend build not found"}), 404

if __name__ == "__main__":
    print(f"TrustHire AI Agent Server starting on port {PORT}...")
    app.run(host="0.0.0.0", port=PORT, debug=False)
