//app/components/pharmacy/SalesTable.tsx
"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useSettings } from "../../context/SettingsContext";

export default function SalesTable() {
  const { settings } = useSettings();
  const isNeon = settings.theme === "neon";

  const [sales, setSales] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("sales")
        .select("*")
        .order("created_at", { ascending: false });

      setSales(data || []);
    };

    load();
  }, []);

  return (
    <div
      className={`rounded-xl border overflow-hidden ${
        isNeon
          ? "bg-black/40 border-cyan-500/30 text-white"
          : "bg-white border-gray-200"
      }`}
    >
      <table className="w-full text-left">

        <thead className={isNeon ? "text-cyan-300 bg-black/60" : "bg-gray-100"}>
          <tr>
            <th className="p-3">Item</th>
            <th>Qty</th>
            <th>Total</th>
            <th>Date</th>
          </tr>
        </thead>

        <tbody>
          {sales.map((s) => (
            <tr key={s.id} className="border-t border-gray-700/20">

              {/* ✅ FIX: show name instead of ID */}
              <td className="p-3">
                {s.item_name || "Unknown Item"}
              </td>

              <td>{s.quantity}</td>

              <td>${s.total_price}</td>

              <td className="text-xs text-gray-400">
                {s.created_at
                  ? new Date(s.created_at).toLocaleString()
                  : ""}
              </td>

            </tr>
          ))}
        </tbody>

      </table>
    </div>
  );
}