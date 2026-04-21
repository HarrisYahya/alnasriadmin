"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { usePharmacy } from "../context/PharmacyContext";
import { supabase } from "../lib/supabaseClient";
import { logActivity } from "../lib/activityLogger";

import PharmacySidebar from "../components/pharmacy/PharmacySidebar";
import PharmacyHeader from "../components/pharmacy/PharmacyHeader";
import PharmacySearch from "../components/pharmacy/PharmacySearch";
import PharmacyForm from "../components/pharmacy/PharmacyForm";
import PharmacyTable from "../components/pharmacy/PharmacyTable";
import ReceiptModal from "../components/pharmacy/ReceiptModal";
import SellModal from "../components/pharmacy/SellModal";
import EditModal from "../components/pharmacy/EditModal";
import DeleteModal from "../components/pharmacy/DeleteModal";

import ERPDashboard from "../components/pharmacy/ERPDashboard";
import BestSellers from "../components/pharmacy/BestSellers";

export default function PharmacyPage() {
  const { session, signOut } = useAuth();

  const {
    items,
    addItem,
    deleteItem,
    refreshItems,
    triggerRefresh, // ✅ IMPORTANT FIX
  } = usePharmacy();

  const router = useRouter();

  const [name, setName] = useState("");
  const [qty, setQty] = useState<number | "">("");
  const [price, setPrice] = useState<number | "">("");

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState("dashboard");

  const [receipt, setReceipt] = useState<any>(null);
  const [sellItemData, setSellItemData] = useState<any>(null);
  const [editItemData, setEditItemData] = useState<any>(null);
  const [deleteItemData, setDeleteItemData] = useState<any>(null);

  // 🔐 ROLE CHECK
  useEffect(() => {
    const checkRole = async () => {
      if (!session?.user?.email) return;

      const { data } = await supabase
        .from("staff")
        .select("role")
        .eq("email", session.user.email)
        .single();

      if (data?.role !== "pharmacy") {
        router.replace("/");
      }
    };

    checkRole();
  }, [session, router]);

  // ➕ ADD ITEM
  const handleSave = async () => {
    if (!name.trim()) return;

    setLoading(true);

    const payload = {
      name,
      quantity: Number(qty) || 0,
      price: Number(price) || 0,
    };

    await addItem(payload);

    await logActivity({
      action: "add",
      description: `Added item ${name}`,
      user_email: session?.user?.email,
    });

    setName("");
    setQty("");
    setPrice("");
    setLoading(false);

    refreshItems();
    triggerRefresh(); // 🔥 FIX DASHBOARD UPDATE
  };

  // ❌ DELETE
  const confirmDelete = async (id: string) => {
    await deleteItem(id);

    await logActivity({
      action: "delete",
      description: `Deleted item`,
      user_email: session?.user?.email,
    });

    setDeleteItemData(null);

    refreshItems();
    triggerRefresh(); // 🔥 FIX DASHBOARD UPDATE
  };

  // 💊 SELL ITEM (MAIN FIX)
  const confirmSell = async (qtyToSell: number) => {
    const item = sellItemData;
    if (!item) return;

    if (qtyToSell > item.quantity) {
      alert("Not enough stock!");
      return;
    }

    const total = qtyToSell * item.price;

    await supabase.from("sales").insert({
      item_id: item.id,
      quantity: qtyToSell,
      total_price: total,
    });

    await supabase
      .from("pharmacy_items")
      .update({
        quantity: item.quantity - qtyToSell,
      })
      .eq("id", item.id);

    await logActivity({
      action: "sell",
      description: `Sold ${qtyToSell} ${item.name}`,
      user_email: session?.user?.email,
    });

    setReceipt({
      name: item.name,
      quantity: qtyToSell,
      price: item.price,
    });

    setSellItemData(null);

    refreshItems();
    triggerRefresh(); // 🔥 FIX DASHBOARD + SALES + TABLE
  };

  const filteredItems = items.filter((i) =>
    i.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalValue = items.reduce(
    (sum, i) => sum + i.quantity * i.price,
    0
  );

  const lowStock = items.filter((i) => i.quantity <= 5).length;

  return (
    <div className="flex min-h-screen bg-black text-white">

      {/* SIDEBAR */}
      <PharmacySidebar onNavigate={setPage} signOut={signOut} />

      <div className="flex-1 ml-64 p-6 space-y-6">

        {/* HEADER */}
        <PharmacyHeader signOut={signOut} totalValue={totalValue} />

        {/* STATS */}
        <div className="grid grid-cols-3 gap-4">

          <div className="bg-black/40 p-4 rounded-xl border border-cyan-500/20">
            <p className="text-gray-400 text-sm">Items</p>
            <p className="text-cyan-300 text-xl">{items.length}</p>
          </div>

          <div className="bg-black/40 p-4 rounded-xl border border-red-500/20">
            <p className="text-gray-400 text-sm">Low Stock</p>
            <p className="text-red-400 text-xl">{lowStock}</p>
          </div>

          <div className="bg-black/40 p-4 rounded-xl border border-purple-500/20">
            <p className="text-gray-400 text-sm">Value</p>
            <p className="text-purple-300 text-xl">${totalValue}</p>
          </div>

        </div>

        {/* DASHBOARD */}
        {page === "dashboard" && (
          <div className="space-y-6">
            <ERPDashboard />
            <BestSellers />
          </div>
        )}

        {/* INVENTORY */}
        {page === "inventory" && (
          <>
            <PharmacySearch search={search} setSearch={setSearch} />

            <PharmacyForm
              name={name}
              setName={setName}
              qty={qty}
              setQty={setQty}
              price={price}
              setPrice={setPrice}
              handleSave={handleSave}
              loading={loading}
            />

            <PharmacyTable
              items={filteredItems}
              handleEdit={setEditItemData}
              handleDelete={setDeleteItemData}
              sellItem={setSellItemData}
            />
          </>
        )}

      </div>

      {/* MODALS */}
      <ReceiptModal sale={receipt} onClose={() => setReceipt(null)} />

      <SellModal
        item={sellItemData}
        onClose={() => setSellItemData(null)}
        onConfirm={confirmSell}
      />

      <EditModal
        item={editItemData}
        onClose={() => setEditItemData(null)}
        onSave={async () => {
          setEditItemData(null);
          refreshItems();
          triggerRefresh();
        }}
      />

      <DeleteModal
        item={deleteItemData}
        onClose={() => setDeleteItemData(null)}
        onConfirm={confirmDelete}
      />

    </div>
  );
}