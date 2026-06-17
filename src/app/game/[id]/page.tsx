import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect, notFound } from "next/navigation";
import Board from "@/components/Board";
import Link from "next/link";
import { Grid, HintPosition } from "@/types";

export default async function GamePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getSession();
  if (!user) redirect("/login");

  const { id } = await params;
  const puzzle = await prisma.puzzle.findUnique({ where: { id } });
  if (!puzzle) notFound();

  const grid: Grid = JSON.parse(puzzle.grid);
  const hints: HintPosition[] = JSON.parse(puzzle.hints);

  const maskedGrid: Grid = grid.map((row, r) =>
    row.map((cell, c) => {
      if (cell === null) return null;
      const isHint = hints.some((h) => h.row === r && h.col === c);
      return isHint ? cell : "";
    })
  );

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <Link href="/" className="text-gray-400 hover:text-white text-sm">
          &larr; Back
        </Link>
        <h1 className="text-lg font-semibold text-white">{puzzle.name}</h1>
        <Link
          href={`/leaderboard?puzzle=${puzzle.id}`}
          className="text-amber-400 hover:text-amber-300 text-sm"
        >
          Leaderboard
        </Link>
      </div>

      <Board
        puzzleId={puzzle.id}
        initialGrid={maskedGrid}
        hints={hints}
        width={puzzle.width}
        height={puzzle.height}
      />
    </div>
  );
}
