import React from "react";
import { Snackbar, Alert } from "@mui/material";

const CustomAlert = ({ type, message }) => {
  return (
    <Snackbar open={!!message} autoHideDuration={3000}>
      <Alert severity={type || "info"} sx={{ width: "100%" }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default CustomAlert;
