export type ExamTier = 'tier1' | 'tier2';

export type SubjectId = 'quantitative_aptitude' | 'reasoning' | 'english' | 'general_awareness' | 'computer_knowledge';

export type DifficultyLevel = 'easy' | 'medium' | 'difficult';

export type QuestionSourceType = 'verified_pyq' | 'original_practice' | 'awaiting_verification';

export type MistakeCategory = 
  | 'concept_not_understood'
  | 'formula_forgotten'
  | 'calculation_error'
  | 'question_misread'
  | 'guessing'
  | 'time_pressure';

export interface QuestionOption {
  id: 'A' | 'B' | 'C' | 'D';
  text: string;
  isCorrect: boolean;
  distractorExplanation?: string; // Why this option is wrong or how it acts as a trap
}

export interface Question {
  id: string;
  tier: ExamTier | 'both';
  subjectId: SubjectId;
  topicId: string;
  topicName: string;
  subtopicName?: string;
  difficulty: DifficultyLevel;
  questionText: string;
  questionImageUrl?: string;
  options: QuestionOption[];
  correctOptionId: 'A' | 'B' | 'C' | 'D';
  explanation: {
    mainConcept: string;
    stepByStep: string[];
    shortcutOrTrick?: string;
    commonTrap?: string;
  };
  sourceType: QuestionSourceType;
  examYear?: number;
  examShift?: string; // e.g. "SSC CHSL 2023 Tier 1 Shift 2"
  sourceCitation?: string;
  verificationStatus: 'verified' | 'pending';
}

export interface SyllabusSubtopic {
  id: string;
  name: string;
  weightageTier1Questions: string; // e.g. "2-3 Qs"
  weightageTier2Questions?: string;
  difficulty: 'Foundation' | 'Moderate' | 'Advanced';
  status: 'not_started' | 'in_progress' | 'completed' | 'needs_revision';
  pyqCount: number;
}

export interface SyllabusTopic {
  id: string;
  subjectId: SubjectId;
  subjectName: string;
  tier: ExamTier | 'both';
  name: string;
  description: string;
  officialNotificationReference: string;
  subtopics: SyllabusSubtopic[];
  weightageDescription: string;
  hasLesson: boolean;
}

export interface ConceptLesson {
  topicId: string;
  topicName: string;
  subjectId: SubjectId;
  tier: ExamTier | 'both';
  prerequisites: string[];
  simpleExplanation: string;
  definitionsAndRules: string[];
  importantFormulas: Array<{ formula: string; description: string; tip?: string }>;
  stepByStepExamples: Array<{
    title: string;
    problem: string;
    steps: string[];
    answer: string;
    shortcut?: string;
  }>;
  shortcutsAndTechniques: string[];
  commonTrapsAndMistakes: string[];
  easyPracticeQuestions: Question[];
  mediumPracticeQuestions: Question[];
  examLevelPracticeQuestions: Question[];
  verifiedPYQs: Question[];
  shortRevisionNotes: string[];
}

export interface MockTestConfig {
  id: string;
  title: string;
  tier: ExamTier;
  type: 'full_length' | 'sectional' | 'topic' | 'pyq_paper';
  durationMinutes: number;
  totalMarks: number;
  markingScheme: {
    correct: number;
    incorrect: number;
  };
  sections: Array<{
    subjectId: SubjectId;
    title: string;
    questionCount: number;
    totalMarks: number;
  }>;
  questions: Question[];
  description: string;
  isOfficialPattern: boolean;
}

export interface TestAttemptResult {
  attemptId: string;
  testId: string;
  testTitle: string;
  tier: ExamTier;
  timestamp: number;
  timeSpentSeconds: number;
  totalQuestions: number;
  attemptedCount: number;
  correctCount: number;
  incorrectCount: number;
  unattemptedCount: number;
  accuracyPercentage: number;
  totalMarksScored: number;
  maxMarks: number;
  subjectBreakdown: Record<SubjectId, {
    total: number;
    attempted: number;
    correct: number;
    incorrect: number;
    marks: number;
    accuracy: number;
  }>;
  topicAccuracy: Record<string, { total: number; correct: number; accuracy: number }>;
  userResponses: Record<string, {
    selectedOptionId: 'A' | 'B' | 'C' | 'D' | null;
    timeSpentSeconds: number;
    isCorrect: boolean;
    markedForReview: boolean;
  }>;
  timeSinkQuestions: string[]; // Question IDs where student spent > 120s
  patternDiagnosis: {
    primaryPraise?: string;
    speedVsAccuracyNote: string;
    weakestTopic: string;
    actionableAdvice: string[];
  };
}

export interface MistakeNotebookEntry {
  id: string;
  questionId: string;
  questionText: string;
  topicName: string;
  subjectId: SubjectId;
  selectedOptionId: 'A' | 'B' | 'C' | 'D';
  correctOptionId: 'A' | 'B' | 'C' | 'D';
  explanation: string;
  attemptedAt: number;
  mistakeCategory: MistakeCategory;
  studentNotes?: string;
  isResolved: boolean;
  followUpSolvedAt?: number;
}

export interface StudyPlanDayTask {
  id: string;
  title: string;
  type: 'concept' | 'practice' | 'pyq' | 'revision' | 'mock_test' | 'buffer';
  subjectId?: SubjectId;
  topicName?: string;
  estimatedMinutes: number;
  isCompleted: boolean;
  priority: 'high' | 'medium' | 'low';
}

export interface StudyPlanDay {
  dayNumber: number;
  dateStr?: string;
  isBufferDay: boolean;
  isCompleted: boolean;
  tasks: StudyPlanDayTask[];
}

export interface PersonalizedStudyPlan {
  id: string;
  studentName: string;
  targetExam: 'SSC CHSL 2026';
  durationDays: 30 | 45 | 60 | 90 | number;
  level: 'beginner' | 'intermediate' | 'advanced';
  dailyHours: number;
  strongSubjects: SubjectId[];
  weakSubjects: SubjectId[];
  preferredLanguage: 'English' | 'Hinglish';
  createdAt: number;
  days: StudyPlanDay[];
}

export interface SpacedRevisionCard {
  id: string;
  topicId: string;
  topicName: string;
  subjectId: SubjectId;
  type: 'formula' | 'vocabulary' | 'gk_flashcard' | 'wrong_question';
  front: string;
  back: string;
  explanation?: string;
  lastReviewedAt?: number;
  nextReviewAt: number;
  intervalDays: number;
  repetitionCount: number;
  easeFactor: number;
  timesForgotten: number;
}

export interface TypingTestResult {
  id: string;
  timestamp: number;
  passageTitle: string;
  language: 'English' | 'Hindi';
  targetWPM: number;
  actualWPM: number;
  accuracyPercentage: number;
  totalKeystrokes: number;
  errorCount: number;
  durationSeconds: number;
  passedOfficialBenchmark: boolean;
}
