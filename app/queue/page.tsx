"use client";

import { useState } from "react";
import { useQueue } from "../context/QueueContext";
import { usePatients } from "../context/PatientContext";
import { useSettings } from "../context/SettingsContext";
import { useAuth } from "../context/AuthContext";

export default function QueuePage() {
  const { queue, updateStatus, removeFromQueue } = useQueue();
  const { patients } = usePatients();
  const { settings } = useSettings();
  const { session } = useAuth();

  const [neonMode, setNeonMode] = useState(settings.theme === "neon");

  const getPatientName = (id: string) =>
    patients.find((p) => p.id === id)?.name || "Unknown";

  return (
    <div
      className={`min-h-screen p-6 ${
        neonMode
          ? "bg-linear-to-br from-black via-gray-950 to-purple-950/40"
          : "bg-linear-to-br from-white via-amber-50/30 to-white"
      }`}
    >
      {/* HEADER STYLE SAME AS DASHBOARD */}
      <div className="flex justify-between items-center mb-8">
        <h1
          className={`text-3xl font-light ${
            neonMode ? "text-cyan-300" : "text-gray-800"
          }`}
        >
          Queue{" "}
          <span
            className={
              neonMode
                ? "font-semibold text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-purple-400"
                : "font-semibold text-amber-600"
            }
          >
            Management
          </span>
        </h1>

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
      </div>

      {/* QUEUE CARDS */}
      <div className="grid gap-4">
        {queue.map((q) => (
          <div
            key={q.id}
            className={`rounded-2xl p-5 flex justify-between items-center ${
              neonMode
                ? "bg-black/60 backdrop-blur-md border border-cyan-500/30"
                : "bg-white border border-amber-100 shadow-sm"
            }`}
          >
            <div>
              <p
                className={`text-lg font-medium ${
                  neonMode ? "text-cyan-100" : "text-gray-800"
                }`}
              >
                {getPatientName(q.patient_id)}
              </p>

              <p
                className={`text-sm ${
                  neonMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Status: {q.status}
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => updateStatus(q.id!, "in_progress")}
                className="px-4 py-2 rounded-xl bg-blue-500 text-white"
              >
                Start
              </button>

              <button
                onClick={() => updateStatus(q.id!, "done")}
                className="px-4 py-2 rounded-xl bg-green-500 text-white"
              >
                Done
              </button>

              <button
                onClick={() => removeFromQueue(q.id!)}
                className="px-4 py-2 rounded-xl bg-red-500 text-white"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}