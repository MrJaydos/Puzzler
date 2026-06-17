import Database from "better-sqlite3";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

const dbUrl = process.env.DATABASE_URL || "file:./dev.db";
const DB_PATH = dbUrl.startsWith("file:")
  ? dbUrl.slice("file:".length)
  : join(__dirname, "..", "dev.db");

const SEED_PUZZLES = [
  {
    id: "easy-1-starter",
    name: "Easy #1 - Starter",
    difficulty: "easy",
    grid: JSON.stringify([[null,"J",null,null,null,null,null,null,null,null],["B","A","C","K",null,null,null,null,null,null],[null,"W",null,null,"X",null,null,null,null,null],[null,"S","Q","U","I","D",null,null,null,null],[null,null,null,"M",null,"O","F",null,null,null],[null,null,null,null,null,"Z",null,null,null,null],[null,null,null,null,"V","E","N","T",null,null],[null,null,null,null,null,null,null,"R",null,null],[null,null,null,null,null,"G","L","Y","P","H"],[null,null,null,null,null,null,null,null,null,null]]),
    hints: JSON.stringify([
      { row: 1, col: 0 }, { row: 1, col: 1 }, { row: 1, col: 2 }, { row: 1, col: 3 },
      { row: 3, col: 1 }, { row: 3, col: 2 }, { row: 3, col: 3 }, { row: 3, col: 4 }, { row: 3, col: 5 },
      { row: 8, col: 5 }, { row: 8, col: 6 }, { row: 8, col: 7 }, { row: 8, col: 8 }, { row: 8, col: 9 },
    ]),
    width: 10,
    height: 10,
  },
  {
    id: "easy-2-warming-up",
    name: "Easy #2 - Warming Up",
    difficulty: "easy",
    grid: JSON.stringify([[null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,"F",null,null],[null,null,null,null,null,null,null,"J",null,null],[null,"K",null,"Z",null,null,"B","O","W","L"],["C","A","G","E",null,"X",null,"R",null,null],[null,null,null,"S","Q","U","I","D",null,null],[null,null,null,"T",null,null,"V",null,null,null],[null,null,null,null,null,"N","Y","M","P","H"],[null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null]]),
    hints: JSON.stringify([
      { row: 3, col: 6 }, { row: 3, col: 7 }, { row: 3, col: 8 }, { row: 3, col: 9 },
      { row: 4, col: 0 }, { row: 4, col: 1 }, { row: 4, col: 2 }, { row: 4, col: 3 },
      { row: 5, col: 3 }, { row: 5, col: 4 }, { row: 5, col: 5 }, { row: 5, col: 6 }, { row: 5, col: 7 },
    ]),
    width: 10,
    height: 10,
  },
  {
    id: "hard-1-the-web",
    name: "Hard #1 - The Web",
    difficulty: "hard",
    grid: JSON.stringify([[null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,"F",null,null,null],[null,null,null,null,null,null,"J",null,null,null],["B",null,"Z",null,"G",null,"O","W",null,null],["A","X","E",null,"N",null,"R",null,null,null],["C",null,"S","Q","U","I","D",null,null,null],["K",null,"T",null,null,"V",null,null,null,null],[null,null,null,null,"L","Y","M","P","H",null],[null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null]]),
    hints: JSON.stringify([
      { row: 3, col: 0 },
      { row: 5, col: 3 },
    ]),
    width: 10,
    height: 10,
  },
  {
    id: "hard-2-crossfire",
    name: "Hard #2 - Crossfire",
    difficulty: "hard",
    grid: JSON.stringify([[null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,"F",null,null],[null,null,null,null,null,null,null,"J",null,null],[null,"K",null,"Z",null,null,"W","O","M","B"],["V","A","N","E",null,"X",null,"R",null,null],[null,null,null,"S","Q","U","I","D",null,null],[null,null,null,"T",null,null,"C",null,null,null],[null,null,null,null,"G","L","Y","P","H",null],[null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null]]),
    hints: JSON.stringify([
      { row: 4, col: 0 },
      { row: 7, col: 6 },
    ]),
    width: 10,
    height: 10,
  },
];

const db = new Database(DB_PATH);

// Clean up old puzzles (delete scores first to avoid FK constraint)
db.exec("DELETE FROM Score WHERE puzzleId IN (SELECT id FROM Puzzle WHERE id LIKE 'puzzle-%')");
db.exec("DELETE FROM Puzzle WHERE id LIKE 'puzzle-%'");

const stmt = db.prepare(`
  INSERT OR REPLACE INTO Puzzle (id, name, grid, hints, width, height, difficulty, active, createdAt)
  VALUES (?, ?, ?, ?, ?, ?, ?, 1, datetime('now'))
`);

for (const puzzle of SEED_PUZZLES) {
  stmt.run(puzzle.id, puzzle.name, puzzle.grid, puzzle.hints, puzzle.width, puzzle.height, puzzle.difficulty);
}

console.log("Seeded", SEED_PUZZLES.length, "puzzles successfully");
db.close();
