import { invokeApi } from "../Utils/InvokeApi";

export const login = async (formData) => {
  const reqObj = {
    path: "/auth/admin/login",
    method: "POST",
    headers: {},
    postData: formData,
  };
  return invokeApi(reqObj);
};
export const logout = async () => {
  const reqObj = {
    path: "/auth/admin/logout",
    method: "POST",
    headers: {},
  };
  return invokeApi(reqObj);
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
  return response;
};

export const resetPassword = async ({token, newPassword}) => { 
  const reqObj = {
    path: "/auth/admin/reset-password",
    method: "POST",
    headers: {}, 
    postData: {
      token,
      newPassword,
    },
  };

  const response = await invokeApi(reqObj);
  return response;
};


