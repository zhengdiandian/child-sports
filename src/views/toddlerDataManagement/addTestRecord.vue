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
            type="text"
            class="text-gray-700 text-lg"
            @click="$router.go(-1)"
          >
            <span class="iconfont icon-fanhui text-2xl"></span>
            <span class="underline align-text-bottom ">返回</span>
          </el-button>
        </div>
      </div>
      <div class="mx-auto w-1/3 mt-24">
        <el-form
          ref="ruleFormRef"
          :model="ruleForm"
          :rules="rules"
          label-width="auto"
          class="demo-ruleForm space-y-10"
          :size="formSize"
        >
          <el-form-item
            label="身高："
            prop="randomtestName"
          >
            <el-input
              v-model="ruleForm.randomtestName"
              placeholder="请输入身高："
            >
              <template #append><span class="text-black">cm</span></template>
            </el-input>

          </el-form-item>

          <el-form-item
            label="体重："
            prop="randomtestName"
          >
            <el-input
              v-model="ruleForm.randomtestName"
              placeholder="请输入体重"
            >
              <template #append><span class="text-black">kg</span></template>
            </el-input>

          </el-form-item>

          <el-form-item
            label="坐位体前屈："
            prop="randomtestName"
          >
            <el-input
              v-model="ruleForm.randomtestName"
              placeholder="请输入坐位体前屈"
            >
              <template #append><span class="text-black">cm</span></template>
            </el-input>

          </el-form-item>

          <el-form-item
            label="立定跳远："
            prop="randomtestName"
          >
            <el-input
              v-model="ruleForm.randomtestName"
              placeholder="请输入立定跳远"
            >
              <template #append><span class="text-black">cm</span></template>
            </el-input>

          </el-form-item>

          <el-form-item
            label="双脚连续跳："
            prop="randomtestName"
          >
            <el-input
              v-model="ruleForm.randomtestName"
              placeholder="请输入双脚连续跳"
            >
              <template #append><span class="text-black">s</span></template>
            </el-input>

          </el-form-item>

          <el-form-item
            label="10米折返跑："
            prop="randomtestName"
          >
            <el-input
              v-model="ruleForm.randomtestName"
              placeholder="请输入10米折返跑"
            >
              <template #append><span class="text-black">s</span></template>
            </el-input>

          </el-form-item>
          <el-form-item
            label="网球掷远："
            prop="randomtestName"
          >
            <el-input
              v-model="ruleForm.randomtestName"
              placeholder="请输入网球掷远："
            >
              <template #append><span class="text-black">m</span></template>
            </el-input>

          </el-form-item>
          <el-form-item
            label="走平衡木："
            prop="randomtestName"
          >
            <el-input
              v-model="ruleForm.randomtestName"
              placeholder="请输入走平衡木"
            >
              <template #append><span class="text-black">s</span></template>
            </el-input>

          </el-form-item>

          <el-form-item
            label="训练建议："
            prop="randomtestIntroduction"
          >
            <el-input
              v-model="ruleForm.randomtestIntroduction"
              type="textarea"
              placeholder="请输入训练建议"
              :autosize="{ minRows: 4, maxRows: 8 }"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="训练建议："
            prop="randomtestIntroduction"
          >
            <el-rate
              size="large"

            ></el-rate>
          </el-form-item>
          <el-form-item>
            <div class=" w-full flex justify-around pt-20">
              <el-button
                class="w-36"
                @click="resetForm(ruleFormRef)"
              >
                重置
              </el-button>

              <el-button
                v-loading="isLoading"
                :element-loading-text="'btnText'"
                :disabled="isLoading"
                type="primary"
                class="w-36"
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
import {computed, onMounted, ref, watch} from "vue";
import {useRoute, useRouter} from "vue-router";
import type {ElForm} from "element-plus";
import {ElMessage} from "element-plus";
import {getProjectsByGrade, randomTestRelease} from "@/api/randomTest";
import {Grade, SchoolType} from "@/utils/baseData";
import rules from "@/utils/rules";
import {useStore} from "vuex";

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
const goBack = () => {
  router.replace({
    name: "samplingManagement", query: {
      now: +new Date()
    }
  });
};
let ruleForm = ref({
  recordId: undefined,
  randomtestName: "",
  randomtestSchoolType: SchoolType[0].label,
  randomtestGrade: Grade[0].value,
  randomtestIntroduction: "",
  randomtestProjectList: undefined,
  randomtestAddress: "",
  randomtestClass: "",
  randomtestStartDate: "",
  randomtestEndDate: "",
  randomtestProvinceCode: "",
  randomtestCityCode: "",
  randomtestDistrictCode: ""
});
watch(() => ruleForm.value.randomtestGrade, (grade) => {
  console.log(grade);
  getProjectsByGrade({grade}).then(res => {
    options.value = res.data;
  });
}, {
  immediate: true
});
const gradeList = computed(() => {
  debugger
  if (ruleForm.value.randomtestSchoolType === SchoolType[0].label) {
    return Grade.slice(0, 6);
  } else {
    return Grade.slice(6, Grade.length);
  }
});
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

const btnText = computed(() => route.query.recordId ? "修改" : "保存");
const disabledDate = (time: Date) => {
  return time.getTime() < +new Date(ruleForm.value.randomtestStartDate);
};
const disabledStartDate = (time: Date) => {
  return time.getTime() < Date.now();
};
// const rules = reactive()

const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate((valid) => {
    if (valid) {
      isLoading.value = true;
      const parmeter = {...ruleForm.value};
      // parmeter.randomtestProjectList = JSON.stringify(parmeter.randomtestProjectList)
      randomTestRelease(parmeter, !!(route.query.recordId)).then((res: any) => {
        if (res.code === 200) {
          ElMessage({
            message: "成功",
            type: "success"
          });
          resetForm(formEl);
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
  ruleForm = ref({
    recordId: undefined,
    randomtestName: "",
    randomtestSchoolType: SchoolType[0].label,
    randomtestGrade: Grade[0].value,
    randomtestIntroduction: "",
    randomtestProjectList: undefined,
    randomtestAddress: "",
    randomtestClass: "",
    randomtestStartDate: "",
    randomtestEndDate: "",
    randomtestProvinceCode: "",
    randomtestCityCode: "",
    randomtestDistrictCode: ""
  });
};
const changeSelectCity = (area) => {
  ruleForm.value.randomtestProvinceCode = area.province;
  ruleForm.value.randomtestCityCode = area.city;
  ruleForm.value.randomtestDistrictCode = area.district;
  console.log("选择城市", ruleForm, area);
};
const checkAll = ref(false);
const isIndeterminate = ref(true);
// const checkedCities = ref(['Shanghai', 'Beijing'])
// const cities = ['Shanghai', 'Beijing', 'Guangzhou', 'Shenzhen']

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

