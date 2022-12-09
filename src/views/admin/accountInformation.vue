<template>
  <div class=" container h-full  mx-auto px-6   :lg max-w-full  ">
    <div class="w-full flex justify-between border-b border-gray-300 pb-2 pt-3">
      <div>
        <h3 class="text-xl text-black  flex items-center">
          <span class="iconfont icon-zhanghuffffffpx text-blue  text-2xl"></span>
          <span
            class="pl-2"
          >账户信息</span>
        </h3>
      </div>
      <div>
        <el-button
          class="text-gray-700 text-lg"
          type="text"
          @click="$router.replace({name: 'accountManagement',query: {
            now: +new Date(),
          }})"
        >
          <span class="iconfont icon-fanhui text-2xl"></span>
          <span class="underline align-text-bottom ">返回</span>
        </el-button>
      </div>
    </div>
    <div class="mx-auto w-1/3 mt-24">
      <el-form
        ref="ruleFormRef"
        :model="creatForm"
        :rules="rules"
        :size="formSize"
        class="demo-ruleForm "
        label-width="auto"
      >
        <el-form-item
          label="角色："
          prop="username"
        >
          <el-select
            v-model="creatForm.roleId"
            class="w-full"
          >
            <el-option
              v-for="{id,name} in roleList"
              :key="id"
              :label="name"
              :value="id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="![5].includes(creatForm.roleId)"
          label="地区："
          prop="district"
        >
          <SchoolSelect
            ref="schoolSelect"
            v-model:city-code.number="creatForm.city"
            v-model:district-code.number="creatForm.district"
            v-model:province-code.number="creatForm.province"
            :show-info="false"
            :showitems="[ ]"
          ></SchoolSelect>
        </el-form-item>
        <el-form-item
          v-if="[3,4].includes(creatForm.roleId)"
          label="学校类型："
          prop="schoolType"
        >
          <el-select
            v-model="creatForm.schoolType"
            class="w-full"
            placeholder="请选择学校类型"
          >
            <template
              v-for="{label} in SchoolType"
              :key="label"
            >
              <el-option
                :label="label"
                :value="label"
              ></el-option>
            </template>
            <el-option
              label="九年一贯"
              value="九年一贯"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="[3,4].includes(creatForm.roleId)"
          label="学校名称："
          prop="schoolName"
        >
          <el-select
            v-model="creatForm.schoolName"
            :disabled="!creatForm.schoolType || !creatForm.district"
            :loading="loading"
            class="w-full"
            filterable
            placeholder="请选择学校名称："
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
        </el-form-item>
        <el-form-item
          label="账号名称："
          prop="username"
        >
          <el-input
            v-model="creatForm.username"
            autocomplete="off"
            placeholder="请输入账号名称"
          />
        </el-form-item>
        <el-form-item
          label="用户昵称："
          prop="username"
        >
          <el-input
            v-model="creatForm.nickName"
            autocomplete="off"
            placeholder="请输入用户昵称"
          />
        </el-form-item>
        <el-form-item
          v-if="!isEdit"
          label="密码："
          prop="password"
        >
          <el-input
            v-model="creatForm.password"
            class="w-full date-picker"
            placeholder="请输入密码"
          />
        </el-form-item>
        <el-form-item
          v-if="[5].includes(creatForm.roleId)"
          label="单 位："
          prop=""
          required
        >
          <el-input
            v-model="creatForm.schoolName"
            autocomplete="off"
            placeholder="请输入单位"
          />
        </el-form-item>
        <el-form-item
          v-if="isTeacher"
          label="教职工号："
          prop="teacherCode"
        >
          <el-input
            v-model="creatForm.teacherCode"
            class="w-full date-picker"
            placeholder="请输入教职工号"
          />
        </el-form-item>
        <el-form-item
          v-if="isTeacher"
          label="教职姓名："
          prop="teacherName"
        >
          <el-input
            v-model="creatForm.teacherName"
            class="w-full "
            placeholder="请输入教职姓名"
          />
        </el-form-item>
        <el-form-item
          v-if="![5].includes(creatForm.roleId)"
          label="手机号："
          prop="phone"
        >
          <el-input
            v-model="creatForm.phone"
            class="w-full date-picker"
            placeholder="请输入手机号"
            type="number"
          />
        </el-form-item>
        <el-form-item
          v-if="![5].includes(creatForm.roleId)"
          label="身份证号："
          prop="identity"
        >
          <el-input
            v-model="creatForm.identity"
            class="w-full"
            placeholder="请输入身份证号："
            type="number"
          />
        </el-form-item>
        <el-form-item
          v-if="![5].includes(creatForm.roleId)"

          label="性別："
        >
          {{ IdCard(creatForm.identity, 2) }}
          <span class="el-form-item__label pl-6">生日： </span><span>{{ IdCard(creatForm.identity, 1) }}</span>
        </el-form-item>
        <el-form-item
          v-if="![5].includes(creatForm.roleId)"

          class="mr-5"
          label="民族："
          prop="nationality"
        >
          <el-select
            v-model="creatForm.nationality"
            placeholder="请选择民族"
          >
            <el-option
              v-for="item in national"
              :key="item.id"
              :label="item.name"
              :value="item.name"
            />
          </el-select>
        </el-form-item>


        <el-form-item
          v-if="![5].includes(creatForm.roleId)"

          label="简 介："
          prop="note"
        >
          <el-input
            v-model="ruleForm.note"
            :autosize="{ minRows: 4, maxRows: 8 }"
            placeholder="请输入简介"
            type="textarea"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <div class=" w-full flex justify-around pt-20">
            <!--            <el-button-->
            <!--              class="w-36"-->
            <!--              @click="resetForm(ruleFormRef)"-->
            <!--            >-->
            <!--              重置-->
            <!--            </el-button>-->

            <el-button
              v-loading="isLoading"
              :disabled="isLoading"
              :element-loading-text="'加载中...'"
              class="w-36"
              type="primary"
              @click="submitForm(ruleFormRef)"
            >
              确认{{ btnText }}
            </el-button>
            <el-button
              class="w-36 ml-12"
              type="text"
              @click="dialogFormVisible =true"
            >
              <span class="iconfont icon-xiugai1 text-blue  text-2xl"></span>
              <span class="underline">              修改登录密码
              </span>
            </el-button>
          </div>
        </el-form-item>
      </el-form>
    </div>
  </div>
  <Password :username="editData?.username"></Password>
