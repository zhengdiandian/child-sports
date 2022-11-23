<template>
  <div class="px-2.5 pt-3 bg-gray-100 min-h-modal ">
    <div class="wrapper bg-white">
      <div class="px-2.5 pt-3.5">
        <div class="bg-white pb-6">
          <RandomTestInfoBar
            ref="bar"
            @state="getRandomtestProjects"
          />
        </div>
      </div>
      <div class="w-full h-2 bg-gray-100" />
      <div class="px-2.5 pt-3.5">
        <h3 class="text-black text-lg mb-4">
          <span class="iconfont icon-shuzhuangtu text-yellow text-3xl" /> 抽测数据统计
        </h3>
        <div class="pl-6 divide-y-2 divide-gray-100 divide-dashed ">
          <div class="pl-6 w-full  ">
            <div>
              <div class="square text-gray-500 text-xl ">
                请选择性别
              </div>
              <el-radio-group
                v-model="studentGender"
                size="large"
                class="ml-6 mt-3 mb-5"
                @change="changeGender"
              >
                <el-radio-button
                  v-for="{label, value} in Gender"
                  :key="value"
                  :label="value"
                >
                  {{ label }}
                </el-radio-button>
              </el-radio-group>
            </div>
          </div>
          <div
            v-if="bar"
            class="pl-6 w-full pt-10  "
          >
            <div>
              <div class="square text-gray-500 text-xl items-center flex ">
                请选择项目
                <!--            <el-checkbox-->
                <!--            class="flex items-center ml-6"-->
                <!--            v-model="checkAll"-->
                <!--            :indeterminate="isIndeterminate"-->
                <!--            @change="handleCheckAllChange"-->
                <!--            size="large"-->

                <!--          >全选</el-checkbox>-->
              </div>

              <el-radio-group
                v-model="projectJson"
                size="large"
                style="display: inline-block"
                class="inline-block   mt-3 mb-5 "
                @change="handleCheckedCitiesChange"
              >
                <el-radio-button

                  label=""
                  :value="undefined"
                >
                  总分
                </el-radio-button>
                <el-radio-button
                  v-for="label in randomtestProjects"
                  :key="label"
                  :label="label"
                  :value="label"
                >
                  {{ label }}
                </el-radio-button>
              </el-radio-group>
            </div>
          </div>
          <div></div>
        </div>
      </div>
      <div
        v-if="barData"
        class="flex justify-center item-center nowrap mt-16 mb-10"
      >
        <div class="text-black mr-7">
          学校：<span
            class="text-yellow text-2xl"
          >{{ barData.randomtestSchoolsNames?.length ?? 0 }}</span> 所
        </div>
        <div class="text-black mr-7">
          班级：<span
            class="text-yellow text-2xl"
          >{{ barData.randomtestClassesNames?.length ?? 0 }}</span> 个
        </div>
        <div class="text-black mr-7">
          总人数：<span class="text-yellow text-2xl">{{ barData?.randomtestStudentNum }}</span> 人
        </div>
        <div class="text-black mr-7">
          男生：<span
            class="text-yellow text-2xl"
          >{{ barData?.randomtestStudentMaleNum ?? 0 }}</span> 人
        </div>
        <div class="text-black mr-7">
          女生：<span
            class="text-yellow text-2xl"
          >{{ barData?.randomtestStudentFemaleNum ?? 0 }}</span> 人
        </div>
      </div>
      <div class="pl-12">
        <el-tabs
          v-model="activeName"
          class="demo-tabs"
          @tab-click="handleClick"
        >
          <el-tab-pane
            label="总分分布情况"
            name="totalScore"
          >
            <template #label>
              <span class="text-2xl">{{ projectJson === undefined || projectJson === "" ? "总分" : projectJson
              }}分布情况</span>
            </template>
            <div>
              <!--          <ChartC v-if="totalScoreChartData" :chart-data="totalScoreChartData"></ChartC>-->
            </div>
          </el-tab-pane>
          <el-tab-pane
            v-if="studentGender !== 0 || projectJson === undefined || projectJson == ''"
            label="总分平均值"
            name="projectData"
          >
            <template #label>
              <span class="text-2xl">{{ projectJson === undefined || projectJson == "" ? "总分" : projectJson }}平均值</span>
            </template>
            <!--        <div-->
            <!--          v-if="studentGender !== 0"-->
            <!--        >-->
            <!--          <ChartC v-if="projectScoreChartData" :chart-data="projectScoreChartData"></ChartC>-->

            <!--        </div>-->
          </el-tab-pane>
        </el-tabs>
        <div>
          <template v-if="activeName==='totalScore'">
            <ChartC
              v-if="totalScoreChartData"
              :chart-data="totalScoreChartData"
            ></ChartC>
          </template>
          <template v-else>
            <ChartC
              v-if="projectScoreChartData"
              :chart-data="projectScoreChartData"
              :unit="' '+unit"
            ></ChartC>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import RandomTestInfoBar from "@/views/sampling/components/RandomTestInfoBar.vue";
