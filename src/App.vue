<script setup>
import { computed, reactive } from "vue";
import { useStore } from "vuex";
import { generateMenu } from "@/menu.js";
import NavBar from "@/components/NavBar.vue";
// import FooterBar from '@/components/FooterBar.vue'
import Overlay from "@/components/Overlay.vue";
import zhCn from "element-plus/lib/locale/lang/zh-cn";
import router from "@/router";

console.log(router.getRoutes(), "menuList");
const store = useStore();
const menuList = computed(() => {
  if (store.state.User?.routeList?.length) {
    return [store.state.User?.routeList?.map(route => generateMenu(route))];

  }
  return [];
});

store.commit("user", {
  name: "John Doe",
  email: "john@example.com",
  avatar: "https://avatars.dicebear.com/api/avataaars/example.svg?options[top][]=shortHair&options[accessoriesChance]=93"
});
const buttonConfig = reactive({
  autoInsertSpace: true
});
const locale = zhCn;
const isAsideLgActive = computed(() => store.state.isAsideLgActive);

const overlayClick = () => {
  store.dispatch("asideLgToggle", false);
};
</script>

<template>
  <el-config-provider
    :locale="locale"
    :button="buttonConfig"
  >
    <nav-bar />
    <aside-menu
      v-if="store.state.routeMark"
      :menu="menuList"
    />
    <div class="bg-gray-100 dark:bg-gray-800 w-full h-full">
      <router-view v-slot="{ Component }">
        <keep-alive>
          <component :is="Component" />
        </keep-alive>
      </router-view>
    </div>
    <!--  <footer-bar />-->
    <overlay
      v-show="isAsideLgActive"
      z-index="z-30"
      @overlay-click="overlayClick"
    />
  </el-config-provider>
</template>
<style>
</style>
