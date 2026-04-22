//app/components/pharmacy/PharmacyTable.tsx
"use client";

import { useSettings } from "../../context/SettingsContext";

export default function PharmacyTable({
  items,
  handleEdit,
  handleDelete,
  sellItem,
}: any) {
  const { settings } = useSettings();
  const isNeon = settings.theme === "neon";

  return (
    <div
      className={`
        rounded-2xl overflow-hidden border
        ${
          isNeon
            ? "bg-black/40 border-cyan-500/30 text-white"
            : "bg-white border-gray-200 text-black"
        }
      `}
    >
      <table className="w-full text-left">

        <thead
          className={isNeon ? "bg-black/60 text-cyan-300" : "bg-gray-100"}
        >
          <tr>
            <th className="p-3">Name</th>
            <th>Qty</th>
            <th>Price</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {items?.map((i: any) => (
            <tr
              key={i.id}
              className="border-t border-gray-700/20"
            >

              <td className="p-3">{i.name}</td>
              <td>{i.quantity}</td>
              <td>${i.price}</td>

              <td>
                {i.quantity === 0 ? (
                  <span className="text-red-500 text-xs">OUT</span>
                ) : i.quantity <= 5 ? (
                  <span className="text-yellow-400 text-xs">LOW</span>
                ) : (
                  <span className="text-green-400 text-xs">OK</span>
                )}
              </td>

              <td className="space-x-2 text-sm">

                <button className="text-yellow-400" onClick={() => handleEdit(i)}>
                  Edit
                </button>

                <button className="text-red-400" onClick={() => handleDelete(i)}>
                  Delete
                </button>

                <button className="text-cyan-300" onClick={() => sellItem(i)}>
                  Sell
                </button>

              </td>

            </tr>
          ))}
        </tbody>

      </table>
    </div>
  );
}