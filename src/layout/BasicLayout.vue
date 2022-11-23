<template>
  <div class=" pt-2.5 pl-3 pr-4 h-full bg-gray-100 min-h-screen-menu dark:bg-gray-800 ">
    <div class="bg-white dark:bg-gray-900 h-full min-h-modal  dark:text-gray-100">
      <router-view v-slot="{ Component }">
        <keep-alive
          :max="10"
          :exclude="['addHomeWork', 'studentHomeWorkDetail', 'classHomeWorkDetail', 'studentHomeWorkCompletion']"
        >
          <component
            :is="Component"
            :key="key"
          />
        </keep-alive>
      </router-view>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    key() {
      return this.$route.path;
    }
  }
};
</script>

<style>

</style>
