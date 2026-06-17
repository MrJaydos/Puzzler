import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Home() {
  const user = await getSession();
  if (!user) redirect("/login");

  const puzzles = await prisma.puzzle.findMany({
    where: { active: true },
    orderBy: { createdAt: "asc" },
    include: {
      scores: {
        where: { userId: user.id },
        select: { completed: true, time: true },
      },
    },
  });

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-amber-400 mb-2">Puzzler</h1>
        <p className="text-gray-400">
          Place all 26 letters of the alphabet into the crossword grid.
          <br />
          Every letter is used exactly once. No repeats!
        </p>
      </div>

      <div className="space-y-3">
        {puzzles.map((puzzle) => {
          const score = puzzle.scores[0];
          return (
            <Link
              key={puzzle.id}
              href={`/game/${puzzle.id}`}
              className="block bg-gray-900 border border-gray-800 rounded-lg p-4 hover:border-amber-500/50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-semibold text-white">{puzzle.name}</h2>
                  <p className="text-gray-500 text-sm">
                    {puzzle.width}x{puzzle.height} grid
                  </p>
                </div>
                {score?.completed ? (
                  <div className="text-right">
                    <span className="text-green-400 text-sm font-medium">
                      Completed
                    </span>
                    <p className="text-gray-500 text-xs">
                      {Math.floor(score.time / 60)}:
                      {(score.time % 60).toString().padStart(2, "0")}
                    </p>
                  </div>
                ) : (
                  <span className="text-amber-400 text-sm">Play &rarr;</span>
                )}
              </div>
            </Link>
          );
        })}

        {puzzles.length === 0 && (
          <p className="text-gray-500 text-center py-8">
            No puzzles available yet. Run the seed script to add some!
          </p>
        )}
      </div>
    </div>
  );
}
