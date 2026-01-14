import axios from "axios";
import { baseUrl } from "../Config/Config";

export async function invokeApi({
  path,
  method = "GET",
  headers = {},
  queryParams = {},
  postData = {},
}) {
  const fullUrl = baseUrl + path;
  
  console.log("🔵 BASE URL:", baseUrl);
  console.log("🔵 FULL URL:", fullUrl);
  console.log("🔵 METHOD:", method);
  console.log("🔵 POST DATA:", postData);
  console.log("🔵 HEADERS:", headers);

  const reqObj = {
    method,
    url: fullUrl,
    headers: {
      "Content-Type": "application/json",
      ...headers
    },
    params: queryParams,
  };

  if (["POST", "PUT", "DELETE"].includes(method)) {
    reqObj.data = postData;
  }

  try {
    const results = await axios(reqObj);
    console.log(" SUCCESS:", results.data);
    return results.data;
  } catch (error) {
    console.error("❌ ERROR DETAILS:");
    console.error("Message:", error.message);
    console.error("Response:", error.response?.data);
    console.error("Status:", error.response?.status);
    
    if (error.response) {
      return error.response.data;
    }
    return { 
      status: 500,
      message: error.message || "Network error" 
    };
  }
}