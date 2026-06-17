"use client";

import { useState, useEffect, useCallback } from "react";
import { Grid, HintPosition } from "@/types";

interface BoardProps {
  puzzleId: string;
  initialGrid: Grid;
  hints: HintPosition[];
  width: number;
  height: number;
}

const ALL_LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function Board({ puzzleId, initialGrid, hints, width, height }: BoardProps) {
  const [playerGrid, setPlayerGrid] = useState<Grid>(() =>
    initialGrid.map((row) => [...row])
  );
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [checking, setChecking] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const isHint = useCallback(
    (r: number, c: number) => hints.some((h) => h.row === r && h.col === c),
    [hints]
  );

  const usedLetters = playerGrid
    .flat()
    .filter((c): c is string => c !== null && c !== "")
    .map((c) => c.toUpperCase());

  const remainingLetters = ALL_LETTERS.filter((l) => !usedLetters.includes(l));

  const allPlaced = remainingLetters.length === 0;

  useEffect(() => {
    if (completed) return;
    const interval = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(interval);
  }, [completed]);

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
        body: JSON.stringify({ grid: playerGrid, time: elapsed }),
      });
      const data = await res.json();

      if (data.correct) {
        setCompleted(true);
        setMessage(`Solved in ${formatTime(elapsed)}!`);
      } else {
        setMessage("Not quite right — keep trying!");
      }
    } catch {
      setMessage("Error checking solution");
    } finally {
      setChecking(false);
    }
  }

  return (
    <div className="flex flex-col items-center gap-6" onKeyDown={handleKeyDown} tabIndex={0}>
      <div className="flex items-center gap-6">
        <div className="text-2xl font-mono text-amber-400 tabular-nums">
          {formatTime(elapsed)}
        </div>
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
                      : isFilled
                        ? "bg-gray-700 text-white hover:bg-gray-600"
                        : "bg-gray-700 text-gray-500 hover:bg-gray-600"
                  }
                  ${completed && !hintCell ? "bg-green-900 text-green-300" : ""}
                `}
                disabled={completed || hintCell}
              >
                {hintCell
                  ? initialGrid[r][c]
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

          {allPlaced && (
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
