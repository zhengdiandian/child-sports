<script lang="ts" setup>
import districts from "@/utils/city.js";
import EditorInput from "@/components/EditorInput.vue";
import { computed, nextTick, reactive, ref, watch } from "vue";
import { ElForm, ElMessage } from "element-plus";
import rules from "@/utils/rules";
import { onBeforeRouteLeave, useRouter } from "vue-router";
import { listClass, listProject, updateHomeworkTiming } from "@/api/homeworkManagementController";
import { useStore } from "vuex";
import { gradeConversion } from "@/utils/baseData";
import { findInFullWeekListIndex, weekList } from "@/utils/dayFormat";
import userHooks from "@/hooks/useHook";
import checkPermissions from "@/hooks/checkPermissions";

const store = useStore();
const userHook = userHooks();
type FormInstance = InstanceType<typeof ElForm>
onBeforeRouteLeave(() => {
  store.commit(
    "HomeWork/setEditData",
    {}
  );
  return true;
});
// onActivated(() => {
nextTick(async () => {
  const editData = store.state.HomeWork?.editData;
  // (
  // async () => {
  const { data } = await (listClass({ teacherId }));
  classList.value = data.filter((item: any) => {
    item.classGradeName = gradeConversion(item.classGrade);
    return item.classGrade <= 9;
  });

  classGradeList.value = Array.from(new Set(classList.value.map((item: any) => (item.classGradeName))));

  // };
  // )();
  if (editData?.homeworkTimingId) {
    Object.keys(ruleForm).forEach((key: string) => {
      ruleForm[key] = editData[key];
    });
    const homeworkGrade = gradeConversion(editData?.homeworkGrade);
    ruleForm.homeworkGrade = homeworkGrade;
    changeGrade(ruleForm.homeworkGrade);
    Object.keys(editData.homeworkClasses).forEach((classId: string) => {
      const item = {
        ...tableItem.value,
        classGradeName: homeworkGrade,
        className: editData.homeworkClasses[classId],
        classId
      };
      addTableData.value.push(
        item
      );
    });
    const { data } = await listProject({
      grade: editData.homeworkGrade,
      classIds: classListFilter.value.map((item: any) => item.class)
    });
    workList.value = data;
    if (editData?.regularRelease.includes("每周")) {
      ruleForm.regularRelease = "每周";
      week.value = findInFullWeekListIndex(editData?.regularRelease);
    }
    if (editData?.regularRelease.includes("每月")) {
      ruleForm.regularRelease = "每月";
      dayNum.value = editData?.regularRelease;
    }

  }
});

// });

const openEdit = ref(false);
const router = useRouter();
const formRef = ref<FormInstance>();
const dialogFormVisible = ref(false);
const schoolType = ref("");
const isCreate = ref(true);
const ruleFormRef = ref<FormInstance>();
const isLoading = ref<boolean>(false);
const formSize = ref("large");
const workList: any = ref([]);
const btnText = computed(() => {
  if (ruleForm.homeworkTimingId) return "修改";
  return "保存";
});
let classList: any = ref([]);
let classGradeList: any = ref([]);
const classListFilter: any = ref([]);
let grade = ref(undefined);
const classId = ref(undefined);
const teacherId = useStore().state.User?.userRoles?.teacherId;
(async () => {
  const { data } = await (listClass({ teacherId }));
  classList.value = data.filter((item: any) => {
    item.classGradeName = gradeConversion(item.classGrade);
    return item.classGrade <= 9;
  });

  classGradeList.value = Array.from(new Set(classList.value.map((item: any) => (item.classGradeName))));

})();
const changeGrade = (grade: string) => {
  return classListFilter.value = classList.value?.filter((item: any) => item.classGradeName === grade);
};

const dayNum = ref("");
const week: any = ref("");
let addTableData: any = ref([]);

const deleteTableItem = (index: number) => {

  addTableData.value.splice(index, 1);
};

