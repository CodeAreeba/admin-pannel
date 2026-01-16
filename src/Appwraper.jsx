import React, { useState } from "react";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";

import App from "./App";
import Login from "./Pages/Login";
import useAuth from "./auth/useAuth";
import ResetPassword from "./Pages/ResetPassword/ResetPassword";
import Forgot from "./Pages/ForgotPassword/Forgot";

function AppWrapper() {
  const navigate = useNavigate();
  const { isAuthenticated, loading, login, logout } = useAuth();

  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);

  if (loading) {
    return <div>Loading...</div>; // or spinner
  }

  ///////////////////////////// Login success callback /////////////////////////////
  const handleLoginSuccess = async (email, password) => {
    try {
      const success = await login(email, password); // useAuth login
      if (success) {
        toast.success("Logged in successfully!");
        navigate("/dashboard", { replace: true });
      }
    } catch (err) {
      toast.error(err.message || "Login failed");
    }
  };

  ///////////////////////////// Logout handlers /////////////////////////////
  const handleLogoutClick = () => setOpenLogoutDialog(true);

  const confirmLogout = async () => {
    try {
      await logout(); // useAuth logout
      toast.success("Logged out successfully!");
    } catch (err) {
      toast.error("Logout failed");
      console.error(err);
    } finally {
      setOpenLogoutDialog(false);
      navigate("/login", { replace: true });
    }
  };

  const cancelLogout = () => setOpenLogoutDialog(false);

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={1500}
        pauseOnHover={false}
        newestOnTop
      />

      <Routes>
        {isAuthenticated ? (
          <Route path="/*" element={<App onLogout={handleLogoutClick} />} />
        ) : (
          <>
            <Route
              path="/login"
              element={<Login onLoginSuccess={handleLoginSuccess} />}
            />
            <Route path="/forgot-password" element={<Forgot />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </>
        )}
      </Routes>

      {/* Logout Confirmation Dialog */}
      <Dialog open={openLogoutDialog} onClose={cancelLogout}>
        <DialogTitle sx={{ fontWeight: "bold" }}>Confirm Logout</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to log out?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelLogout} variant="outlined">
            Cancel
          </Button>
          <Button onClick={confirmLogout} color="error" variant="contained">
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default AppWrapper;
