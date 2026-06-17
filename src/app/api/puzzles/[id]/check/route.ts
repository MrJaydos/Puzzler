import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { checkSolution } from "@/lib/puzzles";
import { Grid } from "@/types";

export async function POST(
  request: Request,
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

  const body = await request.json();
  const playerGrid: Grid = body.grid;
  const time: number = body.time;

  const solutionGrid: Grid = JSON.parse(puzzle.grid);
  const correct = checkSolution(playerGrid, solutionGrid);

  if (correct) {
    await prisma.score.upsert({
      where: { userId_puzzleId: { userId: user.id, puzzleId: id } },
      update: {
        time: Math.min(time, (await prisma.score.findUnique({
          where: { userId_puzzleId: { userId: user.id, puzzleId: id } },
        }))?.time ?? Infinity),
        completed: true,
      },
      create: {
        userId: user.id,
        puzzleId: id,
        time,
        completed: true,
      },
    });
  }

  return NextResponse.json({ correct });
}
