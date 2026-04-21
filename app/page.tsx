"use client";

import { useState } from "react";
import Link from "next/link";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import { usePatients } from "./context/PatientContext";
import { useSettings } from "./context/SettingsContext";
import { useAuth } from "./context/AuthContext";
import { usePermissions } from "./hooks/usePermissions";

export default function DashboardPage() {
  const { patients, loading } = usePatients();
  const { settings } = useSettings();
  const { session } = useAuth();
  const { can } = usePermissions();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [neonMode, setNeonMode] = useState(settings.theme === "neon");

  if (!session) return null;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-cyan-400">
        Loading dashboard...
      </div>
    );
  }

  const totalPatients = patients.length;

  const totalCollected = patients.reduce(
    (sum, p) => sum + (p.amount_paid || 0),
    0
  );

  const totalOutstanding = patients.reduce(
    (sum, p) =>
      sum + (p.balance_remaining || p.total - (p.amount_paid || 0)),
    0
  );

  const totalRevenue = patients.reduce((sum, p) => sum + p.total, 0);

  return (
    <div
      className={`flex min-h-screen ${
        neonMode
          ? "bg-linear-to-br from-black via-gray-950 to-purple-950/40"
          : "bg-white"
      }`}
    >
      <Sidebar
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        neonMode={neonMode}
      />

      <main className="flex-1 p-6">

        <Header
          patientsCount={totalPatients}
          neonMode={neonMode}
          setNeonMode={setNeonMode}
          setMobileMenuOpen={setMobileMenuOpen}
        />

        {/* STATS */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">

          {[
            ["Patients", totalPatients],
            ["Collected", `$${totalCollected}`],
            ["Outstanding", `$${totalOutstanding}`],
            ["Revenue", `$${totalRevenue}`],
          ].map(([label, value], i) => (
            <div
              key={i}
              className="bg-black/60 border border-cyan-500/30 rounded-2xl p-6"
            >
              <div className="text-3xl text-cyan-300 font-bold">
                {value}
              </div>
              <div className="text-gray-400 text-sm">{label}</div>
            </div>
          ))}

        </div>

        {/* ACTIONS (PERMISSION SYSTEM) */}
        <div className="flex flex-wrap gap-4">

          {can("add_patient") && (
            <Link href="/add-patient">
              <button className="bg-linear-to-r from-cyan-600 to-purple-600 text-white px-5 py-3 rounded-xl">
                + Add Patient
              </button>
            </Link>
          )}

          {can("view_queue") && (
            <Link href="/queue">
              <button className="bg-linear-to-r from-yellow-600 to-orange-500 text-white px-5 py-3 rounded-xl">
                Queue
              </button>
            </Link>
          )}

          {can("view_patients") && (
            <Link href="/patients">
              <button className="bg-linear-to-r from-blue-600 to-cyan-600 text-white px-5 py-3 rounded-xl">
                All Patients
              </button>
            </Link>
          )}

          {can("view_pharmacy") && (
            <Link href="/pharmacy">
              <button className="bg-linear-to-r from-green-600 to-cyan-600 text-white px-5 py-3 rounded-xl">
                Pharmacy
              </button>
            </Link>
          )}

          {can("view_settings") && (
            <Link href="/settings">
              <button className="bg-linear-to-r from-gray-600 to-gray-800 text-white px-5 py-3 rounded-xl">
                Settings
              </button>
            </Link>
          )}

        </div>

      </main>
    </div>
  );
}