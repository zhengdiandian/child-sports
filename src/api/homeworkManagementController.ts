import request from "@/utils/request";
import { download } from "@/utils/download";

const api = {
  list: "/homeworkManagement/homeworkDataManagement/list",
  homeworkInfo: "/homeworkManagement/homeworkDataManagement/homeworkInfo",
  studentHomework: "/homeworkManagement/homeworkDataManagement/studentHomework",
  deleteHomeworkTiming: "/homeworkManagement/homeworkRelease/deleteHomeworkTiming",
  homeworkExport: "/homeworkManagement/homeworkDataManagement/export",
  homeworkReleaseExport: "/homeworkManagement/homeworkRelease/export",
  listTeacher: "/sportsManagement/customProject/listTeacher",
  listProject: "/homeworkManagement/homeworkRelease/listProject",
  updateHomeworkTiming: "/homeworkManagement/homeworkRelease/updateHomeworkTiming",
  listHomeworkTiming: "/homeworkManagement/homeworkRelease/listHomeworkTiming",
  listClass: "/basicInfoManager/bimTeacher/listClass",
  homeworkRelease: "/homeworkManagement/homeworkRelease/homeworkRelease",
  exportStudentHomework: "/homeworkManagement/homeworkDataManagement/exportStudentHomework",
  reviewHomework: "/homeworkManagement/homeworkDataManagement/homeworkReviews/reviewHomework",
  exportStudentHomeworkHistory: "/homeworkManagement/homeworkDataManagement/exportStudentHomeworkHistory",
  listStudentHomeworkById: "/homeworkManagement/homeworkDataManagement/listStudentHomeworkById",
  studentHomeworkHistory: "/homeworkManagement/homeworkDataManagement/studentHomeworkHistory",
  deleteHomework: "/homeworkManagement/delete/"
};

export function deleteHomework(parameter: any, loading = true) {
  return request({
    method: "POST",
    url: api.deleteHomework + parameter,
    loading
  });
}

export function studentHomeworkHistory(parameter: object, loading = true) {
  return request({
    method: "GET",
    url: api.studentHomeworkHistory,
    params: parameter,
    loading
  });
}

export function listStudentHomeworkById(parameter: object, loading = true) {
  return request({
    method: "GET",
    url: api.listStudentHomeworkById,
    params: parameter,
    loading
  });
}


export function exportStudentHomeworkHistory(parameter: object, fileName: string, loading = true) {
  return request({
    url: api.exportStudentHomeworkHistory,
    method: "GET",
    data: parameter,
    responseType: "blob",
    loading
  }).then((response: any) => download(response, fileName + "学生历史作业.xls"));
}

export function reviewHomework(parameter: object, loading = true) {
  return request({
    method: "POST",
    url: api.reviewHomework,
    data: parameter,
    loading
  });
}

export function exportStudentHomework(parameter: object, loading = true) {
  return request({
    url: api.exportStudentHomework,
    method: "POST",
    data: parameter,
    responseType: "blob",
    loading
  }).then((response: any) => download(response, "学生完成情况.xls"));
}

export function listClass(parameter: object, loading = true) {
  return request({
    method: "GET",
    url: api.listClass,
    params: parameter,
    loading
  });
}

export function deleteHomeworkTiming(parameter: object, loading = true) {
  return request({
    method: "POST",
    url: api.deleteHomeworkTiming,
    params: parameter,
    loading
  });
}

export function listHomeworkTiming(parameter: object, loading = true) {
  return request({
    method: "GET",
    url: api.listHomeworkTiming,
    params: parameter,
    loading
  });
}

export function updateHomeworkTiming(parameter: object, status = "保存", loading = true) {
  const url = status === "保存" ? api.homeworkRelease : api.updateHomeworkTiming;
  return request({
    method: "POST",
    url,
    data: parameter,
    loading
  });
}

export function listProject(parameter: object, loading = true) {
  return request({
    method: "POST",
    url: api.listProject,
    data: parameter,
    loading
  });
}

export function listTeacher(parameter: object, loading = true) {
  return request({
    method: "GET",
    url: api.listTeacher,
    params: parameter,
    loading
  });
}

export function studentHomework(parameter: object, loading = true) {
  return request({
    method: "POST",
    url: api.studentHomework,
    data: parameter,
    loading
  });
}

export function homeworkExport(parameter: object, loading = true) {
  return request({
    url: api.homeworkExport,
    method: "GET",
    params: parameter,
    responseType: "blob",
    loading
  }).then((response: any) => download(response, "作业管理.xls"));
}

export function homeworkReleaseExport(parameter: object, loading = true) {
  return request({
    url: api.homeworkReleaseExport,
    method: "GET",
    params: parameter,
    responseType: "blob",
    loading
  }).then((response: any) => download(response, "作业管理.xls"));
}


export function list(parameter: object, loading = true) {
  return request({
    method: "GET",
    url: api.list,
    params: parameter,
    loading
  });
}


export function homeworkInfo(parameter: object, loading = true) {
  return request({
    method: "GET",
    url: api.homeworkInfo,
    params: parameter,
    loading
  });
}
