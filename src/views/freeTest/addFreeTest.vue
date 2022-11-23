<template>
  <div class=" container h-full  mx-auto px-6   :lg max-w-full  ">
    <div class="w-full flex justify-between border-b border-gray-300 pb-2 pt-3">
      <div>
        <h3 class="text-xl text-black  flex items-center">
          <span class="iconfont icon-jiajianzujianjiahao text-blue  text-2xl"></span>
          <span
            class="pl-2"
          >添加免测申请</span>
        </h3>
      </div>
      <div>
        <el-button
          type="text"
          class="text-gray-700 text-lg"
          @click="$router.replace({name: 'freeTest',query: {
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
        :model="ruleForm"
        :rules="rules"
        label-width="auto"
        class="demo-ruleForm space-y-10"
        :size="formSize"
      >
        <el-form-item
          label="年&nbsp;&nbsp;&nbsp;&nbsp;   级"
          prop="freetestStudentGrade"
        >
          <el-select
            v-model="ruleForm.freetestStudentGrade"
            placeholder="请选择年级"
            class="w-full"
            @change="ruleForm.freetestClassId = undefined"
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
          label="班&nbsp;&nbsp;&nbsp;&nbsp;   级"
          prop="freetestClassId"
        >
          <el-select
            v-model="ruleForm.freetestClassId"
            placeholder="请选择班级"
            class="w-full"
            :disabled="!ruleForm.freetestStudentGrade"
            :loading="loading"
            @change="classNameHandleChange"
            @visible-change="getClassList"
          >
            <template
              v-for="{class_id, class_name} in classList"
              :key="class_id"
            >
              <el-option
                :label="class_name"
                :value="class_id"
              ></el-option>
            </template>
          </el-select>
        </el-form-item>
        <el-form-item
          label="学&nbsp;&nbsp;&nbsp;&nbsp;生"
          prop="freetestStudentId"
        >
          <el-select
            v-model="ruleForm.freetestStudentId"
            placeholder="请选择学生"
            class="w-full"
            :disabled="!ruleForm.freetestClassId"
            :loading="loadingStudent"
            @visible-change="getStudent"
            @change="changeStudent"
          >
            <template
              v-for="{student_name, student_id} in studentList"
              :key="student_id"
            >
              <el-option
                :label="student_name"
                :value="student_id"
              >
              </el-option>
            </template>
          </el-select>
        </el-form-item>
        <el-form-item
          label="学籍号"
          prop="freetestStudentCode"
        >
          <el-input
            v-model="ruleForm.freetestStudentCode"
            :disabled="true"
            placeholder="请输入学籍号"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="有效期至"
          prop="freetestValidityDate"
        >
          <el-date-picker
            v-model="ruleForm.freetestValidityDate "
            class="w-full"
            type="datetime"
            placeholder="请选择有效期至"
            :disabled-date="disabledStartDate"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item
          label="申请表"
          prop="file"
        >
          <input
            v-show="false"
            v-model="ruleForm.file"

            type="text"
          />
          <input
            v-show="false"
            id="fileInput"
            ref="fileInput"
            type="file"
            @change="fileChange"
          />
          <el-button
            type="text"
            @click="importData"
          >
            点击上传申请表
          </el-button>
          <div>
            <img
              class="w-full"
              :src="imageUrl"
              alt=""
            >
          </div>
        </el-form-item>


        <el-form-item
          label="事 由"
          prop="freetestReason"
        >
          <el-input
            v-model="ruleForm.freetestReason"
            type="textarea"
            placeholder="请输入事由"
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
              :element-loading-text="'加载中...'"
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
</template>
<script lang="ts" setup>
import { computed, ref } from "vue";
import { useRoute } from "vue-router";
import type { ElForm } from "element-plus";
import { ElMessage } from "element-plus";
import { getAllClassNames } from "@/api/index";
import { filterGradeList } from "@/utils/baseData";
import rules from "@/utils/rules";
import { useStore } from "vuex";
import { add, getStudentNameAndIds } from "@/api/freeTest";

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
const loading = ref(true);
const loadingStudent = ref(true);
const classList: any = ref([]);
const studentList: any = ref([]);
const classNameHandleChange = (options: any) => {
  ruleForm.value.freetestStudentId = undefined;
  console.log(options);
};
const handleStart = (options: any) => {
  console.log(options);
};
const getClassList = () => {
  getAllClassNames({
    schoolId: ruleForm.value.freetestSchoolId,
    classGrade: ruleForm.value.freetestStudentGrade
  }).then(({ data }: any) => {
    classList.value = data;
    loading.value = false;
  });
};
const changeStudent = (val) => {
  ruleForm.value.freetestStudentCode = studentList.value.find((item: any) => item.student_id === val).student_code;
  // ruleForm.value.freetestStudentId = student_id
  console.log(val, "student", ruleForm.value.freetestStudentCode);
};
const getStudent = () => {

  getStudentNameAndIds({ classId: ruleForm.value.freetestClassId }).then(({ data }: any) => {
    loadingStudent.value = false;
    studentList.value = data;
  });
};
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