</template>
<script lang="ts" setup>
import {computed, nextTick, provide, reactive, ref} from "vue";
import {onBeforeRouteLeave, useRoute} from "vue-router";
import type {ElForm} from "element-plus";
import {ElMessage} from "element-plus";
import {SchoolType} from "@/utils/baseData";
import rules from "@/utils/rules";
import {useStore} from "vuex";
import {listAll, register, updateAdmin} from "@/api/accountManagement";
import national from "@/utils/national.js";
import {getAllSchoolNames} from "@/api";
import {IdCard, sortArr} from "@/utils/index";
import {getCityName, getDistrictCode, getDistrictName, getProvinceName} from "@/utils/getCity";
import Password from "@/components/Password.vue";

onBeforeRouteLeave(() => {
  store.commit("Admin/setEditData", {});
});
const dialogFormVisible = ref(false);
provide("dialogFormVisible", dialogFormVisible);
type FormInstance = InstanceType<typeof ElForm>
const schoolSelect = ref();
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
const isTeacher = computed(() => creatForm.roleId === 4);
console.error(11111, getDistrictCode("天桥区"));

let creatForm: any = reactive(
  {
    "birthday": "",
    "city": "370100",
    "district": "370104",
    "identity": "",
    "nationality": "汉族",
    "nickName": "",
    "password": "",
    "phone": undefined,
    "province": "370000",
    "roleId": 5,
    "schoolId": undefined,
    "schoolName": undefined,
    "schoolType": "",
    "teacherCode": undefined,
    "teacherName": undefined,
    "username": "",
    id: undefined
  }
);
const isEdit = ref(false);
const editData = store.state.Admin.editData;
if (editData?.id) {
  isEdit.value = true;
  Object.keys(creatForm).forEach((key: string) => {
    creatForm[key] = editData?.[key] ?? undefined;
  });
  nextTick(() => {
    schoolSelect.value.filterCity.district = getDistrictCode(editData.district);

  });
}
const roleList = ref([]);
listAll().then(({ data }: any) => {
  console.log('111', data)
  roleList.value = data.filter((item: any) => ([1, 5].includes(item.id)));
});
const schoolOptions = ref([]);

async function visibleChange(val: boolean) {
  console.log("下拉框 开启关闭", val);
  if (val) {
    loading.value = true;
    const parmeter = {
      schoolCity: creatForm.city,
      schoolDistrict: creatForm.district,
      schoolProvince: creatForm.province,
      schoolType: creatForm.schoolType
    };
    await getAllSchoolNames(parmeter).then((res: any) => {
      console.log("获取学校列表", res);
      schoolOptions.value = sortArr(res.data, "school_id");
      loading.value = false;
    });
  }
}

const loading = ref(true);
const loadingStudent = ref(true);
const classList: any = ref([]);


let ruleForm = ref({
  freetestApplicationDate: undefined,
  freetestClassId: "",
  freetestReason: undefined,
  freetestSchoolId: store.state.FreeTest?.freetestSchoolId,
  freetestStudentCode: "",
  freetestStudentGrade: "",
  freetestStudentId: "",
  freetestValidityDate: "",
  file: ""
});


const formData = new FormData();


const btnText = computed(() => isEdit.value ? "修改" : "新建");

const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;

  formEl.validate((valid) => {
    if (valid) {

      // isLoading.value = true;
      let params: any = { ...creatForm };
      if (isEdit.value) {
        return updateAdmin(params)
          .then((data: any) => {
            if (data.code === 200) {
              ElMessage({
                message: "成功",
                type: "success"
              });
              resetForm(formEl);
            }
            isLoading.value = false;
          })
          .catch((error: any) => {
            isLoading.value = false;
            console.log(error);
            const { message } = error;
            ElMessage({
              message,
              type: "error"
            });
            // ElMessage.error(message)
          });

      }
      if ([3, 4].includes(params.ruleId)) {
        const item: any = params.schoolId = schoolOptions.value.filter((item: any) => {
          return item.school_name === params.schoolName;
        })[0];
        params.schoolId = item.school_id;
      }
      const { province, city, district } = params;
      params.province = getProvinceName(province);
      params.city = getCityName(province, city);
      params.district = getDistrictName(province, city, district);
      register(params)
        .then((data: any) => {
          if (data.code === 200) {
            ElMessage({
              message: "成功",
              type: "success"
            });
            resetForm(formEl);
          }
          isLoading.value = false;
        })
        .catch((error: any) => {
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
  // imageUrl.value = "";
  // ruleForm.value.file = "";
  formEl.resetFields();
  // fileInput.value.value = null;
};

</script>

