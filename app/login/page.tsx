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
      if (!session) return;

      const { data } = await supabase
        .from("staff")
        .select("role")
        .eq("email", session.user.email)
        .single();

      if (data?.role === "staff") router.replace("/queue");
      if (data?.role === "pharmacy") router.replace("/pharmacy");
      if (data?.role === "admin") router.replace("/");
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

    const { data } = await supabase
      .from("staff")
      .select("role")
      .eq("email", email)
      .single();

    const role = data?.role;

    // ✅ SAFE ROUTING (NO DASHBOARD EVER SHOWN FIRST)
    if (role === "staff") router.replace("/queue");
    else if (role === "pharmacy") router.replace("/pharmacy");
    else router.replace("/");

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-black via-gray-950 to-purple-950/40">
      <div className="bg-black/60 p-8 rounded-2xl border border-cyan-500/40 w-full max-w-md">

        <h2 className="text-2xl text-cyan-300 text-center mb-6">
          Welcome Back
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 rounded bg-black/70 text-white border border-cyan-500/30"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 rounded bg-black/70 text-white border border-cyan-500/30"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            disabled={loading}
            className="w-full bg-linear-to-r from-cyan-600 to-purple-600 text-white p-3 rounded-xl"
          >
            {loading ? "Signing in..." : "Login"}
          </button>

        </form>

        <p className="text-center text-gray-400 text-sm mt-6">
          Don't have an account?{" "}
          <Link href="/signup" className="text-cyan-400">
            Sign up
          </Link>
        </p>

      </div>
    </div>
  );
}