import React from "react";
import { useTable } from "../../Components/Models/useTable";

const Product = () => {
  // Table Columns / Attributes
  const attributes = [
    { id: "image", label: "Image" },
    { id: "name", label: "Product Name" },
    { id: "subcategory.name", label: "Subcategory" },
    { id: "baseSku", label: "BaseSku" },
    { id: "published", label: "Status" },
    { id: "description", label: "Description" },
  ];

  const { tableUI } = useTable({
    attributes,
    tableType: "Products",
  });

  return <div>{tableUI}</div>;
};

export default Product;
