import axios from "axios";
// import { MessageBox, Message, Notification } from 'element-plus'
import { ElLoading, ElMessage, ElMessageBox } from "element-plus";
import "element-plus/theme-chalk/el-message-box.css";

import router from "@/router/index.js";
// import {useRouter} from 'vue'
import { getToken } from "@/utils/auth";

// const router = useRouter();

// console.log("import.meta.env", import.meta.env);
const _serveBaseURL = import.meta.env.VITE_VUE_APP_API_BASE_URL;
export const serveBaseURL = _serveBaseURL;

export function getBaseUrl() {
  return _serveBaseURL;
}

let loadingInstance;

const errorCallback = (error) => {
  console.error(error);
  try {
    loadingInstance.close();
  } catch (e) {
  }
  // ElMessage.error(error)
  return Promise.reject(error);
};
// create an axios instance
const service = axios.create({
  baseURL: getBaseUrl(), // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 500000, // request timeout
  headers: {
    "Content-Type": "application/json;charset=UTF-8"
  },
  responseType: "json"
});
JSON.stringifyIfObject = function stringifyIfObject(obj) {
  if (typeof obj === "object") return JSON.stringify(obj);
  else {
    console.log("found already stringified object");
    return obj;
  }
};
// request interceptor
service.interceptors.request.use(
  (config) => {
    // do something before request is sent
    if (config.loading === true || config.loading === undefined) {
      loadingInstance = ElLoading.service({
        lock: true,
        text: "加载中",
        background: "rgba(0, 0, 0, 0.3)"
      });
    }
    if (getToken() && config.url !== "/TokenAuth/Authenticate") {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers.authorization = getToken();
    } else {
      config.withCredentials = false;
    }
    // if (config.data) {
    //   config.data = JSON.stringifyIfObject(config.data)
    // }
    console.log("请求config", config);
    return config;
  },
  (error) => {
    console.error(222);
    // do something with request error
    console.error(error); // for debug
    loadingInstance.close();
    // ElMessage.error(error)
    return Promise.reject(error);
  }
);

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  (response) => {
    const { status, data } = response;
    console.info(response, "dfdsfsdafsdafdsafdsfsd");
    try {
      loadingInstance.close();
    } catch (e) {
    }
    if (
      status !== 200 ||
      data === null ||
      data.data === null ||
      (data.code !== undefined && data.code !== 200)
    ) {
      if (data.code === 401) {
        return ElMessageBox.alert(data.message, {
          showClose: false,
          type: "warning",
          center: true,
          confirmButtonText: "确定",
          callback() {
            localStorage.clear();
            sessionStorage.clear();
            router.push("/login");
          }
          // confirmButtonClass: 'inline-flex align-middle align-items-center justify-center font-medium focus:outline-none border-2 rounded-sm px-6 py-3 border-blue-600 bg-blue-600 hover:bg-blue-700 hover:border-blue-700 text-white rounded-sm text-white text-center py-3 bg-blue-500 w-full text-sm'
        });
        // return ElMessageBox.alert(data.message, {
        //   showClose: false,
        //   type: "warning",
        //   center: true,
        //   confirmButtonText: "确定",
        //   callback() {
        //     router.push({ name: "home" });
        //   }
        //   // confirmButtonClass: 'inline-flex align-middle align-items-center justify-center font-medium focus:outline-none border-2 rounded-sm px-6 py-3 border-blue-600 bg-blue-600 hover:bg-blue-700 hover:border-blue-700 text-white rounded-sm text-white text-center py-3 bg-blue-500 w-full text-sm'
        // });
      } else if (data.code !== 200) {
        ElMessage.error(`错误码:${data.code},错误信息:${data.message}`);
      }
      return Promise.reject(data);
    }

    if (data.data !== undefined) {
      return Promise.resolve(data);
    } else {
      return Promise.resolve(data);
    }
  },
  (error) => {
    try {
      loadingInstance.close();
      console.error(1);
      const { code, message } = error.response.data;
      console.error(error);

      if (error.response.status === 500) {
        if (code === 401) {
          return ElMessageBox.alert(message, {
            showClose: false,
            type: "warning",
            center: true,
            confirmButtonText: "确定",
            callback() {
              localStorage.clear();
              sessionStorage.clear();
              router.push("/login");
            }
            // confirmButtonClass: 'inline-flex align-middle align-items-center justify-center font-medium focus:outline-none border-2 rounded-sm px-6 py-3 border-blue-600 bg-blue-600 hover:bg-blue-700 hover:border-blue-700 text-white rounded-sm text-white text-center py-3 bg-blue-500 w-full text-sm'
          });
        }
        return ElMessage.error("服务器错误，请联系管理员。");
      }
    } catch (e) {
      console.error(e);
    }


    ElMessage.error(error.response.data.error);
    console.error("err" + error); // for debug
    // Message({
    //   message: error.message,
    //   type: 'error',
    //   duration: 5 * 1000
    // })
    return Promise.reject(error.response);
  }
);

export default service;
