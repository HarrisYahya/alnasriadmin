"use client";

import { useState, useEffect } from "react";
import { useSettings } from "../context/SettingsContext";
import { usePatients } from "../context/PatientContext";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

import SettingsForm from "./components/SettingsForm";
import SettingsPreview from "./components/SettingsPreview";
import ConfirmDelete from "./components/ConfirmDelete";
import ActivityPanel from "../components/pharmacy/ActivityPanel";
import UserManager from "../components/UserManager";

export default function SettingsPage() {
  const { settings, updateSettings } = useSettings();
  const { patients, deletePatient } = usePatients();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showClear, setShowClear] = useState(false);

  const [tab, setTab] = useState<
    "settings" | "users" | "activity"
  >("settings");

  const [neonMode, setNeonMode] = useState(
    settings.theme === "neon"
  );

  const [formData, setFormData] = useState({
    theme: settings.theme as "neon" | "white",
    defaultDiscount: settings.defaultDiscount,
    clinicName: settings.clinicName,
    clinicPhone: settings.clinicPhone,
    clinicAddress: settings.clinicAddress,
  });

  // 🔄 sync settings
  useEffect(() => {
    setFormData({
      theme: settings.theme as "neon" | "white",
      defaultDiscount: settings.defaultDiscount,
      clinicName: settings.clinicName,
      clinicPhone: settings.clinicPhone,
      clinicAddress: settings.clinicAddress,
    });

    setNeonMode(settings.theme === "neon");
  }, [settings]);

  const handleSave = () => {
    updateSettings(formData);
    setNeonMode(formData.theme === "neon");
    alert("Saved");
  };

  const clearAll = async () => {
    for (const p of patients) await deletePatient(p.id!);
    setShowClear(false);
  };

  return (
    <div
      className={`flex min-h-screen ${
        neonMode ? "bg-black" : "bg-white"
      }`}
    >
      <Sidebar
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        neonMode={neonMode}
      />

      <main className="flex-1 p-6 space-y-6">

        <Header
          patientsCount={patients.length}
          neonMode={neonMode}
          setNeonMode={(mode) => {
            setNeonMode(mode);
            setFormData({
              ...formData,
              theme: mode ? "neon" : "white",
            });
            updateSettings({
              theme: mode ? "neon" : "white",
            });
          }}
          setMobileMenuOpen={setMobileMenuOpen}
        />

        {/* 🔘 TABS */}
        <div className="flex gap-4 border-b pb-3">

          <button
            onClick={() => setTab("settings")}
            className={
              tab === "settings"
                ? "text-cyan-400 border-b-2 border-cyan-400 pb-1"
                : "text-gray-500"
            }
          >
            ⚙️ Settings
          </button>

          <button
            onClick={() => setTab("users")}
            className={
              tab === "users"
                ? "text-cyan-400 border-b-2 border-cyan-400 pb-1"
                : "text-gray-500"
            }
          >
            👤 Users
          </button>

          <button
            onClick={() => setTab("activity")}
            className={
              tab === "activity"
                ? "text-cyan-400 border-b-2 border-cyan-400 pb-1"
                : "text-gray-500"
            }
          >
            📊 Activity
          </button>

        </div>

        {/* ⚙️ SETTINGS */}
        {tab === "settings" && (
          <>
            <SettingsForm
              formData={formData}
              setFormData={setFormData}
              neonMode={neonMode}
              onSave={handleSave}
              onDeleteClick={() => setShowClear(true)}
            />

            <SettingsPreview
              formData={formData}
              neonMode={neonMode}
            />
          </>
        )}

        {/* 👤 USERS (FIXED FONT ISSUE HERE) */}
        {tab === "users" && (
          <div className="text-white">
            <UserManager />
          </div>
        )}

        {/* 📊 ACTIVITY */}
        {tab === "activity" && <ActivityPanel />}

        {/* ❌ CLEAR DIALOG */}
        <ConfirmDelete
          open={showClear}
          count={patients.length}
          onCancel={() => setShowClear(false)}
          onConfirm={clearAll}
          neonMode={neonMode}
        />

      </main>
    </div>
  );
}