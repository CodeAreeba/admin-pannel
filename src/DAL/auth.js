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