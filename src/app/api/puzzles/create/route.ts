import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { validatePuzzleUsesAllLetters } from "@/lib/puzzles";
import { Grid, HintPosition } from "@/types";

export async function POST(request: Request) {
  const user = await getSession();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const adminEmails = (process.env.ADMIN_EMAILS || "").split(",").map((e) => e.trim());
  if (!adminEmails.includes(user.email)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const { name, grid, hints } = body as {
    name: string;
    grid: Grid;
    hints: HintPosition[];
  };

  if (!name || !grid || !hints) {
    return NextResponse.json(
      { error: "name, grid, and hints are required" },
      { status: 400 }
    );
  }

  const validation = validatePuzzleUsesAllLetters(grid);
  if (!validation.valid) {
    return NextResponse.json(
      {
        error: "Puzzle must use all 26 letters exactly once",
        missing: validation.missing,
        duplicates: validation.duplicates,
      },
      { status: 400 }
    );
  }

  const width = Math.max(...grid.map((row) => row.length));
  const height = grid.length;
  const id = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

  const puzzle = await prisma.puzzle.create({
    data: {
      id,
      name,
      grid: JSON.stringify(grid),
      hints: JSON.stringify(hints),
      width,
      height,
    },
  });

  return NextResponse.json({ id: puzzle.id, name: puzzle.name }, { status: 201 });
}
