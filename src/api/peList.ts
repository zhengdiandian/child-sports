import request from "@/utils/request";
import { download } from "@/utils/download";

const api = {
  list: "/sportsManagement/peManagement/peList/list",
  update: "/sportsManagement/peManagement/peList/update",
  add: "/sportsManagement/peManagement/peList/add",
  peListExport: "/sportsManagement/peManagement/peList/export",
  listProjects: "/sportsManagement/peManagement/peList/listProjects",
  peListDelete: "/sportsManagement/peManagement/peList/delete"

};

export function peListExport(parameter: object, loding = true) {
  return request({
    url: api.peListExport,
    method: "GET",
    params: parameter,
    responseType: "blob",
    loading: true
  }).then((response: any) => download(response, "日常体育课管理.xls"));
}


export function listProjects(parameter: object, loading = true) {
  return request({
    method: "GET",
    url: api.listProjects,
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


export function update(parameter: object, loading = true) {
  return request({
    method: "POST",
    url: api.update,
    data: parameter,
    loading
  });
}

export function peListDelete(parameter: object, loading = true) {
  return request({
    method: "POST",
    url: api.peListDelete,
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