watch(() => dayNum.value, () => {
  ruleForm.validDate = dayNum.value;

});
const changeDay = (value: number) => {
  if (value !== 0) {
    ruleForm.validDate = dayNum.value;
  }

};
// const areaInformation = new AreaInformation();
const tableItem: any = ref({

  announcementCityCode: userHook.DailyPhysical?.schoolCity,
  announcementDistrictCode: userHook.DailyPhysical?.schoolDistrict,
  announcementProvinceCode: userHook.DailyPhysical?.schoolProvince,
  // schoolIds: new DailyPhysical().schoolId,
  classIds: undefined
});

let ruleForm: any = reactive({
  homeworkTimingId: undefined,
  classIds: [],
  homeworkDeadline: undefined,
  homeworkGrade: undefined,
  homeworkIntroduction: "",
  homeworkName: "",
  "homeworkProject": [],
  "homeworkReleaseBegin": undefined,
  "homeworkReleaseEnd": undefined,
  "importMethod": "照片视频",
  "regularRelease": "string",
  "releaseTime": undefined,
  "schoolId": parseInt(userHook.schoolId)
});
const disabledDate = (time: Date) => {
  return time.getTime() < Date.now() - 1000 * 60 * 60 * 24;
};

const disabledDateHomeworkReleaseEnd = (time: Date) => {
  return time.getTime() < +new Date(ruleForm.homeworkReleaseBegin);
};
const importMethodList = ["照片视频"];
const options = ref([]);


function checkFormData() {
  if (!formRef.value) return false;
  let isPass = true;
  formRef.value.validate((val: any) => {
    console.log("验证的值", val);
    isPass = val;
  });
  return isPass;
}

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
  addTableData.value = [];
};


const tableData = reactive({
  pageNum: 0,
  pageSize: 0,
  total: 0,
  totalPage: 1,
  list: []
});

