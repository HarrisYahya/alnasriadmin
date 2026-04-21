import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { AppointmentProvider } from "./context/AppointmentContext";
import { AuthProvider } from "./context/AuthContext";
import { SettingsProvider } from "./context/SettingsContext";
import { PatientProvider } from "./context/PatientContext";
import { QueueProvider } from "./context/QueueContext";
import { PharmacyProvider } from "./context/PharmacyContext";

export const dynamic = "force-dynamic"; // ✅ ADD THIS

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Alnasri Dental",
  description: "Patient management system",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <SettingsProvider>
            <PatientProvider>
              <AppointmentProvider>
                <QueueProvider>
                  <PharmacyProvider>
                    {children}
                  </PharmacyProvider>
                </QueueProvider>
              </AppointmentProvider>
            </PatientProvider>
          </SettingsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}