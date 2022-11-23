<template>
  <!--  <div class="p-8">-->
  <!--    <SchoolSelect @getSchool="getSchoolId" />-->
  <!--  </div>-->
  <!--  <div class="h-4 bg-gray-100"></div>-->
  <div class="p-8">
    <div class="py-8 flex">
      <el-button
        class="mr-5"
        type="text"
        @click="importData"
      >
        <span
          class="iconfont icon-jiajianzujianjiahao pr-1.5"
          :class="creatForm.schoolexamSchoolId && checkPermissions('add')? 'text-blue': ''"
        />

        <span class="text-black underline text-lg font">新建国测导入</span>
      </el-button>
      <input
        v-show="false"
        id="fileInput"
        ref="fileInput"
        type="file"
        @change="fileChange"
      >
      <!--      <div>-->
      <!--        <el-select-->
      <!--          v-model="filterData.schoolexamGrade"-->
      <!--          class="mr-4"-->
      <!--          placeholder="请选择年级"-->
      <!--        >-->
      <!--          <template-->
      <!--            v-for="{ value, label } in gradeList"-->
      <!--            :key="value"-->
      <!--          >-->
      <!--            <el-option-->
      <!--              :label="label"-->
      <!--              :value="value"-->
      <!--            ></el-option>-->
      <!--          </template>-->
      <!--        </el-select>-->
      <!--        <el-date-picker-->
      <!--          v-model="filterData.schoolexamDate"-->
      <!--          type="month"-->
      <!--          placeholder="选择月份"-->
      <!--        />-->
      <!--        &lt;!&ndash;        <el-date-picker&ndash;&gt;-->
      <!--        &lt;!&ndash;          v-model="datePicker"&ndash;&gt;-->
      <!--        &lt;!&ndash;          end-placeholder="结束日期"&ndash;&gt;-->
      <!--        &lt;!&ndash;          range-separator="至"&ndash;&gt;-->
      <!--        &lt;!&ndash;          start-placeholder="开始日期"&ndash;&gt;-->
      <!--        &lt;!&ndash;          type="daterange"&ndash;&gt;-->
      <!--        &lt;!&ndash;          @change="changeDate"&ndash;&gt;-->
      <!--        &lt;!&ndash;        />&ndash;&gt;-->
      <!--      </div>-->
      <!--      <div class="w-50 mx-4">-->
      <!--        <el-input-->
      <!--          v-model="filterData.fuzzyQuery"-->
      <!--          placeholder="请输入查询内容"-->
      <!--        />-->
      <!--      </div>-->

      <!--      <el-button-->
      <!--        :disabled="-->
      <!--          !filterData.fuzzyQuery && !filterData.schoolexamGrade-->
      <!--        "-->
      <!--        type="primary"-->
      <!--        @click="handleCurrentChange(1)"-->
      <!--      >-->
      <!--        搜索-->
      <!--      </el-button>-->
    </div>

    <div>
      <el-table
        :border="true"
        :data="tableData.list"
        :header-cell-style="{ background: '#3470D0', color: 'white' }"
        class="w-full"
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
          label="文件名称"
          prop="fileName"
          show-overflow-tooltip
          width="auto"
        />
        <el-table-column
          align="center"
          class-name="text-black"
          label="导入数量"
          prop="importNumber"
          show-overflow-tooltip
          width="180px"
        />
        <el-table-column
          align="center"
          class-name="text-black"
          label="不存在数量"
          prop="noExistNumber"
          show-overflow-tooltip
          width="180px"
        />
        <el-table-column
          align="center"
          class-name="text-black"
          label="完全匹配数量"
          prop="matchNumber"
          show-overflow-tooltip
          width="180px"
        />
        <el-table-column
          align="center"
          class-name="text-black"
          label="未完全匹配数量"
          prop="noMatchNumber"
          show-overflow-tooltip
          width="180px"
        />
        <el-table-column
          align="center"
          class-name="text-black"
          label="上传日期"
          prop="createTime"
          width="120"
        >
          <template #default="scope">
            <div>{{ dateFormat(scope.row.createTime, "yyyy-mm-dd") }}</div>
          </template>
        </el-table-column>


        <el-table-column
          align="center"
          label="操作"
          prop="address"
          min-width="220px"
          width="auto"
        >
          <template #default="scope">
            <!--            <el-link-->
            <!--              :disabled="+new Date(scope.row.schoolexamDeadline) < +new Date() || !checkPermissions('update')"-->
            <!--              class="mr-4"-->
            <!--              type="primary"-->
            <!--              @click="openCreateDialog(false, scope.row)"-->
            <!--            >-->
            <!--              编辑-->
            <!--            </el-link>-->
            <el-link
              class="mr-4"
              type="primary"
              @click="openCreateDialog(true,scope.row)"
            >
              详情
            </el-link>
            <el-link
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
    center
    width="70%"
  >
    <template #title>
      <h3
        class="text-blue text-left"
      >
        <span class="iconfont icon-jiajianzujianjiahao pr-1.5" />
        <span class="text-black text-lg font-medium">{{ currentRow.fileName }}国测导出 </span>
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
        label="导出类型："
        prop="matchTypes"
      >
        <el-checkbox-group v-model="creatForm.matchTypes">
          <el-checkbox
            :label="1"
          >
            {{ `完全匹配（学籍号与姓名均匹配）共${DetailsData.allMatchNumber}条` }}
          </el-checkbox>
          <el-checkbox
            :label="2"
          >
            {{ `学籍号匹配（但姓名不匹配）共${DetailsData.noExistStudents.length}条` }}
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item
        label="学籍号匹配"
        prop="xxx"
      >
        <el-table
          :border="true"
          :data="DetailsData.noMatchStudents"
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
            label="班级名称"
            prop="className"
            width="auto"
          />
          <el-table-column
            align="center"
            label="学籍号"
            prop="studentCode"
            width="auto"
          />


          <el-table-column
            align="center"
            label="excel姓名"
            prop="studentName"
            width="auto"
          />
          <el-table-column
            align="center"
            label="系统中姓名"
            prop="sysStudentName"
            width="auto"
          />
        </el-table>
      </el-form-item>
      <el-form-item
        label="未匹配"
        prop="xxx"
      >
        <el-table
          :border="true"
          :data="DetailsData.noExistStudents"
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
            label="班级名称"
            prop="className"
            width="auto"
          />
          <el-table-column
            align="center"
            label="学籍号"
            prop="studentCode"
            width="auto"
          />


          <el-table-column
            align="center"
            label="excel姓名"
            prop="studentName"
            width="auto"
          />
          <el-table-column
            align="center"
            label="系统中姓名"
            prop="sysStudentName"
            width="auto"
          />
        </el-table>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button
          type="primary"
          @click="creatClass"
        >导出</el-button>

      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { reactive, ref } from "vue";
