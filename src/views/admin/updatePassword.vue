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
        :rules="rules"
        :model="creatForm"
        label-width="auto"
        class="demo-ruleForm "
        :size="formSize"
      >
        <el-form-item
          label="账号名称："
          prop="username"
        >
          <span class="text-blue">
            {{ creatForm.username }}
          </span>
        </el-form-item>
        <el-form-item
          label="角色："
          prop="username"
        >
          <span class="text-blue">
            {{ creatForm.roleName }}
          </span>
        </el-form-item>
        <el-form-item
          label="地区："
          prop="district"
        >
          <span class="text-blue">
            {{ creatForm.provinceName }}
            {{ creatForm.cityName }}
            {{ creatForm.district.name }}
            <!--            {{ getDistrictName(creatForm.province, creatForm.city, creatForm.district) }}-->
          </span>
        </el-form-item>
        <el-form-item
          v-if="[3,4].includes(creatForm.roleId)"
          label="学校类型："
          prop="schoolType"
        >
          <!--          <el-select-->
          <!--            v-model="creatForm.schoolType"-->
          <!--            class="w-full"-->
          <!--            placeholder="请选择学校类型"-->
          <!--          >-->
          <span class="text-blue">
            {{ creatForm.schoolType }}
          </span>
          <!--          </el-select>-->
        </el-form-item>
        <el-form-item
          label="学校名称："
          prop="schoolName"
        >
          <span class="text-blue">
            {{ creatForm.schoolName }}
          </span>
        </el-form-item>

        <el-form-item
          label="用户昵称："
          prop="username"
        >
          <el-input
            v-if="isEdit"
            v-model="creatForm.username"
          ></el-input>
          <span
            v-else
            class="text-blue"
          >
            {{ creatForm.nickName }}
          </span>
        </el-form-item>

        <el-form-item
          v-if="isTeacher"
          label="教职工号："
          prop="teacherCode"
        >
          <span class="text-blue">
            {{ creatForm.teacherCode }}
          </span>
        </el-form-item>
        <el-form-item
          v-if="isTeacher"
          label="教职姓名："
          prop="teacherName"
        >
          <el-input
            v-if="isEdit"
            v-model="creatForm.teacherName"
          ></el-input>
          <span
            v-else
            class="text-blue"
          >
            {{ creatForm.teacherName }}
          </span>
        </el-form-item>
        <el-form-item
          label="手机号："
          prop="phone"
        >
          <el-input
            v-if="isEdit"
            v-model="creatForm.phone"
          ></el-input>
          <span
            v-else
            class="text-blue"
          >
            {{ creatForm.phone }}
          </span>
        </el-form-item>
        <el-form-item
          label="身份证号："
          prop="identity"
        >
          <el-input
            v-if="isEdit"
            v-model="creatForm.identity"
          ></el-input>
          <span
            v-else
            class="text-blue"
          >
            {{ creatForm.identity }}
          </span>
        </el-form-item>
        <el-form-item
          label="性別："
        >
          {{ IdCard(creatForm.identity, 2) }}
          <span class="el-form-item__label pl-6">生日： </span><span>{{ IdCard(creatForm.identity, 1) }}</span>
        </el-form-item>
        <el-form-item
          class="mr-5"
          label="民族："
          prop="nationality"
        >
          <el-select
            v-if="isEdit"
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
          <span
            v-else
            class="text-blue"
          >
            {{ creatForm.nationality }}
          </span>
        </el-form-item>


        <el-form-item
          label="简 介："
          prop="note"
        >
          <el-input
            v-if="isEdit"
            v-model="ruleForm.note"
            type="textarea"
            placeholder="请输入简介"
            :autosize="{ minRows: 4, maxRows: 8 }"
          ></el-input>
          <span
            v-else
            class="text-blue"
          >
            {{ creatForm.note }}
          </span>
        </el-form-item>
        <el-form-item>
          <div class=" w-full flex justify-around pt-20">
            <el-button
              class="w-36"
              @click="isEdit = !isEdit "
            >
              {{ btnText }}
            </el-button>

            <el-button
              v-if="isEdit"

              v-loading="isLoading"
              :element-loading-text="'加载中...'"
              :disabled="isLoading"
              type="primary"
              class="w-36"
              @click="submitForm(ruleFormRef)"
            >
              确认修改
            </el-button>
            <el-button
              class="w-36 "
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
  <Password :username="creatForm.username"></Password>
</template>
<script lang="ts" setup>
import { computed, provide, ref } from "vue";
import { onBeforeRouteLeave, useRoute } from "vue-router";
import type { ElForm } from "element-plus";
import { ElMessage } from "element-plus";
import { useStore } from "vuex";
import { account, listAll, register, updateAccount } from "@/api/accountManagement";
import { getAllSchoolNames } from "@/api";
import { IdCard, sortArr } from "@/utils/index";
import { getCityName, getDistrictName, getProvinceName } from "@/utils/getCity";
import Password from "@/components/Password.vue";
import national from "@/utils/national.js";
import rules from "@/utils/rules";

onBeforeRouteLeave(() => {
  store.commit("Admin/setEditData", {});
});
const dialogFormVisible = ref(false);
provide("dialogFormVisible", dialogFormVisible);
const id = computed(() => store.state.User.userRoles?.id ?? "");

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


const isTeacher = computed(() => creatForm.value.roleId === 4);

let creatForm: any = ref(
  {
    "birthday": "",
    "city": "",
    "district": "",
    "email": "",
    "gender": "",
    "id": 0,
    "identity": "",
    "nationality": "",
    "nickName": "",
    "note": "",
    "phone": "",
    "province": "",
    "roleId": 0,
    "roleName": "",
    "schoolId": 0,
    "schoolName": "",
    "schoolType": "",
    "teacherCode": "",
    "teacherName": "",
    "username": ""
  }
);
(async () => {
  account(store.state.User.userRoles?.id).then((res: any) => {
    creatForm.value = res.data;
    creatForm.value.provinceName = getProvinceName(creatForm.value.province);
    creatForm.value.cityName = getCityName(creatForm.value.province, creatForm.value.city);
    creatForm.value.districtName = getDistrictName(creatForm.value.province, creatForm.value.city, creatForm.value.district);
  });
})();

// const isEdit = ref(false);
// const editData = store.state.Admin.editData;
// if (editData?.id) {
//   isEdit.value = true;
//   Object.keys(creatForm).forEach((key: string) => {
//     creatForm[key] = editData?.[key] ?? undefined;
//   });
//   nextTick(() => {
//     schoolSelect.value.filterCity.district = getDistrictCode(editData.district);
//
//   });
// }
const roleList = ref([]);
listAll().then(({ data }: any) => {
  roleList.value = data;
});
const schoolOptions = ref([]);

async function visibleChange(val: boolean) {
  console.log("下拉框 开启关闭", val);
  if (val) {
    loading.value = true;
    const parmeter = {
      schoolCity: creatForm.value.city,
      schoolDistrict: creatForm.value.district,
      schoolProvince: creatForm.value.province,
      schoolType: creatForm.value.schoolType
    };
    await getAllSchoolNames(parmeter).then((res: any) => {
      console.log("获取学校列表", res);
      schoolOptions.value = sortArr(res.data, "school_id");
      loading.value = false;
    });
  }
}

const loading = ref(true);
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

const isEdit = ref(false);
const btnText = computed(() => isEdit.value ? "取消" : "修改");

const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;

  formEl.validate((valid) => {
    if (valid) {

      // isLoading.value = true;
      let params: any = { ...creatForm };
      if (isEdit.value) {
        return updateAccount(params)
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

