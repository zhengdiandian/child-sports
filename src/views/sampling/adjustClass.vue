<template>
  <div class="wrapper">
    <div class=" wrapper bg-white">
      <h3 class="text-3xl mb-6">
        调整被测班
      </h3>
      <RandomTestInfoBar></RandomTestInfoBar>

      <div class="py-8 flex">
        <div class="w-50 mr-4">
          <el-input
            v-model="filterClassData.fuzzyQuery"
            placeholder="请输入查询内容"
          >
            <template #prefix>
              <el-icon class="el-input__icon">
                <Search />
              </el-icon>
            </template>
          </el-input>
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
            label="学校"
            prop="schoolName"
            show-overflow-tooltip
            width="auto"
          />
          <el-table-column
            align="center"
            class-name="text-black"
            label="年级"
            prop="freetestClassGrade"
            width="90"
          >
            <template #default="{ row: { grade } }">
              <div>{{ gradeConversion(grade) }}</div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="班级"
            prop="selectedClass"
            width="auto"
            overflow-tooltip
          >
            <template #default="{ row: { selectedClass } }">
              <div class="truncate">
                {{ selectedClass.map(item => item.className)?.join("，&nbsp;&nbsp;") }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="总人数"
            prop="studentNumber"
            width="120"
          >
            <template #default="{ row: { maleNum, femaleNum } }">
              <div>{{ femaleNum + maleNum }}</div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="男生人数"
            prop="maleNum"
            width="120"
          >
          </el-table-column>
          <el-table-column
            align="center"
            label="女生人数"
            prop="femaleNum"
            width="120"
          >
          </el-table-column>
          <el-table-column
            align="center"
            fixed="right"
            label="操作"
            width="auto"
            min-width="80"
          >
            <template #default="{row}">
              <el-button
                class="lg:text-base underline"
                type="text"
                size="default"
                @click="openCreateDialog(row)"
              >
                编辑
              </el-button>
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
  </div>

  <el-dialog
    v-model="dialogFormVisible"
    destroy-on-close
    title="調整班級"
    center
  >
    <template #title>
      <h3
        class="text-left text-black text-lg font-medium border-b-2 border-gray  pb-2 "
      >
        {{ classDetail.schoolName }}
      </h3>
    </template>
    <div class="w-3/4 m-auto">
      <el-form inline>
        <el-form-item
          label="年級:"
          class="w-full"
        >
          <div
            class="flex items-center w-full"
          >
            <el-select
              v-model="classId"
              class="flex-1"
            >
              <el-option
                v-for=" {classId,className} in classList"
                :key="classId"
                :label="className"
                :value="classId"
              ></el-option>
            </el-select>
            <el-button
              class="rounded border-blue  ml-4"
              @click="addClass"
            >
              <span
                class="iconfont icon-jiajianzujianjiahao pr-1.5 text-blue"
              />添加
            </el-button>
          </div>
        </el-form-item>
      </el-form>
      <el-table
        :data="classDetail.selectedClass"
        :header-cell-style="{ background: '#3470D0', color: 'white' }"
        border
      >
        <el-table-column
          label="年级"
          prop=""
        >
          <template #default="{ row: { grade } }">
            <div>{{ gradeConversion(grade) }}</div>
          </template>
        </el-table-column>
        <el-table-column
          label="班级"
          prop="className"
        ></el-table-column>
        <el-table-column
          align="center"
          fixed="right"
          label="操作"
          width="auto"
          min-width="80"
        >
          <template #default="{row,$index}">
            <el-button
              class="lg:text-base underline"
              type="text"
              size="default"
              @click="deleteClassById(row,$index)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <template #footer>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { onActivated, reactive, ref } from "vue";
import { ElForm, ElMessage, ElMessageBox } from "element-plus";
import { gradeConversion } from "@/utils/baseData";
import type { ExamListAddResult } from "@/interface/examListAdd";
import type { BizUpdateSchoolexamParam } from "@/interface/examUpdate";
import { useRoute, useRouter } from "vue-router";
import { pageSize, pageSizes } from "@/hooks/pagination";
import { useStore } from "vuex";
import {
  addRandomTestClass,
  delRandomTestClass,
  getRandomTestClassListByIdAndSchool,
  getSchoolList
} from "@/api/randomTest";
import RandomTestInfoBar from "@/views/sampling/components/RandomTestInfoBar.vue";
import { Search } from "@element-plus/icons-vue";

type FormInstance = InstanceType<typeof ElForm>
const route = useRoute();
const router = useRouter();
const store = useStore();
const formRef = ref<FormInstance>();
const dialogFormVisible = ref(false);
const schoolType = ref("");
const isCreate = ref(true);
const datePicker = ref([]);
let { randomtestId } = route.query;

const filterClassData: any = reactive({
  fuzzyQuery: "",
  pageNum: 1,
  pageSize,
  randomtestId
});
onActivated(() => {
  const route = useRoute();
  if (route.query.now) {
    getEm();
  }
});
const classDetail: any = ref({});
const classList = ref([]);
const classId = ref(null);
const openCreateDialog = async (row: BizUpdateSchoolexamParam) => {
  classDetail.value = row;
  const { data } = await getRandomTestClassListByIdAndSchool({ randomtestId, schoolId: row.schoolId });
  classList.value = data;
  dialogFormVisible.value = true;
};
const addClass = () => {
  if (!classId.value) return;
  debugger;
  const { schoolId } = classDetail.value;
  addRandomTestClass({ schoolId, classId: classId.value, randomtestId })
    .then((res: ExamListAddResult) => {
      if (res.code === 200) {
        console.log("添加", res.code);
        ElMessage({
          message: "添加成功.",
          type: "success"
        });
        dialogFormVisible.value = false;
        getEm();
      } else {
        ElMessage({
          message: "添加失败.",
          type: "error"
        });
      }


    })
    .catch((e: object) => console.error(e));
};

function deleteClassById({ className, classId, selectedClass, classSchoolId: schoolId }: any, $index: number) {
  ElMessageBox.confirm("确定要删除" + className, "Warning", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    delRandomTestClass({ randomtestId, classId, schoolId }).then(({ code }: any) => {
      if (code === 200) {
        ElMessage({
          message: "删除成功.",
          type: "success"
        });
        classDetail.value.selectedClass.splice($index, 1);
      } else {
        ElMessage({
          message: "删除失败.",
          type: "error"
        });
      }
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
  getSchoolList(filterClassData).then((res: { data: any }) => {
    const { data } = res;
    data.list.forEach((item: any) => {
      item.selectedClass.forEach((i: any) => {
        i.grade = item.grade;
      });
    });
    tableData.pageNum = data.pageNum;
    tableData.list = data.list;
    tableData.total = data.total;
    console.log("学校列表", data, tableData);
  });
};
getEm();

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
