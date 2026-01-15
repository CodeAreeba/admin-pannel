
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
import { toast } from "react-toastify";
import useAuth from "../auth/useAuth"; 
import "./login.css";

const Login = () => {
  const navigate = useNavigate();

  const { login } = useAuth(); 

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "" });

  ///////////////////////////// Autofill saved email only /////////////////////////////
  useEffect(() => {
    const savedEmail = localStorage.getItem("email");
    if (savedEmail) setEmail(savedEmail);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    setErrors({ email: "", password: "" });
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

    try {
      const success = await login(email, password); //  useAuth login
      if (success) {
        localStorage.setItem("email", email); //  for autofill
        navigate("/dashboard", { replace: true });
      }
    } catch (err) {
      console.error("Login error:", err);
      toast.error(err.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="login">
      <Paper
        elevation={6}
        sx={{ width: 350, p: 3, borderRadius: 2, textAlign: "center" }}
      >
        <Box component="form" onSubmit={handleLogin}>
          <Typography variant="h5" gutterBottom>
            Boss Leathers
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Admin Login
          </Typography>

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

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: 2,
              py: 1.2,
              borderRadius: "6px",
              backgroundColor: "brown",
              "&:hover": { backgroundColor: "brown", opacity: 0.9 },
            }}
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} sx={{ color: "white" }} />
            ) : (
              "Login"
            )}
          </Button>
           <Button
              sx={{ mt: 1, textTransform: "none" }}
              onClick={() => navigate("/forgot-password")}
            >
              Forgot Password?
            </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default Login;
