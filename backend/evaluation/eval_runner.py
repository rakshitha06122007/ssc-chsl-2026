import json
import time
import os
import sys
from pathlib import Path

# Ensure backend directory is in sys.path
BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE_DIR))

from agent.orchestrator import orchestrator

TEST_CASES_PATH = Path(__file__).resolve().parent / "test_cases.json"

def run_evaluation() -> dict:
    if not os.path.exists(TEST_CASES_PATH):
        return {"status": "error", "message": "Test cases file not found."}

    with open(TEST_CASES_PATH, "r", encoding="utf-8") as f:
        test_cases = json.load(f)

    results = []
    passed_count = 0
    total_count = len(test_cases)
    start_total_time = time.time()

    category_stats = {}

    for tc in test_cases:
        tc_id = tc["id"]
        tc_name = tc["name"]
        cat = tc["category"]
        expected_assess = tc["expected_assessment"]
        expected_payment = tc["expected_payment_flag"]

        if cat not in category_stats:
            category_stats[cat] = {"total": 0, "passed": 0}
        category_stats[cat]["total"] += 1

        t0 = time.time()
        res = orchestrator.run_full_investigation(tc["inputs"])
        latency_ms = round((time.time() - t0) * 1000, 2)

        actual_assess = res["assessment"]
        actual_payment = res["payment_detected"]

        # Check match
        assess_match = (actual_assess == expected_assess)
        payment_match = (actual_payment == expected_payment)
        passed = assess_match and payment_match

        if passed:
            passed_count += 1
            category_stats[cat]["passed"] += 1

        results.append({
            "id": tc_id,
            "name": tc_name,
            "category": cat,
            "description": tc.get("description", ""),
            "input": tc["inputs"],
            "expected": {
                "assessment": expected_assess,
                "payment_flag": expected_payment
            },
            "actual": {
                "assessment": actual_assess,
                "payment_flag": actual_payment,
                "summary": res["summary"]
            },
            "passed": passed,
            "latency_ms": latency_ms
        })

    total_duration_sec = round(time.time() - start_total_time, 2)
    accuracy_pct = round((passed_count / total_count) * 100, 1) if total_count > 0 else 0

    return {
        "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
        "total_tests": total_count,
        "passed": passed_count,
        "failed": total_count - passed_count,
        "accuracy_pct": accuracy_pct,
        "duration_seconds": total_duration_sec,
        "category_breakdown": category_stats,
        "test_results": results
    }

if __name__ == "__main__":
    print("Running TrustHire AI Comprehensive Agent Evaluation Suite...")
    eval_data = run_evaluation()
    print(f"\nCompleted {eval_data['total_tests']} tests in {eval_data['duration_seconds']}s.")
    print(f"Passed: {eval_data['passed']}/{eval_data['total_tests']} ({eval_data['accuracy_pct']}%)")
    print("-" * 50)
    for r in eval_data["test_results"]:
        status = "✓ PASS" if r["passed"] else "✗ FAIL"
        print(f"[{status}] {r['id']} - {r['name']} ({r['category']})")
        if not r["passed"]:
            print(f"   Expected: {r['expected']} | Actual: {r['actual']['assessment']}")
