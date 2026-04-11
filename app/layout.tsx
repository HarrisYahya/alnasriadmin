import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { AuthProvider } from "./context/AuthContext";
import { SettingsProvider } from "./context/SettingsContext";
import { PatientProvider } from "./context/PatientContext";

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
              {children}
            </PatientProvider>
          </SettingsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}