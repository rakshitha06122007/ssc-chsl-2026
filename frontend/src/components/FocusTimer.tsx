import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Bell, Moon, Maximize2, Minimize2 } from 'lucide-react';
import { CHSLStorageService } from '../services/chslStorage';

interface FocusTimerProps {
  onClose?: () => void;
}

export function FocusTimer({ onClose }: FocusTimerProps) {
  const [mode, setMode] = useState<'study' | 'short_break' | 'long_break'>('study');
  const [timeLeft, setTimeLeft] = useState<number>(25 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isDistractionFree, setIsDistractionFree] = useState<boolean>(false);
  const [sessionCompletedCount, setSessionCompletedCount] = useState<number>(0);

  useEffect(() => {
    let interval: any = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      setIsRunning(false);
      // Play audio notification chime
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5 note
        gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.8);
      } catch {}

      if (mode === 'study') {
        CHSLStorageService.recordStudySession(25);
        setSessionCompletedCount(prev => prev + 1);
        setMode('short_break');
        setTimeLeft(5 * 60);
      } else {
        setMode('study');
        setTimeLeft(25 * 60);
      }
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, mode]);

  const switchMode = (newMode: 'study' | 'short_break' | 'long_break') => {
    setMode(newMode);
    setIsRunning(false);
    if (newMode === 'study') setTimeLeft(25 * 60);
    else if (newMode === 'short_break') setTimeLeft(5 * 60);
    else setTimeLeft(15 * 60);
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progressPercent = mode === 'study' 
    ? ((25 * 60 - timeLeft) / (25 * 60)) * 100 
    : mode === 'short_break' 
      ? ((5 * 60 - timeLeft) / (5 * 60)) * 100 
      : ((15 * 60 - timeLeft) / (15 * 60)) * 100;

  return (
    <div className={`transition-all duration-300 ${
      isDistractionFree 
        ? 'fixed inset-0 z-50 bg-[#090d16] flex flex-col items-center justify-center p-6' 
        : 'glass-panel rounded-2xl p-5 border border-indigo-500/20'
    }`}>
      <div className="flex items-center justify-between mb-4 w-full max-w-md">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400">
            <Bell className="w-4 h-4" />
          </span>
          <span className="text-sm font-semibold text-slate-200">
            {mode === 'study' ? 'Deep Focus Session' : mode === 'short_break' ? 'Short Recovery Break' : 'Extended Rest Break'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsDistractionFree(!isDistractionFree)}
            title="Toggle Distraction-Free Mode"
            className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            {isDistractionFree ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
          {onClose && !isDistractionFree && (
            <button onClick={onClose} className="text-slate-400 hover:text-white text-xs px-2 py-1">✕</button>
          )}
        </div>
      </div>

      {/* Mode Switcher */}
      <div className="flex bg-slate-900/80 p-1 rounded-xl mb-6 border border-slate-800 w-full max-w-xs justify-center">
        <button
          onClick={() => switchMode('study')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
            mode === 'study' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Study (25m)
        </button>
        <button
          onClick={() => switchMode('short_break')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
            mode === 'short_break' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Short Break (5m)
        </button>
        <button
          onClick={() => switchMode('long_break')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
            mode === 'long_break' ? 'bg-amber-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Long Break (15m)
        </button>
      </div>

      {/* Timer Display */}
      <div className="relative w-44 h-44 flex items-center justify-center mb-6">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="44"
            className="stroke-slate-800"
            strokeWidth="6"
            fill="transparent"
          />
          <circle
            cx="50"
            cy="50"
            r="44"
            className={`${mode === 'study' ? 'stroke-indigo-500' : 'stroke-emerald-400'} transition-all duration-500`}
            strokeWidth="6"
            strokeDasharray={276.4}
            strokeDashoffset={276.4 - (276.4 * progressPercent) / 100}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="text-4xl font-extrabold tracking-tight font-mono text-white">
            {formatTime(timeLeft)}
          </span>
          <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider mt-1">
            {isRunning ? 'Session Active' : 'Paused'}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsRunning(!isRunning)}
          className={`px-6 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 shadow-lg transition active:scale-95 ${
            isRunning 
              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30 hover:bg-rose-500/30' 
              : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/20'
          }`}
        >
          {isRunning ? <><Pause className="w-4 h-4" /> Pause</> : <><Play className="w-4 h-4 fill-white" /> Start Focus</>}
        </button>
        <button
          onClick={() => {
            setIsRunning(false);
            if (mode === 'study') setTimeLeft(25 * 60);
            else if (mode === 'short_break') setTimeLeft(5 * 60);
            else setTimeLeft(15 * 60);
          }}
          title="Reset Timer"
          className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      <div className="mt-4 text-xs text-slate-400 flex items-center gap-3">
        <span>Completed: <strong className="text-indigo-400">{sessionCompletedCount}</strong> sessions</span>
        <span>•</span>
        <span>Habit: <strong className="text-emerald-400">Non-toxic focus</strong></span>
      </div>
    </div>
  );
}
