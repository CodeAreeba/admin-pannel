import React from "react";
import { useTable } from "../../Components/Models/useTable";

const Customer = () => {
  // 🔹 Table Columns / Attributes (API ke according)
  const attributes = [
     { id: "name", label: "Customer Name" },
    { id: "email", label: "Email" },
    { id: "role", label: "Role" },
    { id: "isActive", label: "Status" },
    // { id: "otpAttempts", label: "OTP Attempts" },
    { id: "createdAt", label: "Created At" },
  ];

  const { tableUI } = useTable({
    attributes,
    tableType: "Customers",
  });

  return <div>{tableUI}</div>;
};

export default Customer;
