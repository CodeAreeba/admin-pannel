import React, { useState, useEffect } from "react";
import AuthContext from "./AuthContext";
import { login as apiLogin, logout as apiLogout } from "../DAL/auth";
import { toast } from "react-toastify";
import { fetchMe } from "../DAL/fetch";

const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  ///////////////////////////// permissions array  /////////////////////////////
  const permissions = admin?.permissions || [];

  /////////////////////////////  Permission check /////////////////////////////
  const can = (perm) => permissions.includes(perm);

  /////////////////////////////  Fetch /me  /////////////////////////////
  const refresh = async () => {
    setLoading(true);
    try {
      const res = await fetchMe();
      if (res.success) {
        setAdmin(res.data);
      } else {
        setAdmin(null);
      }
    } catch (err) {
      console.error("fetchMe error:", err);
      setAdmin(null);
    } finally {
      setLoading(false);
    }
  };

  ///////////////////////////// Login /////////////////////////////
  const login = async (email, password) => {
    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);

      const res = await apiLogin(formData);

      if (res.success) {
        setAdmin(res.data.admin);
        return { success: true, message: res.message };
      }
      return { success: false, message: res.message };
    } catch (err) {
      return { success: false, message: err.message || "Login failed" };
    }
  };

  ///////////////////////////// Logout /////////////////////////////
  const logout = async () => {
    try {
      await apiLogout();
      setAdmin(null);
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  ///////////////////////////// On mount, fetch /me /////////////////////////////
  useEffect(() => {
    refresh();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        admin,
        isAuthenticated: !!admin,
        permissions,
        loading,
        can,
        login,
        logout,
        refresh,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
