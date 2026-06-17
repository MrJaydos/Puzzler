"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Navbar({ user }: { user: { name: string } | null }) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <>
      <nav className="bg-gray-900 border-b border-gray-800 relative z-50">
        <div className="max-w-6xl mx-auto px-4 h-14 grid grid-cols-3 items-center">
          <div className="flex items-center">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-gray-400 hover:text-white p-1.5 -ml-1.5 rounded-lg hover:bg-gray-800 transition-colors"
              aria-label="Menu"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          </div>

          <Link href="/" className="text-xl font-bold text-amber-400 tracking-tight text-center">
            Puzzler
          </Link>

          <div className="flex items-center justify-end">
            {user ? (
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="text-gray-400 hover:text-white p-1.5 rounded-lg hover:bg-gray-800 transition-colors"
                aria-label="Account"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M20 21a8 8 0 1 0-16 0" />
                </svg>
              </button>
            ) : (
              <Link href="/login" className="text-amber-400 hover:text-amber-300 text-sm font-medium">
                Login
              </Link>
            )}
          </div>
        </div>
      </nav>

      {menuOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setMenuOpen(false)}
          />
          <div className="absolute left-0 right-0 top-14 z-50 bg-gray-900 border-b border-gray-800 shadow-xl">
            <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col gap-1">
              <Link
                href="/"
                onClick={() => setMenuOpen(false)}
                className="text-gray-300 hover:text-white hover:bg-gray-800 px-3 py-2.5 rounded-lg text-sm transition-colors"
              >
                Puzzles
              </Link>
              <Link
                href="/leaderboard"
                onClick={() => setMenuOpen(false)}
                className="text-gray-300 hover:text-white hover:bg-gray-800 px-3 py-2.5 rounded-lg text-sm transition-colors"
              >
                Leaderboard
              </Link>
              {user && (
                <>
                  <div className="border-t border-gray-800 my-1" />
                  <div className="px-3 py-2 text-gray-500 text-xs">{user.name}</div>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      handleLogout();
                    }}
                    className="text-left text-red-400 hover:text-red-300 hover:bg-gray-800 px-3 py-2.5 rounded-lg text-sm transition-colors"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
