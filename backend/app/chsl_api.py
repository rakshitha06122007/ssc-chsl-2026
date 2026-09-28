import json
import time
from flask import Blueprint, request, jsonify
from app.database import get_db
from app.chsl_database import init_chsl_tables

chsl_bp = Blueprint("chsl_api", __name__, url_prefix="/api/chsl")

# Initialize database schema
init_chsl_tables()

@chsl_bp.route("/status", methods=["GET"])
def chsl_status():
    return jsonify({
        "status": "online",
        "platform": "CHSL Mastery — SSC CHSL 2026 Complete Preparation Platform",
        "tier1_structure": {
            "mode": "CBE",
            "questions": 100,
            "marks": 200,
            "duration": 60,
            "negative_marking": 0.50
        },
        "tier2_structure": {
            "session1": "2 hours 15 mins (135 Qs / 360 Marks)",
            "session2": "Typing Test (35 WPM Eng / 30 WPM Hindi, 10 mins)",
            "negative_marking": 1.0
        }
    })

# --- MISTAKES SYNC ---
@chsl_bp.route("/mistakes", methods=["GET"])
def get_mistakes():
    user_email = request.args.get("user_email", "student@chslmastery.free")
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM chsl_mistakes WHERE user_email = ? ORDER BY created_at DESC", (user_email,))
    rows = cursor.fetchall()
    conn.close()

    mistakes = []
    for r in rows:
        mistakes.append({
            "id": r["id"],
            "user_email": r["user_email"],
            "questionId": r["question_id"],
            "questionText": r["question_text"],
            "topicName": r["topic_name"],
            "subjectId": r["subject_id"],
            "selectedOptionId": r["selected_option"],
            "correctOptionId": r["correct_option"],
            "explanation": r["explanation"],
            "mistakeCategory": r["category"],
            "studentNotes": r["student_notes"],
            "isResolved": bool(r["is_resolved"]),
            "attemptedAt": r["created_at"] * 1000
        })
    return jsonify({"success": True, "mistakes": mistakes})

@chsl_bp.route("/mistakes", methods=["POST"])
def save_mistake():
    data = request.get_json() or {}
    user_email = data.get("user_email", "student@chslmastery.free")
    m_id = data.get("id") or ("mistake_" + str(int(time.time() * 1000)))
    
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
    INSERT OR REPLACE INTO chsl_mistakes 
    (id, user_email, question_id, question_text, topic_name, subject_id, selected_option, correct_option, explanation, category, student_notes, is_resolved, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        m_id,
        user_email,
        data.get("questionId", ""),
        data.get("questionText", ""),
        data.get("topicName", ""),
        data.get("subjectId", "quantitative_aptitude"),
        data.get("selectedOptionId", ""),
        data.get("correctOptionId", ""),
        data.get("explanation", ""),
        data.get("mistakeCategory", "concept_not_understood"),
        data.get("studentNotes", ""),
        1 if data.get("isResolved") else 0,
        time.time()
    ))
    conn.commit()
    conn.close()
    return jsonify({"success": True, "id": m_id})

# --- TEST RESULTS ---
@chsl_bp.route("/test-attempts", methods=["POST"])
def record_test_attempt():
    data = request.get_json() or {}
    user_email = data.get("user_email", "student@chslmastery.free")
    attempt_id = data.get("attemptId") or ("att_" + str(int(time.time() * 1000)))

    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
    INSERT OR REPLACE INTO chsl_test_attempts
    (attempt_id, user_email, test_id, test_title, tier, total_marks, max_marks, accuracy_percentage, time_spent_seconds, result_json, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        attempt_id,
        user_email,
        data.get("testId", ""),
        data.get("testTitle", ""),
        data.get("tier", "tier1"),
        data.get("totalMarksScored", 0.0),
        data.get("maxMarks", 200.0),
        data.get("accuracyPercentage", 0.0),
        data.get("timeSpentSeconds", 0),
        json.dumps(data),
        time.time()
    ))
    conn.commit()
    conn.close()
    return jsonify({"success": True, "attemptId": attempt_id})

# --- AI STUDY ASSISTANT ENDPOINT ---
@chsl_bp.route("/ai-tutor", methods=["POST"])
def ai_tutor():
    data = request.get_json() or {}
    query = (data.get("query") or "").strip().lower()

    if not query:
        return jsonify({"success": False, "error": "Query required"}), 400

    # Pedagogical response dispatch
    if "percentage" in query or "profit" in query:
        response_text = "Golden Formula: MP / CP = (100 + P%) / (100 - D%). In successive discounts a% and b%, net discount = a + b - (ab/100)%."
    elif "article 32" in query or "writ" in query:
        response_text = "Article 32 allows citizens to directly petition the Supreme Court for 5 prerogative writs: Habeas Corpus, Mandamus, Prohibition, Certiorari, and Quo-Warranto."
    elif "typing" in query:
        response_text = "Official SSC LDC/JSA requirement is 35 WPM (approx 10,500 KDPH) in English or 30 WPM in Hindi over a 10-minute continuous passage. Keep accuracy above 95%."
    else:
        response_text = f"Reviewing '{query}' against official SSC CHSL 2026 pattern. Follow the 13-stage pedagogical lesson and verify against recent TCS PYQs."

    return jsonify({
        "success": True,
        "reply": response_text,
        "timestamp": time.time()
    })
