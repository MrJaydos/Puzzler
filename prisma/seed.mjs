import { execSync } from "child_process";
import { readFileSync, existsSync } from "fs";
import Database from "better-sqlite3";

// Direct SQLite access for seeding since Prisma's generated client
// requires a bundler for module resolution

import { dirname, join } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_PATH = join(__dirname, "..", "dev.db");

const SEED_PUZZLES = [
  {
    id: "puzzle--1---starter",
    name: "Puzzle #1 - Starter",
    grid: JSON.stringify([
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
    ]),
    hints: JSON.stringify([
      { row: 2, col: 1 },
      { row: 5, col: 0 },
      { row: 7, col: 5 },
      { row: 9, col: 2 },
    ]),
    width: 9,
    height: 11,
  },
  {
    id: "puzzle--2---crosswords",
    name: "Puzzle #2 - Crosswords",
    grid: JSON.stringify([
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
    ]),
    hints: JSON.stringify([
      { row: 3, col: 0 },
      { row: 6, col: 1 },
      { row: 9, col: 0 },
      { row: 11, col: 1 },
    ]),
    width: 7,
    height: 19,
  },
];

// Use better-sqlite3 directly
const db = new Database(DB_PATH);

const stmt = db.prepare(`
  INSERT OR REPLACE INTO Puzzle (id, name, grid, hints, width, height, active, createdAt)
  VALUES (?, ?, ?, ?, ?, ?, 1, datetime('now'))
`);

for (const puzzle of SEED_PUZZLES) {
  stmt.run(puzzle.id, puzzle.name, puzzle.grid, puzzle.hints, puzzle.width, puzzle.height);
}

console.log("Seeded", SEED_PUZZLES.length, "puzzles successfully");
db.close();
