"use client";

export default function PharmacySearch({ search, setSearch }: any) {
  return (
    <input
      placeholder="Search medicine..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="w-full mb-4 p-2 rounded bg-black/60 border border-cyan-500/30"
    />
  );
}