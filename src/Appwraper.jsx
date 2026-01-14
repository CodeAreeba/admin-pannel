import React, { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
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

function AppWrapper() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);
  const [resetActive, setResetActive] = useState(false);

  const navigate = useNavigate();

  // ✅ login success
  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    navigate("/dashboard", { replace: true });
  };

  // open logout dialog
  const handleLogoutClick = () => {
    setOpenLogoutDialog(true);
  };

  // ✅ confirm logout → API hit
  const confirmLogout = async () => {
    try {
      await logout(); // 🔥 BACKEND LOGOUT API
    } catch (error) {
      console.error("Logout API error:", error);
    } finally {
      // ✅ frontend cleanup (always)
      setIsAuthenticated(false);
      setResetActive(true);
      setOpenLogoutDialog(false);
      navigate("/login", { replace: true });
    }
  };

  const cancelLogout = () => {
    setOpenLogoutDialog(false);
  };

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

      {/* Logout Confirmation Dialog */}
      <Dialog open={openLogoutDialog} onClose={cancelLogout}>
        <DialogTitle sx={{ fontWeight: "bold" }}>
          Confirm Logout
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to log out?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelLogout} variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={confirmLogout}
            color="error"
            variant="contained"
          >
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default AppWrapper;
