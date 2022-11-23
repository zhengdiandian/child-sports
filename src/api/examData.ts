import request from "@/utils/request";
import { ExamId, ExportStudentExamData, ListOfExamData, StudentDetail, TemplateResult } from "@/interface/examData";
import { download } from "@/utils/download";


const api = {
  list: "/sportsManagement/examManagement/examData/list",
  update: "/sportsManagement/examManagement/examData/update",
  examResult: "/sportsManagement/examManagement/examData/examResult",
  import: "/sportsManagement/examManagement/examData/import",
  export: "/sportsManagement/examManagement/examData/export",
  downloadTemplate: "/sportsManagement/examManagement/examData/downloadTemplate",
  examManagement: "/sportsManagement/examManagement/list",
  listStudentExamDataResult: "/sportsManagement/examManagement/examData/listStudentExamDataResult",
  getStudentExamData: "/sportsManagement/examManagement/examData/getStudentExamData",
  listNew: "/sportsManagement/examManagement/examData/listNew",
  getStudentInfo: "/sportsManagement/getStudentInfo",
  exportStudentExamData: "/sportsManagement/examManagement/examData/exportStudentExamData",
  clear: "/sportsManagement/examManagement/examData/clear",
  project: "/sportsManagement/peManagement/project",
  projectImport: "/sportsManagement/peManagement/project/import"

};

export function projectImport(parameter: any, loading = true) {
  return request({
    method: "POST",
    url: api.projectImport,
    data: parameter,
    loading
  });
}

export function project(parameter: object, loading = false) {
  return request({
    method: "GET",
    url: api.project,
    params: parameter,
    loading
  });
}

export function clear(parameter: any, loading = true) {
  return request({
    method: "POST",
    url: api.clear,
    params: parameter,
    loading
  });
}

export function exportStudentExamData(parameter: object, loading = true) {
  return request({
    method: "GET",
    url: api.exportStudentExamData,
    params: parameter,
    loading,
    responseType: "blob"

  }).then((response: TemplateResult) => download(response, "学生体测详情-.xls"));

}

export function getStudentInfo(parameter: object, loading = false) {
  return request({
    method: "GET",
    url: api.getStudentInfo,
    params: parameter,
    loading
  });
}

export function getStudentExamData(parameter: ExportStudentExamData, loading = true) {
  return request({
    method: "GET",
    url: api.getStudentExamData,
    params: parameter,
    loading
  });
}

export function listNew(parameter: StudentDetail, loading = true) {
  return request({
    method: "GET",
    url: api.listNew,
    params: parameter,
    loading
  });
}

export function listStudentExamDataResult(parameter: StudentDetail, loading = true) {
  return request({
    method: "GET",
    url: api.listStudentExamDataResult,
    params: parameter,
    loading
  });
}

export function examManagement(parameter: ExamId, loading = true) {
  return request({
    method: "GET",
    url: api.examManagement,
    params: parameter,
    loading
  });
}

export function examDataExport(parameter: any, fileName: any) {
  debugger
  return request({
    url: api.export,
    method: "GET",
    params: parameter,
    responseType: "blob",
    loading: true
  }).then((response: TemplateResult) => download(response, fileName + "成绩.xls"));
}

export function examDataImport(parameter: any, data: any) {
  return request({
    url: api.import,
    method: "post",
    params: parameter,
    data,
    headers: {
      "Content-Type": "multipart/form-data"
    },
    loading: true
  });
}

export function downloadExamTemplate(parameter: any, fileName: string) {
  return request({
    url: api.downloadTemplate,
    method: "GET",
    params: parameter,
    responseType: "blob",
    loading: true
  }).then((response: TemplateResult) => download(response, fileName + "成绩导入模板.xls"));
}

export function update(parameter: any, loading = true) {
  return request({
    method: "POST",
    url: api.update,
    data: parameter,
    loading
  });
}

export function list(parameter: ListOfExamData, loading = true) {
  return request({
    method: "GET",
    url: api.list,
    params: parameter,
    loading
  });
}

export function examResult(parameter: ExamId, loading = true) {
  return request({
    method: "GET",
    url: api.examResult,
    params: parameter,
    loading
  });
}
