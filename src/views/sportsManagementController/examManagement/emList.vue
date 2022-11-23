<template>
  <div class="p-8">
    <SchoolSelect @getSchool="getSchoolId" />
  </div>
  <div class="h-4 bg-gray-100"></div>
  <div class="p-8">
    <div class="py-8 flex">
      <el-button
        :disabled="!creatForm.schoolexamSchoolId || !checkPermissions('add')"
        class="mr-5"
        type="text"
        @click="openCreateDialog(true)"
      >
        <span
          class="iconfont icon-jiajianzujianjiahao pr-1.5"
          :class="creatForm.schoolexamSchoolId && checkPermissions('add')? 'text-blue': ''"
        />

        <span class="text-black underline text-lg font">新建体质测试</span>
      </el-button>
      <div>
        <el-select
          v-model="filterData.schoolexamGrade"
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
        <el-date-picker
          v-model="filterData.schoolexamDate"
          type="month"
          placeholder="选择月份"
        />
        <!--        <el-date-picker-->
        <!--          v-model="datePicker"-->
        <!--          end-placeholder="结束日期"-->
        <!--          range-separator="至"-->
        <!--          start-placeholder="开始日期"-->
        <!--          type="daterange"-->
        <!--          @change="changeDate"-->
        <!--        />-->
      </div>
      <div class="w-50 mx-4">
        <el-input
          v-model="filterData.fuzzyQuery"
          placeholder="请输入查询内容"
        />
      </div>

      <el-button
        :disabled="
          !filterData.fuzzyQuery && !filterData.schoolexamGrade
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
          prop="schoolexamId"
          width="80"
        />
        <el-table-column
          align="center"
          class-name="text-black"
          label="体测名称"
          prop="schoolexamName"
          show-overflow-tooltip
          width="180px"
        />
        <el-table-column
          align="center"
          class-name="text-black"
          label="体测日期"
          prop="classGrade"
          width="120"
        >
          <template #default="scope">
            <div>{{ dateFormat(scope.row.schoolexamDate, "yyyy-mm-dd") }}</div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          class-name="text-black"
          label="年级"
          prop="schoolexamGrade"
          width="90"
        >
          <template #default="{ row: { schoolexamGrade } }">
            <div>{{ gradeConversion(schoolexamGrade) }}</div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          class-name="text-black"
          label="班级数"
          prop="schoolexamClassNum"
          width="90"
        />
        <el-table-column
          align="center"
          label="班级"
          prop="schoolexamClassNum"
        >
          <template #default="{ row: { schoolexamClasses } }">
            <div class="truncate">
              {{ schoolexamClasses?.join("&nbsp;&nbsp;&nbsp;&nbsp;") }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="学生人数"
          prop="schoolexamStudentNum"
          width="80"
        />
        <el-table-column
          align="center"
          label="男生"
          prop="schoolexamMaleNum"
          width="80"
        />
        <el-table-column
          align="center"
          label="女生"
          prop="schoolexamFemaleNum"
          width="80"
        />
        <el-table-column
          align="center"
          label="免测人数"
          prop="schoolexamTestfreeNum"
          width="90"
        />
        <el-table-column
          align="center"
          label="平均分"
          prop="schoolexamAvrScore"
          width="90"
        >
          <template #default="{ row }">
            {{ Number.parseInt(row?.schoolexamAvrScore ?? 0) }}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="操作"
          prop="address"
          width="220px"
        >
          <template #default="scope">
            <el-link
              :disabled="+new Date(scope.row.schoolexamDeadline) < +new Date() || !checkPermissions('update')"
              class="mr-4"
              type="primary"
              @click="openCreateDialog(false, scope.row)"
            >
              编辑
            </el-link>
            <el-link
              class="mr-4"
              type="primary"
              @click="toInfo(scope.row)"
            >
              详情
            </el-link>
            <el-link
              :disabled="!checkPermissions('delete')"
              type="primary"
              @click="deleteClassById(scope.row)"
            >
              删除
            </el-link>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="flex justify-between pt-5">
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
    :title="isCreate ? '新建体质测试' : '编辑体质测试'"
    center
  >
    <template #title>
      <h3
        v-if="isCreate"
        class="text-blue text-left"
      >
        <span class="iconfont icon-jiajianzujianjiahao pr-1.5" />
        <span class="text-black text-lg font-medium"> 新建体质测试 </span>
      </h3>
      <h3
        v-else
        class="text-left text-black text-lg font-medium"
      >
        编辑体质测试
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
        label="体测名称："
        prop="schoolexamName"
      >
        <el-input
          v-model="creatForm.schoolexamName"
          autocomplete="off"
        />
      </el-form-item>
      <el-form-item
        label="体测日期："
        prop="schoolexamDate"
      >
        <el-date-picker
          v-model="creatForm.schoolexamDate"
          class="w-full"
          placeholder="请选择体测日期"
          type="date"
        />
      </el-form-item>
      <el-form-item
        label="测试年级："
        prop="schoolexamGrade"
      >
        <el-select
          v-model="creatForm.schoolexamGrade"
          :disabled="!creatForm.schoolexamDate"
          class="w-full"
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
      </el-form-item>
      <el-form-item
        label="涵盖班级："
      >
        <span
          v-for="{ className } in classList"
          :key="className"
          class="mr-2"
        >{{ className }}</span>
      </el-form-item>
      <el-form-item
        label="录入截止时间："
        prop="schoolexamDeadline"
      >
        <el-date-picker
          v-model="creatForm.schoolexamDeadline"
          class="w-full"
          placeholder="请选择录入截止时间"
          type="date"
          :disabled="!creatForm.schoolexamDate"
          :disabled-date="disabledDate"
        />
      </el-form-item>
    </el-form>
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
import { reactive, ref } from "vue";
import SchoolSelect from "@/components/SchoolSelect/index.vue";
import dateFormat from "@/utils/dateFormat.js";
import type { ElForm } from "element-plus";
import { ElMessage, ElMessageBox } from "element-plus";
import { add, ExamList, examList, examListDelete, getClasses, update } from "@/api/physicalDataManagement";
import { filterGradeList, gradeConversion } from "@/utils/baseData";
import type { ExamListAddParams, ExamListAddResult } from "@/interface/examListAdd";
import rules from "@/utils/rules";
import type { BizUpdateSchoolexamParam } from "@/interface/examUpdate";
import { useRouter } from "vue-router";
import { pageSize, pageSizes } from "@/hooks/pagination";
import checkPermissions from "@/hooks/checkPermissions";
import { useStore } from "vuex";

type FormInstance = InstanceType<typeof ElForm>
const store = useStore();
const router = useRouter();
const formRef = ref<FormInstance>();
const dialogFormVisible = ref(false);
const schoolType = ref("");
const isCreate = ref(true);
const datePicker = ref([]);
const filterData: ExamList = reactive({
  fuzzyQuery: "",
  pageNum: 1,
  pageSize,
  schoolId: 1,
  schoolexamDate: "",
  schoolexamGrade: undefined
});

const changeDate = (dataArr: [string, string]) => {
  filterData.schoolexamDateMin = dataArr[0];
  filterData.schoolexamDateMax = dataArr[1];
};
let schoolexamId = ref(0);
const toInfo = (row: BizUpdateSchoolexamParam) => {
  store.commit("Exam/setExamDetails", row);
  schoolexamId.value = row.schoolexamId;
  router.push({ name: "examInfo", query: { schoolexamId: schoolexamId.value } });

};
const openCreateDialog = async (state: boolean, row: BizUpdateSchoolexamParam) => {
  debugger
  // console.log("sss",row.schoolexamClassNum)
  isCreate.value = state;
  dialogFormVisible.value = true;
  if (!state) {
    Object.keys(creatForm).forEach(key => {
      creatForm[key] = row[key];
    });
    schoolexamId.value = row.schoolexamId;
    await changeGrade(row.schoolexamGrade as number);
  } else {
    Object.keys(creatForm).forEach(key => {
      creatForm[key] = "";
    });
    creatForm.schoolexamSchoolId = filterData.schoolId;
    classList.value = [];
  }
};
let gradeList: any = ref([]);
let classList: any = ref([]);

let creatForm: ExamListAddParams = reactive({
  schoolexamDate: "",
  schoolexamSchoolId: undefined,
  schoolexamGrade: undefined,
  schoolexamName: "",
  schoolexamDeadline: ""
});
const changeGrade = (classGrade: number) => {
  debugger
  console.log("schoolexamDate", {
    classGrade, schoolId: filterData.schoolId, date: creatForm.schoolexamDate

  });
  getClasses({
    classGrade, schoolId: filterData.schoolId, date: creatForm.schoolexamDate

  }).then(({ data }: any) => {
    classList.value = data;
  }).catch((e: string) => {
    console.error(e);
  });
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
// watch(() => dialogFormVisible.value,(newValue) => {
//   if(newValue &&isCreate.value){
//     alert(newValue)
//     return  resetForm(formRef.value)}
// })
const creatClass = () => {
  if (!checkFormData()) return;
  console.log("新建班级", creatForm);
  const parameter = creatForm;
  debugger;
  add(parameter)
    .then((res: ExamListAddResult) => {
      debugger;
      console.log("添加", res.code);
      if (res.code === 200) {
        ElMessage({
          message: "添加成功.",
          type: "success"
        });
        dialogFormVisible.value = false;
        getEm();
        resetForm(formRef.value);
      }


    })
    .catch((e: object) => console.error(e));
};

function updateClassList() {
  if (!checkFormData()) return;
  const params = { ...creatForm, schoolexamId: schoolexamId.value };
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

function deleteClassById({ schoolexamId }: BizUpdateSchoolexamParam) {
  ElMessageBox.confirm("确定要删除所选体质测试", "Warning", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    examListDelete({ schoolexamId })
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
  examList(filterData).then((res: { data: any }) => {
    const { data } = res;
    tableData.pageNum = data.pageNum;
    tableData.list = data.list;
    tableData.total = data.total;
    console.log("学校列表", data, tableData);
  });
};

function getSchoolId(type: "小学" | "初中", id: number) {
  filterData.schoolId = id;
  // filterData.schoolexamGrade = (type === "小学") ? 1 : 2;
  creatForm.schoolexamSchoolId = id;
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

const disabledDate = (time: Date) => {
  return time.getTime() < +new Date(creatForm.schoolexamDate) + 1000 * 60 * 60 * 24;
};
</script>

<style></style>
