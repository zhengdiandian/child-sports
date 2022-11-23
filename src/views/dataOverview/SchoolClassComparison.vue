<!--校内班级对比-->
<template>
  <div class="bg-gray-100">
    <div>
      <div class="pl-6 bg-white rounded-sm pb-2">
        <!--        <SelectItem title="请选择对比维度">-->
        <SchoolSelect @getSchool="getSchoolId" />
        <!--        </SelectItem>-->
        <div
          v-if="filterData.schoolId"
          class="mb-4"
        >
          <el-select
            v-model="filterData.grade"
            class="w-40 mr-2"
            placeholder="请选择年级"
            @change="getExamList(true)"
          >
            <el-option
              v-for="{label,value} in filterGradeList(filterData.schoolType)"
              :key="label"
              :label="label"
              :value="value"
            />
          </el-select>
          <el-select
            v-model="filterData.gender"
            class="w-40 mx-2"
            placeholder="请选择性别"
            @change="changeExam"
          >
            <el-option
              label="不限"
              value=""
            />
            <el-option
              label="男"
              value="男"
            />
            <el-option
              label="女"
              value="女"
            />
          </el-select>

          <el-select
            v-model="filterData.examName"
            class="w-40 mx-2"
            placeholder="请选择学期"
            @change="changeExam"
          >
            <el-option
              v-for="item in examNames"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
          <el-select
            v-model="filterData.project"
            class="w-40 mx-2"
            placeholder="请选择项目"
            @change="changeProject"
          >
            <el-option
              v-for="{name, value} in projects"
              :key="name"
              :label="name"
              :value="value"
            >
            </el-option>
          </el-select>
        </div>

        <!--        <SelectItem title="请选择年级">-->
        <!--          <el-radio-group-->
        <!--            v-if="schoolType == '小学'"-->
        <!--            v-model="filterData.grade"-->
        <!--            class="p-4"-->
        <!--            @change="getExamList(true)"-->
        <!--          >-->
        <!--            <el-radio-->
        <!--              v-for="item in 6"-->
        <!--              :key="item"-->
        <!--              :label="item"-->
        <!--            >-->
        <!--              {{ item + "年级" }}-->
        <!--            </el-radio>-->
        <!--          </el-radio-group>-->
        <!--          <el-radio-group-->
        <!--            v-else-if="schoolType == '中学'"-->
        <!--            v-model="filterData.grade"-->
        <!--            class="p-4"-->
        <!--            @change="getExamList(true)"-->
        <!--          >-->
        <!--            <el-radio-->
        <!--              v-for="item in [7, 8, 9]"-->
        <!--              :key="item"-->
        <!--              :label="item"-->
        <!--            >-->
        <!--              {{ item + "年级" }}-->
        <!--            </el-radio>-->
        <!--          </el-radio-group>-->
        <!--          <el-radio-group-->
        <!--            v-else-->
        <!--            v-model="filterData.grade"-->
        <!--            class="p-4"-->
        <!--            @change="getExamList(true)"-->
        <!--          >-->
        <!--            <el-radio-->
        <!--              v-for="item in 9"-->
        <!--              :key="item"-->
        <!--              :label="item"-->
        <!--            >-->
        <!--              {{ item + "年级" }}-->
        <!--            </el-radio>-->
        <!--          </el-radio-group>-->
        <!--        </SelectItem>-->
        <!--        <SelectItem title="请选择性别">-->
        <!--          <div class="p-4">-->
        <!--            <el-radio-group-->
        <!--              v-model="filterData.gender"-->
        <!--              @change="getExamList(true)"-->
        <!--            >-->
        <!--              <el-radio-button label="">-->
        <!--                全部-->
        <!--              </el-radio-button>-->
        <!--              <el-radio-button label="男" />-->
        <!--              <el-radio-button label="女" />-->
        <!--            </el-radio-group>-->
        <!--          </div>-->
        <!--        </SelectItem>-->
        <!--        <SelectItem-->
        <!--          v-if="filterData.grade"-->
        <!--          title="请选择学期"-->
        <!--        >-->
        <!--          <el-radio-group-->
        <!--            v-model="filterData.examName"-->
        <!--            class="p-4"-->
        <!--          >-->
        <!--            <el-radio-->
        <!--              v-for="item in examNames"-->
        <!--              :key="item"-->
        <!--              :label="item"-->
        <!--            >-->
        <!--              {{ item }}-->
        <!--            </el-radio>-->
        <!--          </el-radio-group>-->
        <!--        </SelectItem>-->
        <!--        <SelectItem-->
        <!--          v-if="filterData.examName"-->
        <!--          title="请选择项目"-->
        <!--        >-->
        <!--          <el-radio-group-->
        <!--            v-model="filterData.project"-->
        <!--            class="p-4"-->
        <!--          >-->
        <!--            <el-radio-->
        <!--              v-for="item in projects"-->
        <!--              :key="item"-->
        <!--              :label="item.value"-->
        <!--              @change="changeProject(item.name)"-->
        <!--            >-->
        <!--              {{ item.name }}-->
        <!--            </el-radio>-->
        <!--          </el-radio-group>-->
        <!--        </SelectItem>-->
        <!-- <div class="p-4 text-center">
          <el-button @click="submitFilterData">
            提交信息
          </el-button>
        </div> -->
      </div>
    </div>
    <div class="bg-gray-100 h-4"></div>

    <div
      v-if="barData"
      class="bg-white rounded-md bg-white rounded-md mt-4 px-4"
    >
      <div class="flex justify-center item-center nowrap py-6">
        <div class="text-black mr-7">
          学校：<span class="text-yellow text-2xl">{{
            barData.schoolNumber ?? 0
          }}</span>
          所
        </div>
        <div class="text-black mr-7">
          班级：<span class="text-yellow text-2xl">{{
            barData.classNumber ?? 0
          }}</span>
          个
        </div>
        <div class="text-black mr-7">
          总人数：<span class="text-yellow text-2xl">{{
            barData.studentNumber ?? 0
          }}</span>
          人
        </div>
        <div class="text-black mr-7">
          男生：<span class="text-yellow text-2xl">{{
            barData?.maleNumber ?? 0
          }}</span>
          人
        </div>
        <div class="text-black mr-7">
          女生：<span class="text-yellow text-2xl">{{
            barData?.femaleNumber ?? 0
          }}</span>
          人
        </div>
      </div>
      <div v-if="projectName">
        <el-tabs
          v-model="activeName"
          class="demo-tabs"
          @tab-click="handleClick"
        >
          <el-tab-pane
            label="总分分布情况"
            name="first"
          >
            <template #label>
              <span class="text-2xl">{{ projectName + "分布情况" }}</span>
            </template>
            <!--            <div>-->
            <!--              <ChartC v-if="totalScoreChartData" :chart-data="totalScoreChartData" fixed-name="年级平均值"></ChartC>-->
            <!--            </div>-->
          </el-tab-pane>
          <el-tab-pane
            v-if="filterData.gender !== ''|| filterData.project === 'score'"
            label="总分平均值"
            name="two"
          >
            <template #label>
              <span class="text-2xl">{{ projectName + "平均值" }}</span>
            </template>
            <!--            <div v-if="activeName === 'two'">-->
            <!--              <ChartC v-if="projectScoreChartData" :chart-data="projectScoreChartData" :fixed-sorting="['avrScore']"-->
            <!--                fixed-name="年级平均值"></ChartC>-->
            <!--            </div>-->
          </el-tab-pane>
        </el-tabs>
        <div>
          <template v-if="activeName === 'first'">
            <ChartC
              v-if="totalScoreChartData!==null"
              :chart-data="totalScoreChartData"
              fixed-name="年级平均值"
            ></ChartC>
          </template>
          <template v-else-if="activeName ==='two'">
            <ChartC
              v-if="projectScoreChartData"
              :chart-data="projectScoreChartData"
              fixed-name="年级平均值"
              :unit="' '+unit"
            ></ChartC>
          </template>
        </div>
      </div>
      <NoData v-else />
    </div>
    <div
      v-else
      class="h-[800px] flex justify-center items-center p-20 bg-white"
    >
      <NoData></NoData>
    </div>
  </div>
