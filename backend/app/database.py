import sqlite3
import json
import time
import sys
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

from app.config import DB_PATH

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT,
        is_verified INTEGER DEFAULT 0,
        domain_type TEXT DEFAULT 'unknown',
        created_at REAL NOT NULL
    );
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS verifications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_email TEXT NOT NULL,
        company_name TEXT NOT NULL,
        job_title TEXT NOT NULL,
        recruitment_channel TEXT,
        website TEXT,
        recruiter_email TEXT,
        assessment TEXT NOT NULL,
        summary TEXT,
        payment_detected INTEGER DEFAULT 0,
        evidence_locker_json TEXT,
        audit_trace_json TEXT,
        full_report_json TEXT,
        created_at REAL NOT NULL
    );
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS rate_limits (
        identifier TEXT PRIMARY KEY,
        count INTEGER DEFAULT 0,
        window_start REAL NOT NULL
    );
    """)
    conn.commit()

    # Migrate otp_codes table if it still has legacy plaintext 'code' column
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='otp_codes'")
    if cursor.fetchone():
        cursor.execute("PRAGMA table_info(otp_codes)")
        cols = [r["name"] for r in cursor.fetchall()]
        if "code" in cols or "otp_hash" not in cols:
            cursor.execute("DROP TABLE otp_codes")
            conn.commit()

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS otp_codes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT NOT NULL,
        otp_hash TEXT NOT NULL,
        salt TEXT NOT NULL,
        expires_at REAL NOT NULL,
        created_at REAL NOT NULL,
        is_used INTEGER DEFAULT 0,
        attempts INTEGER DEFAULT 0
    );
    """)
    conn.commit()

    # Migration for users table
    try:
        cursor.execute("ALTER TABLE users ADD COLUMN password_hash TEXT")
        conn.commit()
    except sqlite3.OperationalError:
        pass

    conn.close()

if __name__ == "__main__":
    init_db()
    print("Database initialized at", DB_PATH)
