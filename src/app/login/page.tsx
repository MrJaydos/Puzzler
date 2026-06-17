"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    try {
      const endpoint = isSignup ? "/api/auth/signup" : "/api/auth/login";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          password: formData.get("password"),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        return;
      }

      router.push("/");
      router.refresh();
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold text-amber-400 text-center mb-6">
          {isSignup ? "Create Account" : "Login"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignup && (
            <div>
              <label className="block text-sm text-gray-400 mb-1">Name</label>
              <input
                name="name"
                type="text"
                required
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white focus:border-amber-500 focus:outline-none"
              />
            </div>
          )}
          <div>
            <label className="block text-sm text-gray-400 mb-1">Email</label>
            <input
              name="email"
              type="email"
              required
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white focus:border-amber-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Password</label>
            <input
              name="password"
              type="password"
              required
              minLength={6}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white focus:border-amber-500 focus:outline-none"
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-500 hover:bg-amber-400 text-gray-900 font-bold py-2.5 rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? "..." : isSignup ? "Sign Up" : "Login"}
          </button>
        </form>

        <p className="text-center text-gray-500 text-sm mt-4">
          {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            onClick={() => {
              setIsSignup(!isSignup);
              setError(null);
            }}
            className="text-amber-400 hover:underline"
          >
            {isSignup ? "Login" : "Sign up"}
          </button>
        </p>
      </div>
    </div>
  );
}
