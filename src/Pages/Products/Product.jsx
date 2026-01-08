import React from "react";
import { useTable } from "../../Components/Models/useTable";

const Products = () => {
  // 🔹 Static data (same as backend response -> products array)
  const productData = [
    {
      _id: "690de6087615f10751eec825",
      productName: "laptop",
      productId: "pro-0011",
      category: "Software",
      status: "Active",
      description: "q",
    },
    {
      _id: "690b15f0087865d09448e86b",
      productName: "abc",
      productId: "pro-0010",
      category: "Software",
      status: "Active",
      description: "hi",
    },
    {
      _id: "690b15e6087865d09448e866",
      productName: "abc",
      productId: "pro-0009",
      category: "Software",
      status: "Active",
      description: "hii",
    },
    {
      _id: "6909daa0e33c26a8a26583c1",
      productName: "charger",
      productId: "pro-0008",
      category: "License",
      status: "Active",
      description: "bad",
    },
    {
      _id: "6909a53c41726a0ecc77c172",
      productName: "charger",
      productId: "pro-0007",
      category: "Software",
      status: "Inactive",
      description: "bad",
    },
    {
      _id: "6909a52441726a0ecc77c16d",
      productName: "Hp Laptop",
      productId: "pro-0006",
      category: "Hardware",
      status: "Inactive",
      description: "N/A",
    },
    {
      _id: "6909a3f043df7634a242e3ed",
      productName: "headphones",
      productId: "pro-0004",
      category: "Software",
      status: "Active",
      description: "N/A",
    },
    {
      _id: "6909a37643df7634a242e3de",
      productName: "dell laptop",
      productId: "pro-0001",
      category: "Software",
      status: "Active",
      description: "good",
    },
  ];

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
    pageData: productData,
    tableType: "Products",
  });

  return <div>{tableUI}</div>;
};

export default Products;
