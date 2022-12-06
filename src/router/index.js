import {createRouter, createWebHashHistory} from "vue-router";
import BasicLayout from "@/layout/BasicLayout.vue";

/*
 * showLeftMenu  ： false  不显示在侧边导航
 *
 *
 *
 * */
export const publicRouters = [
  // {
  //   path: "/:pathMatch(.*)",
  //   redirect: "/login",
  //   meta: {
  //     title: "Login",
  //     fullScreen: true,
  //     showLeftMenu: false
  //   }
  // },
  {
    meta: {
      title: "Login",
      fullScreen: true,
      showLeftMenu: false
    },
    path: "/login",
    name: "login",
    component: () =>
      import(/* webpackChunkName: "login" */ "@/views/Login.vue")
  },
  {
    meta: {
      title: "Login",
      fullScreen: true,
      showLeftMenu: false
    },
    path: "/report",
    name: "report",
    component: () =>
      import(/* webpackChunkName: "phoneReport" */ "@/views/toddlerDataManagement/phoneReport.vue")
  }
];
const routes = [
  // {
  //   path: "/:pathMatch(.*)",
  //   redirect: "/login",
  //   meta: {
  //     title: "Login",
  //     fullScreen: true,
  //     showLeftMenu: false
  //   }
  // },
  // {
  //   meta: {
  //     title: "Login",
  //     fullScreen: true,
  //     showLeftMenu: false
  //   },
  //   path: "/login",
  //   name: "login",
  //   component: () =>
  //     import(/* webpackChunkName: "login" */ "@/views/Login.vue")
  // },

  {
    meta: {
      title: "幼儿数据管理",
      icon: "icon-shuju",
      id: 1
      // fullScreen: true
    },
    path: "/dataOverview",
    name: "dataOverview",
    component: BasicLayout,
    children: [
      {
        meta: {
          id: 2,
          title: "学员管理"
          // hidden: true, // 是否显示，
          // add: false, //增加
          // delete: false //删除
          // fullScreen: true
        },
        path: "studentManagement",
        name: "studentManagement",
        component: () => import("@/views/toddlerDataManagement/studentManagement.vue")
      },
      {
        meta: {
          id: 2,
          title: "测试记录"
        },
        path: "testRecord",
        name: "testRecord",
        component: () => import("@/views/toddlerDataManagement/testRecord.vue")
      },
      {
        meta: {
          id: 2,
          title: "添加测试记录"
        },
        path: "addTestRecord",
        name: "addTestRecord",
        component: () => import("@/views/toddlerDataManagement/addTestRecord.vue")
      },
      // {
      //   meta: {
      //     id: 4,
      //     title: "校内班级对比"
      //   },
      //   path: "schoolClassComparison",
      //   name: "schoolClassComparison",
      //   component: () =>
      //     import("@/views/dataOverview/SchoolClassComparison.vue")
      // },
      // {
      //   meta: {
      //     id: 5,
      //     title: "学段纵向对比"
      //   },
      //   path: "longitudinalComparisonOfGrades",
      //   name: "longitudinalComparisonOfGrades",
      //   component: () =>
      //     import("@/views/dataOverview/LongitudinalComparisonOfGrades.vue")
      // },
      // {
      //   meta: {
      //     id: 6,
      //     title: "年度纵向对比"
      //   },
      //   path: "yearToYearComparison",
      //   name: "yearToYearComparison",
      //   component: () =>
      //     import("../views/dataOverview/YearToYearComparison.vue")
      // },
      //
      // {
      //   meta: {
      //     id: 45,
      //     title: "学生数据"
      //   },
      //   name: "studentIndex",
      //   path: "studentIndex",
      //   reTo: "studentData",
      //   redirect: "/dataOverview/studentIndex/studentData",
      //   component: SimpleLayout,
      //   children: [
      //     {
      //       meta: {
      //         id: 45,
      //         title: "学生数据",
      //         showLeftMenu: false
      //
      //       },
      //       name: "studentData",
      //       path: "studentData",
      //       component: () => import("@/views/dataOverview/studentData.vue")
      //     },
      //     {
      //       meta: {
      //         id: 45,
      //         title: "自定目标",
      //         showLeftMenu: false
      //
      //       },
      //       name: "studentInfoDetail",
      //       path: "studentInfoDetail",
      //       component: () => import("@/views/dataOverview/studentDetail.vue")
      //
      //     }
      //   ]
      // }
    ]
  },

  // {
  //   meta: {
  //     id: 7,
  //     title: "基本信息管理",
  //     icon: "icon-jibenxinxi-"
  //     // fullScreen: true
  //   },
  //   path: "/basicInformation",
  //   name: "basicInformation",
  //   component: BasicLayout,
  //   children: [
  //     {
  //       meta: {
  //         id: 8,
  //         title: "学校信息管理"
  //       },
  //       path: "schoolInformation",
  //       name: "schoolInformation",
  //       component: () => import("@/views/basicInfoManager/bimSchool/index.vue")
  //     },
  //     {
  //       meta: {
  //         id: 9,
  //         title: "班级信息管理"
  //       },
  //       path: "classInformation",
  //       name: "classInformation",
  //       component: () => import("@/views/basicInfoManager/bimClass/index.vue")
  //     },
  //     {
  //       meta: {
  //         id: 10,
  //         title: "学生信息管理"
  //       },
  //       path: "studentInformation",
  //       name: "studentInformation",
  //       component: () =>
  //         import("@/views/basicInfoManager/bimStudent/index.vue")
  //     },
  //     {
  //       meta: {
  //         id: 11,
  //         title: "教师信息管理"
  //       },
  //       path: "teacherInformation",
  //       name: "teacherInformation",
  //       component: () =>
  //         import("@/views/basicInfoManager/bimTeacher/index.vue")
  //     },
  //     {
  //       meta: {
  //         id: 32,
  //         title: "转学管理"
  //       },
  //       path: "transferManagement",
  //       name: "transferManagement",
  //       component: () =>
  //         import("@/views/basicInfoManager/transferManagement.vue")
  //     }
  //   ]
  // },
  // {
  //   meta: {
  //     id: 12,
  //     title: "校内数据管理",
  //     icon: "icon-jishiqi"
  //   },
  //   path: "/sportsManagementController",
  //   name: "sportsManagementController",
  //   component: BasicLayout,
  //   children: [
  //     {
  //       meta: {
  //         id: 14,
  //         title: "国测导入管理",
  //         showLeftMenu: false
  //       },
  //       path: "nationalTestData",
  //       name: "nationalTestData",
  //       component:
  //         () => import(
  //           "@/views/sportsManagementController/examManagement/nationalTestData.vue"
  //           )
  //     },
  //     {
  //       meta: {
  //         id: 14,
  //         title: "体质测试管理"
  //       },
  //       path: "examManagement",
  //       name: "examManagement",
  //       component: defineAsyncComponent(() =>
  //         import(
  //           "@/views/sportsManagementController/examManagement/emList.vue"
  //           ))
  //     },
  //     {
  //       meta: {
  //         title: "免测申请管理",
  //         id: 23
  //       },
  //       path: "freeTest",
  //       name: "freeTest",
  //       component: () => import("@/views/freeTest/freeTestList.vue")
  //     },
  //     {
  //       meta: {
  //         id: 23,
  //         title: "添加免测申请管理",
  //         showLeftMenu: false
  //       },
  //       path: "addFreeTest",
  //       name: "addFreeTest",
  //       component: () => import("@/views/freeTest/addFreeTest.vue")
  //     },
  //     {
  //       meta: { title: "自定义项目", id: 47 },
  //       name: "customItem",
  //       path: "customItem",
  //       component: import("@/views/pe/customItem.vue")
  //     },
  //     {
  //       meta: {
  //         title: "日常体育课管理",
  //         id: 18
  //       },
  //       redirect: "/peManagement/peList",
  //       path: "/peManagement",
  //       name: "peManagement",
  //       reTo: "peList",
  //       component: SimpleLayout,
  //
  //       children: [
  //         {
  //           path: "peList",
  //           name: "peList",
  //           meta: {
  //             id: 18,
  //             title: "日常体育课管理",
  //             showLeftMenu: false
  //
  //
  //           },
  //           component: () => import("@/views/pe/peList.vue")
  //
  //         },
  //         {
  //           path: "peDetail",
  //           name: "peDetail",
  //           meta: {
  //             id: 19,
  //             title: "训练详情",
  //             showLeftMenu: false
  //
  //
  //           },
  //           component: () => import("@/views/pe/peDetail.vue")
  //         },
  //         {
  //           path: "studentDetail",
  //           name: "studentDetail",
  //           meta: {
  //             id: 19,
  //             title: "学生个人体育课详情",
  //             showLeftMenu: false
  //
  //
  //           },
  //           component: () => import("@/views/pe/studentDetail.vue")
  //
  //         }
  //       ]
  //     },
  //     {
  //       meta: {
  //         id: 14,
  //         title: "体质测试详情",
  //         showLeftMenu: false
  //       },
  //       path: "exam",
  //       name: "exam",
  //
  //       component: SimpleLayout,
  //       children: [
  //         {
  //           meta: {
  //             id: 14,
  //             title: "体质测试详情"
  //             // showLeftMenu: false
  //
  //           },
  //           path: "examInfo",
  //           name: "examInfo",
  //           component: (() => import(
  //               "@/views/sportsManagementController/examManagement/examInfo.vue"
  //               )
  //           )
  //         },
  //         {
  //           meta: {
  //             id: 14,
  //             title: "体质测试详情"
  //             // showLeftMenu: false
  //
  //           },
  //           path: "examInfo",
  //           name: "examInfo",
  //           component: (() => import(
  //               "@/views/sportsManagementController/examManagement/examInfo.vue"
  //               )
  //           )
  //         },
  //         {
  //           meta: {
  //             id: 16,
  //             title: "学生体测详情"
  //             // showLeftMenu: false
  //
  //           },
  //           path: "examStudentDetail",
  //           name: "examStudentDetail",
  //           component: (() => import(
  //               "@/views/sportsManagementController/examManagement/examStudentDetail.vue"
  //               )
  //           )
  //         }
  //       ]
  //     }
  //
  //   ]
  // },
  // {
  //   meta: {
  //     title: "作业管理",
  //     id: 34,
  //     icon: "icon-zuoyejindu"
  //     // showLeftMenu: false
  //   },
  //   path: "/jobManagement",
  //   name: "jobManagement",
  //   component: BasicLayout,
  //   children: [
  //     {
  //       meta: {
  //         title: "作业定时发布方案",
  //         id: 34
  //       },
  //       name: "jobPosting",
  //       path: "jobPosting",
  //       component: import("@/views/homeworkManagementController/jobPosting.vue")
  //     },
  //     {
  //       meta: {
  //         title: "作业管理"
  //         ,
  //         id: 34
  //       },
  //       name: "jobManagementIndex",
  //       path: "jobManagementIndex",
  //       component: import("@/views/homeworkManagementController/homeworkManagement.vue")
  //     },
  //     {
  //       meta: { title: "发布作业", id: 34, showLeftMenu: false },
  //       name: "addHomeWork",
  //       path: "addHomeWork",
  //       component: import("@/views/homeworkManagementController/addHomeWork.vue")
  //     },
  //     {
  //       meta: { title: "班级作业详情", showLeftMenu: false, id: 36 },
  //       name: "classHomeWorkDetail",
  //       path: "classHomeWorkDetail",
  //       component: import("@/views/homeworkManagementController/classHomeWorkDetail.vue")
  //     },
  //     {
  //       meta: { title: "学生完成情况", showLeftMenu: false, id: 36 },
  //       name: "studentHomeWorkCompletion",
  //       path: "studentHomeWorkCompletion",
  //       component: import("@/views/homeworkManagementController/studentHomeWorkCompletion.vue")
  //     },
  //     {
  //       meta: { title: "学生作业详情", showLeftMenu: false, id: 36 },
  //       name: "studentHomeWorkDetail",
  //       path: "studentHomeWorkDetail",
  //       component: import("@/views/homeworkManagementController/studentHomeWorkDetail.vue")
  //     }
  //   ]
  // },
  // {
  //   meta: {
  //     title: "抽测管理",
  //     id: 27,
  //     icon: "icon-suijibofang"
  //     // fullScreen: true
  //   },
  //   path: "/sampling",
  //   name: "sampling",
  //   component: SimpleLayout,
  //   children: [
  //     {
  //       meta: {
  //         id: 28,
  //         title: "抽测发布"
  //       },
  //       path: "samplingRelease",
  //       name: "samplingRelease",
  //       component: () => import("../views/sampling/samplingRelease.vue")
  //     },
  //     {
  //       meta: {
  //         title: "抽测管理",
  //         id: 29
  //       },
  //       path: "samplingManagement",
  //       name: "samplingManagement",
  //       component: () => import("../views/sampling/samplingManagement.vue")
  //     },
  //     {
  //       meta: {
  //         title: "调整被测班级",
  //         id: 29,
  //         showLeftMenu: false
  //       },
  //       path: "adjustClass",
  //       name: "adjustClass",
  //       component: () => import("../views/sampling/adjustClass.vue")
  //     },
  //     {
  //       meta: {
  //         id: 29,
  //         title: "查看详情",
  //         showLeftMenu: false
  //       },
  //       path: "viewInfo",
  //       name: "viewInfo",
  //       component: () => import("../views/sampling/viewInfo.vue")
  //     },
  //     {
  //       meta: {
  //         id: 37,
  //         title: "查看结果",
  //         showLeftMenu: false
  //       },
  //       path: "viewResults",
  //       name: "viewResults",
  //       component: () => import("../views/sampling/viewResults.vue")
  //     }
  //   ]
  // },
  // {
  //   meta: {
  //     id: 1,
  //     title: "评价体系管理",
  //     icon: "icon-duoyuanhuapingjia"
  //     // fullScreen: true
  //   },
  //   path: "/evaluationSystemManagement",
  //   name: "evaluationSystemManagement",
  //   component: SimpleLayout,
  //   children: [
  //     {
  //       meta: {
  //         id: 1,
  //         title: "国家学生体质健康标准",
  //         icon: "icon-31daipingjia"
  //         // fullScreen: true
  //       },
  //       path: "evaluation",
  //       name: "evaluation",
  //       component: () => import("@/views/evaluationSystemManagement/evaluationSystemManagement.vue")
  //
  //     },
  //     {
  //       meta: {
  //         id: 1,
  //         title: "各年级单项指标评分表",
  //         icon: "icon-31daipingjia"
  //       },
  //       name: "gradeIndicator",
  //       path: "gradeIndicator",
  //       component: () => import("@/views/evaluationSystemManagement/gradeIndicator.vue")
  //     }
  //   ]
  // },
  // {
  //   meta: {
  //     id: 38,
  //     title: "信息公告",
  //     icon: "icon-gonggao"
  //     // fullScreen: true
  //   },
  //   path: "/announcement",
  //   name: "announcement",
  //   component: BasicLayout,
  //   children: [
  //     {
  //       meta: {
  //         id: 38,
  //         title: "信息公告"
  //       },
  //       path: "AnnouncementManager",
  //       name: "AnnouncementManager",
  //       component: () => import("../views/announcement/AnnouncementManager.vue")
  //     }
  //   ]
  // },
  {
    meta: {
      id: 1,
      title: "系统管理",
      icon: "icon-duoyuanhuapingjia"
      // fullScreen: true
    },
    path: "/admin",
    name: "admin",
    component: BasicLayout,
    children: [
      {
        meta: {
          id: 32,
          title: "账户信息",
          // icon: "icon-31daipingjia",
          showLeftMenu: false
          // fullScreen: true
        },
        path: "accountManagementUpdate",
        name: "accountManagementUpdate",
        component: () => import("../views/admin/accountInformation.vue")

      },
      {
        meta: {
          id: 32,
          title: "管理员列表"
          // icon: "icon-31daipingjia"
          // fullScreen: true
        },
        path: "accountManagement",
        name: "accountManagement",
        component: () => import("../views/admin/accountManagement.vue")

      },
      {
        meta: {
          id: 1,
          title: "账户信息"
          // icon: "icon-31daipingjia"
          // fullScreen: true
        },
        path: "updatePassword",
        name: "updatePassword",
        component: () => import("../views/admin/updatePassword.vue")

      }
    ]
  }

  // {
  //   // Document title tag
  //   // We combine it with defaultDocumentTitle set in `src/main.js` on router.afterEach hook
  //   meta: {
  //     title: 'Dashboard'
  //   },
  //   path: '/dashboard',
  //   name: 'dashboard',
  //   component: Home
  // },
  // {
  //   meta: {
  //     title: 'Tables'
  //   },
  //   path: '/tables',
  //   name: 'tables',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "tables" */ '@/views/Tables.vue')
  // },
  // {
  //   meta: {
  //     title: 'Forms'
  //   },
  //   path: '/forms',
  //   name: 'forms',
  //   component: () => import(/* webpackChunkName: "forms" */ '@/views/Forms.vue')
  // },
  // {
  //   meta: {
  //     title: 'Profile'
  //   },
  //   path: '/profile',
  //   name: 'profile',
  //   component: () => import(/* webpackChunkName: "profile" */ '@/views/Profile.vue')
  // },
  // {
  //   meta: {
  //     title: 'Ui'
  //   },
  //   path: '/ui',
  //   name: 'ui',
  //   component: () => import(/* webpackChunkName: "ui" */ '@/views/Ui.vue')
  // },
  // {
  //   meta: {
  //     title: 'Responsive layout'
  //   },
  //   path: '/responsive',
  //   name: 'responsive',
  //   component: () => import(/* webpackChunkName: "responsive" */ '@/views/Responsive.vue')
  // },
  // {
  //   meta: {
  //     title: 'Select style',
  //     fullScreen: true
  //   },
  //   path: '/',
  //   name: 'style',
  //   component: Style
  // },

];

const router = createRouter({
  history: createWebHashHistory(),
  routes: publicRouters,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { top: 0 };
  }
});
// store.dispatch("User/getRoutes");

// router.beforeEach(async (to, from, next) => {
//   debugger
//   if (!store.state.User?.routeMark && getToken() && to.name !== "login") {
//     // store.state.User?.routeList.map((route) => router.addRoute(route));
//     // router.addRoutes(store.state.User?.routeList ?? []);
//     // navigationList 是上面模拟接口返回的数据
//     // 这里将新的路由都作为 home 的子路由(实际开发根据情况)
//     // meta 是存储一些信息，可以用于权限校验或其他
//
//     console.log(router.getRoutes(), "查看现有路由");
//     await store.dispatch("User/getRoutes");
//     // next();
//     await next({ ...to, replace: true });     //路由进行重定向放行
//   } else {
//     next();
//   }
// });

export default router;
export const routerList = routes;
