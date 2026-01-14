import React, { useState, useEffect, useRef } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
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
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem("Token");
  });
  
  const navigate = useNavigate();
  const location = useLocation();
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);
  const [resetActive, setResetActive] = useState(false);

  // ✅ ONE-TIME auth check on mount
  useEffect(() => {
    const token = localStorage.getItem("Token");
    setIsAuthenticated(!!token);
  }, []); // Empty array - runs only once

  // ✅ Handle navigation based on auth state
  useEffect(() => {
    const token = localStorage.getItem("Token");
    
    if (!token && location.pathname !== "/login") {
      navigate("/login", { replace: true });
    } else if (token && (location.pathname === "/login" || location.pathname === "/")) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, location.pathname, navigate]);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogoutClick = () => {
    setOpenLogoutDialog(true);
  };

  const confirmLogout = () => {
    setIsAuthenticated(false);
    localStorage.clear();
    setOpenLogoutDialog(false);
    setResetActive(true);
    navigate("/login", { replace: true });
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