"use client";

import { useSettings } from "../../context/SettingsContext";

export default function PharmacyHeader({ signOut, totalValue }: any) {
  const { settings } = useSettings();
  const isNeon = settings.theme === "neon";

  return (
    <div className="flex justify-between items-center mb-6">

      <h1
        className={
          isNeon
            ? "text-3xl text-cyan-300 font-light"
            : "text-3xl text-black font-semibold"
        }
      >
        Pharmacy Inventory
      </h1>

      <div className="flex gap-4 items-center">

        <div
          className={`
            px-4 py-2 rounded-xl text-sm border
            ${
              isNeon
                ? "bg-black/60 border-cyan-500/30 text-cyan-300"
                : "bg-white border-gray-300 text-black"
            }
          `}
        >
          Total Value: ${totalValue}
        </div>

        <button
          onClick={signOut}
          className={`
            px-4 py-2 rounded-xl transition
            ${
              isNeon
                ? "bg-red-500/20 border border-red-500/40 text-red-400"
                : "bg-red-500 text-white"
            }
          `}
        >
          Logout
        </button>

      </div>
    </div>
  );
}