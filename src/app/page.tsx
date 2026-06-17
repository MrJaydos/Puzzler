import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { redirect } from "next/navigation";

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string }>;
}) {
  const user = await getSession();
  if (!user) redirect("/login");

  const { mode } = await searchParams;
  const difficulty = mode === "hard" ? "hard" : "easy";
  const today = todayStr();

  const dailyPuzzles = await prisma.puzzle.findMany({
    where: { active: true, dailyDate: today },
    include: {
      scores: {
        where: { userId: user.id },
        select: { completed: true, time: true },
      },
    },
  });

  const puzzles = await prisma.puzzle.findMany({
    where: { active: true, difficulty, dailyDate: null },
    orderBy: { createdAt: "asc" },
    include: {
      scores: {
        where: { userId: user.id },
        select: { completed: true, time: true },
      },
    },
  });

  const completedCount = puzzles.filter((p) => p.scores[0]?.completed).length;

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-amber-400 mb-2">Puzzler</h1>
        <p className="text-gray-400 text-sm">
          Place all 26 letters into the crossword. No repeats!
        </p>
      </div>

      {dailyPuzzles.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
            Daily Challenge
          </h2>
          <div className="space-y-2">
            {dailyPuzzles.map((puzzle) => {
              const score = puzzle.scores[0];
              return (
                <Link
                  key={puzzle.id}
                  href={`/game/${puzzle.id}`}
                  className="block bg-gradient-to-r from-amber-500/10 to-transparent border border-amber-500/30 rounded-lg px-4 py-3 hover:border-amber-500/60 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-amber-400 text-lg">&#9733;</span>
                      <div>
                        <span className="font-medium text-white text-sm">{puzzle.name}</span>
                        <span className={`ml-2 text-xs px-1.5 py-0.5 rounded font-medium ${
                          puzzle.difficulty === "easy"
                            ? "bg-green-900 text-green-400"
                            : "bg-red-900 text-red-400"
                        }`}>
                          {puzzle.difficulty}
                        </span>
                      </div>
                    </div>
                    {score?.completed ? (
                      <span className="text-green-400 text-sm font-mono">
                        {Math.floor(score.time / 60)}:{(score.time % 60).toString().padStart(2, "0")}
                      </span>
                    ) : (
                      <span className="text-amber-400 text-sm font-medium">Play &rarr;</span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      <div className="flex justify-center gap-2 mb-6">
        <Link
          href="/?mode=easy"
          className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
            difficulty === "easy"
              ? "bg-green-600 text-white"
              : "bg-gray-800 text-gray-400 hover:text-white"
          }`}
        >
          Easy
        </Link>
        <Link
          href="/?mode=hard"
          className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
            difficulty === "hard"
              ? "bg-red-600 text-white"
              : "bg-gray-800 text-gray-400 hover:text-white"
          }`}
        >
          Hard
        </Link>
      </div>

      <div className="text-center text-gray-500 text-xs mb-4">
        {completedCount}/{puzzles.length} completed
      </div>

      <div className="space-y-2">
        {puzzles.map((puzzle, i) => {
          const score = puzzle.scores[0];
          return (
            <Link
              key={puzzle.id}
              href={`/game/${puzzle.id}`}
              className="block bg-gray-900 border border-gray-800 rounded-lg px-4 py-3 hover:border-amber-500/50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-gray-600 text-sm font-mono w-6">{i + 1}</span>
                  <span className="font-medium text-white text-sm">{puzzle.name}</span>
                </div>
                {score?.completed ? (
                  <span className="text-green-400 text-sm font-mono">
                    {Math.floor(score.time / 60)}:{(score.time % 60).toString().padStart(2, "0")}
                  </span>
                ) : (
                  <span className="text-amber-400 text-sm">Play &rarr;</span>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
