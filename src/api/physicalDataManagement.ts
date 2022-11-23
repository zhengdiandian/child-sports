import request from "@/utils/request";
import { ExamListAddParams } from "@/interface/examListAdd";
import { BizUpdateSchoolexamParam } from "@/interface/examUpdate";

export interface ExamList {
  fuzzyQuery?: "";
  pageNum?: number;
  pageSize?: number;
  schoolId: number;
  schoolexamDateMax?: string;
  schoolexamDateMin?: string;
  schoolexamGrade: number | undefined;
}

const api = {
  list: "/sportsManagement/examManagement/examList/list",
  add: "/sportsManagement/examManagement/examList/add",
  delete: "/sportsManagement/examManagement/examList/delete",
  update: "/sportsManagement/examManagement/examList/update",
  getClasses: "/sportsManagement/getClasses"
};

export function getClasses(parameter: object, loading = true) {
  return request({
    method: "POST",
    url: api.getClasses,
    params: parameter,
    loading
  });
}

export function update(parameter: BizUpdateSchoolexamParam, loading = true) {
  return request({
    method: "POST",
    url: api.update,
    data: parameter,
    loading
  });
}

export function examList(parameter: ExamList, loading = true) {
  return request({
    method: "GET",
    url: api.list,
    params: parameter,
    loading
  });
}

export function add(parameter: ExamListAddParams, loading = true) {
  return request({
    method: "POST",
    url: api.add,
    data: parameter,
    loading
  });
}

export function examListDelete(
  parameter: { schoolexamId: number },
  loading = true
) {
  return request({
    method: "POST",
    url: api.delete,
    params: parameter,
    loading
  });
}
