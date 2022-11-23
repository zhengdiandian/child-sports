<template>
  <div class="p-8">
    <h3 class="text-2xl">
      {{ $route.meta?.title }}
    </h3>
    <div class="py-8 flex">
      <div>
        <template v-if="teacherId">
          <el-select
            v-model="filterData.grade"
            class="mr-4"
            placeholder="请选择年级"
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
            v-model="filterData.classId"
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
        </template>

        <el-checkbox
          v-model="filterData.submit"
          :label="true"
        >
          已交作业
        </el-checkbox>
        <el-checkbox
          v-model="filterData.unSubmit"
          :label="true"
        >
          未交作业
        </el-checkbox>
        <el-checkbox
          v-model="filterData.commentary"
          :label="true"
        >
          已点评
        </el-checkbox>
        <el-checkbox
          v-model="filterData.noCommentary"
          :label="true"
        >
          未点评
        </el-checkbox>
        <el-checkbox
          v-model="filterData.isTestFree"
          :label="true"
        >
          免测
        </el-checkbox>
      </div>
      <div class="w-50 mx-4">
        <el-input
          v-model="filterData.keyword"
          placeholder="请输入查询内容"
        />
      </div>

      <el-button
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
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          align="center"
          type="selection"
          width="80"
          :selectable="selectable"
        />
        <el-table-column
          align="center"
          label="序号"
          type="index"
          width="80"
        />
        <el-table-column
          align="center"
          label="学生姓名"
          prop="studentName"
          width="120"
        >
        </el-table-column>
        <el-table-column
          align="center"
          label="编号"
          prop="studentNumber"
          width="120"
        >
        </el-table-column>
        <el-table-column
          align="center"
          label="性别"
          prop="studentGender"
          width="80"
        />
        <el-table-column
          align="center"
          label="作业视频"
          prop="homeworkVideo"
          width="90"
        >
          <template #default="{row:{homeworkVideo}}">
            {{ homeworkVideo ? "已提交" : "未提交" }}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          class-name="text-black"
          label="作业提交时间"
          prop="submitTime"
          width="220"
        >
          <template #default="{row:{submitTime}}">
            {{ submitTime ? dateFormat(submitTime) : "--" }}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          class-name="text-black"
          label="点评得分"
          prop="commentaryScore"
          width="90"
        >
          <template #default="{row:{commentaryScore}}">
            {{ commentaryScore ?? "--" }}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="点评内容"
          prop="commentary"
          width="auto"
        >
          <template #default="{row:{commentary}}">
            {{ commentary ?? "--" }}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="点评时间"
          prop="commentaryTime"
          width="220"
        >
          <template #default="{row:{commentaryTime}}">
            {{ commentaryTime ? dateFormat(commentaryTime) : "--" }}
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="220"
          align="center"
        >
          <template #default="{ row:{studentId} }">
            <el-button
              class="lg:text-base underline"
              size="large"
              :disabled="!checkPermissions('select')"
              type="text"
              @click="$router.push({name:'studentHomeWorkDetail', query:{studentId, homeworkId}})"
            >
              学生作业详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="flex justify-between pt-5">
      <el-button
        size="large"
        class="lg:text-base"
        type="warning"
        @click="exportStudentHomework(filterData)"
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
    <div
      v-if="checkPermissions('add')"
      class="px-52 mt-6"
    >
      <el-form
        ref="ruleFormRef"
        :model="creatForm"
        :rules="rules"
        label-width="auto"
        class="demo-ruleForm "
        :size="formSize"
        :inline="true"
      >
        <h1 class="pl-24 text-xl pb-4">
          已选中 <span class="text-blue text-3xl">{{ multipleSelection.length
          }}</span>人
        </h1>
        <el-form-item
          label="点评得分："
          prop="commentaryScore"
          class="w-18"
        >
          <el-input
            v-model.number="creatForm.commentaryScore"
            type="number"
            placeholder="请输入点评得分"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="点评内容："
          prop="commentary"
          class="w-full"
        >
          <el-input
            v-model.trim="creatForm.commentary"
            type="textarea"
            placeholder="请输入点评内容"
            :autosize="{ minRows: 8 }"
          ></el-input>
        </el-form-item>
        <el-form-item
          class="w-full"
        >
          <div class=" w-full flex justify-end mb-8 pr-10">
            <el-button
              v-loading="isLoading"
              :element-loading-text="'提交中...'"
              :disabled="isLoading || !multipleSelection.length"
              type="primary"
              class="w-36"
              @click="submitForm(ruleFormRef)"
            >
              批量点评
            </el-button>
          </div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from "vue";
