 "use client";

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export interface QueueItem {
  id?: string;
  patient_id: string;
  staff_id: string;
  status: "waiting" | "in_progress" | "done";
  created_at?: string;
}

interface QueueContextType {
  queue: QueueItem[];
  loading: boolean;
  addToQueue: (item: QueueItem) => Promise<void>;
  updateStatus: (id: string, status: QueueItem["status"]) => Promise<void>;
  removeFromQueue: (id: string) => Promise<void>;
}

const QueueContext = createContext<QueueContextType | undefined>(undefined);

export const QueueProvider = ({ children }: { children: React.ReactNode }) => {
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchQueue = async () => {
    const { data } = await supabase
      .from("queue")
      .select("*")
      .order("created_at", { ascending: true });

    setQueue(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchQueue();
  }, []);

  const addToQueue = async (item: QueueItem) => {
    await supabase.from("queue").insert(item);
    fetchQueue();
  };

  const updateStatus = async (id: string, status: QueueItem["status"]) => {
    await supabase.from("queue").update({ status }).eq("id", id);
    fetchQueue();
  };

  const removeFromQueue = async (id: string) => {
    await supabase.from("queue").delete().eq("id", id);
    fetchQueue();
  };

  return (
    <QueueContext.Provider
      value={{ queue, loading, addToQueue, updateStatus, removeFromQueue }}
    >
      {children}
    </QueueContext.Provider>
  );
};

export const useQueue = () => {
  const context = useContext(QueueContext);
  if (!context) throw new Error("useQueue must be used within QueueProvider");
  return context;
};