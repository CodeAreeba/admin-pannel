import React, { useState } from "react";
import { Box, Paper, Typography, TextField, Button, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import CustomAlert from "../../Components/Alert/CustomAlert";
import { forgotPassword } from "../../DAL/auth";
import "./Forgot.css";

const Forgot = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  console.log("🔄 Component Rendered - Email State:", email);

  const handleSubmit = async () => {
    console.log("🔵 Handle Submit Called");
    console.log("📧 Email:", email);
    
    // Validation
    if (!email.trim()) {
      console.log("❌ Email is empty");
      setError("Please enter your email address");
      CustomAlert.warning("Please enter your email address");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log("❌ Invalid email format");
      setError("Please enter a valid email address");
      CustomAlert.warning("Please enter a valid email address");
      return;
    }

    console.log("✅ Validation passed, calling API...");
    setError("");
    setLoading(true);

    try {
      console.log("🚀 Calling forgotPassword API...");
      const response = await forgotPassword(email);
      
      console.log("✅ Forgot Password Response:", response);

      // Check multiple possible success indicators
      const isSuccess = 
        response.statusCode === 200 || 
        response.status === 200 || 
        response.success === true ||
        (response.message && response.message.toLowerCase().includes("sent"));

      if (isSuccess) {
        CustomAlert.success(response.message || "Reset link sent to your email successfully!");
        setEmail("");
        
        // Redirect to login after 2 seconds
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        throw new Error(response.message || "Failed to send reset link");
      }
    } catch (error) {
      console.error("Forgot Password Error:", error);
      CustomAlert.error(error.message || "Failed to send reset link. Please try again.");
      setError(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <Box className="forgot-page">
      <Paper
        elevation={6}
        sx={{
          width: 350,
          p: 3,
          borderRadius: 2,
          textAlign: "center",
        }}
      >
        <Typography variant="h5" gutterBottom>
          Boss Leathers
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Forgot Password
        </Typography>

        <TextField
          fullWidth
          type="email"
          label="Email Address"
          value={email}
          onChange={(e) => {
            console.log("📝 Email Changed:", e.target.value);
            setEmail(e.target.value);
            setError("");
          }}
          onKeyPress={handleKeyPress}
          margin="normal"
          disabled={loading}
          error={!!error}
          helperText={error}
          autoComplete="email"
        />

        <Button
          fullWidth
          variant="contained"
          sx={{
            mt: 2,
            py: 1.2,
            borderRadius: "6px",
            backgroundColor: "brown",
            "&:hover": { backgroundColor: "brown", opacity: 0.9 },
          }}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Send Reset Link"}
        </Button>

        <Button
          fullWidth
          sx={{ mt: 1, textTransform: "none", color: "brown" }}
          onClick={() => navigate("/login")}
          disabled={loading}
        >
          Back to Login
        </Button>
      </Paper>
    </Box>
  );
};

export default Forgot;