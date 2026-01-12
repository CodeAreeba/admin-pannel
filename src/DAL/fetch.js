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
      thisMonth: { quantity: 85, sale: 1800000 }
    },
    pendingAmount: 350000,
    expense: {
      totalExpense: 450000,
      today: 15000,
      yesterday: 22000,
      thisWeek: 95000,
      thisMonth: 450000
    },
    labourCost: {
      totalLabourCost: 280000,
      today: 8000,
      yesterday: 12000,
      thisWeek: 45000,
      thisMonth: 180000,
      lastMonth: 165000
    }
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

export const fetchallActiveroleslist = async (page, rowsPerPages, searchQuery) => {
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

export const fetchallStocklist = async (page, rowsPerPages, searchQuery,filter) => {
  const reqObj = {
    path: `/stock/list?limit=${rowsPerPages}&page=${page}&keyword=${searchQuery}&filter=${filter}`,
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


export const fetchAllStockReports = async (page, rowsPerPages, searchQuery) => {
  const reqObj = {
    path: `/stock/report`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
    },
    postData: {},
  };
  return invokeApi(reqObj);
};

export const fetchallExpenselist = async (page, rowsPerPages, searchQuery) => {
  const reqObj = {
    path: `/expense/list?limit=${rowsPerPages}&page=${page}&keyword=${searchQuery}`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
    },
    postData: {},
  };
  return invokeApi(reqObj);
};
export const fetchAllExpenseReports = async (page, rowsPerPages, searchQuery) => {
  const reqObj = {
    path: `/Expense/report`,
    method: "GET",
    headers: {
      AuthorizatiEon: `Bearer ${localStorage.getItem("Token")}`,
    },
    postData: {},
  };
  return invokeApi(reqObj);
};

export const fetchSaleslist = async (page, rowsPerPages, searchQuery) => {
  const reqObj = {
    path: `/bill/salesactivity?limit=${rowsPerPages}&page=${page}&keyword=${searchQuery}`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
    },
    postData: {},
  };
  return invokeApi(reqObj);
};


export const fetchallBilllist = async (page, rowsPerPages, searchQuery) => {
 const reqObj = {
    path: `/bill/list?limit=${rowsPerPages}&page=${page}&keyword=${searchQuery}`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
    },
    postData: {},
  };
  return invokeApi(reqObj);
};

export const fetchAllBillReports = async (page, rowsPerPages, searchQuery) => {
 const reqObj = {
    path: `/bill/report`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
    },
    postData: {},
  };
  return invokeApi(reqObj);
};
// New API functions for POS Billing System
export const fetchProductsList = async (page = 1, limit = 50, keyword = "") => {
  const reqObj = {
    path: `/stock/list?page=${page}&limit=${limit}&keyword=${keyword}`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
    },
    postData: {},
  };
  return invokeApi(reqObj);
};

export const fetchProductSalesReport = async (filter = "thisMonth") => { 
  const reqObj = {  
    path: `/stock/Product-Sales-Report?filter=${filter}`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
    },
    postData: {},  
  };
  return invokeApi(reqObj);
};

export const fetchPendingAmount = async (page = 1, limit = 50, keyword = "") => {
  const reqObj = {
    path: `/bill/pendingamount?page=${page}&limit=${limit}&keyword=${keyword}`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
    },
    postData: {},
  };
  return invokeApi(reqObj);
};


export const searchBillById = async (billId) => {
  const reqObj = {
    path: `/bill/${billId}`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
    },
    postData: {},
  };
  return invokeApi(reqObj);
};
 
