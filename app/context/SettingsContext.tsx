"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type AppSettings = {
  theme: "neon" | "white";
  defaultDiscount: number;
  clinicName: string;
  clinicPhone: string;
  clinicAddress: string;
};

const defaultSettings: AppSettings = {
  theme: "neon",
  defaultDiscount: 0,
  clinicName: "Alnasri Dental",
  clinicPhone: "+252 61 249 2575",
  clinicAddress: "Jaale siyad street, madina, Tabakayo, Madow",
};

interface SettingsContextType {
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);

  // Load settings from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("dental_dashboard_settings");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setSettings({ ...defaultSettings, ...parsed });
      } catch (e) {
        console.error("Failed to parse settings", e);
      }
    }
  }, []);

  // Save settings to localStorage whenever they change
  const updateSettings = (newSettings: Partial<AppSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    localStorage.setItem("dental_dashboard_settings", JSON.stringify(updated));
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within SettingsProvider");
  }
  return context;
}