import React, { useState, useEffect } from 'react';
import { 
  Keyboard, 
  Calculator, 
  BookOpen, 
  Zap, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  RotateCcw,
  Sparkles,
  Layers,
  Award
} from 'lucide-react';
import { SPEED_MATH_DATA, GRAMMAR_120_RULES, HIGH_YIELD_VOCABULARY, TYPING_PRACTICE_PASSAGES } from '../data/subjectToolsData';
import { CHSLStorageService } from '../services/chslStorage';

export function SubjectToolsPage() {
  const [activeTab, setActiveTab] = useState<'typing' | 'speed_math' | 'grammar' | 'vocab'>('typing');

  // Typing Test State
  const [selectedPassageId, setSelectedPassageId] = useState<string>(TYPING_PRACTICE_PASSAGES[0].id);
  const [typedText, setTypedText] = useState<string>('');
  const [typingTimeLeft, setTypingTimeLeft] = useState<number>(10 * 60);
  const [isTypingRunning, setIsTypingRunning] = useState<boolean>(false);
  const [typingFinished, setTypingFinished] = useState<boolean>(false);

  const currentPassage = TYPING_PRACTICE_PASSAGES.find(p => p.id === selectedPassageId) || TYPING_PRACTICE_PASSAGES[0];

  // Typing Timer
  useEffect(() => {
    let interval: any = null;
    if (isTypingRunning && typingTimeLeft > 0) {
      interval = setInterval(() => {
        setTypingTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (isTypingRunning && typingTimeLeft === 0) {
      setIsTypingRunning(false);
      setTypingFinished(true);
    }
    return () => clearInterval(interval);
  }, [isTypingRunning, typingTimeLeft]);

  // Typing Metrics Calculation
  const originalWords = currentPassage.text.split(' ');
  const userWords = typedText.trim().split(/\s+/);
  const timeElapsedMinutes = Math.max(0.1, (currentPassage.durationMinutes * 60 - typingTimeLeft) / 60);
  
  // Gross WPM & Accuracy
  const grossWPM = Math.round((typedText.length / 5) / timeElapsedMinutes);
  let correctKeystrokes = 0;
  for (let i = 0; i < typedText.length; i++) {
    if (typedText[i] === currentPassage.text[i]) correctKeystrokes++;
  }
  const accuracyPercent = typedText.length > 0 
    ? Math.round((correctKeystrokes / typedText.length) * 100) 
    : 100;
  const netWPM = Math.max(0, Math.round(grossWPM * (accuracyPercent / 100)));

  const handleStartTyping = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!isTypingRunning && !typingFinished) {
      setIsTypingRunning(true);
    }
    setTypedText(e.target.value);

    // If completed full text
    if (e.target.value.length >= currentPassage.text.length) {
      setIsTypingRunning(false);
      setTypingFinished(true);
      CHSLStorageService.saveTypingResult({
        id: 'type_' + Date.now(),
        timestamp: Date.now(),
        passageTitle: currentPassage.title,
        language: currentPassage.language,
        targetWPM: currentPassage.targetWPM,
        actualWPM: netWPM,
        accuracyPercentage: accuracyPercent,
        totalKeystrokes: e.target.value.length,
        errorCount: e.target.value.length - correctKeystrokes,
        durationSeconds: (currentPassage.durationMinutes * 60) - typingTimeLeft,
        passedOfficialBenchmark: netWPM >= currentPassage.targetWPM && accuracyPercent >= 95
      });
    }
  };

  const handleResetTyping = () => {
    setIsTypingRunning(false);
    setTypingFinished(false);
    setTypedText('');
    setTypingTimeLeft(currentPassage.durationMinutes * 60);
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      
      {/* Header */}
      <div>
        <span className="text-xs uppercase font-extrabold tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
          SSC Subject Accelerator
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
          Subject Tools & Tier 2 Skill Simulator
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
          Speed calculation drills, 120 Grammar Rules master list, and official SSC LDC/JSA typing test workbench.
        </p>
      </div>

      {/* Main Tabs */}
      <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-2xl flex-wrap gap-1">
        <button
          onClick={() => setActiveTab('typing')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'typing'
              ? 'bg-gradient-to-r from-amber-600 to-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Keyboard className="w-4 h-4" />
          Typing Test (35 WPM Official Benchmark)
        </button>
        <button
          onClick={() => setActiveTab('speed_math')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'speed_math'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Calculator className="w-4 h-4" />
          Speed Math & Pythagorean Triplets
        </button>
        <button
          onClick={() => setActiveTab('grammar')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'grammar'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          120 English Grammar Rules
        </button>
        <button
          onClick={() => setActiveTab('vocab')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'vocab'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Zap className="w-4 h-4" />
          High-Yield SSC Vocab
        </button>
      </div>

      {/* TAB 1: TYPING TEST */}
      {activeTab === 'typing' && (
        <div className="space-y-6">
          
          {/* Important Official Disclaimer Notice */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 leading-relaxed flex items-start gap-3">
            <Award className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="block text-amber-300">Official SSC CHSL Tier 2 Skill Test Standards:</strong>
              Typing Test for LDC/JSA requires <span className="text-white font-bold">35 words per minute (approx 10,500 KDPH) in English</span> or <span className="text-white font-bold">30 wpm (approx 9,000 KDPH) in Hindi</span>. 
              The test duration is 10 minutes. Errors exceeding 7% (UR) or 10% (Reserved) lead to disqualification in the final merit list regardless of written score.
            </div>
          </div>

          {/* Typing Stats HUD */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="glass-panel p-4 rounded-2xl border border-slate-800 text-center">
              <span className="text-[11px] text-slate-400 uppercase font-semibold">Net Speed</span>
              <div className="text-3xl font-black text-amber-400 font-mono mt-1">{netWPM} <span className="text-xs">WPM</span></div>
              <span className="text-[10px] text-slate-400">Target: {currentPassage.targetWPM} WPM</span>
            </div>

            <div className="glass-panel p-4 rounded-2xl border border-slate-800 text-center">
              <span className="text-[11px] text-slate-400 uppercase font-semibold">Accuracy</span>
              <div className="text-3xl font-black text-emerald-400 font-mono mt-1">{accuracyPercent}%</div>
              <span className="text-[10px] text-slate-400">Req: ≥ 93-95%</span>
            </div>

            <div className="glass-panel p-4 rounded-2xl border border-slate-800 text-center">
              <span className="text-[11px] text-slate-400 uppercase font-semibold">Time Remaining</span>
              <div className="text-3xl font-black text-indigo-400 font-mono mt-1">{formatTime(typingTimeLeft)}</div>
              <span className="text-[10px] text-slate-400">Total: 10 mins</span>
            </div>

            <div className="glass-panel p-4 rounded-2xl border border-slate-800 text-center">
              <span className="text-[11px] text-slate-400 uppercase font-semibold">Keystrokes</span>
              <div className="text-3xl font-black text-white font-mono mt-1">{typedText.length}</div>
              <span className="text-[10px] text-slate-400">Errors: {typedText.length - correctKeystrokes}</span>
            </div>
          </div>

          {/* Passage Selector */}
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-300">Select Practice Passage:</span>
            <div className="flex gap-2">
              {TYPING_PRACTICE_PASSAGES.map(p => (
                <button
                  key={p.id}
                  onClick={() => { setSelectedPassageId(p.id); handleResetTyping(); }}
                  className={`px-3 py-1 rounded-xl font-semibold border transition ${
                    selectedPassageId === p.id
                      ? 'bg-indigo-600 text-white border-indigo-500'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {p.language}: {p.title.split('&')[0].substring(0, 20)}...
                </button>
              ))}
            </div>
          </div>

          {/* Reference Passage Text Display */}
          <div className="glass-panel rounded-2xl p-5 border border-slate-800 font-mono text-xs sm:text-sm leading-relaxed max-h-48 overflow-y-auto select-none bg-slate-950/60">
            {currentPassage.text.split('').map((char, index) => {
              let charColor = 'text-slate-300';
              if (index < typedText.length) {
                charColor = typedText[index] === char ? 'text-emerald-400 bg-emerald-950/40' : 'text-rose-400 bg-rose-950/40 font-bold';
              } else if (index === typedText.length) {
                charColor = 'bg-amber-500 text-slate-950 font-bold underline animate-pulse';
              }
              return (
                <span key={index} className={charColor}>
                  {char}
                </span>
              );
            })}
          </div>

          {/* Typing Input Area */}
          <div className="space-y-3">
            <textarea
              value={typedText}
              onChange={handleStartTyping}
              disabled={typingFinished}
              placeholder="Click here and start typing the passage above. Timer begins on first keystroke..."
              rows={5}
              className="w-full p-4 rounded-2xl bg-slate-900 border border-slate-800 focus:border-indigo-500 text-white font-mono text-xs sm:text-sm leading-relaxed focus:outline-none resize-none"
            />

            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">
                {isTypingRunning ? '🟢 Timer running...' : typingFinished ? '🏁 Test Concluded' : '⚪ Waiting for keystrokes...'}
              </span>

              <button
                onClick={handleResetTyping}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset Passage
              </button>
            </div>
          </div>

          {/* Results Summary Modal / Callout if Finished */}
          {typingFinished && (
            <div className="p-6 rounded-3xl bg-indigo-950/30 border border-indigo-500/30 text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
              <h3 className="text-lg font-bold text-white">Typing Test Attempt Recorded</h3>
              <p className="text-xs text-slate-300">
                Net Speed: <strong className="text-amber-400">{netWPM} WPM</strong> | Accuracy: <strong className="text-emerald-400">{accuracyPercent}%</strong>
              </p>
              <div className="text-xs font-bold text-emerald-300">
                {netWPM >= currentPassage.targetWPM && accuracyPercent >= 93 
                  ? '✓ Passed Official SSC CHSL Skill Benchmark!' 
                  : 'Needs Practice: Strive for 35+ WPM and 95%+ Accuracy.'}
              </div>
            </div>
          )}

        </div>
      )}

      {/* TAB 2: SPEED MATH */}
      {activeTab === 'speed_math' && (
        <div className="space-y-6">
          {/* Fraction to Percentage Table */}
          <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              Essential Fraction-to-Percentage Equivalence Table
            </h3>
            <p className="text-xs text-slate-400">
              Directly memorizing fractions 1/2 to 1/25 saves ~40 seconds per DI and arithmetic question.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2 text-xs">
              {SPEED_MATH_DATA.fractionToPercentage.map((f, i) => (
                <div key={i} className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
                  <span className="font-bold text-indigo-400 block text-sm">{f.fraction}</span>
                  <span className="text-amber-300 font-mono text-[11px]">{f.percentage}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pythagorean Triplets */}
          <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Calculator className="w-4 h-4 text-indigo-400" />
              Standard Pythagorean Triplets for Advance Geometry & Mensuration
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              {SPEED_MATH_DATA.pythagoreanTriplets.map((p, i) => (
                <div key={i} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="font-bold text-white block text-sm font-mono">{p.triplet}</span>
                  <span className="text-slate-400 text-[11px]">{p.scalarMultiples}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: 120 GRAMMAR RULES */}
      {activeTab === 'grammar' && (
        <div className="space-y-4">
          {GRAMMAR_120_RULES.map(rule => (
            <div key={rule.ruleNumber} className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 text-xs font-bold">
                  Rule #{rule.ruleNumber}
                </span>
                <h4 className="text-sm font-bold text-white">{rule.title}</h4>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{rule.rule}</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                <div className="p-2.5 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-emerald-300">
                  <strong className="block text-[10px] text-emerald-400">CORRECT:</strong>
                  {rule.exampleCorrect}
                </div>
                <div className="p-2.5 rounded-xl bg-rose-950/20 border border-rose-500/20 text-rose-300">
                  <strong className="block text-[10px] text-rose-400">INCORRECT:</strong>
                  {rule.exampleIncorrect}
                </div>
              </div>

              <div className="text-[11px] text-amber-300 bg-amber-500/10 p-2 rounded-lg border border-amber-500/20">
                💡 <strong>SSC Exam Tip:</strong> {rule.sscTip}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 4: HIGH-YIELD VOCAB */}
      {activeTab === 'vocab' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {HIGH_YIELD_VOCABULARY.map(v => (
            <div key={v.word} className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-2">
              <div className="flex items-baseline justify-between">
                <h4 className="text-base font-bold text-white tracking-tight">{v.word}</h4>
                <span className="text-xs text-indigo-400 font-mono">[{v.partOfSpeech}]</span>
              </div>
              <p className="text-xs text-slate-300 font-medium">{v.meaning}</p>
              <div className="text-xs text-amber-300">हिंदी अर्थ: <strong>{v.hindiMeaning}</strong></div>

              <div className="text-xs text-slate-400 space-y-1 pt-1">
                <div><strong className="text-emerald-400">Synonyms:</strong> {v.synonyms.join(', ')}</div>
                <div><strong className="text-rose-400">Antonyms:</strong> {v.antonyms.join(', ')}</div>
              </div>

              <div className="text-[11px] text-indigo-300 bg-indigo-950/30 p-2 rounded-lg border border-indigo-500/20">
                🧠 <strong>Mnemonic:</strong> {v.mnemonic}
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
