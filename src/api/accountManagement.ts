import request from "@/utils/request";

const api = {
  list: "/admin/list",
  updateStatus: "/admin/updateStatus/",
  register: "/admin/register",
  adminDelete: "/admin/delete/",
  listAll: "/role/listAll",
  updateAdmin: "/admin/updateAdmin",
  resetPassword: "/admin/resetPassword",
  updatePassword: "/admin/updatePassword",
  account: "/admin/account/",
  updateAccount: "/admin/updateAccount"
};

export function updateAccount(parameter: object, loading = false) {
  return request({
    method: "POST",
    url: api.updateAccount,
    data: parameter,
    loading
  });
}

export function account(id: any, loading = false) {
  debugger
  return request({
    method: "get",
    url: api.account + id,
    loading
    // params
  });
}

export function updatePassword(parameter: object, type = `update`, loading = false) {
  return request({
    method: "POST",
    url: type === "update" ? api.updatePassword : api.resetPassword,
    data: parameter,
    loading
  });
}

export function listAll(loading = false) {
  return request({
    method: "get",
    url: api.listAll,
    loading
    // params
  });
}

export function adminDelete(params: any, loading = false) {
  return request({
    method: "POST",
    url: api.adminDelete + params.id,
    loading
    // params
  });
}

export function register(parameter: object, loading = false) {
  return request({
    method: "POST",
    url: api.register,
    data: parameter,
    loading
  });
}

export function updateStatus(params: any, loading = false) {
  return request({
    method: "POST",
    url: api.updateStatus + params.id,
    loading,
    params
  });
}


export function release(path: string, loading = false) {
  return request({
    method: "POST",
    url: api.release + path,
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


export function updateAdmin(parameter: object, loading = true) {
  return request({
    method: "POST",
    url: api.updateAdmin,
    data: parameter,
    loading
  });
}

export function resetPassword(data: any, loading = true) {
  return request({
    method: "POST",
    url: api.resetPassword,
    data,
    loading
  });
}