</template>
<script setup>
import ChartC from "@/components/Charts/Chart.vue";
import { getExamName, getProject, getSchoolAvg, getSchoolScore } from "@/api/dataOverview";
import { ElMessage } from "element-plus";
import { reactive, ref, watch } from "vue";
import { formatData } from "./hooks";
import NoData from "@/components/NoData.vue";
import { filterGradeList } from "@/utils/baseData";

let filterData = reactive({
  examName: "",
  gender: undefined,
  grade: "",
  project: "",
  schoolId: "",
  schoolCity: "",
  schoolDistrict: "",
  schoolProvince: "",
  sort: "ASC",
  schoolType: undefined
});
const projects = ref([]);
const examNames = ref([]);
const activeName = ref("first");
const totalScoreChartData = ref(null);
const projectScoreChartData = ref(null);
const barData = ref(null);
const tabIndex = ref("0");
const projectName = ref("");
const schoolType = ref("");

// watch(() => filterData.examName, () => {
//   totalScoreChartData.value = null
//   projectScoreChartData.value = null
// })
watch(() => filterData.gender, (newValue, oldValue) => {
  changeExam();
}, {
  deep: true
});
watch(() => [filterData.gender, filterData.grade, filterData.project, filterData.examName], (arr, arr2) => {
    // if(arr[0] !== arr2[0])
    // {
    //   changeExam()
    // }
    console.info(arr, "arr");
    console.info(arr2, "arr2");
    totalScoreChartData.value = null;
    projectScoreChartData.value = null;
    activeName.value = "first";
    tabIndex.value = "0";
    if (filterData.grade && filterData.project && filterData.examName) {
      handleClick({ index: "0" });
    }

  },
  {
    deep: true
  });
