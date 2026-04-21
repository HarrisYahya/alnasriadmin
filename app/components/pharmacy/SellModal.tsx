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
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-gray-900 text-white p-6 rounded-xl w-80 border border-cyan-500/30">

        <h2 className="text-lg text-cyan-300 mb-3">
          Sell Medicine
        </h2>

        <p className="text-sm mb-2">{item.name}</p>
        <p className="text-xs text-gray-400 mb-4">
          Stock: {item.quantity}
        </p>

        <input
          type="number"
          placeholder="Quantity"
          value={qty}
          onChange={(e) =>
            setQty(e.target.value === "" ? "" : Number(e.target.value))
          }
          className="w-full p-2 rounded bg-black/60 border border-cyan-500/30 mb-4"
        />

        <div className="flex gap-2">
          <button
            onClick={handleConfirm}
            className="flex-1 bg-cyan-600 p-2 rounded"
          >
            Confirm
          </button>

          <button
            onClick={onClose}
            className="flex-1 bg-gray-700 p-2 rounded"
          >
            Cancel
          </button>
        </div>

      </div>
    </div>
  );
}