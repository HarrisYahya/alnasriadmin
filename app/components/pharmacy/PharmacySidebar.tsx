"use client";

import { useSettings } from "../../context/SettingsContext";
import Link from "next/link";

export default function PharmacySidebar({
  onNavigate,
  signOut,
  open,
  setOpen,
}: any) {
  const { settings, updateSettings } = useSettings();
  const isNeon = settings.theme === "neon";

  const itemClass =
    "flex items-center gap-3 px-3 py-2 rounded-lg transition hover:bg-cyan-500/10 hover:text-cyan-300";

  return (
    <>
      {/* MOBILE OVERLAY */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed md:relative z-50 h-screen
          transition-all duration-300 ease-in-out
          ${isNeon ? "bg-black/95 text-white border-cyan-500/20" : "bg-white text-black border-gray-200"}
          border-r

          /* WIDTH CONTROL */
          ${open ? "w-64" : "w-20 md:w-20"}

          /* MOBILE SLIDE */
          ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* TOP BAR */}
        <div className="flex items-center justify-between p-3 border-b border-gray-500/10">
          
          {/* LOGO */}
          <div className="font-bold text-cyan-400">
            {open ? "Pharmacy" : "P"}
          </div>

          {/* TOGGLE */}
          <button
            onClick={() => setOpen(!open)}
            className="text-cyan-400 text-xl"
          >
            ☰
          </button>
        </div>

        {/* MENU */}
        <div className="flex flex-col gap-2 p-3 text-sm">

          <button
            onClick={() => onNavigate("dashboard")}
            className={itemClass}
          >
            📊 {open && "Dashboard"}
          </button>

          <button
            onClick={() => onNavigate("inventory")}
            className={itemClass}
          >
            💊 {open && "Inventory"}
          </button>

          <button
            onClick={() => onNavigate("sales")}
            className={itemClass}
          >
            🧾 {open && "Sales"}
          </button>

          <Link
            href="/profile"
            className={itemClass}
          >
            👤 {open && "Profile"}
          </Link>

          {/* THEME TOGGLE */}
          <button
            onClick={() =>
              updateSettings({
                theme: isNeon ? "white" : "neon",
              })
            }
            className="
              mt-6 px-3 py-2 rounded-lg
              border border-cyan-500/30
              text-cyan-400
              hover:bg-cyan-500/10
              transition
            "
          >
            {open ? (isNeon ? "🌙 Neon Mode" : "☀️ Light Mode") : "🎨"}
          </button>

          {/* LOGOUT */}
          <button
            onClick={signOut}
            className="
              mt-3 px-3 py-2 rounded-lg
              text-red-400
              hover:bg-red-500/10
              transition
            "
          >
            {open ? "🚪 Logout" : "⎋"}
          </button>
        </div>
      </aside>
    </>
  );
}