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
  addMonths,
  subMonths,
} from "date-fns";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { useSettings } from "../context/SettingsContext";
import { useAppointments } from "../context/AppointmentContext";
import Link from "next/link";

export default function CalendarPage() {
  const { settings } = useSettings();
  const { appointments } = useAppointments();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [neonMode, setNeonMode] = useState(settings.theme === "neon");
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // 📆 calendar grid
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const days = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd,
  });

  // 🧠 group appointments by date
  const appointmentsByDate = useMemo(() => {
    const map = new Map<string, any[]>();

    appointments.forEach((a) => {
      if (!map.has(a.date)) map.set(a.date, []);
      map.get(a.date)!.push(a);
    });

    return map;
  }, [appointments]);

  const goPrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const goNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  const cellClass = (day: Date) => {
    const base = "p-2 h-32 border transition-all overflow-y-auto";
    const isCurrentMonth = isSameMonth(day, currentMonth);
    const hasAppointments = appointmentsByDate.has(format(day, "yyyy-MM-dd"));

    if (neonMode) {
      return `${base} ${
        isCurrentMonth
          ? "bg-black/40 border-cyan-500/30"
          : "bg-gray-950/40 border-cyan-500/20 text-gray-500"
      } ${hasAppointments ? "shadow-[0_0_8px_#0ff]" : ""}`;
    }

    return `${base} ${
      isCurrentMonth
        ? "bg-white/60 border-amber-100"
        : "bg-gray-50 border-amber-50 text-gray-400"
    } ${hasAppointments ? "shadow-md" : ""}`;
  };

  return (
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

      {mobileMenuOpen && (
        <div
          className={`fixed inset-0 z-30 md:hidden ${
            neonMode
              ? "bg-black/60 backdrop-blur-sm"
              : "bg-white/80 backdrop-blur-sm"
          }`}
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <main className="flex-1 p-4 md:p-8 lg:p-10 overflow-x-auto">
        <Header
          patientsCount={appointments.length}
          neonMode={neonMode}
          setNeonMode={setNeonMode}
        />

        <div className="flex justify-between items-center mb-6">
          <h2
            className={`text-2xl font-light ${
              neonMode ? "text-cyan-300" : "text-gray-700"
            }`}
          >
            📆 Appointment Calendar
          </h2>

          <div className="flex gap-2">
            <button
              onClick={goPrevMonth}
              className={`px-4 py-2 rounded-xl ${
                neonMode
                  ? "bg-cyan-600 hover:bg-cyan-700"
                  : "bg-amber-500 hover:bg-amber-600"
              } text-white`}
            >
              ← Prev
            </button>

            <span
              className={`text-lg font-medium px-4 py-2 ${
                neonMode ? "text-cyan-300" : "text-gray-700"
              }`}
            >
              {format(currentMonth, "MMMM yyyy")}
            </span>

            <button
              onClick={goNextMonth}
              className={`px-4 py-2 rounded-xl ${
                neonMode
                  ? "bg-cyan-600 hover:bg-cyan-700"
                  : "bg-amber-500 hover:bg-amber-600"
              } text-white`}
            >
              Next →
            </button>
          </div>
        </div>

        {/* DAYS HEADER */}
        <div className="grid grid-cols-7 gap-1 text-center mb-2">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
            <div
              key={d}
              className={`font-semibold p-2 ${
                neonMode ? "text-cyan-400" : "text-amber-600"
              }`}
            >
              {d}
            </div>
          ))}
        </div>

        {/* CALENDAR GRID */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, idx) => {
            const dateKey = format(day, "yyyy-MM-dd");
            const dayAppointments = appointmentsByDate.get(dateKey) || [];

            return (
              <Link
                key={idx}
                href={`/appointments/${dateKey}`}
                className={cellClass(day)}
              >
                <div
                  className={`text-right text-sm ${
                    neonMode ? "text-cyan-300" : "text-gray-600"
                  }`}
                >
                  {format(day, "d")}
                </div>

                <div className="mt-1 space-y-1">
                  {dayAppointments.slice(0, 2).map((a) => (
                    <div
                      key={a.id}
                      className={`block text-xs truncate rounded px-1 py-0.5 ${
                        neonMode
                          ? "bg-cyan-950/60 text-cyan-200"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {a.name}
                    </div>
                  ))}

                  {dayAppointments.length > 2 && (
                    <span
                      className={`text-xs ${
                        neonMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      +{dayAppointments.length - 2} more
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}