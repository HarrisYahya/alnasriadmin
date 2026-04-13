//app/settings/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useSettings } from "../context/SettingsContext";
import { usePatients } from "../context/PatientContext";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

export default function SettingsPage() {
  const { settings, updateSettings } = useSettings();
  const { patients, deletePatient } = usePatients();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [neonMode, setNeonMode] = useState(settings.theme === "neon");
  const [formData, setFormData] = useState({
    theme: settings.theme,
    defaultDiscount: settings.defaultDiscount,
    clinicName: settings.clinicName,
    clinicPhone: settings.clinicPhone,
    clinicAddress: settings.clinicAddress,
  });
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Sync local form with context when settings change
  useEffect(() => {
    setFormData({
      theme: settings.theme,
      defaultDiscount: settings.defaultDiscount,
      clinicName: settings.clinicName,
      clinicPhone: settings.clinicPhone,
      clinicAddress: settings.clinicAddress,
    });
    setNeonMode(settings.theme === "neon");
  }, [settings]);

  const handleSave = () => {
    updateSettings({
      theme: formData.theme,
      defaultDiscount: formData.defaultDiscount,
      clinicName: formData.clinicName,
      clinicPhone: formData.clinicPhone,
      clinicAddress: formData.clinicAddress,
    });
    alert("Settings saved!");
  };

  const handleClearAllPatients = async () => {
    if (confirm("⚠️ This will delete ALL patients permanently. Are you ABSOLUTELY sure?")) {
      for (const patient of patients) {
        await deletePatient(patient.id!);
      }
      alert("All patients have been deleted.");
      setShowClearConfirm(false);
    }
  };

  const inputClass = neonMode
    ? "w-full border border-cyan-500/30 rounded-xl p-3 bg-gray-950/80 text-cyan-100 placeholder:text-gray-500 focus:bg-black focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/50 transition outline-none"
    : "w-full border border-amber-200 rounded-xl p-3 bg-white text-gray-700 placeholder:text-gray-400 focus:bg-white focus:border-amber-400 focus:ring-2 focus:ring-amber-200/50 transition outline-none shadow-sm";

  const labelClass = neonMode
    ? "text-xs uppercase tracking-wider font-semibold text-cyan-400"
    : "text-xs uppercase tracking-wider font-semibold text-amber-600";

  const buttonClass = neonMode
    ? "bg-linear-to-r from-cyan-600 to-purple-600 text-white px-6 py-2 rounded-xl hover:shadow-lg transition"
    : "bg-linear-to-r from-amber-500 to-amber-700 text-white px-6 py-2 rounded-xl hover:shadow-lg transition";

  return (
    <div
      className={`flex flex-col md:flex-row min-h-screen font-sans ${
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

      {mobileMenuOpen && (
        <div
          className={`fixed inset-0 z-30 md:hidden ${
            neonMode ? "bg-black/60 backdrop-blur-sm" : "bg-white/80 backdrop-blur-sm"
          }`}
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <main className="flex-1 p-4 md:p-8 lg:p-10 overflow-x-auto">
        <Header
          patientsCount={patients.length}
          neonMode={neonMode}
          setNeonMode={(mode) => {
            setNeonMode(mode);
            updateSettings({ theme: mode ? "neon" : "white" });
          }}
           setMobileMenuOpen={setMobileMenuOpen} 
        />

        <div className="mb-6">
          <h1 className={`text-3xl font-light ${neonMode ? "text-cyan-300" : "text-gray-800"}`}>
            ⚙️ Settings
          </h1>
          <p className={`mt-1 ${neonMode ? "text-gray-400" : "text-gray-500"}`}>
            Customize your dashboard experience
          </p>
        </div>

        <div
          className={`rounded-2xl p-6 md:p-8 ${
            neonMode
              ? "bg-black/60 backdrop-blur-md shadow-[0_0_25px_rgba(0,255,255,0.2)] border border-cyan-500/40"
              : "bg-white/90 backdrop-blur-sm shadow-xl border border-amber-100"
          }`}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Theme Selection */}
            <div className="space-y-2">
              <label className={labelClass}>Dashboard Theme</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="theme"
                    value="neon"
                    checked={formData.theme === "neon"}
                    onChange={() => setFormData({ ...formData, theme: "neon" })}
                    className="w-4 h-4"
                  />
                  <span>🌙 Neon (Dark)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="theme"
                    value="white"
                    checked={formData.theme === "white"}
                    onChange={() => setFormData({ ...formData, theme: "white" })}
                    className="w-4 h-4"
                  />
                  <span>☀️ White (Luxury)</span>
                </label>
              </div>
            </div>

            {/* Default Discount */}
            <div className="space-y-2">
              <label className={labelClass}>Default Discount ($)</label>
              <input
                type="number"
                className={inputClass}
                value={formData.defaultDiscount}
                onChange={(e) =>
                  setFormData({ ...formData, defaultDiscount: Number(e.target.value) })
                }
              />
              <p className="text-xs opacity-70">Will be pre-filled when adding new patients.</p>
            </div>

            {/* Clinic Name */}
            <div className="space-y-2">
              <label className={labelClass}>Clinic Name</label>
              <input
                type="text"
                className={inputClass}
                value={formData.clinicName}
                onChange={(e) => setFormData({ ...formData, clinicName: e.target.value })}
              />
            </div>

            {/* Clinic Phone */}
            <div className="space-y-2">
              <label className={labelClass}>Clinic Phone</label>
              <input
                type="text"
                className={inputClass}
                value={formData.clinicPhone}
                onChange={(e) => setFormData({ ...formData, clinicPhone: e.target.value })}
              />
            </div>

            {/* Clinic Address */}
            <div className="space-y-2 md:col-span-2">
              <label className={labelClass}>Clinic Address</label>
              <input
                type="text"
                className={inputClass}
                value={formData.clinicAddress}
                onChange={(e) => setFormData({ ...formData, clinicAddress: e.target.value })}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 mt-8 pt-4 border-t border-cyan-500/20">
            <button onClick={handleSave} className={buttonClass}>
              💾 Save Settings
            </button>
            <button
              onClick={() => setShowClearConfirm(true)}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-xl transition"
            >
              🗑️ Delete All Patients
            </button>
          </div>

          {showClearConfirm && (
            <div className="mt-4 p-4 rounded-xl bg-red-900/30 border border-red-500">
              <p className="text-red-300 font-semibold">
                ⚠️ Warning: This action cannot be undone. {patients.length} patients will be permanently deleted.
              </p>
              <div className="flex gap-3 mt-3">
                <button
                  onClick={handleClearAllPatients}
                  className="bg-red-600 px-4 py-2 rounded-lg text-white"
                >
                  Yes, Delete Everything
                </button>
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="bg-gray-600 px-4 py-2 rounded-lg text-white"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Preview Section */}
        <div className="mt-8">
          <h2 className={`text-xl font-light mb-3 ${neonMode ? "text-cyan-300" : "text-gray-700"}`}>
            Preview Changes
          </h2>
          <div
            className={`p-4 rounded-xl ${
              neonMode ? "bg-black/40 border border-cyan-500/30" : "bg-amber-50/50 border border-amber-100"
            }`}
          >
            <p>
              <strong>Clinic:</strong> {formData.clinicName}
            </p>
            <p>
              <strong>Contact:</strong> {formData.clinicPhone}
            </p>
            <p>
              <strong>Address:</strong> {formData.clinicAddress}
            </p>
            <p>
              <strong>Default Discount:</strong> ${formData.defaultDiscount}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}