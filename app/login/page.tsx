"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabaseClient";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    // get role from staff table
    const { data: roleData } = await supabase
      .from("staff")
      .select("role")
      .eq("email", email)
      .single();

    const role = roleData?.role;

    // ✅ SET COOKIE FOR MIDDLEWARE
    document.cookie = `role=${role}; path=/`;

    // redirect based on role
    if (role === "admin") router.replace("/");
    else if (role === "staff") router.replace("/queue");
    else if (role === "pharmacy") router.replace("/pharmacy");
    else router.replace("/");

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <form
        onSubmit={handleLogin}
        className="bg-gray-900 p-6 rounded-xl w-full max-w-sm space-y-4"
      >
        <h1 className="text-xl font-bold text-center">Login</h1>

        {error && (
          <div className="bg-red-500/20 text-red-400 p-2 rounded">
            {error}
          </div>
        )}

        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 rounded bg-black border border-gray-700"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 rounded bg-black border border-gray-700"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          disabled={loading}
          className="w-full bg-cyan-500 hover:bg-cyan-600 p-2 rounded font-bold"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}