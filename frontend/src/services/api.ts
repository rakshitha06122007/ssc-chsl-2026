import {
  User,
  QuestionStep,
  VerificationReport,
  HistoryItem,
  DashboardStats,
  DemoScenario,
  EvaluationResponse
} from '../types';

const API_BASE = '/api';

export async function sendOtp(email: string): Promise<{ success: boolean; message: string }> {
  const res = await fetch(`${API_BASE}/auth/send-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  });
  return res.json();
}

export async function register(email: string, password: string): Promise<{ success: boolean; message: string }> {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  return res.json();
}

export async function verifyOtp(email: string, code: string, password?: string): Promise<{ success: boolean; message: string; user?: User }> {
  const res = await fetch(`${API_BASE}/auth/verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, code, password })
  });
  return res.json();
}

export async function login(email: string, password: string): Promise<{ success: boolean; message: string; user?: User }> {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  return res.json();
}

export async function forgotPassword(email: string): Promise<{ success: boolean; message: string }> {
  const res = await fetch(`${API_BASE}/auth/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  });
  return res.json();
}

export async function resetPassword(email: string, code: string, newPassword: string): Promise<{ success: boolean; message: string }> {
  const res = await fetch(`${API_BASE}/auth/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, code, new_password: newPassword })
  });
  return res.json();
}

export async function getSmtpConfig(): Promise<{ configured: boolean; host?: string; user?: string; from_addr?: string }> {
  const res = await fetch(`${API_BASE}/auth/smtp-config`);
  return res.json();
}

export async function saveSmtpConfig(config: { host: string; port: number; user: string; password: string; from_addr?: string; use_tls?: boolean }): Promise<{ success: boolean; message: string }> {
  const res = await fetch(`${API_BASE}/auth/smtp-config`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(config)
  });
  return res.json();
}

export async function analyzeEmailDomain(email: string) {
  const res = await fetch(`${API_BASE}/verify/email-domain`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  });
  return res.json();
}

export async function submitJobChatStep(collectedData: Record<string, any>): Promise<{
  status: string;
  question_info: QuestionStep;
  collected_data: Record<string, any>;
}> {
  const res = await fetch(`${API_BASE}/verify/job-chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ collected_data: collectedData })
  });
  return res.json();
}

export async function submitFullJobVerification(userEmail: string, inputs: Record<string, any>): Promise<{
  report: VerificationReport;
  evidence_locker: any[];
  audit_trace: any[];
  assessment: string;
  summary: string;
  payment_detected: boolean;
  insufficient_evidence: boolean;
  id?: number;
}> {
  const res = await fetch(`${API_BASE}/verify/job-full`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_email: userEmail, inputs })
  });
  return res.json();
}

export async function verifyCompany(company_name: string, website: string = '', recruiter_email: string = '') {
  const res = await fetch(`${API_BASE}/verify/company`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ company_name, website, recruiter_email })
  });
  return res.json();
}

export async function verifyRecruiter(recruiter_email: string, company_name: string = '', website: string = '') {
  const res = await fetch(`${API_BASE}/verify/recruiter`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ recruiter_email, company_name, website })
  });
  return res.json();
}

export async function verifyWebsite(website: string, company_name: string = '') {
  const res = await fetch(`${API_BASE}/verify/website`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ website, company_name })
  });
  return res.json();
}

export async function verifyMessage(message_text: string) {
  const res = await fetch(`${API_BASE}/verify/message`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message_text })
  });
  return res.json();
}

export async function getHistory(): Promise<{ stats: DashboardStats; history: HistoryItem[] }> {
  const res = await fetch(`${API_BASE}/history`);
  return res.json();
}

export async function deleteHistoryItem(id: number): Promise<{ success: boolean }> {
  const res = await fetch(`${API_BASE}/history/${id}`, { method: 'DELETE' });
  return res.json();
}

export async function getDemoScenarios(): Promise<DemoScenario[]> {
  const res = await fetch(`${API_BASE}/demo/scenarios`);
  return res.json();
}

export async function runEvaluation(): Promise<EvaluationResponse> {
  const res = await fetch(`${API_BASE}/evaluation/run`);
  return res.json();
}
