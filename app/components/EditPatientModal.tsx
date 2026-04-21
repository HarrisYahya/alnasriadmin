//app/components/EditPatientModal.tsx
"use client";

import { useState, useEffect } from "react";
import { Patient, usePatients } from "../context/PatientContext";
import { servicesList } from "../lib/constants";

interface EditPatientModalProps {
  patient: Patient | null;
  onClose: () => void;
  neonMode: boolean;
}

export default function EditPatientModal({ patient, onClose, neonMode }: EditPatientModalProps) {
  const { updatePatient } = usePatients();
  const [form, setForm] = useState<Partial<Patient>>({});
  const [showServices, setShowServices] = useState(false);

  useEffect(() => {
    if (patient) {
      setForm({
        name: patient.name,
        phone: patient.phone,
        services: patient.services,
        location: patient.location,
        fee: patient.fee,
        discount: patient.discount,
        total: patient.total,
        amount_paid: patient.amount_paid || 0,
        datetime: patient.datetime,
      });
    }
  }, [patient]);

  const toggleService = (serviceName: string) => {
    let newServices;
    if (form.services?.includes(serviceName)) {
      newServices = form.services.filter((s: string) => s !== serviceName);
    } else {
      newServices = [...(form.services || []), serviceName];
    }
    // Recalculate fee and total
    const fee = newServices.reduce((sum: number, s: string) => {
      const service = servicesList.find((sv) => sv.name === s);
      return sum + (service?.fee || 0);
    }, 0);
    const total = fee - (form.discount || 0);
    setForm({
      ...form,
      services: newServices,
      fee,
      total: total < 0 ? 0 : total,
    });
  };

  const handleDiscountChange = (discount: number) => {
    const total = (form.fee || 0) - discount;
    setForm({
      ...form,
      discount,
      total: total < 0 ? 0 : total,
    });
  };

  const handleAmountPaidChange = (amount: number) => {
    setForm({ ...form, amount_paid: amount });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name?.trim() || !patient?.id) return;
    await updatePatient(patient.id, form);
    onClose();
  };

  const inputClass = neonMode
    ? "w-full border border-cyan-500/30 rounded-xl p-3 bg-gray-950/80 text-cyan-100 placeholder:text-gray-500 focus:bg-black focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/50 transition outline-none"
    : "w-full border border-amber-200 rounded-xl p-3 bg-white text-gray-700 placeholder:text-gray-400 focus:bg-white focus:border-amber-400 focus:ring-2 focus:ring-amber-200/50 transition outline-none shadow-sm";

  const labelClass = neonMode
    ? "text-xs uppercase tracking-wider font-semibold text-cyan-400"
    : "text-xs uppercase tracking-wider font-semibold text-amber-600";

  if (!patient) return null;

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 p-4 ${
        neonMode ? "bg-black/70 backdrop-blur-md" : "bg-white/80 backdrop-blur-sm"
      }`}
      onClick={onClose}
    >
      <div
        className={`rounded-3xl shadow-2xl w-full max-w-2xl p-5 md:p-7 max-h-[90vh] overflow-y-auto ${
          neonMode
            ? "bg-black/90 shadow-[0_0_40px_rgba(0,255,255,0.4)] border border-cyan-500/50"
            : "bg-white shadow-xl border border-amber-100"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={`flex justify-between items-center pb-3 mb-4 ${
            neonMode ? "border-b border-cyan-500/30" : "border-b border-amber-100"
          }`}
        >
          <h2 className={`text-xl md:text-2xl font-light ${neonMode ? "text-cyan-300" : "text-gray-800"}`}>
            ✏️ Edit Patient
          </h2>
          <button
            onClick={onClose}
            className={`text-3xl leading-5 transition ${
              neonMode ? "text-gray-400 hover:text-cyan-400" : "text-gray-400 hover:text-amber-500"
            }`}
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Full Name</label>
              <input
                type="text"
                className={inputClass}
                value={form.name || ""}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
            <div>
              <label className={labelClass}>Phone</label>
              <input
                type="text"
                className={inputClass}
                value={form.phone || ""}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>
            <div>
              <label className={labelClass}>Location</label>
              <input
                type="text"
                className={inputClass}
                value={form.location || ""}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
              />
            </div>
            <div>
              <label className={labelClass}>Date & Time</label>
              <input
                type="datetime-local"
                className={inputClass}
                value={form.datetime || ""}
                onChange={(e) => setForm({ ...form, datetime: e.target.value })}
              />
            </div>
          </div>

          {/* Services */}
          <div>
            <label className={`${labelClass} flex justify-between`}>
              <span>Services</span>
              <span className={neonMode ? "text-purple-400" : "text-amber-500"}>
                {form.services?.length || 0} selected
              </span>
            </label>
            <button
              type="button"
              onClick={() => setShowServices(true)}
              className={`w-full flex justify-between items-center rounded-xl p-3 mt-1 ${
                neonMode
                  ? "border border-cyan-500/30 bg-gray-950/80 hover:bg-cyan-950/40"
                  : "border border-amber-200 bg-white hover:bg-amber-50/50"
              }`}
            >
              <span className={neonMode ? "text-cyan-300" : "text-gray-700"}>
                {form.services?.length
                  ? form.services.slice(0, 2).join(", ") + (form.services.length > 2 ? ` +${form.services.length - 2} more` : "")
                  : "Select services"}
              </span>
              <span className={neonMode ? "text-cyan-400" : "text-amber-500"}>→</span>
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className={labelClass}>Fee (Subtotal)</label>
              <div className={`w-full rounded-xl p-3 ${neonMode ? "bg-gray-900/80 text-cyan-300" : "bg-amber-50/30 text-gray-700"}`}>
                ${form.fee || 0}
              </div>
            </div>
            <div>
              <label className={labelClass}>Discount</label>
              <input
                type="number"
                className={inputClass}
                value={form.discount || 0}
                onChange={(e) => handleDiscountChange(Number(e.target.value))}
              />
            </div>
            <div>
              <label className={labelClass}>Total</label>
              <div className={`w-full rounded-xl p-3 font-bold ${neonMode ? "text-purple-300" : "text-amber-800"}`}>
                ${form.total || 0}
              </div>
            </div>
            <div>
              <label className={labelClass}>Amount Paid</label>
              <input
                type="number"
                className={inputClass}
                value={form.amount_paid || 0}
                onChange={(e) => handleAmountPaidChange(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className={`px-5 py-2 rounded-xl transition ${
                neonMode ? "bg-gray-800 hover:bg-gray-700 text-gray-300" : "bg-gray-200 hover:bg-gray-300 text-gray-700"
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-5 py-2 rounded-xl transition ${
                neonMode
                  ? "bg-cyan-600 hover:bg-cyan-700 text-white"
                  : "bg-amber-500 hover:bg-amber-600 text-white"
              }`}
            >
              Save Changes
            </button>
          </div>
        </form>

        {/* Services Popup */}
        {showServices && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className={`rounded-2xl max-w-md w-full p-5 ${neonMode ? "bg-black/90 border border-cyan-500/50" : "bg-white border border-amber-100"}`}>
              <h3 className="text-lg font-semibold mb-3">Select Services</h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {servicesList.map((s: { name: string; fee: number }) => (
                  <label key={s.name} className="flex items-center justify-between p-2 cursor-pointer">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={form.services?.includes(s.name) || false}
                        onChange={() => toggleService(s.name)}
                        className={`w-4 h-4 ${neonMode ? "accent-cyan-500" : "accent-amber-500"}`}
                      />
                      <span>{s.name}</span>
                    </div>
                    <span>${s.fee}</span>
                  </label>
                ))}
              </div>
              <button
                onClick={() => setShowServices(false)}
                className="mt-4 w-full py-2 rounded-lg bg-cyan-600 text-white"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}