import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  AlertTriangle, 
  CheckCircle2, 
  DollarSign, 
  Clock, 
  CreditCard, 
  Lock, 
  ArrowRight,
  MessageSquare
} from 'lucide-react';
import { verifyMessage } from '../services/api';

export const MessageAnalyzePage: React.FC = () => {
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;
    setLoading(true);
    try {
      const res = await verifyMessage(messageText);
      setResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleExample = () => {
    setMessageText(
      "Congratulations! You have been selected for the Data Support role at ABC Technologies ($45/hr). You must immediately deposit $150 refundable equipment insurance to receive your Apple MacBook Pro kit via FedEx today. Offer expires in 4 hours."
    );
  };

  return (
    <div className="py-6 max-w-4xl mx-auto px-4 sm:px-6 space-y-8 text-left">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono text-[10px] font-bold">
            Forensic Text & Offer Letter Extractor
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          Analyze Job Message
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Paste offer letters, emails, WhatsApp or Telegram hiring messages to extract compensation, payment demands, and urgency pressure.
        </p>
      </div>

      {/* Input Box */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 shadow-xl space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
              Paste Job Offer / Email / Chat Message *
            </label>
            <textarea
              rows={6}
              required
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Paste email, WhatsApp, Telegram, or LinkedIn offer message here..."
              className="w-full p-4 rounded-2xl bg-navy-950 border border-white/15 focus:border-amber-400 text-xs text-white placeholder-slate-500 outline-none transition-all resize-y font-mono"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleExample}
              className="text-[11px] text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
            >
              Load Example Equipment Scam Message ($150 fee + urgent timer)
            </button>

            <button
              type="submit"
              disabled={loading || !messageText.trim()}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-500 hover:from-amber-500 hover:to-orange-400 text-white font-bold text-xs shadow-md shadow-amber-500/20 disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? 'Extracting Forensic Cues...' : 'Extract & Analyze Message'}
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>

      {/* Extracted Forensic Results */}
      {result && (
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6 animate-fade-in">
          <h3 className="text-base font-bold text-white border-b border-white/10 pb-3">
            Extracted Opportunity Artifacts
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-navy-950/80 border border-white/10">
              <span className="text-slate-400 block text-[10px] uppercase font-mono">Company</span>
              <p className="font-bold text-white text-sm mt-0.5">{result.extracted_company || 'Unspecified'}</p>
            </div>
            <div className="p-3.5 rounded-xl bg-navy-950/80 border border-white/10">
              <span className="text-slate-400 block text-[10px] uppercase font-mono">Position</span>
              <p className="font-bold text-white text-sm mt-0.5">{result.extracted_position || 'Unspecified'}</p>
            </div>
            <div className="p-3.5 rounded-xl bg-navy-950/80 border border-white/10">
              <span className="text-slate-400 block text-[10px] uppercase font-mono">Compensation</span>
              <p className="font-bold text-cyan-300 text-sm mt-0.5">{result.salary}</p>
            </div>
            <div className="p-3.5 rounded-xl bg-navy-950/80 border border-white/10">
              <span className="text-slate-400 block text-[10px] uppercase font-mono">Detected Channel</span>
              <p className="font-bold text-slate-200 text-sm mt-0.5">{result.channel}</p>
            </div>
          </div>

          {/* Payment & Sensitive Flags */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Payment demand */}
            <div className={`p-4 rounded-2xl border ${
              result.payment_info?.payment_detected 
                ? 'bg-rose-950/20 border-rose-500/40 text-rose-200' 
                : 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200'
            }`}>
              <div className="flex items-center gap-2 font-bold mb-1">
                <CreditCard className="w-4 h-4" />
                <span>Upfront Payment Demand: {result.payment_info?.payment_detected ? 'YES (HIGH CONCERN)' : 'NO'}</span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                {result.payment_info?.explanation}
              </p>
            </div>

            {/* Urgency */}
            <div className={`p-4 rounded-2xl border ${
              result.urgency_info?.is_urgent 
                ? 'bg-amber-950/20 border-amber-500/40 text-amber-200' 
                : 'bg-navy-950/80 border-white/10 text-slate-300'
            }`}>
              <div className="flex items-center gap-2 font-bold mb-1">
                <Clock className="w-4 h-4" />
                <span>Urgency Pressure: {result.urgency_info?.is_urgent ? 'ELEVATED' : 'STANDARD'}</span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                {result.urgency_info?.explanation}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
