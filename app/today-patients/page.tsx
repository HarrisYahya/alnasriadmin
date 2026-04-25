"use client";

import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import PatientsTable from "../components/PatientsTable";
import { usePatients } from "../context/PatientContext";
import { useSettings } from "../context/SettingsContext";
import ViewPatientModal from "../components/ViewPatientModal";
import EditPatientModal from "../components/EditPatientModal";
import { Patient } from "../context/PatientContext";
import ProtectedRoute from "../components/ProtectedRoute";

export default function TodayPatientsPage() {
  const { patients, deletePatient, loading } = usePatients();
  const { settings } = useSettings();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [neonMode, setNeonMode] = useState(settings.theme === "neon");
  const [viewingPatient, setViewingPatient] = useState<Patient | null>(null);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);

  // Filter patients registered today
  const today = new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD
  const todayPatients = patients.filter((p) => {
    if (!p.datetime) return false;
    const patientDate = new Date(p.datetime).toLocaleDateString("en-CA");
    return patientDate === today;
  });

  const handleDelete = async (patient: Patient) => {
    if (confirm(`Delete ${patient.name}? This action cannot be undone.`)) {
      await deletePatient(patient.id!);
    }
  };

  if (loading) {
    return (
      <div className={`flex flex-col md:flex-row min-h-screen ${neonMode ? "bg-linear-to-br from-black via-gray-950 to-purple-950/40" : "bg-linear-to-br from-white via-amber-50/30 to-white"}`}>
        <Sidebar mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} neonMode={neonMode} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className={`animate-spin rounded-full h-12 w-12 border-b-2 mx-auto ${neonMode ? "border-cyan-400" : "border-amber-500"}`}></div>
            <p className={`mt-4 ${neonMode ? "text-gray-400" : "text-gray-500"}`}>Loading patients...</p>
          </div>
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
        <Header patientsCount={todayPatients.length} neonMode={neonMode} setNeonMode={setNeonMode}  setMobileMenuOpen={setMobileMenuOpen} />
        <div className="mb-6">
          <h2 className={`text-2xl font-light ${neonMode ? "text-cyan-300" : "text-gray-700"}`}>
            📅 Today's Patients
          </h2>
          <p className={`mt-1 ${neonMode ? "text-gray-400" : "text-gray-500"}`}>
            Patients registered on {new Date().toLocaleDateString()}
          </p>
        </div>
        <PatientsTable
          patients={todayPatients}
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