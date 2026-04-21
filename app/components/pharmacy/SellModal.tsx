//app/components/pharmacy/SellModal.tsx
"use client";

import { useState } from "react";

export default function SellModal({ item, onClose, onConfirm }: any) {
  const [qty, setQty] = useState<number | "">("");

  if (!item) return null;

  const handleConfirm = () => {
    if (!qty || qty <= 0) return;
    onConfirm(Number(qty));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md">

      <div className="w-[90%] max-w-sm rounded-2xl border border-cyan-500/30 bg-white/5 backdrop-blur-xl shadow-2xl shadow-cyan-500/10 p-6 text-white animate-in fade-in zoom-in duration-200">

        <h2 className="text-cyan-300 text-lg font-semibold mb-2">
          Sell Medicine
        </h2>

        <div className="mb-4">
          <p className="text-white font-medium">{item.name}</p>
          <p className="text-xs text-gray-400">
            Stock: {item.quantity}
          </p>
        </div>

        <input
          type="number"
          placeholder="Quantity"
          value={qty}
          onChange={(e) =>
            setQty(e.target.value === "" ? "" : Number(e.target.value))
          }
          className="w-full p-3 rounded-xl bg-black/40 border border-cyan-500/20 focus:border-cyan-400 outline-none mb-5"
        />

        <div className="flex gap-3">

          <button
            onClick={handleConfirm}
            disabled={!qty}
            className="flex-1 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:opacity-90 transition disabled:opacity-40 shadow-lg shadow-cyan-500/20"
          >
            Confirm
          </button>

          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition border border-white/10"
          >
            Cancel
          </button>

        </div>

      </div>
    </div>
  );
}