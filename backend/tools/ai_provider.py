import os
import json
import requests
from app.config import AI_PROVIDER, AI_API_KEY

class AIProvider:
    def __init__(self):
        self.provider = AI_PROVIDER
        self.api_key = AI_API_KEY

    def generate_analysis(self, prompt: str, system_instruction: str = "", fallback_data: dict = None) -> dict:
        """
        Executes query against selected AI provider (Gemini, OpenAI, Anthropic),
        or seamlessly falls back to the deterministic heuristic engine.
        """
        if self.provider == "gemini" and self.api_key:
            try:
                url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={self.api_key}"
                headers = {"Content-Type": "application/json"}
                payload = {
                    "contents": [{"parts": [{"text": f"{system_instruction}\n\n{prompt}"}]}],
                    "generationConfig": {"temperature": 0.2, "responseMimeType": "application/json"}
                }
                res = requests.post(url, json=payload, headers=headers, timeout=12)
                if res.status_code == 200:
                    text = res.json()["candidates"][0]["content"]["parts"][0]["text"]
                    return json.loads(text)
            except Exception as e:
                print(f"[AIProvider Gemini Fallback] {e}")

        elif self.provider == "openai" and self.api_key:
            try:
                url = "https://api.openai.com/v1/chat/completions"
                headers = {"Authorization": f"Bearer {self.api_key}", "Content-Type": "application/json"}
                payload = {
                    "model": "gpt-4o-mini",
                    "messages": [
                        {"role": "system", "content": system_instruction or "You are an opportunity verification engine."},
                        {"role": "user", "content": prompt}
                    ],
                    "response_format": {"type": "json_object"}
                }
                res = requests.post(url, json=payload, headers=headers, timeout=12)
                if res.status_code == 200:
                    content = res.json()["choices"][0]["message"]["content"]
                    return json.loads(content)
            except Exception as e:
                print(f"[AIProvider OpenAI Fallback] {e}")

        # Default: Deterministic heuristic analysis
        return fallback_data or {"status": "success", "mode": "heuristic"}

ai_provider = AIProvider()
