<template>
  <div class="p-8">
    <SchoolSelect @getSchool="getSchoolId" />
  </div>
  <div class="p-8">
    <div class="py-8 flex">
      <el-button
        type="text"
        class="mr-5"
        :disabled="!creatForm.classSchoolId || !checkPermissions('add')"
        @click="openCreateDialog(true)"
      >
        <span class="iconfont icon-jiajianzujianjiahao" />
        新建班级
      </el-button>
      <ClassSelect
        v-model:grade="filterClassData.classGrade"
        v-model:class-id="classId"
        v-model:school-id="filterClassData.schoolId"
        :school-type="schoolType"
        @changeGrade="(e)=>{filterClassData.classGrade = e}"
        @changeClass="changeClass"
      />
      <div class="w-50 mx-4">
        <el-input
          v-model="filterClassData.fuzzyQuery"
          placeholder="请输入查询内容"
        />
      </div>

      <el-button
        type="primary"
        :disabled="!creatForm.classSchoolId"
        @click="handleCurrentChange(1)"
      >
        搜索
      </el-button>
    </div>

    <div>
      <el-table
        class="w-full"
        :data="tableData.list"
        :border="true"
        :header-cell-style="{background:'#3470D0',color:'white'}"
      >
        <el-table-column
          align="center"
          prop="classId"
          label="序号"
          width="60"
        />
        <el-table-column
          align="center"
          prop="className"
          label="班级"
          min-width="120"
        />
        <el-table-column
          align="center"
          prop="classGrade"
          label="当前年级"
          width="90"
        />
        <el-table-column
          align="center"
          prop="classCode"
          label="班级编号"
        />
        <el-table-column
          align="center"
          prop="classYear"
          label="入学年份"
          width="90"
        >
          <template #default="scope">
            <div>{{ dateFormat(scope.row.classYear, "yyyy") }}</div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="classStudentNum"
          label="学生人数"
          width="90"
        />
        <el-table-column
          align="center"
          prop="classMaleNum"
          label="男生"
          width="60"
        />
        <el-table-column
          align="center"
          prop="classFemaleNum"
          label="女生"
          width="60"
        />
        <el-table-column
          align="center"
          prop="classTestfreeNum"
          label="免测人数"
          width="90"
        />
        <el-table-column
          align="center"
          prop="classPeTeacher"
          label="体育老师"
        />
        <el-table-column
          align="center"
          prop="classHeadTeacher"
          label="班主任"
        />
        <el-table-column
          align="center"
          prop="classRemark"
          label="备注"
        />
        <el-table-column
          align="center"
          prop="classUpdateTime"
          label="更新时间"
          width="110"
        >
          <template #default="scope">
            <div>{{ dateFormat(scope.row.classUpdateTime) }}</div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="address"
          label="操作"
          width="auto"
          min-width="100"
        >
          <template #default="scope">
            <el-link
              class="mr-4"
              type="primary"
              :disabled="!checkPermissions('update')"
              @click="openCreateDialog(false, scope.row)"
            >
              编辑
            </el-link>
            <el-link
              type="primary"
              :disabled="!checkPermissions('delete')"
              @click="deleteClassById(scope.row.classId)"
            >
              删除
            </el-link>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="flex justify-between pt-5">
      <ImportAndExportFile
        v-show="creatForm.classSchoolId"
        @exportData="exportClassData"
        @importData="importClassData"
        @downloadTemplate="downloadClassTemplate"
      />

      <el-pagination
        v-model:currentPage="filterClassData.pageNum"
        v-model:page-size="filterClassData.pageSize"
        :page-sizes="pageSizes"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tableData.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
  <el-dialog
    v-model="dialogFormVisible"
    :title="isCreate ? '新建班级' : '编辑班级'"
  >
    <el-form
      ref="formRef"
      :model="creatForm"
      :rules="rules"
    >
      <el-form-item
        label="班级名称："
        prop="className"
      >
        <el-input
          v-model="creatForm.className"
          autocomplete="off"
        />
      </el-form-item>
      <el-form-item
        label="入学年份："
        prop="classYear"
      >
        <el-date-picker
          v-model="classYear"
          type="year"
          placeholder="请选择入学年份"
          @change="changeYear"
        />
      </el-form-item>
      <el-form-item
        label="班级号："
        prop="classClass"
      >
        <el-input
          v-model="creatForm.classClass"
          autocomplete="off"
          type="number"
          class="w-20"
        />
      </el-form-item>
      <el-form-item label="班级编号：">
        <el-input
          v-model="creatForm.classCode"
          autocomplete="off"
        />
      </el-form-item>
      <el-form-item label="班主任：">
        <el-input
          v-model="creatForm.classHeadTeacher"
          autocomplete="off"
        />
      </el-form-item>
      <el-form-item label="备注：">
        <el-input v-model="creatForm.classRemark" />
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

<script setup lang="ts">
import {
  addClass,
  deleteClass,
  downloadClassTemplate,
  exportClass,
  getClassList,
  importClass,
  updateClass
} from "@/api/basicInfoManager";
import { reactive, ref } from "vue";
import SchoolSelect from "@/components/SchoolSelect/index.vue";
import dateFormat from "@/utils/dateFormat.js";
import type { ElForm } from "element-plus";
import { ElMessage, ElMessageBox } from "element-plus";
import checkPermissions from "@/hooks/checkPermissions";
import userHooks from "@/hooks/useHook";
import ClassSelect from "@/components/ClassSelect.vue";
import { pageSize, pageSizes } from "@/hooks/pagination";

