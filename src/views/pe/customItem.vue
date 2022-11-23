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
        @click="openCreateDialog(true)"
      >
        <span
          class="iconfont icon-jiajianzujianjiahao pr-1.5"
          :class="creatForm.projectSchoolId || checkPermissions('add') ? 'text-blue': ''"
        />

        <span class="text-black underline text-lg font">添加项目</span>
      </el-button>
      <div>
        <el-select
          v-model="filterData.grade"
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
          v-model="filterData.classId"
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
          v-model="filterData.teacherName"
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
        @click="getEm"
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
          prop="projectClassId"
          width="80"
        />
        <el-table-column
          align="center"
          class-name="text-black"
          label="年级"
          prop="classGrade"
          width="90"
        >
          <template #default="{ row: { classGrade } }">
            <div>{{ gradeConversion(classGrade) }}</div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          class-name="text-black"
          label="班级"
          prop="className"
          width="90"
        />

        <el-table-column
          align="center"
          class-name="text-black"
          label="班级人数"
          prop="studentNum"
          width="90"
        />
        <el-table-column
          align="center"
          class-name="text-black"
          label="体育老师"
          prop="classPeTeacher"
          width="90"
        />
        <el-table-column
          align="center"
          label="自定项目一"
          prop="projectNameOne"
          width="auto"
        >
        </el-table-column>
        <el-table-column
          align="center"
          label="单位"
          prop="projectUnitOne"
          width="auto"
        >
        </el-table-column>
        <el-table-column
          align="center"
          label="自定项目二"
          prop="projectNameTwo"
          width="auto"
        >
        </el-table-column>
        <el-table-column
          align="center"
          label="单位"
          prop="projectUnitTwo"
          width="auto"
        >
        </el-table-column>
        <el-table-column
          align="center"
          label="添加时间"
          prop="projectAddTime"
          width="auto"
        >
          <template #default="scope">
            <div>{{ dateFormat(scope.row.projectAddTime, "yyyy-mm-dd") }}</div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="截止时间"
          prop="projectDeadline"
          width="auto"
        >
          <template #default="scope">
            <div>{{ dateFormat(scope.row.projectDeadline, "yyyy-mm-dd") }}</div>
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          align="center"
          label="操作"
          prop="address"
          width="220px"
        >
          <template #default="scope">
            <el-link
              class="mr-4"
              type="primary"
              :disabled="!scope.row.state || !checkPermissions('update')"
              @click="openCreateDialog(false, scope.row)"
            >
              编辑
            </el-link>
            <el-link
              type="primary"
              :disabled="!checkPermissions('delete')"
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
    :title="isCreate ? '添加自定义项目' : '编辑自定义项目'"
    center
  >
    <template #title>
      <h3
        v-if="isCreate"
        class="text-blue text-left"
      >
        <span class="iconfont icon-jiajianzujianjiahao pr-1.5" />
        <span class="text-black text-lg font-medium"> 新建自定义项目 </span>
      </h3>
      <h3
        v-else
        class="text-left text-black text-lg font-medium"
      >
        编辑自定义项目
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
        label="年级："
        prop="classGrade"
      >
        <el-select
          v-model="creatForm.classGrade"
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
        label="班级："
        prop="className"
      >
        <el-select
          v-model="creatForm.className"
          class="w-full"
          placeholder="请选择班级"
          :disabled="!creatForm.classGrade"
        >
          <template
            v-for="{ className, classId } in classList"
            :key="classId"
          >
            <el-option
              :label="className"
              :value="className"
            ></el-option>
          </template>
        </el-select>
      </el-form-item>
      <!--      <el-form-item-->
      <!--        label="范围："-->
      <!--        prop="classGrade"-->
      <!--        :required="true"-->
      <!--      >-->
      <!--        <div class="w-full">-->
      <!--          <el-select-->
      <!--            v-model="creatForm.classGrade"-->
      <!--            class="w-auto mr-6"-->
      <!--            placeholder="请选择年级"-->
      <!--            @change="changeGrade"-->
      <!--          >-->
      <!--            <template-->
      <!--              v-for="{ value, label } in gradeList"-->
      <!--              :key="value"-->
      <!--            >-->
      <!--              <el-option-->
      <!--                :label="label"-->
      <!--                :value="value"-->
      <!--              ></el-option>-->
      <!--            </template>-->
      <!--          </el-select>-->
      <!--          <el-select-->
      <!--            v-model="creatForm.className"-->
      <!--            class="w-auto"-->
      <!--            placeholder="请选择班级"-->
      <!--            :disabled="!creatForm.classGrade"-->
      <!--          >-->
      <!--            <template-->
      <!--              v-for="{ className, classId } in classList"-->
      <!--              :key="classId"-->
      <!--            >-->
      <!--              <el-option-->
      <!--                :label="className"-->
      <!--                :value="classId"-->
      <!--              ></el-option>-->
      <!--            </template>-->
      <!--          </el-select>-->
      <!--        </div>-->
      <!--        <el-table-->
      <!--          :border="true"-->
      <!--          :data="addTableData"-->
      <!--          class="mt-4"-->
      <!--          :header-cell-style="{ background: '#3470D0', color: 'white' }"-->
      <!--        ></el-table>-->
      <!--      </el-form-item>-->
      <el-form-item
        label="自定项目一："
        prop="projectNameOne"
      >
        <el-input
          v-model="creatForm.projectNameOne"
          class="w-full date-picker"
        />
      </el-form-item>
      <el-form-item
        label="单位："
        prop="projectUnitOne"
      >
        <el-input
          v-model="creatForm.projectUnitOne"
          class="w-full date-picker"
        />
      </el-form-item>
      <el-form-item
        label="自定项目二："
        prop="projectNameTwo"
      >
        <el-input
          v-model="creatForm.projectNameTwo"
          class="w-full date-picker"
        />
      </el-form-item>
      <el-form-item
        label="单位："
        prop="projectUnitTwo"
      >
        <el-input
          v-model="creatForm.projectUnitTwo"
          class="w-full date-picker"
        />
      </el-form-item>
      <el-form-item
        label="截止时间："
        prop="projectDeadline"
      >
        <el-date-picker
          v-model="creatForm.projectDeadline"
          class="w-full date-picker"
          type="date"
          :disabled-date="disabledStartDate"
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
import type { ElForm } from "element-plus";
import { ElMessage, ElMessageBox } from "element-plus";
import { add, customProjectDelete, list, listClasses, listTeacher, peListExport, update } from "@/api/customItem";
import { filterGradeList, gradeConversion } from "@/utils/baseData";
import type { ExamListAddResult } from "@/interface/examListAdd";
import rules from "@/utils/rules";
import type { BizUpdateSchoolexamParam } from "@/interface/examUpdate";
import { useRouter } from "vue-router";
import { pageSize, pageSizes } from "@/hooks/pagination";
import dateFormat from "@/utils/dateFormat.js";
import { ICreatForm, IFilterData } from "@/interface/customItem";
import checkPermissions from "@/hooks/checkPermissions";