const changeProject = (name) => {
  projectName.value = projects.value.find((item) => item.value == name).name;

  // submitFilterData()
};
const getSchoolId = (type, id, area) => {
  filterData.grade = "";
  filterData.gender = undefined;
  filterData.project = "";
  filterData.examName = "";
  filterData.schoolType = schoolType.value = type;
  projectName.value = "";
  console.log("学校类型", type);
  filterData.schoolId = id;
  filterData.schoolCity = area.city;
  filterData.schoolDistrict = area.district;
  filterData.schoolProvince = area.province;

};
const getExamList = async (value) => {
  let parmeter = {
    schoolId: filterData.schoolId,
    grade: filterData.grade,
    gender: filterData.gender,
    schoolCity: filterData.schoolCity,
    schoolDistrict: filterData.schoolDistrict,
    schoolProvince: filterData.schoolProvince,
    schoolType: filterData.schoolType
  };
  console.log("学期参数", parmeter);
  await getExamName(parmeter).then((res) => {
    console.log("获取学期", res);
    examNames.value = res.data;
  });
  if (value) await changeExam();
  // filterData.examName = "";

};
const changeExam = async (value) => {
  projectName.value = "";
  filterData.project = "";
  let parmeter = {
    areaList: filterData.areaList,
    grade: filterData.grade,
    gender: filterData.gender,
    schoolCity: filterData.schoolCity,
    schoolDistrict: filterData.schoolDistrict,
    schoolProvince: filterData.schoolProvince,
    schoolType: filterData.schoolType,
    examName: filterData.examName
  };
  await getProject(parmeter).then((res) => {
    console.log("获取项目", res);
    projects.value = res.data;
  });
};

const submitFilterData = (value) => {
  let keys = Object.keys(filterData);
  let isSubmit = true;
  for (let key of keys) {
    if (key == "gender") {
      continue;
    }
    if (!filterData[key]) {
      isSubmit = false;
      break;
    }
  }
  if (!isSubmit) {
    return ElMessage({
      message: "筛选条件不足！请勾选必要筛选条件。",
      type: "warning"
    });
  }
  if (tabIndex.value == "0") {
    getAllScore();
  } else if (tabIndex.value == "1") {
    getAvgScore();
  }
};
const handleClick = (tab) => {
  console.log("tabs", tab.index);
  tabIndex.value = tab.index;
  if (tab.index == "0") {
    if (totalScoreChartData.value) return;
    getAllScore();
  } else if (tab.index == "1") {
    if (projectScoreChartData.value) return;
    getAvgScore();
  }
};
const getAllScore = async () => {
  await getSchoolScore(filterData).then((res) => {
    console.log("获取总分分布", res);
    barData.value = res.data;
    const keyName = filterData.project === "bmi" ? filterData.project : "score";
    totalScoreChartData.value = formatData(res.data[keyName + "List"], keyName === "score" ? 0 : 1);
  });
};
const unit = ref("");
const getAvgScore = () => {
  // if (!filterData.gender) {
  //   return ElMessage({
  //     message: "请指定性别！",
  //     type: "warning",
  //   });
  // }
  getSchoolAvg(filterData).then((res) => {
    debugger
    console.log("获取平均分", res);
    let obj = {};
    res.data.forEach(({ avgscore, level, name, projectName }) => {
      unit.value = projectName;
      let o = {};
      o[level] = avgscore;
      obj[name] = o;
    });

    projectScoreChartData.value = obj;
  });
};
</script>
<style lang="scss" scoped>
</style>
