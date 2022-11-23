import request from "@/utils/request";
import { download2 } from "@/utils/download";


const api = {
  importNationDataList: "/national/importNationDataList",
  importStudentExtendList: "/national/importStudentExtendList",
  delete: "/national/deleteRecord",
  uploadStudentExtendList: "/national/uploadStudentExtendList",
  importNationDataDetails: "/national/importNationDataDetails"
};

export function importNationDataDetails(parameter: object, loading = true) {
  return request({
    method: "GET",
    url: api.importNationDataDetails,
    params: parameter,
    loading
  });
}

export function uploadStudentExtendList(parameter: object, filename: any = "国测系统导入表.xlsx", loading = true) {
  return request({
    method: "POST",
    url: api.uploadStudentExtendList,
    data: parameter,
    loading,
    headers: { "content-type": "application/json" },
    responseType: "blob"
  })
    .then((response: any) => download2(response, "application/excel;charset=UTF-8", filename));
}


export function importNationDataList(parameter: object, loading = true) {
  return request({
    method: "GET",
    url: api.importNationDataList,
    params: parameter,
    loading
  });
}

export function importStudentExtendList(parameter: object, loading = true) {
  return request({
    method: "POST",
    url: api.importStudentExtendList,
    data: parameter,
    loading,
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
}

export function deleteRecord(
  parameter: { recordId: number },
  loading = true
) {
  return request({
    method: "get",
    url: api.delete,
    params: parameter,
    loading
  });
}
