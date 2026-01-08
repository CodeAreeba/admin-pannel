import { invokeApi } from "../Utils/InvokeApi";

export const login = async (formData) => {
  // Static mock data for login when API is not available
  const mockLoginResponse = {
    status: 200,
    message: "Login successful!",
    token: "mock-token-" + Date.now(),
    data: {
      id: "user-001",
      name: "Admin User",
      email: formData.get("email"),
      role: {
        _id: "role-001",
        name: "Admin",
        description: "Full access administrator",
        Modules: [
          "Dashboard",
          "Roles",
          "Users",
          "Stock Management",
          "Expense",
          "Bill History",
          "Reports",
          "Sales Report",
          "Pending Amount"
        ]
      }
    }
  };

  try {
    const reqObj = {
      path: "/auth/login",
      method: "POST",
      headers: {},
      postData: formData,
    };
    return await invokeApi(reqObj);
  } catch (error) {
    console.warn("⚠️ API not available, using static login data");
    console.log("📧 Email:", formData.get("email"));
    
    // Simple validation - accept any email/password for demo
    // You can add specific credentials check here if needed
    // Example: if (formData.get("email") === "admin@test.com" && formData.get("password") === "admin123")
    
    if (formData.get("email") && formData.get("password")) {
      return mockLoginResponse;
    } else {
      return {
        status: 400,
        message: "Email and password are required"
      };
    }
  }
};
export const logout = async () => {
  const reqObj = {
    path: "/api/admin/logout",
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
    },
  };
  return invokeApi(reqObj);
};
