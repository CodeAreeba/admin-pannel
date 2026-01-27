import React from "react";
import { useTable } from "../../Components/Models/useTable";

const Orders = () => { 
  const attributes = [
  { id: "orderId", label: "Order ID" },
  { id: "user.name", label: "Customer Name" },
  { id: "user.email", label: "Customer Email" },
  { id: "totalAmount", label: "Total Amount" },
  { id: "status", label: "Order Status" },
  { id: "paymentStatus", label: "Payment Status" },
  { id: "paymentMethod", label: "Payment Method" },
  { id: "createdAt", label: "Order Date" },
];

  const { tableUI } = useTable({
    attributes,
    tableType: "Orders",
  });

  return <div>{tableUI}</div>;
};

export default Orders;