type FormInstance = InstanceType<typeof ElForm>
const formRef = ref<FormInstance>();
const dialogFormVisible = ref(false);
const schoolType = ref(userHooks().schoolType);
const isCreate = ref(true);
const classYear: any = ref("");
const openCreateDialog = (state: boolean, row: any) => {
  isCreate.value = state;
  dialogFormVisible.value = true;
  if (!state) {
    Object.keys(row).forEach((key: any) => {
      creatForm[key] = row[key];
    });
    classYear.value = new Date(dateFormat(row.classYear));

    creatForm.classYear = +dateFormat(row.classYear, "yyyy");
    // creatForm.classCode = ''
    // creatForm.classHeadTeacher = ''
    // creatForm.className = ''
    // creatForm.classRemark = ''
    // creatForm.classId = row.classId
    // creatForm.classYear = ''
  } else {
    creatForm.classCode = "";
    creatForm.classHeadTeacher = "";
    creatForm.className = "";
    creatForm.classRemark = "";
    classYear.value = "";
    creatForm.classCode = "";
    creatForm.classClass = "";
    // creatForm.classYear = ''
  }
};

const creatForm: any = ref({
  classCode: "",
  classHeadTeacher: "",
  className: "",
  classRemark: "",
  classSchoolId: "",
  classYear: "",
  classType: 0,
  classClass: ""
}).value;
const rules = reactive({
  classClass: [{ required: true, message: "请输入班级号（例如：3班，请输入 3）", trigger: "blur" }],
  classYear: [{ required: true, message: "请选择年份", trigger: "change" }],
  className: [{ required: true, message: "请输入班级名称", trigger: "blur" }]

});

function changeYear(e) {
  creatForm.classYear = dateFormat(e, "yyyy");
}

function checkFormData() {
  if (!formRef.value) return false;
  let isPass: any = true;
  formRef.value.validate((val) => {
    console.log("验证的值", val);
    isPass = val;
  });
  return isPass;
}

const creatClass = () => {
  if (!checkFormData()) return;
  console.log("新建班级", creatForm);
  const parmeter = creatForm;
  addClass(parmeter).then((res: any) => {
    if (res.code === 200) {
      console.log("添加班级", res);
      ElMessage({
        message: "添加成功.",
        type: "success"
      });
      dialogFormVisible.value = false;
      getClasses();
    } else {
      ElMessage({
        message: "添加失败.",
        type: "error"
      });
    }


  }).catch(() => {
    ElMessage({
      message: "添加失败.",
      type: "error"
    });
  });
};

function updateClassList() {
  if (!checkFormData()) return;
  updateClass(creatForm)
    .then((res: any) => {
      if (res.code === 200) {
        ElMessage({
          message: "更新成功.",
          type: "success"
        });
        getClasses();
      } else {
        ElMessage({
          message: "更新失败.",
          type: "error"
        });
      }

    })
    .catch(() => {
      ElMessage({
        message: "更新失败.",
        type: "error"
      });
    });
  dialogFormVisible.value = false;
}

function deleteClassById(classId) {
  ElMessageBox.confirm("确定要删除所选班级?", "Warning", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  })
    .then(() => {
      deleteClass(classId)
        .then((res: any) => {
          if (res.code === 200) {
            ElMessage({
              message: "删除成功.",
              type: "success"
            });
            getClasses();
          } else {
            ElMessage({
              message: "删除失败.",
              type: "error"
            });
          }

        })
        .catch(() => {
          ElMessage({
            message: "删除失败.",
            type: "error"
          });
        });
    });
}

function importClassData(formData: any) {
  formData.append("schoolId", filterClassData.schoolId);
  importClass(formData).then((res: any) => {
    const { message, code } = res;
    if (code == 200) {
      getClasses();
      ElMessage.success(message);
    } else {
      ElMessage.error(message);
    }
    console.log("上传文件");
  });
}

function exportClassData() {
  const parmeter = {
    classGrade: filterClassData.classGrade,
    className: filterClassData.className,
    fuzzyQuery: filterClassData.fuzzyQuery,
    schoolId: filterClassData.schoolId
  };
  exportClass(parmeter);
}

const filterClassData = reactive({
  pageNum: 1,
  pageSize,
  schoolId: "",
  classGrade: "",
  fuzzyQuery: "",
  className: "",
  schoolType: undefined
});

const tableData = reactive({
  pageNum: 0,
  pageSize: 0,
  total: 0,
  totalPage: 1,
  list: []
});
const getClasses = () => {
  const parmeter = filterClassData;
  getClassList(parmeter).then((res) => {
    const { data } = res;
    tableData.pageNum = data.pageNum;
    tableData.list = data.list;
    tableData.total = data.total;
    console.log("学校列表", data, tableData);
  });
};

function getSchoolId(type, id) {
  filterClassData.schoolType = type;
  filterClassData.schoolId = id;
  creatForm.classSchoolId = id;
  creatForm.classType = type === "小学" ? 1 : 2;
  schoolType.value = type;
  getClasses();
}

function handleSizeChange(size: number) {
  filterClassData.pageSize = size;
  getClasses();
}

function handleCurrentChange(currentPage: number) {
  filterClassData.pageNum = currentPage;
  getClasses();
  console.log("页吗改变", filterClassData);
}

const classId = ref("");
const changeClass = (e) => {
  classId.value = e.class_id;
  filterClassData.className = e.class_name;
};
</script>

<style>
</style>
