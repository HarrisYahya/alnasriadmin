//app/settings/components/ConfirmDelete.tsx
export default function ConfirmDelete({
  open,
  count,
  onCancel,
  onConfirm,
  neonMode,
}: any) {
  if (!open) return null;

  return (
    <div className="mt-6 p-4 border border-red-500 rounded-xl">
      <p>Delete {count} patients?</p>

      <div className="flex gap-3 mt-2">
        <button onClick={onConfirm} className="bg-red-600 text-white px-3">
          Yes
        </button>

        <button onClick={onCancel} className="bg-gray-500 text-white px-3">
          Cancel
        </button>
      </div>
    </div>
  );
}