"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarProps {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  neonMode: boolean;
}

export default function Sidebar({ mobileMenuOpen, setMobileMenuOpen, neonMode }: SidebarProps) {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <aside
      className={`
        ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0 fixed md:relative z-40 w-80 p-7 transition-transform duration-300
        overflow-y-auto h-full md:h-auto
        ${neonMode 
          ? "bg-black/70 backdrop-blur-xl shadow-[0_0_25px_rgba(0,255,255,0.2)] rounded-r-3xl border-r border-cyan-500/40" 
          : "bg-white/95 backdrop-blur-md shadow-2xl rounded-r-3xl border-r border-amber-200/50"
        }
      `}
    >
      <div className="flex items-center gap-3 mb-12 mt-12 md:mt-0">
        <div className={`w-11 h-11 rounded-full flex items-center justify-center ${
          neonMode 
            ? "bg-linear-to-tr from-cyan-500 to-purple-600 shadow-[0_0_12px_#0ff]" 
            : "bg-linear-to-tr from-amber-500 to-amber-600 shadow-md"
        }`}>
          <span className="text-white text-2xl">🦷</span>
        </div>
        <h2 className={`text-2xl font-light tracking-wide ${neonMode ? "text-cyan-300" : "text-gray-800"}`}>
          Alnasri <span className={neonMode ? "font-semibold text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-purple-400" : "font-semibold text-amber-600"}>Dental</span>
        </h2>
      </div>

      <nav className="space-y-2">
        {/* Dashboard */}
        <Link href="/">
          <button
            className={`w-full text-left p-3 rounded-xl flex items-center gap-3 transition-all ${
              isActive("/")
                ? neonMode 
                  ? "bg-cyan-950/40 text-cyan-300 font-medium border-l-4 border-cyan-400 shadow-[0_0_8px_#0ff]" 
                  : "bg-amber-50/60 text-amber-700 font-medium border-l-4 border-amber-500 shadow-sm"
                : neonMode 
                  ? "text-gray-400 hover:bg-cyan-950/30 hover:text-cyan-300" 
                  : "text-gray-600 hover:bg-amber-50/50 hover:text-amber-600"
            }`}
          >
            <span>📊</span> Dashboard
          </button>
        </Link>

        {/* Add Patient */}
        <Link href="/add-patient">
          <button
            className={`w-full text-left p-3 rounded-xl flex items-center gap-3 transition ${
              isActive("/add-patient")
                ? neonMode 
                  ? "bg-cyan-950/40 text-cyan-300 font-medium border-l-4 border-cyan-400 shadow-[0_0_8px_#0ff]" 
                  : "bg-amber-50/60 text-amber-700 font-medium border-l-4 border-amber-500 shadow-sm"
                : neonMode 
                  ? "text-gray-400 hover:bg-cyan-950/30 hover:text-cyan-300" 
                  : "text-gray-600 hover:bg-amber-50/50 hover:text-amber-600"
            }`}
          >
            <span>➕</span> Add Patient
          </button>
        </Link>

        {/* All Patients */}
        <Link href="/patients">
          <button
            className={`w-full text-left p-3 rounded-xl flex items-center gap-3 transition ${
              isActive("/patients")
                ? neonMode 
                  ? "bg-cyan-950/40 text-cyan-300 font-medium border-l-4 border-cyan-400 shadow-[0_0_8px_#0ff]" 
                  : "bg-amber-50/60 text-amber-700 font-medium border-l-4 border-amber-500 shadow-sm"
                : neonMode 
                  ? "text-gray-400 hover:bg-cyan-950/30 hover:text-cyan-300" 
                  : "text-gray-600 hover:bg-amber-50/50 hover:text-amber-600"
            }`}
          >
            <span>👥</span> All Patients
          </button>
        </Link>

        {/* Today's Patients (NEW) */}
        <Link href="/today-patients">
          <button
            className={`w-full text-left p-3 rounded-xl flex items-center gap-3 transition ${
              isActive("/today-patients")
                ? neonMode 
                  ? "bg-cyan-950/40 text-cyan-300 font-medium border-l-4 border-cyan-400 shadow-[0_0_8px_#0ff]" 
                  : "bg-amber-50/60 text-amber-700 font-medium border-l-4 border-amber-500 shadow-sm"
                : neonMode 
                  ? "text-gray-400 hover:bg-cyan-950/30 hover:text-cyan-300" 
                  : "text-gray-600 hover:bg-amber-50/50 hover:text-amber-600"
            }`}
          >
            <span>📅</span> Today's Patients
          </button>
        </Link>

        {/* Calendar (NEW) */}
        <Link href="/calendar">
          <button
            className={`w-full text-left p-3 rounded-xl flex items-center gap-3 transition ${
              isActive("/calendar")
                ? neonMode 
                  ? "bg-cyan-950/40 text-cyan-300 font-medium border-l-4 border-cyan-400 shadow-[0_0_8px_#0ff]" 
                  : "bg-amber-50/60 text-amber-700 font-medium border-l-4 border-amber-500 shadow-sm"
                : neonMode 
                  ? "text-gray-400 hover:bg-cyan-950/30 hover:text-cyan-300" 
                  : "text-gray-600 hover:bg-amber-50/50 hover:text-amber-600"
            }`}
          >
            <span>📆</span> Calendar
          </button>
        </Link>

        {/* Settings */}
        <Link href="/settings">
          <button
            className={`w-full text-left p-3 rounded-xl flex items-center gap-3 transition ${
              isActive("/settings")
                ? neonMode 
                  ? "bg-cyan-950/40 text-cyan-300 font-medium border-l-4 border-cyan-400 shadow-[0_0_8px_#0ff]" 
                  : "bg-amber-50/60 text-amber-700 font-medium border-l-4 border-amber-500 shadow-sm"
                : neonMode 
                  ? "text-gray-400 hover:bg-cyan-950/30 hover:text-cyan-300" 
                  : "text-gray-600 hover:bg-amber-50/50 hover:text-amber-600"
            }`}
          >
            <span>⚙️</span> Settings
          </button>
        </Link>
      </nav>

      <div className={`absolute bottom-8 left-8 text-xs tracking-wider hidden md:block ${
        neonMode ? "text-cyan-500/70" : "text-amber-400/80"
      }`}>
        <p className={neonMode ? "animate-pulse" : ""}>
          {neonMode ? "✨ neon premium suite" : "✨ white luxury suite"}
        </p>
      </div>
    </aside>
  );
}