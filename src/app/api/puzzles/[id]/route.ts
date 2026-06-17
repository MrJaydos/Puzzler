import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { HintPosition, Grid } from "@/types";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSession();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const puzzle = await prisma.puzzle.findUnique({ where: { id } });
  if (!puzzle) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const grid: Grid = JSON.parse(puzzle.grid);
  const hints: HintPosition[] = JSON.parse(puzzle.hints);

  const maskedGrid: Grid = grid.map((row, r) =>
    row.map((cell, c) => {
      if (cell === null) return null;
      const isHint = hints.some((h) => h.row === r && h.col === c);
      return isHint ? cell : "";
    })
  );

  return NextResponse.json({
    id: puzzle.id,
    name: puzzle.name,
    grid: maskedGrid,
    hints,
    width: puzzle.width,
    height: puzzle.height,
  });
}
