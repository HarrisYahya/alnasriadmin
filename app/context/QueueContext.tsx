"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export type StageType = "cusub" | "so labtay";
export type TalkedType = "lala hadlay" | "weli lala hadlin";

export interface QueueItem {
  id?: string;
  name: string;
  stage: StageType;
  talked: TalkedType;
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

  // ✅ Fetch initial queue
  const fetchQueue = async () => {
    const { data, error } = await supabase
      .from("queue")
      .select("*")
      .order("ticket_number", { ascending: true });

    if (error) {
      console.error("Fetch error:", error);
      return;
    }

    setQueue((data as QueueItem[]) || []);
    setLoading(false);
  };

  // ✅ Realtime subscription
  useEffect(() => {
    fetchQueue();

    const channel = supabase
      .channel("queue-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "queue" },
        (payload) => {
          console.log("REALTIME:", payload);

          const newRow = payload.new as QueueItem;
          const oldRow = payload.old as QueueItem;

          setQueue((current) => {
            // INSERT
            if (payload.eventType === "INSERT") {
              // جلوگیری duplicate (important!)
              const exists = current.find(
                (i) => i.ticket_number === newRow.ticket_number
              );
              if (exists) return current;

              return [...current, newRow].sort(
                (a, b) => a.ticket_number - b.ticket_number
              );
            }

            // UPDATE
            if (payload.eventType === "UPDATE") {
              return current.map((item) =>
                item.id === newRow.id ? newRow : item
              );
            }

            // DELETE
            if (payload.eventType === "DELETE") {
              return current.filter((item) => item.id !== oldRow.id);
            }

            return current;
          });
        }
      )
      .subscribe((status) => {
        console.log("SUB STATUS:", status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // ✅ Ticket per day
  const getNextTicketNumber = async (day: string) => {
    const { data, error } = await supabase
      .from("queue")
      .select("ticket_number")
      .eq("queue_day", day)
      .order("ticket_number", { ascending: false })
      .limit(1);

    if (error) {
      console.error("Ticket error:", error);
      return 1;
    }

    return data && data.length > 0 ? data[0].ticket_number + 1 : 1;
  };

  // ✅ ADD (Optimistic UI + Realtime safe)
  const addToQueue = async (item: QueueItem) => {
    if (!item.queue_day) {
      console.error("queue_day is required");
      return;
    }

    const ticket = await getNextTicketNumber(item.queue_day);

    // 🔥 temporary item for instant UI
    const tempId = "temp-" + Date.now();

    const tempItem: QueueItem = {
      ...item,
      ticket_number: ticket,
      id: tempId,
    };

    // ✅ Instant UI update
    setQueue((prev) =>
      [...prev, tempItem].sort((a, b) => a.ticket_number - b.ticket_number)
    );

    // ✅ Insert to DB
    const { data, error } = await supabase
      .from("queue")
      .insert({
        ...item,
        ticket_number: ticket,
      })
      .select()
      .single();

    if (error) {
      console.error("Insert error:", error);

      // ❌ rollback UI if failed
      setQueue((prev) => prev.filter((i) => i.id !== tempId));
      return;
    }

    // ✅ Replace temp item with real DB item
    setQueue((prev) =>
      prev.map((i) => (i.id === tempId ? (data as QueueItem) : i))
    );
  };

  const updateStatus = async (id: string, status: QueueItem["status"]) => {
    // Optimistic update
    setQueue((prev) => prev.map((item) => item.id === id ? { ...item, status } : item));

    const { error } = await supabase
      .from("queue")
      .update({ status })
      .eq("id", id);

    if (error) {
      console.error("Update error:", error);
      // Rollback on error
      setQueue((prev) => prev.map((item) => item.id === id ? { ...item, status: item.status } : item));
    }
  };

  const toggleTalked = async (id: string, talked: TalkedType) => {
    const newValue =
      talked === "weli lala hadlin"
        ? "lala hadlay"
        : "weli lala hadlin";

    // Optimistic update
    setQueue((prev) => prev.map((item) => item.id === id ? { ...item, talked: newValue } : item));

    const { error } = await supabase
      .from("queue")
      .update({ talked: newValue })
      .eq("id", id);

    if (error) {
      console.error("Toggle error:", error);
      // Rollback
      setQueue((prev) => prev.map((item) => item.id === id ? { ...item, talked } : item));
    }
  };

  const removeFromQueue = async (id: string) => {
    // Optimistic update: remove immediately
    const itemToRemove = queue.find((item) => item.id === id);
    setQueue((prev) => prev.filter((item) => item.id !== id));

    const { error } = await supabase
      .from("queue")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Delete error:", error);
      // Rollback: add back
      if (itemToRemove) {
        setQueue((prev) => [...prev, itemToRemove].sort((a, b) => a.ticket_number - b.ticket_number));
      }
    }
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