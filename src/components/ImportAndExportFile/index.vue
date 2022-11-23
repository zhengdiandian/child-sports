<template>
  <div class="space-x-10 ">
    <input
      v-show="false"
      id="fileInput"
      ref="fileInput"
      type="file"
      @change="fileChange"
    >
    <el-button
      :disabled="disableImport"
      size="large"
      class="lg:text-base px-6"
      type="primary"
      @click="importAnyData"
    >
      导入数据
    </el-button>
    <el-button
      size="large"
      class="lg:text-base"
      type="warning"
      :disabled="disableExport"
      @click="exportData"
    >
      导出数据
    </el-button>
    <el-button
      class=" -mx-2"
      type="text"
    >
      <span class="iconfont icon-xiazai  text-4xl" />
      <span
        class=" underline text-black mx-2.5 lg:text-base"
        size="small"
        @click="downloadTemplate()"
      >下载模板</span>
    </el-button>
  </div>
</template>

<script setup lang="ts">
import { defineEmits, ref, toRefs } from "vue";

const emit = defineEmits(["exportData", "downloadTemplate", "importData"]);
const exportData = () => {
  emit("exportData");
};
const props = defineProps({
  disableImport: {
    type: Boolean,
    default: false
  },
  disableExport: {
    type: Boolean,
    default: false
  }
});
const { disableImport, disableExport } = toRefs(props);
const fileInput = ref<HTMLInputElement>(null);
const importAnyData = () => {
  fileInput.value.click();
};
const fileChange = (e: Event) => {
  // 上传文件
  const target = e.target as HTMLInputElement;
  const files = target.files;
  if (files) {
    const uploadedFile = files[0];
    const formData = new FormData();
    formData.append("file", uploadedFile);
    console.log("formData", formData.get("file"));
    emit("importData", formData);
    fileInput.value.value = "";
  }
};
const downloadTemplate = () => {
  emit("downloadTemplate");
};
</script>

<style>

</style>
