import { createStore } from "vuex";
import axios from "axios";
import { darkModeKey, styleKey } from "@/config.js";
import * as styles from "@/styles.js";
import createPersistedState from "vuex-persistedstate";
import BaseData from "@/store/modules/BaseData";
import BasicInfoManager from "./modules/BasicInfoManager";
import RandomTest from "@/store/modules/RandomTest";
import User from "@/store/modules/User";
import FreeTest from "@/store/modules/FreeTest";
import HomeWork from "@/store/modules/HomeWork";
import Exam from "@/store/modules/Exam";
import Admin from "@/store/modules/Admin";

export default createStore({
  state: {
    /* Styles */
    lightBorderStyle: "",
    lightBgStyle: "",
    asideStyle: "",
    asideBrandStyle: "",
    asideMenuCloseLgStyle: "",
    asideMenuLabelStyle: "",
    asideMenuItemStyle: "",
    asideMenuItemActiveStyle: "",
    asideMenuItemInactiveStyle: "",
    asideSubmenuListStyle: "",
    navBarItemLabelStyle: "",
    navBarItemLabelHoverStyle: "",
    navBarItemLabelActiveColorStyle: "",
    navBarMenuListUpperLabelStyle: "",
    tableTrStyle: "",
    tableTrOddStyle: "",
    overlayStyle: "",

    /* User */
    userName: null,
    userEmail: null,
    userAvatar: null,

    /* fullScreen - fullscreen form layout (e.g. login page) */
    isFullScreen: true,

    /* Aside */
    isAsideMobileExpanded: false,
    isAsideLgActive: false,

    /* Dark mode */
    darkMode: false,

    /* Field focus with ctrl+k (to register only once) */
    isFieldFocusRegistered: false,
    routeMark: false,


    /* Sample data (commonly used) */
    clients: [],
    history: []
  },
  mutations: {
    /* A fit-them-all commit */
    basic(state, payload) {
      state[payload.key] = payload.value;
    },

    /* Styles */
    styles(state, payload) {
      for (const key in payload) {
        if (["body", "html"].includes(key)) {
          continue;
        }

        state[`${key}Style`] = payload[key];
      }
    },

    /* User */
    user(state, payload) {
      if (payload.name) {
        state.userName = payload.name;
      }
      if (payload.email) {
        state.userEmail = payload.email;
      }
      if (payload.avatar) {
        state.userAvatar = payload.avatar;
      }
    }
  },
  actions: {
    setStyle({ commit, dispatch }, payload) {
      const style = styles[payload] ?? styles.basic;

      document.body.className = style.body;
      document.documentElement.className = style.html;

      if (localStorage[styleKey] !== payload) {
        localStorage.setItem(styleKey, payload);
      }

      commit("styles", style);
    },

    asideMobileToggle({ commit, state }, payload = null) {
      const isShow = payload !== null ? payload : !state.isAsideMobileExpanded;

      document.getElementById("app").classList[isShow ? "add" : "remove"]("ml-60", "lg:ml-0");

      document.documentElement.classList[isShow ? "add" : "remove"]("m-clipped");

      commit("basic", {
        key: "isAsideMobileExpanded",
        value: isShow
      });
    },

    asideLgToggle({ commit, state }, payload = null) {
      commit("basic", { key: "isAsideLgActive", value: payload !== null ? payload : !state.isAsideLgActive });
    },

    fullScreenToggle({ commit, state }, value) {
      commit("basic", { key: "isFullScreen", value });

      document.documentElement.classList[value ? "add" : "remove"]("full-screen");
    },

    darkMode({ commit, state }, payload = null) {
      const value = payload !== null ? payload : !state.darkMode;

      document.documentElement.classList[value ? "add" : "remove"]("dark");

      localStorage.setItem(darkModeKey, value ? "1" : "0");

      commit("basic", {
        key: "darkMode",
        value
      });
    },

    fetch({ commit }, payload) {
      axios
        .get(`data-sources/${payload}.json`)
        .then((r) => {
          if (r.data && r.data.data) {
            commit("basic", {
              key: payload,
              value: r.data.data
            });
          }
        })
        .catch(error => {
          alert(error.message);
        });
    }
  },
  plugins: [createPersistedState({
    storage: sessionStorage,
    paths: ["RandomTest", "FreeTest", "User", "HomeWork", "Exam", "Admin"]
  })],
  modules: {
    RandomTest,
    BaseData,
    BasicInfoManager,
    User,
    FreeTest,
    HomeWork,
    Exam,
    Admin
  }
});
