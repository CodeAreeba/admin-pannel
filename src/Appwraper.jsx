import React, { useState, useEffect } from "react";
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

function AppWrapper() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("Token")
  );
  const navigate = useNavigate();
  const [message, setMessage] = useState({ type: "", text: "" });
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);
  const [resetActive, setResetActive] = useState(false);  

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    } else {
      const lastRoute = localStorage.getItem("lastRoute") || "/dashboard";
      navigate(lastRoute, { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setMessage({ type: "success", text: "Login Successfully" });
    navigate("/dashboard");
  };

  // 👇 open logout confirmation dialog
  const handleLogoutClick = () => {
    setOpenLogoutDialog(true);
  };

  // 👇 confirm logout (with sidebar reset)
  const confirmLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("Token");
    localStorage.removeItem("lastRoute");
    setOpenLogoutDialog(false);

    // 👇 trigger sidebar active reset
    setResetActive(true);

    navigate("/login");
  };

  // 👇 cancel logout
  const cancelLogout = () => {
    setOpenLogoutDialog(false);
  };

  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => {
        setMessage({ type: "", text: "" });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <>
      <Routes>
        {isAuthenticated ? (
          <Route
            path="/*"
            element={
              <App
                onLogout={handleLogoutClick}
                message={message}
                setMessage={setMessage}
                resetActive={resetActive} // 👈 passed here
                setResetActive={setResetActive} // 👈 to reset flag after use
              />
            }
          />
        ) : (
          <Route
            path="/login"
            element={<Login onLoginSuccess={handleLoginSuccess} />}
          />
        )}
      </Routes>

      {/* ✅ Logout Confirmation Dialog */}
      <Dialog
        open={openLogoutDialog}
        onClose={cancelLogout}
        aria-labelledby="logout-dialog-title"
        aria-describedby="logout-dialog-description"
      >
        <DialogTitle id="logout-dialog-title" sx={{ fontWeight: "bold" }}>
          Confirm Logout
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="logout-dialog-description">
            Are you sure you want to log out from your account?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelLogout} color="primary" variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={confirmLogout}
            color="error"
            variant="contained"
            autoFocus
          >
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default AppWrapper;
