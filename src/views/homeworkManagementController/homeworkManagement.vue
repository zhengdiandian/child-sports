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
          type="index"
          width="80"
        />
        <el-table-column
          align="center"
          label="发布日期"
          prop="homeworkDate"
          width="120"
        >
          <template #default="scope">
            <div>{{ dateFormat(scope.row.homeworkDate, "yyyy-mm-dd") }}</div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="结束日期"
          prop="homeworkDeadline"
          width="120"
        >
          <template #default="scope">
            <div>{{ dateFormat(scope.row.homeworkDeadline, "yyyy-mm-dd") }}</div>
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
          label="作业项目"
          prop="homeworkProject"
          width="auto"
        >
          <template #default="{ row: {homeworkProject}}">
            {{ (homeworkProject)?.toString() ?? "" }}
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
          label="未交作业"
          prop="unSubmittedNum"
          width="90"
        />
        <el-table-column
          align="center"
          label="已交作业"
          prop="submittedNum"
          width="90"
        />

        <el-table-column
          align="center"
          class-name="text-black"
          label="未点评"
          prop="noCommentaryNum"
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
          align="center"
          label="作业状态"
          prop="homeworkState"
          width="90"
        >
        </el-table-column>
        <el-table-column
          fixed="right"
          align="center"
          label="操作"
          prop="address"
          width="260px"
        >
          <template #default="{row:{homeworkId}}">
            <el-link
              class="mr-4"
              type="primary"
              :disabled="!checkPermissions('select')"
              @click="$router.push({name: 'classHomeWorkDetail', query:{homeworkId}})"
            >
              班级作业详情
            </el-link>
            <el-link
              class="mr-4"
              type="primary"
              :disabled="!checkPermissions('select')"
              @click="$router.push({name: 'studentHomeWorkCompletion', query:{homeworkId}})"
            >
              学生完成情况
            </el-link>
            <el-link
              type="primary"
              :disabled="!checkPermissions('select')"
              @click="deleteHomeworkHandle(homeworkId)"
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
        @click="homeworkExport(filterData)"
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
import { reactive, ref } from "vue";
import SchoolSelect from "@/components/SchoolSelect/index.vue";
import { listClasses } from "@/api/customItem";
import { deleteHomework, homeworkExport, list, listTeacher } from "@/api/homeworkManagementController";
import { filterGradeList, gradeConversion } from "@/utils/baseData";
import { useRouter } from "vue-router";
import { pageSize, pageSizes } from "@/hooks/pagination";
import dateFormat from "@/utils/dateFormat.js";
import { ICreatForm } from "@/interface/customItem";
import checkPermissions from "@/hooks/checkPermissions";
import { ElMessage, ElMessageBox } from "element-plus";

const teacherList = ref([]);
const deleteHomeworkHandle = (id: number) => {
  ElMessageBox.confirm("确定要删除所选作业", "Warning", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    deleteHomework(id).then(({ code }: any) => {
      if (code === 200) {
        ElMessage.success("删除成功");
        getEm();
      } else {
        ElMessage.error("删除失败");
      }
    });
  });
  // .catch(() => {});
};

const router = useRouter();
const schoolType = ref("");
const filterData: any = reactive({
  fuzzyQuery: "",
  pageNum: 1,
  pageSize,
  schoolId: 1,
  homeworkGrade: undefined,
  className: undefined,
  peTeacher: undefined,
  homeworkDateBegin: undefined,
  homeworkDateEnd: undefined
});
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
</script>

<style lang="scss" scoped>

</style>
