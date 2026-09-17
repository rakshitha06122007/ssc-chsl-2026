export interface User {
  email: string;
  is_verified: boolean;
  is_demo_mode?: boolean;
  domain_analysis?: {
    email: string;
    domain: string;
    domain_type: string;
    is_free_provider: boolean;
    explanation: string;
  };
}

export interface QuestionStep {
  step: string;
  question: string;
  field: string | null;
  input_type: 'text' | 'textarea' | 'select' | 'none';
  placeholder?: string;
  options: string[];
  completeness_score: number;
  can_skip?: boolean;
  can_investigate_now?: boolean;
}

export interface EvidenceItem {
  id: string;
  finding: string;
  source: string;
  category: 'User Provided' | 'Verified Evidence' | 'AI Analysis' | 'Unknown';
  status: 'Low Concern' | 'Needs Verification' | 'Warning Indicator' | 'High Concern';
  explanation: string;
}

export interface AuditTraceStep {
  step: number;
  action: string;
  result: string;
  next_decision: string;
}

export interface ReportCategory {
  name: string;
  status: string;
  finding: string;
  explanation: string;
}

export interface SafetyChecklistItem {
  id: number;
  task: string;
  recommended: boolean;
  is_critical?: boolean;
}

export interface VerificationReport {
  title: string;
  date: string;
  company: string;
  job: string;
  recruitment_channel: string;
  website: string;
  recruiter: string;
  assessment: 'LOW CONCERN' | 'NEEDS VERIFICATION' | 'MULTIPLE WARNING SIGNS' | 'HIGH CONCERN' | 'INCONCLUSIVE';
  summary: string;
  explanation: string;
  payment_detected: boolean;
  insufficient_evidence: boolean;
  categories: Record<string, ReportCategory>;
  evidence_locker: EvidenceItem[];
  audit_trace: AuditTraceStep[];
  safety_checklist: SafetyChecklistItem[];
  disclaimer: string;
}

export interface HistoryItem {
  id: number;
  user_email: string;
  company_name: string;
  job_title: string;
  assessment: string;
  summary: string;
  payment_detected: boolean;
  created_at: string;
  report?: VerificationReport;
}

export interface DashboardStats {
  verifications_completed: number;
  needs_verification: number;
  high_concern_cases: number;
  saved_reports: number;
}

export interface DemoScenario {
  id: string;
  title: string;
  badge: string;
  description: string;
  payload: Record<string, any>;
}

export interface EvalCaseResult {
  id: string;
  name: string;
  category: string;
  description: string;
  input: Record<string, any>;
  expected: {
    assessment: string;
    payment_flag: boolean;
  };
  actual: {
    assessment: string;
    payment_flag: boolean;
    summary: string;
  };
  passed: boolean;
  latency_ms: number;
}

export interface EvaluationResponse {
  timestamp: string;
  total_tests: number;
  passed: number;
  failed: number;
  accuracy_pct: number;
  duration_seconds: number;
  category_breakdown: Record<string, { total: number; passed: number }>;
  test_results: EvalCaseResult[];
}
