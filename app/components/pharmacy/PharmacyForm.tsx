"use client";

export default function PharmacyForm({
  name,
  setName,
  qty,
  setQty,
  price,
  setPrice,
  handleSave,
  loading,
  editId,
}: any) {
  return (
    <div className="grid md:grid-cols-4 gap-3 mb-6">

      <input
        placeholder="Item name"
        className="p-2 rounded bg-black/60 border border-cyan-500/30"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        type="number"
        placeholder="Qty"
        className="p-2 rounded bg-black/60 border border-cyan-500/30"
        value={qty}
        onChange={(e) =>
          setQty(e.target.value === "" ? "" : Number(e.target.value))
        }
      />

      <input
        type="number"
        placeholder="Price"
        className="p-2 rounded bg-black/60 border border-cyan-500/30"
        value={price}
        onChange={(e) =>
          setPrice(e.target.value === "" ? "" : Number(e.target.value))
        }
      />

      <button
        onClick={handleSave}
        disabled={loading}
        className="bg-linear-to-r from-cyan-600 to-purple-600 rounded-xl"
      >
        {loading ? "Saving..." : editId ? "Update" : "Add"}
      </button>

    </div>
  );
}