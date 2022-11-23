<template>
  <div class="p-8 ">
    <SchoolSelect
      v-model:province-code="filterData.schoolProvinceCode"
      v-model:city-code="filterData.schoolCityCode"
      v-model:district-code="filterData.schoolDistrictCode"
      @getSchool="getSchoolId"
    />
  </div>
  <div class="h-4 bg-gray-100"></div>
  <div class="p-8">
    <div class="py-8 flex">
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
            v-for="{ class_id, class_name } in classList"
            :key="class_id"
          >
            <el-option
              :label="class_name"
              :value="class_id"
            ></el-option>
          </template>
        </el-select>
        <el-checkbox
          v-model="filterData.isMale"
          :label="true"
        >
          男
        </el-checkbox>
        <el-checkbox
          v-model="filterData.isFemale"
          :label="true"
        >
          女
        </el-checkbox>
        <el-checkbox
          v-model="filterData.isTestFree"
          :label="true"
        >
          免测
        </el-checkbox>
        <el-checkbox
          v-model="filterData.isRead"
          :label="true"
        >
          在读
        </el-checkbox>
        <el-checkbox
          v-model="filterData.isRustication"
          :label="true"
        >
          停学
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
      >
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
          label="班级名称"
          prop="dailytestClassName"
          width="160"
        />
        <el-table-column
          align="center"
          label="当前年级"
          prop="gradeName"
          width="90"
        >
        </el-table-column>
        <el-table-column
          align="center"
          class-name="text-black"
          label="性别"
          prop="gender"
          width="90"
        />
        <el-table-column
          align="center"
          class-name="text-black"
          label="在读状态"
          prop="state"
          width="90"
        />
        <el-table-column
          align="center"
          label="今年是否免测"
          prop="testFree"
          width="120"
        >
        </el-table-column>
        <el-table-column
          align="center"
          label="昨日作业情况"
          prop="dailytestStudentTotalnum"
          width="auto"
        >
          <template #default="{row:{studentId,yesterdayWork, homeworkId}}">
            {{ yesterdayWork }}
            <el-button
              v-if="homeworkId"
              type="text"
              @click="$router.push({name:'studentHomeWorkDetail',query:{studentId}})"
            >
              查看
            </el-button>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="体育课情况"
          prop="dailytestStudentTotalnum"
          width="auto"
        >
          <template #default="{row:{studentId}}">
            <el-button
              type="text"
              @click="$router.push({name:'studentDetail', query:{studentId}})"
            >
              查看
            </el-button>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="体测成绩"
          prop="dailytestStudentTotalnum"
          width="auto"
        >
          <template #default="{row:{studentId, testScore}}">
            {{ testScore }}
            <el-button
              type="text"
              @click="$router.push({name:'examStudentDetail', query:{studentId}})"
            >
              查看
            </el-button>
          </template>
        </el-table-column>
        <!--        <el-table-column-->
        <!--          align="center"-->
        <!--          label="综合素质评价"-->
        <!--          prop="dailytestStudentTotalnum"-->
        <!--          width="auto"-->
        <!--        >-->
        <!--          <template #default="{row}">-->
        <!--            <el-button type="text">-->
        <!--              查看-->
        <!--            </el-button>-->
        <!--          </template>-->
        <!--        </el-table-column>-->
        <el-table-column
          align="center"
          label="自定目标"
          prop="dailytestStudentTotalnum"
          width="auto"
        >
          <template #default="{row:{studentId}}">
            <el-button
              type="text"
              @click="router.push({name: 'studentInfoDetail',query:{studentId: studentId}})"
            >
              查看
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
        @click="doStudentExport(filterData)"
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
import { reactive, ref, watch } from "vue";
import SchoolSelect from "@/components/SchoolSelect/index.vue";
import type { ElForm } from "element-plus";
import { doStudentExport, query } from "@/api/doStudent";
import { filterGradeList } from "@/utils/baseData";
import type { BizUpdateSchoolexamParam } from "@/interface/examUpdate";
import { useRouter } from "vue-router";
import { pageSize, pageSizes } from "@/hooks/pagination";
import { IQuery } from "@/interface/doStudent";
import { getAllClassNames } from "@/api/index";

type FormInstance = InstanceType<typeof ElForm>
// const changeGrade = (grade:number) => {
//   getAllClassNames({ classGrade: grade, schoolId: filterData.schoolId });
// };
const router = useRouter();
const formRef = ref<FormInstance>();
const dialogFormVisible = ref(false);
const schoolType = ref("");
const isCreate = ref(true);
const filterData: IQuery = reactive({
  "classId": undefined,
  "grade": undefined,
  "isFemale": true,
  "isMale": true,
  "isRead": true,
  "isRustication": true,
  "isTestFree": true,
  "keyword": "",
  "pageNum": 1,
  "pageSize": pageSize,
  "schoolCityCode": 0,
  "schoolDistrictCode": 0,
  "schoolId": 0,
  "schoolProvinceCode": 0,
  "schoolType": ""
});
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
const changeGrade = async (classGrade: number) => {
  filterData.classId = undefined;
  classList.value = [];

  await getAllClassNames({
    classGrade, schoolId: filterData.schoolId, date: creatForm.dailytestDate, examType: 1

  }).then(({ data }: any) => {
    classList.value = data;
  }).catch((e: string) => {
    console.error(e);
  });
};

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
};

const tableData = reactive({
  pageNum: 0,
  pageSize: 0,
  total: 0,
  totalPage: 1,
  list: []
});
const getEm = () => {
  query(filterData).then((res: { data: any }) => {
    const { data } = res;
    tableData.pageNum = data.current;
    tableData.list = data.records;
    tableData.total = data.total;
    console.log("学校列表", data, tableData);
  });
};

function getSchoolId(type: "小学" | "初中", id: number) {
  filterData.schoolId = id;
  // filterData.dailytestGrade = (type === "小学") ? 1 : 2;
  creatForm.dailytestSchoolId = id;
  // creatForm.classType = type === "小学" ? 1 : 2;
  filterData.schoolType = schoolType.value = type;
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
