"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Navbar({ user }: { user: { name: string } | null }) {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <nav className="bg-gray-900 border-b border-gray-800">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-amber-400 tracking-tight">
          Puzzler
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/" className="text-gray-300 hover:text-white text-sm">
            Puzzles
          </Link>
          <Link href="/leaderboard" className="text-gray-300 hover:text-white text-sm">
            Leaderboard
          </Link>
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-gray-400 text-sm">{user.name}</span>
              <button
                onClick={handleLogout}
                className="text-gray-400 hover:text-white text-sm"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link href="/login" className="text-amber-400 hover:text-amber-300 text-sm">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
