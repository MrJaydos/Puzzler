import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function LeaderboardPage({
  searchParams,
}: {
  searchParams: Promise<{ puzzle?: string }>;
}) {
  const user = await getSession();
  if (!user) redirect("/login");

  const { puzzle: selectedPuzzleId } = await searchParams;

  const puzzles = await prisma.puzzle.findMany({
    where: { active: true },
    orderBy: { createdAt: "asc" },
    select: { id: true, name: true },
  });

  const puzzleId = selectedPuzzleId || puzzles[0]?.id;

  const scores = puzzleId
    ? await prisma.score.findMany({
        where: { puzzleId, completed: true },
        orderBy: { time: "asc" },
        take: 50,
        include: { user: { select: { name: true, id: true } } },
      })
    : [];

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-amber-400 mb-6">Leaderboard</h1>

      <div className="flex gap-2 mb-6 flex-wrap">
        {puzzles.map((p) => (
          <Link
            key={p.id}
            href={`/leaderboard?puzzle=${p.id}`}
            className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
              p.id === puzzleId
                ? "bg-amber-500 text-gray-900 font-medium"
                : "bg-gray-800 text-gray-400 hover:text-white"
            }`}
          >
            {p.name}
          </Link>
        ))}
      </div>

      {scores.length > 0 ? (
        <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800 text-gray-500 text-sm">
                <th className="text-left px-4 py-3 w-16">#</th>
                <th className="text-left px-4 py-3">Player</th>
                <th className="text-right px-4 py-3">Time</th>
              </tr>
            </thead>
            <tbody>
              {scores.map((score, i) => (
                <tr
                  key={score.id}
                  className={`border-b border-gray-800/50 ${
                    score.user.id === user.id ? "bg-amber-500/10" : ""
                  }`}
                >
                  <td className="px-4 py-3 text-gray-500">
                    {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : i + 1}
                  </td>
                  <td className="px-4 py-3 font-medium">
                    {score.user.name}
                    {score.user.id === user.id && (
                      <span className="text-amber-400 text-xs ml-2">(you)</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-gray-400">
                    {Math.floor(score.time / 60)}:
                    {(score.time % 60).toString().padStart(2, "0")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-500 text-center py-8">
          No scores yet. Be the first to complete this puzzle!
        </p>
      )}
    </div>
  );
}
