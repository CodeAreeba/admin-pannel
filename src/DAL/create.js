import { invokeApi } from "../Utils/InvokeApi";

export const createProduct = async (productData) => {
  const reqObj = {
    path: `/product/create`,
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
    },
    postData: productData,
  };

  return invokeApi(reqObj);
};

export const createnewuser = async (data) => {
  const reqObj = {
    path: "/user/create",
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
    },
    postData: data,
  };
  return invokeApi(reqObj);
};

export const createRole = async (data) => {
  const reqObj = {
    path: "/roles/add",
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
    },
    postData: data,
  };
  return invokeApi(reqObj);
};

///////////////////////////////////////////////////////////

export const createAdmin = async (data) => {
  const reqObj = {
    path: "/admin",
    method: "POST",
    headers: {},
    postData: data,
  };
  return invokeApi(reqObj);
};
export const createCategory = async (data) => {
  const reqObj = {
    path: "/admin/categories",
    method: "POST",
    headers: {},
    postData: data,
  };
  return invokeApi(reqObj);
};

export const createSubcategory = async (data) => {
  const reqObj = {
    path: "/admin/subcategories",
    method: "POST",
    headers: {},
    postData: data,
  };
  return invokeApi(reqObj);
};