<template>
  <div class="p-8">
    <SchoolSelect @getSchool="getSchoolId" />
  </div>
  <div class="p-8">
    <div class="py-8 flex">
      <el-button
        :disabled="!creatForm.schoolexamSchoolId || !checkPermissions('add')"
        class="mr-5"
        type="text"
        @click="toAdd"
      >
        <span
          class="iconfont icon-jiajianzujianjiahao pr-1.5"
          :class="creatForm.schoolexamSchoolId? 'text-blue': ''"
        />

        <span class="text-black underline text-lg font">新建免测</span>
      </el-button>
      <div>
        <el-select
          v-model="filterClassData.classGrade"
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
          v-model="filterClassData.applicationDate"
          type="month"
          value-format="YYYY-MM"
          placeholder="请选择月份"
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
          v-model="filterClassData.fuzzyQuery"
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
          label="学生姓名"
          prop="freetestStudentName"
          show-overflow-tooltip
          width="120"
        />
        <el-table-column
          align="center"
          label="编号"
          prop="studentNumber"
          width="120"
        >
        </el-table-column>
        <el-table-column
          align="center"
          class-name="text-black"
          label="学籍号"
          prop="freetestStudentCode"
          show-overflow-tooltip
          width="220"
        />
        <el-table-column
          align="center"
          class-name="text-black"
          label="年级"
          prop="freetestClassGrade"
          width="90"
        >
          <template #default="{ row: { freetestClassGrade } }">
            <div>{{ gradeConversion(freetestClassGrade) }}</div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="班级"
          prop="freetestClassName"
        >
          <template #default="{ row: { freetestClassName } }">
            <div class="truncate">
              {{ freetestClassName }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="性别"
          prop="freetestStudentGender"
          width="90"
        />
        <el-table-column
          align="center"
          label="事由"
          prop="freetestReason"
          width="auto"
        />
        <el-table-column
          align="center"
          label="提交人"
          prop="freetestSubmitter"
          width="90"
        />
        <el-table-column
          align="center"
          class-name="text-black"
          label="申请日期"
          prop="freetestApplicationDate"
          width="220"
        >
          <template #default="scope">
            <div>{{ dateFormat(scope.row.freetestApplicationDate) }}</div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          class-name="text-black"
          label="有效期至"
          prop="freetestValidityDate"
          width="220"
        >
          <template #default="scope">
            <div>{{ dateFormat(scope.row.freetestValidityDate) }}</div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="提交人"
          prop="freetestSubmitter"
          width="90"
        />
        <el-table-column
          align="center"
          label="状态"
          prop="freetestState"
          width="90"
        >
        </el-table-column>
        <el-table-column
          align="center"
          label="申请表"
          prop="address"
          width="220px"
        >
          <template #default="{row: {freetestFile}}">
            <!--
                  <img :src="'data:image/png;base64,' + freetestFile">-->
            <div>
              <el-image
                style="width: 100px; height: 100px; z-index: auto"
                :src="'data:image/png;base64,' + freetestFile"
                :preview-src-list="['data:image/png;base64,' + freetestFile]"
                :initial-index="0"
                fit="cover"
              />
            </div>

            <!--            <el-link-->
            <!--              class="mr-4"-->
            <!--              type="primary"-->
            <!--              :disabled="!checkPermissions('update')"-->
            <!--              @click="openCreateDialog(false, scope.row)"-->
            <!--            >-->
            <!--              编辑-->
            <!--            </el-link>-->
            <!--            <el-link-->
            <!--              class="mr-4"-->
            <!--              type="primary"-->
            <!--              @click="toInfo(scope.row)"-->
            <!--            >-->
            <!--              详情-->
            <!--            </el-link>-->
            <!--            <el-link-->
            <!--              :disabled="!checkPermissions('delete')"-->
            <!--              type="primary"-->
            <!--              @click="deleteClassById(scope.row)"-->
            <!--            >-->
            <!--              删除-->
            <!--            </el-link>-->
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="flex justify-between pt-5">
      <el-pagination
        v-model:currentPage="filterClassData.pageNum"
        v-model:page-size="filterClassData.pageSize"
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
import dateFormat from "@/utils/dateFormat.js";
import { ElForm, ElMessage, ElMessageBox } from "element-plus";
import { add, list, update } from "@/api/freeTest";
import { filterGradeList, gradeConversion } from "@/utils/baseData";
import type { ExamListAddParams, ExamListAddResult } from "@/interface/examListAdd";
import type { BizUpdateSchoolexamParam } from "@/interface/examUpdate";
import { useRoute, useRouter } from "vue-router";
import { pageSize, pageSizes } from "@/hooks/pagination";
import { useStore } from "vuex";
import checkPermissions from "@/hooks/checkPermissions";

type FormInstance = InstanceType<typeof ElForm>

const router = useRouter();
const store = useStore();
const formRef = ref<FormInstance>();
const dialogFormVisible = ref(false);
const schoolType = ref("");
const isCreate = ref(true);
const datePicker = ref([]);
const filterClassData: any = reactive({
  fuzzyQuery: "",
  pageNum: 1,
  pageSize,
  schoolId: 1,
  schoolexamDateMax: undefined,
  schoolexamDateMin: undefined,
  applicationDate: undefined,
  classGrade: undefined
});
onActivated(() => {
  const route = useRoute();
  if (route.query.now) {
    getEm();
  }
});
const changeDate = (dataArr: [string, string]) => {
  filterClassData.schoolexamDateMin = dataArr[0];
  filterClassData.schoolexamDateMax = dataArr[1];
};
let schoolexamId = ref(0);
const toInfo = (row: BizUpdateSchoolexamParam) => {
  schoolexamId.value = row.schoolexamId;
  router.push({ name: "examInfo", query: { schoolexamId: schoolexamId.value } });

};
const toAdd = () => {
  store.commit("FreeTest/freetestSchoolId", creatForm.schoolexamSchoolId);
  router.push({ name: "addFreeTest" });
};
const openCreateDialog = (state: boolean, row: BizUpdateSchoolexamParam) => {
  debugger
  // console.log("sss",row.schoolexamClassNum)
  isCreate.value = state;
  dialogFormVisible.value = true;
  if (!state) {
    Object.keys(creatForm).forEach(key => {
      creatForm[key] = row[key];
    });
    schoolexamId.value = row.schoolexamId;
  }
};
let gradeList: any = ref([]);
let creatForm: ExamListAddParams = ref({
  schoolexamDate: "",
  schoolexamSchoolId: undefined,
  classGrade: undefined,
  schoolexamName: "",
  schoolexamDeadline: ""
}).value;

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
    // examListDelete({ schoolexamId })
    //   .then(() => {
    //     ElMessage({
    //       message: "删除成功.",
    //       type: "success"
    //     });
    //     getEm();
    //   })
    //   .catch(() => {
    //     ElMessage({
    //       message: "删除失败.",
    //       type: "error"
    //     });
    //     // console.log("删除错误信息", err);
    //   });
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
  list(filterClassData).then((res: { data: any }) => {
    const { data } = res;
    tableData.pageNum = data.pageNum;
    tableData.list = data.list;
    tableData.total = data.total;
    console.log("学校列表", data, tableData);
  });
};

function getSchoolId(type: "小学" | "初中", id: number) {
  filterClassData.schoolId = id;
  // filterClassData.classGrade = (type === "小学") ? 1 : 2;
  creatForm.schoolexamSchoolId = id;
  // creatForm.classType = type === "小学" ? 1 : 2;
  store.commit("FreeTest/schoolType", type);
  schoolType.value = type;
  gradeList.value = filterGradeList(type);
  getEm();
}

function handleSizeChange(size: number) {
  filterClassData.pageSize = size;
  getEm();
}

function handleCurrentChange(currentPage: number) {
  filterClassData.pageNum = currentPage;
  getEm();
  console.log("页吗改变", filterClassData);
}
</script>

<style>
.el-table .el-table__cell {

  z-index: auto;
}
</style>
