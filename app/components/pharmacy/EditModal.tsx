"use client";

import { useEffect, useState } from "react";

export default function EditModal({ item, onClose, onSave }: any) {
  const [name, setName] = useState("");
  const [qty, setQty] = useState<number | "">("");
  const [price, setPrice] = useState<number | "">("");

  useEffect(() => {
    if (item) {
      setName(item.name);
      setQty(item.quantity);
      setPrice(item.price);
    }
  }, [item]);

  if (!item) return null;

  const handleSave = () => {
    onSave({
      ...item,
      name,
      quantity: Number(qty) || 0,
      price: Number(price) || 0,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md">

      <div className="w-[90%] max-w-sm rounded-2xl border border-cyan-500/30 bg-white/5 backdrop-blur-xl shadow-2xl shadow-cyan-500/10 p-6 text-white animate-in fade-in zoom-in duration-200">

        <h2 className="text-cyan-300 text-lg font-semibold mb-5">
          Edit Item
        </h2>

        <div className="space-y-3">

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Item name"
            className="w-full p-3 rounded-xl bg-black/40 border border-cyan-500/20 focus:border-cyan-400 outline-none"
          />

          <input
            type="number"
            value={qty}
            onChange={(e) =>
              setQty(e.target.value === "" ? "" : Number(e.target.value))
            }
            placeholder="Quantity"
            className="w-full p-3 rounded-xl bg-black/40 border border-cyan-500/20 focus:border-cyan-400 outline-none"
          />

          <input
            type="number"
            value={price}
            onChange={(e) =>
              setPrice(e.target.value === "" ? "" : Number(e.target.value))
            }
            placeholder="Price"
            className="w-full p-3 rounded-xl bg-black/40 border border-cyan-500/20 focus:border-cyan-400 outline-none"
          />

        </div>

        <div className="flex gap-3 mt-6">

          <button
            onClick={handleSave}
            className="flex-1 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-90 transition shadow-lg shadow-cyan-500/20"
          >
            Save
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