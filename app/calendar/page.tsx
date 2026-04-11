"use client";

import { useState, useMemo } from "react";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
} from "date-fns";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { usePatients, Patient } from "../context/PatientContext";
import { useSettings } from "../context/SettingsContext";
import Link from "next/link";

export default function CalendarPage() {
  const { patients, loading } = usePatients();
  const { settings } = useSettings();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [neonMode, setNeonMode] = useState(settings.theme === "neon");
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Generate days for the current month view (including prev/next month days to fill the grid)
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 }); // Monday first
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  // Group patients by date (YYYY-MM-DD)
  const appointmentsByDate = useMemo(() => {
    const map = new Map<string, Patient[]>();
    patients.forEach((p: Patient) => {
      if (!p.datetime) return;
      const dateKey = format(new Date(p.datetime), "yyyy-MM-dd");
      if (!map.has(dateKey)) map.set(dateKey, []);
      map.get(dateKey)!.push(p);
    });
    return map;
  }, [patients]);

  const goPrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const goNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  const cellClass = (day: Date) => {
    const base = "p-2 h-32 border transition-all overflow-y-auto";
    const isCurrentMonth = isSameMonth(day, currentMonth);
    const hasAppointments = appointmentsByDate.has(format(day, "yyyy-MM-dd"));
    if (neonMode) {
      return `${base} ${isCurrentMonth ? "bg-black/40 border-cyan-500/30" : "bg-gray-950/40 border-cyan-500/20 text-gray-500"} ${
        hasAppointments ? "shadow-[0_0_8px_#0ff]" : ""
      } hover:bg-cyan-950/30`;
    } else {
      return `${base} ${isCurrentMonth ? "bg-white/60 border-amber-100" : "bg-gray-50 border-amber-50 text-gray-400"} ${
        hasAppointments ? "shadow-md" : ""
      } hover:bg-amber-50/50`;
    }
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
    <div className={`flex flex-col md:flex-row min-h-screen ${neonMode ? "bg-linear-to-br from-black via-gray-950 to-purple-950/40" : "bg-linear-to-br from-white via-amber-50/30 to-white"}`}>
      <Sidebar mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} neonMode={neonMode} />
      {mobileMenuOpen && (
        <div className={`fixed inset-0 z-30 md:hidden ${neonMode ? "bg-black/60 backdrop-blur-sm" : "bg-white/80 backdrop-blur-sm"}`} onClick={() => setMobileMenuOpen(false)} />
      )}
      <main className="flex-1 p-4 md:p-8 lg:p-10 overflow-x-auto">
        <Header patientsCount={patients.length} neonMode={neonMode} setNeonMode={setNeonMode} />
        <div className="flex justify-between items-center mb-6">
          <h2 className={`text-2xl font-light ${neonMode ? "text-cyan-300" : "text-gray-700"}`}>
            📆 Appointment Calendar
          </h2>
          <div className="flex gap-2">
            <button onClick={goPrevMonth} className={`px-4 py-2 rounded-xl ${neonMode ? "bg-cyan-600 hover:bg-cyan-700" : "bg-amber-500 hover:bg-amber-600"} text-white`}>
              ← Prev
            </button>
            <span className={`text-lg font-medium px-4 py-2 ${neonMode ? "text-cyan-300" : "text-gray-700"}`}>
              {format(currentMonth, "MMMM yyyy")}
            </span>
            <button onClick={goNextMonth} className={`px-4 py-2 rounded-xl ${neonMode ? "bg-cyan-600 hover:bg-cyan-700" : "bg-amber-500 hover:bg-amber-600"} text-white`}>
              Next →
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center mb-2">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
            <div key={day} className={`font-semibold p-2 ${neonMode ? "text-cyan-400" : "text-amber-600"}`}>
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {days.map((day, idx) => {
            const dateKey = format(day, "yyyy-MM-dd");
            const dayPatients = appointmentsByDate.get(dateKey) || [];
            return (
              <div key={idx} className={cellClass(day)}>
                <div className={`text-right text-sm ${neonMode ? "text-cyan-300" : "text-gray-600"}`}>
                  {format(day, "d")}
                </div>
                <div className="mt-1 space-y-1">
                  {dayPatients.slice(0, 2).map((p: Patient) => (
                    <Link
                      key={p.id}
                      href={`/patients`}
                      className={`block text-xs truncate rounded px-1 py-0.5 ${
                        neonMode
                          ? "bg-cyan-950/60 text-cyan-200 hover:bg-cyan-800"
                          : "bg-amber-100 text-amber-800 hover:bg-amber-200"
                      }`}
                      title={p.name}
                    >
                      {p.name}
                    </Link>
                  ))}
                  {dayPatients.length > 2 && (
                    <span className={`text-xs ${neonMode ? "text-gray-400" : "text-gray-500"}`}>
                      +{dayPatients.length - 2} more
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}