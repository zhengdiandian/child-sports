import { getState } from "../store";
import { info } from "@/api/index";
import { routerList } from "@/router";
import router from "@/router/index";

const defaultState = {
  userRoles: {},
  routeList: [],
  routeMark: false,
  userName: ''

};
type State = typeof defaultState
let state;
try {
  state = getState("User");
} catch (e) {
  console.error(e);
  state = defaultState;
}

const mutations = {
  setUserRoles(state: State, userRoles: any) {
    state.userRoles = userRoles;
  },
  setRouteList(state: State, routeList: []) {
    state.routeList = routeList;
  },
  setRouteMark(state: State, routeMark: boolean) {
    state.routeMark = routeMark;
  },
  setUserName(state: State, userName: any) {
    state.userName = userName;
  },
};
const filterRoute = (list: any, menus: any) => {
  return list.filter((route: any) => {
    const { meta }: any = route;
    const { children }: any = route;

    const item: any = menus.find((item: any) => item.id === meta.id);
    if (item?.roleList) {
      item.roleList.forEach((role: any) => {
        meta[role] = true;
      });
      route.meta = meta;
    }
    if (children?.length) {
      route.children = filterRoute(children, menus);
    }
    if (item) {
      return true;
    }
  });
};
const actions = {
  async getRoutes({ commit, rootState }: any) {
    const { data } = await info();
    const { menus, username } = data;
    const list = filterRoute(routerList, menus);
    commit("setRouteList", list);
    commit('setUserName', username)
    list.map((route: any) => router.addRoute(route));
    // commit("setRouteMark", true);
    rootState.routeMark = true;
    console.log("list", list);
    console.log(router.getRoutes(), "查看现有路由");
    return list;

  }

};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
