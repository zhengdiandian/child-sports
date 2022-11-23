<template>
  <div>
    <el-select
      v-if="showitems.includes('schoolType')"
      v-model="schoolType"
      class="w-24"
      placeholder="请选择学校类型"
      :disabled="schoolTypeList.length ===1"
      @change="changeSchoolType"
    >
      <el-option
        v-for="{label} in schoolTypeList"
        :key="label"
        :label="label"
        :value="label"
      />
    </el-select>
    <SelectCity
      v-model:district-code="filterCity.district"
      v-model:province-code="filterCity.province"
      v-model:city-code="filterCity.city"
      @changeSelectCity="changeFilterCity"
    />
    <el-select
      v-if="showitems.includes('schoolName')"
      v-model="schoolName"
      filterable
      :loading="loading"
      class="mt-2"
      placeholder="请选择学校"
      :disabled="store.state.User?.userRoles?.schoolName"
      @change="change"
      @visible-change="visibleChange"
    >
      <el-option
        v-for="(item, index) in schoolOptions"
        :key="index"
        :label="item.school_name"
        :value="item.school_name"
      >
        {{ item.school_id }}-{{ item.school_name }}
      </el-option>
    </el-select>
    <el-select
      v-if="showitems.includes('schoolNames')"
      v-model="schoolName"
      class="mt-2"
      filterable
      :loading="loading"
      placeholder="请选择学校"
      :disabled="!filterCity.district"
      @change="change"
      @visible-change="visibleChange"
    >
      <el-option
        v-if="showAllSchoolNames"

        :value="undefined"
        label="所有学校"
      >
        所有学校
      </el-option>
      <el-option
        v-for="(item, index) in schoolOptions"
        :key="index"
        :label="item.school_id + '-' +item.school_name"
        :value="item.school_name"
      />
    </el-select>
    <el-select
      v-if="showitems.includes('className')"
      v-model="classId"
      class="mx-2 mt-2"
      :disabled="!schoolName"
      :loading="loadingClass"
      placeholder="请选择班級"
      @change="changeClass"
      @visible-change="visibleChangeClassList"
    >
      <el-option
        v-if="showAllClassNames"
        :value="undefined"
        label="所有班级"
      >
        所有班级
      </el-option>

      <el-option
        v-for="(item, index) in classList"
        :key="index"
        :label="item.class_name"
        :value="item.class_id"
      />
    </el-select>
    <el-button
      v-if="showInfo"
      class="ml-5"
      type="primary"
      @click="getSchoolData"
    >
      查询
    </el-button>
  </div>
  <div
    v-if="showInfo"
    class="flex flex-wrap py-8"
  >
    <div
      v-for="(val, key) in schoolList"
      :key="key"
      class="flex items-center mr-10 leading-loose"
    >
      <div class="bg-yellow-400 w-3 h-3 mr-1" />
      <div>{{ val.title }}</div>
      <div>{{ val.value }}</div>
    </div>
  </div>
</template>
<script setup>
import { defineEmits, defineExpose, defineProps, reactive, ref, watch } from "vue";
import { getAllClassNames, getAllSchoolNames, getSchoolInfo } from "@/api/index";
import userHooks from "@/hooks/useHook";
import { ElMessage } from "element-plus";
import SelectCity from "@/components/SelectCity.vue";
import store from "@/store/index";
import { sortArr } from "@/utils/index";

const { DailyPhysical, AreaInformation, schoolTypeList } = userHooks();
const props = defineProps({
  showAllClassNames: {
    default: true
  },
  showAllSchoolNames: {
    default: true
  },
  showInfo: {
    default: true
  },
  showitems: {
    default() {
      return ["schoolName", "schoolType"];
    }
  },
  districtCode: {
    default() {
      return "";
    }
  },
  cityCode: {
    default() {
      return "";
    }
  },
  provinceCode: {
    default() {
      return "";
    }
  },
  classInfo: {
    default() {
      return {};
    }
  },
  schoolInfo: {
    default() {
      return {};
    }
  },
  type: {
    default: ""
  },
  area: {
    default() {
      return {};
    }
  }
});
const emit = defineEmits(["getSchool", "update:type", "update:districtCode", "update:cityCode", "update:provinceCode", "update:schoolInfo", "update:classInfo", "update:area"]);
const userInfo = DailyPhysical;
const schoolType = ref(userInfo.schoolType);
const schoolName = ref(userInfo.schoolName);
const schoolIdList = ref([]);
const filterCity = ref(AreaInformation);
defineExpose({ filterCity });
const loading = ref(false);
const schoolId = ref(userInfo.schoolId);
const schoolOptions = ref([]);
const filterSchoolOptions = ref([]);
const filterMethod = (value, arr) => {
  debugger
  filterSchoolOptions.value = schoolOptions.value.filter(item => item.school_name.includes(value) || item.school_id.toString().includes(value));
};
if (schoolName.value) {
  getSchoolData();
}

