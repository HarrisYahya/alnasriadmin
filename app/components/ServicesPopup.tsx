"use client";

import { servicesList } from "../lib/constants";

interface ServicesPopupProps {
  showServices: boolean;
  setShowServices: (show: boolean) => void;
  selectedServices: string[];
  toggleService: (service: string) => void;
  neonMode: boolean;

  // 🦷 added for teeth logic
  updateTeeth: (service: string, count: number) => void;
}

export default function ServicesPopup({
  showServices,
  setShowServices,
  selectedServices,
  toggleService,
  neonMode,
  updateTeeth,
}: ServicesPopupProps) {
  if (!showServices) return null;

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 p-4 ${
        neonMode
          ? "bg-black/70 backdrop-blur-md"
          : "bg-white/80 backdrop-blur-sm"
      }`}
    >
      <div
        className={`rounded-3xl shadow-2xl w-full max-w-lg p-5 md:p-7 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto ${
          neonMode
            ? "bg-black/90 shadow-[0_0_40px_rgba(0,255,255,0.4)] border border-cyan-500/50"
            : "bg-white shadow-xl border border-amber-100"
        }`}
      >
        <div
          className={`flex justify-between items-center pb-3 mb-4 ${
            neonMode
              ? "border-b border-cyan-500/30"
              : "border-b border-amber-100"
          }`}
        >
          <h2
            className={`text-xl md:text-2xl font-light ${
              neonMode ? "text-cyan-300" : "text-gray-800"
            }`}
          >
            ✦{" "}
            <span
              className={
                neonMode
                  ? "font-semibold text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-purple-400"
                  : "font-semibold text-amber-600"
              }
            >
              Select Services
            </span>
          </h2>

          <button
            onClick={() => setShowServices(false)}
            className={`text-3xl leading-5 transition ${
              neonMode
                ? "text-gray-400 hover:text-cyan-400"
                : "text-gray-400 hover:text-amber-500"
            }`}
          >
            &times;
          </button>
        </div>

        <div className="space-y-3 max-h-80 overflow-y-auto pr-1 custom-scroll">
          {servicesList.map((s: any) => {
            const selected = selectedServices.includes(s.name);

            return (
              <div
                key={s.name}
                className={`p-3 rounded-xl border transition-all ${
                  neonMode
                    ? "border-cyan-500/30 hover:bg-cyan-950/40"
                    : "border-amber-100 hover:bg-amber-50/50"
                }`}
              >
                {/* SERVICE ROW */}
                <label className="flex flex-wrap items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={() => toggleService(s.name)}
                      className={`w-5 h-5 rounded ${
                        neonMode ? "accent-cyan-500" : "accent-amber-500"
                      }`}
                    />
                    <span
                      className={`font-medium ${
                        neonMode ? "text-cyan-100" : "text-gray-700"
                      }`}
                    >
                      {s.name}
                    </span>
                  </div>

                  <span
                    className={`font-mono ${
                      neonMode ? "text-purple-400" : "text-amber-600"
                    }`}
                  >
                    ${s.fee} {s.perTooth && "/tooth"}
                  </span>
                </label>

                {/* 🦷 TEETH INPUT (ONLY FOR PER TOOTH SERVICES) */}
                {selected && s.perTooth && (
                  <div className="mt-3 flex items-center justify-between">
                    <span
                      className={`text-sm ${
                        neonMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      Teeth count
                    </span>

                    <input
                      type="number"
                      min="1"
                      defaultValue={1}
                      className={`w-20 text-center rounded-lg p-1 border ${
                        neonMode
                          ? "bg-black border-cyan-500/30 text-cyan-200"
                          : "bg-white border-amber-200 text-gray-700"
                      }`}
                      onChange={(e) =>
                        updateTeeth(s.name, Number(e.target.value))
                      }
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <button
          onClick={() => setShowServices(false)}
          className={`mt-6 w-full py-3 rounded-xl font-semibold transition ${
            neonMode
              ? "bg-linear-to-r from-cyan-600 to-purple-600 text-white shadow-[0_0_12px_#0ff] hover:shadow-[0_0_20px_#0ff]"
              : "bg-linear-to-r from-amber-500 to-amber-700 text-white shadow-md hover:shadow-lg"
          }`}
        >
          Apply & Close
        </button>
      </div>

      {/* SCROLL STYLE (UNCHANGED) */}
      <style jsx>{`
        .custom-scroll::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scroll::-webkit-scrollbar-track {
          background: ${neonMode ? "#0a0a1f" : "#fef3c7"};
          border-radius: 10px;
        }
        .custom-scroll::-webkit-scrollbar-thumb {
          background: ${neonMode ? "#0ff" : "#f59e0b"};
          border-radius: 10px;
          ${neonMode
            ? "box-shadow: 0 0 5px #0ff;"
            : "box-shadow: 0 0 2px #f59e0b;"}
        }
        @keyframes zoom-in-95 {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-in {
          animation: zoom-in-95 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}