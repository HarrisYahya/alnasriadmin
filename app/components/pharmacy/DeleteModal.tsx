"use client";

export default function DeleteModal({ item, onClose, onConfirm }: any) {
  if (!item) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-gray-900 p-6 rounded-xl w-80 text-white border border-red-500/30">

        <h2 className="text-red-400 text-lg mb-3">
          Delete Item
        </h2>

        <p className="mb-4 text-sm">
          Are you sure you want to delete <b>{item.name}</b>?
        </p>

        <div className="flex gap-2">

          <button
            onClick={() => onConfirm(item.id)}
            className="flex-1 bg-red-600 p-2 rounded"
          >
            Delete
          </button>

          <button
            onClick={onClose}
            className="flex-1 bg-gray-600 p-2 rounded"
          >
            Cancel
          </button>

        </div>

      </div>
    </div>
  );
}