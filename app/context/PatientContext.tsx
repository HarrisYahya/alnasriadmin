"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "../lib/supabaseClient";

export type Patient = {
  id?: string;
  name: string;
  phone: string;
  services: string[];
  location: string;
  fee: number;
  discount: number;
  total: number;
  amount_paid: number;
  balance_remaining: number;
  datetime: string;
  created_at?: string;
};

// For adding a patient, balance_remaining is optional (will be calculated)
export type PatientInput = Omit<Patient, 'balance_remaining'> & { balance_remaining?: number };

interface PatientContextType {
  patients: Patient[];
  addPatient: (patient: PatientInput) => Promise<void>;
  updatePatient: (id: string, updates: Partial<Patient>) => Promise<void>;
  deletePatient: (id: string) => Promise<void>;
  loading: boolean;
}

const PatientContext = createContext<PatientContextType | undefined>(undefined);

export function PatientProvider({ children }: { children: ReactNode }) {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("patients")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching patients:", error.message);
    } else {
      setPatients(data || []);
    }
    setLoading(false);
  };

  const addPatient = async (patient: PatientInput) => {
    // Calculate balance_remaining
    const balance_remaining = patient.total - (patient.amount_paid || 0);
    const newPatient = { ...patient, balance_remaining };

    // Format datetime to ISO string if present
    let datetimeValue = newPatient.datetime;
    if (datetimeValue && !datetimeValue.includes('T')) {
    datetimeValue = new Date(datetimeValue).toISOString();
    }
    newPatient.datetime = datetimeValue || '';

    console.log("Inserting patient:", newPatient);

    const { data, error } = await supabase
      .from("patients")
      .insert([newPatient])
      .select();

    if (error) {
      console.error("Supabase insert error details:", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      });
      return;
    }
    if (data && data[0]) {
      setPatients((prev) => [data[0], ...prev]);
    }
  };

  const updatePatient = async (id: string, updates: Partial<Patient>) => {
    let balance_remaining = updates.balance_remaining;
    if (updates.total !== undefined || updates.amount_paid !== undefined) {
      const current = patients.find(p => p.id === id);
      if (current) {
        const newTotal = updates.total ?? current.total;
        const newAmountPaid = updates.amount_paid ?? current.amount_paid;
        balance_remaining = newTotal - newAmountPaid;
        updates.balance_remaining = balance_remaining;
      }
    }

    const { data, error } = await supabase
      .from("patients")
      .update(updates)
      .eq("id", id)
      .select();

    if (error) {
      console.error("Error updating patient:", error.message);
      return;
    }
    if (data) {
      setPatients((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...data[0] } : p))
      );
    }
  };

  const deletePatient = async (id: string) => {
    const { error } = await supabase.from("patients").delete().eq("id", id);
    if (error) {
      console.error("Error deleting patient:", error.message);
      return;
    }
    setPatients((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <PatientContext.Provider value={{ patients, addPatient, updatePatient, deletePatient, loading }}>
      {children}
    </PatientContext.Provider>
  );
}

export function usePatients() {
  const context = useContext(PatientContext);
  if (context === undefined) {
    throw new Error("usePatients must be used within a PatientProvider");
  }
  return context;
}