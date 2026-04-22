"use client";

import { useEffect, useState } from "react";

export default function EditModal({ item, onClose, onSave }: any) {
  const [name, setName] = useState("");
  const [qty, setQty] = useState<number | "">("");
  const [price, setPrice] = useState<number | "">("");

  useEffect(() => {
    if (!item) return;

    setName(item?.name ?? "");
    setQty(item?.quantity ?? "");
    setPrice(item?.price ?? "");
  }, [item]);

  if (!item) return null;

  const handleSave = () => {
    if (!name.trim()) return;

    onSave({
      ...item,
      name,
      quantity: Number(qty) || 0,
      price: Number(price) || 0,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md">

      <div className="w-[90%] max-w-sm rounded-2xl border border-cyan-500/30 bg-white/5 backdrop-blur-xl shadow-2xl p-6 text-white">

        <h2 className="text-cyan-300 text-lg font-semibold mb-5">
          Edit Item
        </h2>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Item name"
          className="w-full p-3 mb-3 rounded-xl bg-black/40 border border-cyan-500/20 outline-none"
        />

        <input
          type="number"
          value={qty}
          onChange={(e) =>
            setQty(e.target.value === "" ? "" : Number(e.target.value))
          }
          placeholder="Quantity"
          className="w-full p-3 mb-3 rounded-xl bg-black/40 border border-cyan-500/20 outline-none"
        />

        <input
          type="number"
          value={price}
          onChange={(e) =>
            setPrice(e.target.value === "" ? "" : Number(e.target.value))
          }
          placeholder="Price"
          className="w-full p-3 rounded-xl bg-black/40 border border-cyan-500/20 outline-none"
        />

        <div className="flex gap-3 mt-6">

          <button
            onClick={handleSave}
            className="flex-1 py-2 rounded-xl bg-cyan-500 text-black font-bold"
          >
            Save
          </button>

          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-xl bg-white/10"
          >
            Cancel
          </button>

        </div>

      </div>
    </div>
  );
}