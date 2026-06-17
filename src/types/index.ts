export type Cell = string | null;
export type Grid = Cell[][];

export interface HintPosition {
  row: number;
  col: number;
}

export interface PuzzleData {
  id: string;
  name: string;
  grid: Grid;
  hints: HintPosition[];
  width: number;
  height: number;
}

export interface GameState {
  puzzleId: string;
  playerGrid: Grid;
  selectedCell: { row: number; col: number } | null;
  remainingLetters: string[];
  startTime: number;
  completed: boolean;
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  time: number;
  completedAt: string;
}
