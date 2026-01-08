import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import "./login.css";
import { useAlert } from "../Components/Alert/AlertContext";

const Login = ({ onLoginSuccess }) => {
  const { showAlert } = useAlert();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({ email: "", password: "" });

  // Auto-fill from localStorage if saved
  useEffect(() => {
    const savedEmail = localStorage.getItem("email");
    const savedPassword = localStorage.getItem("password");
    if (savedEmail && savedPassword) {
      setEmail(savedEmail);
      setPassword(savedPassword);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    setErrors({ email: "", password: "" });

    // Front-end validation
    let hasError = false;
    const newErrors = { email: "", password: "" };

    if (!email.trim()) {
      newErrors.email = "Email is required.";
      hasError = true;
    }
    if (!password.trim()) {
      newErrors.password = "Password is required.";
      hasError = true;
    }

    setErrors(newErrors);

    if (hasError) return;

    setLoading(true);

    // 🔥 FAKE LOGIN - Backend ke bagair
    setTimeout(() => {
      try {
        // Fake token generate
        const fakeToken = "fake-jwt-token-" + Date.now();
        
        // Fake user data with modules
        const userData = {
          id: "user123",
          name: email.split("@")[0], // Email se naam bana diya
          email: email,
          role: {
            _id: "role123",
            name: "Admin",
            description: "Full access to all modules",
            Modules: [
              "Dashboard",
              "Roles",
              "Users",
              "Stock Management",
              "Expense",
              "Bill History",
              "Reports",
              "Sales Report",
              "Pending Amount"
            ]
          }
        };

        console.log("💾 Saving fake userData to localStorage:", userData);
        
        // Save to localStorage
        localStorage.setItem("Token", fakeToken);
        localStorage.setItem("userData", JSON.stringify(userData));
        
        // Optional: Save email/password for next time
        localStorage.setItem("email", email);
        localStorage.setItem("password", password);

        const saved = localStorage.getItem("userData");
        console.log("✅ Verified saved userData:", saved);

        showAlert("success", "Login successful! Welcome " + userData.name);

        // Call onLoginSuccess callback
        if (onLoginSuccess) {
          onLoginSuccess();
        }

        // Navigate to dashboard
        setTimeout(() => {
          navigate("/dashboard", { replace: true });
        }, 100);

      } catch (error) {
        console.error("❌ Login Error:", error);
        showAlert("error", "Something went wrong!");
      } finally {
        setLoading(false);
      }
    }, 1000); // 1 second delay for realistic feel
  };

  return (
    <Box className="login">
      <Paper
        elevation={6}
        sx={{
          width: 350,
          p: 3,
          borderRadius: 2,
          textAlign: "center",
        }}
      >
        <Box component="form" onSubmit={handleLogin}>
          <Typography variant="h5" gutterBottom>
            Boss Leathers
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Use any email and password to login
          </Typography>

          {/* Email Field */}
          <TextField
            fullWidth
            type="email"
            label="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            error={!!errors.email}
            helperText={errors.email}
          />

          {/* Password Field */}
          <TextField
            fullWidth
            type="password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            error={!!errors.password}
            helperText={errors.password}
          />

          {/* Submit Button with Loader */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: 2,
              py: 1.2,
              borderRadius: "6px",
              backgroundColor: "brown",
              "&:hover": {
                backgroundColor: "brown",
                opacity: 0.9,
              },
            }}
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} sx={{ color: "white" }} />
            ) : (
              "Login"
            )}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default Login;