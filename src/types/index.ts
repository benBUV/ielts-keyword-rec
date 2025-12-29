export interface Option {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
  withCount?: boolean;
}

export enum QuestionType {
  Part1 = 'part1',
  Part2 = 'part2',
  Part3 = 'part3',
}

export interface Question {
  id: string;
  type: QuestionType;
  text: string; // Text question displayed to the user
  keywords: string[]; // Required keywords that must be present in the response
  optionalKeywords?: string[]; // Optional keywords for "excellent" rating
  media?: string; // Optional: URL for audio/video content (not used in keyword matching mode)
  card?: {
    title: string;
    subtitle?: string;
    bullets: string[];
  };
}

export interface QuestionBank {
  id: string;
  name: string;
  description: string;
  author?: string;
  version?: string;
  questions: Question[];
}

export interface Recording {
  id: string;
  questionId: string;
  audioBlob: Blob;
  transcript: string;
  duration: number;
  timestamp: number;
  isCorrect: boolean; // Whether all required keywords were found in the transcript
  quality?: 'excellent' | 'good'; // Quality rating based on optional keywords
  matchedKeywords: string[]; // Required keywords that were found
  missedKeywords: string[]; // Required keywords that were not found
  matchedOptionalKeywords?: string[]; // Optional keywords that were found
}

export enum AppPhase {
  Loading = 'loading',
  Ready = 'ready',
  Preparation = 'preparation',
  Recording = 'recording',
  Review = 'review',
}

export interface AppState {
  phase: AppPhase;
  currentQuestionIndex: number;
  recordings: Recording[];
  isAudioPlaying: boolean;
}

