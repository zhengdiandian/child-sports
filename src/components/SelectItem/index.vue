<template>
  <div class="border-b-2 border-dashed mb-2 mr-6 pb-6">
    <div>
      <div class=""></div>
      <div class="square text-gray-500 text-xl py-2">
        {{ title }}
      </div>
    </div>
    <div>
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    default: ""
  }
});
</script>

<style>

</style>