type FormInstance = InstanceType<typeof ElForm>
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
const filterData: IFilterData = reactive({
  fuzzyQuery: "",
  pageNum: 1,
  pageSize,
  schoolId: 1,
  grade: "",
  classId: undefined,
  teacherName: undefined
});
const changeDate = (dataArr: [string, string]) => {
  filterData.dailytestDateBegin = dataArr[0];
  filterData.dailytestDateEnd = dataArr[1];
};
let projectId = ref(0);
const openCreateDialog = async (state: boolean, row: BizUpdateSchoolexamParam) => {
  const keys = Object.keys(creatForm);
  if (!state) {
    keys.forEach(key => {
      creatForm[key] = row[key];
    });
    projectId.value = row.projectId;
    // await getProject();


    await changeGrade((creatForm.classGrade as number));
    creatForm.className = classList.value.find((({ className }: any) => className === row.className))?.className;
  } else {
    // creatForm = {
    //   "classGrade": undefined,
    //   "className": "",
    //   "projectClassId": undefined,
    //   "projectDeadline": "",
    //   "projectNameOne": "",
    //   "projectNameTwo": "",
    //   "projectSchoolId": 0,
    //   "projectUnitOne": "",
    //   "projectUnitTwo": ""
    // };
    keys.forEach(key => {
      creatForm[key] = "";
    });
    creatForm.projectSchoolId = filterData.schoolId;
  }
  // console.log("sss",row.dailytestClassNum)
  isCreate.value = state;
  dialogFormVisible.value = true;

};
let gradeList: any = ref([]);
let classList: any = ref([]);

let creatForm: ICreatForm = ref({
  "classGrade": undefined,
  "className": "",
  "projectClassId": undefined,
  "projectDeadline": "",
  "projectNameOne": "",
  "projectNameTwo": undefined,
  "projectSchoolId": 0,
  "projectUnitOne": "",
  "projectUnitTwo": undefined
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
  if (!!creatForm.projectUnitTwo !== !!creatForm.projectNameTwo) {
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
const creatClass = () => {
  if (!checkFormData()) return;
  const parameter = creatForm;
  debugger;
  add({
    ...parameter,
    projectClassId: classList.value.find((({ className }: any) => className === creatForm.className))?.classId
  })
    .then((res: ExamListAddResult) => {
      if (res.code === 200) {
        console.log("添加", res.code);
        ElMessage({
          message: "添加成功.",
          type: "success"
        });
        dialogFormVisible.value = false;
        getEm();
        resetForm(formRef.value);
      } else {
        ElMessage({
          message: "添加失败.",
          type: "error"
        });
      }

    })
    .catch((e: object) => console.error(e));
};

function updateClassList() {
  if (!checkFormData()) return;
  const params = { ...creatForm, projectId: projectId.value };
  update(params)
    .then((res: any) => {
      if (res.code === 200) {
        ElMessage({
          message: "更新成功.",
          type: "success"
        });
        getEm();
        return resetForm(formRef.value);
      }
      return ElMessage({
        message: "更新失败.",
        type: "error"
      });
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

function deletePe({ projectId }: any) {
  ElMessageBox.confirm("确定要删除所选自定义项目", "Warning", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    customProjectDelete({ projectId })
      .then((res: any) => {
        if (res.code === 200) {
          res.code;

          ElMessage({
            message: "删除成功.",
            type: "success"
          });
          return getEm();
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
const getEm = () => {
  list(filterData).then((res: { data: any }) => {
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
  getEm();
  await listTeacher({ schoolId: id }).then(res => {
    teacherList.value = res.data;
  });
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
