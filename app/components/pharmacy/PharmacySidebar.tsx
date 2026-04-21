"use client";

import { useState } from "react";
import { useSettings } from "../../context/SettingsContext";

export default function PharmacySidebar({ onNavigate, signOut }: any) {
  const [open, setOpen] = useState(true);

  // 🌗 THEME CONTROL
  const { settings, updateSettings } = useSettings();
  const isNeon = settings.theme === "neon";

  const itemClass =
    "flex items-center gap-2 px-3 py-2 rounded-lg transition hover:bg-cyan-500/10 hover:text-cyan-300";

  return (
    <div
      className={`h-screen fixed left-0 top-0 transition-all duration-300 border-r
      ${
        isNeon
          ? "bg-black/80 border-cyan-500/30 text-white"
          : "bg-white border-gray-200 text-black"
      }
      ${open ? "w-64" : "w-16"}`}
    >
      {/* TOGGLE SIDEBAR */}
      <button
        onClick={() => setOpen(!open)}
        className="p-3 w-full text-left text-cyan-300"
      >
        ☰
      </button>

      {/* MENU */}
      <div className="flex flex-col gap-2 p-3 text-sm">

        <button onClick={() => onNavigate("dashboard")} className={itemClass}>
          📊 {open && "Dashboard"}
        </button>

        <button onClick={() => onNavigate("inventory")} className={itemClass}>
          💊 {open && "Inventory"}
        </button>

        <button onClick={() => onNavigate("sales")} className={itemClass}>
          🧾 {open && "Sales"}
        </button>

        {/* 🌗 NEON TOGGLE */}
        <button
          onClick={() =>
            updateSettings({
              theme: isNeon ? "white" : "neon",
            })
          }
          className="
            mt-6 px-3 py-2 rounded-lg
            border border-cyan-500/30
            text-cyan-300
            hover:bg-cyan-500/10
          "
        >
          {open && (isNeon ? "🌙 Neon Mode" : "☀️ Light Mode")}
        </button>

        {/* LOGOUT */}
        <button
          onClick={signOut}
          className="
            mt-4 px-3 py-2 rounded-lg
            text-red-400
            hover:bg-red-500/10
          "
        >
          🚪 {open && "Logout"}
        </button>

      </div>
    </div>
  );
}