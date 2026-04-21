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
  }, [refreshKey]); // 🔥 THIS FIXES EVERYTHING

  return (
    <div className="grid grid-cols-4 gap-4">
      <div className="p-4 bg-black/40 border border-cyan-500/20 rounded-xl">
        Sales: {stats.sales}
      </div>

      <div className="p-4 bg-black/40 border border-green-500/20 rounded-xl">
        Revenue: ${stats.revenue}
      </div>

      <div className="p-4 bg-black/40 border border-purple-500/20 rounded-xl">
        Profit: ${stats.profit}
      </div>

      <div className="p-4 bg-black/40 border border-red-500/20 rounded-xl">
        Low Stock: {stats.lowStock}
      </div>
    </div>
  );
}