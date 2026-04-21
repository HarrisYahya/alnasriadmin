"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabaseClient";

export default function ActivityPanel() {
  const [logs, setLogs] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("all");

  // NEW: control mode (default = false → show only 100)
  const [showAll, setShowAll] = useState(false);

  const fetchLogs = async () => {
    let query = supabase
      .from("activity_logs")
      .select("*")
      .order("created_at", { ascending: false });

    // default: only 100 recent logs
    if (!showAll) {
      query = query.limit(100);
    }

    if (actionFilter !== "all") {
      query = query.eq("action", actionFilter);
    }

    const { data } = await query;

    if (data) setLogs(data);
  };

  // 🔄 reload when filter or mode changes
  useEffect(() => {
    fetchLogs();
  }, [actionFilter, showAll]);

  // ⚡ REALTIME SUBSCRIPTION
  useEffect(() => {
    const channel = supabase
      .channel("activity_logs_channel")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "activity_logs",
        },
        (payload) => {
          setLogs((prev) => {
            const updated = [payload.new, ...prev];

            // if NOT showAll, keep only 100
            if (!showAll) {
              return updated.slice(0, 100);
            }

            return updated;
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [showAll]);

  // 🎨 color by action
  const getColor = (action: string) => {
    switch (action) {
      case "delete":
        return "text-red-400";
      case "sell":
        return "text-green-400";
      case "add":
        return "text-cyan-400";
      case "edit":
      case "update":
        return "text-yellow-300";
      default:
        return "text-white";
    }
  };

  // 🔍 search filter
  const filteredLogs = logs.filter((log) =>
    log?.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-black/40 p-5 rounded-2xl border border-cyan-500/20 mt-6">
      <h3 className="text-cyan-300 mb-4 text-lg">Activity Logs</h3>

      {/* FILTERS */}
      <div className="flex flex-wrap gap-3 mb-4">
        <input
          placeholder="Search..."
          className="p-2 rounded bg-black/60 border border-cyan-500/30 text-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="p-2 rounded bg-black/60 border border-cyan-500/30 text-sm"
          value={actionFilter}
          onChange={(e) => setActionFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="add">Add</option>
          <option value="update">Update</option>
          <option value="edit">Edit</option>
          <option value="delete">Delete</option>
          <option value="sell">Sell</option>
        </select>
      </div>

      {/* LOG LIST */}
      <div className="space-y-3 text-sm max-h-[300px] overflow-y-auto pr-2">
        {filteredLogs.map((log) => (
          <div
            key={log.id}
            className="p-3 rounded-xl border border-white/10 bg-black/30"
          >
            <p className={getColor(log.action)}>{log.description}</p>

            <p className="text-xs text-gray-400 mt-1">
              {log.user_email || "Unknown"} •{" "}
              {new Date(log.created_at).toLocaleString()}
            </p>
          </div>
        ))}

        {filteredLogs.length === 0 && (
          <p className="text-gray-500 text-sm">No activity found</p>
        )}
      </div>

      {/* LOAD MORE / SHOW ALL */}
      <div className="mt-4 text-center">
        {!showAll ? (
          <button
            onClick={() => setShowAll(true)}
            className="bg-cyan-600 px-4 py-2 rounded-xl text-sm"
          >
            Load More (Show All)
          </button>
        ) : (
          <p className="text-xs text-gray-400">
            Showing all activity logs
          </p>
        )}
      </div>
    </div>
  );
}