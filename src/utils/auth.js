// import Cookies from 'js-cookie'

const TokenKey = "ti_yu_token";

export function getToken() {
  return sessionStorage.getItem(TokenKey);
  // return Cookies.get(TokenKey)
}

export function setToken(token, tokenHead) {
  return sessionStorage.setItem(TokenKey, tokenHead + token);
  // return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return sessionStorage.removeItem(TokenKey);
  // return Cookies.remove(TokenKey)
}

export function setUserRoles(roles) {
  const UserRoles = JSON.stringify(roles);
  return sessionStorage.setItem("user_roles", UserRoles);
}

export function getUserRoles() {
  return JSON.parse(sessionStorage.getItem("user_roles"));
}
