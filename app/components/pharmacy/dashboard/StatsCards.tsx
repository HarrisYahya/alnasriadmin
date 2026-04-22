"use client";

export default function StatsCards({ items, lowStock, totalValue, isNeon }: any) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

      <div className={`p-4 rounded-xl border ${isNeon ? "bg-black/40 border-cyan-500/20" : "bg-white border-gray-200"}`}>
        <p className="text-sm text-gray-400">Items</p>
        <p className="text-xl">{items.length}</p>
      </div>

      <div className={`p-4 rounded-xl border ${isNeon ? "bg-black/40 border-red-500/20" : "bg-white border-gray-200"}`}>
        <p className="text-sm text-gray-400">Low Stock</p>
        <p className="text-xl text-red-400">{lowStock}</p>
      </div>

      <div className={`p-4 rounded-xl border ${isNeon ? "bg-black/40 border-purple-500/20" : "bg-white border-gray-200"}`}>
        <p className="text-sm text-gray-400">Value</p>
        <p className="text-xl">${totalValue}</p>
      </div>

    </div>
  );
}