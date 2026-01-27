import React from "react";
import { useTable } from "../../Components/Models/useTable";

const Inventory = () => {
  // 🔹 Table Columns / Attributes
 const attributes = [
    { id: "product.name", label: "Product Name" },
    { id: "color.name", label: "Color" },
    { id: "size", label: "Size" },
    { id: "sku", label: "SKU" },
    { id: "price.PKR", label: "Price" },
    { id: "discount", label: "Discount (%)" },
    { id: "finalPrice.PKR", label: "Final Price" },
    { id: "stock", label: "Stock" },
    { id: "published", label: "Status" },
  ];

  const { tableUI } = useTable({
    attributes,
    tableType: "Inventory",
  });

  return <div>{tableUI}</div>;
};

export default Inventory;

