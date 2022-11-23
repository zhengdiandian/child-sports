// import { defineConfig } from 'vite'
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import { defineConfig, loadEnv } from "vite";
// import vueJsx from "@vue3-oop/plugin-vue-jsx";
// https://vitejs.dev/config/
export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };
  return defineConfig({
    build: {
      outDir: process.env.VITE_VUE_buildURl
    },
    plugins: [
      // ElementPlus(),
      vue(),
      // vueJsx({ enableObjectSlots: false, slotStable: true }),
      AutoImport({
        resolvers: [ElementPlusResolver()]
      }),
      Components({
        resolvers: [ElementPlusResolver({ importStyle: "sass" })]
      })
    ],
    css: {
      preprocessorOptions: {
        // css: {
        //   // additionalData: "@use \"@/styles/element/index.scss\" as *; "
        // },
        scss: {
          additionalData: "@use \"@/styles/element/index.scss\" as *; "
        }
      }
    },
    resolve: {
      alias: {
        "@": resolve(__dirname, "./src"),
        excel: resolve(__dirname, "../src/excel")
      }
    }
  });
};
