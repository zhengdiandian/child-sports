<!--年级纵向对比-->
<template>
  <div class=" bg-gray-100">
    <div>
      <div class=" pb-2 bg-white rounded-sm p-4 ">
        <!--        <SelectItem title="请选择对比维度">-->
        <SchoolSelect
          @getSchool="getSchoolId"
        />
        <!--        </SelectItem>-->
        <div
          v-if="filterData.schoolId"
          class="mb-4"
        >
          <el-select
            v-model="filterData.gender"
            class="w-40 mr-2"
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
        <!-- <SelectItem title="请选择年级">
          <el-radio-group
            v-if="schoolType == '小学'"
            v-model="filterData.grade"
            class="p-4"
            @change="changeGrade"
          >
            <el-radio
              v-for="item in 6"
              :key="item"
              :label="item"
            >
              {{ item + "年级" }}
            </el-radio>
          </el-radio-group>
          <el-radio-group
            v-if="schoolType == '中学'"
            v-model="filterData.grade"
            class="p-4"
            @change="changeGrade"
          >
            <el-radio
              v-for="item in [7, 8, 9]"
              :key="item"
              :label="item"
            >
              {{ item + "年级" }}
            </el-radio>
          </el-radio-group>
        </SelectItem> -->
        <!--        <SelectItem title="请选择性别">-->
        <!--          <div class="">-->
        <!--            <el-radio-group v-model="filterData.gender">-->
        <!--              <el-radio-button label="">-->
        <!--                全部-->
        <!--              </el-radio-button>-->
        <!--              <el-radio-button label="男" />-->
        <!--              <el-radio-button label="女" />-->
        <!--            </el-radio-group>-->
        <!--          </div>-->
        <!--        </SelectItem>-->
        <!--        <SelectItem-->
        <!--          v-if="filterData.schoolId"-->
        <!--          title="请选择学期"-->
        <!--        >-->
        <!--          <el-radio-group-->
        <!--            v-model="filterData.examName"-->

        <!--            @change="changeExam"-->
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
      class="bg-white rounded-md mt-4 px-4"
    >
      <div
        class="flex justify-center item-center nowrap py-6"
      >
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
            <div>
            </div>
          </el-tab-pane>
          <el-tab-pane
            v-if="filterData.gender !== ''"
            label="总分平均值"
            name="two"
          >
            <template #label>
              <span class="text-2xl">{{ projectName + "平均值" }}</span>
            </template>
            <div v-if="activeName === 'two'">
            </div>
          </el-tab-pane>
        </el-tabs>
        <div>
          <template v-if="activeName === 'first'">
            <ChartC
              v-if="totalScoreChartData"
              :chart-data="totalScoreChartData"
              fixed-name="全校平均值"
            ></ChartC>
          </template>
          <template v-else>
            <ChartC
              v-if="projectScoreChartData"
              :chart-data="projectScoreChartData"
              fixed-name="全校平均值"
              :unit="' '+unit"
            ></ChartC>
          </template>
        </div>
      </div>
      <NoData v-else></NoData>
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
// import SelectAreaItem from "@/views/dataOverview/components/SelectAreaItem.vue";
import ChartC from "@/components/Charts/Chart.vue";
import { getClassAvg, getClassScore, getExamName, getProject } from "@/api/dataOverview";

import { reactive, ref, watch } from "vue";
import { ElMessage } from "element-plus";
import { formatData } from "./hooks";
import NoData from "@/components/NoData.vue";

const filterData = reactive({
  examName: "",
  gender: undefined,
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

watch(() => [filterData.project, filterData.gender, filterData.examName], () => {
  totalScoreChartData.value = null;
  projectScoreChartData.value = null;
  activeName.value = "first";
  tabIndex.value = "0";
  if (filterData.project && filterData.examName)
    handleClick({ index: "0" });
}, {
  deep: true
});
// const formatData = (data, type) => {
//   // const keys  = Object.keys(data)
//   const chartData = {
//     // test: {"不及格":1.41,"优秀":3.41,"及格":64.86,"良好":1.32,"未完成率":0,"avrScore":0}
//   };
//   if (type === 0) {
//     for (let a of data) {
//       chartData[a.name] = {
//         // 'avrScore': a.avgscore,
//         "不及格": a.noPassRate,
//         "优秀": a.excellentRate,
//         "及格": a.passRate,
//         "良好": a.goodRate,
//         "未完成": a.undoneRate
//       };
//     }
//   } else {
//     for (let a of data) {
//       chartData[a.name] = {
//         // 'avrScore': a.avgscore,
//         "低体重": a.lowWeightRate,
//         "正常": a.normalRate,
//         "超重": a.overweightRate,
//         "肥胖": a.fatRate,
//         "未完成": a.undoneRate
//       };
//     }
//   }
//
//   console.log("chart数据", chartData);
//   return chartData;
// };
const changeProject = (name) => {
  projectName.value = projects.value.find((item) => item.value == name).name;
  // submitFilterData()
};
const getSchoolId = (type, id, area) => {
  schoolType.value = type;
  console.log("学校类型", type);
  filterData.schoolType = type;
  filterData.schoolId = id;
  filterData.schoolCity = area.city;
  filterData.schoolDistrict = area.district;
  filterData.schoolProvince = area.province;
  totalScoreChartData.value = null;
  projectScoreChartData.value = null;
  projectName.value = "";
  changeGrade();
};
const changeGrade = () => {
  filterData.examName = "";
  let parmeter = {
    schoolId: filterData.schoolId,
    gender: filterData.gender,
    schoolCity: filterData.schoolCity,
    schoolDistrict: filterData.schoolDistrict,
    schoolProvince: filterData.schoolProvince,
    schoolType: filterData.schoolType
  };
  console.log("学期参数", parmeter);
  getExamName(parmeter).then((res) => {
    console.log("获取学期", res);
    examNames.value = res.data;
  });
};
const changeExam = (value) => {
  projectName.value = filterData.project = "";
  let parmeter = {
    areaList: filterData.areaList,
    gender: filterData.gender,
    schoolCity: filterData.schoolCity,
    schoolDistrict: filterData.schoolDistrict,
    schoolProvince: filterData.schoolProvince,
    schoolType: filterData.schoolType,
    examName: filterData.examName
  };
  getProject(parmeter).then((res) => {
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
      debugger
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
const getAllScore = () => {
  getClassScore(filterData).then((res) => {
    console.log("获取总分分布", res);
    barData.value = res.data;
    const keyName = filterData.project === "bmi" ? filterData.project : "score";
    totalScoreChartData.value = formatData(res.data[keyName + "List"], keyName === "score" ? 0 : 1);
  });
};
const unit = ref("");
const getAvgScore = () => {
  if (!filterData.gender && filterData.project !== "score") {
    return ElMessage({
      message: "请指定性别！",
      type: "warning"
    });
  }
  getClassAvg(filterData).then((res) => {
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
<style lang="scss" scoped></style>
