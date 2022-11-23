import request from "@/utils/request";
import { download } from "@/utils/download";

const api = {
  list: "/sportsManagement/peManagement/peData/list",
  peDataExport: "/sportsManagement/peManagement/peData/export",
  addOrUpdate: "/sportsManagement/peManagement/peData/addOrUpdate",
  dailytestRes: "/sportsManagement/peManagement/peData/dailytestRes",
  downloadTemplate: "/sportsManagement/peManagement/peData/downloadTemplate",
  exportStudentTestData: "/sportsManagement/peManagement/peData/exportStudentTestData",
  peDataImport: "/sportsManagement/peManagement/peData/import",
  listDailyTestById: "/sportsManagement/peManagement/peData/listDailyTestById",
  listDataInThisSemester: "/sportsManagement/peManagement/peData/listDataInThisSemester",
  listNew: "/sportsManagement/peManagement/peData/listNew",
  listStudentTestData: "/sportsManagement/peManagement/peData/listStudentTestData",
  update: "/sportsManagement/peManagement/peData/update",
  lighting: "/sportsManagement/peManagement/project/lighting",
  listPerformanceInThisSemester: "sportsManagement/peManagement/peData/listPerformanceInThisSemester"

};

export function listPerformanceInThisSemester(parameter: object, loading = false) {
  return request({
    method: "GET",
    url: api.listPerformanceInThisSemester,
    params: parameter,
    loading
  });
}

export function lighting(parameter: object, loading = false) {
  return request({
    method: "POST",
    url: api.lighting,
    params: parameter,
    loading
  });
}

export function addOrUpdate(parameter: object, loading = false) {
  return request({
    method: "POST",
    url: api.addOrUpdate,
    params: parameter,
    loading
  });
}

export function dailytestRes(parameter: object, loading = false) {
  return request({
    method: "GET",
    url: api.dailytestRes,
    params: parameter,
    loading
  });
}

export function downloadTemplate(parameter: object, fileName: string) {
  return request({
    url: api.downloadTemplate,
    method: "GET",
    params: parameter,
    responseType: "blob",
    loading: true
  }).then((response: any) => download(response, fileName + "体育课成绩导入模板.xls"));
}

export function exportStudentTestData(parameter: object, fileName = "") {
  return request({
    url: api.exportStudentTestData,
    method: "GET",
    params: parameter,
    responseType: "blob",
    loading: true
  }).then((response: any) => download(response, fileName + "训练详情.xls"));
}

export function peDataExport(parameter: object, fileName: string) {
  return request({
    url: api.peDataExport,
    method: "GET",
    params: parameter,
    responseType: "blob",
    loading: true
  }).then((response: any) => download(response, fileName + "体育课成绩.xls"));
}

export function peDataImport(parameter: object, loading = true) {
  return request({
    url: api.peDataImport,
    method: "POST",
    data: parameter,
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
}

export function listDailyTestById(parameter: object, loading = false) {
  return request({
    method: "GET",
    url: api.listDailyTestById,
    params: parameter,
    loading
  });
}

export function listDataInThisSemester(parameter: object, loading = false) {
  return request({
    method: "GET",
    url: api.listDataInThisSemester,
    params: parameter,
    loading
  });
}

export function listStudentTestData(parameter: object, loading = false) {
  return request({
    method: "GET",
    url: api.listStudentTestData,
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

export function listNew(parameter: object, loading = true) {
  return request({
    method: "GET",
    url: api.listNew,
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

export function add({ params, data }: any, loading = true) {
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
