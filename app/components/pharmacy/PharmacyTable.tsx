"use client";

export default function PharmacyTable({
  items,
  handleEdit,
  handleDelete,
  sellItem,
}: any) {
  return (
    <div className="rounded-2xl border border-cyan-500/30 overflow-hidden">

      <table className="w-full text-left">

        <thead className="bg-black/60 text-cyan-400">
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
            <tr key={i.id} className="border-t border-gray-800">

              {/* NAME */}
              <td className="p-3">{i.name}</td>

              {/* QTY */}
              <td>{i.quantity}</td>

              {/* PRICE */}
              <td>${i.price}</td>

              {/* STATUS */}
              <td>
                {i.quantity === 0 ? (
                  <span className="text-red-500 text-xs font-bold">
                    OUT
                  </span>
                ) : i.quantity <= 5 ? (
                  <span className="text-red-400 text-xs">
                    LOW
                  </span>
                ) : (
                  <span className="text-green-400 text-xs">
                    OK
                  </span>
                )}
              </td>

              {/* ACTIONS */}
              <td className="space-x-2">

                <button
                  onClick={() => handleEdit(i)}
                  className="text-yellow-400"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(i)}
                  className="text-red-400"
                >
                  Delete
                </button>

                <button
                  onClick={() => sellItem(i)}
                  className="text-cyan-300"
                >
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