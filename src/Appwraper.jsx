import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
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
import { logout } from "./DAL/auth";
import CustomAlert from "./Components/Alert/CustomAlert";

function AppWrapper() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoaded, setAuthLoaded] = useState(false);
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);
  const [resetActive, setResetActive] = useState(false);
  const [loginToast, setLoginToast] = useState(false); // ✅ trigger toast after route is ready

  const navigate = useNavigate();

  // ✅ check localStorage on mount
  useEffect(() => {
    const auth = localStorage.getItem("auth") === "true";
    setIsAuthenticated(auth);
    setAuthLoaded(true);
  }, []);

  // ✅ show toast after login redirect
  useEffect(() => {
    if (loginToast) {
      CustomAlert.success("Logged in successfully!");
      setLoginToast(false); // reset
    }
  }, [loginToast]);

  // login success
  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    localStorage.setItem("auth", "true");
    setLoginToast(true); // trigger toast
    navigate("/dashboard", { replace: true });
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
      setIsAuthenticated(false);
      localStorage.removeItem("auth");
      setResetActive(true);
      setOpenLogoutDialog(false);
      navigate("/login", { replace: true });
    }
  };

  const cancelLogout = () => setOpenLogoutDialog(false);

  if (!authLoaded) return null; // ✅ render nothing until auth state is loaded

  return (
    <>
      <Routes>
        {isAuthenticated ? (
          <Route
            path="/*"
            element={
              <App
                onLogout={handleLogoutClick}
                resetActive={resetActive}
                setResetActive={setResetActive}
              />
            }
          />
        ) : (
          <>
            <Route
              path="/login"
              element={<Login onLoginSuccess={handleLoginSuccess} />}
            />
            <Route
              path="*"
              element={<Login onLoginSuccess={handleLoginSuccess} />}
            />
          </>
        )}
      </Routes>

      {/* Logout Dialog */}
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

      {/* ToastContainer always mounted */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
      />
    </>
  );
}

export default AppWrapper;
