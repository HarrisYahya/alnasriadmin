"use client";

import { useState } from "react";
import Link from "next/link";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import { usePatients } from "./context/PatientContext";
import { useSettings } from "./context/SettingsContext";
import { useAuth } from "./context/AuthContext";

export default function DashboardPage() {
  const { patients, loading: patientsLoading } = usePatients();
  const { settings } = useSettings();
  const { session, loading: authLoading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [neonMode, setNeonMode] = useState(settings.theme === "neon");

  // Wait for authentication to be resolved
  if (authLoading) {
    return (
      <div className={`flex flex-col md:flex-row min-h-screen ${neonMode ? "bg-linear-to-br from-black via-gray-950 to-purple-950/40" : "bg-linear-to-br from-white via-amber-50/30 to-white"}`}>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className={`animate-spin rounded-full h-12 w-12 border-b-2 mx-auto ${neonMode ? "border-cyan-400" : "border-amber-500"}`}></div>
            <p className={`mt-4 ${neonMode ? "text-gray-400" : "text-gray-500"}`}>Authenticating...</p>
          </div>
        </div>
      </div>
    );
  }

  // If no session (should be redirected by middleware, but just in case)
  if (!session) {
    return null;
  }

  // Calculate stats
  const totalPatients = patients.length;
  const totalCollected = patients.reduce((sum, p) => sum + (p.amount_paid || 0), 0);
  const totalOutstanding = patients.reduce((sum, p) => sum + (p.balance_remaining || p.total - (p.amount_paid || 0)), 0);
  const totalRevenue = patients.reduce((sum, p) => sum + p.total, 0);
  
  const recentPatients = [...patients].slice(0, 5);

  const today = new Date();
  const nextWeek = new Date();
  nextWeek.setDate(today.getDate() + 7);
  const upcomingAppointments = patients.filter(p => {
    if (!p.datetime) return false;
    const aptDate = new Date(p.datetime);
    return aptDate >= today && aptDate <= nextWeek;
  }).slice(0, 5);

  const statCardClass = neonMode
    ? "bg-black/60 backdrop-blur-md border border-cyan-500/30 rounded-2xl p-6"
    : "bg-white/90 backdrop-blur-sm border border-amber-100 rounded-2xl p-6 shadow-sm";

  const statValueClass = neonMode ? "text-3xl font-bold text-cyan-300" : "text-3xl font-bold text-amber-700";
  const statLabelClass = neonMode ? "text-gray-400 text-sm" : "text-gray-500 text-sm";

  if (patientsLoading) {
    return (
      <div className={`flex flex-col md:flex-row min-h-screen ${neonMode ? "bg-linear-to-br from-black via-gray-950 to-purple-950/40" : "bg-linear-to-br from-white via-amber-50/30 to-white"}`}>
        <Sidebar mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} neonMode={neonMode} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className={`animate-spin rounded-full h-12 w-12 border-b-2 mx-auto ${neonMode ? "border-cyan-400" : "border-amber-500"}`}></div>
            <p className={`mt-4 ${neonMode ? "text-gray-400" : "text-gray-500"}`}>Loading dashboard data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col md:flex-row min-h-screen ${neonMode ? "bg-linear-to-br from-black via-gray-950 to-purple-950/40" : "bg-linear-to-br from-white via-amber-50/30 to-white"}`}>
      <Sidebar mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} neonMode={neonMode} />
      {mobileMenuOpen && (
        <div className={`fixed inset-0 z-30 md:hidden ${neonMode ? "bg-black/60 backdrop-blur-sm" : "bg-white/80 backdrop-blur-sm"}`} onClick={() => setMobileMenuOpen(false)} />
      )}
      <main className="flex-1 p-4 md:p-8 lg:p-10 overflow-x-auto">
         <Header
          patientsCount={totalPatients}
          neonMode={neonMode}
          setNeonMode={setNeonMode}
          setMobileMenuOpen={setMobileMenuOpen}
        />

        <div className={`rounded-2xl p-6 mb-8 ${neonMode ? "bg-cyan-950/30 border border-cyan-500/30" : "bg-amber-50/50 border border-amber-100"}`}>
          <h1 className={`text-2xl md:text-3xl font-light ${neonMode ? "text-cyan-300" : "text-gray-800"}`}>
            Welcome back, Dr. Alnasri 👋
          </h1>
          <p className={`mt-2 ${neonMode ? "text-gray-400" : "text-gray-500"}`}>
            Here's what's happening with your practice today.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className={statCardClass}>
            <div className={statValueClass}>{totalPatients}</div>
            <div className={statLabelClass}>Total Patients</div>
          </div>
          <div className={statCardClass}>
            <div className={statValueClass}>${totalCollected.toLocaleString()}</div>
            <div className={statLabelClass}>Collected Revenue</div>
          </div>
          <div className={statCardClass}>
            <div className={statValueClass}>${totalOutstanding.toLocaleString()}</div>
            <div className={statLabelClass}>Outstanding Balance</div>
          </div>
          <div className={statCardClass}>
            <div className={statValueClass}>${totalRevenue.toLocaleString()}</div>
            <div className={statLabelClass}>Total Billings</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className={`rounded-2xl overflow-hidden ${neonMode ? "bg-black/60 backdrop-blur-md border border-cyan-500/30" : "bg-white/90 backdrop-blur-sm border border-amber-100 shadow-sm"}`}>
            <div className={`px-6 py-4 border-b ${neonMode ? "border-cyan-500/30 bg-cyan-950/20" : "border-amber-100 bg-amber-50/30"}`}>
              <h3 className={`font-semibold text-lg ${neonMode ? "text-cyan-300" : "text-gray-800"}`}>📋 Recent Patients</h3>
            </div>
            <div className="divide-y divide-gray-700/30">
              {recentPatients.length === 0 ? (
                <div className={`p-6 text-center ${neonMode ? "text-gray-400" : "text-gray-500"}`}>No patients yet.</div>
              ) : (
                recentPatients.map((p) => (
                  <div key={p.id} className="px-6 py-3 flex justify-between items-center">
                    <div>
                      <p className={`font-medium ${neonMode ? "text-cyan-100" : "text-gray-800"}`}>{p.name}</p>
                      <p className={`text-xs ${neonMode ? "text-gray-400" : "text-gray-500"}`}>{p.services.slice(0, 2).join(", ")}</p>
                    </div>
                    <div className="text-right">
                      <p className={`font-mono ${neonMode ? "text-green-400" : "text-green-600"}`}>${p.amount_paid || 0} paid</p>
                      <p className={`text-xs ${neonMode ? "text-gray-400" : "text-gray-500"}`}>Due: ${p.balance_remaining}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="px-6 py-3 border-t border-gray-700/30">
              <Link href="/patients" className={`text-sm ${neonMode ? "text-cyan-400 hover:text-cyan-300" : "text-amber-600 hover:text-amber-500"}`}>
                View all patients →
              </Link>
            </div>
          </div>

          <div className={`rounded-2xl overflow-hidden ${neonMode ? "bg-black/60 backdrop-blur-md border border-cyan-500/30" : "bg-white/90 backdrop-blur-sm border border-amber-100 shadow-sm"}`}>
            <div className={`px-6 py-4 border-b ${neonMode ? "border-cyan-500/30 bg-cyan-950/20" : "border-amber-100 bg-amber-50/30"}`}>
              <h3 className={`font-semibold text-lg ${neonMode ? "text-cyan-300" : "text-gray-800"}`}>📅 Upcoming Appointments</h3>
            </div>
            <div className="divide-y divide-gray-700/30">
              {upcomingAppointments.length === 0 ? (
                <div className={`p-6 text-center ${neonMode ? "text-gray-400" : "text-gray-500"}`}>No appointments in the next 7 days.</div>
              ) : (
                upcomingAppointments.map((p) => (
                  <div key={p.id} className="px-6 py-3 flex justify-between items-center">
                    <div>
                      <p className={`font-medium ${neonMode ? "text-cyan-100" : "text-gray-800"}`}>{p.name}</p>
                      <p className={`text-xs ${neonMode ? "text-gray-400" : "text-gray-500"}`}>{p.location || "No location"}</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm ${neonMode ? "text-cyan-400" : "text-amber-600"}`}>
                        {p.datetime ? new Date(p.datetime).toLocaleDateString() : "Date TBD"}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="px-6 py-3 border-t border-gray-700/30">
              <Link href="/add-patient" className={`text-sm ${neonMode ? "text-cyan-400 hover:text-cyan-300" : "text-amber-600 hover:text-amber-500"}`}>
                + Add new appointment →
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <Link href="/add-patient">
            <button className={`px-8 py-3 rounded-xl font-semibold transition transform hover:scale-105 ${
              neonMode
                ? "bg-linear-to-r from-cyan-600 to-purple-600 text-white shadow-[0_0_12px_#0ff] hover:shadow-[0_0_20px_#0ff]"
                : "bg-linear-to-r from-amber-500 to-amber-700 text-white shadow-md hover:shadow-lg"
            }`}>
              + Register New Patient
            </button>
          </Link>
        </div>
      </main>
    </div>
  );
}