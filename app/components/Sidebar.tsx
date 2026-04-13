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

  const linkClass = (path: string) =>
    `w-full text-left p-3 rounded-xl flex items-center gap-3 transition-all ${
      isActive(path)
        ? neonMode
          ? "bg-cyan-950/40 text-cyan-300 font-medium border-l-4 border-cyan-400 shadow-[0_0_8px_#0ff]"
          : "bg-amber-50/60 text-amber-700 font-medium border-l-4 border-amber-500 shadow-sm"
        : neonMode
        ? "text-gray-400 hover:bg-cyan-950/30 hover:text-cyan-300"
        : "text-gray-600 hover:bg-amber-50/50 hover:text-amber-600"
    }`;

  return (
    <aside
      className={`
        ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0 fixed md:relative z-40 w-80 p-7 transition-transform duration-300
        overflow-y-auto h-screen md:h-auto
        ${
          neonMode
            ? "bg-black/70 backdrop-blur-xl shadow-[0_0_25px_rgba(0,255,255,0.2)] rounded-r-3xl border-r border-cyan-500/40"
            : "bg-white/95 backdrop-blur-md shadow-2xl rounded-r-3xl border-r border-amber-200/50"
        }
      `}
    >
      <div className="flex items-center gap-3 mb-12 mt-12 md:mt-0">
        <div
          className={`w-11 h-11 rounded-full flex items-center justify-center ${
            neonMode
              ? "bg-linear-to-tr from-cyan-500 to-purple-600 shadow-[0_0_12px_#0ff]"
              : "bg-linear-to-tr from-amber-500 to-amber-600 shadow-md"
          }`}
        >
          <span className="text-white text-2xl">🦷</span>
        </div>
        <h2
          className={`text-2xl font-light tracking-wide ${
            neonMode ? "text-cyan-300" : "text-gray-800"
          }`}
        >
          Alnasri{" "}
          <span
            className={
              neonMode
                ? "font-semibold text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-purple-400"
                : "font-semibold text-amber-600"
            }
          >
            Dental
          </span>
        </h2>
      </div>

      <nav className="space-y-2">
        <Link href="/" onClick={() => setMobileMenuOpen(false)} className={linkClass("/")}>
          <span>📊</span> Dashboard
        </Link>

        <Link
          href="/add-patient"
          onClick={() => setMobileMenuOpen(false)}
          className={linkClass("/add-patient")}
        >
          <span>➕</span> Add Patient
        </Link>

        <Link
          href="/patients"
          onClick={() => setMobileMenuOpen(false)}
          className={linkClass("/patients")}
        >
          <span>👥</span> All Patients
        </Link>

        <Link
          href="/today-patients"
          onClick={() => setMobileMenuOpen(false)}
          className={linkClass("/today-patients")}
        >
          <span>📅</span> Today's Patients
        </Link>

        <Link
          href="/calendar"
          onClick={() => setMobileMenuOpen(false)}
          className={linkClass("/calendar")}
        >
          <span>📆</span> Calendar
        </Link>

        <Link
          href="/settings"
          onClick={() => setMobileMenuOpen(false)}
          className={linkClass("/settings")}
        >
          <span>⚙️</span> Settings
        </Link>
      </nav>

      <div
        className={`absolute bottom-8 left-8 text-xs tracking-wider hidden md:block ${
          neonMode ? "text-cyan-500/70" : "text-amber-400/80"
        }`}
      >
        <p className={neonMode ? "animate-pulse" : ""}>
          {neonMode ? "✨ neon premium suite" : "✨ white luxury suite"}
        </p>
      </div>
    </aside>
  );
}