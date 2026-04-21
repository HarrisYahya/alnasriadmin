"use client";

export default function PharmacyHeader({ signOut, totalValue }: any) {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-3xl text-cyan-300 font-light">
        Pharmacy Inventory
      </h1>

      <div className="flex gap-4 items-center">
        <div className="text-sm text-cyan-300">
          Total Value: ${totalValue}
        </div>

        <button
          onClick={signOut}
          className="bg-red-500 px-4 py-2 rounded-xl"
        >
          Logout
        </button>
      </div>
    </div>
  );
}