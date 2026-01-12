import { invokeApi } from "../Utils/InvokeApi";

export const deleteProduct = async (id) => {
  const reqObj = {
    path: `/product/delete/${id}`,
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
    },
    postData: {},
  };

  return invokeApi(reqObj);
};

export const deleteMultipleProducts = async (ids) => {
  const reqObj = {
    path: `/product/multipleDelete`,
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
    },
    postData: {
      ids, // array of product IDs
    },
  };

  return invokeApi(reqObj);
};


export const deleteAllRoles = async (data) => {
  const reqObj = {
    path: `/roles/multipleDelete`,
    method: "DELETE", // Ensure correct capitalization
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
    },
    postData: data,
  };
  
  return invokeApi(reqObj);
};

export const deleteAllUsers = async (data) => {
  const reqObj = {
    path: `/user/multipleDelete`,
    method: "DELETE", // Ensure correct capitalization
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
    },
    postData: data,
  };
  
  return invokeApi(reqObj);
};

 

 



