<!--年度纵向-->
<template>
  <div class="bg-gray-100">
    <div>
      <div class="bg-white p-4 rounded-sm ">
        <el-select
          v-model="filterData.schoolType"
          class="w-40 mr-2"
          placeholder="请选择学校类型"
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
          v-model:district-code="filterData.schoolDistrict"
          v-model:province-code="filterData.schoolProvince"
          v-model:city-code="filterData.schoolCity"
        />

        <el-select
          v-if="!showSchoolList&&checkSchoolList.length"
          v-model="checkSchoolList"
          multiple
          collapse-tags
          :collapse-tags-tooltip="true"
          class="mr-2"
          style="width: 240px"
          placeholder="请选择学校"
          @click="showSchoolList = true"
        >
          <el-option
            v-for="item in schoolList"
            :key="item.school_id"
            :value="item.school_id"
            :label="item.school_name"
          />
        </el-select>
        <div
          v-if="!showSchoolList&&checkSchoolList.length"
          class="mt-4 "
        >
          <el-select
            v-model="filterData.grade"
            class="w-40 mx-2"
            placeholder="请选择年级"
            @change="changeExam"
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
            v-model="filterData.examList"
            class="w-40 mr-2"
            placeholder="请选择学期"
            multiple
            collapse-tags
            :collapse-tags-tooltip="true"
            @change="changeExam"
            @visible-change="getExamList"
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

        <div>
          <div
            v-if="showSchoolList"
            class="p-4 "
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

            <div class="flex justify-center mt-6">
              <el-button @click="showSchoolList = false">
                取消
              </el-button>
              <el-button
                type="primary"
                @click="showSchoolList = false"
              >
                确定
              </el-button>
            </div>
          </div>
        </div>
      </div>
      <div class="bg-gray-100 h-4"></div>

      <!--      <div class="pl-6 bg-white rounded-xl pb-2">-->
      <!--        <SelectItem title="请选择学校类别">-->
      <!--          <div class="p-4">-->
      <!--            <el-radio-group v-model="filterData.schoolType">-->
      <!--              <el-radio-button label="小学" />-->
      <!--              <el-radio-button label="中学" />-->
      <!--            </el-radio-group>-->
      <!--          </div>-->
      <!--        </SelectItem>-->
      <!--        <SelectItem title="请选择对比维度">-->
      <!--          <SelectAreaItem-->
      <!--            :school-type="filterData.schoolType"-->
      <!--            @changeSelectCity="changeSelectCity"-->
      <!--            @changeSchoolList="changeSchoolList"-->
      <!--          ></SelectAreaItem>-->
      <!--        </SelectItem>-->
      <!--        <SelectItem title="请选择年级">-->
      <!--          <el-radio-group-->
      <!--            v-if="filterData.schoolType == '小学'"-->
      <!--            v-model="filterData.grade"-->
      <!--            :disabled="!filterData.areaList.length"-->
      <!--            class="p-4"-->
      <!--            @change="getExamList"-->
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
      <!--            v-else-if="filterData.schoolType == '中学'"-->
      <!--            v-model="filterData.grade"-->
      <!--            :disabled="!filterData.areaList.length"-->
      <!--            class="p-4"-->
      <!--            @change="getExamList"-->
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
      <!--            :disabled="!filterData.areaList.length"-->
      <!--            class="p-4"-->
      <!--            @change="getExamList"-->
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
      <!--              @change="getExamList"-->
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
      <!--          <el-checkbox-->
      <!--            v-model="checkAll"-->
      <!--            class="ml-4"-->
      <!--            :disabled="!examNames.length"-->
      <!--            :indeterminate="isIndeterminate"-->
      <!--            @change="handleCheckAllChange"-->
      <!--          >-->
      <!--            全选-->
      <!--          </el-checkbox>-->
      <!--          <el-checkbox-group-->
      <!--            v-if="examNames.length"-->
      <!--            v-model="filterData.examList"-->
      <!--            class="p-4"-->
      <!--            @change="changeExam"-->
      <!--          >-->
      <!--            <el-checkbox-->
      <!--              v-for="item in examNames"-->
      <!--              :key="item"-->
      <!--              :label="item"-->
      <!--            >-->
      <!--              {{ item }}-->
      <!--            </el-checkbox>-->
      <!--          </el-checkbox-group>-->
      <!--          <h1-->
      <!--            v-else-->
      <!--            class="text-2xl text-red ml-6"-->
      <!--          >-->
      <!--            暂无学期-->
      <!--          </h1>-->
      <!--        </SelectItem>-->
      <!--        <SelectItem-->
      <!--          v-if="filterData.examList.length>0"-->
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
      <!--        &lt;!&ndash; <div class="p-4 text-center">-->
      <!--          <el-button @click="submitFilterData">-->
      <!--            提交信息-->
      <!--          </el-button>-->
      <!--        </div> &ndash;&gt;-->
      <!--      </div>-->
    </div>
    <div
      v-if="barData"
      class="bg-white rounded-md mt-4 px-4 "
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
            v-if="filterData.gender !== ''|| filterData.project === 'score'"
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
              fixed-name="历史平均值"
            ></ChartC>
          </template>
          <template v-else>
            <ChartC
              v-if="projectScoreChartData"
              :chart-data="projectScoreChartData"
              fixed-name="历史平均值"
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
<script setup lang="ts">
import ChartC from "@/components/Charts/Chart.vue";
import { getExamName, getGadeAvg, getGadeScore, getProject } from "@/api/dataOverview";
import { ElMessage } from "element-plus";

