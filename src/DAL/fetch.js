import { invokeApi } from "../Utils/InvokeApi";

export const fetchcategorylist = async () => {
  const reqObj = {
    path: "/category/live",
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
    },
    postData: {},
  };
  return invokeApi(reqObj);
};

export const fetchDashboard = async () => {
  // Static mock data for when API is not available
  const mockData = {
    products: {
      totalProducts: { quantity: 150, price: 2500000 },
      totalSold: { quantity: 85, sale: 1800000 },
      today: { quantity: 5, sale: 95000 },
      yesterday: { quantity: 8, sale: 145000 },
      thisWeek: { quantity: 32, sale: 580000 },
      thisMonth: { quantity: 85, sale: 1800000 },
    },
    pendingAmount: 350000,
    expense: {
      totalExpense: 450000,
      today: 15000,
      yesterday: 22000,
      thisWeek: 95000,
      thisMonth: 450000,
    },
    labourCost: {
      totalLabourCost: 280000,
      today: 8000,
      yesterday: 12000,
      thisWeek: 45000,
      thisMonth: 180000,
      lastMonth: 165000,
    },
  };

  try {
    const reqObj = {
      path: "/stats/dashboard",
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("Token")}`,
      },
      postData: {},
    };
    return await invokeApi(reqObj);
  } catch (error) {
    console.warn("⚠️ API not available, using static data for Dashboard");
    return mockData;
  }
};

export const fetchDashboardChart = async () => {
  const reqObj = {
    path: "/views/get/count",
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
    },
    postData: {},
  };
  return invokeApi(reqObj);
};

export const fetchallroleslist = async (page, rowsPerPages, searchQuery) => {
  const reqObj = {
    path: `/roles/list?limit=${rowsPerPages}&page=${page}&keyword=${searchQuery}`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
    },
    postData: {},
  };
  return invokeApi(reqObj);
};

export const fetchallActiveroleslist = async (
  page,
  rowsPerPages,
  searchQuery
) => {
  const reqObj = {
    path: `/roles/activeList?limit=${rowsPerPages}&page=${page}&keyword=${searchQuery}`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
    },
    postData: {},
  };
  return invokeApi(reqObj);
};

export const fetchalluserlist = async (page, rowsPerPages, searchQuery) => {
  const reqObj = {
    path: `/user/list?limit=${rowsPerPages}&page=${page}&keyword=${searchQuery}`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
    },
    postData: {},
  };
  return invokeApi(reqObj);
};
export const fetchAllProductList = async (
  page,
  rowsPerPage,
  searchQuery,
  filter
) => {
  const reqObj = {
    path: `/product/list`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
    },
    postData: {},
  };

  return invokeApi(reqObj);
};

////////////////////////////////////
export const fetchMe = async () => {
  const reqObj = {
    path: `/auth/admin/me`,
    method: "GET",
    headers: {},
    postData: {},
  };

  return invokeApi(reqObj);
};
export const getAllAdmins = async (page = 1, limit = 25, search = "") => {
  const reqObj = {
    path: `/admin?page=${page}&limit=${limit}&search=${search}`,
    method: "GET",
    headers: {},
    postData: {},
  };

  return invokeApi(reqObj);
};

export const getAllPermissions = async () => {
  const reqObj = {
    path: `/admin/permissions`,
    method: "GET",
    headers: {},
    postData: {},
  };

  return invokeApi(reqObj);
};
export const getAllCategories = async (page = 1, limit = 25, search = "") => {
  const reqObj = {
   path: `/admin/categories?page=${page}&limit=${limit}&search=${search}`,
    method: "GET",
    headers: {},
    postData: {},
  };

  return invokeApi(reqObj);
};
export const getCategoryById = async (id) => {
  const reqObj = {
  path: `/admin/categories/${id}`,
    method: "GET",
    headers: {},
    postData: {},
  };

  return invokeApi(reqObj);
};
export const getAllSubCategories = async (categoryId,page = 1, limit = 25, search = "") => {
  const reqObj = {
    path: `/admin/subcategories/category/${categoryId}?page=${page}&limit=${limit}&search=${search}`,
    method: "GET",
    headers: {},
    postData: {},
  };

  return invokeApi(reqObj);
};
export const getSubCategoryById = async (id) => {
  const reqObj = {
       path: `/admin/subcategories/${id}`,
    method: "GET",
    headers: {},
    postData: {},
  };

  return invokeApi(reqObj);
};
