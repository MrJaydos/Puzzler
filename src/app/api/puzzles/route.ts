import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  const user = await getSession();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const puzzles = await prisma.puzzle.findMany({
    where: { active: true },
    select: {
      id: true,
      name: true,
      width: true,
      height: true,
      createdAt: true,
      scores: {
        where: { userId: user.id },
        select: { completed: true, time: true },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  const result = puzzles.map((p) => ({
    id: p.id,
    name: p.name,
    width: p.width,
    height: p.height,
    completed: p.scores[0]?.completed ?? false,
    bestTime: p.scores[0]?.time ?? null,
  }));

  return NextResponse.json(result);
}
