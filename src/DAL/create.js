import { invokeApi } from "../Utils/InvokeApi";

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

export const createSubCategory = async (data) => {
  const reqObj = {
    path: "/admin/subcategories",
    method: "POST",
    headers: {},
    postData: data,
  };
  return invokeApi(reqObj);
};
export const createProduct = async (data) => {
  const reqObj = {
    path: "/admin/products",
    method: "POST",
    headers: {},
    postData: data,
  };
  return invokeApi(reqObj);
};
export const createVariant = async (data) => {
  const reqObj = {
    path: "/admin/variants",
    method: "POST",
    headers: {},
    postData: data,
  };
  return invokeApi(reqObj);
};
export const createCustomers = async (data) => {
  const reqObj = {
    path: "/admin/variants",
    method: "POST",
    headers: {},
    postData: data,
  };
  return invokeApi(reqObj);
};
