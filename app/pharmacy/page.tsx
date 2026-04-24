"use client"; 

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { usePharmacy } from "../context/PharmacyContext";
import { useSettings } from "../context/SettingsContext";
import { supabase } from "../lib/supabaseClient";
import { logActivity } from "../lib/activityLogger";

import PharmacySidebar from "../components/pharmacy/PharmacySidebar";
import PharmacyHeader from "../components/pharmacy/PharmacyHeader";
import ReceiptModal from "../components/pharmacy/ReceiptModal";
import SellModal from "../components/pharmacy/SellModal";
import EditModal from "../components/pharmacy/EditModal";
import DeleteModal from "../components/pharmacy/DeleteModal";

import StatsCards from "../components/pharmacy/dashboard/StatsCards";
import DashboardView from "../components/pharmacy/dashboard/DashboardView";
import InventoryView from "../components/pharmacy/dashboard/InventoryView";
import SalesView from "../components/pharmacy/dashboard/SalesView";

import ProtectedRoute from "../components/ProtectedRoute";

export default function PharmacyPage() {
  const { session, signOut } = useAuth();
  const { settings } = useSettings();
  const isNeon = settings.theme === "neon";

  const {
    items,
    deleteItem,
    refreshItems,
    triggerRefresh,
  } = usePharmacy();

  const router = useRouter();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [page, setPage] = useState("dashboard");

  const [name, setName] = useState("");
  const [qty, setQty] = useState<number | "">("");
  const [price, setPrice] = useState<number | "">("");

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const [receipt, setReceipt] = useState<any>(null);
  const [sellItemData, setSellItemData] = useState<any>(null);
  const [editItemData, setEditItemData] = useState<any>(null);
  const [deleteItemData, setDeleteItemData] = useState<any>(null);

  useEffect(() => {
    const checkRole = async () => {
      if (!session?.user?.email) return;

      const { data } = await supabase
        .from("staff")
        .select("role")
        .eq("email", session.user.email)
        .single();

      if (data?.role !== "pharmacy" && data?.role !== "admin") {
        router.replace("/");
      }
    };

    checkRole();
  }, [session, router]);

  const handleSave = async () => {
    if (!name.trim()) return;

    setLoading(true);

    await supabase.from("pharmacy_items").insert({
      name,
      quantity: Number(qty) || 0,
      price: Number(price) || 0,
    });

    setName("");
    setQty("");
    setPrice("");
    setLoading(false);

    await refreshItems();
    triggerRefresh();
  };

  const confirmDelete = async (id: string) => {
    await deleteItem(id);
    setDeleteItemData(null);
    await refreshItems();
    triggerRefresh();
  };

  const confirmSell = async (qtyToSell: number) => {
    const item = sellItemData;
    if (!item) return;

    const total = qtyToSell * item.price;

    // ✅ Save sale
    await supabase.from("sales").insert({
      item_id: String(item.id),
      item_name: item.name,
      quantity: qtyToSell,
      total_price: total,
    });

    // ✅ Update stock
    await supabase
      .from("pharmacy_items")
      .update({
        quantity: item.quantity - qtyToSell,
      })
      .eq("id", item.id);

    // 🔥 FIXED: use object style (your logger format)
    await logActivity({
      action: "sell",
      description: `Sold ${qtyToSell} x ${item.name} for $${total}`,
      user_email: session?.user?.email || "Unknown",
    });

    // ✅ Receipt (unchanged)
    setReceipt({
      name: item.name,
      quantity: qtyToSell,
      price: item.price,
    });

    setSellItemData(null);

    await refreshItems();
    triggerRefresh();
  };

  const handleEditSave = async (updatedItem: any) => {
    const { error } = await supabase
      .from("pharmacy_items")
      .update({
        name: updatedItem.name,
        quantity: updatedItem.quantity,
        price: updatedItem.price,
      })
      .eq("id", updatedItem.id);

    if (error) {
      console.error("EDIT ERROR:", error);
      alert("Update failed");
      return;
    }

    setEditItemData(null);
    await refreshItems();
    triggerRefresh();
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
    <ProtectedRoute allowed={["pharmacy", "admin"]}>
      <div className={`flex min-h-screen ${isNeon ? "bg-black text-white" : "bg-gray-100 text-black"}`}>

        <PharmacySidebar
          onNavigate={setPage}
          signOut={signOut}
          open={sidebarOpen}
          setOpen={setSidebarOpen}
        />

        <div className="flex-1 max-w-7xl mx-auto p-4 md:p-6 space-y-6">

          <PharmacyHeader signOut={signOut} totalValue={totalValue} />

          <StatsCards
            items={items}
            lowStock={lowStock}
            totalValue={totalValue}
            isNeon={isNeon}
          />

          {page === "dashboard" && <DashboardView />}

          {page === "inventory" && (
            <InventoryView
              search={search}
              setSearch={setSearch}
              name={name}
              setName={setName}
              qty={qty}
              setQty={setQty}
              price={price}
              setPrice={setPrice}
              handleSave={handleSave}
              loading={loading}
              filteredItems={filteredItems}
              setEditItemData={setEditItemData}
              setDeleteItemData={setDeleteItemData}
              setSellItemData={setSellItemData}
            />
          )}

          {page === "sales" && <SalesView />}

        </div>

        <ReceiptModal sale={receipt} onClose={() => setReceipt(null)} />

        <SellModal
          item={sellItemData}
          onClose={() => setSellItemData(null)}
          onConfirm={confirmSell}
        />

        <EditModal
          item={editItemData}
          onClose={() => setEditItemData(null)}
          onSave={handleEditSave}
        />

        <DeleteModal
          item={deleteItemData}
          onClose={() => setDeleteItemData(null)}
          onConfirm={confirmDelete}
        />
      </div>
    </ProtectedRoute>
  );
}