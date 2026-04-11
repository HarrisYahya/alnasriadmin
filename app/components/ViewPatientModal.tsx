"use client";

import { Patient } from "../context/PatientContext";

interface ViewPatientModalProps {
  patient: Patient | null;
  onClose: () => void;
  neonMode: boolean;
}

export default function ViewPatientModal({ patient, onClose, neonMode }: ViewPatientModalProps) {
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
            📋 Patient Details
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

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoItem label="Full Name" value={patient.name} neonMode={neonMode} />
            <InfoItem label="Phone" value={patient.phone || "—"} neonMode={neonMode} />
            <InfoItem label="Location" value={patient.location || "—"} neonMode={neonMode} />
            <InfoItem label="Date & Time" value={patient.datetime ? new Date(patient.datetime).toLocaleString() : "—"} neonMode={neonMode} />
          </div>

          <div>
            <h3 className={`font-semibold mb-2 ${neonMode ? "text-cyan-400" : "text-amber-600"}`}>Services</h3>
            <div className="flex flex-wrap gap-2">
              {patient.services.length === 0 ? (
                <span className="text-gray-400">No services selected</span>
              ) : (
                patient.services.map((s, idx) => (
                  <span
                    key={idx}
                    className={`text-xs px-3 py-1 rounded-full ${
                      neonMode
                        ? "bg-cyan-950/60 text-cyan-300 border border-cyan-500/50"
                        : "bg-amber-50 text-amber-700 border border-amber-200"
                    }`}
                  >
                    {s}
                  </span>
                ))
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <InfoItem label="Fee (Subtotal)" value={`$${patient.fee}`} neonMode={neonMode} />
            <InfoItem label="Discount" value={`$${patient.discount}`} neonMode={neonMode} />
            <InfoItem label="Total" value={`$${patient.total}`} neonMode={neonMode} />
            <InfoItem label="Amount Paid" value={`$${patient.amount_paid || 0}`} neonMode={neonMode} />
            <InfoItem label="Remaining Balance" value={`$${patient.balance_remaining ?? patient.total - (patient.amount_paid || 0)}`} neonMode={neonMode} />
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className={`px-6 py-2 rounded-xl font-medium transition ${
              neonMode
                ? "bg-cyan-600 hover:bg-cyan-700 text-white"
                : "bg-amber-500 hover:bg-amber-600 text-white"
            }`}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function InfoItem({ label, value, neonMode }: { label: string; value: string; neonMode: boolean }) {
  return (
    <div>
      <p className={`text-xs uppercase tracking-wider font-semibold ${neonMode ? "text-cyan-400" : "text-amber-600"}`}>
        {label}
      </p>
      <p className={`mt-1 font-medium ${neonMode ? "text-cyan-100" : "text-gray-800"}`}>{value}</p>
    </div>
  );
}