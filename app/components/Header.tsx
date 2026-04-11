"use client";

import { useAuth } from "../context/AuthContext";

interface HeaderProps {
  patientsCount: number;
  neonMode: boolean;
  setNeonMode: (mode: boolean) => void;
}

export default function Header({ patientsCount, neonMode, setNeonMode }: HeaderProps) {
  const { signOut } = useAuth(); // ✅ hook inside component

  return (
    <div className="flex flex-wrap justify-between items-center mb-6 md:mb-8 mt-12 md:mt-0">
      <div>
        <h1
          className={`text-3xl md:text-4xl font-light tracking-tight ${
            neonMode ? "text-cyan-300" : "text-gray-800"
          }`}
        >
          Admin{" "}
          <span
            className={
              neonMode
                ? "font-semibold text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-purple-400"
                : "font-semibold text-amber-600"
            }
          >
            Dashboard
          </span>
        </h1>

        <p
          className={`mt-1 text-sm ${
            neonMode ? "text-gray-400" : "text-gray-500"
          }`}
        >
          {neonMode
            ? "futuristic patient management"
            : "white glove patient management"}
        </p>
      </div>

      <div className="flex items-center gap-4">
        {/* Theme Toggle */}
        <button
          onClick={() => setNeonMode(!neonMode)}
          className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors focus:outline-none ${
            neonMode
              ? "bg-linear-to-r from-cyan-600 to-purple-600 shadow-[0_0_8px_#0ff]"
              : "bg-linear-to-r from-amber-500 to-amber-700 shadow-md"
          }`}
        >
          <span
            className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
              neonMode ? "translate-x-9" : "translate-x-1"
            }`}
          />
        </button>

        {/* Logout */}
        <button
          onClick={signOut}
          className={`px-4 py-2 rounded-xl transition ${
            neonMode
              ? "bg-red-600/80 hover:bg-red-600 text-white"
              : "bg-red-500/80 hover:bg-red-500 text-white"
          }`}
        >
          Logout
        </button>

        {/* Patients Count */}
        <div
          className={`rounded-full px-4 md:px-5 py-2 mt-2 md:mt-0 backdrop-blur-sm ${
            neonMode
              ? "bg-black/60 shadow-[0_0_8px_#0ff] border border-cyan-500/50"
              : "bg-white/80 shadow-md border border-amber-200/80"
          }`}
        >
          <span
            className={`text-sm font-medium ${
              neonMode
                ? "text-cyan-400 font-mono"
                : "text-amber-600"
            }`}
          >
            ✨ {patientsCount} registered patients
          </span>
        </div>
      </div>
    </div>
  );
}