import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AppWrapper from "./Appwraper";
import ErrorBoundary from "./Components/ErrorBoundary";
import AuthProvider from "./auth/authProvider";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <AuthProvider>
      <ErrorBoundary>
        <AppWrapper />
      </ErrorBoundary>
    </AuthProvider>
  </BrowserRouter>
);
