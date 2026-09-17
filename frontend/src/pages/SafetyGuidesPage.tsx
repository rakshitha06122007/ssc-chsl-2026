import React, { useState } from 'react';
import { 
  BookOpen, 
  ShieldCheck, 
  AlertTriangle, 
  Building2, 
  Mail, 
  CheckSquare, 
  ExternalLink,
  ChevronRight
} from 'lucide-react';

export const SafetyGuidesPage: React.FC = () => {
  const [activeGuide, setActiveGuide] = useState<string>('wfh-job');

  const guides = [
    {
      id: 'wfh-job',
      title: 'How to Verify a Work-From-Home Job',
      url: '/how-to-verify-a-work-from-home-job',
      description: 'Step-by-step checklist to avoid task scams, fake check deposits, and identity theft in remote roles.',
      content: (
        <div className="space-y-6 text-xs text-slate-300 leading-relaxed">
          <h2 className="text-xl font-bold text-white">How to Verify a Work-From-Home Job (2026 Edition)</h2>
          <p>
            Remote job opportunities have transformed the global labor market, but they have also enabled sophisticated remote employment fraud. Fraudulent operators often pose as legitimate companies, offering competitive hourly rates for positions such as Data Entry, Virtual Assistant, or Customer Care Associate.
          </p>

          <h3 className="text-sm font-bold text-cyan-300 uppercase tracking-wider">Crucial Red Flags to Screen For:</h3>
          <ul className="list-disc list-inside space-y-2 pl-2">
            <li><strong>Upfront Equipment Fees:</strong> Legitimate employers provide laptops, monitors, and peripherals directly through established logistics channels at zero cost to the employee. Any demand for "refundable insurance" is fraudulent.</li>
            <li><strong>Interviews Exclusively via Text or Chat:</strong> Legitimate organizations conduct interviews through video conferences (Google Meet, Microsoft Teams, Zoom) or formal phone calls, never exclusively through Telegram or WhatsApp.</li>
            <li><strong>Immediate Offers Without Formal Assessment:</strong> Receiving an immediate offer letter within 30 minutes of sending a resume is a recognized warning indicator.</li>
          </ul>

          <h3 className="text-sm font-bold text-cyan-300 uppercase tracking-wider">Actionable Verification Protocol:</h3>
          <ol className="list-decimal list-inside space-y-2 pl-2">
            <li>Visit the company's official corporate website directly and search their Careers / Jobs portal for the exact Job ID.</li>
            <li>Contact the company's verified switchboard or human resources office to confirm the recruiter's employment status.</li>
            <li>Never cash a "reimbursement check" sent by a recruiter to purchase supplies from an unverified vendor.</li>
          </ol>
        </div>
      )
    },
    {
      id: 'verify-company',
      title: 'How to Verify a Company',
      url: '/how-to-verify-a-company',
      description: 'How to inspect corporate registrations, state filings, and domain authenticity.',
      content: (
        <div className="space-y-6 text-xs text-slate-300 leading-relaxed">
          <h2 className="text-xl font-bold text-white">How to Verify a Company's Legitimacy</h2>
          <p>
            Before submitting your resume, phone number, or address, verify that the hiring entity is an authentic, registered enterprise with active business filings.
          </p>

          <h3 className="text-sm font-bold text-cyan-300 uppercase tracking-wider">Entity Verification Channels:</h3>
          <ul className="list-disc list-inside space-y-2 pl-2">
            <li><strong>Official State / National Registries:</strong> In the US, consult the Secretary of State business registry. In the UK, consult Companies House. In India, check the Ministry of Corporate Affairs (MCA).</li>
            <li><strong>Domain Age and Whois Data:</strong> Compare the age of the website with the company's claimed history. If a company claims 15 years of industry experience but its domain was registered 14 days ago on a high-churn TLD (.xyz, .live), exercise extreme caution.</li>
            <li><strong>Corporate Physical Address:</strong> Verify that the company's listed headquarters exists on Google Maps and street view rather than being a random residential home or mail-drop box.</li>
          </ul>
        </div>
      )
    },
    {
      id: 'warning-signs',
      title: 'Fake Job Offer Warning Signs',
      url: '/fake-job-offer-warning-signs',
      description: 'The definitive catalog of red flags in unsolicited hiring communications.',
      content: (
        <div className="space-y-6 text-xs text-slate-300 leading-relaxed">
          <h2 className="text-xl font-bold text-white">10 Critical Warning Signs of a Fake Job Offer</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-navy-950 border border-white/10 space-y-1">
              <strong className="text-rose-400">1. Off-Domain Email Address</strong>
              <p className="text-slate-400">Recruiter claims a major company but uses @gmail.com or @yahoo.com.</p>
            </div>
            <div className="p-3.5 rounded-xl bg-navy-950 border border-white/10 space-y-1">
              <strong className="text-rose-400">2. Urgent Decision Pressure</strong>
              <p className="text-slate-400">Demanding you sign an offer or transfer a fee within 2–4 hours.</p>
            </div>
            <div className="p-3.5 rounded-xl bg-navy-950 border border-white/10 space-y-1">
              <strong className="text-rose-400">3. Inflated Compensation</strong>
              <p className="text-slate-400">Offering $50+/hour for routine entry-level data entry tasks.</p>
            </div>
            <div className="p-3.5 rounded-xl bg-navy-950 border border-white/10 space-y-1">
              <strong className="text-rose-400">4. Premature Banking Data Demands</strong>
              <p className="text-slate-400">Requesting SSN, passport, and bank account before an interview.</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'recruiter-guide',
      title: 'Recruiter Verification Guide',
      url: '/recruiter-verification-guide',
      description: 'How to confirm that the person emailing or messaging you is an authorized talent acquisition agent.',
      content: (
        <div className="space-y-6 text-xs text-slate-300 leading-relaxed">
          <h2 className="text-xl font-bold text-white">Recruiter Verification Guide</h2>
          <p>
            Talent acquisition specialists and headhunters are active on professional networks. Follow these rules to differentiate authorized hiring managers from impersonators:
          </p>
          <ul className="list-disc list-inside space-y-2 pl-2">
            <li><strong>Examine LinkedIn Profile Authenticity:</strong> Check how long the recruiter's profile has been active, shared connections, endorsements, and verified company badge.</li>
            <li><strong>Cross-Check Email Headers:</strong> Ensure the email sender's Return-Path, SPF, and DKIM signatures align with the corporate domain, not an anonymous forwarding service.</li>
            <li><strong>Initiate Out-of-Band Communication:</strong> Message the recruiter directly on LinkedIn or call the company switchboard to confirm their message.</li>
          </ul>
        </div>
      )
    },
    {
      id: 'safety-checklist',
      title: 'Work-From-Home Safety Checklist',
      url: '/work-from-home-safety-checklist',
      description: 'The master pre-employment security checklist before accepting any remote job.',
      content: (
        <div className="space-y-6 text-xs text-slate-300 leading-relaxed">
          <h2 className="text-xl font-bold text-white">Work-From-Home Candidate Safety Checklist</h2>
          <div className="space-y-2">
            {[
              "Never transfer money, wire funds, or buy gift cards for equipment or onboarding.",
              "Never accept or deposit a paper check from an unverified employer to buy home office supplies.",
              "Never share your online banking login credentials, OTP codes, or credit card CVV.",
              "Always confirm that the job requisition is listed on the company's verified public careers portal.",
              "Always verify the recruiter's identity independently on professional corporate directories."
            ].map((rule, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-navy-950/80 border border-white/10 flex items-start gap-3">
                <CheckSquare className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span className="text-slate-200">{rule}</span>
              </div>
            ))}
          </div>
        </div>
      )
    }
  ];

  const current = guides.find(g => g.id === activeGuide) || guides[0];

  return (
    <div className="py-6 max-w-5xl mx-auto px-4 sm:px-6 space-y-8 text-left">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono text-[10px] font-bold">
            Public Safety Knowledge Base
          </span>
          <span className="text-xs text-slate-400">SEO & Security Guidelines</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          Employment Safety & Verification Guides
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Industry-standard procedures for candidates, freelancers, and remote workers to verify opportunities responsibly.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Navigation list */}
        <div className="space-y-2 md:col-span-1">
          {guides.map((g) => (
            <button
              key={g.id}
              onClick={() => setActiveGuide(g.id)}
              className={`w-full text-left p-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-between cursor-pointer ${
                activeGuide === g.id
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="truncate">{g.title}</span>
              <ChevronRight className="w-3.5 h-3.5 shrink-0" />
            </button>
          ))}
        </div>

        {/* Content Box */}
        <div className="md:col-span-3 glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 shadow-xl">
          <div className="pb-3 border-b border-white/10 mb-6 flex items-center justify-between text-xs text-slate-500 font-mono">
            <span>Canonical Path: {current.url}</span>
            <span className="text-cyan-400">Indexed for Public Search</span>
          </div>
          {current.content}
        </div>
      </div>
    </div>
  );
};
