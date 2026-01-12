import React from "react";
import { useTable } from "../../Components/Models/useTable";

const Customer = () => {
  // 🔹 Table Columns / Attributes
  const attributes = [
    { id: "productName", label: "Product Name" },
    { id: "productId", label: "Product ID" },
    { id: "category", label: "Category" },
    { id: "status", label: "Status" },
    { id: "description", label: "Description" },
  ];

  const { tableUI } = useTable({
    attributes,
    tableType: "Customer",
  });

  return <div>{tableUI}</div>;
};

export default Customer;
