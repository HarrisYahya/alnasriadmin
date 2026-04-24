"use client";

import { useState } from "react";

export default function SellModal({ item, onClose, onConfirm }: any) {
  const [qty, setQty] = useState<number | "">("");
  const [loading, setLoading] = useState(false);

  if (!item) return null;

  const numQty = Number(qty);

  const isValid =
    typeof qty === "number" &&
    qty > 0 &&
    qty <= item.quantity;

  const handleConfirm = async () => {
    const safeQty = Number(qty);

    if (!safeQty || safeQty <= 0) {
      alert("Enter valid quantity");
      return;
    }

    if (safeQty > item.quantity) {
      alert("Not enough stock!");
      return;
    }

    try {
      setLoading(true);
      await onConfirm(safeQty); // 🔥 this connects to your page logic
      setQty(""); // reset after success
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const totalPreview =
    qty !== "" && !isNaN(numQty)
      ? numQty * item.price
      : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md">
      <div className="w-[90%] max-w-sm rounded-2xl border border-cyan-500/30 bg-white/5 backdrop-blur-xl shadow-2xl shadow-cyan-500/10 p-6 text-white">

        <h2 className="text-cyan-300 text-lg font-semibold mb-2">
          Sell Medicine
        </h2>

        <div className="mb-4">
          <p className="font-medium">{item.name}</p>
          <p className="text-xs text-gray-400">
            Stock: {item.quantity}
          </p>
          <p className="text-xs text-green-400">
            Price: ${item.price}
          </p>
        </div>

        <input
          type="number"
          placeholder="Quantity"
          value={qty}
          onChange={(e) =>
            setQty(e.target.value === "" ? "" : Number(e.target.value))
          }
          className="w-full p-3 rounded-xl bg-black/40 border border-cyan-500/20 focus:border-cyan-400 outline-none mb-3"
        />

        {/* 🔥 LIVE TOTAL */}
        <p className="text-sm text-green-400 mb-4">
          Total: ${totalPreview}
        </p>

        <div className="flex gap-3">
          <button
            onClick={handleConfirm}
            disabled={!isValid || loading}
            className="flex-1 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:opacity-90 transition disabled:opacity-40"
          >
            {loading ? "Processing..." : "Confirm"}
          </button>

          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition"
          >
            Cancel
          </button>
        </div>

      </div>
    </div>
  );
}