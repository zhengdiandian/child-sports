import "@abraham/reflection";

import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./permission";
import { darkModeKey, styleKey } from "@/config.js";
import "element-plus/theme-chalk/el-loading.css";
import "element-plus/theme-chalk/el-message.css";
import "element-plus/theme-chalk/el-message-box.css";
// import './utils/flexible'
// import "./styles/element/index.scss";
import "./css/main.css";
// import "./styles/index.scss";
/* Fetch sample data */
import vue3videoPlay from "vue3-video-play"; // 引入组件
import "vue3-video-play/dist/style.css"; // 引入css
import setting from "../setting";

store.dispatch("fetch", "clients");
store.dispatch("fetch", "history");

/* App style */
store.dispatch("setStyle", localStorage[styleKey] ?? "basic");

/* Dark mode */
if ((!localStorage[darkModeKey] && window.matchMedia("(prefers-color-scheme: dark)").matches) || localStorage[darkModeKey] === "1") {
  store.dispatch("darkMode", true);
}

/* Default title tag */
const defaultDocumentTitle = setting.name;

/* Collapse mobile aside menu on route change */
router.beforeEach(to => {
  store.dispatch("asideMobileToggle", false);
  store.dispatch("asideLgToggle", false);
});

router.afterEach(to => {
  /* Set document title from route meta */
  if (to.meta && to.meta.title) {
    document.title = `${to.meta.title} — ${defaultDocumentTitle}`;
  } else {
    document.title = defaultDocumentTitle;
  }

  /* Full screen mode */
  store.dispatch("fullScreenToggle", !!to.meta.fullScreen);
});

createApp(App).use(store).use(router).use(vue3videoPlay).mount("#app");
