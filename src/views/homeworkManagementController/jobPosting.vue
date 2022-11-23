<template>
  <div class="p-8 ">
    <SchoolSelect @getSchool="getSchoolId" />
  </div>
  <div class="h-4 bg-gray-100"></div>
  <div class="p-8">
    <div class="py-8 flex">
      <el-button
        :disabled="!creatForm.projectSchoolId || !checkPermissions('add')"
        class="mr-5"
        type="text"
        @click="router.push({name: 'addHomeWork'})"
      >
        <span
          class="iconfont icon-jiajianzujianjiahao pr-1.5"
          :class="creatForm.projectSchoolId &&checkPermissions('add')? 'text-blue': ''"
        />

        <span class="text-black underline text-lg font">发布作业</span>
      </el-button>
      <div>
        <el-select
          v-model="filterData.homeworkGrade"
          class="mr-4"
          placeholder="请选择年级"
          @change="changeGrade"
        >
          <template
            v-for="{ value, label } in gradeList"
            :key="value"
          >
            <el-option
              :label="label"
              :value="value"
            ></el-option>
          </template>
        </el-select>
        <el-select
          v-model="filterData.className"
          class="mr-4"
          placeholder="请选择班级"
        >
          <template
            v-for="{ className, classId } in classList"
            :key="classId"
          >
            <el-option
              :label="className"
              :value="classId"
            ></el-option>
          </template>
        </el-select>
        <el-select
          v-model="filterData.regularRelease"
          class="mr-4"
          placeholder="请选择发布频率"
        >
          <template
            v-for=" item in regularReleaseList"
            :key="item"
          >
            <el-option
              :label="item"
              :value="item"
            ></el-option>
          </template>
        </el-select>
        <el-select
          v-model="filterData.peTeacher"
          class="mr-4"
          placeholder="请选择体育老师"
        >
          <template
            v-for="{ teacherName, teacherId } in teacherList"
            :key="teacherId"
          >
            <el-option
              :label="teacherName"
              :value="teacherName"
            ></el-option>
          </template>
        </el-select>
      </div>
      <div class="w-50 mx-4">
        <el-input
          v-model="filterData.fuzzyQuery"
          placeholder="请输入查询内容"
        />
      </div>

      <el-button
        type="primary"
        @click="getList"
      >
        搜索
      </el-button>
    </div>

    <div>
      <el-table
        :border="true"
        :data="tableData.list"
        :header-cell-style="{ background: '#3470D0', color: 'white' }"
      >
        <el-table-column
          align="center"
          label="序号"
          type="index"
          width="80"
        />
        <el-table-column
          align="center"
          label="作业名称"
          prop="homeworkName"
          width="auto"
        >
        </el-table-column>
        <el-table-column
          align="center"
          label="发布日期"
          prop="regularRelease"
          width="120"
        >
        </el-table-column>
        <el-table-column
          align="center"
          label="结束日期"
          prop="homeworkReleaseEnd"
          width="120"
        >
          <template #default="scope">
            <div>{{ dateFormat(scope.row.homeworkReleaseEnd, "yyyy-mm-dd") }}</div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="年级名称"
          prop="homeworkGrade"
          width="120"
        >
          <template #default="{ row: { homeworkGrade } }">
            <div>{{ gradeConversion(homeworkGrade) }}</div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="班级名称"
          prop="className"
          width="auto"
        >
          <template #default="{ row: {homeworkClasses}}">
            {{ Object.values(homeworkClasses)?.toString() }}
          </template>
        </el-table-column>


        <el-table-column
          align="center"
          label="上传方式"
          prop="importMethod"
          width="90"
        />
        <el-table-column
          align="center"
          label="总人数"
          prop="studentTotalNum"
          width="90"
        />

        <el-table-column
          align="center"
          class-name="text-black"
          label="体育老师"
          prop="peTeacherName"
          width="90"
        />


        <el-table-column
          fixed="right"
          align="center"
          label="定时任务管理"
          prop="address"
          width="220px"
        >
          <template #default="{row}">
            <el-link
              class="mr-4"
              type="primary"
              :disabled="!checkPermissions('update')"
              @click="edit(row)"
            >
              编辑
            </el-link>
            <el-link
              :disabled="!checkPermissions('update')"
              type="primary"
              @click="deletePe(row)"
            >
              删除
            </el-link>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="flex justify-between pt-5">
      <el-button
        size="large"
        class="lg:text-base"
        type="warning"
        @click="homeworkReleaseExport(filterData)"
      >
        导出数据
      </el-button>
      <el-pagination
        v-model:currentPage="filterData.pageNum"
        v-model:page-size="filterData.pageSize"
        :page-sizes="pageSizes"
        :total="tableData.total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onActivated, reactive, ref } from "vue";
