//app/context/AppointmentContext.tsx
"use client";

import { createContext, useContext, useState, ReactNode } from "react";

/* =========================
   TYPES
========================= */

export type Appointment = {
  id: string;
  patientId: string; // ✅ FIXED (THIS WAS MISSING)
  name: string;
  phone: string;
  date: string;
  time: string;
  notes?: string;
};

type AppointmentContextType = {
  appointments: Appointment[];
  addAppointment: (appointment: Appointment) => void;
  getByDate: (date: string) => Appointment[];
};

/* =========================
   CONTEXT
========================= */

const AppointmentContext = createContext<AppointmentContextType | null>(null);

/* =========================
   PROVIDER
========================= */

export function AppointmentProvider({ children }: { children: ReactNode }) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const addAppointment = (appointment: Appointment) => {
    setAppointments((prev) => [...prev, appointment]);
  };

  const getByDate = (date: string) => {
    return appointments.filter((a) => a.date === date);
  };

  return (
    <AppointmentContext.Provider
      value={{
        appointments,
        addAppointment,
        getByDate,
      }}
    >
      {children}
    </AppointmentContext.Provider>
  );
}

/* =========================
   HOOK
========================= */

export function useAppointments() {
  const ctx = useContext(AppointmentContext);
  if (!ctx) {
    throw new Error("useAppointments must be used inside AppointmentProvider");
  }
  return ctx;
}