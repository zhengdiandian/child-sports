import { routerList } from "@/router";

console.log(routerList);
export const generateMenu = item => {
  const { meta: { title, showLeftMenu, icon }, path, children, name, redirect, reto } = item;
  const router = {
    label: title,
    icon: icon,
    to: reto || name,
    showLeftMenu,
    redirect
  };
  if (children && !reto) {
    const menu = children.map(item => generateMenu(item)).filter(item => item.showLeftMenu !== false);
    if (menu.length > 0) {
      delete router.to;
      router.menu = menu;
    }
  }
  return router;
};
// export default () => [
//   // 'General',
//   // [
//   //   {
//   //     to: 'dashboard',
//   //     icon: mdiDesktopMac,
//   //     label: 'Dashboard'
//   //   }
//   // ],
//   // 'Examples',
//   // [
//   //   {
//   //     to: 'tables',
//   //     label: 'Tables',
//   //     icon: mdiTable,
//   //     updateMark: true
//   //   },
//   //   {
//   //     to: 'forms',
//   //     label: 'Forms',
//   //     icon: mdiSquareEditOutline
//   //   },
//   //   {
//   //     to: 'ui',
//   //     label: 'UI',
//   //     icon: mdiTelevisionGuide
//   //   },
//   //   {
//   //     to: 'responsive',
//   //     label: 'Responsive',
//   //     icon: mdiResponsive
//   //   },
//   //   {
//   //     to: 'styles',
//   //     label: 'Styles',
//   //     icon: mdiPalette
//   //   },
//   //   {
//   //     to: 'profile',
//   //     label: 'Profile',
//   //     icon: mdiAccountCircle
//   //   },
//   //   {
//   //     to: 'login',
//   //     label: 'Login',
//   //     icon: mdiLock
//   //   },
//   //   {
//   //     to: 'error',
//   //     label: 'Error',
//   //     icon: mdiAlertCircle
//   //   },
//   //   {
//   //     label: 'Submenus',
//   //     subLabel: 'Submenus Example',
//   //     icon: mdiViewList,
//   //     menu: [
//   //       {
//   //         label: 'Sub-item One',
//   //         to: 'forms'
//   //       },
//   //       {
//   //         label: 'Sub-item Two'
//   //       }
//   //     ]
//   //   }
//   // ],
//   // 'About',
//   // [
//   //   {
//   //     href: 'https://justboil.me/tailwind-admin-templates/vue-dashboard/',
//   //     label: 'Premium version',
//   //     icon: mdiMonitorShimmer,
//   //     target: '_blank'
//   //   },
//   //   {
//   //     href: 'https://github.com/justboil/admin-one-vue-tailwind',
//   //     label: 'GitHub',
//   //     icon: mdiGithub,
//   //     target: '_blank'
//   //   }
//   // ]
// ].concat([routerList.map((item) => generateMenu(item)).filter(item => item.showLeftMenu !== false)]);

// }
console.log(routerList.map((item) => generateMenu(item)).filter(item => item.showLeftMenu !== false));
