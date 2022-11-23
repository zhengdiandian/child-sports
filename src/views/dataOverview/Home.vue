<template>
  <div class="wrapper bg-gray-100">
    <div class="flex flex-col lg:flex-row justify-between h-full mt-4">
      <div class="flex space-x-8">
        <div
          v-for="{label} in schoolTypeList"
          class="tab"
          :class="[filterData.schoolType ===label? 'tab-active': '']"
          @click="filterData.schoolType =label"
        >
          {{ label }}数据总览
        </div>
        <!--        <div-->
        <!--          class="tab"-->
        <!--          :class="[filterData.schoolType ==='小学'? 'tab-active': '']"-->
        <!--          @click="filterData.schoolType ='小学'"-->
        <!--        >-->
        <!--          小学数据总览-->
        <!--        </div>-->
      </div>
      <div class="flex items-center space-x-8 mt-4 lg:mt-0  ">
        <div>已激活家长：<span class="text-xl font-semibold">{{ scoreResultsData?.parentNumber ?? 0 }}</span>人</div>
        <SchoolSelect
          ref="topSection"
          v-model:district-code="filterData.schoolDistrict"
          v-model:city-code="filterData.schoolCity"
          v-model:province-code="filterData.schoolProvince"
          v-model:type="filterData.schoolType"
          :showitems="['schoolName']"
          :show-info="false"
          @getSchool="getSchoolId"
        />
        <!--        <el-select-->
        <!--          size="large"-->
        <!--          class="select"-->
        <!--        >-->
        <!--          <el-option-->
        <!--            value="1"-->
        <!--          />-->
        <!--        </el-select>-->
        <!--        <el-select-->
        <!--          size="large"-->
        <!--          class="select"-->
        <!--        >-->
        <!--          <el-option-->
        <!--            value="1"-->
        <!--          />-->
        <!--        </el-select>-->
      </div>
    </div>
    <div
      class="relative mt-6 rounded-3xl bg-yellow h-[23.5rem] bg-[url('@/img/banner.png')]  bg-cover   bg-no-repeat object-cover "
    >
      <!--      <div-->
      <!--        class="absolute top-8 w-[27rem] h-16 bg-yellow text-center text-white leading-[4rem] rounded-r-full text-2xl"-->
      <!--      >-->
      <!--        {{ scoreResultsData?.schoolExamName ?? "" }}-->
      <!--      </div>-->
      <ul class="flex justify-center space-x-8 pt-20">
        <li class="text-white">
          学校：{{ totalCardData?.schoolNumber ?? 0 }}所
        </li>
        <li class="text-white">
          班级：{{ totalCardData?.classNumber ?? 0 }}个
        </li>
        <li class="text-white">
          人数：{{ totalCardData?.studentNumber ?? 0 }}人
        </li>
        <li class="text-white">
          体育老师：{{ totalCardData?.peTeacherNumber ?? 0 }}人
        </li>
      </ul>
      <ul class="flex justify-center items-center mt-16 text-white space-x-4 lg:space-x-16">
        <li class="flex flex-col items-center ">
          <div class="text-xl font-semibold text-center">
            今日新增体测
          </div>
          <div class="mt-2 text-4xl">
            {{ totalCardData?.todayPhysicalNumber ?? 0 }}
            <span class="text-2xl">
              条
            </span>
          </div>
        </li>
        <li class="flex flex-col items-center ">
          <div class="text-xl font-semibold text-center">
            今日新增体育课
          </div>
          <div class="mt-2 text-4xl">
            {{ totalCardData?.todayGymNumber ?? 0 }}
            <span class="text-2xl">
              条
            </span>
          </div>
        </li>
        <li class="flex flex-col items-center ">
          <div class="text-xl font-semibold text-center">
            今日新增体育作业
          </div>
          <div class="mt-2 text-4xl">
            {{ totalCardData?.homeWorkNumber ?? 0 }}
            <span class="text-2xl">
              项
            </span>
          </div>
        </li>
        <!--        <li class="flex flex-col items-center ">-->
        <!--          <div class="text-4xl font-semibold text-center">-->
        <!--            {{ scoreResultsData.avgScore }}-->
        <!--          </div>-->
        <!--          <div class="mt-10 text-xl">-->
        <!--            平均分-->
        <!--          </div>-->
        <!--        </li>-->
        <!--        <li class="flex flex-col justify-center items-center ">-->
        <!--          <div class="text-4xl font-semibold text-center">-->
        <!--            {{ toPercentage(scoreResultsData?.excellentRate ?? 0, "%") }}-->
        <!--          </div>-->
        <!--          <div class="mt-10 text-xl text-center">-->
        <!--            优秀率-->
        <!--          </div>-->
        <!--        </li>-->
        <!--        <li class="flex flex-col  justify-center items-center">-->
        <!--          <div class="text-4xl font-semibold">-->
        <!--            {{ toPercentage(scoreResultsData.goodRate, "%") }}-->
        <!--          </div>-->
        <!--          <div class="mt-10 text-xl w-full text-center">-->
        <!--            良好率-->
        <!--          </div>-->
        <!--        </li>-->
        <!--        <li class="flex flex-col ">-->
        <!--          <div class="text-4xl font-semibold">-->
        <!--            {{ toPercentage(scoreResultsData.passRate, "%") }}-->
        <!--          </div>-->
        <!--          <div class="mt-10 text-xl text-center">-->
        <!--            及格率-->
        <!--          </div>-->
        <!--        </li>-->
        <!--        <li class="flex flex-col ">-->
        <!--          <div class="text-4xl font-semibold text-center">-->
        <!--            {{ toPercentage(scoreResultsData.noPassRate, "%") }}-->
        <!--          </div>-->
        <!--          <div class="mt-10 text-xl text-center">-->
        <!--            不及格率-->
        <!--          </div>-->
        <!--        </li>-->
        <!--        <li class="flex flex-col">-->
        <!--          <div class="text-4xl font-semibold text-center">-->
        <!--            {{ toPercentage(scoreResultsData.undoneRate, "%") }}-->
        <!--          </div>-->
        <!--          <div class="mt-10 text-xl text-center">-->
        <!--            未完成率-->
        <!--          </div>-->
        <!--        </li>-->
      </ul>
    </div>
    <div class="flex justify-between h-20 items-center">
      <h3 class="text-2xl text-gray">
        {{ filterData.examName }}体测成绩汇总
      </h3>
      <el-select
        v-model="filterData.examName"
        class="transparent"
        @change="changeExam"
      >
        <el-option
          v-for="exam in examList"
          :key="exam"
          :value="exam"
          :label="exam"
        ></el-option>
      </el-select>
    </div>
    <div
      class="relative  rounded-3xl bg-yellow h-[16.5rem] bg-[#F9EED2]  bg-cover   bg-no-repeat object-cover  text-black mb-6"
    >
      <!--      <div-->
      <!--        class="absolute top-8 w-[27rem] h-16 bg-yellow text-center text-white leading-[4rem] rounded-r-full text-2xl"-->
      <!--      >-->
      <!--        {{ scoreResultsData?.schoolExamName ?? "" }}-->
      <!--      </div>-->
      <ul class="flex justify-center space-x-8 pt-10 text-gray-1000">
        <li class="">
          学校：<span class="text-black ">{{ scoreResultsData?.schoolNumber ?? 0 }}</span>所
        </li>
        <li class="">
          班级：<span class="text-black ">
            {{ scoreResultsData?.classNumber ?? 0 }}
          </span>个
        </li>
        <li class="">
          人数： <span class="text-black">{{ scoreResultsData?.studentNumber ?? 0 }}</span>人
        </li>
        <!--        <li class="">-->
        <!--          体育老师：{{ totalCardData?.peTeacherNumber ?? 0 }}人-->
        <!--        </li>-->
      </ul>
      <ul class="flex justify-center items-center mt-10 text-black space-x-4 lg:space-x-16">
        <li class="flex flex-col items-center ">
          <div class="text-2xl font-semibold text-center text-gray-1000">
            平均分
          </div>
          <div class="mt-6 text-4xl text-center">
            {{ scoreResultsData.avgScore ?? 0 }}
          </div>
        </li>
        <li class="flex flex-col justify-center items-center ">
          <div class="text-2xl font-semibold text-center text-gray-1000">
            优秀率
          </div>
          <div class="mt-6 text-4xl text-center">
            {{ toPercentage(scoreResultsData?.excellentRate ?? 0, "%") }}
          </div>
        </li>
        <li class="flex flex-col  justify-center items-center">
          <div class="text-2xl font-semibold text-center text-gray-1000">
            良好率
          </div>
          <div class="mt-6 text-4xl text-center">
            {{ toPercentage(scoreResultsData.goodRate, "%") }}
          </div>
        </li>
        <li class="flex flex-col ">
          <div class="text-2xl font-semibold text-center text-gray-1000">
            及格率
          </div>
          <div class="mt-6 text-4xl text-center">
            {{ toPercentage(scoreResultsData.passRate, "%") }}
          </div>
        </li>
        <li class="flex flex-col ">
          <div class="text-2xl font-semibold text-center text-gray-1000">
            不及格率
          </div>
          <div class="mt-6 text-4xl text-center">
            {{ toPercentage(scoreResultsData.noPassRate, "%") }}
          </div>
        </li>
        <li class="flex flex-col">
          <div class="text-2xl font-semibold text-center text-gray-1000">
            未完成率
          </div>
          <div class="mt-6 text-4xl text-center">
            {{ toPercentage(scoreResultsData.undoneRate, "%") }}
          </div>
        </li>
      </ul>
    </div>

    <div class=" lg:flex space-x-4 w-full">
      <div class="w-full lg:w-1/2 rounded-3xl   py-5 px-4 box-border bg-[#E4ECF8] ">
        <div class="flex justify-between">
          <div class="square text-2xl font-semibold ">
            男生
          </div>
          <div class="text-gray-600">
            人数：<span class="text-xl text-black text-semibold">{{ genderData?.male?.maleNumber }}</span>
          </div>
        </div>
        <ul
          class="flex justify-center items-center mt-16 pb-8   space-x-2 lg:space-x-2 lg:space-x-2 md:space-y-2 grid grid-cols-6 xl:grid-cols-3  2xl:grid-cols-6 text-center"
        >
          <li class="flex flex-col items-center ">
            <div class="text-2xl font-semibold text-center">
              {{ genderData?.male?.avgScore }}
            </div>
            <div class="mt-4 text-base text-gray-600">
              平均分
            </div>
          </li>
          <li class="flex flex-col justify-center items-center ">
            <div class="text-2xl font-semibold text-center">
              {{ toPercentage(genderData?.male?.excellentRate, "%") }}
            </div>
            <div class="mt-4 text-base text-center text-gray-600">
              优秀率
            </div>
          </li>
          <li class="flex flex-col  justify-center items-center">
            <div class="text-2xl font-semibold">
              {{ toPercentage(genderData?.male?.goodRate, "%") }}
            </div>
            <div class="mt-4 text-base   w-full text-center text-gray-600">
              良好率
            </div>
          </li>
          <li class="flex flex-col ">
            <div class="text-2xl font-semibold">
              {{ toPercentage(genderData?.male?.passRate, "%") }}
            </div>
            <div class="mt-4 text-base text-center text-gray-600">
              及格率
            </div>
          </li>
          <li class="flex flex-col ">
            <div class="text-2xl font-semibold text-center">
              {{ toPercentage(genderData?.male?.noPassRate, "%") }}
            </div>
            <div class="mt-4 text-base text-center text-gray-600">
              不及格率
            </div>
          </li>
          <li class="flex flex-col">
            <div class="text-2xl font-semibold text-center">
              {{ toPercentage(genderData?.male?.undoneRate, "%") }}
            </div>
            <div class="mt-4 text-base text-center text-gray-600">
              未完成率
            </div>
          </li>
        </ul>
        <PieChart :chart-data="genderData.male"></PieChart>
      </div>
      <div class="w-full box-box lg:w-1/2 rounded-3xl  bg-white py-5 px-4 box-border bg-[#E9F7E4] ">
        <div class="flex justify-between">
          <div class="square text-2xl font-semibold ">
            女生
          </div>
          <div class="text-gray-600">
            人数：<span class="text-xl text-black text-semibold">{{ genderData?.female?.femaleNumber }}</span>
          </div>
        </div>
        <ul
          class="flex justify-center items-center mt-16 pb-8   space-x-2 lg:space-x-2 lg:space-x-2 md:space-y-2 grid grid-cols-6 xl:grid-cols-3  2xl:grid-cols-6 text-center"
        >
          <li class="flex flex-col items-center ">
            <div class="text-2xl font-semibold text-center">
              {{ genderData?.female?.avgScore }}
            </div>
            <div class="mt-4 text-base text-gray-600">
              平均分
            </div>
          </li>
          <li class="flex flex-col justify-center items-center ">
            <div class="text-2xl font-semibold text-center">
              {{ toPercentage(genderData?.female?.excellentRate, "%") }}
            </div>
            <div class="mt-4 text-base text-center text-gray-600">
              优秀率
            </div>
          </li>
          <li class="flex flex-col  justify-center items-center">
            <div class="text-2xl font-semibold">
              {{ toPercentage(genderData?.female?.goodRate, "%") }}
            </div>
            <div class="mt-4 text-base   w-full text-center text-gray-600">
              良好率
            </div>
          </li>
          <li class="flex flex-col ">
            <div class="text-2xl font-semibold">
              {{ toPercentage(genderData?.female?.passRate, "%") }}
            </div>
            <div class="mt-4 text-base text-center text-gray-600">
              及格率
            </div>
          </li>
          <li class="flex flex-col ">
            <div class="text-2xl font-semibold text-center">
              {{ toPercentage(genderData?.female?.noPassRate, "%") }}
            </div>
            <div class="mt-4 text-base text-center text-gray-600">
              不及格率
            </div>
          </li>
          <li class="flex flex-col">
            <div class="text-2xl font-semibold text-center">
              {{ toPercentage(genderData?.female?.undoneRate, "%") }}
            </div>
            <div class="mt-4 text-base text-center text-gray-600">
              未完成率
            </div>
          </li>
        </ul>
        <PieChart :chart-data="genderData.female">
        </PieChart>
      </div>
    </div>
    <div class="w-full  rounded-3xl  bg-white py-5 px-4 box-border   mt-8">
      <div class="flex justify-between items-end">
        <div class="square text-2xl font-semibold ">
          日常体育课/体育作业
        </div>
        <div class="pr-4">
          <button @click="$router.push({name: 'peList'})">
            <el-icon class="text-gray-300 text-3xl ">
              <ArrowRightBold />
            </el-icon>
          </button>
        </div>
      </div>
      <ul class="flex  justify-center items-center mt-2 pb-8  space-x-2 lg:space-x-12">
        <li class="flex flex-col items-center ">
          <div class="text-3xl font-semibold text-center">
            {{ dailyPhysicalData.schoolNumber ?? 0 }}
          </div>
          <div class="mt-4 text-xl text-gray-600">
            学校
          </div>
        </li>
        <li class="flex flex-col items-center ">
          <div class="text-3xl font-semibold text-center">
            {{ dailyPhysicalData.classNumber ?? 0 }}
          </div>
          <div class="mt-4 text-xl text-gray-600">
            班级
          </div>
        </li>
        <li class="flex flex-col items-center ">
          <div class="text-3xl font-semibold text-center">
            {{ dailyPhysicalData.studentNumber ?? 0 }}
          </div>
          <div class="mt-4 text-xl text-gray-600">
            学生
          </div>
        </li>
      </ul>
      <div class="px-6">
        <ELineChart
          v-if="dailyPhysicalData.studentList?.length??false"
          :chart-data="{data: dailyPhysicalData.studentList,data2:dailyPhysicalData.homeworkStudentList??[] , timeList:dailyPhysicalData.timeList??[]
          }"
          color="#02D29F "
          series-name="体育课人数"
          series-name2="提交体育作业人数"
          y-axis-name="人数"
        >
        </ELineChart>
        <ELineChart
          v-if="dailyPhysicalData.classList?.length?? false"
          :chart-data="{data: dailyPhysicalData.classList??[],data2: dailyPhysicalData.homeworkClassList, timeList:dailyPhysicalData.timeList??[]}"
          color="#02D29F"
          series-name="体育课班级数"
          series-name2="发布体育作业班级数"
          y-axis-name="班级数"
        ></ELineChart>
        <ELineChart
          v-if="dailyPhysicalData.schoolList?.length??false"
          :chart-data="{data: dailyPhysicalData.schoolList??[], data2: dailyPhysicalData.homeworkSchoolList, timeList:dailyPhysicalData.timeList??[]}"
          color="#02D29F"
          series-name="体育课学校数"
          series-name2="发布体育作业学校数"
          y-axis-name="学校数"
        ></ELineChart>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import PieChart from "@/components/charts/PieChart.vue";
