import { Grid, HintPosition } from "@/types";

interface SeedPuzzle {
  name: string;
  grid: Grid;
  hints: HintPosition[];
}

export const SEED_PUZZLES: SeedPuzzle[] = [
  {
    name: "Puzzle #1 - Starter",
    grid: [
      [null, null, null, "F", null, null, null, null, null],
      [null, null, null, "L", null, null, null, null, null],
      [null, "Q", "U", "A", "R", "T", "Z", null, null],
      [null, null, null, "M", null, "H", null, null, null],
      [null, null, null, "E", null, "E", null, null, null],
      ["J", "O", "K", "S", null, "N", null, null, null],
      [null, null, null, null, null, null, null, null, null],
      [null, "P", "I", "G", null, "W", "A", "X", "Y"],
      [null, null, null, null, null, null, "V", null, null],
      [null, null, "B", "U", "D", null, "E", null, null],
      [null, null, null, null, null, null, "R", null, null],
    ],
    hints: [
      { row: 2, col: 1 },
      { row: 5, col: 0 },
      { row: 7, col: 5 },
      { row: 9, col: 2 },
    ],
  },
  {
    name: "Puzzle #2 - Crosswords",
    grid: [
      [null, null, "V", null, null, null, null],
      [null, null, "O", null, null, null, null],
      [null, null, "W", null, null, null, null],
      ["J", "U", "S", "T", null, null, null],
      [null, null, null, "H", null, null, null],
      [null, null, null, "E", null, null, null],
      [null, "Q", "U", "I", "Z", null, null],
      [null, null, null, "R", null, null, null],
      [null, null, null, null, null, null, null],
      ["F", "L", "A", "G", null, null, null],
      [null, null, null, null, null, null, null],
      [null, "B", "R", "I", "C", "K", null],
      [null, null, null, null, null, null, null],
      [null, "P", "L", "U", "M", "B", null],
      [null, null, null, null, null, null, null],
      [null, "D", "A", "W", "N", null, null],
      [null, null, null, null, null, null, null],
      [null, null, "H", "E", "X", null, null],
      [null, null, null, null, null, "Y", null],
    ],
    hints: [
      { row: 3, col: 0 },
      { row: 6, col: 1 },
      { row: 9, col: 0 },
      { row: 11, col: 1 },
    ],
  },
];

export function validatePuzzleUsesAllLetters(grid: Grid): {
  valid: boolean;
  missing: string[];
  duplicates: string[];
} {
  const letterCounts: Record<string, number> = {};
  for (const row of grid) {
    for (const cell of row) {
      if (cell) {
        const letter = cell.toUpperCase();
        letterCounts[letter] = (letterCounts[letter] || 0) + 1;
      }
    }
  }

  const missing: string[] = [];
  const duplicates: string[] = [];

  for (let i = 0; i < 26; i++) {
    const letter = String.fromCharCode(65 + i);
    const count = letterCounts[letter] || 0;
    if (count === 0) missing.push(letter);
    if (count > 1) duplicates.push(letter);
  }

  return { valid: missing.length === 0 && duplicates.length === 0, missing, duplicates };
}

export function checkSolution(playerGrid: Grid, solutionGrid: Grid): boolean {
  for (let r = 0; r < solutionGrid.length; r++) {
    for (let c = 0; c < solutionGrid[r].length; c++) {
      const solution = solutionGrid[r][c];
      const player = playerGrid[r]?.[c] ?? null;
      if (solution === null && player === null) continue;
      if (solution?.toUpperCase() !== player?.toUpperCase()) return false;
    }
  }
  return true;
}
