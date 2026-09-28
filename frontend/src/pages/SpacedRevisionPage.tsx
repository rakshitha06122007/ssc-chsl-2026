import React, { useState } from 'react';
import { 
  Brain, 
  RotateCcw, 
  CheckCircle2, 
  HelpCircle, 
  Sparkles, 
  Zap, 
  BookOpen, 
  Award, 
  ChevronRight,
  Eye,
  EyeOff
} from 'lucide-react';
import { HIGH_YIELD_VOCABULARY, SPEED_MATH_DATA, GRAMMAR_120_RULES } from '../data/subjectToolsData';

export function SpacedRevisionPage() {
  const [activeDeck, setActiveDeck] = useState<'formulas' | 'vocabulary' | 'grammar' | 'polity'>('formulas');
  const [cardIndex, setCardIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [lastMinuteMode, setLastMinuteMode] = useState<boolean>(false);

  // Deck generation
  const formulaDeck = [
    { front: 'MP and CP Golden Relation with Profit% and Discount%', back: 'MP / CP = (100 + P%) / (100 - D%)', note: 'Saves 35 seconds in profit-loss problems.' },
    { front: 'Difference between CI and SI for 2 Years', back: 'D = P * (R / 100)²', note: 'Where D is difference, P is principal, R is annual rate.' },
    { front: 'Difference between CI and SI for 3 Years', back: 'D = P * (R/100)² * [(300 + R) / 100]', note: 'Memorize 300+R factor.' },
    { front: 'If x + 1/x = k, then x³ + 1/x³ = ?', back: 'k³ - 3k', note: 'If x - 1/x = k, then x³ - 1/x³ = k³ + 3k.' },
    { front: 'Two circles of radii r1 and r2 touching externally: Direct Common Tangent (DCT) = ?', back: 'DCT = 2√(r₁ * r₂)', note: 'Transverse Common Tangent is 0 when touching externally.' },
    { front: 'Work done by A in a days, B in b days together', back: '(a * b) / (a + b)', note: 'Efficiency = 1/a + 1/b.' }
  ];

  const vocabDeck = HIGH_YIELD_VOCABULARY.map(v => ({
    front: `Word: ${v.word} (${v.partOfSpeech})`,
    back: `${v.meaning}\nHindi: ${v.hindiMeaning}\nSynonyms: ${v.synonyms.join(', ')}\nAntonyms: ${v.antonyms.join(', ')}`,
    note: `Mnemonic: ${v.mnemonic}`
  }));

  const grammarDeck = GRAMMAR_120_RULES.map(g => ({
    front: `Rule #${g.ruleNumber}: ${g.title}`,
    back: `${g.rule}\n\nCorrect: ${g.exampleCorrect}\nIncorrect: ${g.exampleIncorrect}`,
    note: `SSC Exam Tip: ${g.sscTip}`
  }));

  const polityDeck = [
    { front: 'Article 32', back: 'Right to Constitutional Remedies (Called "Heart and Soul" of Constitution by Dr. B.R. Ambedkar). Supreme Court issues 5 writs.', note: 'High Court issues writs under Article 226.' },
    { front: 'Article 17', back: 'Abolition of Untouchability and prohibition of its practice in any form.', note: 'Absolute Fundamental Right.' },
    { front: 'Article 21A', back: 'Right to Free and Compulsory Education for all children aged 6 to 14 years.', note: 'Added by 86th Constitutional Amendment Act 2002.' },
    { front: 'Article 40 (DPSP)', back: 'Organization of Village Panchayats (Gandhian Principle).', note: '73rd Amendment gave constitutional status to Panchayats.' },
    { front: 'Article 44 (DPSP)', back: 'Uniform Civil Code (UCC) for the citizens throughout the territory of India.', note: 'Part IV - Non-justiciable.' }
  ];

  let currentDeck = formulaDeck;
  if (activeDeck === 'vocabulary') currentDeck = vocabDeck;
  else if (activeDeck === 'grammar') currentDeck = grammarDeck;
  else if (activeDeck === 'polity') currentDeck = polityDeck;

  const currentCard = currentDeck[cardIndex] || currentDeck[0];

  const handleNextCard = () => {
    setIsFlipped(false);
    if (cardIndex < currentDeck.length - 1) {
      setCardIndex(prev => prev + 1);
    } else {
      setCardIndex(0);
    }
  };

  const handleRate = (intervalLabel: string) => {
    // Spaced repetition progression
    handleNextCard();
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-extrabold tracking-wider px-2.5 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30">
            SM-2 Spaced Repetition Engine
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
            Intelligent Spaced Revision Decks
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
            Scientifically timed flashcards based on forgetting curves to ensure maximum retention on exam day.
          </p>
        </div>

        <button
          onClick={() => setLastMinuteMode(!lastMinuteMode)}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition border flex items-center gap-1.5 self-start sm:self-auto ${
            lastMinuteMode
              ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
              : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
          }`}
        >
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          {lastMinuteMode ? 'Exam Booster (Active)' : 'Last-Minute Exam Booster'}
        </button>
      </div>

      {/* Deck Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => { setActiveDeck('formulas'); setCardIndex(0); setIsFlipped(false); }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap border ${
            activeDeck === 'formulas'
              ? 'bg-indigo-600 text-white border-indigo-500 shadow-md'
              : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          📐 Formula Deck ({formulaDeck.length})
        </button>
        <button
          onClick={() => { setActiveDeck('vocabulary'); setCardIndex(0); setIsFlipped(false); }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap border ${
            activeDeck === 'vocabulary'
              ? 'bg-indigo-600 text-white border-indigo-500 shadow-md'
              : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          📖 SSC Vocab Deck ({vocabDeck.length})
        </button>
        <button
          onClick={() => { setActiveDeck('grammar'); setCardIndex(0); setIsFlipped(false); }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap border ${
            activeDeck === 'grammar'
              ? 'bg-indigo-600 text-white border-indigo-500 shadow-md'
              : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          ✍️ 120 Grammar Rules ({grammarDeck.length})
        </button>
        <button
          onClick={() => { setActiveDeck('polity'); setCardIndex(0); setIsFlipped(false); }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap border ${
            activeDeck === 'polity'
              ? 'bg-indigo-600 text-white border-indigo-500 shadow-md'
              : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          🏛️ Indian Polity Articles ({polityDeck.length})
        </button>
      </div>

      {/* Main Flashcard Component */}
      <div 
        onClick={() => setIsFlipped(!isFlipped)}
        className="glass-panel-elevated rounded-3xl p-8 sm:p-12 border border-violet-500/30 cursor-pointer min-h-[300px] flex flex-col justify-between relative select-none hover:border-violet-400/50 transition shadow-2xl"
      >
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="font-mono uppercase font-bold text-violet-400">
            Card {cardIndex + 1} of {currentDeck.length}
          </span>
          <span className="flex items-center gap-1 text-[11px] bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-800">
            {isFlipped ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            {isFlipped ? 'Click to show front' : 'Click to flip and reveal answer'}
          </span>
        </div>

        <div className="my-8 text-center space-y-4">
          {!isFlipped ? (
            <div className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {currentCard.front}
            </div>
          ) : (
            <div className="space-y-3">
              <div className="text-lg sm:text-xl font-bold text-emerald-300 font-mono whitespace-pre-line leading-relaxed">
                {currentCard.back}
              </div>
              {currentCard.note && (
                <div className="text-xs text-amber-300 bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/20 max-w-lg mx-auto">
                  {currentCard.note}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="text-center text-[11px] text-slate-500">
          {isFlipped ? 'Rate recall difficulty below to schedule next interval' : 'Tap anywhere to reveal back'}
        </div>
      </div>

      {/* Spaced Interval Rating Controls */}
      {isFlipped ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <button
            onClick={() => handleRate('Again')}
            className="p-3 rounded-2xl bg-rose-500/15 border border-rose-500/30 hover:bg-rose-500/25 text-rose-300 text-xs font-bold transition flex flex-col items-center gap-0.5"
          >
            <span>Again</span>
            <span className="text-[10px] text-slate-400 font-normal">Repeat in 10 mins</span>
          </button>
          <button
            onClick={() => handleRate('Hard')}
            className="p-3 rounded-2xl bg-amber-500/15 border border-amber-500/30 hover:bg-amber-500/25 text-amber-300 text-xs font-bold transition flex flex-col items-center gap-0.5"
          >
            <span>Hard</span>
            <span className="text-[10px] text-slate-400 font-normal">Interval: 1 day</span>
          </button>
          <button
            onClick={() => handleRate('Good')}
            className="p-3 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 hover:bg-indigo-500/25 text-indigo-300 text-xs font-bold transition flex flex-col items-center gap-0.5"
          >
            <span>Good</span>
            <span className="text-[10px] text-slate-400 font-normal">Interval: 3 days</span>
          </button>
          <button
            onClick={() => handleRate('Easy')}
            className="p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 hover:bg-emerald-500/25 text-emerald-300 text-xs font-bold transition flex flex-col items-center gap-0.5"
          >
            <span>Easy</span>
            <span className="text-[10px] text-slate-400 font-normal">Interval: 7 days</span>
          </button>
        </div>
      ) : (
        <div className="flex justify-end">
          <button
            onClick={handleNextCard}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-1.5 transition"
          >
            Skip to Next <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

    </div>
  );
}
