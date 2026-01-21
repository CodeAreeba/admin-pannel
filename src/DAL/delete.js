import { invokeApi } from "../Utils/InvokeApi";

export const deleteAdmins = async (data) => {
  const reqObj = {
    path: `/admin`,
    method: "DELETE", 
    headers: {},
    postData: data,
  };

  return invokeApi(reqObj);
};
export const deleteCategories = async (data) => {
  const reqObj = {
   path: `/admin/categories`,
    method: "DELETE", 
    headers: {},
    postData: data,
  };

  return invokeApi(reqObj);
};
export const deleteSubCategories = async (data) => {
  const reqObj = {
    path: `/admin/subcategories`,
    method: "DELETE", 
    headers: {},
    postData: data,
  };

  return invokeApi(reqObj);
};

export const deleteProducts = async (data) => {
  const reqObj = {
   path: `/admin/products`,
    method: "DELETE", 
    headers: {},
    postData: data,
  };

  return invokeApi(reqObj);
};
export const deleteVariants = async (data) => {
  const reqObj = {
    path: `/admin/variants`,
    method: "DELETE", 
    headers: {},
    postData: data,
  };

  return invokeApi(reqObj);
};

