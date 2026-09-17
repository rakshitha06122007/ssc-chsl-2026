import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

def load_dotenv():
    env_path = BASE_DIR / ".env"
    if env_path.exists():
        try:
            with open(env_path, "r", encoding="utf-8") as f:
                for line in f:
                    line = line.strip()
                    if line and not line.startswith("#") and "=" in line:
                        k, v = line.split("=", 1)
                        k = k.strip()
                        v = v.strip().strip('"').strip("'")
                        os.environ[k] = v
        except Exception as e:
            print(f"Error loading .env: {e}")

load_dotenv()

DB_PATH = os.environ.get("DATABASE_PATH", str(BASE_DIR / "trusthire.db"))

AI_PROVIDER = os.environ.get("AI_PROVIDER", "heuristic")  # "gemini", "openai", "heuristic"
AI_API_KEY = os.environ.get("AI_API_KEY", "")
DEMO_AUTH_MODE = os.environ.get("DEMO_AUTH_MODE", "false").lower() in ("true", "1", "yes")

PORT = int(os.environ.get("PORT", 5000))
SECRET_KEY = os.environ.get("SECRET_KEY", "trusthire-secret-key-dev-2026")
VITE_SITE_URL = os.environ.get("VITE_SITE_URL", "https://trusthire.ai")

def get_smtp_config():
    load_dotenv()
    return {
        "host": os.environ.get("SMTP_HOST", ""),
        "port": int(os.environ.get("SMTP_PORT", 587)),
        "user": os.environ.get("SMTP_USER", ""),
        "password": os.environ.get("SMTP_PASSWORD", ""),
        "from_addr": os.environ.get("SMTP_FROM", ""),
        "use_tls": os.environ.get("SMTP_USE_TLS", "true").lower() in ("true", "1", "yes")
    }

# Backwards compatible static exports
SMTP_HOST = os.environ.get("SMTP_HOST", "")
SMTP_PORT = int(os.environ.get("SMTP_PORT", 587))
SMTP_USER = os.environ.get("SMTP_USER", "")
SMTP_PASSWORD = os.environ.get("SMTP_PASSWORD", "")
SMTP_FROM = os.environ.get("SMTP_FROM", "")
SMTP_USE_TLS = os.environ.get("SMTP_USE_TLS", "true").lower() in ("true", "1", "yes")
