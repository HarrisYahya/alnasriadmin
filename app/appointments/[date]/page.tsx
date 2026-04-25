//app/appointments/[date]/page.tsx
"use client";

import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { useAppointments } from "../../context/AppointmentContext";
import { usePatients } from "../../context/PatientContext";
import { useSettings } from "../../context/SettingsContext";
import ProtectedRoute from "../../components/ProtectedRoute";

export default function AppointmentDayPage() {
  const { date } = useParams();

  const { addAppointment, getByDate } = useAppointments();
  const { patients } = usePatients();
  const { settings } = useSettings();

  const [neonMode] = useState(settings.theme === "neon");

  const safeDate = Array.isArray(date) ? date[0] : date || "";

  const appointments = getByDate(safeDate);

  const [form, setForm] = useState({
    patientId: "",
    time: "",
    notes: "",
  });

  const selectedPatient = useMemo(
    () => patients.find((p) => p.id === form.patientId),
    [form.patientId, patients]
  );

  const handleAdd = () => {
    // Guard against missing data
    if (!form.patientId || !form.time || !selectedPatient) return;
    // Extra guard to satisfy TypeScript (patient.id might be optional in your Patient type)
    if (!selectedPatient.id) return;

    addAppointment({
      id: Date.now().toString(),
      patientId: selectedPatient.id,
      name: selectedPatient.name,
      phone: selectedPatient.phone,
      date: safeDate,
      time: form.time,
      notes: form.notes,
    });

    setForm({
      patientId: "",
      time: "",
      notes: "",
    });
  };

  const sortedAppointments = useMemo(() => {
    return [...appointments].sort((a, b) =>
      a.time.localeCompare(b.time)
    );
  }, [appointments]);

  return (
    <ProtectedRoute allowed={["admin", "staff"]}>
      <div
        className={`min-h-screen p-6 ${
          neonMode
            ? "bg-linear-to-br from-black via-gray-950 to-purple-950/40 text-white"
            : "bg-linear-to-br from-white via-amber-50/30 to-white text-gray-800"
        }`}
      >
      {/* HEADER */}
      <h1
        className={`text-2xl font-light mb-6 ${
          neonMode ? "text-cyan-300" : "text-gray-700"
        }`}
      >
        📅 Appointments for {safeDate}
      </h1>

      <div className="grid md:grid-cols-2 gap-6">
        {/* LEFT - LIST */}
        <div
          className={`p-4 rounded-2xl border ${
            neonMode
              ? "bg-black/40 border-cyan-500/30"
              : "bg-white border-amber-100"
          }`}
        >
          <h2
            className={`mb-4 font-semibold ${
              neonMode ? "text-cyan-300" : "text-amber-700"
            }`}
          >
            Today Appointments ({appointments.length})
          </h2>

          <div className="space-y-3">
            {sortedAppointments.length === 0 && (
              <p className="text-sm text-gray-400">
                No appointments yet
              </p>
            )}

            {sortedAppointments.map((a) => (
              <div
                key={a.id}
                className={`p-3 rounded-xl border ${
                  neonMode
                    ? "border-cyan-500/20 bg-cyan-950/20"
                    : "border-amber-100 bg-amber-50/40"
                }`}
              >
                <div className="font-semibold">{a.name}</div>
                <div className="text-sm">📞 {a.phone}</div>
                <div className="text-sm">⏰ {a.time}</div>
                {a.notes && (
                  <div className="text-xs mt-1 opacity-70">
                    {a.notes}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT - FORM */}
        <div
          className={`p-4 rounded-2xl border ${
            neonMode
              ? "bg-black/40 border-cyan-500/30"
              : "bg-white border-amber-100"
          }`}
        >
          <h2
            className={`mb-4 font-semibold ${
              neonMode ? "text-cyan-300" : "text-amber-700"
            }`}
          >
            ➕ Add Appointment
          </h2>

          {/* PATIENT SELECT */}
          <select
            value={form.patientId}
            onChange={(e) =>
              setForm({ ...form, patientId: e.target.value })
            }
            className={`w-full p-3 rounded-xl border mb-3 ${
              neonMode
                ? "bg-black/60 border-cyan-500/30 text-cyan-200"
                : "bg-white border-amber-200"
            }`}
          >
            <option value="">Select Patient</option>
            {patients.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} - {p.phone}
              </option>
            ))}
          </select>

          {/* TIME */}
          <input
            type="time"
            value={form.time}
            onChange={(e) =>
              setForm({ ...form, time: e.target.value })
            }
            className={`w-full p-3 rounded-xl border mb-3 ${
              neonMode
                ? "bg-black/60 border-cyan-500/30 text-cyan-200"
                : "bg-white border-amber-200"
            }`}
          />

          {/* NOTES */}
          <textarea
            placeholder="Notes (optional)"
            value={form.notes}
            onChange={(e) =>
              setForm({ ...form, notes: e.target.value })
            }
            className={`w-full p-3 rounded-xl border mb-3 ${
              neonMode
                ? "bg-black/60 border-cyan-500/30 text-cyan-200"
                : "bg-white border-amber-200"
            }`}
          />

          {/* BUTTON */}
          <button
            onClick={handleAdd}
            className={`w-full py-3 rounded-xl font-semibold transition ${
              neonMode
                ? "bg-linear-to-r from-cyan-600 to-purple-600 text-white shadow-[0_0_12px_#0ff]"
                : "bg-linear-to-r from-amber-500 to-amber-700 text-white"
            }`}
          >
            Save Appointment
          </button>
        </div>
      </div>
    </div>
    </ProtectedRoute>
  );
}