<script lang="ts" setup>
import ChartC from "@/components/Charts/Chart.vue";
import { useRoute } from "vue-router";
import {
  clear,
  downloadExamTemplate,
  examDataExport,
  examDataImport,
  examManagement,
  examResult,
  list,
  project,
  projectImport,
  update
} from "@/api/examData";
import TimeInput from "@/components/TimeInput.vue";
import { findColor } from "@/utils/levelColors";
import { computed, reactive, ref } from "vue";
import { Search } from "@element-plus/icons-vue";
import { ExamManagementResult, ListOfExamData } from "@/interface/examData";
import { pageSize, pageSizes } from "@/hooks/pagination";
import { ElMessage } from "element-plus/es";
import dateFormat from "@/utils/dateFormat";
import dataProcessing from "@/hooks/dataProcessing";
import { ElForm, ElMessageBox } from "element-plus";
import rules from "@/utils/rules";
import { useStore } from "vuex";
import { ExamListAddResult } from "@/interface/examListAdd";
import { gradeConversion } from "@/utils/baseData";

type FormInstance = InstanceType<typeof ElForm>
const formRef = ref<FormInstance>();
const dialogFormVisible = ref(false);
const store = useStore();
const classList = ref(store.state.Exam.examDetails?.classInfos ?? []);
const route = useRoute();
let { schoolexamId }: any = route.query;
let creatForm: any = reactive({
  classId: "",
  date: undefined,
  examId: schoolexamId,
  projects: []
});
const fileNameText = computed((): string => {
  return examManagementData.value.schoolexamName + dateFormat(examManagementData.value?.schoolexamDate, "yyyy-mm-dd") + "体质测试" + gradeConversion(examManagementData.value.schoolexamGrade);
});
const sortChangeHandler = ({ column, prop, order }: any) => {
  let sortText = `${prop}:`;
  if (order === "ascending") {
    sortText += "asc";
    formData.sort = sortText;
  }
  if (order === "descending") {
    sortText += "des";
    formData.sort = sortText;
  }
  if (order === "") {
    formData.sort = undefined;
  }
  getList();
};
const checkAll = ref(false);
const isIndeterminate = ref(true);
// const checkedCities = ref(['Shanghai', 'Beijing'])
// const cities = ['Shanghai', 'Beijing', 'Guangzhou', 'Shenzhen']
const options = ref([]);
const handleCheckAllChange = (val: boolean) => {
  creatForm.projects = val ? options.value : [];
  isIndeterminate.value = false;
};
const handleCheckedCitiesChange = (value: string[]) => {
  const checkedCount = value.length;
  checkAll.value = checkedCount === options.value.length;
  isIndeterminate.value = checkedCount > 0 && checkedCount < options.value.length;
};
const changeHandler = () => {
  const { classId, date } = creatForm;
  if (classId && date) {
    project({ classId, date }).then((res: any) => {
      options.value = res.data;
    });
  }
};

function checkFormData() {
  if (!formRef.value) return false;
  let isPass: any = true;
  formRef.value.validate((val) => {
    console.log("验证的值", val);
    isPass = val;
  });
  return isPass;
}

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};
const importClassData = () => {
  if (!checkFormData()) return;
  let parameter = { ...creatForm };
  projectImport(parameter)
    .then((res: ExamListAddResult) => {
      if (res.code === 200) {
        ElMessage({
          message: "导入成功",
          type: "success"
        });
        dialogFormVisible.value = false;
        getList();
        resetForm(formRef.value);
      }


    });
};
const clearHandler = ({ studentId, studentName }: any) => {
  ElMessageBox.confirm(`确定要重置${studentName}同学体测成绩?`, "Warning", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  })
    .then(() => {
      clear({ studentId, schoolexamId })
        .then((res: any) => {
          if (res.code === 200) {
            ElMessage({
              message: "重置成功.",
              type: "success"
            });
            getList();
          } else {
            ElMessage({
              message: "重置失败.",
              type: "error"
            });
          }

        })
        .catch((err: any) => {
          ElMessage({
            message: "清空失败.",
            type: "error"
          });
          console.log("删除错误信息", err);
        });
    });

};
let formData: any = reactive({
  fuzzyQuery: "",
  pageNum: 1,
  pageSize: pageSize,
  schoolexamId,
  studentGender: [],
  className: "",
  sort: undefined
});
let tableList = ref({
  list: [],
  total: 0,
  pageNum: 1,
  pageSize: pageSize
});
let examManagementData: any = ref({});
let chartData = ref({});
const formatData = (data: any) => {
  debugger
  const keys = Object.keys(data);
  const chartData: any = {
    // test: {"不及格":1.41,"优秀":3.41,"及格":64.86,"良好":1.32,"未完成率":0}
  };
  // let project = projectJson === undefined ? projectJson: 'totalScore'
// if (!avrScore) {
//
// }
  keys.forEach(key => {
    const { testfree, total, levelNum, avrScore, projectName } = data[key];
    let obj: any = {};

    levelNum.map(({ level, number }: any) => {
      obj[level] = number;
      return obj;
    });
    // obj["未完成"] = Math.round(testfree / total * 10000) / 100;
    chartData[projectName] = {};
    chartData[projectName] = obj;
    // Object.keys(levelNum).forEach((item:any) => {
    //   let  obj = {}
    //   obj[item.level] = Math.round(item.number / total * 10000) / 100;
    //   chartData[projectName] = obj;
    //
    // });
    // levelNum["未完成率"] = Math.round(testfree / total * 10000) / 100;
    // levelNum.avrScore = Math.round(avrScore * 100) / 100;
  });
  console.log("ok", chartData);
  // delete chartData.BMI;
  return chartData;
};

