import React from 'react'
import { useTable } from '../../Components/Models/useTable'

const Users = () => {

  const attributes = [
    // { id: "_id", label: "User Id" },
    { id: "name", label: "Name" },
     { id: "userId", label: "User Id" },
    { id: "email", label: "Email" },
    // { id: "password", label: "Password" },
    { id: "role.name", label: "Role" },
    { id: "status", label: "Status" },
  ];

  const { tableUI } = useTable({
    attributes,
    // pageData: userData,
    tableType: "Users"
  });

  return <div>{tableUI}</div>;
};

export default Users;
