import { invokeApi } from "../Utils/InvokeApi";

export const updateAdmin = async (id, data) => {
  const reqObj = {
    path: `/admin/${id}`,
    method: "PUT",
    headers: {},
    postData: data,
  };
  return invokeApi(reqObj);
};
export const updateCategory = async (id, data) => {
  const reqObj = {
    path: `/admin//categories/${id}`,
    method: "PUT",
    headers: {},
    postData: data,
  };
  return invokeApi(reqObj);
};

export const updateSubCategory = async (id, data) => {
  const reqObj = {
    path: `/admin/subcategories/${id}`,
    method: "PUT",
    headers: {},
    postData: data,
  };
  return invokeApi(reqObj);
};

export const updateProduct = async (id, data) => {
  const reqObj = {
    path: `/admin/products/${id}`,
    method: "PUT",
    headers: {},
    postData: data,
  };
  return invokeApi(reqObj);
};

export const updateVariant = async (id, data) => {
  const reqObj = {
    path: `/admin/variants/${id}`,
    method: "PUT",
    headers: {},
    postData: data,
  };
  return invokeApi(reqObj);
};