const gradeList = computed(() => {
  debugger
  return filterGradeList(store.state.FreeTest.schoolType);
  // if (store.state.FreeTest.schoolType === SchoolType[0].label) {
  //   return Grade.slice(0, 6);
  // } else {
  //   return Grade.slice(6, Grade.length);
  // }
});

function getObjectURL(file: any) {
  var url = null;
  if (window.createObjectURL != undefined) { // basic
    url = window.createObjectURL(file);
  } else if (window.URL != undefined) { // mozilla(firefox)
    url = window.URL.createObjectURL(file);
  } else if (window.webkitURL != undefined) { // webkit or chrome
    url = window.webkitURL.createObjectURL(file);
  }
  return url;
}

const fileInput: any = ref<null | HTMLInputElement>(null);
let imageUrl = ref<null | string>("");
const importData = () => {
  fileInput.value.click();
};
const formData = new FormData();
const fileChange = (e: Event) => {
  // 上传文件
  console.log(e.target.files);
  const target = e.target as HTMLInputElement;
  const files: any = target.files;
  imageUrl.value = null;
  if (files) {
    const uploadedFile = files[0];
    if (files.length < 1) {
      return ElMessage.error("最多只能上传1张图片");
    }
    const imgSize = files.size;  //b
    if (imgSize > 1024 * 1024 * 1) {//1M
      return ElMessage.error("上传图片不能超过1M");
    }
    // if (uploadedFile.type != "image/png" && uploadedFile.type !== "image/jpeg" && uploadedFile.type != "image/gif") {
    //   return ElMessage.error("图片上传格式不正确");
    // }
    if (!["image/png", "image/jpeg", "image/gif"].includes(uploadedFile.type)) {
      return ElMessage.error("图片上传格式不正确");

    }
    (ruleFormRef as FormInstance).value.clearValidate("file");
    imageUrl.value = getObjectURL(uploadedFile);
    ruleForm.value.file = "xxx";
    // ruleFormRef.value.validateField('file')
    formData.append("file", uploadedFile);
    // randomTestImport(formData).then((res) => {
    //   const { message, code } = res;
    //   if (code == 200) {
    //     getData();
    //     ElMessage.success(message);
    //   } else {
    //     ElMessage.error(message);
    //   }
    // });
    // readyFile.status = 'loading' // 上传之前将状态设置为loading
    // axios.post(props.actions, formData, {
    //   headers: {
    //     "Content-Type": 'multipart/form-data'
    //   }
    // }).then(resp=> {
    //   console.log('resp', resp)
    //   readyFile.status = 'success' // 上传成功将状态设置为success
    // }).catch(error=> {
    //   readyFile.status = 'error' // // 上传失败将状态设置为error
    // })
  }
};
// onMounted(() => {
//   if (route.query.randomtestId) {
//     debugger
//     ruleForm.value = store.state.RandomTest.randomtest;
//
//     try {
//       console.log(`city', ${city.value.area}`, store.state.RandomTest.randomtest, store.state.RandomTest.randomtest.randomtestDistrictCode);
//       city.value.area.district = store.state.RandomTest.randomtest.randomtestDistrictCode + "";
//     } catch (e) {
//       console.error(e);
//     }
//
//   }
// });

const btnText = computed(() => route.query.randomtestId ? "修改" : "发布");
// const disabledDate = (time: Date) => {
//   return time.getTime() < +new Date(ruleForm.value.randomtestStartDate);
// };
const disabledStartDate = (time: Date) => {
  return time.getTime() < Date.now();
};
// const rules = reactive()

const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate((valid) => {
    if (valid) {
      isLoading.value = true;
      const params: any = { ...ruleForm.value };
      delete params.file;
      const data = formData;
      // parmeter.randomtestProjectList = JSON.stringify(parmeter.randomtestProjectList)
      add({ params, data }).then((data: any) => {
        if (data) {
          ElMessage({
            message: "成功",
            type: "success"
          });
          resetForm(formEl);
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
  imageUrl.value = "";
  ruleForm.value.file = "";
  formEl.resetFields();
  fileInput.value.value = null;
};

</script>

