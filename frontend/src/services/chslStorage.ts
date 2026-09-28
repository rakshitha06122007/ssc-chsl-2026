import { 
  MistakeNotebookEntry, 
  TestAttemptResult, 
  PersonalizedStudyPlan, 
  SpacedRevisionCard, 
  TypingTestResult,
  ExamTier
} from '../types/chsl';

const STORAGE_KEYS = {
  STUDY_PLAN: 'chsl_study_plan',
  MISTAKES: 'chsl_mistake_notebook',
  TEST_RESULTS: 'chsl_test_results',
  TOPIC_PROGRESS: 'chsl_topic_progress',
  REVISION_CARDS: 'chsl_revision_cards',
  TYPING_HISTORY: 'chsl_typing_history',
  STREAK_STATS: 'chsl_streak_stats',
  ACTIVE_TIER: 'chsl_active_tier'
};

export interface TopicProgressState {
  topicId: string;
  comprehensionStatus: 'understood' | 'partially_understood' | 'difficult' | 'none';
  lessonRead: boolean;
  practiceSolvedCount: number;
  lastStudiedAt: number;
}

export interface StreakStats {
  currentStreak: number;
  bestStreak: number;
  lastStudyDate: string; // YYYY-MM-DD
  totalMinutesStudied: number;
  streakDisabled: boolean;
}

export class CHSLStorageService {
  // Active Tier
  static getActiveTier(): ExamTier {
    return (localStorage.getItem(STORAGE_KEYS.ACTIVE_TIER) as ExamTier) || 'tier1';
  }

