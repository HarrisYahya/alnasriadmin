"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import { usePatients } from "./context/PatientContext";
import { useSettings } from "./context/SettingsContext";
import { useAuth } from "./context/AuthContext";
import { supabase } from "./lib/supabaseClient";
import { useRouter } from "next/navigation";
import { usePermissions } from "./hooks/usePermissions";
import ProtectedRoute from "./components/ProtectedRoute";

export default function DashboardPage() {
  const { patients, loading: patientsLoading } = usePatients();
  const { settings } = useSettings();
  const { session, loading: authLoading } = useAuth();
  const { can } = usePermissions();

  const router = useRouter();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [neonMode, setNeonMode] = useState(settings.theme === "neon");
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const getRole = async () => {
      if (!session?.user?.email) return;

      const { data } = await supabase
        .from("staff")
        .select("role")
        .eq("email", session.user.email)
        .single();

      const userRole = data?.role || "admin";
      setRole(userRole);

      if (userRole === "staff") {
        router.replace("/queue");
      }
    };

    getRole();
  }, [session, router]);

  if (authLoading) return null;
  if (!session) return null;
  if (patientsLoading) return null;

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

  const statCardClass =
    neonMode
      ? "bg-black/60 backdrop-blur-md border border-cyan-500/30 rounded-2xl p-6"
      : "bg-white/90 backdrop-blur-sm border border-amber-100 rounded-2xl p-6 shadow-sm";

  const statValueClass =
    neonMode
      ? "text-3xl font-bold text-cyan-300"
      : "text-3xl font-bold text-amber-700";

  const statLabelClass =
    neonMode
      ? "text-gray-400 text-sm"
      : "text-gray-500 text-sm";

  return (
    <ProtectedRoute allowed={["admin"]}>
      <div
        className={`flex flex-col md:flex-row min-h-screen ${
          neonMode
            ? "bg-linear-to-br from-black via-gray-950 to-purple-950/40"
            : "bg-linear-to-br from-white via-amber-50/30 to-white"
        }`}
      >
        {role !== "staff" && (
          <Sidebar
            mobileMenuOpen={mobileMenuOpen}
            setMobileMenuOpen={setMobileMenuOpen}
            neonMode={neonMode}
          />
        )}

        <main className="flex-1 p-4 md:p-8 lg:p-10 overflow-x-auto">
          <Header
            patientsCount={totalPatients}
            neonMode={neonMode}
            setNeonMode={setNeonMode}
            setMobileMenuOpen={setMobileMenuOpen}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className={statCardClass}>
              <div className={statValueClass}>{totalPatients}</div>
              <div className={statLabelClass}>Total Patients</div>
            </div>

            <div className={statCardClass}>
              <div className={statValueClass}>
                ${totalCollected.toLocaleString()}
              </div>
              <div className={statLabelClass}>Collected Revenue</div>
            </div>

            <div className={statCardClass}>
              <div className={statValueClass}>
                ${totalOutstanding.toLocaleString()}
              </div>
              <div className={statLabelClass}>Outstanding Balance</div>
            </div>

            <div className={statCardClass}>
              <div className={statValueClass}>
                ${totalRevenue.toLocaleString()}
              </div>
              <div className={statLabelClass}>Total Billings</div>
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <Link href="/add-patient">
              <button className="px-8 py-3 rounded-xl font-semibold">
                + Register New Patient
              </button>
            </Link>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}