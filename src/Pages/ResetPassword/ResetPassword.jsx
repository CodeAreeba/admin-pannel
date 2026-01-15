import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  CircularProgress,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { resetPassword } from "../../DAL/auth";
import "./ResetPassword.css";

const ResetPassword = () => {
  const navigate = useNavigate();

  // 🔹 TOKEN URL SE GET HO RAHA HAI
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const validatePassword = (password) => {
    if (password.length < 6)
      return "Password must be at least 6 characters long";
    if (!/[A-Z]/.test(password))
      return "Password must contain at least one uppercase letter";
    if (!/[a-z]/.test(password))
      return "Password must contain at least one lowercase letter";
    if (!/[0-9]/.test(password))
      return "Password must contain at least one number";
    return "";
  };

  const handleSubmit = async () => {
    // 🔴 TOKEN CHECK (PAGE OPEN PAR KOI EFFECT NAHI)
    if (!token) {
      toast.error("Invalid or expired reset link");
      return;
    }

    setErrors({ newPassword: "", confirmPassword: "" });

    let hasError = false;
    const newErrors = { newPassword: "", confirmPassword: "" };

    if (!newPassword.trim()) {
      newErrors.newPassword = "New password is required";
      hasError = true;
    } else {
      const validationError = validatePassword(newPassword);
      if (validationError) {
        newErrors.newPassword = validationError;
        hasError = true;
      }
    }

    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = "Please confirm your password";
      hasError = true;
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      hasError = true;
    }

    setErrors(newErrors);
    if (hasError) return;

    setLoading(true);

    try {
      // ✅ PASSWORD + TOKEN PAYLOAD MA JAA RAHA HAI
      const response = await resetPassword({
        newPassword: newPassword,
        token: token,
      });

      if (
        response?.status === 200 ||
        response?.success === true ||
        response?.message?.toLowerCase().includes("success")
      ) {
        toast.success(
          response?.message || "Password reset successful!"
        );

        setNewPassword("");
        setConfirmPassword("");

        setTimeout(() => navigate("/login"), 2000);
      } else {
        throw new Error(response?.message || "Reset failed");
      }
    } catch (error) {
      toast.error(
        error.message || "Failed to reset password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="reset-password-page">
      <Paper elevation={6} sx={{ width: 380, p: 3, borderRadius: 2 }}>
        <Typography variant="h5" textAlign="center">
          Boss Leathers
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          textAlign="center"
          sx={{ mb: 2 }}
        >
          Reset Your Password
        </Typography>

        <TextField
          fullWidth
          label="New Password"
          type={showPassword ? "text" : "password"}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          error={!!errors.newPassword}
          helperText={errors.newPassword}
          margin="normal"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <TextField
          fullWidth
          label="Confirm Password"
          type={showConfirmPassword ? "text" : "password"}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword}
          margin="normal"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                >
                  {showConfirmPassword ? (
                    <VisibilityOff />
                  ) : (
                    <Visibility />
                  )}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 2, backgroundColor: "brown" }}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <CircularProgress size={24} sx={{ color: "white" }} />
          ) : (
            "Reset Password"
          )}
        </Button>

        <Button
          fullWidth
          sx={{ mt: 1, color: "brown" }}
          onClick={() => navigate("/login")}
        >
          Back to Login
        </Button>
      </Paper>
    </Box>
  );
};

export default ResetPassword;
