<template>
  <div class="p-8">
    <SchoolSelect @getSchool="getSchoolId" />
  </div>
  <div class="p-8">
    <div>
      <el-button
        type="text"
        :disabled="!filterStudentData.schoolId || !checkPermissions('add')"
        @click="openCreateDialog(true)"
      >
        <span class="iconfont icon-jiajianzujianjiahao" />
        添加学生
      </el-button>
    </div>
    <div>
      <el-form
        v-model="filterStudentData"
        class="flex flex-wrap"
      >
        <el-form-item class="mr-5">
          <ClassSelect
            v-model:grade="filterStudentData.studentGrade"
            v-model:class-id="classId"
            v-model:school-id="filterStudentData.schoolId"
            :school-type="schoolType"
            @changeGrade="(e)=>{filterStudentData.studentGrade = e}"
            @changeClass="changeClass"
          />
        </el-form-item>
        <el-form-item
          label="性别："
          class="mr-5"
        >
          <el-radio-group
            v-model="filterStudentData.studentGender"
            size="small"
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
          label="免测："
          class="mr-5"
        >
          <el-radio-group
            v-model="filterStudentData.studentTestfree"
            size="small"
          >
            <el-radio label="">
              全部
            </el-radio>
            <el-radio :label="1">
              是
            </el-radio>
            <el-radio :label="2">
              否
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="在读状态："
          class="mr-5"
        >
          <el-radio-group
            v-model="filterStudentData.studentState"
            size="small"
          >
            <el-radio label="">
              全部
            </el-radio>
            <el-radio :label="1">
              正常
            </el-radio>
            <el-radio :label="2">
              停学
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="激活状态："
          class="mr-5"
        >
          <el-radio-group
            v-model="filterStudentData.studentAppState"
            size="small"
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
            v-model="filterStudentData.fuzzyQuery"
            placeholder="请输入查询内容"
          />
        </el-form-item>
        <el-button
          type="primary"
          :disabled="!filterStudentData.schoolId"
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
          prop="studentId"
          label="序号"
          width="60"
        />
        <el-table-column
          align="center"
          prop="studentClassName"
          label="班级"
          width="120"
        />
        <el-table-column
          align="center"
          prop="studentGrade"
          label="当前年级"
          width="90"
        >
          <template #default="{row}">
            {{ gradeConversion(row?.studentGrade) }}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="studentCode"
          label="学籍号"
          width="190"
        />
        <el-table-column
          align="center"
          prop="studentName"
          label="学生姓名"
          width="90"
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
          prop="studentIdentity"
          label="身份证号"
          width="180"
        />
        <el-table-column
          align="center"
          prop="studentGender"
          label="性别"
          width="60"
        />
        <el-table-column
          align="center"
          prop="studentNationality"
          label="民族"
          width="60"
        />
        <el-table-column
          align="center"
          prop="studentBirthday"
          label="出生日期"
          width="120"
        >
          <template #default="scope">
            <div>
              {{ dateFormat(scope.row.studentBirthday, "yyyy-mm-dd") }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="studentAge"
          label="年龄"
          width="60"
        />
        <el-table-column
          align="center"
          prop="studentAddress"
          label="家庭地址"
          width="190"
        />
        <el-table-column
          align="center"
          prop="studentParentName"
          label="家长姓名"
          width="90"
        />
        <el-table-column
          align="center"
          prop="studentParentPhone"
          label="家长手机号"
          width="120"
        />
        <el-table-column
          align="center"
          prop="studentAppState"
          label="家长端激活状态"
          width="90"
        >
          <template #default="scope">
            <div>
              {{ scope.row.studentAppState ? "是" : "否" }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="studentTestfree"
          label="免测"
          width="60"
        >
          <template #default="scope">
            <div>
              {{ scope.row.studentTestfree ? "是" : "否" }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="studentState"
          label="在读状态"
          width="90"
        >
          <template #default="scope">
            <div>
              {{ scope.row.studentState ? "在读" : "停学" }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="studentScore"
          label="体测成绩"
          width="90"
        />
        <el-table-column
          align="center"
          prop="address"
          label="操作"
          width="220px"
          fixed="right"
        >
          <template #default="scope">
            <el-link
              class="mr-4"
              type="primary"
              :disabled="!checkPermissions('update')"
              @click="dropOut(scope.row.studentId,scope.row.studentState)"
            >
              {{ scope.row.studentState ? "停学" : "在读" }}
            </el-link>
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
              @click="deleteStudentById(scope.row.studentId)"
            >
              删除
            </el-link>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="flex justify-between pt-5">
      <ImportAndExportFile
        v-show="filterStudentData.schoolId"
        :disable-import="!checkPermissions('add')"
        @exportData="exportStudentData"
        @importData="importStudentData"
        @downloadTemplate="downloadStudentTemplate"
      />
      <el-pagination
        v-model:currentPage="filterStudentData.pageNum"
        v-model:page-size="filterStudentData.pageSize"
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
    :title="isCreate ? '新建学生' : '编辑学生'"
  >
    <el-form
      ref="formRef"
      :model="creatForm"
      :rules="rules"
    >
      <el-form-item

        label="姓名："
        prop="studentName"
      >
        <el-input
          v-model="creatForm.studentName"
          autocomplete="off"
        />
      </el-form-item>
      <el-form-item
        label="学籍号："
        prop="studentCode"
      >
        <el-input
          v-model="creatForm.studentCode"
          autocomplete="off"
        />
      </el-form-item>
      <el-form-item
        label="身份证号："
        prop="studentIdentity"
      >
        <el-input
          v-model.trim="creatForm.studentIdentity"
          autocomplete="off"
          :disabled="creatForm.autoId"
        />
        <el-checkbox v-model="creatForm.autoId">
          根据学籍号计算
        </el-checkbox>
      </el-form-item>
      <el-form-item
        label="所属班级："
        prop="studentClassId"
        :required="true"
        error="请选择所属班级"
        :show-message="false"
      >
        <ClassSelect
          v-model:class-id="creatForm.studentClassId"
          v-model:grade="creatForm.studentGrade"
          :school-id="filterStudentData.schoolId"
          :school-type="schoolType"
        />
      </el-form-item>
      <el-form-item
        class="mr-5"
        label="民族："
        prop="studentNationality"
      >
        <el-select
          v-model="creatForm.studentNationality"
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
        class="mr-5"
        label="性别："
        prop="studentGender"
      >
        <el-radio-group
          v-model="creatForm.studentGender"
          :disabled="disabled"
          class="inline-block"
        >
          <template
            v-for="label in genderList"
            :key="label"
          >
            <el-radio
              :label="label"
              :value="label"
            >
              {{ label }}
            </el-radio>
          </template>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        label="家长姓名："
      >
        <el-input
          v-model="creatForm.studentParentName"
          autocomplete="off"
        />
      </el-form-item>
      <el-form-item
        label="手机号："
        prop="studentParentPhone"
      >
        <el-input
          v-model="creatForm.studentParentPhone"
        />
      </el-form-item>
      <el-form-item
        label="家庭住址："
      >
        <el-input v-model="creatForm.studentAddress" />
      </el-form-item>
      <el-form-item
        class="mr-5"
        label="免测："
        prop="studentTestfree"
      >
        <el-radio-group
          v-model="creatForm.studentTestfree"
          class="inline-block"
        >
          <el-radio
            :label="true"
          >
            是
          </el-radio>
          <el-radio
            :label="false"
            value="false"
          >
            否
          </el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button
          v-if="isCreate"
          type="primary"
          @click="creatStudent"
        >保存</el-button>
        <el-button
          v-else
          type="primary"
          @click="updateStudentList"
        >保存</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import {
  addStudent,
  deleteStudent,
  downloadStudentTemplate,
  exportStudent,
  getStudentList,
  importStudent,
  setStudentState,
  updateStudent
} from "@/api/basicInfoManager";
import { computed, nextTick, reactive, ref, watch } from "vue";
import ClassSelect from "@/components/ClassSelect.vue";
import SchoolSelect from "@/components/SchoolSelect/index.vue";
import national from "@/utils/national.js";
import type { ElForm } from "element-plus";
import { ElMessage, ElMessageBox } from "element-plus";
import dateFormat from "@/utils/dateFormat.js";
import rulesList from "@/utils/rules";
import checkPermissions from "@/hooks/checkPermissions";
import { pageSize, pageSizes } from "@/hooks/pagination";
import { IdCard } from "@/utils/index";
import { gradeConversion } from "@/utils/baseData.ts";

const genderList = ["男", "女"];

type FormInstance = InstanceType<typeof ElForm>

const formRef = ref<FormInstance>();
const dialogFormVisible = ref(false);
const isCreate = ref(true);
const schoolType = ref("");
const schoolList = ref({
  schoolName: { title: "学校：", value: "" },
  schoolType: { title: "学校类别：", value: "" },
  schoolDistrict: { title: "所属区域：", value: "" },
  schoolAddress: { title: "地址：", value: "" },
  schoolHeadmaster: { title: "校长：", value: "" },
  schoolPhone: { title: "联系电话：", value: "" },
  schoolClassNum: { title: "班级数：", value: "" },
  schoolStudentNum: { title: "学生人数：", value: "" },
  schoolTeacherNum: { title: "教师人数：", value: "" }
});


let creatForm: any = reactive({
  autoId: true,
  schoolId: "",
  studentAddress: "",
  studentClassId: "",
  studentClassName: "",
  studentCode: "",
  studentIdentity: undefined,
  studentName: "",
  studentNationality: "",
  studentParentName: "",
  studentParentPhone: "",
  studentId: undefined,
  studentGrade: undefined,
  studentGender: undefined,
  studentTestfree: false
});
watch(() => creatForm.studentIdentity, (value) => {
  if (!value) return;
  if (value.length === 18) {
    creatForm.studentGender = IdCard(value, 2);
  }

});
const disabled = computed(() => genderList.includes(IdCard(creatForm.studentIdentity, 2)));
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};

const openCreateDialog = (state, row) => {
  isCreate.value = state;
  dialogFormVisible.value = true;
  if (!state) {
    nextTick(() => {
      Object.keys(creatForm).forEach(key => {
        creatForm[key] = row[key];
      });
      creatForm.schoolId = filterStudentData.schoolId;
    });

    // eslint-disable-next-line no-empty
  } else {
    nextTick(() => {
      resetForm(formRef.value);
      Object.keys(creatForm).forEach(key => {
        creatForm[key] = "";
      });
      creatForm.autoId = false;
    });


    creatForm.schoolId = filterStudentData.schoolId;
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
  studentName: [{ required: true, message: "请输入学生姓名", trigger: "blur" }],
  studentCode: [{ required: true, message: "请输入学籍号", trigger: "blur" }],
  studentIdentity: [{ required: false, message: "请输入身份证号码或勾选按照学籍计算", trigger: "blur" }],
  // studentClass: [{ required: true, message: "请选择年级班级", validator: checkClass, trigger: "change" }],
  studentNationality: [{ required: true, message: "请选择民族", trigger: "change" }],
  studentGender: [{ required: true, message: "请选择性别", trigger: "change" }],
  studentParentPhone: rulesList.phone
});

function checkClass(rule, value, callback) {
  if (!creatForm.studentClassId) {
    callback(new Error("请选择班级"));
  } else {
    callback();
  }
}

// const changeSelectCity = (area) => {
//   creatForm.schoolProvince = area.province
//   creatForm.schoolCity = area.city
//   creatForm.schoolDistrict = area.district
//   console.log('选择城市', creatForm, area)
// }
const creatStudent = () => {
  console.log("新建学生", creatForm);
  if (!checkFormData()) return;
  const parmeter = creatForm;
  parmeter.schoolId = filterStudentData.schoolId;
  if (parmeter.autoId) {
    parmeter.studentIdentity = undefined;
  }
  addStudent(parmeter).then((res: any) => {
    if (res.code == 200) {
      console.log("添加学生", res);
      ElMessage({
        message: "添加成功.",
        type: "success"
      });
      getStudent();
      dialogFormVisible.value = false;
    } else {
      ElMessage({
        message: "添加失败.",
        type: "error"
      });
    }

  });
};

function updateStudentList() {
  if (!checkFormData()) return;
  const parameter = { ...creatForm };
  parameter.studentIdentity = parameter.studentIdentity.trim();
  if (parameter.studentIdentity === "") {
    parameter.studentIdentity = undefined;
    parameter.autoId = false;

    // parameter.autoId = true;
  } else {
    parameter.autoId = false;

  }
  if (!parameter.autoId) {
    parameter.autoId = false;
  }
  if (parameter.autoId) {
    parameter.studentIdentity = undefined;
  }
  updateStudent(parameter)
    .then((res) => {
      if (res.code == 200) {
        ElMessage({
          message: "更新成功.",
          type: "success"
        });
        getStudent();
      } else {
        ElMessage({
          message: "更新失败.",
          type: "error"
        });
      }

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

function deleteStudentById(studentId) {
  ElMessageBox.confirm("确定要删除所选学生?", "Warning", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  })
    .then(() => {
      deleteStudent(studentId)
        .then((res) => {
          if (res.code) {
            ElMessage({
              message: "删除成功.",
              type: "success"
            });
            getStudent();
          } else {
            ElMessage({
              message: "删除失败.",
              type: "error"
            });
          }

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

function dropOut(studentId, studentState) {
  setStudentState({ id: studentId, state: !studentState }).then(res => {
    ElMessage({
      message: "操作成功.",
      type: "success"
    });
    getStudent();
  }).catch(err => {
    ElMessage({
      message: "操作失败.",
      type: "error"
    });
    console.log("错误信息", err);
  });
}

function importStudentData(formData) {
  // formData.append('schoolId', filterStudentData.schoolId)
  console.log("上传文件", formData.get("file"));
  importStudent(formData, { schoolId: filterStudentData.schoolId }).then((res: any) => {
    const { message, code } = res;
    if (code == 200) {
      getStudent();
      ElMessage.success(message);
    } else {
      ElMessage.error(message);
    }
    console.log("上传文件");
  });
}

function exportStudentData() {
  const parmeter = {
    fuzzyQuery: filterStudentData.fuzzyQuery,
    schoolId: filterStudentData.schoolId,
    studentAppState: filterStudentData.studentAppState,
    studentClassName: filterStudentData.studentClassName,
    studentGender: filterStudentData.studentGender,
    studentTestfree: filterStudentData.studentTestfree,
    studentGrade: filterStudentData.studentGrade,
    studentNationality: filterStudentData.studentNationality,
    studentState: filterStudentData.studentState
  };
  exportStudent(parmeter);
}

const filterStudentData = reactive({
  pageNum: 1,
  pageSize,
  schoolId: "",
  studentAppState: "",
  studentClassName: "",
  studentGender: "",
  classGrade: "",
  studentNationality: "",
  studentState: "",
  studentTestfree: "",
  fuzzyQuery: ""
});

function changeFilterCity(area) {
  filterStudentData.schoolProvince = area.province;
  filterStudentData.schoolCity = area.city;
  filterStudentData.schoolDistrict = area.district;
  console.log("选择城市", creatForm, area);
}

const tableData = reactive({
  pageNum: 0,
  pageSize: 0,
  total: 0,
  totalPage: 1,
  list: []
});
const getStudent = () => {
  const parmeter = filterStudentData;
  getStudentList(parmeter).then((res) => {
    const { data } = res;
    tableData.pageNum = data.pageNum;
    tableData.list = data.list;
    tableData.total = data.total;
    console.log("学校列表", data, tableData);
  });
};

function getSchoolId(type, id) {
  filterStudentData.schoolId = id;
  creatForm.schoolId = id;
  schoolType.value = type;
  getStudent();
}

function handleSizeChange(size: number) {
  filterStudentData.pageSize = size;
  getStudent();
}

function handleCurrentChange(currentPage: number) {
  filterStudentData.pageNum = currentPage;
  getStudent();
  console.log("页吗改变", filterStudentData);
}

const classId = ref("");
const changeClass = (e) => {
  classId.value = e.class_id;
  filterStudentData.studentClassName = e.class_name;
};
</script>

<style>
</style>
