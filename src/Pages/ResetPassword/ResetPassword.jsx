import React, { useState, useEffect } from "react";
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
import { useNavigate, useParams } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import CustomAlert from "../../Components/Alert/CustomAlert";
import { resetPassword } from "../../DAL/auth";
import "./ResetPassword.css";

const ResetPassword = () => {
  const navigate = useNavigate();
  const { token } = useParams();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  console.log("🔄 Component Rendered - Token:", token?.substring(0, 10) + "...");

  useEffect(() => {
    // Check if token exists
    if (!token) {
      CustomAlert.error("Invalid reset link");
      navigate("/login");
    }
  }, [token, navigate]);

  const validatePassword = (password) => {
    if (password.length < 6) {
      return "Password must be at least 6 characters long";
    }
    if (!/[A-Z]/.test(password)) {
      return "Password must contain at least one uppercase letter";
    }
    if (!/[a-z]/.test(password)) {
      return "Password must contain at least one lowercase letter";
    }
    if (!/[0-9]/.test(password)) {
      return "Password must contain at least one number";
    }
    return "";
  };

  const handleSubmit = async () => {
    console.log("🔵 Handle Submit Called");

    // Reset errors
    setErrors({ newPassword: "", confirmPassword: "" });
    let hasError = false;
    const newErrors = { newPassword: "", confirmPassword: "" };

    // Validation
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

    if (hasError) {
      console.log("❌ Validation failed");
      return;
    }

    console.log("✅ Validation passed, calling API...");
    setLoading(true);

    try {
      console.log("🚀 Calling resetPassword API...");
      const response = await resetPassword(token, newPassword);

      console.log("✅ Reset Password Response:", response);

      // Check multiple possible success indicators
      const isSuccess =
        response.statusCode === 200 ||
        response.status === 200 ||
        response.success === true ||
        (response.message && response.message.toLowerCase().includes("success"));

      if (isSuccess) {
        CustomAlert.success(
          response.message || "Password reset successful! You can now login."
        );

        // Clear form
        setNewPassword("");
        setConfirmPassword("");

        // Redirect to login after 2 seconds
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        throw new Error(response.message || "Failed to reset password");
      }
    } catch (error) {
      console.error("Reset Password Error:", error);

      // Handle specific error messages
      let errorMessage = "Failed to reset password. Please try again.";

      if (error.message?.toLowerCase().includes("expired")) {
        errorMessage = "Reset link has expired. Please request a new one.";
      } else if (error.message?.toLowerCase().includes("invalid")) {
        errorMessage = "Invalid reset link. Please request a new one.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      CustomAlert.error(errorMessage);
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
    <Box className="reset-password-page">
      <Paper
        elevation={6}
        sx={{
          width: 380,
          p: 3,
          borderRadius: 2,
          textAlign: "center",
        }}
      >
        <Typography variant="h5" gutterBottom>
          Boss Leathers
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Reset Your Password
        </Typography>

        <TextField
          fullWidth
          type={showPassword ? "text" : "password"}
          label="New Password"
          value={newPassword}
          onChange={(e) => {
            setNewPassword(e.target.value);
            setErrors({ ...errors, newPassword: "" });
          }}
          onKeyPress={handleKeyPress}
          margin="normal"
          disabled={loading}
          error={!!errors.newPassword}
          helperText={errors.newPassword}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                  disabled={loading}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <TextField
          fullWidth
          type={showConfirmPassword ? "text" : "password"}
          label="Confirm Password"
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            setErrors({ ...errors, confirmPassword: "" });
          }}
          onKeyPress={handleKeyPress}
          margin="normal"
          disabled={loading}
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  edge="end"
                  disabled={loading}
                >
                  {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Box sx={{ mt: 2, mb: 1, textAlign: "left" }}>
          <Typography variant="caption" color="text.secondary">
            Password requirements:
          </Typography>
          <Typography variant="caption" display="block" color="text.secondary">
            • At least 6 characters
          </Typography>
          <Typography variant="caption" display="block" color="text.secondary">
            • One uppercase & one lowercase letter
          </Typography>
          <Typography variant="caption" display="block" color="text.secondary">
            • At least one number
          </Typography>
        </Box>

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
          {loading ? (
            <CircularProgress size={24} sx={{ color: "white" }} />
          ) : (
            "Reset Password"
          )}
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

export default ResetPassword;