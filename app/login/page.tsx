"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "../lib/supabaseClient";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.replace('/');
      }
    };
    checkSession();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }

    // 🔹 Get role from staff table
    const { data: staff, error: staffError } = await supabase
      .from("staff")
      .select("role")
      .eq("email", email)
      .single();

    if (staffError) {
      setLoading(false);
      router.replace("/");
      return;
    }

    // 🔹 Redirect based on role
    setTimeout(() => {
      if (staff?.role === "staff") {
        router.replace("/queue");
      } else {
        router.replace("/");
      }
    }, 300);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-black via-gray-950 to-purple-950/40">
      <div className="bg-black/60 backdrop-blur-md p-8 rounded-2xl shadow-[0_0_25px_rgba(0,255,255,0.2)] border border-cyan-500/40 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-linear-to-tr from-cyan-500 to-purple-600 flex items-center justify-center mx-auto shadow-[0_0_12px_#0ff]">
            <span className="text-white text-3xl">🦷</span>
          </div>
          <h2 className="text-2xl font-light text-cyan-300 mt-4">
            Welcome Back
          </h2>
          <p className="text-gray-400 text-sm">
            Sign in to access your dashboard
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs uppercase tracking-wider font-semibold text-cyan-400">
              Email
            </label>
            <input
              type="email"
              required
              className="w-full border border-cyan-500/30 rounded-xl p-3 bg-gray-950/80 text-cyan-100 placeholder:text-gray-500 focus:bg-black focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/50 transition outline-none mt-1"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="text-xs uppercase tracking-wider font-semibold text-cyan-400">
              Password
            </label>
            <input
              type="password"
              required
              className="w-full border border-cyan-500/30 rounded-xl p-3 bg-gray-950/80 text-cyan-100 placeholder:text-gray-500 focus:bg-black focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/50 transition outline-none mt-1"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-linear-to-r from-cyan-600 to-purple-600 text-white font-semibold py-3 rounded-xl shadow-[0_0_12px_#0ff] hover:shadow-[0_0_20px_#0ff] transition disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-gray-400 text-sm mt-6">
          Don't have an account?{" "}
          <Link href="/signup" className="text-cyan-400 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}