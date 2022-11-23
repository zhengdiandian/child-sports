import request from "@/utils/request";
import { BizUpdateSchoolexamParam } from "@/interface/examUpdate";

const api = {
  list: "/sportsManagement/freetest/list",
  update: "/sportsManagement/freetest/update",
  freetestInfo: "/sportsManagement/freetest/freetestInfo",
  add: "/sportsManagement/freetest/add",
  freeTestExport: "/sportsManagement/freetest/export",
  getStudentNameAndIds: "/sportsManagement/getStudentNameAndIds"


};

export function getStudentNameAndIds(parameter: object, loading = false) {
  return request({
    method: "GET",
    url: api.getStudentNameAndIds,
    params: parameter,
    loading
  });
}

export function list(parameter: object, loading = true) {
  return request({
    method: "GET",
    url: api.list,
    params: parameter,
    loading
  });
}

export function freetestInfo(parameter: object, loading = true) {
  return request({
    method: "GET",
    url: api.freetestInfo,
    params: parameter,
    loading
  });
}

export function update(parameter: object, loading = true) {
  return request({
    method: "POST",
    url: api.update,
    data: parameter,
    loading
  });
}

export function add({params,data}:any, loading = true) {
  return request({
    method: "POST",
    url: api.add,
    params,
    data,
    loading,
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
}
