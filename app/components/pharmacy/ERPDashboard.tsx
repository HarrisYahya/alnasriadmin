"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { usePharmacy } from "../../context/PharmacyContext";

export default function ERPDashboard() {
  const { refreshKey } = usePharmacy();

  const [stats, setStats] = useState({
    sales: 0,
    revenue: 0,
    profit: 0,
    lowStock: 0,
  });

  useEffect(() => {
    const load = async () => {
      const { data: sales } = await supabase.from("sales").select("*");
      const { data: items } = await supabase
        .from("pharmacy_items")
        .select("*");

      const revenue =
        sales?.reduce((sum, s) => sum + s.total_price, 0) || 0;

      const profit =
        sales?.reduce((sum, s) => sum + (s.profit || 0), 0) || 0;

      setStats({
        sales: sales?.length || 0,
        revenue,
        profit,
        lowStock: items?.filter((i) => i.quantity <= 5).length || 0,
      });
    };

    load();
  }, [refreshKey]);

  const cards = [
    {
      title: "Total Sales",
      value: stats.sales,
      color: "from-cyan-500 to-blue-500",
      glow: "shadow-cyan-500/20",
      icon: "📊",
    },
    {
      title: "Revenue",
      value: `$${stats.revenue}`,
      color: "from-green-400 to-emerald-600",
      glow: "shadow-green-500/20",
      icon: "💰",
    },
    {
      title: "Profit",
      value: `$${stats.profit}`,
      color: "from-purple-500 to-pink-500",
      glow: "shadow-purple-500/20",
      icon: "📈",
    },
    {
      title: "Low Stock",
      value: stats.lowStock,
      color: "from-red-500 to-orange-500",
      glow: "shadow-red-500/20",
      icon: "⚠️",
    },
  ];

  return (
    <div className="p-6">
      {/* Background glow */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-black via-gray-950 to-black" />

      <h1 className="text-white text-2xl font-bold mb-6 tracking-wide">
        🧠 ERP Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        {cards.map((card, index) => (
          <div
            key={index}
            className={`relative overflow-hidden rounded-2xl p-5 border border-white/10
            bg-white/5 backdrop-blur-xl transition-all duration-300
            hover:scale-[1.03] hover:border-white/20 hover:${card.glow}
            shadow-lg`}
          >
            {/* glowing gradient overlay */}
            <div
              className={`absolute inset-0 opacity-10 bg-gradient-to-r ${card.color}`}
            />

            <div className="relative z-10">
              <div className="text-2xl">{card.icon}</div>

              <p className="text-gray-400 text-sm mt-2">{card.title}</p>

              <p className="text-white text-2xl font-bold mt-1 tracking-wide">
                {card.value}
              </p>
            </div>

            {/* animated corner glow */}
            <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-white/10 blur-2xl rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}