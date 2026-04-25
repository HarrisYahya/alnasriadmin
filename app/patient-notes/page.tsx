"use client";

import { useState } from "react";
import { usePatients } from "../context/PatientContext";
import { useSettings } from "../context/SettingsContext";
import ProtectedRoute from "../components/ProtectedRoute";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

export default function PatientNotesPage() {
  const { patients, loading } = usePatients();
  const { settings } = useSettings();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [neonMode, setNeonMode] = useState(settings.theme === "neon");

  if (loading) {
    return (
      <ProtectedRoute allowed={["admin"]}>
        <div className="min-h-screen flex items-center justify-center">
          Loading...
        </div>
      </ProtectedRoute>
    );
  }

  const cardClass = neonMode
    ? "bg-black/70 backdrop-blur-xl text-cyan-100 border border-cyan-500/40 rounded-2xl shadow-[0_0_25px_rgba(0,255,255,0.2)]"
    : "bg-white/95 backdrop-blur-md text-gray-800 border border-amber-200/50 rounded-2xl shadow-2xl";

  const tableClass = neonMode
    ? "w-full text-left border-collapse border border-cyan-500/30"
    : "w-full text-left border-collapse border border-gray-300";

  const thClass = neonMode
    ? "px-4 py-2 bg-cyan-950/50 text-cyan-300 border border-cyan-500/30"
    : "px-4 py-2 bg-gray-100 text-gray-700 border border-gray-300";

  const tdClass = neonMode
    ? "px-4 py-2 border border-cyan-500/30 text-cyan-100"
    : "px-4 py-2 border border-gray-300 text-gray-800";

  return (
    <ProtectedRoute allowed={["admin"]}>
      <div
        className={`flex flex-col md:flex-row min-h-screen ${
          neonMode
            ? "bg-linear-to-br from-black via-gray-950 to-purple-950/40"
            : "bg-linear-to-br from-white via-amber-50/30 to-white"
        }`}
      >
        <Sidebar
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
          neonMode={neonMode}
        />

        <main className="flex-1 p-4 md:p-8 lg:p-10 overflow-x-auto">
          <Header
            patientsCount={patients.length}
            neonMode={neonMode}
            setNeonMode={setNeonMode}
          />

          <div className="mt-8">
            <h1 className={`text-2xl font-bold mb-6 ${neonMode ? "text-cyan-300" : "text-gray-800"}`}>
              Patient Notes
            </h1>

            <div className={`p-6 ${cardClass}`}>
              <table className={tableClass}>
                <thead>
                  <tr>
                    <th className={thClass}>Name</th>
                    <th className={thClass}>Phone</th>
                    <th className={thClass}>Services</th>
                    <th className={thClass}>Location</th>
                    <th className={thClass}>Total</th>
                    <th className={thClass}>Paid</th>
                    <th className={thClass}>Balance</th>
                    <th className={thClass}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.map((patient) => (
                    <tr key={patient.id}>
                      <td className={tdClass}>{patient.name}</td>
                      <td className={tdClass}>{patient.phone}</td>
                      <td className={tdClass}>{patient.services.join(", ")}</td>
                      <td className={tdClass}>{patient.location}</td>
                      <td className={tdClass}>${patient.total}</td>
                      <td className={tdClass}>${patient.amount_paid || 0}</td>
                      <td className={tdClass}>${patient.balance_remaining || 0}</td>
                      <td className={tdClass}>{new Date(patient.datetime).toLocaleDateString()}</td>
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