"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function BestSellers() {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from("sales").select("*");

      if (!data) return;

      const map: Record<string, number> = {};

      data.forEach((sale) => {
        map[sale.item_id] = (map[sale.item_id] || 0) + sale.quantity;
      });

      const sorted = Object.entries(map)
        .sort((a: any, b: any) => b[1] - a[1])
        .slice(0, 5);

      setItems(sorted);
    };

    load();
  }, []);

  return (
    <div className="bg-black/40 border border-cyan-500/20 p-4 rounded-xl">
      <h2 className="text-cyan-300 mb-3">🔥 Top Selling Medicines</h2>

      {items.length === 0 ? (
        <p className="text-sm opacity-60">No sales yet</p>
      ) : (
        items.map(([id, qty]) => (
          <div
            key={id}
            className="flex justify-between border-b border-gray-800 py-1 text-sm"
          >
            <span>{id}</span>
            <span className="text-cyan-400">{qty}</span>
          </div>
        ))
      )}
    </div>
  );
}