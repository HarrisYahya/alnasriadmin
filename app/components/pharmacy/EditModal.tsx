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
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-gray-900 p-6 rounded-xl w-80 text-white border border-cyan-500/30">

        <h2 className="text-cyan-300 text-lg mb-3">
          Edit Item
        </h2>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 mb-2 rounded bg-black/60 border border-cyan-500/30"
          placeholder="Name"
        />

        <input
          type="number"
          value={qty}
          onChange={(e) =>
            setQty(e.target.value === "" ? "" : Number(e.target.value))
          }
          className="w-full p-2 mb-2 rounded bg-black/60 border border-cyan-500/30"
          placeholder="Quantity"
        />

        <input
          type="number"
          value={price}
          onChange={(e) =>
            setPrice(e.target.value === "" ? "" : Number(e.target.value))
          }
          className="w-full p-2 mb-4 rounded bg-black/60 border border-cyan-500/30"
          placeholder="Price"
        />

        <div className="flex gap-2">
          <button
            onClick={handleSave}
            className="flex-1 bg-cyan-600 p-2 rounded"
          >
            Save
          </button>

          <button
            onClick={onClose}
            className="flex-1 bg-gray-600 p-2 rounded"
          >
            Cancel
          </button>
        </div>

      </div>
    </div>
  );
}