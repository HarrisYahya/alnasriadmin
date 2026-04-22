"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabaseClient";
import { useSettings } from "../../../context/SettingsContext";

export default function SalesView() {
  const { settings } = useSettings();
  const isNeon = settings.theme === "neon";

  const [sales, setSales] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSales = async () => {
      setLoading(true);

      const { data } = await supabase
        .from("sales")
        .select("*")
        .order("created_at", { ascending: false });

      setSales(data || []);
      setLoading(false);
    };

    fetchSales();
  }, []);

  // 📊 CALCULATIONS
  const totalRevenue = sales.reduce(
    (sum, s) => sum + (s.total_price || 0),
    0
  );

  const totalItems = sales.reduce(
    (sum, s) => sum + (s.quantity || 0),
    0
  );

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold">📊 Sales Dashboard</h1>
        <p className="text-gray-400 text-sm">
          Track all pharmacy transactions
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

        <div className={`p-4 rounded-xl border ${isNeon ? "bg-black/40 border-cyan-500/20" : "bg-white"}`}>
          <p className="text-gray-400 text-sm">Transactions</p>
          <p className="text-xl text-cyan-400">{sales.length}</p>
        </div>

        <div className={`p-4 rounded-xl border ${isNeon ? "bg-black/40 border-purple-500/20" : "bg-white"}`}>
          <p className="text-gray-400 text-sm">Items Sold</p>
          <p className="text-xl text-purple-400">{totalItems}</p>
        </div>

        <div className={`p-4 rounded-xl border ${isNeon ? "bg-black/40 border-green-500/20" : "bg-white"}`}>
          <p className="text-gray-400 text-sm">Revenue</p>
          <p className="text-xl text-green-400">${totalRevenue}</p>
        </div>

      </div>

      {/* TABLE */}
      <div className={`rounded-xl border overflow-hidden ${
        isNeon
          ? "bg-black/40 border-cyan-500/20 text-white"
          : "bg-white border-gray-200"
      }`}>

        <table className="w-full text-sm">

          <thead className={isNeon ? "bg-black/60 text-cyan-300" : "bg-gray-100"}>
            <tr>
              <th className="p-3 text-left">Item</th>
              <th className="text-left">Qty</th>
              <th className="text-left">Total</th>
              <th className="text-left">Date</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td className="p-3 text-gray-400">Loading sales...</td>
              </tr>
            ) : sales.length === 0 ? (
              <tr>
                <td className="p-3 text-gray-400">No sales found</td>
              </tr>
            ) : (
              sales.map((s) => (
                <tr
                  key={s.id}
                  className="border-t border-gray-700/20 hover:bg-cyan-500/5"
                >
                  <td className="p-3">
                    {s.item_name || s.item_id}
                  </td>

                  <td>{s.quantity}</td>

                  <td className="text-green-400">
                    ${s.total_price}
                  </td>

                  <td className="text-gray-400 text-xs">
                    {new Date(s.created_at).toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>

        </table>
      </div>

    </div>
  );
}