const save = (row) => {
  row.isEdit = !(row?.isEdit);
  if (!row.isEdit) {
    const parmeter = {
      studentId: row.studentId,
      schoolexamId: schoolexamId,
      projectData: row.projectData
    };
    update(parmeter).then((res: { code: number, message: string }) => {
      const { message, code } = res;
      if (code == 200) {
        // onSubmit();
        getList();
        ElMessage.success(message);
      } else {
        ElMessage.error(message);
      }
    });
  }
};

const getList = () => {

  const studentGender = formData?.studentGender?.length == 2 ? undefined : formData?.studentGender[0];
  list({ ...formData as ListOfExamData, studentGender }).then(({ data }: any) => {
    tableList.value = data;
  });
};
const init = () => {
  // let { schoolexamId }: any = route.query;
  getList();
  examResult({ schoolexamId }).then(({ data }: any) => {
    chartData.value = formatData(data, "totalScore");
  });
  examManagement({ schoolexamId }).then((res: ExamManagementResult) => {
    examManagementData.value = res.data;
  });
};
init();

// onActivated(init)
function handleSizeChange(size: number) {
  formData.pageSize = size;
  getList();
}

function handleCurrentChange(currentPage: number) {
  formData.pageNum = currentPage;
  getList();
  console.log("页吗改变", formData);
}

const fileInput: any = ref<null | HTMLInputElement>(null);
const genderList = ["男", "女"];
const exportData = (fileName: string) => {
  const studentGender = formData.studentGender.length === 2 ? undefined : genderList.find(item => item === formData.studentGender[0]);
  examDataExport({
    schoolexamId,
    fuzzyQuery: formData.fuzzyQuery,
    studentGender,
    className: formData.className
  }, fileName);
};
const importData = () => {
  fileInput.value.click();
};
const fileChange = (e: Event) => {
  // 上传文件
  const target = e.target as HTMLInputElement;
  const files = target.files;
  if (files) {
    const uploadedFile = files[0];
    const formData = new FormData();
    formData.append("file", uploadedFile);
    // formData.append("schoolexamId", schoolexamId);
    examDataImport({ schoolexamId }, formData).then((res: { message: string, code: number }) => {
      fileInput.value.value = null;
      const { message, code } = res;
      if (code == 200) {
        // onSubmit();
        getList();
        ElMessage.success(message);
      } else {
        ElMessage.error(message);
      }
    }).catch(() => {
      fileInput.value.value = null;
    });
  }
};
</script>

