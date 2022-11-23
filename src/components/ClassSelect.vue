<template>
  <el-select
    v-if="showitems.includes('grade')"
    v-model="grade"
    placeholder="请选择年级"
    class="w-32 mr-5"
    @change="changeGrade"
  >
    <el-option
      label="不限"
      value=""
    ></el-option>
    <el-option
      v-for="item in gradeList[gradeKey]"
      :key="item"
      :label="item + '年级'"
      :value="item"
    />
  </el-select>
  <el-select
    v-if="showitems.includes('class')"
    v-model="classId"
    placeholder="请选择班级"
    class="w-40"
    @visible-change="visibleChange"
    @change="changeClass"
  >
    <el-option
      label="不限"
      value=" "
    ></el-option>
    <el-option
      v-for="item in classList"
      :key="item.class_name"
      :label="item.class_name"
      :value="item.class_id"
    />
  </el-select>
</template>

<script setup lang="ts">
import { defineEmits, defineProps, ref, toRef, watch } from "vue";
import { getAllClassNames } from "@/api/index";

const props = defineProps({
  grade: {
    default: ""
  },
  schoolType: {
    default: ""
  },
  classId: {
    default: ""
  },
  schoolId: {
    default: ""
  },
  showitems: {
    default() {
      return ["class", "grade"];
    }
  }
});
const emit = defineEmits(["changeGrade", "changeClass", "update:classId", "update:grade", "update:classInfo"]);
const gradeKey = toRef(props, "schoolType");
const schoolId = toRef(props, "schoolId");
const grade = toRef(props, "grade");
const classId = toRef(props, "classId");
const gradeList = ref({
  小学: [1, 2, 3, 4, 5, 6],
  中学: [7, 8, 9],
  "九年一贯": [1, 2, 3, 4, 5, 6, 7, 8, 9]

});
const classList = ref([]);

function visibleChange(val = true) {
  if (val) {
    const parmeter = {
      classGrade: grade.value,
      schoolId: schoolId.value,
      getAllClassNames: gradeKey.value === "小学" ? 1 : 2

    };
    getAllClassNames(parmeter).then(res => {
      classList.value = res.data;
    });
  }
}

watch(() => grade.value, () => {
    visibleChange();
  },
  {
    immediate: false
  });

function changeGrade(e) {
  classId.value = "";
  emit("update:grade", e);
  emit("changeGrade", e);
}

function changeClass(e) {
  try {
    const classInfo: any = classList.value?.find((c: any) => c.class_id === e);
    classInfo.id = classInfo.class_id;
    classInfo.name = classInfo.class_name;
    emit("update:classInfo", classList.value?.find((c: any) => c.class_id === e));
    emit("update:classId", e);
    emit("changeClass", classInfo);
  } catch (e) {
    emit("update:classInfo", undefined);
    emit("update:classId", undefined);
    emit("changeClass", { class_id: undefined, class_name: undefined });
  }

}
</script>

<style>

</style>
