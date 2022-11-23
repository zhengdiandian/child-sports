<template>
  <div class="p-8 ">
    <SchoolSelect @getSchool="getSchoolId" />
  </div>
  <div class="h-4 bg-gray-100"></div>
  <div class="p-8">
    <div class="py-8 flex">
      <el-button
        :disabled="!creatForm.dailytestSchoolId || !checkPermissions('add')"
        class="mr-5"
        type="text"
        @click="openCreateDialog(true)"
      >
        <span
          class="iconfont icon-jiajianzujianjiahao pr-1.5"
          :class="creatForm.dailytestSchoolId && checkPermissions('add')? 'text-blue': ''"
        />

        <span class="text-black underline text-lg font">添加记录</span>
      </el-button>
      <div>
        <el-select
          v-model="filterData.dailytestGrade"
          class="mr-4"
          placeholder="请选择年级"
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
        <!--        <el-date-picker-->
        <!--          v-model="filterData.dailytestGrade"-->
        <!--          type="month"-->
        <!--          placeholder="选择月份"-->
        <!--        />-->
        <el-date-picker
          v-model="datePicker"
          end-placeholder="结束日期"
          range-separator="至"
          start-placeholder="开始日期"
          type="daterange"
          @change="changeDate"
        />
      </div>
      <div class="w-50 mx-4">
        <el-input
          v-model="filterData.fuzzyQuery"
          placeholder="请输入查询内容"
        />
      </div>

      <el-button
        :disabled="
          !filterData.fuzzyQuery && !filterData.dailytestGrade
        "
        type="primary"
        @click="handleCurrentChange(1)"
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
          class-name="text-black"
          label="体育课日期"
          prop="classGrade"
          width="120"
        >
          <template #default="scope">
            <div>{{ dateFormat(scope.row?.dailytestDate, "yyyy-mm-dd") }}</div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          class-name="text-black"
          label="班级"
          prop="dailytestClassName"
          width="90"
        />
        <el-table-column
          align="center"
          class-name="text-black"
          label="年级"
          prop="dailytestGrade"
          width="90"
        >
          <template #default="{ row: { dailytestGrade } }">
            <div>{{ gradeConversion(dailytestGrade) }}</div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          class-name="text-black"
          label="班级人数"
          prop="dailytestStudentNum"
          width="90"
        />
        <el-table-column
          align="center"
          class-name="text-black"
          label="体育老师"
          prop="dailytestPeTeacher"
          width="90"
        />
        <el-table-column
          align="center"
          label="测试项目"
          prop="dailytestProject"
          width="auto"
        >
          <template #default="{ row: { dailytestProjectList } }">
            <div class="truncate">
              {{ dailytestProjectList?.join("&nbsp;&nbsp;&nbsp;&nbsp;") }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="测试人数"
          prop="dailytestStudentNum"
          width="80"
        />
        <el-table-column
          align="center"
          label="新增数据"
          prop="dailytestStudentTotalnum"
          width="80"
        />
        <el-table-column
          align="center"
          label="免测人数"
          prop="dailytestTestfreeNum"
          width="90"
        />
        <el-table-column
          align="center"
          label="操作"
          prop="address"
          width="220px"
        >
          <template #default="scope">
            <el-link
              class="mr-4"
              type="primary"
              :disabled="!scope.row.dailytestState || !checkPermissions('update')"
              @click="openCreateDialog(false, scope.row)"
            >
              编辑
            </el-link>
            <el-link
              class="mr-4"
              type="primary"
              :disabled="!checkPermissions('select')"
              @click="toInfo(scope.row)"
            >
              详情
            </el-link>
            <el-link
              :disabled="!checkPermissions('delete')"
              type="primary"
              @click="deletePe(scope.row)"
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
        @click="peListExport(filterData)"
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
  <el-dialog
    v-model="dialogFormVisible"
    destroy-on-close
    :title="isCreate ? '添加体育课记录' : '编辑体育课记录'"
    center
  >
    <template #title>
      <h3
        v-if="isCreate"
        class="text-blue text-left"
      >
        <span class="iconfont icon-jiajianzujianjiahao pr-1.5" />
        <span class="text-black text-lg font-medium"> 新建体育课记录 </span>
      </h3>
      <h3
        v-else
        class="text-left text-black text-lg font-medium"
      >
        编辑体育课记录
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
        label="体育课记录名称："
        prop="dailytestName"
      >
        <el-input
          v-model="creatForm.dailytestName"
          autocomplete="off"
          placeholder="请输入体育课记录名称"
        />
      </el-form-item>
      <el-form-item
        label="体育课日期："
        prop="dailytestDate"
      >
        <el-date-picker
          v-model="creatForm.dailytestDate"
          class="w-full date-picker"
          type="date"
          :disabled-date="disabledStartDate"
        />
      </el-form-item>
      <el-form-item
        label="年级："
        prop="dailytestGrade"
      >
        <el-select
          v-model="creatForm.dailytestGrade"
          class="w-full"
          placeholder="请选择年级"
          :disabled="!creatForm.dailytestDate"
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
      </el-form-item>
      <el-form-item
        label="训练班级："
        prop="dailytestClassId"
      >
        <el-select
          v-model="creatForm.dailytestClassId"
          class="w-full"
          placeholder="请选择训练班级"
          :disabled="!creatForm.dailytestGrade"
          @change="getProject"
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
      </el-form-item>
      <el-form-item
        label="项目"
        prop="dailytestProjectList"
      >
        <el-checkbox
          v-model="checkAll"
          :indeterminate="isIndeterminate"
          @change="handleCheckAllChange"
        >
          全选
        </el-checkbox>
        <el-checkbox-group
          v-model="creatForm.dailytestProjectList"
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
    </el-form>
    <h3 class="text-center text-black">
      <span class="iconfont icon-tishi1 text-red"></span>
      录入时间将于7日内截止，截止后不可修改
    </h3>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button
          v-if="isCreate"
          type="primary"
          @click="creatClass"
        >保存</el-button>
        <el-button
          v-else
          type="primary"
          @click="updateClassList"
        >保存</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { reactive, ref, watch } from "vue";
import SchoolSelect from "@/components/SchoolSelect/index.vue";
import dateFormat from "@/utils/dateFormat.js";
import type { ElForm } from "element-plus";
import { ElMessage, ElMessageBox } from "element-plus";
import { getClasses } from "@/api/physicalDataManagement";
import { add, list, listProjects, peListDelete, peListExport, update } from "@/api/peList";
import { filterGradeList, gradeConversion } from "@/utils/baseData";
import type { ExamListAddResult } from "@/interface/examListAdd";
import rules from "@/utils/rules";
import type { BizUpdateSchoolexamParam } from "@/interface/examUpdate";
import { useRouter } from "vue-router";
import { pageSize, pageSizes } from "@/hooks/pagination";
import checkPermissions from "@/hooks/checkPermissions";

type FormInstance = InstanceType<typeof ElForm>

const router = useRouter();
const formRef = ref<FormInstance>();
const dialogFormVisible = ref(false);
const schoolType = ref("");
const isCreate = ref(true);
const datePicker = ref([]);
const filterData: any = reactive({
  fuzzyQuery: "",
  pageNum: 1,
  pageSize,
  schoolId: 1,
  dailytestGrade: "",
  dailytestDateBegin: undefined,
  dailytestDateEnd: undefined
});
const changeDate = (dataArr: [string, string]) => {
  filterData.dailytestDateBegin = dataArr[0];
  filterData.dailytestDateEnd = dataArr[1];
};
// const changeDate = (dataArr: [string, string]) => {
//   filterData.dailytestDateMin = dataArr[0];
//   filterData.dailytestDateMax = dataArr[1];
// };
let dailytestId = ref(0);
const toInfo = (row: BizUpdateSchoolexamParam) => {
  dailytestId.value = row.dailytestId;
  router.push({ name: "peDetail", query: { dailytestId: dailytestId.value } });

};
const openCreateDialog = async (state: boolean, row: BizUpdateSchoolexamParam) => {
  const keys = Object.keys(creatForm);
  if (!state) {
    keys.forEach(key => {
      creatForm[key] = row[key];
    });
    dailytestId.value = row.dailytestId;
    // await getProject();
    await changeGrade(creatForm.dailytestGrade);
  } else {
    creatForm.value = {
      dailytestGrade: "",
      dailytestClassId: undefined,
      dailytestSchoolId: undefined,
      dailytestDate: undefined,
      dailytestName: "",
      dailytestDeadline: "",
      dailytestProjectList: []
    };
    // keys.forEach(key => {
    //   creatForm[key] = '';
    // });
    creatForm.dailytestSchoolId = filterData.schoolId;
  }
  // console.log("sss",row.dailytestClassNum)
  isCreate.value = state;
  dialogFormVisible.value = true;

};
let gradeList: any = ref([]);
let classList: any = ref([]);

let creatForm: any = ref({
  dailytestGrade: "",
  dailytestClassId: undefined,
  dailytestSchoolId: undefined,
  dailytestDate: undefined,
  dailytestName: "",
  dailytestDeadline: "",
  dailytestProjectList: []
}).value;
const options = ref([]);

watch(() => creatForm.dailytestClassId, (grade) => {
  console.log(grade);

}, {
  immediate: false
});
const getProject = (id: any) => {
  listProjects({
    classGrade: creatForm.dailytestGrade,
    dailytestDate: creatForm.dailytestDate,
    classId: id
  }).then((res: any) => {
    options.value = res.data;
  });
};
const disabledStartDate = (time: Date) => {
  return time.getTime() < (Date.now() - (1000 * 60 * 60 * 24 * 8));
};
const changeGrade = async (classGrade: number) => {
  creatForm.dailytestClassId = undefined;
  classList.value = [];
  console.log("dailytestGrade", {
    classGrade, schoolId: filterData.schoolId, date: creatForm.dailytestGrade

  });
  await getClasses({
    classGrade, schoolId: filterData.schoolId, date: creatForm.dailytestDate, examType: 1

  }).then(({ data }: any) => {
    classList.value = data;
  }).catch((e: string) => {
    console.error(e);
  });
  // await getProject();

};

function checkFormData() {
  if (!formRef.value) return false;
  let isPass = true;
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
const creatClass = () => {
  if (!checkFormData()) return;
  console.log("新建班级", creatForm);
  const parmeter = creatForm;
  debugger;
  add(parmeter)
    .then((res: ExamListAddResult) => {
      debugger;
      console.log("添加", res.code);
      ElMessage({
        message: "添加成功.",
        type: "success"
      });
      dialogFormVisible.value = false;
      getEm();
      resetForm(formRef.value);
    })
    .catch((e: object) => console.error(e));
};

function updateClassList() {
  if (!checkFormData()) return;
  const params = { ...creatForm, dailytestId: dailytestId.value };
  update(params)
    .then(() => {
      ElMessage({
        message: "更新成功.",
        type: "success"
      });
      getEm();
      resetForm(formRef.value);
    })
    .catch((err: object) => {
      ElMessage({
        message: "更新失败.",
        type: "error"
      });
      console.log("删除错误信息", err);
    });
  dialogFormVisible.value = false;
}

function deletePe({ dailytestId }: any) {
  ElMessageBox.confirm("确定要删除所选体质测试", "Warning", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    peListDelete({ dailytestId })
      .then(() => {
        ElMessage({
          message: "删除成功.",
          type: "success"
        });
        getEm();
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
const getEm = () => {
  list(filterData).then((res: { data: any }) => {
    const { data } = res;
    tableData.pageNum = data.pageNum;
    tableData.list = data.list;
    tableData.total = data.total;
    console.log("学校列表", data, tableData);
  });
};

function getSchoolId(type: "小学" | "初中", id: number) {
  filterData.schoolId = id;
  // filterData.dailytestGrade = (type === "小学") ? 1 : 2;
  creatForm.dailytestSchoolId = id;
  // creatForm.classType = type === "小学" ? 1 : 2;
  schoolType.value = type;
  gradeList.value = filterGradeList(type);
  getEm();
}

function handleSizeChange(size: number) {
  filterData.pageSize = size;
  getEm();
}

function handleCurrentChange(currentPage: number) {
  filterData.pageNum = currentPage;
  getEm();
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

<style lang="scss" scoped>
//::v-deep( .date-picker) {
//
//  .el-input__inner {
//    padding-left: 40px !important;
//    //background-color: transparent;
//  }
//}
</style>
