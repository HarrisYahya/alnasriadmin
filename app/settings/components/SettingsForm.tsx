"use client";

export default function SettingsForm({
  formData,
  setFormData,
  neonMode,
  onSave,
  onDeleteClick,
}: any) {
  const inputClass = neonMode
    ? "w-full p-3 bg-black text-cyan-100 border border-cyan-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400"
    : "w-full p-3 bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400";

  const cardClass = neonMode
    ? "bg-black text-cyan-100 border border-cyan-500"
    : "bg-white border";

  return (
    <div className={`mt-6 p-6 rounded-2xl ${cardClass}`}>
      <h2 className="mb-6 text-lg font-semibold">Settings</h2>

      <div className="grid md:grid-cols-2 gap-5">
        {/* Theme */}
        <div>
          <label className="block mb-2 opacity-80">Theme</label>

          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                checked={formData.theme === "neon"}
                onChange={() =>
                  setFormData({ ...formData, theme: "neon" })
                }
              />
              Neon
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                checked={formData.theme === "white"}
                onChange={() =>
                  setFormData({ ...formData, theme: "white" })
                }
              />
              White
            </label>
          </div>
        </div>

        {/* Discount */}
        <div>
          <label className="block mb-2 opacity-80">Default Discount</label>
          <input
            type="number"
            className={inputClass}
            value={formData.defaultDiscount}
            onChange={(e) =>
              setFormData({
                ...formData,
                defaultDiscount: Number(e.target.value),
              })
            }
          />
        </div>

        {/* Name */}
        <div>
          <label className="block mb-2 opacity-80">Clinic Name</label>
          <input
            className={inputClass}
            value={formData.clinicName}
            onChange={(e) =>
              setFormData({ ...formData, clinicName: e.target.value })
            }
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block mb-2 opacity-80">Phone</label>
          <input
            className={inputClass}
            value={formData.clinicPhone}
            onChange={(e) =>
              setFormData({ ...formData, clinicPhone: e.target.value })
            }
          />
        </div>

        {/* Address */}
        <div className="md:col-span-2">
          <label className="block mb-2 opacity-80">Address</label>
          <input
            className={inputClass}
            value={formData.clinicAddress}
            onChange={(e) =>
              setFormData({ ...formData, clinicAddress: e.target.value })
            }
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4 mt-8">
        <button
          onClick={onSave}
          className="bg-blue-600 hover:bg-blue-700 transition text-white px-5 py-2 rounded-xl"
        >
          Save Settings
        </button>

        <button
          onClick={onDeleteClick}
          className="bg-red-600 hover:bg-red-700 transition text-white px-5 py-2 rounded-xl"
        >
          Delete All Patients
        </button>
      </div>
    </div>
  );
}