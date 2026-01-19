import { invokeApi } from "../Utils/InvokeApi";

export const updateProduct = async (id, productData) => {
  const reqObj = {
    path: `/product/update/${id}`,
    method: "PUT",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
    },
    postData: productData,
  };

  return invokeApi(reqObj);
};

export const updateRole = async (id, data) => {
  const reqObj = {
    path: `/roles/update/${id}`,
    method: "PUT",
    headers: { Authorization: `Bearer ${localStorage.getItem("Token")}` },
    postData: data,
  };
  return invokeApi(reqObj);
};
///////////////////////////////////////////
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
    path: `/admin//category${id}`,
    method: "PUT",
    headers: {},
    postData: data,
  };
  return invokeApi(reqObj);
};

export const updateSubcategory = async (id, data) => {
  const reqObj = {
    path: `/admin/subcategories/${id}`,
    method: "PUT",
    headers: {},
    postData: data,
  };
  return invokeApi(reqObj);
};