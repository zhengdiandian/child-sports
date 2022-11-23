<script>
export default {
  computed: {
    key() {
      return this.$route.fullPath;
    }
  }
};
</script>
<template>
  <router-view v-slot="{ Component }">
    <keep-alive :max="10">
      <component
        :is="Component"
        :key="key"
      />
    </keep-alive>
  </router-view>
</template>


<style lang="scss" scoped>


</style>
