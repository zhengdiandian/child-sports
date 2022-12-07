<template>
  <div class=" px-2.5 pt-3 bg-gray-100 min-h-modal  ">
    <div class="bg-white wrapper">
      <div class="w-full flex justify-between border-b border-gray-300 pb-2 pt-3">
        <div>
          <h3 class="text-xl text-black  flex items-center">
            <span class="iconfont icon-jiajianzujianjiahao text-blue  text-2xl"></span>
            <span
              class="pl-2"
            >添加测试记录</span>
          </h3>
        </div>
        <div>
          <el-button
            class="text-gray-700 text-lg"
            type="text"
            @click="$router.go(-1)"
          >
            <span class="iconfont icon-fanhui text-2xl"></span>
            <span class="underline align-text-bottom ">返回</span>
          </el-button>
        </div>
      </div>
      <div
        v-if="!isSelected"
        class="mx-auto w-1/2 mt-14"
      >
        <div class="">
          <span class="text-black">选择学员：</span>
          <el-input
            v-model="filterStudentData.fuzzyQuery"
            class="w-[75%]"
            placeholder="请输入学生姓名或手机号码"
          >
            <template #prefix>
              <el-icon class="el-input__icon">
                <Search />
              </el-icon>
            </template>
          </el-input>
          <el-button
            class="ml-4"
            size="large"
            type="warning"
            @click="getList"
          >
            查询
          </el-button>
        </div>
        <el-table
          :border="true"
          :data="tableData.list"
          :header-cell-style="{background:'#3470D0',color:'white'}"
          class="mt-8"
        >
          <el-table-column
            align="center"
            label="姓名"
            prop="infantName"
            width="120"
          />
          <el-table-column
            align="center"
            label="性别"
            prop="infantGender"
            width="60"
          />


          <el-table-column
            align="center"
            label="生日"
            prop="infantBirthday"
            width="120"
          >
            <template #default="scope">
              <div>
                {{ dateFormat(scope.row.infantBirthday, "yyyy-mm-dd") }}
              </div>
            </template>
          </el-table-column>

          <el-table-column
            align="center"
            label="家长手机号码"
            prop="infantParentPhone"
            width="190"
          />


          <el-table-column
            align="center"
            fixed="right"
            label="操作"
            min-width="60"
            prop="address"
            width="auto"
          >
            <template #default="scope">
              <el-link
                type="primary"
                @click="selectedStudentClick(scope.row)"
              >
                选择
              </el-link>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div
        v-if="isSelected"
        class="mx-auto w-1/3 mt-14"
      >
        <div class="flex justify-end mb-12">
          <el-button
            size="large"
            type="warning"
            @click="isSelected = false"
          >
            重新选择
          </el-button>
        </div>
        <el-form
          ref="ruleFormRef"
          :model="ruleForm"
          :rules="rules"
          :size="formSize"
          class="demo-ruleForm space-y-4"
          label-width="auto"
        >
          <!--          <template>-->
          <el-form-item
            label="姓名："
            prop="xxx"
          >
            <span class="text-black">{{ currentStudent.infantName }}</span>
          </el-form-item>
          <el-form-item
            label="性别："
          >
            <span>{{ currentStudent.infantGender }}</span>
          </el-form-item>
          <el-form-item
            label="生日："
          >
            <span>{{ dateFormat(currentStudent.infantBirthday, "yyyy-mm-dd") }}</span>
          </el-form-item>
          <el-form-item
            label="家长手机号码："
          >
            <span>{{ currentStudent.infantParentPhone }}</span>
          </el-form-item>
          <!--          </template>-->

          <el-form-item
            label="测试老师："
            prop="coach"
          >
            <el-input
              v-model="ruleForm.coach"
              placeholder="请输入测试老师"
              type="text"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="测试日期："
            prop="testTime"
          >
            <el-date-picker
              v-model="ruleForm.testTime"
              class="w-full"
              placeholder="选择测试时间"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item
            v-for="item in ruleForm.projectData"
            :key="item.projectName"
            :label="item.projectName+':'"
          >
            <el-input
              v-model="item.value"

              :placeholder="`请输入${item.projectName}：`"
            >
              <template #append>
                <span class="text-black">cm</span>
              </template>
            </el-input>
          </el-form-item>


          <el-form-item
            label="尊重："
            prop="respectScore"
          >
            <el-rate
              v-model="ruleForm.respectScore"
              class="mt-1.5"
              clearable
              size="large"
            ></el-rate>
          </el-form-item>
          <el-form-item
            label="激情："
            prop="passionScore"
          >
            <el-rate
              v-model="ruleForm.passionScore"
              class="mt-1.5"
              clearable
              size="large"
            ></el-rate>
          </el-form-item>
          <el-form-item
            label="坚韧："
            prop="toughScore"
          >
            <el-rate
              v-model="ruleForm.toughScore"
              class="mt-1.5"
              clearable
              size="large"
            ></el-rate>
          </el-form-item>
          <el-form-item
            label="正直："
            prop="uprightScore"
          >
            <el-rate
              v-model="ruleForm.uprightScore"
              class="mt-1.5"
              clearable
              size="large"
            ></el-rate>
          </el-form-item>
          <el-form-item
            label="团队："
            prop="teamSpiritScore"
          >
            <el-rate
              v-model="ruleForm.teamSpiritScore"
              class="mt-1.5"
              clearable
              size="large"
            ></el-rate>
          </el-form-item>
          <el-form-item
            label="全力以赴："
            prop="allOutScore"
          >
            <el-rate
              v-model="ruleForm.allOutScore"
              class="mt-1.5"
              clearable
              size="large"
            ></el-rate>
          </el-form-item>
          <el-form-item
            label="训练建议："
            prop="randomtestIntroduction"
          >
            <el-input
              v-model="ruleForm.trainAdvice"
              :autosize="{ minRows: 4, maxRows: 8 }"
              placeholder="请输入训练建议"
              type="textarea"
            ></el-input>
          </el-form-item>

          <el-form-item>
            <div class=" w-full flex justify-around py-20">
              <el-button
                class="w-36"
                @click="resetForm(ruleFormRef)"
              >
                重置
              </el-button>

              <el-button
                v-loading="isLoading"
                :disabled="isLoading"
                :element-loading-text="btnText+'中'"
                class="w-36"
                type="primary"
                @click="submitForm(ruleFormRef)"
              >
                {{ btnText }}并生成报告
              </el-button>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {Search} from "@element-plus/icons-vue";

