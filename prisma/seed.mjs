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
    id: "puzzle-1-the-web",
    name: "Puzzle #1 - The Web",
    grid: JSON.stringify([
      [null,null,null,null,null,null,"F",null,null],
      [null,null,null,null,null,null,"J",null,null],
      ["B",null,"Z",null,null,"G","O","W","N"],
      ["A","X","E",null,null,null,"R",null,null],
      ["C",null,"S","Q","U","I","D",null,null],
      ["K",null,"T",null,null,"V",null,null,null],
      [null,null,null,null,"L","Y","M","P","H"],
    ]),
    hints: JSON.stringify([
      { row: 2, col: 0 },
      { row: 4, col: 3 },
      { row: 6, col: 6 },
    ]),
    width: 9,
    height: 7,
  },
  {
    id: "puzzle-2-crossfire",
    name: "Puzzle #2 - Crossfire",
    grid: JSON.stringify([
      [null,null,null,null,"D",null,null],
      [null,null,null,"Q","O","P","H"],
      [null,null,"J",null,"Z",null,null],
      [null,"V","I","X","E","N",null],
      [null,null,"B",null,null,null,null],
      [null,null,"S","K","Y",null,null],
      [null,null,null,"R",null,null,null],
      [null,null,null,"A","W",null,null],
      [null,"G",null,"F",null,null,null],
      ["C","U","L","T",null,null,null],
      [null,"M",null,null,null,null,null],
    ]),
    hints: JSON.stringify([
      { row: 1, col: 3 },
      { row: 3, col: 1 },
      { row: 9, col: 0 },
    ]),
    width: 7,
    height: 11,
  },
];

const db = new Database(DB_PATH);

db.exec("DELETE FROM Puzzle WHERE id IN ('puzzle--1---starter', 'puzzle--2---crosswords')");

const stmt = db.prepare(`
  INSERT OR REPLACE INTO Puzzle (id, name, grid, hints, width, height, active, createdAt)
  VALUES (?, ?, ?, ?, ?, ?, 1, datetime('now'))
`);

for (const puzzle of SEED_PUZZLES) {
  stmt.run(puzzle.id, puzzle.name, puzzle.grid, puzzle.hints, puzzle.width, puzzle.height);
}

console.log("Seeded", SEED_PUZZLES.length, "puzzles successfully");
db.close();