import SchoolSelect from "@/components/SchoolSelect/index.vue";
import { dailyPhysical, gender, getExamName, score, total } from "@/api/dataOverview";
import { DailyPhysical, GenderData, IGender, ISoreResults, ScoreResultsData } from "@/interface/data-overview";
import { ref, watch } from "vue";
import { ArrowRightBold } from "@element-plus/icons-vue";
import ELineChart from "@/components/charts/ELineChart.vue";
import userHooks from "@/hooks/useHook";

const { schoolTypeList } = userHooks();

let topSection = ref("");

function toPercentage(num: number, unit = "") {
  if (!num) return 0;
  num = Math.round(num * 100) / 100;
  return Number(num) + unit;
}

const initFilterData = new DailyPhysical();
if (
  initFilterData.schoolType === "九年一贯"
) {
  initFilterData.schoolType = "中学";
}
const filterData = ref(initFilterData);
const defaultScoreResultsData = new ScoreResultsData();
let scoreResultsData = ref(defaultScoreResultsData);
const defaultGenderData = new GenderData();
let genderData = ref(defaultGenderData);
const defaultDailyPhysicalData = {
  studentList: [],
  schoolList: [],
  classList: [],
  homeworkStudentList: [],
  homeworkClassList: [],
  homeworkSchoolList: []
};
let dailyPhysicalData = ref(defaultDailyPhysicalData);
const examList = ref([]);
const totalCardData = ref({});