import dateFormat from "@/utils/dateFormat.js";
import type { ElForm } from "element-plus";
import { ElMessage, ElMessageBox } from "element-plus";
import {
  deleteRecord,
  importNationDataDetails,
  importNationDataList,
  importStudentExtendList,
  uploadStudentExtendList
} from "@/api/nationalTestData";
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
const filterData: any = reactive({
  pageNum: 1,
  pageSize

});
let DetailsData: any = ref({
  allMatchNumber: 0,
  noExistStudents: [],
  noMatchStudents: []

});
const fileInput: any = ref<null | HTMLInputElement>(null);

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
    importStudentExtendList(formData).then(async (res: { message: string, code: number }) => {
      fileInput.value.value = null;
      const { message, code } = res;
      if (code == 200) {
        // onSubmit();
        await getEm();
        await openCreateDialog(true, tableData.list[0]);
        ElMessage.success(message);
      } else {
        ElMessage.error(message);
      }
    }).catch(() => {
      fileInput.value.value = null;
    });
  }
};
const changeDate = (dataArr: [string, string]) => {
  filterData.schoolexamDateMin = dataArr[0];
  filterData.schoolexamDateMax = dataArr[1];
};
const currentRow: any = ref({});
const openCreateDialog = async (state: boolean, row: BizUpdateSchoolexamParam) => {

  creatForm.recordId = row.id;
  currentRow.value = row;
  await importNationDataDetails({ recordId: row.id }).then((res: any) => {
    DetailsData.value = res.data;
  });
  dialogFormVisible.value = true;

};
let gradeList: any = ref([]);
let classList: any = ref([]);

let creatForm: any = reactive({
  matchTypes: [],
  creatorId: undefined

});

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

const creatClass = () => {
  if (!checkFormData()) return;
  const parameter = creatForm;
  uploadStudentExtendList(parameter, currentRow.value.fileName + ".xlsx")
    .then(async (res: any) => {
      console.log("添加", res.code);
      if (res.code === 200) {
        ElMessage({
          message: "添加成功.",
          type: "success"
        });
        dialogFormVisible.value = false;
        resetForm(formRef.value);
      }


    })
    .catch((e: object) => console.error(e));
};


function deleteClassById({ id: recordId }: BizUpdateSchoolexamParam) {
  ElMessageBox.confirm("确定要删除所选国测导入", "Warning", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    deleteRecord({ recordId })
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
      });
  });
}

const tableData = reactive({
  pageNum: 0,
  pageSize: 0,
  total: 0,
  totalPage: 1,
  list: []
});
const getEm = () => {
  return importNationDataList(filterData).then((res: { data: any }) => {
    const { data } = res;
    tableData.pageNum = data.pageNum;
    tableData.list = data.list;
    tableData.total = data.total;
    console.log("学校列表", data, tableData);
  });
};
getEm();


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

<style></style>