import SchoolSelect from "@/components/SchoolSelect/index.vue";
import type { ElForm } from "element-plus";
import { ElMessage, ElMessageBox } from "element-plus";
import { listClasses } from "@/api/customItem";
import {
  deleteHomeworkTiming,
  homeworkReleaseExport,
  listHomeworkTiming,
  listTeacher
} from "@/api/homeworkManagementController";
import { filterGradeList, gradeConversion } from "@/utils/baseData";
import { useRoute, useRouter } from "vue-router";
import { pageSize, pageSizes } from "@/hooks/pagination";
import dateFormat from "@/utils/dateFormat.js";
import { ICreatForm } from "@/interface/customItem";
import { useStore } from "vuex";
import checkPermissions from "@/hooks/checkPermissions";

const store = useStore();
type FormInstance = InstanceType<typeof ElForm>
onActivated(() => {
  const { query } = useRoute();
  if (query?.now) {
    getList();
  }
});
const teacherList = ref([]);
const changeClass = async () => {

};
const router = useRouter();
const formRef = ref<FormInstance>();
const dialogFormVisible = ref(false);
const schoolType = ref("");
const isCreate = ref(true);
const datePicker = ref([]);
const addTableData = ref([]);
const regularReleaseList: any = ref(["单次", "每日", "每周", "每月"]);
const filterData: any = reactive({
  fuzzyQuery: "",
  pageNum: 1,
  pageSize,
  schoolId: 1,
  homeworkGrade: undefined,
  className: undefined,
  peTeacher: undefined,
  homeworkDateBegin: undefined,
  homeworkDateEnd: undefined,
  regularRelease: undefined
});
const changeDate = (dataArr: [string, string]) => {
  filterData.homeworkDateBegin = dataArr[0];
  filterData.homeworkDateEnd = dataArr[1];
};
let projectId = ref(0);
let gradeList: any = ref([]);
let classList: any = ref([]);

let creatForm: ICreatForm = ref({
  "classGrade": undefined,
  "className": "",
  "projectClassId": undefined,
  "projectDeadline": "",
  "projectNameOne": "",
  "projectNameTwo": "",
  "projectSchoolId": 0,
  "projectUnitOne": "",
  "projectUnitTwo": ""
}).value;
const options = ref([]);

const disabledStartDate = (time: Date) => {
  return time.getTime() < (Date.now() - (1000 * 60 * 60 * 24 * 8));
};
const changeGrade = async (classGrade: number) => {
  creatForm.className = "";
  filterData.classId = undefined;
  classList.value = [];
  await listClasses({
    grade: classGrade

  }).then(({ data }: any) => {
    classList.value = data;
  }).catch((e: string) => {
    console.error(e);
  });
};

function checkFormData() {
  if (!!creatForm.projectUnitTwo || !!creatForm.projectNameTwo) {
    ElMessage.error("请完整填写项目二！");
    return false;
  }
  if (!formRef.value) return false;
  let isPass: undefined | boolean = true;
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
const edit = (row: any) => {
  store.commit(
    "HomeWork/setEditData",
    row
  );
  router.push({ name: "addHomeWork" });
};

function deletePe({ homeworkTimingId }: any) {
  ElMessageBox.confirm("确定要删除所选作业", "Warning", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    deleteHomeworkTiming({ homeworkTimingId })
      .then((res: any) => {
        if (res.code === 200) {
          res.code;

          ElMessage({
            message: "删除成功.",
            type: "success"
          });
          return getList();
        }
        return ElMessage({
          message: "删除失败.",
          type: "error"
        });
      })
      .catch(() => {
        ElMessage({
          message: "删除失败.",
          type: "error"
        });
        // console.log("删除错误信息", err);
      });
  });
  // .catch(() => {});
}

const tableData = reactive({
  pageNum: 0,
  pageSize: 0,
  total: 0,
  totalPage: 1,
  list: []
});
const getList = () => {
  listHomeworkTiming(filterData).then((res: { data: any }) => {
    const { data } = res;
    tableData.pageNum = data.pageNum;
    tableData.list = data.list;
    tableData.total = data.total;
    console.log("学校列表", data, tableData);
  });
};

async function getSchoolId(type: "小学" | "初中", id: number) {
  filterData.schoolId = id;
  // filterData.classGrade = (type === "小学") ? 1 : 2;
  creatForm.projectSchoolId = id;
  // creatForm.classType = type === "小学" ? 1 : 2;
  schoolType.value = type;

  gradeList.value = filterGradeList(type);
  getList();
  await listTeacher({ schoolId: id }).then(res => {
    teacherList.value = res.data;
  });
}

function handleSizeChange(size: number) {
  filterData.pageSize = size;
  getList();
}

function handleCurrentChange(currentPage: number) {
  filterData.pageNum = currentPage;
  getList();
  console.log("页吗改变", filterData);
}

const checkAll = ref(false);
const isIndeterminate = ref(true);

const handleCheckAllChange = (val: boolean) => {
  creatForm.dailytestProjectList = val ? options.value : [];
  isIndeterminate.value = false;
};
const handleCheckedCitiesChange = (value: string[]) => {
  const checkedCount = value.length;
  checkAll.value = checkedCount === options.value.length;
  isIndeterminate.value = checkedCount > 0 && checkedCount < options.value.length;
};
</script>
