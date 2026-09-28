import sqlite3
import json
import time
from pathlib import Path
import sys

BASE_DIR = Path(__file__).resolve().parent.parent
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

from app.database import get_db

def init_chsl_tables():
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS chsl_user_progress (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_email TEXT NOT NULL,
        topic_id TEXT NOT NULL,
        comprehension_status TEXT DEFAULT 'none',
        lesson_read INTEGER DEFAULT 0,
        solved_count INTEGER DEFAULT 0,
        updated_at REAL NOT NULL,
        UNIQUE(user_email, topic_id)
    );
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS chsl_mistakes (
        id TEXT PRIMARY KEY,
        user_email TEXT NOT NULL,
        question_id TEXT NOT NULL,
        question_text TEXT NOT NULL,
        topic_name TEXT NOT NULL,
        subject_id TEXT NOT NULL,
        selected_option TEXT NOT NULL,
        correct_option TEXT NOT NULL,
        explanation TEXT,
        category TEXT NOT NULL,
        student_notes TEXT,
        is_resolved INTEGER DEFAULT 0,
        created_at REAL NOT NULL
    );
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS chsl_test_attempts (
        attempt_id TEXT PRIMARY KEY,
        user_email TEXT NOT NULL,
        test_id TEXT NOT NULL,
        test_title TEXT NOT NULL,
        tier TEXT NOT NULL,
        total_marks REAL NOT NULL,
        max_marks REAL NOT NULL,
        accuracy_percentage REAL NOT NULL,
        time_spent_seconds INTEGER NOT NULL,
        result_json TEXT NOT NULL,
        created_at REAL NOT NULL
    );
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS chsl_study_plans (
        user_email TEXT PRIMARY KEY,
        target_exam TEXT DEFAULT 'SSC CHSL 2026',
        duration_days INTEGER NOT NULL,
        level TEXT NOT NULL,
        daily_hours INTEGER NOT NULL,
        plan_json TEXT NOT NULL,
        updated_at REAL NOT NULL
    );
    """)

    conn.commit()
    conn.close()
