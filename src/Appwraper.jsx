import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
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
import Forgot from "./Pages/ForgotPassword/Forgot";
import ResetPassword from "./Pages/ResetPassword/ResetPassword";
import { logout } from "./DAL/auth";
import CustomAlert from "./Components/Alert/CustomAlert";

function AppWrapper() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("isLoggedIn") === "true";
  });
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);
  const [resetActive, setResetActive] = useState(false);

  const handleLoginSuccess = () => {
    localStorage.setItem("isLoggedIn", "true");
    setIsAuthenticated(true);
    CustomAlert.success("Logged in successfully!");
  };

  const handleLogoutClick = () => setOpenLogoutDialog(true);

  const confirmLogout = async () => {
    try {
      await logout();
      CustomAlert.success("Logged out successfully!");
    } catch (error) {
      console.error("Logout API error:", error);
      CustomAlert.error("Logout failed!");
    } finally {
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("auth");
      setIsAuthenticated(false);
      setResetActive(true);
      setOpenLogoutDialog(false);
    }
  };

  const cancelLogout = () => setOpenLogoutDialog(false);

  return (
    <>
      <Routes>
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Login onLoginSuccess={handleLoginSuccess} />
            )
          }
        />
        <Route
          path="/forgot-password"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Forgot />
            )
          }
        />
        <Route
          path="/reset-password/:token"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <ResetPassword />
            )
          }
        />
        <Route
          path="/*"
          element={
            isAuthenticated ? (
              <App
                onLogout={handleLogoutClick}
                resetActive={resetActive}
                setResetActive={setResetActive}
              />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>

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