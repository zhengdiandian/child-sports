import request from "@/utils/request";
import { download } from "@/utils/download";

const api = {
  list: "/sportsManagement/customProject/list",
  update: "/sportsManagement/customProject/update",
  listClasses: "/sportsManagement/customProject/listClasses",
  listById: "/sportsManagement/customProject/listById",
  add: "/sportsManagement/customProject/add",
  peListExport: "/sportsManagement/peManagement/peList/export",
  customProjectDelete: "/sportsManagement/customProject/delete",
  listTeacher: "/sportsManagement/customProject/listTeacher"
};

export function listTeacher(parameter: object, loading = true) {
  return request({
    method: "GET",
    url: api.listTeacher,
    params: parameter,
    loading
  });
}

export function listClasses(parameter: object, loading = true) {
  return request({
    method: "GET",
    url: api.listClasses,
    params: parameter,
    loading
  });
}

export function peListExport(parameter: object, loding = true) {
  return request({
    url: api.peListExport,
    method: "GET",
    params: parameter,
    responseType: "blob",
    loading: true
  }).then((response: any) => download(response, "日常体育课管理.xls"));
}


export function list(parameter: object, loading = true) {
  return request({
    method: "GET",
    url: api.list,
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

export function customProjectDelete(parameter: object, loading = true) {
  return request({
    method: "POST",
    url: api.customProjectDelete,
    params: parameter,
    loading
  });
}

export function add(data: any, loading = true) {
  return request({
    method: "POST",
    url: api.add,
    data,
    loading
  });
}
