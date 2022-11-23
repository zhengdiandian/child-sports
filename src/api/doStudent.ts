import request from "@/utils/request";
import { download } from "@/utils/download";

const api = {
  query: "/kanban/doStudent/query",
  doStudentExport: "/kanban/doStudent/export",
  history: "/kanban/doStudent/target/history",
  detail: "/kanban/doStudent/target/history/detail",
  progress: "/kanban/doStudent/target/progress",
  historyExport: "/kanban/doStudent/target/history/export",
  check: "/kanban/doStudent/target/check"
};

export function check(parameter: object, loading = true) {
  return request({
    url: api.check,
    method: "post",
    params: parameter,
    loading
  });
}

export function progress(parameter: object, loading = true) {
  return request({
    url: api.progress,
    method: "get",
    params: parameter,
    loading
  });
}

export function detail(parameter: object, loading = true) {
  return request({
    url: api.detail,
    method: "get",
    params: parameter,
    loading
  });
}

export function history(parameter: object, loading = true) {
  return request({
    url: api.history,
    method: "get",
    params: parameter,
    loading
  });
}

export function query(parameter: object, loading = true) {
  return request({
    url: api.query,
    method: "post",
    data: parameter,
    loading
  });
}

export function doStudentExport(parameter: object, loading = true) {
  return request({
    url: api.doStudentExport,
    method: "POST",
    data: parameter,
    responseType: "blob",
    loading
  }).then((response: any) => download(response, "学生数据.xls"));
}


export function historyExport(parameter: object, fileName = "", loading = true) {
  return request({
    url: api.historyExport,
    method: "GET",
    params: parameter,
    responseType: "blob",
    loading
  }).then((response: any) => download(response, fileName + "自定义目标.xls"));
}

