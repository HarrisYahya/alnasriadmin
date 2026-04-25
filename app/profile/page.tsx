"use client";

import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useSettings } from "../context/SettingsContext";
import ProtectedRoute from "../components/ProtectedRoute";
import { useRouter } from "next/navigation";
import Sidebar from "../components/Sidebar";
import QueueSidebar from "../components/QueueSidebar";
import Header from "../components/Header";
import PharmacySidebar from "../components/pharmacy/PharmacySidebar";
import { useRole } from "../hooks/useRole";
import { supabase } from "../lib/supabaseClient";

export default function ProfilePage() {
  const { user } = useAuth();
  const { settings } = useSettings();
  const { role, loading: roleLoading } = useRole();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [neonMode, setNeonMode] = useState(settings.theme === "neon");

  const router = useRouter();

  const handleNavigate = (view: string) => {
    if (view === "dashboard" || view === "inventory" || view === "sales") {
      router.push("/pharmacy");
    }
  };

  const handleSignOut = () => {
    router.push("/login");
  };

  const cardClass = neonMode
    ? "bg-black/70 backdrop-blur-xl text-cyan-100 border border-cyan-500/40 rounded-2xl shadow-[0_0_25px_rgba(0,255,255,0.2)]"
    : "bg-white/95 backdrop-blur-md text-gray-800 border border-amber-200/50 rounded-2xl shadow-2xl";

  const inputClass = neonMode
    ? "w-full p-3 bg-black text-cyan-100 border border-cyan-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400"
    : "w-full p-3 bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400";

  const buttonClass = neonMode
    ? "w-full bg-cyan-600 text-white p-3 rounded-xl hover:bg-cyan-500 disabled:opacity-50 transition-all"
    : "w-full bg-blue-500 text-white p-3 rounded-xl hover:bg-blue-600 disabled:opacity-50 transition-all";

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage("New passwords do not match");
      return;
    }
    if (!currentPassword) {
      setMessage("Please enter current password");
      return;
    }
    setLoading(true);
    setMessage("");

    // First, reauthenticate with current password
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user!.email!,
      password: currentPassword,
    });

    if (signInError) {
      setMessage("Current password is incorrect");
      setLoading(false);
      return;
    }

    // Now update to new password
    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
      setMessage("Error updating password: " + error.message);
    } else {
      setMessage("Password updated successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
    setLoading(false);
  };

  if (roleLoading) {
    return (
      <ProtectedRoute allowed={["admin", "staff", "pharmacy"]}>
        <div className="min-h-screen flex items-center justify-center">
          Loading...
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowed={["admin", "staff", "pharmacy"]}>
      <div
        className={`flex flex-col md:flex-row min-h-screen ${
          neonMode
            ? "bg-linear-to-br from-black via-gray-950 to-purple-950/40"
            : "bg-linear-to-br from-white via-amber-50/30 to-white"
        }`}
      >
        {role === "pharmacy" ? (
          <PharmacySidebar
            onNavigate={handleNavigate}
            signOut={handleSignOut}
            open={true}
            setOpen={() => {}}
          />
        ) : role === "staff" ? (
          <QueueSidebar
            mobileMenuOpen={mobileMenuOpen}
            setMobileMenuOpen={setMobileMenuOpen}
            neonMode={neonMode}
          />
        ) : (
          <Sidebar
            mobileMenuOpen={mobileMenuOpen}
            setMobileMenuOpen={setMobileMenuOpen}
            neonMode={neonMode}
          />
        )}

        <main className="flex-1 p-4 md:p-8 lg:p-10 overflow-x-auto">
          <Header
            patientsCount={0} // Not needed for profile
            neonMode={neonMode}
            setNeonMode={setNeonMode}
          />

          <div className="mt-8">
            <h1 className={`text-2xl font-bold mb-6 ${neonMode ? "text-cyan-300" : "text-gray-800"}`}>Profile</h1>
            <div className={`p-6 max-w-md ${cardClass}`}>
              <h2 className="text-lg font-semibold mb-4">User Information</h2>
              <p className="mb-4 opacity-80">Email: {user?.email}</p>
              <h2 className="text-lg font-semibold mb-4">Update Password</h2>
              <form onSubmit={handleUpdatePassword} className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-1 ${neonMode ? "text-cyan-200" : "text-gray-700"}`}>Current Password</label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className={inputClass}
                    required
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${neonMode ? "text-cyan-200" : "text-gray-700"}`}>New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className={inputClass}
                    required
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${neonMode ? "text-cyan-200" : "text-gray-700"}`}>Confirm New Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={inputClass}
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className={buttonClass}
                >
                  {loading ? "Updating..." : "Update Password"}
                </button>
              </form>
              {message && <p className={`mt-4 text-sm ${neonMode ? "text-cyan-400" : "text-red-600"}`}>{message}</p>}
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}