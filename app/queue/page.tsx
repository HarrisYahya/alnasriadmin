"use client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

import { useState } from "react";
import { useQueue } from "../context/QueueContext";
import { useSettings } from "../context/SettingsContext";
import { useAuth } from "../context/AuthContext";
import { usePermissions } from "../hooks/usePermissions";

export const servicesList = [
  { name: "Braces Upper", fee: 25, perTooth: false },
  { name: "Braces Lower", fee: 25, perTooth: false },
  { name: "Cleaning", fee: 30, perTooth: false },
  { name: "Whitening", fee: 130, perTooth: false },
  { name: "Filling", fee: 25, perTooth: true },
  { name: "Extraction", fee: 10, perTooth: true },
  { name: "Root Canal", fee: 35, perTooth: true },
  { name: "zirconium", fee: 120, perTooth: true },
  { name: "Emox zirconium", fee: 80, perTooth: true },
  { name: "crown", fee: 45, perTooth: true },
  { name: "Direct veneers", fee: 45, perTooth: true },
];

export default function QueuePage() {
  const { queue, addToQueue, updateStatus, removeFromQueue, toggleTalked } =
    useQueue();

  const { settings } = useSettings();
  const { signOut } = useAuth();
  const { can } = usePermissions();

  const [neonMode, setNeonMode] = useState(settings.theme === "neon");

  const [name, setName] = useState("");
  const [stage, setStage] = useState<"cusub" | "so labtay">("cusub");
  const [service, setService] = useState("");
  const [talked, setTalked] = useState<"lala hadlay" | "weli lala hadlin">(
    "weli lala hadlin"
  );

  const getSomaliQueueDay = () => {
    const now = new Date();
    const somali = new Date(
      now.toLocaleString("en-US", { timeZone: "Africa/Mogadishu" })
    );
    somali.setHours(somali.getHours() - 6);
    return somali.toISOString().split("T")[0];
  };

  const todayKey = getSomaliQueueDay();
  const todayQueue = queue.filter((q) => q.queue_day === todayKey);

  const handleAdd = async () => {
    if (!name || !service) return;
    if (!can("queue_add")) return;

    const nextTicket = todayQueue.length + 1;

    await addToQueue({
      name,
      stage,
      talked,
      service,
      status: "waiting",
      ticket_number: nextTicket,
      queue_day: todayKey,
    });

    setName("");
    setStage("cusub");
    setService("");
    setTalked("weli lala hadlin");
  };

  const inputStyle = `px-3 py-2 rounded-xl border ${
    neonMode
      ? "bg-black/60 text-white border-cyan-500/30 placeholder-gray-400"
      : "bg-white text-gray-900 border-amber-200 placeholder-gray-500"
  }`;

  return (
    <div
      className={`min-h-screen p-6 ${
        neonMode
          ? "bg-linear-to-br from-black via-gray-950 to-purple-950/40"
          : "bg-linear-to-br from-white via-amber-50/30 to-white"
      }`}
    >
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <h1
          className={`text-3xl font-light ${
            neonMode ? "text-cyan-300" : "text-gray-900"
          }`}
        >
          Queue{" "}
          <span className="font-semibold text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-purple-400">
            Management
          </span>
        </h1>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setNeonMode(!neonMode)}
            className={`relative inline-flex h-8 w-16 items-center rounded-full ${
              neonMode
                ? "bg-linear-to-r from-cyan-600 to-purple-600"
                : "bg-linear-to-r from-amber-500 to-amber-700"
            }`}
          >
            <span
              className={`inline-block h-6 w-6 transform rounded-full bg-white ${
                neonMode ? "translate-x-9" : "translate-x-1"
              }`}
            />
          </button>

          <button
            onClick={signOut}
            className={`px-4 py-2 rounded-xl text-sm font-semibold ${
              neonMode
                ? "bg-red-500/20 text-red-300 border border-red-500/30"
                : "bg-red-100 text-red-600 border border-red-300"
            }`}
          >
            Logout
          </button>
        </div>
      </div>

      {/* FORM */}
      {can("queue_add") && (
        <div
          className={`rounded-2xl p-5 mb-6 grid md:grid-cols-5 gap-3 ${
            neonMode
              ? "bg-black/60 border border-cyan-500/30"
              : "bg-white border border-amber-100"
          }`}
        >
          <input
            className={inputStyle}
            placeholder="Patient name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <select
            className={inputStyle}
            value={stage}
            onChange={(e) => setStage(e.target.value as any)}
          >
            <option value="cusub">Cusub</option>
            <option value="so labtay">So labtay</option>
          </select>

          <select
            className={inputStyle}
            value={talked}
            onChange={(e) => setTalked(e.target.value as any)}
          >
            <option value="weli lala hadlin">Weli lala hadlin</option>
            <option value="lala hadlay">Lala hadlay</option>
          </select>

          <select
            className={inputStyle}
            value={service}
            onChange={(e) => setService(e.target.value)}
          >
            <option value="">Service</option>
            {servicesList.map((s) => (
              <option key={s.name} value={s.name}>
                {s.name}
              </option>
            ))}
          </select>

          <button
            onClick={handleAdd}
            className="bg-linear-to-r from-cyan-500 to-purple-600 text-white rounded-xl px-4 py-2"
          >
            Add
          </button>
        </div>
      )}

      {/* TABLE */}
      <div className="overflow-x-auto rounded-2xl border border-cyan-500/20">
        <table
          className={`w-full text-left ${
            neonMode ? "text-white" : "text-gray-900"
          }`}
        >
          <thead>
            <tr
              className={
                neonMode
                  ? "bg-black/60 text-cyan-400"
                  : "bg-amber-100 text-gray-700"
              }
            >
              <th className="px-4 py-3">Ticket</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Stage</th>
              <th className="px-4 py-3">Talk</th>
              <th className="px-4 py-3">Service</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {todayQueue.map((q) => (
              <tr key={q.id}>
                <td className="px-4 py-3">{q.ticket_number}</td>
                <td className="px-4 py-3">{q.name}</td>
                <td className="px-4 py-3">{q.stage}</td>

                <td className="px-4 py-3">{q.talked}</td>
                <td className="px-4 py-3">{q.service}</td>
                <td className="px-4 py-3">{q.status}</td>

                <td className="px-4 py-3 flex gap-2">
                  {can("queue_talk") && (
                    <button
                      onClick={() => toggleTalked(q.id!, q.talked)}
                      className="px-2 py-1 bg-yellow-500 text-black rounded"
                    >
                      Talk
                    </button>
                  )}

                  {can("queue_done") && (
                    <button
                      onClick={() => updateStatus(q.id!, "done")}
                      className="px-2 py-1 bg-green-500 text-black rounded"
                    >
                      Done
                    </button>
                  )}

                  {can("queue_delete") && (
                    <button
                      onClick={() => removeFromQueue(q.id!)}
                      className="px-2 py-1 bg-red-500 text-black rounded"
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}