"use client";

import { useState, useEffect, useCallback } from "react";
import { Grid, HintPosition } from "@/types";

interface BoardProps {
  puzzleId: string;
  initialGrid: Grid;
  solutionGrid: Grid;
  hints: HintPosition[];
  width: number;
  height: number;
  difficulty: string;
}

const ALL_LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

type CellColor = "default" | "correct" | "wrong-spot" | "wrong";

export default function Board({
  puzzleId,
  initialGrid,
  solutionGrid,
  hints,
  width,
  height,
  difficulty,
}: BoardProps) {
  const [playerGrid, setPlayerGrid] = useState<Grid>(() =>
    initialGrid.map((row) => [...row])
  );
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [penalty, setPenalty] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [checking, setChecking] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [revealedHints, setRevealedHints] = useState<Set<string>>(new Set());

  const isEasy = difficulty === "easy";
  const totalTime = elapsed + penalty;

  const isHint = useCallback(
    (r: number, c: number) =>
      hints.some((h) => h.row === r && h.col === c) ||
      revealedHints.has(`${r},${c}`),
    [hints, revealedHints]
  );

  const usedLetters = playerGrid
    .flat()
    .filter((c): c is string => c !== null && c !== "")
    .map((c) => c.toUpperCase());

  const remainingLetters = ALL_LETTERS.filter((l) => !usedLetters.includes(l));
  const allPlaced = remainingLetters.length === 0;

  function getCellColor(r: number, c: number): CellColor {
    if (!isEasy) return "default";
    const playerValue = playerGrid[r]?.[c];
    if (!playerValue || playerValue === "") return "default";
    if (isHint(r, c)) return "default";

    const solutionValue = solutionGrid[r]?.[c];
    if (playerValue.toUpperCase() === solutionValue?.toUpperCase()) return "correct";

    const acrossWord = getWordCells(r, c, "H");
    const downWord = getWordCells(r, c, "V");
    const wordCells = [...acrossWord, ...downWord];
    const inSameWord = wordCells.some(
      ([wr, wc]) => solutionGrid[wr]?.[wc]?.toUpperCase() === playerValue.toUpperCase()
    );
    if (inSameWord) return "wrong-spot";

    return "wrong";
  }

  function getWordCells(r: number, c: number, dir: "H" | "V"): [number, number][] {
    const cells: [number, number][] = [];
    if (dir === "H") {
      let start = c;
      while (start > 0 && solutionGrid[r]?.[start - 1]) start--;
      let end = c;
      while (end < width - 1 && solutionGrid[r]?.[end + 1]) end++;
      if (end - start >= 1) {
        for (let cc = start; cc <= end; cc++) cells.push([r, cc]);
      }
    } else {
      let start = r;
      while (start > 0 && solutionGrid[start - 1]?.[c]) start--;
      let end = r;
      while (end < height - 1 && solutionGrid[end + 1]?.[c]) end++;
      if (end - start >= 1) {
        for (let rr = start; rr <= end; rr++) cells.push([rr, c]);
      }
    }
    return cells;
  }

  useEffect(() => {
    if (completed) return;
    const interval = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(interval);
  }, [completed]);

  useEffect(() => {
    if (!allPlaced || completed) return;
    const isCorrect = solutionGrid.every((row, r) =>
      row.every((cell, c) => {
        if (cell === null) return playerGrid[r]?.[c] === null;
        return cell?.toUpperCase() === playerGrid[r]?.[c]?.toUpperCase();
      })
    );
    if (isCorrect) {
      setCompleted(true);
      setMessage(`Solved in ${formatTime(totalTime)}!`);
      fetch(`/api/puzzles/${puzzleId}/check`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ grid: playerGrid, time: totalTime }),
      }).catch(() => {});
    }
  }, [playerGrid, allPlaced, completed, solutionGrid, puzzleId, totalTime]);

  function handleCellClick(row: number, col: number) {
    if (completed) return;
    if (initialGrid[row][col] === null) return;
    if (isHint(row, col)) return;

    if (selectedCell?.row === row && selectedCell?.col === col) {
      setSelectedCell(null);
    } else {
      setSelectedCell({ row, col });
    }
  }

  function handleLetterClick(letter: string) {
    if (completed) return;
    if (!selectedCell) return;

    const { row, col } = selectedCell;
    if (isHint(row, col)) return;

    setPlayerGrid((prev) => {
      const next = prev.map((r) => [...r]);
      next[row][col] = letter;
      return next;
    });
    setSelectedCell(null);
    setMessage(null);
  }

  function handleClearCell() {
    if (!selectedCell || completed) return;
    const { row, col } = selectedCell;
    if (isHint(row, col)) return;

    setPlayerGrid((prev) => {
      const next = prev.map((r) => [...r]);
      next[row][col] = "";
      return next;
    });
    setSelectedCell(null);
  }

  function handleHint() {
    if (completed) return;
    const emptyCells: { r: number; c: number }[] = [];
    for (let r = 0; r < height; r++) {
      for (let c = 0; c < width; c++) {
        if (solutionGrid[r]?.[c] && !isHint(r, c)) {
          const val = playerGrid[r]?.[c];
          if (!val || val === "" || val.toUpperCase() !== solutionGrid[r][c]?.toUpperCase()) {
            emptyCells.push({ r, c });
          }
        }
      }
    }
    if (emptyCells.length === 0) return;

    const cell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const letter = solutionGrid[cell.r][cell.c]!;

    const oldLetter = playerGrid[cell.r]?.[cell.c];
    if (oldLetter && oldLetter !== "" && oldLetter.toUpperCase() !== letter.toUpperCase()) {
      setPlayerGrid((prev) => {
        const next = prev.map((r) => [...r]);
        next[cell.r][cell.c] = letter;
        return next;
      });
    } else {
      setPlayerGrid((prev) => {
        const next = prev.map((r) => [...r]);
        next[cell.r][cell.c] = letter;
        return next;
      });
    }

    setRevealedHints((prev) => new Set([...prev, `${cell.r},${cell.c}`]));
    setPenalty((p) => p + 60);
    setSelectedCell(null);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (completed || !selectedCell) return;

    const letter = e.key.toUpperCase();
    if (letter.length === 1 && letter >= "A" && letter <= "Z") {
      if (remainingLetters.includes(letter)) {
        handleLetterClick(letter);
      }
    } else if (e.key === "Backspace" || e.key === "Delete") {
      handleClearCell();
    } else if (e.key === "Escape") {
      setSelectedCell(null);
    }
  }

  async function handleCheck() {
    setChecking(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/puzzles/${puzzleId}/check`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ grid: playerGrid, time: totalTime }),
      });
      const data = await res.json();
      if (data.correct) {
        setCompleted(true);
        setMessage(`Solved in ${formatTime(totalTime)}!`);
      } else {
        setMessage("Not quite right — keep trying!");
      }
    } catch {
      setMessage("Error checking solution");
    } finally {
      setChecking(false);
    }
  }

  function cellColorClass(r: number, c: number): string {
    const color = getCellColor(r, c);
    switch (color) {
      case "correct": return "bg-green-700 text-green-100";
      case "wrong-spot": return "bg-yellow-600 text-yellow-100";
      case "wrong": return "bg-red-900 text-red-300";
      default: return "";
    }
  }

  return (
    <div className="flex flex-col items-center gap-6" onKeyDown={handleKeyDown} tabIndex={0}>
      <div className="flex items-center gap-4">
        <div className="text-2xl font-mono text-amber-400 tabular-nums">
          {formatTime(totalTime)}
        </div>
        {penalty > 0 && (
          <span className="text-red-400 text-sm">(+{formatTime(penalty)} hints)</span>
        )}
        {completed && (
          <span className="text-green-400 font-bold text-lg">COMPLETE!</span>
        )}
      </div>

      <div
        className="grid gap-0.5 bg-gray-800 p-1 rounded-lg"
        style={{
          gridTemplateColumns: `repeat(${width}, minmax(0, 1fr))`,
        }}
      >
        {Array.from({ length: height }, (_, r) =>
          Array.from({ length: width }, (_, c) => {
            const cellValue = initialGrid[r]?.[c];
            const isBlank = cellValue === null;
            const hintCell = isHint(r, c);
            const playerValue = playerGrid[r]?.[c];
            const isSelected =
              selectedCell?.row === r && selectedCell?.col === c;
            const isFilled = playerValue !== null && playerValue !== "";
            const colorClass = isFilled && !hintCell ? cellColorClass(r, c) : "";

            if (isBlank) {
              return (
                <div
                  key={`${r}-${c}`}
                  className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-900"
                />
              );
            }

            return (
              <button
                key={`${r}-${c}`}
                onClick={() => handleCellClick(r, c)}
                className={`
                  w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center
                  text-lg font-bold uppercase transition-colors rounded-sm
                  ${isSelected
                    ? "bg-amber-500 text-gray-900 ring-2 ring-amber-300"
                    : hintCell
                      ? "bg-gray-600 text-amber-300 cursor-default"
                      : colorClass
                        ? colorClass
                        : isFilled
                          ? "bg-gray-700 text-white hover:bg-gray-600"
                          : "bg-gray-700 text-gray-500 hover:bg-gray-600"
                  }
                  ${completed && !hintCell ? "bg-green-900 text-green-300" : ""}
                `}
                disabled={completed || hintCell}
              >
                {hintCell
                  ? (solutionGrid[r]?.[c] ?? initialGrid[r][c])
                  : isFilled
                    ? playerValue
                    : ""}
              </button>
            );
          })
        )}
      </div>

      {!completed && (
        <>
          <div className="flex items-center gap-3">
            <button
              onClick={handleHint}
              className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Hint (+1:00)
            </button>
            {isEasy && (
              <div className="flex gap-2 text-xs text-gray-500">
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-green-700 inline-block" /> Correct</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-yellow-600 inline-block" /> Wrong spot</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-red-900 inline-block" /> Wrong</span>
              </div>
            )}
          </div>

          <div className="flex flex-col items-center gap-2">
            <div className="text-gray-400 text-sm">
              {selectedCell
                ? "Pick a letter or type on your keyboard"
                : "Click an empty cell to place a letter"}
            </div>
            <div className="flex flex-wrap gap-1.5 justify-center max-w-md">
              {ALL_LETTERS.map((letter) => {
                const used = usedLetters.includes(letter);
                return (
                  <button
                    key={letter}
                    onClick={() => handleLetterClick(letter)}
                    disabled={used || !selectedCell}
                    className={`
                      w-9 h-9 sm:w-10 sm:h-10 rounded text-sm font-bold transition-all
                      ${used
                        ? "bg-gray-800 text-gray-600 cursor-not-allowed"
                        : selectedCell
                          ? "bg-amber-500 text-gray-900 hover:bg-amber-400 active:scale-95"
                          : "bg-gray-700 text-gray-400 cursor-not-allowed"
                      }
                    `}
                  >
                    {letter}
                  </button>
                );
              })}
            </div>
          </div>

          {selectedCell && (
            <button
              onClick={handleClearCell}
              className="text-red-400 hover:text-red-300 text-sm"
            >
              Clear selected cell
            </button>
          )}

          {!isEasy && allPlaced && (
            <button
              onClick={handleCheck}
              disabled={checking}
              className="bg-green-600 hover:bg-green-500 text-white px-6 py-2.5 rounded-lg font-bold text-lg transition-colors disabled:opacity-50"
            >
              {checking ? "Checking..." : "Check Solution"}
            </button>
          )}
        </>
      )}

      {message && (
        <div
          className={`text-lg font-bold ${
            completed ? "text-green-400" : "text-red-400"
          }`}
        >
          {message}
        </div>
      )}
    </div>
  );
}
