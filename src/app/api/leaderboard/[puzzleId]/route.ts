import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ puzzleId: string }> }
) {
  const { puzzleId } = await params;

  const scores = await prisma.score.findMany({
    where: { puzzleId, completed: true },
    orderBy: { time: "asc" },
    take: 50,
    include: { user: { select: { name: true } } },
  });

  const leaderboard = scores.map((s, i) => ({
    rank: i + 1,
    name: s.user.name,
    time: s.time,
    completedAt: s.createdAt.toISOString(),
  }));

  return NextResponse.json(leaderboard);
}
