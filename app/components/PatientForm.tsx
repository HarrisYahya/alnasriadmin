//app/components/PatientForm.tsx
"use client";

import { servicesList } from "../lib/constants";

interface PatientFormProps {
  form: any;
  setForm: React.Dispatch<React.SetStateAction<any>>;
  showServices: boolean;
  setShowServices: (show: boolean) => void;
  toggleService: (service: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  neonMode: boolean;
  onDiscountChange: (discount: number) => void;
  onAmountPaidChange?: (amount: number) => void;
  isSubmitting?: boolean;
}

export default function PatientForm({
  form,
  setForm,
  showServices,
  setShowServices,
  toggleService,
  handleSubmit,
  neonMode,
  onDiscountChange,
  onAmountPaidChange,
  isSubmitting = false,
}: PatientFormProps) {
  const inputClass = neonMode
    ? "w-full border border-cyan-500/30 rounded-xl p-3 bg-gray-950/80 text-cyan-100 placeholder:text-gray-500 focus:bg-black focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/50 transition outline-none"
    : "w-full border border-amber-200 rounded-xl p-3 bg-white text-gray-700 placeholder:text-gray-400 focus:bg-white focus:border-amber-400 focus:ring-2 focus:ring-amber-200/50 transition outline-none shadow-sm";

  const labelClass = neonMode
    ? "text-xs uppercase tracking-wider font-semibold text-cyan-400"
    : "text-xs uppercase tracking-wider font-semibold text-amber-600";

  return (
    <form
      onSubmit={handleSubmit}
      className={`rounded-2xl p-5 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 transition-all duration-300 ${
        neonMode
          ? "bg-black/60 backdrop-blur-md shadow-[0_0_25px_rgba(0,255,255,0.2)] border border-cyan-500/40 hover:shadow-[0_0_35px_rgba(0,255,255,0.4)]"
          : "bg-white/90 backdrop-blur-sm shadow-xl border border-amber-100 hover:shadow-2xl"
      }`}
    >
      {/* Name */}
      <div className="space-y-1">
        <label className={labelClass}>Full name</label>
        <input
          type="text"
          placeholder="Abukar mohamed adan"
          className={inputClass}
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
      </div>

      {/* Phone */}
      <div className="space-y-1">
        <label className={labelClass}>Phone</label>
        <input
          type="text"
          placeholder="+252619355156"
          className={inputClass}
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
      </div>

      {/* Location */}
      <div className="space-y-1">
        <label className={labelClass}>Location</label>
        <input
          type="text"
          placeholder={neonMode ? "Dharkiinlay" : "Harris"}
          className={inputClass}
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
        />
      </div>

      {/* Date & Time */}
      <div className="space-y-1">
        <label className={labelClass}>Date & Time</label>
        <input
          type="datetime-local"
          className={inputClass}
          value={form.datetime}
          onChange={(e) => setForm({ ...form, datetime: e.target.value })}
        />
      </div>

      {/* Services selection button */}
      <div className="space-y-1 md:col-span-2">
        <label className={`${labelClass} flex justify-between`}>
          <span>Treatments & Services</span>
          <span className={neonMode ? "text-purple-400 text-xs" : "text-amber-500 text-xs"}>
            {form.services.length} selected
          </span>
        </label>
        <button
          type="button"
          onClick={() => setShowServices(true)}
          className={`w-full flex justify-between items-center rounded-xl p-3 transition group ${
            neonMode
              ? "border border-cyan-500/30 bg-gray-950/80 hover:bg-cyan-950/40"
              : "border border-amber-200 bg-white hover:bg-amber-50/50 shadow-sm"
          }`}
        >
          <span
            className={
              form.services.length === 0
                ? neonMode ? "text-gray-400" : "text-gray-500"
                : neonMode ? "text-cyan-300 font-medium truncate" : "text-gray-800 font-medium truncate"
            }
          >
            {form.services.length === 0
              ? neonMode ? "➕ Select neon services" : "➕ Select premium services"
              : form.services.slice(0, 2).join(", ") +
                (form.services.length > 2 ? ` +${form.services.length - 2} more` : "")}
          </span>
          <span className={neonMode ? "text-cyan-400 group-hover:translate-x-1 transition" : "text-amber-500 group-hover:translate-x-1 transition"}>
            →
          </span>
        </button>
        {form.services.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {form.services.slice(0, 4).map((s: string) => (
              <span
                key={s}
                className={`text-xs px-3 py-1 rounded-full ${
                  neonMode
                    ? "bg-cyan-950/60 text-cyan-300 border border-cyan-500/50 shadow-[0_0_5px_#0ff]"
                    : "bg-amber-50 text-amber-700 border border-amber-200 shadow-sm"
                }`}
              >
                {s}
              </span>
            ))}
            {form.services.length > 4 && (
              <span className={`text-xs px-3 py-1 rounded-full ${neonMode ? "bg-gray-800 text-gray-400" : "bg-gray-100 text-gray-500"}`}>
                +{form.services.length - 4}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Discount */}
      <div className="space-y-1">
        <label className={labelClass}>Discount ($)</label>
        <input
          type="number"
          placeholder="0"
          className={inputClass}
          value={form.discount}
          onChange={(e) => onDiscountChange(Number(e.target.value))}
        />
      </div>

      {/* Subtotal */}
      <div className="space-y-1">
        <label className={labelClass}>Subtotal (Fee)</label>
        <div className={`w-full rounded-xl p-3 font-mono ${
          neonMode
            ? "border border-cyan-500/20 bg-gray-900/80 text-cyan-300 shadow-inner"
            : "border border-amber-100 bg-amber-50/30 text-gray-700"
        }`}>
          ${form.fee}
        </div>
      </div>

      {/* Total */}
      <div className="space-y-1">
        <label className={labelClass}>Total after discount</label>
        <div className={`w-full rounded-xl p-3 font-bold text-lg ${
          neonMode
            ? "border border-purple-500/50 bg-purple-950/30 text-purple-300 shadow-[0_0_8px_#a0f]"
            : "border border-amber-300 bg-amber-50 text-amber-800"
        }`}>
          ${form.total}
        </div>
      </div>

      {/* Amount Paid */}
      <div className="space-y-1">
        <label className={labelClass}>Amount Paid ($)</label>
        <input
          type="number"
          placeholder="0"
          className={inputClass}
          value={form.amount_paid || 0}
          onChange={(e) => {
            const val = Number(e.target.value);
            setForm({ ...form, amount_paid: val });
            if (onAmountPaidChange) onAmountPaidChange(val);
          }}
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className={`md:col-span-2 font-semibold py-3.5 rounded-xl transition transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 ${
          isSubmitting ? "opacity-50 cursor-not-allowed" : ""
        } ${
          neonMode
            ? "bg-linear-to-r from-cyan-600 to-purple-600 text-white shadow-[0_0_12px_#0ff] hover:shadow-[0_0_20px_#0ff]"
            : "bg-linear-to-r from-amber-500 to-amber-700 text-white shadow-md hover:shadow-lg"
        }`}
      >
        <span>{isSubmitting ? "✨ Saving..." : "✨ Register Patient"}</span>
      </button>
    </form>
  );
}