//app/patients/page.tsx
"use client";

import { useState, useMemo } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import PatientsTable from "../components/PatientsTable";
import ViewPatientModal from "../components/ViewPatientModal";
import EditPatientModal from "../components/EditPatientModal";
import { usePatients, Patient } from "../context/PatientContext";
import { useSettings } from "../context/SettingsContext";
import ProtectedRoute from "../components/ProtectedRoute";

export default function PatientsPage() {
  const { patients, deletePatient, loading } = usePatients();
  const { settings } = useSettings();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [neonMode, setNeonMode] = useState(settings.theme === "neon");
  const [viewingPatient, setViewingPatient] = useState<Patient | null>(null);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [showOnlyWithBalance, setShowOnlyWithBalance] = useState(false);

  // Get all unique services from all patients for filter dropdown
  const allServices = useMemo(() => {
    const servicesSet = new Set<string>();
    patients.forEach((p) => p.services.forEach((s) => servicesSet.add(s)));
    return Array.from(servicesSet).sort();
  }, [patients]);

  const filteredPatients = useMemo(() => {
    let filtered = [...patients];

    // Search by name or phone
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          p.phone.toLowerCase().includes(term)
      );
    }

    // Filter by service
    if (selectedService) {
      filtered = filtered.filter((p) => p.services.includes(selectedService));
    }

    // Filter by date range
    if (dateFrom) {
      const fromDate = new Date(dateFrom);
      filtered = filtered.filter((p) => p.datetime && new Date(p.datetime) >= fromDate);
    }
    if (dateTo) {
      const toDate = new Date(dateTo);
      toDate.setHours(23, 59, 59);
      filtered = filtered.filter((p) => p.datetime && new Date(p.datetime) <= toDate);
    }

    // Filter by outstanding balance > 0
    if (showOnlyWithBalance) {
      filtered = filtered.filter((p) => (p.balance_remaining ?? p.total - (p.amount_paid || 0)) > 0);
    }

    return filtered;
  }, [patients, searchTerm, selectedService, dateFrom, dateTo, showOnlyWithBalance]);

  const handleDelete = async (patient: Patient) => {
    if (confirm(`Delete ${patient.name}? This action cannot be undone.`)) {
      await deletePatient(patient.id!);
    }
  };

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedService("");
    setDateFrom("");
    setDateTo("");
    setShowOnlyWithBalance(false);
  };

  if (loading) {
    return (
      <div className={`flex flex-col md:flex-row min-h-screen ${neonMode ? "bg-linear-to-br from-black via-gray-950 to-purple-950/40" : "bg-linear-to-br from-white via-amber-50/30 to-white"}`}>
        <Sidebar mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} neonMode={neonMode} />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute allowed={["admin", "staff"]}>
      <div className={`flex flex-col md:flex-row min-h-screen ${neonMode ? "bg-linear-to-br from-black via-gray-950 to-purple-950/40" : "bg-linear-to-br from-white via-amber-50/30 to-white"}`}>
        <Sidebar mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} neonMode={neonMode} />
      {mobileMenuOpen && (
        <div className={`fixed inset-0 z-30 md:hidden ${neonMode ? "bg-black/60 backdrop-blur-sm" : "bg-white/80 backdrop-blur-sm"}`} onClick={() => setMobileMenuOpen(false)} />
      )}
      <main className="flex-1 p-4 md:p-8 lg:p-10 overflow-x-auto">
        <Header patientsCount={filteredPatients.length} neonMode={neonMode} setNeonMode={setNeonMode}  setMobileMenuOpen={setMobileMenuOpen} />

        {/* Filters Panel */}
        <div className={`mb-6 p-4 rounded-xl ${neonMode ? "bg-black/40 border border-cyan-500/30" : "bg-white/80 border border-amber-100 shadow-sm"}`}>
          <div className="flex flex-wrap items-end gap-4">
            <div className="flex-1 min-w-37.5">
              <label className={`block text-xs uppercase font-semibold mb-1 ${neonMode ? "text-cyan-400" : "text-amber-600"}`}>Search</label>
              <input
                type="text"
                placeholder="Name or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full rounded-lg p-2 ${neonMode ? "bg-gray-950/80 border border-cyan-500/30 text-cyan-100" : "bg-white border border-amber-200 text-gray-700"}`}
              />
            </div>
            <div className="w-40">
              <label className={`block text-xs uppercase font-semibold mb-1 ${neonMode ? "text-cyan-400" : "text-amber-600"}`}>Service</label>
              <select
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                className={`w-full rounded-lg p-2 ${neonMode ? "bg-gray-950/80 border border-cyan-500/30 text-cyan-100" : "bg-white border border-amber-200 text-gray-700"}`}
              >
                <option value="">All</option>
                {allServices.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div className="w-40">
              <label className={`block text-xs uppercase font-semibold mb-1 ${neonMode ? "text-cyan-400" : "text-amber-600"}`}>From Date</label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className={`w-full rounded-lg p-2 ${neonMode ? "bg-gray-950/80 border border-cyan-500/30 text-cyan-100" : "bg-white border border-amber-200 text-gray-700"}`}
              />
            </div>
            <div className="w-40">
              <label className={`block text-xs uppercase font-semibold mb-1 ${neonMode ? "text-cyan-400" : "text-amber-600"}`}>To Date</label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className={`w-full rounded-lg p-2 ${neonMode ? "bg-gray-950/80 border border-cyan-500/30 text-cyan-100" : "bg-white border border-amber-200 text-gray-700"}`}
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="balanceFilter"
                checked={showOnlyWithBalance}
                onChange={(e) => setShowOnlyWithBalance(e.target.checked)}
                className="w-4 h-4 accent-cyan-500"
              />
              <label htmlFor="balanceFilter" className={`text-sm ${neonMode ? "text-gray-300" : "text-gray-700"}`}>
                Outstanding balance &gt; $0
              </label>
            </div>
            <button
              onClick={resetFilters}
              className={`px-4 py-2 rounded-lg transition ${neonMode ? "bg-gray-700 hover:bg-gray-600 text-white" : "bg-gray-200 hover:bg-gray-300 text-gray-800"}`}
            >
              Reset
            </button>
          </div>
        </div>

        <PatientsTable
          patients={filteredPatients}
          neonMode={neonMode}
          onView={setViewingPatient}
          onEdit={setEditingPatient}
          onDelete={handleDelete}
        />
      </main>
      {viewingPatient && <ViewPatientModal patient={viewingPatient} onClose={() => setViewingPatient(null)} neonMode={neonMode} />}
      {editingPatient && <EditPatientModal patient={editingPatient} onClose={() => setEditingPatient(null)} neonMode={neonMode} />}
    </div>
    </ProtectedRoute>
  );
}