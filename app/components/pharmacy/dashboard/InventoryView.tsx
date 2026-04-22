"use client";

import PharmacySearch from "../PharmacySearch";
import PharmacyForm from "../PharmacyForm";
import PharmacyTable from "../PharmacyTable";

export default function InventoryView({
  search,
  setSearch,
  name,
  setName,
  qty,
  setQty,
  price,
  setPrice,
  handleSave,
  loading,
  filteredItems,
  setEditItemData,
  setDeleteItemData,
  setSellItemData,
}: any) {
  return (
    <>
      <PharmacySearch search={search} setSearch={setSearch} />

      <PharmacyForm
        name={name}
        setName={setName}
        qty={qty}
        setQty={setQty}
        price={price}
        setPrice={setPrice}
        handleSave={handleSave}
        loading={loading}
      />

      <div className="w-full overflow-x-auto">
        <PharmacyTable
          items={filteredItems}
          handleEdit={setEditItemData}
          handleDelete={setDeleteItemData}
          sellItem={setSellItemData}
        />
      </div>
    </>
  );
}