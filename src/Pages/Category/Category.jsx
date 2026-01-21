import React from "react";
import { useTable } from "../../Components/Models/useTable";

const Category = () => {
  const attributes = [
    { id: "image", label: "Image" },
    { id: "name", label: "Name" },
    { id: "metaTitle", label: "Meta Title" },
    { id: "published", label: "Status" },
    { id: "createdAt", label: "Created At" },
  ];

  const { tableUI } = useTable({ attributes, tableType: "Categories" });

  return tableUI;
};

export default Category;
