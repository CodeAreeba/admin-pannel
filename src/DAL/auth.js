import { invokeApi } from "../Utils/InvokeApi";

export const login = async (formData) => {
  const reqObj = {
    path: "/auth/admin/login", 
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    postData: {
      email: formData.get("email"),
      password: formData.get("password")
    },
  };

  const response = await invokeApi(reqObj);
  
  console.log("Login Response:", response);
  return response;
};
export const forgotPassword = async (email) => {
  const reqObj = {
    path: "/auth/admin/forgot-password",
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    postData: {
      email: email
    },
  };

  const response = await invokeApi(reqObj);
  
  console.log("Forgot Password Response:", response);
  return response;
};

export const resetPassword = async (token, newPassword) => {
  const reqObj = {
    path: "/auth/admin/reset-password",
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    postData: {
      token: token,
      newPassword: newPassword
    },
  };

  const response = await invokeApi(reqObj);
  
  console.log("Reset Password Response:", response);
  return response;
};

export const logout = async () => {
  const reqObj = {
    path: "/auth/admin/logout", 
    method: "POST",
    // headers: {
    //   Authorization: `Bearer ${localStorage.getItem("Token")}`,
    // },
  };

  return invokeApi(reqObj);
};