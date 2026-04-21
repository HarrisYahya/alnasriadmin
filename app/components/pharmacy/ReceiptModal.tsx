"use client";

export default function ReceiptModal({ sale, onClose }: any) {
  if (!sale) return null;

  const total = sale.quantity * sale.price;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-white text-black p-6 rounded-xl w-80">

        <h2 className="text-center font-bold text-lg">
          ALNASRI CLINIC
        </h2>

        <div className="border-t border-dashed my-2"></div>

        <p>Item: {sale.name}</p>
        <p>Qty: {sale.quantity}</p>
        <p>Price: ${sale.price}</p>

        <div className="border-t border-dashed my-2"></div>

        <p className="font-bold">Total: ${total}</p>

        <div className="border-t border-dashed my-2"></div>

        <p className="text-xs">
          {new Date().toLocaleString()}
        </p>

        <div className="flex gap-2 mt-4">
          <button
            onClick={handlePrint}
            className="flex-1 bg-cyan-600 text-white p-2 rounded"
          >
            Print
          </button>

          <button
            onClick={onClose}
            className="flex-1 bg-gray-400 text-black p-2 rounded"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}