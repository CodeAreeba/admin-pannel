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
    // 🔥 Initialize from localStorage immediately
    return !!localStorage.getItem("Token");
  });
  
  const navigate = useNavigate();
  const location = useLocation();
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);
  const [resetActive, setResetActive] = useState(false);
  const isAuthenticatedRef = useRef(isAuthenticated);

  // Keep ref in sync
  useEffect(() => {
    isAuthenticatedRef.current = isAuthenticated;
  }, [isAuthenticated]);

  // 🔥 Monitor localStorage changes
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("Token");
      console.log("🔍 Checking auth - Token:", token, "Current state:", isAuthenticatedRef.current);
      
      if (token && !isAuthenticatedRef.current) {
        console.log("✅ Token found, setting authenticated");
        setIsAuthenticated(true);
      } else if (!token && isAuthenticatedRef.current) {
        console.log("❌ Token missing, setting unauthenticated");
        setIsAuthenticated(false);
      }
    };

    // Check every 500ms
    const interval = setInterval(checkAuth, 500);
    
    // Also check on storage events
    window.addEventListener('storage', checkAuth);

    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', checkAuth);
    };
  }, []);

  // 🔥 Handle navigation
  useEffect(() => {
    const token = localStorage.getItem("Token");
    
    console.log("🧭 Navigation Effect - Auth:", isAuthenticated, "Token:", token, "Path:", location.pathname);
    
    if (!isAuthenticated && !token) {
      if (location.pathname !== "/login") {
        console.log("🔀 Redirecting to login");
        navigate("/login", { replace: true });
      }
    } else if (isAuthenticated && token) {
      if (location.pathname === "/login" || location.pathname === "/") {
        console.log("🔀 Redirecting to dashboard");
        navigate("/dashboard", { replace: true });
      }
    }
  }, [isAuthenticated, location.pathname]);

  const handleLoginSuccess = () => {
    console.log("🎉 Login Success - Setting authenticated");
    const token = localStorage.getItem("Token");
    console.log("Token after login:", token);
    setIsAuthenticated(true);
  };

  const handleLogoutClick = () => {
    setOpenLogoutDialog(true);
  };

  const confirmLogout = () => {
    console.log("👋 Logging out");
    setIsAuthenticated(false);
    localStorage.clear(); // Clear everything
    setOpenLogoutDialog(false);
    setResetActive(true);
    navigate("/login", { replace: true });
  };

  const cancelLogout = () => {
    setOpenLogoutDialog(false);
  };

  console.log("🎬 Render - Auth:", isAuthenticated, "Path:", location.pathname);

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