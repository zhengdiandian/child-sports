<script setup>
import { computed, defineEmits, ref } from "vue";
import { useStore } from "vuex";
import { mdiMinus, mdiPlus } from "@mdi/js";
import Icon from "@/components/Icon.vue";
import AsideMenuList from "@/components/AsideMenuList.vue";

const props = defineProps({
  item: {
    type: Object,
    required: true
  },
  isSubmenuList: Boolean
});

const emit = defineEmits(["menu-click"]);

const store = useStore();

const asideMenuItemStyle = computed(() => store.state.asideMenuItemStyle);

const asideMenuItemActiveStyle = computed(() => store.state.asideMenuItemActiveStyle);

const asideMenuItemInactiveStyle = computed(() => store.state.asideMenuItemInactiveStyle);

const asideSubmenuListStyle = computed(() => store.state.asideSubmenuListStyle);

const isDropdownActive = ref(false);

const componentIs = computed(() => props.item.to ? "router-link" : "a");

const hasDropdown = computed(() => !!props.item.menu);

const dropdownIcon = computed(() => isDropdownActive.value ? mdiMinus : mdiPlus);

const itemTo = computed(() => props.item.to || null);

const itemHref = computed(() => props.item.href || null);

const itemTarget = computed(() => componentIs.value === "a" && props.item.target ? props.item.target : null);

const menuClick = event => {
  emit("menu-click", event, props.item);

  if (hasDropdown.value) {
    isDropdownActive.value = !isDropdownActive.value;
  }
};
</script>

<template>
  <li
    :class="isSubmenuList && $route.path.includes( itemTo) ? ' translate-x-6 rounded-tl-3xl rounded-bl-3xl  bg-blue ': 'text-black' "
  >
    <component
      :is="componentIs"
      v-slot="vSlot"
      :to="{name: itemTo}"
      :href="itemHref"
      :target="itemTarget"
      class="flex items-center cursor-pointer dark:hover:bg-gray-700/50"
      :class="[ asideMenuItemStyle, isSubmenuList ? 'p-3 text-sm' : 'py-2' ]"
      @click="menuClick"
    >
      <!--      <div class="">-->
      <span
        class="iconfont w-12  flex-none  text-right pr-2  align-middle"
        :class="[item.icon, vSlot && vSlot.isExactActive ? asideMenuItemActiveStyle : asideMenuItemInactiveStyle ]"
      ></span>
      <!--      </div>-->
      <!--      <icon-->
      <!--        v-if="item.icon"-->
      <!--        :path="item.icon"-->
      <!--        class="flex-none"-->
      <!--        :class="[ vSlot && vSlot.isExactActive ? asideMenuItemActiveStyle : asideMenuItemInactiveStyle ]"-->
      <!--        w="w-12"-->
      <!--      />-->
      <span
        class="grow"
        :class="[ vSlot && vSlot.isExactActive || $route.path.includes( itemTo) ? asideMenuItemActiveStyle : asideMenuItemInactiveStyle ]"
      ><span
        :class="[ !isSubmenuList ? 'text-black' : '' ]"
      >{{ item.label }}</span></span>
      <icon
        v-if="hasDropdown"
        :path="dropdownIcon"
        class="flex-none"
        :class="[ vSlot && vSlot.isExactActive || $route.path.includes( itemTo) ? asideMenuItemActiveStyle : asideMenuItemInactiveStyle ]"
        w="w-12"
      />
    </component>
    <aside-menu-list
      v-if="hasDropdown"
      :menu="item.menu"
      :class="[ asideSubmenuListStyle, isDropdownActive ? 'block dark:bg-gray-800/50' : 'hidden' ]"
      is-submenu-list
    />
  </li>
</template>
<style>

</style>
