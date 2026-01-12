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


export const createUser = async (data) => {

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
 
 

 

 
