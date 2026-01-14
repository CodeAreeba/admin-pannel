import axios from "axios";
import { baseUrl } from "../Config/Config.js";

axios.defaults.headers.post["Content-Type"] = "application/json";

export async function invokeApi({
  path,
  method = "GET",
  headers = {},
  queryParams = {},
  postData = {},
}) {
  const reqObj = {
    method,
    url: baseUrl + path, 
    headers,
    params: queryParams,
  };

  if (["POST", "PUT", "DELETE"].includes(method)) {
    reqObj.data = postData;
  }

  console.log("<===REQUEST-OBJECT===>", reqObj);

  try {
    const results = await axios(reqObj);
    console.log("<===Api-Success-Result===>", results.data);
    return results.data;
  } catch (error) {
    if (error.response) {
      console.log("<===Api-Error===>", error.response.data);
      return error.response.data;
    } else if (error.request) {
      console.log("<===Api-Request-Error===> No response received:", error.request);
      return { message: "No response received from server." };
    } else {
      console.log("<===Api-Unknown-Error===>", error.message);
      return { message: "An unknown error occurred." };
    }
  }
}
