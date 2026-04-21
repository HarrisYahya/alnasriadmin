"use client";

import { useState } from "react";

export default function PharmacySidebar({ onNavigate, signOut }: any) {
  const [open, setOpen] = useState(true);

  return (
    <div
      className={`h-screen fixed left-0 top-0 bg-black/80 border-r border-cyan-500/20 text-white transition-all duration-300 ${
        open ? "w-64" : "w-16"
      }`}
    >
      {/* Toggle */}
      <button
        onClick={() => setOpen(!open)}
        className="p-3 text-cyan-300 w-full text-left"
      >
        ☰
      </button>

      {/* Menu */}
      <div className="flex flex-col gap-2 p-3">

        <button
          onClick={() => onNavigate("dashboard")}
          className="text-left hover:text-cyan-300"
        >
          📊 {open && "Dashboard"}
        </button>

        <button
          onClick={() => onNavigate("inventory")}
          className="text-left hover:text-cyan-300"
        >
          💊 {open && "Inventory"}
        </button>

        <button
          onClick={() => onNavigate("sales")}
          className="text-left hover:text-cyan-300"
        >
          🧾 {open && "Sales"}
        </button>

        <button
          onClick={signOut}
          className="text-left text-red-400 mt-6"
        >
          🚪 {open && "Logout"}
        </button>

      </div>
    </div>
  );
}