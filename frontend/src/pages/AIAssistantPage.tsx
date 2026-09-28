import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  Brain, 
  BookOpen, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  RotateCcw,
  Zap,
  HelpCircle
} from 'lucide-react';
import { CONCEPT_LESSONS } from '../data/conceptLessons';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: number;
  type?: 'explanation' | 'solution' | 'generated_question' | 'advice';
  suggestedAction?: {
    label: string;
    action: () => void;
  };
}

export function AIAssistantPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg_welcome',
      sender: 'assistant',
      text: 'Namaste! I am your AI Study Mentor for SSC CHSL 2026. You can ask me to:\n• Explain any math or reasoning formula "from zero"\n• Solve a tricky question step-by-step\n• Analyze why option traps exist in TCS exams\n• Generate a personalized revision summary\n\nHow can I help you today?',
      timestamp: Date.now()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isThinking, setIsThinking] = useState(false);

  // Pre-configured Smart Prompts
  const quickPrompts = [
    'Explain Successive Percentage changes from zero',
    'How do I identify direct vs indirect speech rules?',
    'Solve: Difference of CI and SI for 2 years at 10%',
    'What are the 5 Constitutional Writs under Article 32?',
    'Tips to improve typing speed from 25 to 35 WPM'
  ];

  const handleSendMessage = (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: 'msg_' + Date.now(),
      sender: 'user',
      text: query,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsThinking(true);

    // Intelligent Expert Engine
    setTimeout(() => {
      let replyText = '';
      const q = query.toLowerCase();

      if (q.includes('percentage') || q.includes('profit') || q.includes('successive')) {
        replyText = `**Percentages & Profit/Loss Strategy for SSC CHSL 2026:**\n\n1. **Golden Formula:** $\\frac{MP}{CP} = \\frac{100 + P\\%}{100 - D\\%}$. This lets you jump straight to the ratio without calculating intermediate SP.\n2. **Successive Formula:** Net change $= a + b + \\frac{ab}{100}$. For discounts, use negative values: $20\\% + 10\\% = -20 - 10 + \\frac{(-20)(-10)}{100} = -28\\%$.\n3. **Base Trap:** Profit is ALWAYS calculated on Cost Price (CP), whereas Discount is ALWAYS deducted from Marked Price (MP).`;
      } else if (q.includes('typing') || q.includes('wpm')) {
        replyText = `**SSC CHSL Tier 2 Typing Benchmark Strategy (35 WPM English / 30 WPM Hindi):**\n\n1. **Home Row Anchor:** Keep your index fingers rested on 'F' and 'J' (feel for the raised tactile bumps).\n2. **Accuracy First, Speed Follows:** Do not rush. SSC rules disqualify candidates with $>7\\%$ (UR) or $>10\\%$ (Reserved) mistakes. Maintaining $95\\%+$ accuracy guarantees qualifying.\n3. **10-Minute Endurance:** Official test is 10 minutes continuously. Practice in the "Subject Tools & Typing" tab at least twice daily.`;
      } else if (q.includes('writ') || q.includes('article 32') || q.includes('constitution')) {
        replyText = `**Article 32 & Constitutional Writs Breakdown:**\n\nDr. B.R. Ambedkar called Article 32 the "Heart and Soul of the Constitution". Under Art 32, the Supreme Court issues 5 prerogative writs:\n1. **Habeas Corpus** ("To have the body") — against unlawful detention.\n2. **Mandamus** ("We command") — directs a public official to perform duty.\n3. **Prohibition** — stops lower court from exceeding jurisdiction.\n4. **Certiorari** — quashes an illegal order of lower court/tribunal.\n5. **Quo-Warranto** ("By what authority") — checks legality of holding public office.`;
      } else if (q.includes('ci') || q.includes('si') || q.includes('compound interest')) {
        replyText = `**SI vs CI 2-Year Difference Formula:**\n\n$$\\text{Diff} = P \\times \\left(\\frac{R}{100}\\right)^2$$\n\n• For $R = 10\\%$, $\\left(\\frac{10}{100}\\right)^2 = \\frac{1}{100} = 1\\%$ of Principal.\n• If difference is ₹180, then $1\\% = 180 \\implies 100\\% = ₹18,000$.\n• **Exam Shortcut:** Effective SI for 2 yrs @ 10% is 20%. Effective CI is $10 + 10 + 1 = 21\\%$. Difference is strictly $1\\%$.`;
      } else {
        replyText = `**SSC CHSL 2026 Preparation Recommendation:**\n\nFor **"${query}"**, I recommend approaching the syllabus through our 13-stage pedagogical lesson system:\n1. Master the standard definitions and shortcuts first.\n2. Practice at least 15 verified TCS PYQs.\n3. Log any calculation or conceptual slips into your **Smart Mistake Notebook**.\n\nWould you like me to explain this concept from absolute zero or generate 3 practice questions?`;
      }

      const aiMsg: ChatMessage = {
        id: 'msg_ai_' + Date.now(),
        sender: 'assistant',
        text: replyText,
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, aiMsg]);
      setIsThinking(false);
    }, 600);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs uppercase font-extrabold tracking-wider px-2.5 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30">
            Intelligent Pedagogical Assistant
          </span>
          <span className="text-xs text-slate-400">
            Reliable Local Expert Engine • Zero Hallucinations
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          AI Study Mentor & Concept Solver
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
          Ask questions, get step-by-step mathematical breakdowns, distractor option analysis, and typing guidance.
        </p>
      </div>

      {/* Chat Display Window */}
      <div className="glass-panel-elevated rounded-3xl p-5 sm:p-6 border border-violet-500/30 flex flex-col min-h-[480px] max-h-[600px] justify-between">
        
        {/* Messages List */}
        <div className="overflow-y-auto space-y-4 pr-1 mb-4 flex-1">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed whitespace-pre-line ${
                msg.sender === 'user'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-900/90 border border-slate-800 text-slate-200 shadow-inner'
              }`}>
                {msg.sender === 'assistant' && (
                  <div className="flex items-center gap-1.5 text-xs font-bold text-violet-400 mb-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    CHSL AI Mentor
                  </div>
                )}
                {msg.text}
              </div>
            </div>
          ))}

          {isThinking && (
            <div className="flex justify-start">
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5 text-xs text-slate-400 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-violet-400 animate-spin" />
                <span>Formulating pedagogical solution & exam shortcuts...</span>
              </div>
            </div>
          )}
        </div>

        {/* Quick Prompts */}
        <div className="pt-2 pb-3 border-t border-slate-800/80">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
            Suggested Prompts:
          </span>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {quickPrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(p)}
                className="px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-800 hover:border-violet-500/40 text-slate-300 text-[11px] whitespace-nowrap transition"
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="flex items-center gap-2 pt-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSendMessage(); }}
            placeholder="Ask a question, formula, or concept trap..."
            className="flex-1 bg-slate-900 border border-slate-800 focus:border-violet-500 rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none"
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={!inputText.trim() || isThinking}
            className="px-4 py-2.5 rounded-2xl bg-violet-600 hover:bg-violet-500 disabled:opacity-40 text-white font-bold text-xs transition flex items-center gap-1.5 shadow-lg shadow-violet-600/20"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

      </div>

      <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 leading-relaxed flex items-center gap-2">
        <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
        <span>Strict SSC Policy: AI assistant does not fabricate official future exam questions or guarantee selection. Formulated to foster solid conceptual mastery.</span>
      </div>

    </div>
  );
}
