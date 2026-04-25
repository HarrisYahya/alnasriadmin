"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { useSettings } from "../context/SettingsContext";
import { useAuth } from "../context/AuthContext";
import { usePermissions } from "../hooks/usePermissions";
import ProtectedRoute from "../components/ProtectedRoute";
import QueueSidebar from "../components/QueueSidebar";
import Header from "../components/Header";
import { supabase } from "../lib/supabaseClient";

interface QueueItem {
  id: string;
  name: string;
  stage: "cusub" | "so labtay";
  talked: "lala hadlay" | "weli lala hadlin";
  service: string;
  status: "waiting" | "done";
  ticket_number: number;
  queue_day: string;
  created_at: string;
}

export default function AllQueuePage() {
  const { settings } = useSettings();
  const { user } = useAuth();
  const { can } = usePermissions();

  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [neonMode, setNeonMode] = useState(settings.theme === "neon");

  useEffect(() => {
    fetchAllQueue();
  }, []);

  const fetchAllQueue = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("queue")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching all queue:", error.message);
    } else {
      setQueue(data || []);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <ProtectedRoute allowed={["admin"]}>
        <div className="min-h-screen flex items-center justify-center">
          Loading...
        </div>
      </ProtectedRoute>
    );
  }

  const inputStyle = `px-3 py-2 rounded-xl border ${
    neonMode
      ? "bg-black/60 text-white border-cyan-500/30 placeholder-gray-400"
      : "bg-white text-gray-900 border-amber-200 placeholder-gray-500"
  }`;

  return (
    <ProtectedRoute allowed={["admin"]}>
      <div
        className={`flex flex-col md:flex-row min-h-screen ${
          neonMode
            ? "bg-linear-to-br from-black via-gray-950 to-purple-950/40"
            : "bg-linear-to-br from-white via-amber-50/30 to-white"
        }`}
      >
        <QueueSidebar
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
          neonMode={neonMode}
        />

        <main className="flex-1 p-4 md:p-8 lg:p-10 overflow-x-auto">
          <Header
            patientsCount={0}
            neonMode={neonMode}
            setNeonMode={setNeonMode}
          />

          <div className="mt-8">
            <h1
              className={`text-3xl font-light mb-8 ${
                neonMode ? "text-cyan-300" : "text-gray-900"
              }`}
            >
              All Queue Entries
            </h1>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-4 py-2 border border-gray-300">#</th>
                    <th className="px-4 py-2 border border-gray-300">Name</th>
                    <th className="px-4 py-2 border border-gray-300">Stage</th>
                    <th className="px-4 py-2 border border-gray-300">Talked</th>
                    <th className="px-4 py-2 border border-gray-300">Service</th>
                    <th className="px-4 py-2 border border-gray-300">Status</th>
                    <th className="px-4 py-2 border border-gray-300">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {queue.map((q, index) => (
                    <tr key={q.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2 border border-gray-300">
                        {q.ticket_number}
                      </td>
                      <td className="px-4 py-2 border border-gray-300">
                        {q.name}
                      </td>
                      <td className="px-4 py-2 border border-gray-300">
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            q.stage === "cusub"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-purple-100 text-purple-800"
                          }`}
                        >
                          {q.stage}
                        </span>
                      </td>
                      <td className="px-4 py-2 border border-gray-300">
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            q.talked === "lala hadlay"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {q.talked}
                        </span>
                      </td>
                      <td className="px-4 py-2 border border-gray-300">
                        {q.service}
                      </td>
                      <td className="px-4 py-2 border border-gray-300">
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            q.status === "done"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {q.status}
                        </span>
                      </td>
                      <td className="px-4 py-2 border border-gray-300">
                        {new Date(q.queue_day).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}