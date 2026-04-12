"use client";

import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import PatientForm from "../components/PatientForm";
import ServicesPopup from "../components/ServicesPopup";
import { usePatients } from "../context/PatientContext";
import { useSettings } from "../context/SettingsContext";
import { servicesList } from "../lib/constants";

export default function AddPatientPage() {
  const { addPatient } = usePatients();
  const { settings } = useSettings();

  const [showServices, setShowServices] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [neonMode, setNeonMode] = useState(settings.theme === "neon");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    services: [] as string[],
    teeth: {} as Record<string, number>,
    location: "",
    fee: 0,
    discount: settings.defaultDiscount,
    total: 0,
    amount_paid: 0,
    datetime: "",
  });

  // 🧮 fee calculation
  const calculateFee = (services: string[], teethMap: Record<string, number>) => {
    return services.reduce((sum, serviceName) => {
      const service = servicesList.find((s) => s.name === serviceName);
      if (!service) return sum;

      if (service.perTooth) {
        const teeth = teethMap[serviceName] || 1;
        return sum + service.fee * teeth;
      }

      return sum + service.fee;
    }, 0);
  };

  const updateFeeAndTotal = (
    services: string[],
    teethMap: Record<string, number>,
    discount: number
  ) => {
    const fee = calculateFee(services, teethMap);
    const total = fee - discount;

    setForm((prev) => ({
      ...prev,
      fee,
      total: total < 0 ? 0 : total,
    }));
  };

  // ➕ toggle service
  const toggleService = (serviceName: string) => {
    let newServices;

    if (form.services.includes(serviceName)) {
      newServices = form.services.filter((s) => s !== serviceName);
    } else {
      newServices = [...form.services, serviceName];
    }

    setForm((prev) => ({
      ...prev,
      services: newServices,
    }));

    updateFeeAndTotal(newServices, form.teeth, form.discount);
  };

  // 🦷 update teeth count (used by popup)
  const updateTeeth = (serviceName: string, count: number) => {
    const newTeeth = {
      ...form.teeth,
      [serviceName]: count,
    };

    setForm((prev) => ({
      ...prev,
      teeth: newTeeth,
    }));

    updateFeeAndTotal(form.services, newTeeth, form.discount);
  };

  const handleDiscountChange = (discount: number) => {
    setForm({ ...form, discount });
    updateFeeAndTotal(form.services, form.teeth, discount);
  };

  const handleAmountPaidChange = (amount: number) => {
    setForm({ ...form, amount_paid: amount });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || isSubmitting) return;

    setIsSubmitting(true);

    let formattedDateTime = form.datetime;
    if (formattedDateTime) {
      formattedDateTime = new Date(formattedDateTime).toISOString();
    }

    // ❌ remove teeth before sending to Supabase
    const { teeth, ...rest } = form;

    const patientData = {
      ...rest,
      datetime: formattedDateTime,
    };

    await addPatient(patientData);
    setIsSubmitting(false);

    setForm({
      name: "",
      phone: "",
      services: [],
      teeth: {},
      location: "",
      fee: 0,
      discount: settings.defaultDiscount,
      total: 0,
      amount_paid: 0,
      datetime: "",
    });
  };

  return (
    <div
      className={`flex flex-col md:flex-row min-h-screen font-sans ${
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
            neonMode ? "bg-black/60 backdrop-blur-sm" : "bg-white/80 backdrop-blur-sm"
          }`}
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <main className="flex-1 p-4 md:p-8 lg:p-10 overflow-x-auto">
        <Header
          patientsCount={0}
          neonMode={neonMode}
          setNeonMode={setNeonMode}
        />

        <div className="mb-8">
          <h1 className={`text-3xl font-light ${neonMode ? "text-cyan-300" : "text-gray-800"}`}>
            Add New Patient
          </h1>
          <p className={`mt-1 ${neonMode ? "text-gray-400" : "text-gray-500"}`}>
            Fill in the details below to register a patient.
          </p>
        </div>

        <PatientForm
          form={form}
          setForm={setForm}
          showServices={showServices}
          setShowServices={setShowServices}
          toggleService={toggleService}
          handleSubmit={handleSubmit}
          neonMode={neonMode}
          onDiscountChange={handleDiscountChange}
          onAmountPaidChange={handleAmountPaidChange}
          isSubmitting={isSubmitting}
        />

        <ServicesPopup
          showServices={showServices}
          setShowServices={setShowServices}
          selectedServices={form.services}
          toggleService={toggleService}
          neonMode={neonMode}
          updateTeeth={updateTeeth}   // ✅ ONLY REQUIRED PROP
        />
      </main>
    </div>
  );
}