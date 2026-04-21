"use client";

export default function SettingsPreview({ formData, neonMode }: any) {
  const cardClass = neonMode
    ? "bg-black text-cyan-100 border border-cyan-500"
    : "bg-white border";

  return (
    <div className={`mt-6 p-6 rounded-2xl ${cardClass}`}>
      <h3 className="mb-4 text-lg font-semibold">Preview</h3>

      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="opacity-70">Clinic</span>
          <span>{formData.clinicName}</span>
        </div>

        <div className="flex justify-between">
          <span className="opacity-70">Phone</span>
          <span>{formData.clinicPhone}</span>
        </div>

        <div className="flex justify-between">
          <span className="opacity-70">Address</span>
          <span className="text-right max-w-[60%]">
            {formData.clinicAddress}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="opacity-70">Discount</span>
          <span className="text-green-500 font-semibold">
            ${formData.defaultDiscount}
          </span>
        </div>
      </div>
    </div>
  );
}