import {computed, onMounted, reactive, ref, unref} from "vue";
import {useRoute, useRouter} from "vue-router";
import type {ElForm} from "element-plus";
import {ElMessage} from "element-plus";
import rules from "@/utils/rules";
import {useStore} from "vuex";
import {getInfant, infantTestRecordAdd} from "@/api/toddlerDataManagement";
import {pageSize} from "@/hooks/pagination";
import dateFormat from "@/utils/dateFormat.js";

const router = useRouter();
type FormInstance = InstanceType<typeof ElForm>
const route = useRoute();
const store = useStore();
const formSize = ref("large");
const options = ref([]);
const ruleFormRef = ref<FormInstance>();
const isLoading = ref<boolean>(false);
const city = ref({
  area: {
    district: ""
  }

});
const userName = computed(() => store.state.User.userName);

const currentStudent = ref({})
const selectedStudentClick = (row: any) => {
  currentStudent.value = row
  ruleForm.value.infantId = row.infantId
  isSelected.value = true

}
const goBack = () => {
  router.replace({
    name: "samplingManagement", query: {
      now: +new Date()
    }
  });
};

const tableData = reactive({
  pageNum: 0,
  pageSize: 0,
  total: 0,
  totalPage: 1,
  list: []
});
const filterStudentData = reactive({
  pageNum: 1,
  pageSize,
  infantGender: undefined,
  fuzzyQuery: ""
});

const getList = () => {
  const parmeter = filterStudentData;
  getInfant(parmeter).then((res) => {
    const {data} = res;
    // tableData.pageNum = data.pageNum;
    tableData.list = data;
    // tableData.total = data.total;
    // console.log("学校列表", data, tableData);
  });
};
getList()
const findProject = (projectName: string) => ruleForm.value.projectData.find(item => item.projectName === projectName)
const defaultData = {
  coach: unref(userName),
  "allOutScore": 0,
  "passionScore": 0,
  "projectData": [
    {"projectName": "身高", "value": 135, unit: 'cm'},
    {projectName: "体重", "value": "", unit: 'kg'},
    {projectName: "坐位体前屈", "value": "", unit: 'cm'},
    {projectName: "立定跳远", "value": "", unit: 'cm'},
    {projectName: "双脚连续跳", "value": "", unit: 's'},
    {projectName: "10米折返跑", "value": "", unit: 's'},
    {projectName: "网球掷远", "value": "", unit: 'm'},
    {projectName: "走平衡木", "value": "", unit: 's'},

  ],
  "recordId": undefined,
  infantId: undefined,
  "respectScore": 0,
  "teamSpiritScore": 0,
  "testTime": "",
  "toughScore": 0,
  "trainAdvice": "string",
  "uprightScore": 0
}
let ruleForm = ref(
  defaultData
);


onMounted(() => {
  if (route.query.recordId) {
    debugger
    ruleForm.value = store.state.RandomTest.randomtest;

    try {
      console.log(`city', ${city.value.area}`, store.state.RandomTest.randomtest, store.state.RandomTest.randomtest.randomtestDistrictCode);
      city.value.area.district = store.state.RandomTest.randomtest.randomtestDistrictCode + "";
    } catch (e) {
      console.error(e);
    }

  }
});

const isSelected = ref(false);

const btnText = computed(() => route.query.recordId ? "修改" : "保存");
// const rules = reactive()

const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate((valid) => {
    if (valid) {
      isLoading.value = true;
      const parmeter = {...ruleForm.value};
      // parmeter.randomtestProjectList = JSON.stringify(parmeter.randomtestProjectList)
      infantTestRecordAdd(parmeter, !!(route.query.recordId)).then((res: any) => {
        if (res.code === 200) {
          ElMessage({
            message: "成功",
            type: "success"
          });
          isLoading.value = false;
          resetForm(formEl);
          if (!route.query.recordId) {
            return isSelected.value = false
          }
          goBack();
        }
        isLoading.value = false;
      }).catch((error) => {
        isLoading.value = false;
        console.log(error);
        const {message} = error;
        ElMessage({
          message,
          type: "error"
        });
        // ElMessage.error(message)
      });
      console.log("submit!");
    } else {
      console.error("error submit!");
      return false;
    }
  });
};

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  city.value.area.district = "";
  formEl.resetFields();
  ruleForm = ref(defaultData);
};

const checkAll = ref(false);
const isIndeterminate = ref(true);


const handleCheckAllChange = (val: boolean) => {
  ruleForm.value.randomtestProjectList = val ? options.value : [];
  isIndeterminate.value = false;
};
const handleCheckedCitiesChange = (value: string[]) => {
  const checkedCount = value.length;
  checkAll.value = checkedCount === options.value.length;
  isIndeterminate.value = checkedCount > 0 && checkedCount < options.value.length;
};
</script>

