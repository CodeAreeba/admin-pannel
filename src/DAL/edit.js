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


export const updateRole = async (id,data) => {
 
  const reqObj = {
    path: `/roles/update/${id}`,
    method: "PUT",
    headers: {      Authorization: `Bearer ${localStorage.getItem("Token")}`,},
    postData: data,
  };
  return invokeApi(reqObj);
};

export const updateUser = async (id,data) => {
 
  const reqObj = {
    path: `/user/update/${id}`,
    method: "PUT",
    headers: {      Authorization: `Bearer ${localStorage.getItem("Token")}`,},
    postData: data,
  };
  return invokeApi(reqObj);
};

 
 