import ChartC from "@/components/Charts/Chart.vue";
import { nextTick, onMounted, ref } from "vue";
import { getProjectsByGender, getResults } from "@/api/randomTest";
import { Gender } from "@/utils/baseData";
import { useStore } from "vuex";

const randomtestId = useStore().state.RandomTest.randomtestId;

const bar = ref();
const activeName = ref("totalScore");
let projectJson = ref(undefined);
const handleClick = (tab: string, event: Event) => {
  console.log(tab, event);
};


const checkAll = ref(true);
const isIndeterminate = ref(true);
const checkedCities = ref([]);
// const cities = bar.value.state.randomtestProjects

// const handleCheckAllChange = (val: boolean) => {
//   debugger
//   if(val) {
//     projectJson.value = bar.value.state.randomtestProjects
//   }else {
//     projectJson.value = []
//   }
//   checkedCities.value = val ? bar.value.state.randomtestProjects : []
//   isIndeterminate.value = false
// }
onMounted((vm) => {
  nextTick(
    () => {
      // handleCheckAllChange(true)
    }
  );
  // projectJson.value = bar.value.state.randomtestProjects
  // checkAll.value = true
  // handleCheckAllChange(true)
});
const handleCheckedCitiesChange = (value: string[]) => {
  const checkedCount = value.length;
  checkAll.value = checkedCount === bar.value.state.randomtestProjects.length;
  isIndeterminate.value = checkedCount > 0 && checkedCount < bar.value.state.randomtestProjects.length;
  activeName.value = "totalScore";
  getData();
};
const barData = ref(null);
const getRandomtestProjects = (data) => {
  // projectJson.value = data.randomtestProjects
  barData.value = data;
  getData();
};

// const projectList = []
// onMounted(() => {
//   watchEffect(() => {
//     projectList = computed(() => (bar.value.state))
//   })
// })

// onMounted(() => {
// })
console.log(bar.value);
const studentGender = ref(0);
const totalScoreChartData: any = ref(null);
const projectScoreChartData: any = ref(null);
const unit: any = ref("");
const showChart = ref(false);
const getData = async () => {
  // const  arrStr = projectJson.value.length? JSON.stringify(projectJson.value): JSON.stringify(bar.value.state.randomtestProjects)
  showChart.value = false;
  await getResults({
    studentGender: studentGender.value,
    project: (projectJson.value === "" ? undefined : projectJson.value),
    randomtestId
  }).then(({ data }) => {
    debugger

    if (!data.length) {
      totalScoreChartData.value = projectScoreChartData.value = null;
    }
    let project = projectJson.value === undefined || projectJson.value == "" ? "totalScore" : "projectData";


    totalScoreChartData.value = formatData(data, project);
    debugger
    if (studentGender.value !== 0 || projectJson.value === undefined || projectJson.value == "") {

      projectScoreChartData.value = formatData(data, project, true);
      console.log(totalScoreChartData, "totalScoreChartData");
    }
    showChart.value = true;
    console.log("ok");

  });
};
const formatData = (data: any, projectName: string, avg = false) => {
  console.log(projectName);
  const keys = Object.keys(data);
  const chartData: any = {
    // test: {"不及格":1.41,"优秀":3.41,"及格":64.86,"良好":1.32,"未完成率":0}
  };
  // let project = projectJson === undefined ? projectJson: 'totalScore'
// if (!avrScore) {
//
// }
  keys.forEach(key => {

    // console.log( (levelNum.map(({level}) => level)))
    let obj: any = {};
    if (avg) {
      const { aveProjectData, level } = data[key][projectName];
      unit.value = data[key][projectName].projectName.replace(/\(（.+）\)/g, "$1");
      obj[level] = aveProjectData;
    } else {
      const { testfree, totalNum, levelNum, aveProjectData, level } = data[key][projectName];
      let undone = 1;
      levelNum.map(({ level }: any) => level).forEach((item: any) => {
        const num = Math.round(levelNum.find(({ level }: any) => level === item).data / totalNum * 10000) / 100;
        obj[item] = isNaN(num) ? 0 : num;
        undone -= obj[item];
      });
      obj["未完成"] = undone === 1 ? 0 : undone > 0 ? undone : 0;
    }

    // levelNum.avrScore = Math.round( aveScore *100)/ 100
    chartData[data[key].schoolName] = obj;
  });
  console.log("aa", chartData);
  // chartData.test.levelNum  ={"不及格":1.41,"优秀":5.41,"及格":64.86,"良好":1.32,"未完成率":0}

  return chartData;
  console.log("ok");
};
let randomtestProjects = ref([]);
// watch([projectJson, studentGender], [getData])
const changeGender = async () => {
  activeName.value = "totalScore";
  projectJson.value = undefined;
  await getProjectsByGender({
    randomTestId: randomtestId,
    gender: studentGender.value
  }).then(({ data }) => randomtestProjects.value = data);
  getData();
};
changeGender();
// getData()
</script>

<style lang="scss" scoped>
</style>
