export type TaskPair = [number, number];

export type DrillTask = [number, number, number, number];

export interface PreviousResult {
  actual?: number;
  actuals: number[];
  id: number;
  task: DrillTask;
  timeTaken: number;
}

export interface ScoreRecord {
  completed: boolean;
  correctCount: number;
  date: number;
  incorrectCount: number;
  key: string;
  levelIndex: number;
  minutes: number | string;
  opIndexes: number[];
  previousResults: PreviousResult[];
  questionsRemaining: number;
  timeLeft: number;
  timePerQuestion: number;
  timeTaken: number;
  totalProblems: number | string;
}

export interface ScoresContainerV2 {
  scores: ScoreRecord[];
  version: 2;
}

export interface ScoresContainerV3 {
  scores: ScoreRecord[];
  version: 3;
}

export interface DrillOptions {
  largeKeyboard: boolean;
  levelIndex: number;
  minutes: string;
  onscreenKeyboard: boolean;
  opIndex?: number;
  opIndexes: number[];
  totalProblems: string;
  userName: string;
}

export interface DrillResults {
  correctCount: number;
  levelIndex: number;
  minutes: number;
  opIndexes: number[];
  previousResults: PreviousResult[];
  questionsRemaining: number;
  timeLeft: number;
  totalProblems: number;
}

export interface ResultInfo {
  newRecordInfo?: string;
  text?: string;
}

export interface ScoreBarTime {
  date: number;
  timePerQuestion: number;
}

export interface ScoreboardData {
  levels: Array<{ [key: string]: number[] } | undefined>;
  ops: Set<string>;
  totals: number[];
}

export interface PreviousResultsStats {
  correctCount: number;
  incorrects: PreviousResult[];
  longestTime?: PreviousResult;
  shortestTime?: PreviousResult;
  totalTime: number;
}

export interface NewRecordComparison {
  currentTimePerQuestion: number;
  existingRecordTimePerQuestion: number;
  isNewRecord: boolean;
}