function changeFilterCity(area) {
  emit("update:area", area);
  emit("update:districtCode", area.district);
  emit("update:cityCode", area.city);
  emit("update:provinceCode", area.province);
  emit("update:schoolInfo", {});
  emit("update:classInfo", {});
  filterCity.value = area;
  if (!props.showInfo && !userInfo.schoolName) {
    schoolName.value = schoolId.value = undefined;
    emit("update:schoolInfo", { id: schoolId, name: schoolName });
    emit("getSchool", schoolType.value, schoolId, filterCity.value);
  }

  if (props.showitems.includes("schoolNames")) {
    schoolName.value = "";

  }
  classId.value = undefined;
  console.log("选择城市", filterCity, area);
}

async function visibleChange(val) {
  console.log("下拉框 开启关闭", val);
  if (val) {
    loading.value = true;
    const parmeter = {
      schoolCity: filterCity.value.city,
      schoolDistrict: filterCity.value.district,
      schoolProvince: filterCity.value.province,
      schoolType: schoolType.value
    };
    await getAllSchoolNames(parmeter).then((res) => {
      console.log("获取学校列表", res);
      filterSchoolOptions.value = schoolOptions.value = sortArr(res.data, "school_id");
      loading.value = false;
    });
  }
}

const loadingClass = ref(false);
let classId = ref(undefined);
let classList = ref([]);

function visibleChangeClassList(val) {
  console.log("下拉框 开启关闭", val);
  if (schoolId.value === undefined) return loadingClass.value = false;
  if (val) {
    loadingClass.value = true;
    const parmeter = {
      schoolId: schoolId.value,
      classType: schoolType.value === "小学" ? 1 : 2
    };
    if (parmeter.schoolId)
      getAllClassNames(parmeter).then((res) => {
        console.log("获取学校列表", res);
        classList.value = res.data;
        loadingClass.value = false;
      });
  }
}

const changeClass = (val) => {
  if (val === undefined) {
    return;
  }
  const classInfo = classList.value.find((c) => c.class_id === val);
  emit("update:classInfo", { id: classInfo.class_id, name: classInfo.class_name });

};
const schoolList = reactive({
  schoolName: { title: "学校：", value: "" },
  schoolType: { title: "学校类别：", value: "" },
  schoolDistrict: { title: "所属区域：", value: "" },
  schoolAddress: { title: "地址：", value: "" },
  schoolHeadmaster: { title: "校长：", value: "" },
  schoolPhone: { title: "联系电话：", value: "" },
  schoolClassNum: { title: "班级数：", value: "" },
  schoolStudentNum: { title: "学生人数：", value: "" },
  schoolTeacherNum: { title: "教师人数：", value: "" }
});

function getSchoolData() {
  const parmeter = {
    schoolCity: filterCity.value.city,
    schoolDistrict: filterCity.value.district,
    schoolProvince: filterCity.value.province,
    schoolType: schoolType.value,
    schoolName: schoolName.value
  };
  if (!schoolIdList.value.length && !schoolName.value) return;
  if (!parmeter.schoolDistrict) {
    return ElMessage.error("请选择区域");
  }
  if (!parmeter.schoolName) {
    // return ElMessage.error('请选择学校')
  }

  getSchoolInfo(parmeter).then((res) => {
    const { data } = res;
    for (const k in schoolList) {
      schoolList[k].value = data[k];
    }
    schoolId.value = data.schoolId;
    emit("update:schoolInfo", { id: data.schoolId, name: data.schoolName });
    emit("getSchool", schoolType.value, data.schoolId, filterCity.value);
  });
}

function changeSchoolType() {
  emit("update:type", schoolType);
  schoolName.value = "";
}

const change = (value) => {
  classId.value = undefined;
  if (schoolName.value === undefined) {
    return classId.value === undefined;
  }
  if (!props.showInfo) getSchoolData();
};
const changeSchools = (value) => {
  if (value === undefined) {
    schoolIdList.value;


  }

};
watch(() => props.type, (newValue) => {
  if (newValue !== "")
    schoolType.value = props.type;
}, {
  immediate: true
});
changeFilterCity(filterCity.value);
</script>
