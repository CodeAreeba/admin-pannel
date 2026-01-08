import React, { useState, useEffect } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { MdOutlineDoubleArrow } from "react-icons/md";
import { IoLogOut } from "react-icons/io5";
import {
  FaTachometerAlt,
  FaUsers,
  FaWarehouse,
  FaUserShield,
} from "react-icons/fa";
import { BiSolidReport } from "react-icons/bi";
import { BsGraphUpArrow } from "react-icons/bs";
import { GiMoneyStack } from "react-icons/gi";
import { RiBillFill } from "react-icons/ri";
import { GiTakeMyMoney } from "react-icons/gi";

import "./App.css";

import Dashboard from "./Pages/Dashboard/Dashboard";
import Users from "./Pages/Users/Users";
import StockM from "./Pages/Stock M/StockM";
import Roles from "./Pages/Roles/Roles";
import logo from "./assets/BossLeathers.png";
import { Tooltip } from "@mui/material";
import ExpenseM from "./Pages/Expense/Expense";
import BillHistory from "./Pages/BillHistory/BillHistory";
import Reports from "./Components/Models/AddReports"
import SalesReport from "./Pages/SalesReport/SalesReport";
import PendingAmountPage from "./Pages/Pending Amount/PendingAmountPage";

const App = ({ onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeitems, setActiveitems] = useState(1);
  const [isOpen, setIsOpen] = useState(true);

  // 🔥 All sidebar items - Sab accessible hain (No access control for now)
  const allItems = [
    { id: 1, name: "Dashboard", route: "/dashboard", icon: <FaTachometerAlt /> },
    { id: 2, name: "Roles", route: "/rolesData", icon: <FaUserShield /> },
    { id: 3, name: "Users", route: "/usersData", icon: <FaUsers /> },
    { id: 4, name: "Stock Management", route: "/stockData", icon: <FaWarehouse /> },
    { id: 5, name: "Expense", route: "/ExpenseData", icon: <GiMoneyStack /> },
    { id: 8, name: "Bill History", route: "/bill-history", icon: <RiBillFill /> },
    { id: 9, name: "Reports", route: "/reports", icon: <BiSolidReport /> },
    { id: 10, name: "Sales Report", route: "/salesReport", icon: <BsGraphUpArrow /> },
    { id: 11, name: "Pending Amount", route: "/PendingAmount", icon: <GiTakeMyMoney /> },
  ];

  // Update active item when route changes
  useEffect(() => {
    const currentItem = allItems.find(item => item.route === location.pathname);
    if (currentItem) {
      setActiveitems(currentItem.id);
    }
  }, [location.pathname]);

  const handleitemsClick = (item) => {
    setActiveitems(item.id);
    navigate(item.route);
  };

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div className="App">
      {/* Sidebar */}
      <div className={`app-side-bar ${isOpen ? "" : "closed"}`}>
        <div className="opencloseicon" onClick={toggleMenu}>
          <MdOutlineDoubleArrow className={isOpen ? "rotated" : ""} />
        </div>

        <img src={logo} className="logo" alt="Boss Leathers Logo" />

        <ul>
          {/* Show all items */}
          {allItems.map((item) => {
            const listItem = (
              <li
                key={item.id}
                className={activeitems === item.id ? "selected-item" : "unselected"}
                onClick={() => handleitemsClick(item)}
              >
                {item.icon}
                {isOpen && <span>{item.name}</span>}
              </li>
            );

            return !isOpen ? (
              <Tooltip title={item.name} placement="right" key={item.id} arrow>
                {listItem}
              </Tooltip>
            ) : (
              listItem
            );
          })}

          {/* Logout item */}
          {!isOpen ? (
            <Tooltip title="Logout" placement="right" arrow>
              <li className="unselected" onClick={onLogout}>
                <IoLogOut />
              </li>
            </Tooltip>
          ) : (
            <li className="unselected" onClick={onLogout}>
              <IoLogOut />
              {isOpen && <span>Logout</span>}
            </li>
          )}
        </ul>
      </div>

      {/* Right Side Content / Routes */}
      <div className="app-right">
        <Routes>
          {/* All routes accessible - No protection */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/rolesData" element={<Roles />} />
          <Route path="/usersData" element={<Users />} />
          <Route path="/stockData" element={<StockM />} />
          <Route path="/ExpenseData" element={<ExpenseM />} />
          <Route path="/bill-history" element={<BillHistory />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/salesReport" element={<SalesReport />} />
          <Route path="/PendingAmount" element={<PendingAmountPage />} />
          
          {/* Default redirect to dashboard */}
          <Route path="*" element={<Dashboard />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;