import request from "@/utils/request";
import {download} from "@/utils/download";

const api = {
  infantInfoDelete: '/infantTestRecord/infantInfo/delete',
  list: "/infantTestRecord/infantInfo/list",
  downloadTemplate: '/infantTestRecord/infantInfo/downloadTemplate',
  update: "/infantTestRecord/infantInfo/update",
  add: "/infantTestRecord/infantInfo/add",
  infantInfoExport: "/infantTestRecord/infantInfo/export",
  listProjects: "/sportsManagement/peManagement/peList/listProjects",
  peListDelete: "/sportsManagement/peManagement/peList/delete",
  infantInfoImport: '/infantTestRecord/infantInfo/import',
  infantTestRecordAdd: "/infantTestRecord/infantTestRecord/add",
  infantTestRecordDelete: '/infantTestRecord/infantTestRecord/delete',
  infantTestRecordExport: ' /infantTestRecord/infantTestRecord/export',
  infantTestRecordImport: '/infantTestRecord/infantTestRecord/import',
  infantTestRecordList: '/infantTestRecord/infantTestRecord/list',
  listSingle: '/infantTestRecord/infantTestRecord/listSingle',
  infantTestRecordUpdate: '/infantTestRecord/infantTestRecord/update',
  Curve: '/infantTestRecord/recordShare/Curve',
  report: '/infantTestRecord/recordShare/report',
  infantTestRecordDownloadTemplate: '/infantTestRecord/infantTestRecord/downloadTemplate'
};

export function infantTestRecordDownloadTemplate(parameter: object, loding = true) {
  return request({
    url: api.downloadTemplate,
    method: "GET",
    params: parameter,
    responseType: "blob",
    loading: true
  }).then((response: any) => download(response, "测试记录模板.xls"));
}

export function infantTestRecordUpdate(parameter: object, loading = true) {
  return request({
    method: "POST",
    url: api.infantTestRecordUpdate,
    data: parameter,
    loading
  });
}

export function infantTestRecordImport(parameter: object, loading = true) {
  return request({
    method: "POST",
    url: api.infantTestRecordImport,
    data: parameter,
    loading
  });
}

export function infantTestRecordList(parameter: object, loading = true) {
  return request({
    method: "GET",
    url: api.infantTestRecordList,
    params: parameter,
    loading
  });
}

export function infantTestRecordExport(parameter: object, loding = true) {
  return request({
    url: api.infantTestRecordExport,
    method: "GET",
    params: parameter,
    responseType: "blob",
    loading: true
  }).then((response: any) => download(response, "测试记录管理.xls"));
}

export function infantTestRecordDelete(parameter: object, loading = true) {
  return request({
    method: "POST",
    url: api.infantTestRecordDelete,
    params: parameter,
    loading
  });
}

export function infantTestRecordAdd(data: any, loading = true) {
  return request({
    method: "POST",
    url: api.infantTestRecordAdd,
    data,
    loading
  });
}

export function infantInfoImport(parameter: object, loading = true) {
  return request({
    method: "POST",
    url: api.infantInfoImport,
    data: parameter,
    loading
  });
}

export function infantInfoDelete(parameter: object, loading = true) {
  return request({
    method: "POST",
    url: api.infantInfoDelete,
    params: parameter,
    loading
  });
}

export function downloadTemplate(parameter: object, loding = true) {
  return request({
    url: api.downloadTemplate,
    method: "GET",
    params: parameter,
    responseType: "blob",
    loading: true
  }).then((response: any) => download(response, "学员管理模板.xls"));
}

export function infantInfoExport(parameter: object, loding = true) {
  return request({
    url: api.infantInfoExport,
    method: "GET",
    params: parameter,
    responseType: "blob",
    loading: true
  }).then((response: any) => download(response, "学员管理.xls"));
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
