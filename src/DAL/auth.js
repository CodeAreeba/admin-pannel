export const login = async (formData) => {

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
        Modules: ["Dashboard", "Users", "Stock Management"]
      },
    },
  };

  try {
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

    return await invokeApi(reqObj);
  } catch (error) {
    console.warn(" Backend not available, using mock login");
    // Return mock data
    if (formData.get("email") && formData.get("password")) {
      return mockLoginResponse;
    }
    return {
      status: 400,
      message: "Email and password required",
    };
  }
};