const init = async () => {
  // (async () => {
  const { data } = await getExamName(filterData.value);
  examList.value = data ?? [];
  filterData.value.examName = data[0];
  // })();
  // debugger
  total(filterData.value).then(({ data }: any) => {
    totalCardData.value = data;
  });
  dailyPhysical(filterData.value).then((res: any) => {
    dailyPhysicalData.value = res.data;
  });
  if (filterData.value.examName) {
    changeExam();
  } else {
    scoreResultsData.value = defaultScoreResultsData;
    genderData.value = defaultGenderData;
    dailyPhysicalData.value = defaultDailyPhysicalData;
  }
};
const changeExam = () => {
  gender(filterData.value).then((res: IGender) => {
    genderData.value = res.data;
  });
  score(filterData.value).then((res: ISoreResults) => scoreResultsData.value = res.data);
};
// init()
watch(() => filterData.value.schoolId, init, {
  deep: true
});
watch(() => filterData.value.schoolType, init, {
  deep: true
});
watch(() => filterData.value.schoolDistrict, init, {
  deep: true
});

function getSchoolId(type: "小学" | "初中", id: number) {
  filterData.value.schoolId = id;
  filterData.value.schoolType = type;
// filterData.dailytestGrade = (type === "小学") ? 1 : 2;
// creatForm.dailytestSchoolId = id;
// // creatForm.classType = type === "小学" ? 1 : 2;
// filterData.value.schoolType = type;
// init()
// gradeList.value = filterGradeList(type);
// getEm();
}
</script>
<style scoped lang="scss">

.tab {
  @apply lg:text-xl  text-xs h-10 font-semibold relative before:inline-block before:absolute before:w-1/2  before:h-1.5 before:bottom-0 before:right-1/2 before:translate-x-1/2 before:rounded-2xl cursor-pointer
}

.tab-active {
  @apply before:bg-yellow
}

::v-deep( .select) {

  .el-input__inner {
    background-color: transparent;
  }
}

</style>
