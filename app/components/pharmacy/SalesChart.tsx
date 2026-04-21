"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useSettings } from "../../context/SettingsContext";

export default function SalesChart() {
  const { settings } = useSettings();
  const isNeon = settings.theme === "neon";

  const [data, setData] = useState<number[]>([]);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("sales")
        .select("total_price, created_at")
        .order("created_at", { ascending: true });

      if (!data) return;

      // group by day (simple)
      const map: Record<string, number> = {};

      data.forEach((s: any) => {
        const day = new Date(s.created_at).toDateString();
        map[day] = (map[day] || 0) + s.total_price;
      });

      setData(Object.values(map).slice(-7)); // last 7 days
    };

    load();
  }, []);

  return (
    <div
      className={`p-4 rounded-xl border ${
        isNeon
          ? "bg-black/40 border-cyan-500/30"
          : "bg-white border-gray-200"
      }`}
    >
      <h2 className="text-sm mb-3">📊 Sales Overview (7 Days)</h2>

      <div className="flex items-end gap-2 h-40">
        {data.map((v, i) => (
          <div
            key={i}
            className={`w-6 rounded-t ${
              isNeon ? "bg-cyan-400" : "bg-gray-500"
            }`}
            style={{ height: `${Math.max(10, v / 10)}px` }}
          />
        ))}
      </div>
    </div>
  );
}