# TrustHire AI — System Architecture & Multi-Agent Design

## Overview
TrustHire AI is built around a central, responsible verification principle: **"Verify the opportunity, rather than detect fake companies."**

Rather than treating fraud detection as a fragile binary classification problem, TrustHire AI deploys a multi-agent orchestration architecture that collects forensic artifacts, cross-correlates multi-source evidence, enforces financial safety protocols, and provides full transparency through an Evidence Locker and deterministic Audit Trace.

```mermaid
graph TD
    User([User / Candidate]) --> QuestionAgent[1. Question Agent<br>Dynamic 1-by-1 Inquiry]
    QuestionAgent --> CompletenessCheck{Completeness Check}
    CompletenessCheck -- Need More Info --> QuestionAgent
    CompletenessCheck -- Ready --> Orchestrator[Verification Orchestrator]

    subgraph Forensic_Agents [Parallel Forensic Analysis Agents]
        Orchestrator --> CompanyAgent[Company Agent<br>Entity & Registry Matching]
        Orchestrator --> RecruiterAgent[Recruiter Agent<br>Domain & Mismatch Checks]
        Orchestrator --> OfferAgent[Offer Agent<br>Salary & Upfront Fee Scans]
        Orchestrator --> WebsiteAgent[Website Agent<br>Domain & Protocol Audit]
    end

    Forensic_Agents --> EvidenceAgent[2. Evidence Agent<br>Synthesizes Evidence Locker]
    EvidenceAgent --> RiskAgent[3. Risk Agent<br>Uncertainty & Negative Testing]

    RiskAgent --> BeforeYouPayCheck{Upfront Payment<br>Detected?}
    BeforeYouPayCheck -- Yes --> BeforeYouPay[Before You Pay Protocol<br>Critical Danger Shield]
    BeforeYouPayCheck -- No --> ReportAgent[4. Report Agent]
    BeforeYouPay --> ReportAgent

    ReportAgent --> FinalReport[Opportunity Verification Report]
    FinalReport --> AuditLog[(SQLite Audit Trace)]
```

## Multi-Step Agentic Lifecycle
1. **ASK**: Evaluates current parameters and generates dynamic, branching questions.
2. **COLLECT**: Gathers company names, recruitment channels, websites, recruiter contact, and message text.
3. **INVESTIGATE**: Performs entity lookups, domain parsing, and typosquatting analysis.
4. **ANALYZE**: Scans text for fee demands, urgency tactics, and premature banking requests.
5. **DECIDE**: Evaluates information completeness; if sparse, flags *Insufficient Evidence* without guessing.
6. **EXPLAIN**: Catalogs findings in the Evidence Locker under standardized categories.
7. **REPORT**: Generates multi-category Opportunity Verification Report.
8. **LOG**: Records deterministic audit trace entries into SQLite.