  static setActiveTier(tier: ExamTier): void {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_TIER, tier);
  }

  // Topic Progress
  static getTopicProgress(topicId: string): TopicProgressState {
    const all = this.getAllTopicProgress();
    return all[topicId] || {
      topicId,
      comprehensionStatus: 'none',
      lessonRead: false,
      practiceSolvedCount: 0,
      lastStudiedAt: 0
    };
  }

  static getAllTopicProgress(): Record<string, TopicProgressState> {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TOPIC_PROGRESS);
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  }

  static saveTopicProgress(progress: TopicProgressState): void {
    const all = this.getAllTopicProgress();
    all[progress.topicId] = {
      ...progress,
      lastStudiedAt: Date.now()
    };
    localStorage.setItem(STORAGE_KEYS.TOPIC_PROGRESS, JSON.stringify(all));
  }

  // Mistake Notebook
  static getMistakes(): MistakeNotebookEntry[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.MISTAKES);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  static addMistake(entry: Omit<MistakeNotebookEntry, 'id' | 'attemptedAt' | 'isResolved'>): MistakeNotebookEntry {
    const mistakes = this.getMistakes();
    const newEntry: MistakeNotebookEntry = {
      ...entry,
      id: 'mistake_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      attemptedAt: Date.now(),
      isResolved: false
    };
    mistakes.unshift(newEntry);
    localStorage.setItem(STORAGE_KEYS.MISTAKES, JSON.stringify(mistakes));
    return newEntry;
  }

  static resolveMistake(mistakeId: string): void {
    const mistakes = this.getMistakes().map(m => 
      m.id === mistakeId ? { ...m, isResolved: true, followUpSolvedAt: Date.now() } : m
    );
    localStorage.setItem(STORAGE_KEYS.MISTAKES, JSON.stringify(mistakes));
  }

  static updateMistakeNotes(mistakeId: string, notes: string): void {
    const mistakes = this.getMistakes().map(m => 
      m.id === mistakeId ? { ...m, studentNotes: notes } : m
    );
    localStorage.setItem(STORAGE_KEYS.MISTAKES, JSON.stringify(mistakes));
  }

  // Test Results
  static getTestResults(): TestAttemptResult[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TEST_RESULTS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  static saveTestResult(result: TestAttemptResult): void {
    const results = this.getTestResults();
    results.unshift(result);
    localStorage.setItem(STORAGE_KEYS.TEST_RESULTS, JSON.stringify(results));
  }

  // Study Plan
  static getStudyPlan(): PersonalizedStudyPlan | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.STUDY_PLAN);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  static saveStudyPlan(plan: PersonalizedStudyPlan): void {
    localStorage.setItem(STORAGE_KEYS.STUDY_PLAN, JSON.stringify(plan));
  }

  static togglePlanTask(dayIndex: number, taskId: string): PersonalizedStudyPlan | null {
    const plan = this.getStudyPlan();
    if (!plan || !plan.days[dayIndex]) return null;
    
    const task = plan.days[dayIndex].tasks.find(t => t.id === taskId);
    if (task) {
      task.isCompleted = !task.isCompleted;
      plan.days[dayIndex].isCompleted = plan.days[dayIndex].tasks.every(t => t.isCompleted);
      this.saveStudyPlan(plan);
    }
    return plan;
  }

  // Spaced Revision
  static getRevisionCards(): SpacedRevisionCard[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.REVISION_CARDS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  static saveRevisionCards(cards: SpacedRevisionCard[]): void {
    localStorage.setItem(STORAGE_KEYS.REVISION_CARDS, JSON.stringify(cards));
  }

  // Typing Tests
  static getTypingHistory(): TypingTestResult[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TYPING_HISTORY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  static saveTypingResult(result: TypingTestResult): void {
    const history = this.getTypingHistory();
    history.unshift(result);
    localStorage.setItem(STORAGE_KEYS.TYPING_HISTORY, JSON.stringify(history));
  }

  // Streak & Habits
  static getStreakStats(): StreakStats {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.STREAK_STATS);
      if (data) return JSON.parse(data);
    } catch {}
    return {
      currentStreak: 1,
      bestStreak: 1,
      lastStudyDate: new Date().toISOString().split('T')[0],
      totalMinutesStudied: 45,
      streakDisabled: false
    };
  }

  static recordStudySession(minutes: number): StreakStats {
    const stats = this.getStreakStats();
    const today = new Date().toISOString().split('T')[0];
    stats.totalMinutesStudied += minutes;

    if (stats.lastStudyDate !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      if (stats.lastStudyDate === yesterdayStr) {
        stats.currentStreak += 1;
        if (stats.currentStreak > stats.bestStreak) {
          stats.bestStreak = stats.currentStreak;
        }
      } else {
        stats.currentStreak = 1;
      }
      stats.lastStudyDate = today;
    }

    localStorage.setItem(STORAGE_KEYS.STREAK_STATS, JSON.stringify(stats));
    return stats;
  }

  static toggleStreakDisabled(disabled: boolean): void {
    const stats = this.getStreakStats();
    stats.streakDisabled = disabled;
    localStorage.setItem(STORAGE_KEYS.STREAK_STATS, JSON.stringify(stats));
  }

  // Export / Import Backup
  static exportBackup(): string {
    const backup = {
      studyPlan: this.getStudyPlan(),
      mistakes: this.getMistakes(),
      testResults: this.getTestResults(),
      topicProgress: this.getAllTopicProgress(),
      typingHistory: this.getTypingHistory(),
      streakStats: this.getStreakStats(),
      exportedAt: new Date().toISOString()
    };
    return JSON.stringify(backup, null, 2);
  }

  static importBackup(jsonString: string): boolean {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.mistakes) localStorage.setItem(STORAGE_KEYS.MISTAKES, JSON.stringify(parsed.mistakes));
      if (parsed.testResults) localStorage.setItem(STORAGE_KEYS.TEST_RESULTS, JSON.stringify(parsed.testResults));
      if (parsed.topicProgress) localStorage.setItem(STORAGE_KEYS.TOPIC_PROGRESS, JSON.stringify(parsed.topicProgress));
      if (parsed.studyPlan) localStorage.setItem(STORAGE_KEYS.STUDY_PLAN, JSON.stringify(parsed.studyPlan));
      if (parsed.typingHistory) localStorage.setItem(STORAGE_KEYS.TYPING_HISTORY, JSON.stringify(parsed.typingHistory));
      return true;
    } catch {
      return false;
    }
  }
}
