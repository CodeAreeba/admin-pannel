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
  FaBullhorn,
  FaStar,
  FaChartBar,
  FaCog,
  FaUserShield,
} from "react-icons/fa";
import { Tooltip } from "@mui/material";

import "./App.css";
import logo from "./assets/logo.png";

import Products from "./Pages/Products/Product"
/* Existing Pages */
import Orders from "./Pages/Orders/Orders";
import Customer from "./Pages/Customer/Customer";
import Category from "./Pages/Category/Category";
import Inventory from "./Pages/Inventory/Inventory";
import Dashboard from "./Pages/Dashboard/Dashboard";
import Users from "./Pages/Users/Users";
import Roles from "./Pages/Roles/Roles";

const ProductManagement = () => <h1>Product Management</h1>;
const OrderManagement = () => <h1>Order Management</h1>;
const CustomerManagement = () => <h1>Customer Management</h1>;
const InventoryManagement = () => <h1>Inventory Management</h1>;
const CategoryManagement = () => <h1>Category Management</h1>;
const ContentManagement = () => <h1>Content Management</h1>;
const DiscountManagement = () => <h1>Discount & Promotions</h1>;
const ReviewsRatings = () => <h1>Reviews & Ratings</h1>;
const Settings = () => <h1>Settings</h1>;

const App = ({ onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [activeItem, setActiveItem] = useState(1);
  const [isOpen, setIsOpen] = useState(true);

  const allItems = [
    { id: 1, name: "Dashboard", route: "/dashboard", icon: <FaTachometerAlt /> },
    { id: 2, name: "Product Management", route: "/products", icon: <FaBoxOpen /> },
    { id: 3, name: "Order Management", route: "/orders", icon: <FaShoppingCart /> },
    { id: 4, name: "Customer Management", route: "/customers", icon: <FaUsers /> },
    { id: 5, name: "Inventory Management", route: "/inventory", icon: <FaWarehouse /> },
    { id: 6, name: "Category Management", route: "/categories", icon: <FaTags /> },
    { id: 7, name: "Content Management", route: "/content", icon: <FaBullhorn /> },
    { id: 8, name: "Discount & Promotions", route: "/discounts", icon: <FaBullhorn /> },
    { id: 9, name: "Reviews & Ratings", route: "/reviews", icon: <FaStar /> },
    { id: 10, name: "Analytics & Reports", route: "/reports", icon: <FaChartBar /> },
    { id: 11, name: "Settings", route: "/settings", icon: <FaCog /> },
    { id: 12, name: "User Role Management", route: "/roles", icon: <FaUserShield /> },
  ];

  useEffect(() => {
    const current = allItems.find(i => i.route === location.pathname);
    if (current) setActiveItem(current.id);
  }, [location.pathname]);

  const handleItemClick = (item) => {
    setActiveItem(item.id);
    navigate(item.route);
  };

  return (
    <div className="App">
      {/* Sidebar */}
      <div className={`app-side-bar ${isOpen ? "" : "closed"}`}>
        <div className="opencloseicon" onClick={() => setIsOpen(!isOpen)}>
          <MdOutlineDoubleArrow className={isOpen ? "rotated" : ""} />
        </div>

        <img src={logo} className="logo" alt="Logo" />

        <ul>
          {allItems.map(item => {
            const li = (
              <li
                key={item.id}
                className={activeItem === item.id ? "selected-item" : "unselected"}
                onClick={() => handleItemClick(item)}
              >
                {item.icon}
                {isOpen && <span>{item.name}</span>}
              </li>
            );

            return !isOpen ? (
              <Tooltip title={item.name} placement="right" arrow key={item.id}>
                {li}
              </Tooltip>
            ) : li;
          })}

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

      {/* Routes */}
      <div className="app-right">
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/products" element={<Products />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/customers" element={<Customer />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/categories" element={<Category />} />
          <Route path="/content" element={<ContentManagement />} />
          <Route path="/discounts" element={<DiscountManagement />} />
          <Route path="/reviews" element={<ReviewsRatings />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/roles" element={<Roles />} />

          {/* Extra existing routes */}
          <Route path="/usersData" element={<Users />} />


          <Route path="*" element={<Dashboard />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