import type { ElForm } from "element-plus";
import { gradeConversion } from "@/utils/baseData";
import { useRoute, useRouter } from "vue-router";
import { pageSize, pageSizes } from "@/hooks/pagination";
import { exportStudentHomework, listClass, reviewHomework, studentHomework } from "@/api/homeworkManagementController";
import { useStore } from "vuex";
import dateFormat from "@/utils/dateFormat.js";
import rules from "@/utils/rules";
import { ElMessage } from "element-plus/es";
import checkPermissions from "@/hooks/checkPermissions";

const ruleFormRef = ref<FormInstance>();

type FormInstance = InstanceType<typeof ElForm>
const formSize = ref("large");

const router = useRouter();
const { homeworkId } = useRoute().query;
// const homeworkId = 155;
const selectable = (row: any) => {
  return row?.homeworkVideo ? true : false;
};
const filterData: any = reactive({
  "classId": undefined,
  "commentary": false,
  "fuzzyQuery": "",
  "grade": undefined,
  "homeworkId": homeworkId,
  "isTestFree": false,
  "noCommentary": false,
  "pageNum": 1,
  "pageSize": pageSize,
  "submit": false,
  "unSubmit": false
});
const multipleSelection = ref<[]>([]);
const handleSelectionChange = (val: []) => {
  multipleSelection.value = val;
};
const teacherId = useStore().state.User?.userRoles?.teacherId;
let classGradeList: any = ref([]);
let classList: any = ref([]);
const classListFilter: any = ref([]);
(async () => {
  if (!teacherId) return;
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

let creatForm: any = ref({
  "commentary": "",
  "commentaryScore": undefined,
  homeworkId,
  "studentIds": []
}).value;
const isLoading = ref<boolean>(false);

const submitForm = (formEl: FormInstance | undefined, urlIndex = 0) => {
  if (!formEl) return;
  formEl.validate((valid: any) => {
    if (valid) {
      isLoading.value = true;
      const parameter = { ...creatForm };
      parameter.studentIds = multipleSelection.value.map((item: any) => (item.studentId));

      reviewHomework(parameter).then((res: any) => {
        if (res.code === 200) {
          ElMessage({
            message: "点评成功",
            type: "success"
          });
          resetForm(formEl);
          getList();
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
      });
      console.log("submit!");
    } else {
      console.error("error submit!");
      return false;
    }
  });
};

function checkFormData() {
  if (!ruleFormRef.value) return false;
  let isPass = true;
  ruleFormRef.value.validate((val: any) => {
    console.log("验证的值", val);
    isPass = val;
  });
  return isPass;
}

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};


const tableData = reactive({
  pageNum: 0,
  pageSize: 0,
  total: 0,
  totalPage: 1,
  list: []
});
const getList = () => {
  studentHomework(filterData).then((res: { data: any }) => {
    const { data } = res;
    tableData.pageNum = data.pageNum;
    tableData.list = data.list;
    tableData.total = data.total;
    console.log("学校列表", data, tableData);
  });
};
getList();


function handleSizeChange(size: number) {
  filterData.pageSize = size;
  getList();
}

function handleCurrentChange(currentPage: number) {
  filterData.pageNum = currentPage;
  getList();
  console.log("页吗改变", filterData);
}

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
