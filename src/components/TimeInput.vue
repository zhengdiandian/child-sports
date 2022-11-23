<script setup lang="ts">
import { defineEmits, defineProps, ref, watch } from "vue";

const props = defineProps(["modelValue"]);
const emit = defineEmits(["update:modelValue", "change"]);
const value = ref(0);
const minute = ref(0);
const second = ref(0);

function mod(n: number, m: number) {
  return ((n % m) + m) % m;
}

watch(() => [minute.value, second.value], () => {
  value.value = minute.value * 60 + second.value;
  emit("change", value.value);

});
watch(() => props.modelValue, (newValue) => {
  debugger

  second.value = newValue % 60;
  minute.value = (newValue - second.value) / 60;

}, {
  deep: true,
  immediate: true
});
watch(() => value.value, () => {
  emit("update:modelValue", value.value);
});

</script>
<template>
  <div class="text-block text-base flex center">
    <el-input
      v-model.number="minute"
      min="0"
      type="number"
      class="w-[60px] inline-block"
      size="small"
    ></el-input>
    分
    <el-input
      v-model.number="second"
      min="0"
      type="number"
      class="w-[60px] inline-block"
      size="small"
    ></el-input>
    秒
  </div>
</template>


<style lang="scss" scoped>

</style>
