import Database from "better-sqlite3";
import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

const dbUrl = process.env.DATABASE_URL || "file:./dev.db";
const DB_PATH = dbUrl.startsWith("file:")
  ? dbUrl.slice("file:".length)
  : join(__dirname, "..", "dev.db");

const puzzlesPath = join(__dirname, "puzzles.json");
let grids;
try {
  grids = JSON.parse(readFileSync(puzzlesPath, "utf-8"));
} catch {
  console.error("Could not read prisma/puzzles.json — run: node scripts/solve-puzzle.mjs 100 prisma/puzzles.json");
  process.exit(1);
}

function generateHints(grid, difficulty) {
  const cells = [];
  for (let r = 0; r < grid.length; r++)
    for (let c = 0; c < grid[r].length; c++)
      if (grid[r][c]) cells.push({ row: r, col: c });

  if (difficulty === "easy") {
    const shuffled = [...cells].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.ceil(cells.length * 0.5));
  }
  const shuffled = [...cells].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 2);
}

const db = new Database(DB_PATH);
db.pragma("foreign_keys = OFF");

db.exec("DELETE FROM Score");
db.exec("DELETE FROM Puzzle");

const stmt = db.prepare(`
  INSERT INTO Puzzle (id, name, grid, hints, width, height, difficulty, dailyDate, active, createdAt)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, datetime('now'))
`);

// First 100 grids: 50 easy + 50 hard regular puzzles
const regularCount = Math.min(grids.length, 100);
let easyNum = 1;
let hardNum = 1;
let gridIdx = 0;

for (let i = 0; i < regularCount; i++) {
  const difficulty = i % 2 === 0 ? "easy" : "hard";
  const num = difficulty === "easy" ? easyNum++ : hardNum++;
  const id = `${difficulty}-${num}`;
  const name = `${difficulty === "easy" ? "Easy" : "Hard"} #${num}`;
  const grid = grids[gridIdx++];
  const hints = generateHints(grid, difficulty);

  stmt.run(id, name, JSON.stringify(grid), JSON.stringify(hints), 10, 10, difficulty, null);
}

// Remaining grids (if any): daily puzzles, 2 per day (1 easy, 1 hard)
// Starting from today, extending into the future
const today = new Date();
let dailyIdx = 0;
while (gridIdx + 1 < grids.length) {
  const date = new Date(today);
  date.setDate(date.getDate() + dailyIdx);
  const dateStr = date.toISOString().slice(0, 10);

  for (const difficulty of ["easy", "hard"]) {
    if (gridIdx >= grids.length) break;
    const grid = grids[gridIdx++];
    const hints = generateHints(grid, difficulty);
    const id = `daily-${dateStr}-${difficulty}`;
    const name = `Daily ${difficulty === "easy" ? "Easy" : "Hard"} — ${dateStr}`;

    stmt.run(id, name, JSON.stringify(grid), JSON.stringify(hints), 10, 10, difficulty, dateStr);
  }
  dailyIdx++;
}

db.pragma("foreign_keys = ON");
const dailyCount = gridIdx - regularCount;
console.log(`Seeded ${regularCount} regular puzzles + ${dailyCount} daily puzzles`);
db.close();
