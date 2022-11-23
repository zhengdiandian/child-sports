<template>
  <div style="border: 1px solid #ccc">
    <Toolbar
      style="border-bottom: 1px solid #ccc"
      :editor="editorRef"
      :default-config="toolbarConfig"
      :mode="mode"
    />
    <Editor
      v-model="valueHtml"
      style="height: 500px; overflow-y: hidden;"
      :default-config="editorConfig"
      :mode="mode"
      @onCreated="handleCreated"
    />
  </div>
  <!--  <div class="mt-20" v-html="valueHtml"></div>-->
</template>

<script setup>
import "@wangeditor/editor/dist/css/style.css"; // 引入 css
import { defineEmits, defineProps, onBeforeUnmount, ref, shallowRef, watch } from "vue";
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";

// export default {
//   components: { Editor, Toolbar },
//   // emits: ['update:modelValue'],
//   setup() {
const props = defineProps(["modelValue"]);

const emit = defineEmits(["update:modelValue"]);
// const toolbar = Toolbar.getToolbar()
// 编辑器实例，必须用 shallowRef
console.log(toolbar);
const editorRef = shallowRef();
// 内容 HTML
const valueHtml = ref("");
const reset = () => {
  valueHtml.value = "";
  emit("update:modelValue", "");
};
// defineExpose({ reset, valueHtml });
// 模拟 ajax 异步获取内容
// onMounted(() => {
//   setTimeout(() => {
//     valueHtml.value = '<p>模拟 Ajax 异步设置内容</p>'
//   }, 1500)
// })
watch(() => valueHtml.value, () => {
  emit("update:modelValue", valueHtml.value);

});
watch(() => props.modelValue, () => {
  setTimeout(() => {
    valueHtml.value = props.modelValue;
  }, 1500);

});
const toolbarConfig = {
  excludeKeys: ["insertVideo", "insertImage", "deleteImage", "editImage", "viewImageLink", "fullScreen", "uploadVideo", "editVideoSize"]
};
const editorConfig = {
  placeholder: "请输入内容...",
  MENU_CONF: {
    "uploadImage": {
      // 其他配置...

      // 小于该值就插入 base64 格式（而不上传），默认为 0
      base64LimitSize: 5000 * 1024 // 5kb
    }
  }
};

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value;
  if (editor == null) return;
  editor.destroy();
});

const handleCreated = (editor) => {
  editorRef.value = editor; // 记录 editor 实例，重要！
};
const mode = "default";
//   return {
//     editorRef,
//     valueHtml,
//     mode: 'simple', // default 或 'simple'
//     toolbarConfig,
//     editorConfig,
//     handleCreated,
//   };
// }
// }
</script>
<style lang="css">
button {
  line-height: normal;
}
</style>
