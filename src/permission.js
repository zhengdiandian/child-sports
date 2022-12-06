import router from "./router";
import {ElMessage} from "element-plus";
import "nprogress/nprogress.css"; // progress bar style
import {getToken} from "@/utils/auth"; // get token from cookie
// import getPageTitle from '@/utils/get-page-title'
import setting from "../setting";
import store from "@/store";

// NProgress.configure({ showSpinner: true }) // NProgress Configuration

const whiteList = ["/login", '/report']; // no redirect whitelist

router.beforeEach(async (to, from, next) => {
  // start progress bar
  // NProgress.start()
  console.log(router.getRoutes(), "查看现有路由");

  // set page title
  document.title = setting.name;
  // determine whether the user has logged in
  const hasToken = getToken();

  if (hasToken) {
    if (!store.state?.routeMark) {
      // store.state.User?.routeList.map((route) => router.addRoute(route));
      // router.addRoutes(store.state.User?.routeList ?? []);
      // navigationList 是上面模拟接口返回的数据
      // 这里将新的路由都作为 home 的子路由(实际开发根据情况)
      // meta 是存储一些信息，可以用于权限校验或其他

      console.log(router.getRoutes(), "查看现有路由");
      await store.dispatch("User/getRoutes");
      // next();
      return await next({ ...to, replace: true });     //路由进行重定向放行
    } else {
      return next();
    }
    if (to.path === "/login") {
      // if is logged in, redirect to the home page


      return next();
      // NProgress.done()
    } else {

      const hasGetUserInfo = true;
      if (hasGetUserInfo) {
        next();
      } else {
        try {
          // get user info
          // await store.dispatch('user/getInfo')

          return next();
        } catch (error) {
          // remove token and go to login page to re-login
          // await store.dispatch('user/resetToken')
          ElMessage.error(error || "Has Error");
          return next(`/login?redirect=${to.path}`);
          // NProgress.done()
        }
      }
    }
  } else {
    /* has no token */
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next();
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`);
      // NProgress.done()
    }
  }
});

router.afterEach((THIS) => {
  // finish progress bar
  // NProgress.done()
  // store.dispatch('app/closeSideBar', { withoutAnimation: false })
});
