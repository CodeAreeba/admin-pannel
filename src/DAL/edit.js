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

export const updateCustomerStatus = async (id, data) => {
  const reqObj = {
    path: `/admin/customers/${id}/status`,
    method: "PATCH",
    headers: {},
    postData: data,
  };
  return invokeApi(reqObj);
};
export const updateOrderStatus = async (id, data) => {
  const reqObj = {
    path: `/admin/orders/${id}/status`,
    method: "PUT",
    headers: {},
    postData: data,
  };
  return invokeApi(reqObj);
};
export const restockInventory = async (data) => {
  const reqObj = {
    path: `/admin/inventory/restock`,
    method: "PATCH",
    headers: {},
    postData: data,
  };
  return invokeApi(reqObj);
};