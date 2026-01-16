import React from "react";
import { useTable } from "../../Components/Models/useTable";

const Users = () => {
  const attributes = [
    { id: "name", label: "Admin Name" },
    { id: "email", label: "Email" },
    { id: "role", label: "Role" },
    { id: "isActive", label: "Status" },
    { id: "createdAt", label: "Created At" },
  ];

  const { tableUI } = useTable({ attributes, tableType: "Users" });

  return <>{tableUI}</>;
};

export default Users;
