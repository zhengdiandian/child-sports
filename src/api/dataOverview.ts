import request from "@/utils/request";
import { IDailyPhysical } from "@/interface/data-overview";

const api = {
  get_examName: "/kanban/getExamName",
  get_project: "/kanban/getProject",
  get_score: "/kanban/doDistrict/score",
  get_avg: "/kanban/doDistrict/avg",
  get_school_score: "/kanban/doSchool/score",
  get_school_avg: "/kanban/doSchool/avg",
  get_grade_score: "/kanban/doGrade/score",
  get_grade_avg: "/kanban/doGrade/avg",
  get_class_score: "/kanban/doClass/score",
  get_class_avg: "/kanban/doClass/avg",
  dailyPhysical: "/kanban/dataOverview/dailyPhysical",
  score: "/kanban/dataOverview/score",
  gender: "/kanban/dataOverview/gender",
  total: "/kanban/dataOverview/total"

};

export function total(parameter: IDailyPhysical) {
  return request({
    method: "GET",
    url: api.total,
    params: parameter
  });
}

export function gender(parameter: IDailyPhysical) {
  return request({
    method: "GET",
    url: api.gender,
    params: parameter
  });
}

export function score(parameter: IDailyPhysical) {
  return request({
    method: "GET",
    url: api.score,
    params: parameter
  });
}

export function dailyPhysical(parameter: IDailyPhysical) {
  return request({
    method: "GET",
    url: api.dailyPhysical,
    params: parameter
  });
}

export function getExamName(parameter: any) {
  return request({
    method: "POST",
    url: api.get_examName,
    data: parameter
  });
}

export function getProject(parameter: any) {
  return request({
    method: "POST",
    url: api.get_project,
    data: parameter
  });
}

export function getScore(parameter: any) {
  return request({
    method: "POST",
    url: api.get_score,
    data: parameter
  });
}

export function getAvg(parameter: any) {
  return request({
    method: "POST",
    url: api.get_avg,
    data: parameter
  });
}

export function getSchoolScore(parameter: any) {
  return request({
    method: "GET",
    url: api.get_school_score,
    params: parameter
  });
}

export function getSchoolAvg(parameter: any) {
  return request({
    method: "GET",
    url: api.get_school_avg,
    params: parameter
  });
}

export function getGadeScore(parameter: any) {
  return request({
    method: "POST",
    url: api.get_grade_score,
    data: parameter
  });
}

export function getGadeAvg(parameter: any) {
  return request({
    method: "POST",
    url: api.get_grade_avg,
    data: parameter
  });
}

export function getClassScore(parameter: any) {
  return request({
    method: "GET",
    url: api.get_class_score,
    params: parameter
  });
}

export function getClassAvg(parameter: any) {
  return request({
    method: "GET",
    url: api.get_class_avg,
    params: parameter
  });
}