const submitForm = (formEl: FormInstance | undefined, urlIndex = 0) => {
  if (!formEl) return;
  formEl.validate((valid: any) => {
    if (valid) {
      isLoading.value = true;
      const parameter = { ...ruleForm };
      if (parameter.regularRelease === "每周") {
        if (!week.value) {
          return ElMessage.error("请选择每周几！");
        }
        parameter.regularRelease = week.value;
      }
      if (parameter.regularRelease === "每月") {
        if (!dayNum.value) {
          return ElMessage.error("请选择每月几号！");
        }
        parameter.regularRelease = dayNum.value;
      }
      parameter.classIds = Array.from(new Set(addTableData.value.map((el: any) => el.classId)));
      parameter.homeworkGrade = gradeConversion(parameter.homeworkGrade);

      updateHomeworkTiming(parameter, btnText.value).then((res: any) => {
        if (res.code === 200) {
          openEdit.value = false;
          ElMessage({
            message: btnText.value + "成功",
            type: "success"
          });
          const name = parameter.regularRelease === "单次" ? "jobPosting" : "jobPosting";
          resetForm(formEl);
          router.push({ name, query: { now: +new Date() } });
        }
        isLoading.value = false;
      }).catch((error: any) => {
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
const add = async () => {
  console.log(classListFilter.value.find((item: any) => item.classId === classId.value), 22222222);
  const item = { ...tableItem.value, ...classListFilter.value.find((item: any) => item.classId === classId.value) };
  addTableData.value.push(
    item
  );
  // if (addTableData.value.length > 1) {
  const { data } = await listProject({
    grade: item.classGrade,
    classIds: addTableData.value.map((item: any) => item.classId)
  });
  workList.value = data;
  // }
};

</script>

<template>
  <div

    class=" container  h-full  mx-auto px-6   :lg max-w-full  "
  >
    <div class="w-full flex justify-between border-b border-gray-300 pb-2 pt-3">
      <div>
        <h3 class="text-xl text-black  flex items-center">
          <span class="iconfont icon-jiajianzujianjiahao text-blue  text-2xl"></span>
          <span
            class="pl-2"
          >{{ btnText }}作业</span>
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
    <div class="mx-auto w-2/3 mt-24">
      <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        :rules="rules"
        label-width="auto"
        class="demo-ruleForm "
        :size="formSize"
        :inline="true"
      >
        <el-form-item
          label="作业名称："
          prop="homeworkName"
          class="w-full"
        >
          <el-input
            v-model="ruleForm.homeworkName"
            placeholder="请输入作业名称"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="作业期限："
          prop="homeworkDeadline"
        >
          <el-input
            v-model.number="ruleForm.homeworkDeadline"
            :min="1"
            type="number"
            class="w-auto"
            placeholder="请输入作业期限"
          ></el-input>
          <div class="ml-4">
            天
          </div>
        </el-form-item>
        <el-form-item
          label="上传方式："
          prop="importMethod"
          class="w-full "
        >
          <el-radio-group v-model="ruleForm.importMethod">
            <el-radio
              v-for="importMethod in importMethodList"
              :key="importMethod"
              :label="importMethod"
            >
            </el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item
          :required="true"
          label="班级选择："
        >
          <el-select
            v-model.number="ruleForm.homeworkGrade"
            class="mr-4"
            placeholder="请选择年级"
            :disabled="addTableData.length"
            @change="changeGrade"
          >
            <template
              v-for="classGrade in classGradeList"
              :key="classGrade"
            >
              <el-option
                :label="classGrade"
                :value="classGrade"
              >
              </el-option>
            </template>
          </el-select>
          <el-select
            v-model="classId"
            class="mr-4"
            placeholder="请选择班级"
          >
            <template
              v-for="{ className, classId } in classListFilter"
              :key="classId"
            >
              <el-option
                :label="className"
                :value="classId"
              ></el-option>
            </template>
          </el-select>
          <el-button
            class="rounded border-blue mt-2 ml-4"
            @click="add"
          >
            <span
              class="iconfont icon-jiajianzujianjiahao pr-1.5"
              :class="ruleForm.dailytestSchoolId? 'text-blue': ''"
            />添加
          </el-button>
          <el-table
            :border="true"
            :data="addTableData"
            class="mt-4"
            :header-cell-style="{ background: '#3470D0', color: 'white' }"
          >
            <el-table-column
              align="center"
              label="区域"
              prop="schoolexamId"
              width="auto"
            >
              <template #default="{row}">
                <div>
                  {{ districts[100000][row.announcementProvinceCode] }}
                  {{ districts[row.announcementProvinceCode][row.announcementCityCode] }}
                  {{ districts[row.announcementCityCode][row.announcementDistrictCode] }}
                </div>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              class-name="text-black"
              label="年级"
              prop="classGradeName"
              show-overflow-tooltip
              width="auto"
            >
              <template #default="{row}">
                <div>
                  {{ row.classGradeName ?? "--" }}
                </div>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              class-name="text-black"
              label="班级"
              prop="className"
              width="auto"
            >
              <template #default="{row}">
                <div>
                  {{ row.className ?? "--" }}
                </div>
              </template>
            </el-table-column>


            <el-table-column
              align="center"
              label="操作"
              prop="address"
              width="220px"
            >
              <template #default="{$index}">
                <el-link
                  type="primary"
                  @click="deleteTableItem($index)"
                >
                  删除
                </el-link>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item
          label="作业项目："
          prop="homeworkProject"
        >
          <el-checkbox-group v-model="ruleForm.homeworkProject">
            <el-checkbox
              v-for="(label, i) in workList "
              :key="i"
              :label="label"
              :value="label"
            >
              {{ label }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>


        <el-form-item
          label="作业内容："
          prop="homeworkIntroduction"
        >
          <EditorInput v-model.async="ruleForm.homeworkIntroduction"></EditorInput>
        </el-form-item>

        <el-form-item
          label="定时发布："
          prop="regularRelease"
          class="w-full"
        >
          <el-radio-group v-model="ruleForm.regularRelease">
            <el-radio
              label="单次"
            >
            </el-radio>
            <el-radio
              label="每日"
            >
            </el-radio>
            <el-radio
              label="每周"
            >
              <template #default>
                &nbsp;每周
              </template>
            </el-radio>
            <el-select
              v-if="ruleForm.regularRelease ==='每周'"
              v-model="week"
              class="mr-4"
              placeholder="请选择"
            >
              <template
                v-for="dayNum in weekList"
                :key="dayNum"
              >
                <el-option
                  :label="dayNum"
                  :value="'每周'+dayNum"
                ></el-option>
              </template>
            </el-select>
            <el-radio
              label="每月"
            >
              <template #default>
                &nbsp;每月
              </template>
            </el-radio>
            <el-select
              v-if="ruleForm.regularRelease ==='每月'"
              v-model="dayNum"
              class="mr-4"
              placeholder="请选择"
              @change="changeDay"
            >
              <template
                v-for="dayNum in 31"
                :key="dayNum"
              >
                <el-option
                  :label="dayNum + '号'"
                  :value="dayNum.toString().length ===1? '每月'+ 0 + dayNum: + '每月'+ dayNum"
                ></el-option>
              </template>
            </el-select>
          </el-radio-group>
        </el-form-item>

        <el-form-item
          v-if="ruleForm.regularRelease =='单次'"
          label="发布日期："
          prop="homeworkReleaseBegin"
        >
          <el-date-picker
            v-model="ruleForm.homeworkReleaseBegin"
            class="w-full"
            placeholder="选择发布日期"
            :disabled-date="disabledDate"
            @change="ruleForm.releaseTime=undefined"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item
          v-if="ruleForm.regularRelease =='单次'"
          label="发布时间："
          prop="releaseTime"
        >
          <el-select
            v-model="ruleForm.releaseTime"
            class="mr-4"
            placeholder="请选择发布时间"
          >
            <template
              v-for="timeNum in 23"
              :key="timeNum"
            >
              <el-option
                :disabled="new Date(ruleForm.homeworkReleaseBegin).getDate() === new Date().getDate()? (new Date().getHours()+1 > timeNum) :false"
                :label="timeNum+'点'"
                :value="timeNum"
              ></el-option>
            </template>
          </el-select>
          <div class="ml-4">
            点
          </div>
        </el-form-item>
        <el-form-item
          v-if="ruleForm.regularRelease !=='单次'"
          label="发布计划启动日期："
          prop="homeworkReleaseBegin"
        >
          <el-date-picker
            v-model="ruleForm.homeworkReleaseBegin"
            class="w-full"
            placeholder="选择发布计划启动日期"
            :disabled-date="disabledDate"
            @change="ruleForm.releaseTime=undefined"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item
          v-if="ruleForm.regularRelease !=='单次'"
          label="发布时间："
          prop="releaseTime"
        >
          <el-select
            v-model="ruleForm.releaseTime"
            class="mr-4"
            placeholder="请选择发布时间"
          >
            <template
              v-for="timeNum in 23"
              :key="timeNum"
            >
              <el-option
                :disabled="new Date(ruleForm.homeworkReleaseBegin).getDate() === new Date().getDate()? (new Date().getHours()+1 > timeNum) :false"
                :label="timeNum+'点'"
                :value="timeNum"
              ></el-option>
            </template>
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="ruleForm.regularRelease !=='单次'"

          label="发布计划截止日期："
          prop="homeworkReleaseEnd"
        >
          <el-date-picker
            v-model="ruleForm.homeworkReleaseEnd

            "
            class="w-full"
            placeholder="选择发布计划截止日期"
            :disabled-date="disabledDateHomeworkReleaseEnd"
          >
          </el-date-picker>
        </el-form-item>

        <el-form-item
          class="w-full"
        >
          <div class=" w-full flex justify-center mb-8 ">
            <el-button
              v-loading="isLoading"
              :element-loading-text="btnText+ '中...'"
              :disabled="isLoading && !checkPermissions('add')"
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


<style lang="scss" scoped>


</style>
