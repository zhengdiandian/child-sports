import request from "@/utils/request";
import { download } from "@/utils/download";

const api = {
  list: "/announcementManagement/announcement/list",
  addAndRelease: "/announcementManagement/announcement/addAndRelease",
  updateAndRelease: '/announcementManagement/announcement/updateAndRelease',
  getAnnouncement: "/announcementManagement/announcement",
  exportAnnouncement: "/announcementManagement/announcement/export",
  update: "/announcementManagement/announcement/update",
  add:'/announcementManagement/announcement/add',
  takeDown:'/announcementManagement/announcement/takeDown/',
  announcementDelete:  "/announcementManagement/announcement/delete/",
  release: '/announcementManagement/announcement/release/'

};
export const  allUrlNames = [api.add, api.addAndRelease, api.update, api.updateAndRelease]
export function takeDown(path:string, loading = false) {
  return request({
    method: "POST",
    url: api.takeDown + path,
    loading
  });
}
export function release(path:string, loading = false) {
  return request({
    method: "POST",
    url: api.release + path,
    loading
  });
}

export function announcementDelete(path:string, loading = false) {
  return request({
    method: "POST",
    url: api.announcementDelete + path,
    loading
  });
}

export function addAndRelease(parameter: object, loading = false) {
  return request({
    method: "POST",
    url: api.addAndRelease,
    params: parameter,
    loading
  });
}



export function exportAnnouncement(parameter: object) {
  return request({
    url: api.exportAnnouncement,
    method: "GET",
    params: parameter,
    responseType: "blob",
    loading: true,
  }).then((response: any) => download(response, "公告.xls"));
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

export function add( data : any, loading = true) {
  return request({
    method: "POST",
    url: api.add,
    data,
    loading,
  });
}
export function all( data : any,urlIndex = 0, loading = true) {
  return request({
    method: "POST",
    url: allUrlNames[urlIndex],
    data,
    loading,
  });
}
