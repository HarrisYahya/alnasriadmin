//app/components/PatientsTable.tsx
"use client";

import { Patient } from "../context/PatientContext";

interface PatientsTableProps {
  patients: Patient[];
  neonMode: boolean;
  onView: (patient: Patient) => void;
  onEdit: (patient: Patient) => void;
  onDelete: (patient: Patient) => void;
}

export default function PatientsTable({ patients, neonMode, onView, onEdit, onDelete }: PatientsTableProps) {
  const tagClass = neonMode
    ? "bg-cyan-950/60 text-cyan-300 text-xs px-2 py-0.5 rounded-full border border-cyan-500/40"
    : "bg-amber-50 text-amber-700 text-xs px-2 py-0.5 rounded-full border border-amber-200";
  const moreClass = neonMode ? "text-xs text-gray-400" : "text-xs text-gray-500";

  return (
    <div className={`mt-8 md:mt-12 rounded-2xl overflow-hidden ${
      neonMode
        ? "bg-black/60 backdrop-blur-md shadow-[0_0_25px_rgba(0,255,255,0.2)] border border-cyan-500/40"
        : "bg-white/90 backdrop-blur-sm shadow-xl border border-amber-100"
    }`}>
      <div className={`px-4 md:px-6 py-4 md:py-5 border-b ${
        neonMode ? "border-cyan-500/30 bg-cyan-950/20" : "border-amber-100 bg-amber-50/30"
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h3 className={`font-semibold text-lg md:text-xl tracking-wide ${neonMode ? "text-cyan-300" : "text-gray-800"}`}>
            📋 Recent Appointments
          </h3>
          <div className={`text-sm ${neonMode ? "text-purple-400 font-mono" : "text-amber-600"}`}>
            {patients.length} total records
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left min-w-160">
          <thead className={`text-xs md:text-sm font-semibold ${
            neonMode
              ? "bg-gray-950/80 text-cyan-400 border-b border-cyan-500/30"
              : "bg-gray-50 text-gray-600 border-b border-amber-100"
          }`}>
            <tr>
              <th className="p-3 md:p-4">Patient</th>
              <th className="p-3 md:p-4">Phone</th>
              <th className="p-3 md:p-4">Services</th>
              <th className="p-3 md:p-4">Total</th>
              <th className="p-3 md:p-4">Paid</th>
              <th className="p-3 md:p-4">Remaining</th>
              <th className="p-3 md:p-4">Date</th>
              <th className="p-3 md:p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((p, i) => (
              <tr key={i} className={`border-t ${
                neonMode 
                  ? "border-cyan-500/20 hover:bg-cyan-950/30" 
                  : "border-amber-50 hover:bg-amber-50/30"
              }`}>
                <td className={`p-3 md:p-4 font-medium ${neonMode ? "text-cyan-100" : "text-gray-800"}`}>{p.name}</td>
                <td className={`p-3 md:p-4 ${neonMode ? "text-gray-300" : "text-gray-600"}`}>{p.phone || "—"}</td>
                <td className={`p-3 md:p-4 ${neonMode ? "text-gray-300" : "text-gray-600"}`}>
                  <div className="flex flex-wrap gap-1">
                    {p.services.length === 0 && "—"}
                    {p.services.slice(0, 2).map((s) => (
                      <span key={s} className={tagClass}>{s}</span>
                    ))}
                    {p.services.length > 2 && (
                      <span className={moreClass}>+{p.services.length - 2}</span>
                    )}
                  </div>
                </td>
                <td className={`p-3 md:p-4 font-mono ${neonMode ? "text-cyan-300" : "text-gray-700"}`}>${p.total}</td>
                <td className={`p-3 md:p-4 font-mono ${neonMode ? "text-green-400" : "text-green-600"}`}>${p.amount_paid || 0}</td>
                <td className={`p-3 md:p-4 font-mono ${neonMode ? "text-yellow-400" : "text-amber-600"}`}>
                  ${p.balance_remaining ?? p.total - (p.amount_paid || 0)}
                </td>
                <td className={`p-3 md:p-4 text-sm ${neonMode ? "text-gray-400" : "text-gray-500"}`}>
                  {p.datetime ? new Date(p.datetime).toLocaleDateString() : "—"}
                </td>
                <td className="p-3 md:p-4 text-center">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => onView(p)}
                      className={`px-2 py-1 rounded-md text-xs transition ${
                        neonMode
                          ? "bg-blue-600/60 hover:bg-blue-600 text-white"
                          : "bg-blue-500/80 hover:bg-blue-500 text-white"
                      }`}
                      title="View"
                    >
                      👁️
                    </button>
                    <button
                      onClick={() => onEdit(p)}
                      className={`px-2 py-1 rounded-md text-xs transition ${
                        neonMode
                          ? "bg-amber-600/60 hover:bg-amber-600 text-white"
                          : "bg-amber-500/80 hover:bg-amber-500 text-white"
                      }`}
                      title="Edit"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => onDelete(p)}
                      className={`px-2 py-1 rounded-md text-xs transition ${
                        neonMode
                          ? "bg-red-600/60 hover:bg-red-600 text-white"
                          : "bg-red-500/80 hover:bg-red-500 text-white"
                      }`}
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {patients.length === 0 && (
              <tr>
                <td colSpan={8} className={`p-6 md:p-10 text-center italic ${
                  neonMode ? "text-gray-500" : "text-gray-400"
                }`}>
                  No patients yet. Register your first appointment.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}