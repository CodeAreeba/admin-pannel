import React, { useState, useEffect } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { MdOutlineDoubleArrow } from "react-icons/md";
import { IoLogOut } from "react-icons/io5";
import {
  FaTachometerAlt,
  FaBoxOpen,
  FaShoppingCart,
  FaUsers,
  FaWarehouse,
  FaTags,
  FaChartBar,
  FaCog,
  FaUserShield,
} from "react-icons/fa";
import { Tooltip } from "@mui/material";

import "./App.css";
import useAuth from "./auth/useAuth";
import pagePermissions from "./config/pagePermissions";
import ProtectedRoute from "./auth/ProtectedRoute";

/////////////////////// Pages ////////////////////////////
import Dashboard from "./Pages/Dashboard/Dashboard";
import Products from "./Pages/Products/Product";
import Orders from "./Pages/Orders/Orders";
import Customer from "./Pages/Customer/Customer";
import Inventory from "./Pages/Inventory/Inventory";
import Category from "./Pages/Category/Category";
import Users from "./Pages/Users/Users";
import AddCategory from "./Pages/Category/AddCategory";
import AddSubcategory from "./Pages/Category/AddSubcategory";
// import AddProduct from "./Components/Models/AddCustomer";
import AddProducts from "./Components/Models/AddProducts";


//////////////////////////// Auth & Permissions ////////////////////////////
const Settings = () => <h1>Settings</h1>;

const App = ({ onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { admin } = useAuth();

  const [isOpen, setIsOpen] = useState(true);
  const activeRoute = location.pathname;

  const handleNavigate = (route) => {
    navigate(route);
  };

  //////////////////////////// Sidebar items ////////////////////////////
  const sidebarItems = [
    { name: "Dashboard", route: "/dashboard", icon: <FaTachometerAlt /> },
    { name: "Product Management", route: "/products", icon: <FaBoxOpen /> },
    { name: "Order Management", route: "/orders", icon: <FaShoppingCart /> },
    { name: "Customer Management", route: "/customers", icon: <FaUsers /> },
    {
      name: "Inventory Management",
      route: "/inventory",
      icon: <FaWarehouse />,
    },
    { name: "Category Management", route: "/categories", icon: <FaTags /> },
    { name: "Analytics & Reports", route: "/reports", icon: <FaChartBar /> },
    { name: "Settings", route: "/settings", icon: <FaCog /> },
    { name: "User Management", route: "/users", icon: <FaUserShield /> },
  ];

  //////////////////////////// Filter sidebar based on permissions ////////////////////////////
  const filteredItems = sidebarItems.filter((item) => {
    const permission = pagePermissions[item.route];
    return !permission || admin?.permissions?.includes(permission);
  });

  return (
    <div className="App">
      {/* Sidebar */}
      <div className={`app-side-bar ${isOpen ? "" : "closed"}`}>
        <div className="opencloseicon" onClick={() => setIsOpen(!isOpen)}>
          <MdOutlineDoubleArrow className={isOpen ? "rotated" : ""} />
        </div>

        <img src="/shoeman-logo.svg" className="logo" alt="Shoeman Logo" />

        <ul>
          {filteredItems.map((item) => {
            const li = (
              <li
                key={item.route}
                className={
                  activeRoute === item.route ? "selected-item" : "unselected"
                }
                onClick={() => handleNavigate(item.route)}
              >
                {item.icon}
                {isOpen && <span>{item.name}</span>}
              </li>
            );

            return !isOpen ? (
              <Tooltip
                title={item.name}
                placement="right"
                arrow
                key={item.route}
              >
                {li}
              </Tooltip>
            ) : (
              li
            );
          })}

          {/* Logout */}
          {!isOpen ? (
            <Tooltip title="Logout" placement="right" arrow>
              <li className="unselected" onClick={onLogout}>
                <IoLogOut />
              </li>
            </Tooltip>
          ) : (
            <li className="unselected" onClick={onLogout}>
              <IoLogOut />
              <span>Logout</span>
            </li>
          )}
        </ul>
      </div>

      {/* Main Content */}
      <div className="app-right">
        <Routes>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute path="/dashboard">
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/products"
            element={
              <ProtectedRoute path="/products">
                <Products />
              </ProtectedRoute>
            }
          />

          <Route
            path="/orders"
            element={
              <ProtectedRoute path="/orders">
                <Orders />
              </ProtectedRoute>
            }
          />

          <Route
            path="/customers"
            element={
              <ProtectedRoute path="/customers">
                <Customer />
              </ProtectedRoute>
            }
          />

          <Route
            path="/inventory"
            element={
              <ProtectedRoute path="/inventory">
                <Inventory />
              </ProtectedRoute>
            }
          />

          <Route
            path="/categories"
            element={
              <ProtectedRoute>
                <Category />
              </ProtectedRoute>
            }
          />
          <Route
            path="/categories/add"
            element={
              <ProtectedRoute>
                <AddCategory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/categories/:id/edit"
            element={
              <ProtectedRoute>
                <AddCategory />
              </ProtectedRoute>
            }
          />

          {/* ✅ SUBCATEGORY ROUTES */}
          <Route
            path="/categories/:id/add-subcategory"
            element={
              <ProtectedRoute>
                <AddSubcategory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/categories/:id/edit-subcategory/:subId"
            element={
              <ProtectedRoute>
                <AddSubcategory />
              </ProtectedRoute>
            }
          />

          <Route
            path="/users"
            element={
              <ProtectedRoute path="/users">
                <Users />
              </ProtectedRoute>
            }
          />

          <Route
            path="/settings"
            element={
              <ProtectedRoute path="/settings">
                <Settings />
              </ProtectedRoute>
            }
          />
          <Route path ="/products/add"
            element={ 
              <ProtectedRoute>
                <AddProducts />
              </ProtectedRoute> 
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Dashboard />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;