"use client";

import { useSettings } from "../../context/SettingsContext";

export default function PharmacySearch({ search, setSearch }: any) {
  const { settings } = useSettings();
  const isNeon = settings.theme === "neon";

  return (
    <input
      placeholder="Search medicine..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className={`
        w-full mb-4 p-3 rounded-xl outline-none transition
        ${
          isNeon
            ? "bg-black/60 border border-cyan-500/30 text-white focus:border-cyan-400 focus:shadow-[0_0_10px_rgba(34,211,238,0.3)]"
            : "bg-white border border-gray-300 text-black focus:border-gray-500"
        }
      `}
    />
  );
}