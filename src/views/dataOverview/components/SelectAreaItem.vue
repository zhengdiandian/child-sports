<template>
  <div class="p-4">
    <el-radio-group v-model="dimension">
      <el-radio-button
        disabled
        label="全国"
      />
      <el-radio-button
        disabled
        label="省"
      />
      <el-radio-button
        disabled
        label="市"
      />
      <el-radio-button label="区" />
    </el-radio-group>
  </div>
  <div class="p-4">
    <SelectCity @changeSelectCity="changeSelectCity"></SelectCity>
  </div>
  <div
    v-if="selectArea?.district"
    class="p-4"
  >
    <el-checkbox
      v-model="checkAll"
      :disabled="!schoolList.length"
      :indeterminate="isIndeterminate"
      @change="handleCheckAllChange"
    >
      全选
    </el-checkbox>
    <el-checkbox-group
      v-model="checkSchoolList"
      @change="handleCheckedSchoolsChange"
    >
      <el-checkbox
        v-for="item in schoolList"
        :key="item.school_id"
        :label="item.school_id"
      >
        {{ item.school_id }}-{{ item.school_name }}
      </el-checkbox>
    </el-checkbox-group>
  </div>
</template>

<script setup lang="ts">
import SelectCity from "@/components/SelectCity.vue";
import { defineEmits, ref, watch } from "vue";
import { getAllSchoolNames } from "@/api/index";
import { sortArr } from "@/utils/index";

const props = defineProps({
  schoolType: {
    type: String,
    default: ""
  }
});

watch(() => props.schoolType, (newV, oldV) => {
  schoolList.value = [];
  selectArea.value.district = "";
});

const emit = defineEmits(["changeSchoolList", "changeSelectCity"]);
const dimension = ref("区");
const selectArea = ref({});
const schoolList = ref([]);
const checkSchoolList: any = ref([]);
const checkAll = ref(false);
const isIndeterminate = ref(true);
const handleCheckAllChange = (val: boolean) => {
  checkSchoolList.value = val ? schoolList.value.map((item: any) => item.school_id) : [];
  isIndeterminate.value = false;
  emit("changeSchoolList", checkSchoolList.value);

};
const handleCheckedSchoolsChange = (value: number[]) => {
  const checkedCount = value.length;
  checkAll.value = checkedCount === schoolList.value.length;
  isIndeterminate.value = checkedCount > 0 && checkedCount < schoolList.value.length;
  emit("changeSchoolList", value);
};
const changeSelectCity = (area: any) => {
  selectArea.value = area;
  checkAll.value = false;
  isIndeterminate.value = true;
  console.log("城市选择", selectArea.value);
  getAllSchool();
  emit("changeSelectCity", area);
};

const getAllSchool = () => {
  const parmeter = {
    schoolCity: selectArea.value.city,
    schoolDistrict: selectArea.value.district,
    schoolProvince: selectArea.value.province,
    schoolType: props.schoolType
  };
  getAllSchoolNames(parmeter, true).then((res) => {
    console.log("获取学校列表", res);
    schoolList.value = sortArr(res.data, "school_id");
  });
};

const changeSchoolList = (value) => {
  emit("changeSchoolList", value);
};

</script>

<style>

</style>
