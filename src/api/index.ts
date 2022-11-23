import request from "../utils/request";

const api = {
  login: "/admin/login",
  get: "/admin/captcha/get",
  refresh: "/admin/captcha/refresh",
  get_all_schoolNames: "/basicInfoManager/getAllSchoolNames",
  class_school_info: "/basicInfoManager/classSchoolInfo",
  get_classNames: "/basicInfoManager/getAllClassNames",
  check: "/admin/captcha/check",
  get_role: "/admin/role/",
  info: "/admin/info"
};

export function info(loading = false) {
  return request({
    url: api.info,
    method: "GET",
    loading
  });
}

export function check(parameter: any) {
  return request({
    url: api.check,
    method: "POST",
    data: parameter
  });
}

export function login(parameter: any) {
  return request({
    url: api.login,
    method: "post",
    data: parameter
  });
}

export function get(parameter: any) {
  return request({
    url: api.get,
    method: "POST",
    params: parameter
  });
}

export function refresh(parameter: any) {
  return request({
    url: api.refresh,
    method: "POST",
    data: parameter
  });
}

export function getAllSchoolNames(parameter: any, loading = false) {
  return request({
    url: api.get_all_schoolNames,
    method: "GET",
    loading,
    params: parameter
  });
}

export function getSchoolInfo(parameter: any, loading = false) {
  return request({
    url: api.class_school_info,
    method: "GET",
    loading,
    params: parameter
  });
}

export function getAllClassNames(parameter: any) {
  return request({
    url: api.get_classNames,
    method: "GET",
    params: parameter,
    loading: false
  });
}

export function getUserRole(parameter: any) {
  return request({
    url: api.get_role + parameter,
    method: "GET"
  });
}