import { reactive, ref, watch } from "vue";
import { formatData } from "./hooks";
import NoData from "@/components/NoData.vue";
import userHooks from "@/hooks/useHook";
import { getAllSchoolNames } from "@/api";
import { sortArr } from "@/utils/index";
import { filterGradeList } from "@/utils/baseData";

const changeSchoolType = async () => {
  projectName.value = "";
  filterData.examList = [];
  showSchoolList.value = true;
  await getAllSchool();

};
const { DailyPhysical, AreaInformation, schoolTypeList, schoolId } = userHooks();
const showSchoolList = ref(false);
const schoolList = ref([]);
const checkSchoolList: any = ref(schoolId ? [+schoolId] : []);
const checkAll = ref(false);
const isIndeterminate = ref(true);
const handleCheckAllChange = (val: boolean) => {
  checkSchoolList.value = val ? schoolList.value.map((item: any) => item.school_id) : [];
  isIndeterminate.value = false;

};
const handleCheckedSchoolsChange = (value: number[]) => {
  const checkedCount = value.length;
  checkAll.value = checkedCount === schoolList.value.length;
  isIndeterminate.value = checkedCount > 0 && checkedCount < schoolList.value.length;

};

const getAllSchool = () => {
  const parmeter = {
    schoolCity: filterData.schoolCity,
    schoolDistrict: filterData.schoolDistrict,
    schoolProvince: filterData.schoolProvince,
    schoolType: filterData.schoolType
  };
  getAllSchoolNames(parmeter, true).then((res) => {
    console.log("获取学校列表", res);
    schoolList.value = sortArr(res.data, "school_id");
  });
};
const filterData = reactive({
  areaList: [],
  examList: [],
  gender: undefined,
  grade: "",
  project: "",
  schoolCity: "",
  schoolDistrict: "",
  schoolProvince: "",
  schoolType: "小学",
  sort: "ASC"
});
watch(() => filterData.schoolDistrict, async () => {
  if (!schoolId) {
    showSchoolList.value = true;

  }
  await getAllSchool();

});
const projects: any = ref([]);
const examNames = ref([]);
const activeName = ref("first");
const totalScoreChartData = ref(null);
const projectScoreChartData = ref(null);
const barData = ref(null);
const tabIndex = ref("0");
const projectName = ref("");
// const checkAll = ref(false);
// const isIndeterminate = ref(true);
// const handleCheckAllChange = (val) => {
//   filterData.examList = val ? examNames.value : [];
//   isIndeterminate.value = false;
//   if (val)
//     changeExam();
//
// };
watch(() => filterData.gender, (newValue, oldValue) => {
  changeExam();
}, {
  deep: true
});
watch(() => [filterData.gender, filterData.grade, filterData.project, filterData.examList], (arr, arr2) => {
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
    if (filterData.grade && filterData.project && filterData.examList) {
      handleClick({ index: "0" });
    }

  },
  {
    deep: true
  });
const changeProject = (name) => {
  projectName.value = projects.value.find((item: any) => item.value == name).name;

  submitFilterData();
};
const changeSelectCity = (value) => {
  filterData.areaList = [];
  filterData.gender = undefined;
  filterData.grade = "";
  filterData.project = "";
  filterData.schoolCity = value.city;
  filterData.schoolDistrict = value.district;
  filterData.schoolProvince = value.province;
};
const changeSchoolList = (value) => {
  console.log("学校多选", value);
  filterData.areaList = value;
  filterData.grade = "";
  filterData.examList = [];
};
const getExamList = (flag: false) => {
  if (!flag) return;
  barData.value = null;
  projectName.value = filterData.project = "";
  checkAll.value = false;
  isIndeterminate.value = true;
  filterData.examList = [];
  filterData.areaList = checkSchoolList.value;

  let parmeter = {
    areaList: filterData.areaList,
    grade: filterData.grade,
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
const changeExam = async (value) => {
  projectName.value = filterData.project = "";
  filterData.areaList = checkSchoolList.value;

  let parmeter = {
    areaList: filterData.areaList,
    examList: filterData.examList,
    grade: filterData.grade,
    gender: filterData.gender,
    schoolCity: filterData.schoolCity,
    schoolDistrict: filterData.schoolDistrict,
    schoolProvince: filterData.schoolProvince,
    schoolType: filterData.schoolType
  };
  if (filterData.examList.length)
    await getProject(parmeter).then((res) => {
      console.log("获取项目", res);
      projects.value = res.data;
    });
};

const submitFilterData = () => {
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
  filterData.areaList = checkSchoolList.value;
  getGadeScore(filterData).then((res) => {
    console.log("获取总分分布", res);
    barData.value = res.data;
    const keyName = filterData.project === "bmi" ? filterData.project : "score";
    totalScoreChartData.value = formatData(res.data[keyName + "List"], keyName === "score" ? 0 : 1);
  });
};
const unit = ref("");
const getAvgScore = () => {
  // if(!filterData.gender){
  //   return ElMessage({
  //       message: "请指定性别！",
  //       type: "warning",
  //     });
  // }
  filterData.areaList = checkSchoolList.value;

  getGadeAvg(filterData).then((res) => {

    console.log("获取平均分", res);
    let obj: any = {};
    res.data.forEach(({ avgscore, level, name, projectName }: any) => {
      unit.value = projectName;
      let o: any = {};
      o[level] = avgscore;
      obj[name] = o;
    });

    projectScoreChartData.value = obj;
  });
};
</script>
<style lang="scss" scoped></style>
