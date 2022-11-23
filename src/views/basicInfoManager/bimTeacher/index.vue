<template>
  <div class="p-8">
    <SchoolSelect @getSchool="getSchoolId" />
  </div>
  <div class="p-8">
    <div>
      <el-button
        :disabled="!filterTeacherData.schoolId || !checkPermissions('add')"
        type="text"
        @click="openCreateDialog(true)"
      >
        <span class="iconfont icon-jiajianzujianjiahao" />
        添加教职人员
      </el-button>
    </div>
    <div>
      <el-form
        v-model="filterTeacherData"
        class="flex flex-wrap"
      >
        <el-form-item class="mr-5">
          <ClassSelect
            v-model:grade="filterTeacherData.classGrade"
            v-model:school-id="filterTeacherData.schoolId"
            :showitems="['grade']"
            :school-type="schoolType"
          />
        </el-form-item>
        <el-form-item
          label="性别："
          class="mr-5"
        >
          <el-radio-group
            v-model="filterTeacherData.teacherGender"
            size="“small”"
          >
            <el-radio label="">
              全部
            </el-radio>
            <el-radio label="男">
              男
            </el-radio>
            <el-radio label="女">
              女
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="职称："
          class="mr-5"
        >
          <el-radio-group
            v-model="filterTeacherData.teacherRank"
            size="“small”"
          >
            <el-radio label="">
              全部
            </el-radio>
            <el-radio :label="1">
              普通
            </el-radio>
            <el-radio :label="2">
              中级
            </el-radio>
            <el-radio :label="3">
              高级
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="在岗状态："
          class="mr-5"
        >
          <el-radio-group
            v-model="filterTeacherData.teacherState"
            size="“small”"
          >
            <el-radio label="">
              全部
            </el-radio>
            <el-radio :label="1">
              在岗
            </el-radio>
            <el-radio :label="2">
              停岗
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="激活状态："
          class="mr-5"
        >
          <el-radio-group
            v-model="filterTeacherData.teacherAppState"
            size="“small”"
          >
            <el-radio label="">
              全部
            </el-radio>
            <el-radio :label="1">
              已激活
            </el-radio>
            <el-radio :label="2">
              未激活
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item class="mr-5">
          <el-input
            v-model="filterTeacherData.fuzzyQuery"
            placeholder="请输入查询内容"
          />
        </el-form-item>
        <el-button
          type="primary"
          :disabled="!creatForm.teacherSchoolId"
          @click="handleCurrentChange(1)"
        >
          搜索
        </el-button>
      </el-form>
    </div>

    <div>
      <el-table
        :data="tableData.list"
        :border="true"
        :header-cell-style="{background:'#3470D0',color:'white'}"
      >
        <el-table-column
          align="center"
          prop="teacherId"
          label="序号"
          width="60"
        />
        <el-table-column
          align="center"
          prop="teacherCode"
          label="教职工号"
          width="90"
        />
        <el-table-column
          align="center"
          prop="teacherType"
          label="教职类别"
          width="90"
        />
        <el-table-column
          align="center"
          prop="teacherRank"
          label="职级"
          width="60"
        />
        <el-table-column
          align="center"
          prop="teacherName"
          label="教职姓名"
          width="90"
        />
        <el-table-column
          align="center"
          prop="teacherGender"
          label="性别"
          width="60"
        />
        <el-table-column
          align="center"
          prop="teacherIdentity"
          label="身份证号"
          width="auto"
        />
        <el-table-column
          align="center"
          prop="teacherBirthday"
          label="出生日期"
          width="120"
        >
          <template #default="{row: {teacherBirthday}}">
            {{ dateFormat(teacherBirthday, "yyyy-mm-dd") }}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="teacherAge"
          label="年龄"
          width="60"
        />
        <el-table-column
          align="center"
          prop="teacherNationality"
          label="民族"
          width="60"
        />
        <el-table-column
          align="center"
          prop="teacherPhone"
          label="手机号"
          width="120"
        />
        <el-table-column
          align="center"
          prop="teacherClass"
          label="负责班级"
          width="180"
        >
          <template #default="scope">
            <div
              v-for="item in scope.row.teacherClass"
              :key="item"
            >
              {{ item.className }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="teacherState"
          label="在岗状态"
          width="90"
        >
          <template #default="scope">
            <div>
              {{ scope.row.teacherState ? "在岗" : "停岗" }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="teacherAppState"
          label="app激活状态"
          width="160"
        />
        <el-table-column
          align="center"
          prop="teacherIntroduction"
          label="简介"
          show-overflow-tooltip
          width="220"
        />
        <el-table-column
          align="center"
          prop="address"
          label="操作"
          fixed="right"
          width="200"
        >
          <template #default="scope">
            <el-link
              class="mr-4"
              type="primary"
              :disabled="!checkPermissions('update')"
              @click="setState(scope.row.teacherId,scope.row.teacherState)"
            >
              {{ scope.row.teacherState ? "停岗" : "在岗" }}
            </el-link>
            <el-link
              class="mr-4"
              :disabled="!checkPermissions('update')"
              type="primary"
              @click="openCreateDialog(false, scope.row)"
            >
              编辑
            </el-link>
            <el-link
              type="primary"
              :disabled="!checkPermissions('delete')"
              @click="deleteTeacherById(scope.row.teacherId)"
            >
              删除
            </el-link>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="flex justify-between pt-5">
      <ImportAndExportFile
        v-show="creatForm.teacherSchoolId"
        @exportData="exportTeacherList"
        @importData="importTeacherData"
        @downloadTemplate="downloadTeacherTemplate"
      />

      <el-pagination
        v-model:currentPage="filterTeacherData.pageNum"
        v-model:page-size="filterTeacherData.pageSize"
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
    :title="isCreate ? '添加教职人员' : '编辑教职人员'"
  >
    <el-form
      ref="formRef"
      :model="creatForm"
      :rules="rules"
    >
      <el-form-item
        label="教职工号："
        prop="teacherCode"
      >
        <el-input
          v-model="creatForm.teacherCode"
          autocomplete="off"
        />
      </el-form-item>
      <el-form-item
        label="教职姓名："
        prop="teacherName"
      >
        <el-input
          v-model="creatForm.teacherName"
          autocomplete="off"
        />
      </el-form-item>
      <el-form-item
        label="手机号："
        prop="teacherPhone"
      >
        <el-input
          v-model="creatForm.teacherPhone"
          autocomplete="off"
        />
      </el-form-item>
      <el-form-item
        label="在岗状态："
        prop="teacherState"
      >
        <el-radio-group
          v-model="creatForm.teacherState"
          size="“small”"
        >
          <el-radio :label="true">
            在岗
          </el-radio>
          <el-radio :label="false">
            停岗
          </el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item
        label="身份证号："
        prop="teacherIdentity"
      >
        <el-input
          v-model="creatForm.teacherIdentity"
          autocomplete="off"
        />
      </el-form-item>
      <el-form-item
        label="职级："
        prop="teacherRank"
      >
        <el-radio-group
          v-model="creatForm.teacherRank"
          size="“small”"
        >
          <el-radio label="普通">
            普通
          </el-radio>
          <el-radio label="中级">
            中级
          </el-radio>
          <el-radio label="高级">
            高级
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        class="mr-5"
        label="民族："
        prop="teacherNationality"
      >
        <el-select
          v-model="creatForm.teacherNationality"
          placeholder="请选择民族"
        >
          <el-option
            v-for="item in national"
            :key="item.id"
            :label="item.name"
            :value="item.name"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="简介："
        prop="teacherIntroduction"
      >
        <el-input
          v-model="creatForm.teacherIntroduction"
          :autosize="{ minRows: 2, maxRows: 4 }"
          type="textarea"
          placeholder="请输入简介"
        />
      </el-form-item>
      <el-form-item
        label="管理班级："
        prop="teacherClasses"
      >
        <ClassSelect
          v-model:grade="creatGrade"
          :class-id="creatClass.id"
          :school-id="filterTeacherData.schoolId"
          :school-type="schoolType"
          @changeClass="(e) => creatClass = e "
        />
        <el-button
          class="ml-5"
          type="primary"
          @click="addTeacherClass"
        >
          添加
        </el-button>
      </el-form-item>
      <el-table
        :data="teacherClasses"
        :border="true"
      >
        <el-table-column
          align="center"
          prop="grade"
          label="年级"
        >
          <template #default="{row:{grade}}">
            {{ gradeConversion(grade) }}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="name"
          label="班级"
        />
        <el-table-column
          align="center"
          prop="address"
          label="操作"
        >
          <template #default="scope">
            <el-link
              type="primary"
              @click="deleteTeacherClass(scope.$index)"
            >
              删除
            </el-link>
          </template>
        </el-table-column>
      </el-table>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button
          v-if="isCreate"
          type="primary"
          @click="creatTeacher"
        >保存</el-button>
        <el-button
          v-else
          type="primary"
          @click="updateTeacherList"
        >保存</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import {
  addTeacher,
  deleteTeacher,
  downloadTeacherTemplate,
  exportTeacher,
  getTeacherList,
  importTeacher,
  setStateTeacher,
  updateTeacher
} from "@/api/basicInfoManager.ts";
import { reactive, ref } from "vue";
import SchoolSelect from "@/components/SchoolSelect/index.vue";
import ClassSelect from "@/components/ClassSelect.vue";
import ImportAndExportFile from "@/components/ImportAndExportFile/index.vue";
import national from "@/utils/national.js";
import type { ElForm } from "element-plus";
import { ElMessage, ElMessageBox } from "element-plus";
import dateFormat from "@/utils/dateFormat.js";
import { gradeConversion } from "@/utils/baseData.ts";
import checkPermissions from "@/hooks/checkPermissions";
import { pageSize, pageSizes } from "@/hooks/pagination";

type FormInstance = InstanceType<typeof ElForm>

const formRef = ref<FormInstance>();
const dialogFormVisible = ref(false);
const isCreate = ref(true);
const schoolType = ref("");
let teacherClasses = ref([]);


const creatGrade = ref("");
const creatClass = ref("");

function addTeacherClass() {
  if (creatGrade.value && creatClass.value) {
    teacherClasses.value.push({
      grade: creatGrade.value,
      id: creatClass.value.id,
      name: creatClass.value.name
    });
  }
}

function deleteTeacherClass(index: number) {
  teacherClasses.value.splice(index, 1);
  // teacherClasses.value = teacherClasses.value.filter(item => {
  //   return item.classId !== classId;
  // });

}

const creatForm: any = reactive({
  classGrades: [],
  classIds: [],
  classNames: [],
  teacherCode: "",
  teacherIdentity: "",
  teacherIntroduction: "",
  teacherName: "",
  teacherNationality: "",
  teacherPhone: "",
  teacherRank: "",
  teacherSchoolId: "",
  teacherState: true,
  teacherType: ""
});
const openCreateDialog = (state, row) => {
  isCreate.value = state;
  dialogFormVisible.value = true;
  if (!state) {
    Object.keys(row).forEach(key => {
      creatForm[key] = row[key];
    });
    teacherClasses.value = Object.keys(row.teacherClass).map(key => {
      let obj: any = {};
      obj.id = key;
      obj.name = row.teacherClass[key].className;
      obj.grade = row.teacherClass[key].classGrade;
      return obj;
    });
    creatForm.teacherNationality = national.find(item => {
      return item.name.includes(row.teacherNationality);
    })?.id ?? "";
    // creatForm.classCode = ''
    // creatForm.classHeadTeacher = ''
    // creatForm.className = ''
    // creatForm.classRemark = ''
    // creatForm.classId = row.classId
    // creatForm.classYear = ''
  } else {
    Object.keys(creatForm).forEach(key => {
      creatForm[key] = "";
    });
    teacherClasses.value = [];
    formRef.value.resetFields();
  }
};

function checkFormData() {
  if (!formRef.value) return false;
  let isPass = true;
  formRef.value.validate(val => {
    console.log("验证的值", val);
    isPass = val;
  });
  return isPass;
}

const rules = reactive({
  teacherName: [{ required: true, message: "请输入教师姓名", trigger: "blur" }],
  teacherCode: [{ required: true, message: "请输入教职工号", trigger: "blur" }],
  teacherPhone: [{ required: true, message: "请输入手机号码", trigger: "blur" }],
  teacherState: [{ required: true, message: "请选择在岗状态", trigger: "change" }],
  studentNationality: [{ required: true, message: "请选择民族", trigger: "change" }],
  teacherIdentity: [{ required: true, message: "输入身份证号", trigger: "blur" }]
});

function sortCreatForm() {
  creatForm.classGrades = [];
  creatForm.classIds = [];
  creatForm.classNames = [];

  for (const a of teacherClasses.value) {
    creatForm.classGrades.push(a.grade);
    creatForm.classIds.push(a.id);
    creatForm.classNames.push(a.name);
  }
}

const creatTeacher = () => {
  if (!checkFormData()) return;
  sortCreatForm();
  creatForm.teacherSchoolId = filterTeacherData.schoolId;

  const parmeter = creatForm;
  addTeacher(parmeter).then((res) => {
    ElMessage({
      message: "添加成功.",
      type: "success"
    });
    getTeacher();
    dialogFormVisible.value = false;
  });
};

function updateTeacherList() {
  if (!checkFormData()) return;
  sortCreatForm();
  updateTeacher(creatForm)
    .then((res) => {
      ElMessage({
        message: "更新成功.",
        type: "success"
      });
      getTeacher();
    })
    .catch((err) => {
      ElMessage({
        message: "更新失败.",
        type: "error"
      });
      console.log("删除错误信息", err);
    });
  dialogFormVisible.value = false;
}

function deleteTeacherById(teacherId) {
  ElMessageBox.confirm("确定要删除所选教师?", "Warning", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  })
    .then(() => {
      deleteTeacher(teacherId)
        .then((res) => {
          ElMessage({
            message: "删除成功.",
            type: "success"
          });
          getTeacher();
        })
        .catch((err) => {
          ElMessage({
            message: "删除失败.",
            type: "error"
          });
          console.log("删除错误信息", err);
        });
    })
    .catch(() => {
    });
}

function setState(teacherId, teacherState) {
  setStateTeacher({ id: teacherId, state: !teacherState }).then(res => {
    ElMessage({
      message: "操作成功.",
      type: "success"
    });
    getTeacher();
  }).catch(err => {
    ElMessage({
      message: "操作失败.",
      type: "error"
    });
    console.log("错误信息", err);
  });
}

function importTeacherData(formData) {
  importTeacher(formData, { schoolId: creatForm.teacherSchoolId }).then((res: any) => {
    const { message, code } = res;
    if (code == 200) {
      getTeacher();
      ElMessage.success(message);
    } else {
      ElMessage.error(message);
    }
    console.log("上传文件");
  });
}

function exportTeacherList() {
  const parmeter = {
    schoolId: filterTeacherData.schoolId,
    teacherAppState: filterTeacherData.teacherAppState,
    teacherGender: filterTeacherData.teacherGender,
    teacherNationality: filterTeacherData.teacherNationality,
    teacherRank: filterTeacherData.teacherRank,
    teacherState: filterTeacherData.teacherState,
    fuzzyQuery: filterTeacherData.fuzzyQuery
  };
  exportTeacher(parmeter);
}

const filterTeacherData = reactive({
  pageNum: 1,
  pageSize,
  schoolId: "",
  teacherAppState: "",
  teacherGender: "",
  teacherNationality: "",
  teacherRank: "",
  teacherState: "",
  fuzzyQuery: "",
  classGrade: undefined
});

const tableData = reactive({
  pageNum: 0,
  pageSize: 0,
  total: 0,
  totalPage: 1,
  list: []
});
const getTeacher = () => {
  const parmeter = filterTeacherData;
  getTeacherList(parmeter).then(({ data: res }) => {
    tableData.pageNum = res.pageNum;
    tableData.list = res.list;
    tableData.total = res.total;
    console.log("学校列表", res, tableData);
  });
};

function getSchoolId(type, id) {
  filterTeacherData.schoolId = id;
  creatForm.teacherSchoolId = id;
  schoolType.value = type;
  getTeacher();
}

function handleSizeChange(size) {
  filterTeacherData.pageSize = size;
  getTeacher();
}

function handleCurrentChange(currentPage) {
  filterTeacherData.pageNum = currentPage;
  getTeacher();
  console.log("页吗改变", filterTeacherData);
}

const classId = ref("");
const changeClass = (e) => {
  classId.value = e.class_id;
  filterTeacherData.studentClassName = e.class_name;
};

</script>

<style>
</style>