<template>
  <!--  <Search></Search>-->
  <div class=" bg-gray-100 space-y-4 min-h-modal">
    <div class="bg-white px-2.5 py-3.5">
      <h3 class="text-black text-2xl mb-4 font-semibold">
        {{ examManagementData.schoolexamName }}
      </h3>
      <div class="space-y-2">
        <div class="grid    grid-cols-8 gap-y-2">
          <div class="square ">
            体测时间：<span class="text-blue">{{ dateFormat(examManagementData?.schoolexamDate, "yyyy-mm-dd")

            }}</span>
          </div>
          <div class="square">
            学校名称：<span class="text-blue truncate ">{{ examManagementData.schoolexamName }}</span>
          </div>
          <div class="square col-span-4">
            <span
              class="break-normal"
              style="word-break: keep-all"
            >班级信息：</span><span class="text-blue truncate">{{
              examManagementData.schoolexamClasses ? (examManagementData.schoolexamClasses).join("&nbsp;&nbsp;&nbsp;&nbsp;") : ""
            }}</span>
          </div>
          <div class="square">
            学生人数：<span class="text-blue">{{ examManagementData?.schoolexamStudentNum ?? 0 }}</span>
          </div>
          <div class="square">
            免测人数：<span class="text-blue">{{ examManagementData?.schoolexamTestfreeNum ?? 0 }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="bg-white px-2.5 py-3.5">
      <h3 class="text-xl text-black font-semibold mb-4 ">
        <span class="iconfont icon-shuzhuangtu text-2xl text-yellow"></span> 体测项目成绩统计
      </h3>
      <ChartC
        v-if="chartData"
        :fixed-name="'总分'"
        :fixed-value="'总分'"
        :chart-data="chartData"
      ></ChartC>
    </div>
    <div class="bg-white px-2.5 py-3.5">
      <h3 class="text-xl text-black font-semibold ">
        <span class="iconfont icon-minganxinxizongjilushu text-2xl text-yellow"></span> 学生成绩详情
      </h3>

      <div class="space-x-6 nowrap flex justify-between  my-4">
        <!--      <div class="w-50 mx-4">-->
        <div>
          <div class="inline-block text-black">
            性别：
            <el-checkbox-group
              v-model="formData.studentGender"
              class="inline-block"
            >
              <template
                v-for="label in genderList"
                :key="label"
              >
                <el-checkbox
                  :label="label"
                >
                  {{ label }}
                </el-checkbox>
              </template>
            </el-checkbox-group>
          </div>
          <el-select v-model="formData.className">
            <el-option
              v-for="schoolName in examManagementData.schoolexamClasses"
              :key="schoolName"
              :value="schoolName"
            ></el-option>
          </el-select>
          <el-input
            v-model="formData.fuzzyQuery"
            class="w-40"
            placeholder="请输入查询内容"
          >
            <template #prefix>
              <el-icon class="el-input__icon">
                <Search />
              </el-icon>
            </template>
          </el-input>
          <el-button
            class="rounded w-0"
            type="primary"
            @click="handleCurrentChange(1)"
          >
            搜索
          </el-button>
        </div>
        <el-button
          type="text"
          class="mr-8 text-red"
          @click="$router.push({ name:'nationalTestData'})"
        >
          生成国测导入表
        </el-button>
      </div>
      <el-table
        :border="true"
        :data="tableList.list"
        :header-cell-style="{ background: '#3470D0', color: 'white' }"
        @sort-change="sortChangeHandler"
      >
        <el-table-column
          align="center"
          label="序号"
          type="index"
          width="60"
          fixed="left"
        />

        <el-table-column
          align="center"
          class-name="text-black"
          label="姓名"
          prop="studentName"
          show-overflow-tooltip
          width="180px"
          fixed="left"
        />
        <el-table-column
          align="center"
          class-name="text-black"
          label="编号"
          prop="studentNumber"
          show-overflow-tooltip
          width="120px"
        />
        <el-table-column
          align="center"
          class-name="text-black"
          label="性別"
          prop="studentGender"
          show-overflow-tooltip
          width="60px"
        />
        <el-table-column
          align="center"
          class-name="text-black"
          label="是否免测"
          prop="testFree"
          width="100px"
        >
          <template #default="{row:{testFree}}">
            <div>{{ testFree ? "是" : "否" }}</div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          class-name="text-black"
          label="总分"
          prop="总分"
          show-overflow-tooltip
          width="180px"
          sortable="custom"
        >
          <template #default="{row:{score}}">
            <div :style="{backgroundColor:findColor(score.level)}">
              {{ score.value ? Number.parseFloat(score.value).toFixed(2) : 0 }}
            </div>
          </template>
        </el-table-column>
        <template v-if="tableList.list.length !== 0">
          <el-table-column
            v-for="(item , key) in tableList.list[0].projectData"
            :key="key"

            sortable="custom"
            align="center"
            class-name="text-black"
            :label="item.projectName"
            :prop="item.projectName"
            show-overflow-tooltip
            min-width="180x"
            width="auto"
          >
            <template #default="{row, column, $index}">
              <div :style="{backgroundColor:findColor(row.projectData[column.rawColumnKey].level)}">
                <template
                  v-if="row.isEdit&&column.label!=='BMI(千克/米2)'&& row.projectData[column.rawColumnKey]?.value !== null"
                >
                  <time-input
                    v-if="['800米跑(秒)', '1000米跑(秒)', '50米×8往返跑(秒)'].includes(column.label)"
                    v-model.number="row.projectData[column.rawColumnKey].value"
                    @change="value => row.projectData[column.rawColumnKey].value = value"
                  >
                  </time-input>
                  <el-input
                    v-else
                    v-model.number="row.projectData[column.rawColumnKey].value"
                    type="number"
                    :class="[findColor(row.projectData[column.rawColumnKey].level)]"
                    @change="value => row.projectData[column.rawColumnKey].value = value"
                  ></el-input>
                </template>

                <div v-else>
                  {{ row.projectData[column.rawColumnKey].level }}
                  {{
                    dataProcessing(row, column)
                  }}
                  <!--                {{ column }}-->
                </div>
              </div>
            </template>
          </el-table-column>
        </template>
        <el-table-column
          align="center"
          class-name="text-black"
          label="测试时间"
          prop="schoolexamDate"
          show-overflow-tooltip
          width="180px"
        >
          <template #default="{row: {schoolexamDate}}">
            {{ dateFormat(schoolexamDate, "yyyy-mm-dd") }}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          class-name="text-black"
          label="班级"
          prop="className"
          show-overflow-tooltip
          width="180px"
        />
        <el-table-column
          fixed="right"
          label="操作"
          width="auto"
          min-width="220"
          align="center"
        >
          <template #default="{row}">
            <el-button
              :disabled=" +new Date(examManagementData.schoolexamDeadline) < +new Date()"
              class="lg:text-base underline"
              type="text"
              size="default"
              @click="save(row)"
            >
              {{ row?.isEdit ? "保存" : "编辑" }}
            </el-button>

            <el-button
              class="lg:text-base underline"
              type="text"
              size="default"
              @click="$router.push({name:'examStudentDetail', query: {studentId: row.studentId}})"
            >
              学生体测详情
            </el-button>
            <el-button
              :disabled=" +new Date(examManagementData.schoolexamDeadline) < +new Date()"
              class="lg:text-base underline"
              type="text"
              size="default"
              @click="clearHandler(row)"
            >
              重置
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="flex justify-between mt-5">
        <div class="space-x-10 ">
          <input
            v-show="false"
            id="fileInput"
            ref="fileInput"
            type="file"
            @change="fileChange"
          >
          <!--        <label for="fileInput"  class="inline-block">-->
          <el-button
            :disabled=" +new Date(examManagementData.schoolexamDeadline) < +new Date()"
            size="large"
            class="lg:text-base px-6"
            type="primary"
            @click="importData"
          >
            导入数据
          </el-button>

          <!--        </label>-->
          <el-button
            size="large"
            class="lg:text-base"
            type="warning"
            @click="exportData(fileNameText)"
          >
            导出数据
          </el-button>
          <el-button
            size="large"
            class="lg:text-base"
            type="info"
            @click="dialogFormVisible =true"
          >
            从体育课导入数据
          </el-button>
          <el-button
            class=" -mx-2"
            type="text"
          >
            <span class="iconfont icon-xiazai  text-4xl"></span>
            <span
              class=" underline text-black mx-2.5 lg:text-base"
              @click="downloadExamTemplate({schoolexamId}, fileNameText)"
            >下载模板</span>
          </el-button>
        </div>
        <el-pagination
          v-model:currentPage="tableList.pageNum"
          v-model:page-size="tableList.pageSize"
          class=""
          :page-sizes="pageSizes"
          :small="false"
          :disabled="false"
          :background="false"
          layout="total, sizes, prev, pager, next"
          :total="tableList.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
    <el-dialog
      v-model="dialogFormVisible"
      destroy-on-close
      title="从体育课导入数据"
      center
    >
      <template #title>
        <h3
          class="text-left text-black text-lg font-medium"
        >
          从体育课导入数据
        </h3>
      </template>
      <el-form
        ref="formRef"
        :model="creatForm"
        :rules="rules"
        class="mx-8"
        label-position="left"
        label-width="126px"
      >
        <el-form-item
          label="班级："
          prop="classId"
        >
          <el-select
            v-model="creatForm.classId"
            class="w-full"
            placeholder="请选择班级"
            @change="changeHandler"
          >
            <template
              v-for="{ name, id } in classList"
              :key="id"
            >
              <el-option
                :label="name"
                :value="id"
              ></el-option>
            </template>
          </el-select>
        </el-form-item>
        <el-form-item
          label="日期："
          prop="date"
        >
          <el-date-picker
            v-model="creatForm.date"
            class="w-full"
            placeholder="请选择日期"
            type="date"
            format="YYYY/MM/DD"
            value-format="YYYY-MM-DD"
            @change="changeHandler"
          />
        </el-form-item>
        <el-form-item
          label="当日录入的项目："
          prop="projects"
          label-width="160px"
        >
          <div class="flex items-center justify-center">
            <el-checkbox
              v-model="checkAll"
              :indeterminate="isIndeterminate"
              @change="handleCheckAllChange"
            >
              全选
            </el-checkbox>
            <el-checkbox-group
              v-model="creatForm.projects"
              class="ml-2 mt-1.5"
              @change="handleCheckedCitiesChange"
            >
              <el-checkbox
                v-for="name in options"
                :key="name"
                :label="name"
                :name="name"
              ></el-checkbox>
            </el-checkbox-group>
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>

          <el-button
            class="ml-12"
            type="primary"
            @click="importClassData"
          >导入勾选项数据</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped></style>
