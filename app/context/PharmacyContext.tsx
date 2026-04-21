"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

interface PharmacyItem {
  id?: string;
  name: string;
  quantity: number;
  price: number;
}

interface PharmacyContextType {
  items: PharmacyItem[];
  addItem: (item: PharmacyItem) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  refreshItems: () => Promise<void>;
  refreshKey: number;
  triggerRefresh: () => void;
}

const PharmacyContext = createContext<PharmacyContextType>(
  {} as PharmacyContextType
);

export const PharmacyProvider = ({ children }: any) => {
  const [items, setItems] = useState<PharmacyItem[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  const triggerRefresh = () => setRefreshKey((p) => p + 1);

  const refreshItems = async () => {
    const { data } = await supabase
      .from("pharmacy_items")
      .select("*")
      .order("name");

    setItems(data || []);
  };

  useEffect(() => {
    refreshItems();
  }, [refreshKey]);

  const addItem = async (item: PharmacyItem) => {
    await supabase.from("pharmacy_items").insert(item);
    triggerRefresh();
  };

  const deleteItem = async (id: string) => {
    await supabase.from("pharmacy_items").delete().eq("id", id);
    triggerRefresh();
  };

  return (
    <PharmacyContext.Provider
      value={{
        items,
        addItem,
        deleteItem,
        refreshItems,
        refreshKey,
        triggerRefresh,
      }}
    >
      {children}
    </PharmacyContext.Provider>
  );
};

export const usePharmacy = () => useContext(PharmacyContext);