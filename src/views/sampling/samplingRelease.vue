<template>
  <div class=" px-2.5 pt-3 bg-gray-100 min-h-modal  ">
    <div class="bg-white wrapper">
      <div class="w-full flex justify-between border-b border-gray-300 pb-2 pt-3">
        <div>
          <h3 class="text-xl text-black  flex items-center">
            <span class="iconfont icon-jiajianzujianjiahao text-blue  text-2xl"></span>
            <span
              class="pl-2"
            >抽测发布</span>
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
            label="抽测名称"
            prop="randomtestName"
          >
            <el-input
              v-model="ruleForm.randomtestName"
              placeholder="请输入抽测名称"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="学校类别"
            prop="randomtestSchoolType"
          >
            <el-radio-group v-model="ruleForm.randomtestSchoolType">
              <el-radio
                v-for="{label} in SchoolType"
                :key="label"
                :label="label"
                :value="label"
              ></el-radio>
              <!--            <el-radio label="中学"></el-radio>-->
            </el-radio-group>
          </el-form-item>
          <el-form-item
            :required="true"
            label="区 域："
            prop="randomtestDistrictCode"
          >
            <SelectCity
              ref="city"
              :district-class="'w-full'"
              :show-item="['district']"
              @changeSelectCity="changeSelectCity"
            />
          </el-form-item>

          <el-form-item
            label="年&nbsp;&nbsp;&nbsp;&nbsp;   级"
            prop="randomtestGrade"
          >
            <el-select
              v-model="ruleForm.randomtestGrade"
              placeholder="请选择年级"
              class="w-full"
            >
              <template
                v-for="{value, label} in gradeList"
                :key="value"
              >
                <el-option
                  :label="label"
                  :value="value"
                ></el-option>
              </template>
            </el-select>
          </el-form-item>
          <el-form-item
            label="班&nbsp;&nbsp;&nbsp;&nbsp;    级"
            prop="randomtestClass"
          >
            <el-input
              v-model="ruleForm.randomtestClass"
              placeholder="请输入班级"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="开始日期"
            prop="randomtestStartDate"
          >
            <el-date-picker
              v-model="ruleForm.randomtestStartDate"
              class="w-full"
              type="datetime"
              placeholder="选择开始日期"
              :disabled-date="disabledStartDate"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item
            label="结束日期"
            prop="randomtestStartDate"
          >
            <el-date-picker
              v-model="ruleForm.randomtestEndDate"
              class="w-full"
              type="datetime"
              placeholder="选择结束日期"
              :disabled-date="disabledDate"
            >
            </el-date-picker>
          </el-form-item>

          <el-form-item
            label="抽测地点"
            prop="randomtestAddress"
          >
            <el-input
              v-model="ruleForm.randomtestAddress"
              placeholder="请输入抽测地点"
            ></el-input>
          </el-form-item>
          <!--        <el-form-item label="Activity time" required>-->
          <!--          <el-col :span="11">-->
          <!--            <el-form-item prop="date1">-->
          <!--              <el-date-picker-->
          <!--                v-model="ruleForm.date1"-->
          <!--                type="date"-->
          <!--                placeholder="Pick a date"-->
          <!--                style="width: 100%"-->
          <!--              ></el-date-picker>-->
          <!--            </el-form-item>-->
          <!--          </el-col>-->
          <!--          <el-col class="text-center" :span="2">-->
          <!--            <span class="text-gray-500">-</span>-->
          <!--          </el-col>-->
          <!--          <el-col :span="11">-->
          <!--            <el-form-item prop="date2">-->
          <!--              <el-time-picker-->
          <!--                v-model="ruleForm.date2"-->
          <!--                placeholder="Pick a time"-->
          <!--                style="width: 100%"-->
          <!--              ></el-time-picker>-->
          <!--            </el-form-item>-->
          <!--          </el-col>-->
          <!--        </el-form-item>-->
          <!--        <el-form-item label="Instant delivery" prop="delivery">-->
          <!--          <el-switch v-model="ruleForm.delivery"></el-switch>-->
          <!--        </el-form-item>-->
          <el-form-item
            label="抽测项目"
            prop="randomtestProjectList"
          >
            <el-checkbox
              v-model="checkAll"
              :indeterminate="isIndeterminate"
              @change="handleCheckAllChange"
            >
              全选
            </el-checkbox>
            <el-checkbox-group
              v-model="ruleForm.randomtestProjectList"
              @change="handleCheckedCitiesChange"
            >
              <el-checkbox
                v-for="name in options"
                :key="name"
                :label="name"
                :name="name"
              ></el-checkbox>
            </el-checkbox-group>
          </el-form-item>

          <el-form-item
            label="抽测介绍"
            prop="randomtestIntroduction"
          >
            <el-input
              v-model="ruleForm.randomtestIntroduction"
              type="textarea"
              placeholder="请输入抽测介绍"
              :autosize="{ minRows: 4, maxRows: 8 }"
            ></el-input>
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
                确认{{ btnText }}
              </el-button>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import type { ElForm } from "element-plus";
import { ElMessage } from "element-plus";
import { getProjectsByGrade, randomTestRelease } from "@/api/randomTest";
import { Grade, SchoolType } from "@/utils/baseData";
import rules from "@/utils/rules";
import SelectCity from "@/components/SelectCity.vue";
import { useStore } from "vuex";

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
  randomtestId: undefined,
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
  getProjectsByGrade({ grade }).then(res => {
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
  if (route.query.randomtestId) {
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

const btnText = computed(() => route.query.randomtestId ? "修改" : "发布");
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
      const parmeter = { ...ruleForm.value };
      // parmeter.randomtestProjectList = JSON.stringify(parmeter.randomtestProjectList)
      randomTestRelease(parmeter, !!(route.query.randomtestId)).then((res: any) => {
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
        const { message } = error;
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
    randomtestId: undefined,
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

