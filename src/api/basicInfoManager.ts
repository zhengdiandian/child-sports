import request from "../utils/request";
import { download } from "@/utils/download";

const api = {
  add_school: "/basicInfoManager/bimSchool/add",
  school_list: "/basicInfoManager/bimSchool/list",
  school_delete: "/basicInfoManager/bimSchool/delete",
  school_export: "/basicInfoManager/bimSchool/export",
  school_import: "/basicInfoManager/bimSchool/import",
  school_update: "/basicInfoManager/bimSchool/update",
  download_school_template: "/basicInfoManager/bimSchool/downloadTemplate",
  class_list: "/basicInfoManager/bimClass/listBySchoolId",
  add_class: "/basicInfoManager/bimClass/add",
  update_class: "/basicInfoManager/bimClass/update",
  delete_class: "/basicInfoManager/bimClass/delete",
  class_export: "/basicInfoManager/bimClass/export",
  class_import: "/basicInfoManager/bimClass/import",
  download_class_template: "/basicInfoManager/bimClass/downloadTemplate",
  student_list: "/basicInfoManager/bimStudent/list",
  add_student: "/basicInfoManager/bimStudent/add",
  student_import: "/basicInfoManager/bimStudent/import",
  update_student: "/basicInfoManager/bimStudent/update",
  export_student: "/basicInfoManager/bimStudent/export",
  delete_student: "/basicInfoManager/bimStudent/delete",
  download_student_template: "/basicInfoManager/bimStudent/downloadTemplate",
  set_student_state: "/basicInfoManager/bimStudent/setState",
  teacher_list: "/basicInfoManager/bimTeacher/list",
  add_teacher: "/basicInfoManager/bimTeacher/add",
  teacher_update: "/basicInfoManager/bimTeacher/update",
  download_teacher_template: "/basicInfoManager/bimTeacher/downloadTemplate",
  teacher_setState: "/basicInfoManager/bimTeacher/setState",
  delete_teacher: "/basicInfoManager/bimTeacher/delete",
  teacher_expport: "/basicInfoManager/bimTeacher/export",
  import_teacher: "/basicInfoManager/bimTeacher/import",
  transferBatch: "/basicInfoManager/bimStudent/transferBatch"
};

export function transferBatch(parameter: any) {
  return request({
    url: api.transferBatch,
    method: "post",
    data: parameter,
    loading: true
  });
}

export function addSchool(parameter) {
  return request({
    url: api.add_school,
    method: "post",
    data: parameter
  });
}

export function getSchoolList(parameter) {
  return request({
    url: api.school_list,
    method: "GET",
    params: parameter
  });
}

export function deleteSchool(parameter) {
  return request({
    url: api.school_delete,
    method: "post",
    data: parameter
  });
}

export function exportSchool(parameter) {
  return request({
    url: api.school_export,
    method: "GET",
    responseType: "blob",
    loading: true,
    params: parameter
  }).then(response => download(response, "学校信息.xls"));
}

export function importSchool(parameter) {
  return request({
    url: api.school_import,
    method: "post",
    loading: true,
    headers: {
      "Content-Type": "multipart/form-data"
    },
    data: parameter
  });
}

export function upDateSchool(parameter) {
  return request({
    url: api.school_update,
    method: "post",
    data: parameter
  });
}

export function downloadSchoolTemplate(parameter) {
  return request({
    url: api.download_school_template,
    method: "GET",
    responseType: "blob",
    params: parameter,
    loading: true
  }).then((response: any) => download(response, "学校导入模版.xls"));
}

export function getClassList(parameter) {
  return request({
    url: api.class_list,
    method: "GET",
    params: parameter
  });
}

export function addClass(parameter) {
  return request({
    url: api.add_class,
    method: "post",
    data: parameter
  });
}

export function updateClass(parameter) {
  return request({
    url: api.update_class,
    method: "post",
    data: parameter
  });
}

export function deleteClass(parameter) {
  return request({
    url: api.delete_class,
    method: "post",
    data: parameter
  });
}

export function exportClass(parameter) {
  return request({
    url: api.class_export,
    method: "GET",
    responseType: "blob",
    params: parameter,
    loading: true
  }).then(response => download(response, "班级信息.xls"));
}

export function importClass(parameter) {
  return request({
    url: api.class_import,
    method: "post",
    headers: {
      "Content-Type": "multipart/form-data"
    },
    loading: true,
    data: parameter
  });
}

export function downloadClassTemplate(parameter) {
  return request({
    url: api.download_class_template,
    method: "GET",
    responseType: "blob",
    params: parameter,
    loading: true
  }).then(response => download(response, "班级导入模版.xls"));
}

export function getStudentList(parameter) {
  return request({
    url: api.student_list,
    method: "GET",
    params: parameter
  });
}

export function addStudent(parameter) {
  return request({
    url: api.add_student,
    method: "post",
    data: parameter
  });
}

export function updateStudent(parameter) {
  return request({
    url: api.update_student,
    method: "post",
    data: parameter
  });
}

export function deleteStudent(parameter) {
  return request({
    url: api.delete_student,
    method: "post",
    data: parameter
  });
}

export function importStudent(parameter, schoolId) {
  return request({
    url: api.student_import,
    method: "post",
    data: parameter,
    params: schoolId
  });
}

export function exportStudent(parameter) {
  return request({
    url: api.export_student,
    method: "GET",
    responseType: "blob",
    params: parameter
  }).then(response => download(response, "学生信息.xls"));
}

export function downloadStudentTemplate(parameter) {
  return request({
    url: api.download_student_template,
    method: "GET",
    responseType: "blob",
    params: parameter
  }).then(response => download(response, "学生导入模版.xls"));
}

export function setStudentState(parameter) {
  return request({
    url: api.set_student_state,
    method: "post",
    data: parameter
  });
}

export function getTeacherList(parameter) {
  return request({
    url: api.teacher_list,
    method: "GET",
    params: parameter
  });
}

export function addTeacher(parameter) {
  return request({
    url: api.add_teacher,
    method: "post",
    data: parameter
  });
}

export function updateTeacher(parameter) {
  return request({
    url: api.teacher_update,
    method: "post",
    data: parameter
  });
}

export function downloadTeacherTemplate(parameter) {
  return request({
    url: api.download_teacher_template,
    method: "GET",
    responseType: "blob",
    params: parameter
  }).then(response => download(response, "教师导入模版.xls"));
}

export function setStateTeacher(parameter) {
  return request({
    url: api.teacher_setState,
    method: "post",
    data: parameter
  });
}

export function deleteTeacher(parameter) {
  return request({
    url: api.delete_teacher,
    method: "post",
    data: parameter
  });
}

export function exportTeacher(parameter) {
  return request({
    url: api.teacher_expport,
    method: "GET",
    responseType: "blob",
    params: parameter
  }).then(response => download(response, "教师信息.xls"));
}


export function importTeacher(parameter, schoolId) {
  return request({
    url: api.import_teacher,
    method: "post",
    headers: {
      "Content-Type": "multipart/form-data"
    },
    data: parameter,
    params: schoolId
  });
}
