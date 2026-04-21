"use client";

export default function DeleteModal({ item, onClose, onConfirm }: any) {
  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md">

      {/* CARD */}
      <div className="w-[90%] max-w-sm rounded-2xl border border-red-500/30 bg-white/5 backdrop-blur-xl shadow-2xl shadow-red-500/10 p-6 text-white animate-in fade-in zoom-in duration-200">

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center text-red-400">
            ⚠
          </div>

          <h2 className="text-lg font-semibold text-red-300">
            Delete Item
          </h2>
        </div>

        <p className="text-sm text-gray-300 mb-6 leading-relaxed">
          Are you sure you want to delete{" "}
          <span className="text-white font-medium">{item.name}</span>?
          <br />
          This action cannot be undone.
        </p>

        <div className="flex gap-3">

          <button
            onClick={() => onConfirm(item.id)}
            className="flex-1 py-2 rounded-xl bg-red-600/80 hover:bg-red-500 transition shadow-lg shadow-red-500/20"
          >
            Delete
          </button>

          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition border border-white/10"
          >
            Cancel
          </button>

        </div>

      </div>
    </div>
  );
}