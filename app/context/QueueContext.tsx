 "use client";

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export type StageType = "cusub" | "so labtay";
export type TalkedType = "lala hadlay" | "weli lala hadlin";

export interface QueueItem {
  id?: string;
  name: string;
  stage: "cusub" | "so labtay";
  talked: "lala hadlay" | "weli lala hadlin";
  service: string;
  status: string;
  ticket_number: number;
  queue_day?: string;
}

interface QueueContextType {
  queue: QueueItem[];
  loading: boolean;
  addToQueue: (item: QueueItem) => Promise<void>;
  updateStatus: (id: string, status: QueueItem["status"]) => Promise<void>;
  toggleTalked: (id: string, talked: TalkedType) => Promise<void>;
  removeFromQueue: (id: string) => Promise<void>;
}

const QueueContext = createContext<QueueContextType | undefined>(undefined);

export const QueueProvider = ({ children }: { children: React.ReactNode }) => {
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchQueue = async () => {
    if (typeof window === "undefined") return;

    const { data } = await supabase
      .from("queue")
      .select("*")
      .order("ticket_number", { ascending: true });

    setQueue((data as QueueItem[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchQueue();
  }, []);

  const getNextTicketNumber = async () => {
    const { data } = await supabase
      .from("queue")
      .select("ticket_number")
      .order("ticket_number", { ascending: false })
      .limit(1);

    return data && data.length > 0 ? data[0].ticket_number + 1 : 1;
  };

  const addToQueue = async (item: QueueItem) => {
    const ticket = await getNextTicketNumber();

    await supabase.from("queue").insert({
      ...item,
      ticket_number: ticket,
    });

    fetchQueue();
  };

  const updateStatus = async (id: string, status: QueueItem["status"]) => {
    await supabase.from("queue").update({ status }).eq("id", id);
    fetchQueue();
  };

  const toggleTalked = async (id: string, talked: TalkedType) => {
    const newValue =
      talked === "weli lala hadlin"
        ? "lala hadlay"
        : "weli lala hadlin";

    await supabase.from("queue").update({ talked: newValue }).eq("id", id);
    fetchQueue();
  };

  const removeFromQueue = async (id: string) => {
    await supabase.from("queue").delete().eq("id", id);
    fetchQueue();
  };

  return (
    <QueueContext.Provider
      value={{
        queue,
        loading,
        addToQueue,
        updateStatus,
        toggleTalked,
        removeFromQueue,
      }}
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