"use client";

import { useSettings } from "../../context/SettingsContext";

export default function PharmacyForm({
  name,
  setName,
  qty,
  setQty,
  price,
  setPrice,
  handleSave,
  loading,
}: any) {
  const { settings } = useSettings();
  const isNeon = settings.theme === "neon";

  const inputClass = `
    p-2 rounded w-full transition outline-none
    ${
      isNeon
        ? "bg-black/60 border border-cyan-500/30 text-white focus:border-cyan-400"
        : "bg-white border border-gray-300 text-black"
    }
  `;

  return (
    <div
      className={`
        grid md:grid-cols-4 gap-3 mb-6 p-4 rounded-xl border
        ${
          isNeon
            ? "bg-black/40 border-cyan-500/20"
            : "bg-white border-gray-200"
        }
      `}
    >
      <input
        placeholder="Item name"
        className={inputClass}
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        type="number"
        placeholder="Qty"
        className={inputClass}
        value={qty}
        onChange={(e) =>
          setQty(e.target.value === "" ? "" : Number(e.target.value))
        }
      />

      <input
        type="number"
        placeholder="Price"
        className={inputClass}
        value={price}
        onChange={(e) =>
          setPrice(e.target.value === "" ? "" : Number(e.target.value))
        }
      />

      <button
        onClick={handleSave}
        className={`
          rounded-xl text-white transition
          ${
            isNeon
              ? "bg-cyan-600 hover:bg-cyan-500"
              : "bg-gray-800 hover:bg-gray-700"
          }
        `}
      >
        {loading ? "Saving..." : "Save Item"}
      </button>
    </div>
  );
}