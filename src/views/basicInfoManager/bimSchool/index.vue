<template>
  <div class="p-8">
    <div class="py-8 flex">
      <el-button
        class="mr-5"
        type="text"
        @click="openCreateDialog(true) || !checkPermissions('add')"
      >
        <span class="iconfont icon-jiajianzujianjiahao" />
        新建学校
      </el-button>
      <SelectCity @changeSelectCity="changeFilterCity" />
      <div class="w-50 mx-4">
        <el-input
          v-model="filterSchoolData.fuzzySchoolName"
          placeholder="请输入学校名称"
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
        :data="tableData.list"
        :border="true"
        :header-cell-style="{background:'#3470D0',color:'white'}"
      >
        <el-table-column
          align="center"
          prop="schoolId"
          label="序号"
          width="60"
        />
        <el-table-column
          align="center"
          prop="schoolType"
          label="学校类别"
          width="90"
        />
        <el-table-column
          align="center"
          prop="schoolName"
          label="学校"
          width="180"
        />
        <el-table-column
          align="center"
          prop="schoolCode"
          label="学校编号"
          width="120"
        />
        <el-table-column
          align="center"
          label="省市"
          width="120"
        >
          <template #default="scope">
            <div>{{ scope.row.schoolProvince + scope.row.schoolCity }}</div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="schoolDistrict"
          label="区域"
        />
        <el-table-column
          align="center"
          prop="schoolAddress"
          label="地址"
          width="190"
        />
        <el-table-column
          align="center"
          prop="schoolHeadmaster"
          label="校长"
          width="90"
        />
        <el-table-column
          align="center"
          prop="schoolPhone"
          label="联系电话"
          width="190"
        />
        <el-table-column
          align="center"
          prop="schoolClassNum"
          label="班级数"
        />
        <el-table-column
          align="center"
          prop="schoolStudentNum"
          label="学生人数"
        />
        <el-table-column
          align="center"
          prop="schoolMaleNum"
          label="男生"
        />
        <el-table-column
          align="center"
          prop="schoolFemaleNum"
          label="女生"
        />
        <el-table-column
          align="center"
          prop="schoolTestfreeNum"
          label="今年免测人数"
        />
        <el-table-column
          align="center"
          prop="schoolPeTeacherNum"
          label="体育老师人数"
        />
        <el-table-column
          align="center"
          prop="schoolIntroduction"
          label="简介"
        />
        <el-table-column
          align="center"
          prop="schoolUpdateTime"
          label="更新时间"
          width="110"
        >
          <template #default="scope">
            <div>
              {{ dateFormat(scope.row.schoolUpdateTime) }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          align="center"
          prop="address"
          label="操作"
          width="100"
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
              :disabled="!checkPermissions('delete')"
              type="primary"
              @click="deleteSchoolById(scope.row.schoolId)"
            >
              删除
            </el-link>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="flex justify-between pt-5">
      <ImportAndExportFile
        @exportData="exportSchoolData"
        @importData="importSchoolData"
        @downloadTemplate="downloadSchoolTemplate"
      />

      <el-pagination
        v-model:currentPage="filterSchoolData.pageNum"
        v-model:page-size="filterSchoolData.pageSize"
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
    :title="isCreate ? '新建学校' : '编辑学校'"
  >
    <el-form
      ref="formRef"
      :model="creatForm"
      :rules="rules"
    >
      <el-form-item
        label="区 域："
        prop="schoolCity"
      >
        <SelectCity
          v-model:district-code="creatForm.schoolDistrictCode"
          @changeSelectCity="changeSelectCity"
        />
      </el-form-item>
      <el-form-item
        label="学校类别："
        prop="schoolType"
      >
        <el-radio-group v-model="creatForm.schoolType">
          <el-radio label="小学">
            小学
          </el-radio>
          <el-radio label="中学">
            中学
          </el-radio>
          <el-radio label="九年一贯">
            九年一贯
          </el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item
        label="学校名称："
        prop="schoolName"
      >
        <el-input
          v-model="creatForm.schoolName"
          autocomplete="off"
        />
      </el-form-item>
      <el-form-item label="学校编号：">
        <el-input
          v-model="creatForm.schoolCode"
          autocomplete="off"
        />
      </el-form-item>
      <el-form-item label="学校地址：">
        <el-input
          v-model="creatForm.schoolAddress"
          autocomplete="off"
        />
      </el-form-item>
      <el-form-item label="校长姓名：">
        <el-input
          v-model="creatForm.schoolHeadmaster"
          autocomplete="off"
        />
      </el-form-item>
      <el-form-item
        label="联系电话："
        prop="schoolPhone"
      >
        <el-input
          v-model="creatForm.schoolPhone"
          autocomplete="off"
        />
      </el-form-item>
      <el-form-item label="简介：">
        <el-input v-model="creatForm.schoolIntroduction" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button
          v-if="isCreate"
          type="primary"
          @click="creatSchool(formRef)"
        >保存</el-button>
        <el-button
          v-else
          type="primary"
          @click="updateSchool(formRef)"
        >保存</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import {
  addSchool,
  deleteSchool,
  downloadSchoolTemplate,
  exportSchool,
  getSchoolList,
  importSchool,
  upDateSchool
} from "@/api/basicInfoManager.ts";
import { onMounted, reactive, ref } from "vue";
import SelectCity from "@/components/SelectCity.vue";
import type { ElForm } from "element-plus";
import { ElMessage, ElMessageBox } from "element-plus";
import dateFormat from "@/utils/dateFormat.js";
import rulesList from "@/utils/rules";
import checkPermissions from "@/hooks/checkPermissions";
import { pageSize, pageSizes } from "@/hooks/pagination";

type FormInstance = InstanceType<typeof ElForm>

const formRef = ref<FormInstance>();
const dialogFormVisible = ref(false);
const isCreate = ref(true);
const areaData = {};
const openCreateDialog = (state, row) => {
  isCreate.value = state;
  dialogFormVisible.value = true;
  if (!state) {
    creatForm.schoolAddress = row.schoolAddress;
    creatForm.schoolCityCode = row.schoolCity;
    creatForm.schoolCode = row.schoolCode;
    creatForm.schoolDistrictCode = row.schoolDistrict;
    creatForm.schoolHeadmaster = row.schoolHeadmaster;
    creatForm.schoolIntroduction = row.schoolIntroduction;
    creatForm.schoolName = row.schoolName;
    creatForm.schoolPhone = row.schoolPhone;
    creatForm.schoolProvinceCode = row.schoolProvince;
    creatForm.schoolType = row.schoolType;
    creatForm.schoolId = row.schoolId;
  } else {
    creatForm.schoolAddress = "";
    creatForm.schoolCityCode = "";
    creatForm.schoolCode = "";
    creatForm.schoolDistrictCode = "";
    creatForm.schoolHeadmaster = "";
    creatForm.schoolIntroduction = "";
    creatForm.schoolName = "";
    creatForm.schoolPhone = "";
    creatForm.schoolProvinceCode = "";
    creatForm.schoolType = "";
  }
};

const creatForm = ref({
  schoolAddress: "",
  schoolCityCode: "",
  schoolCode: "",
  schoolDistrictCode: "",
  schoolHeadmaster: "",
  schoolIntroduction: "",
  schoolName: "",
  schoolPhone: "",
  schoolProvinceCode: "",
  schoolType: ""
}).value;

const rules = reactive({
  schoolCity: [{ required: true, validator: checkCity, message: "请选择地址", trigger: "change" }],
  schoolName: [{ required: true, message: "请输入学校名称", trigger: "blur" }],
  schoolType: [{ required: true, message: "请选择学校类型", trigger: "change" }],
  schoolPhone: rulesList.phone
});

function checkCity(rule, value, callback) {
  if (!creatForm.schoolDistrictCode) {
    callback(new Error("请选择地区"));
  } else {
    callback();
  }
}

const changeSelectCity = (area) => {
  creatForm.schoolProvinceCode = area.province;
  creatForm.schoolCityCode = area.city;
  creatForm.schoolDistrictCode = area.district;
  console.log("选择城市", creatForm, area);
};

function checkFormData(formEl: FormInstance | undefined) {
  if (!formEl) return false;
  let isPass = true;
  formEl.validate(val => {
    console.log("验证的值", val);
    isPass = val;
  });
  return isPass;
}

const creatSchool = (formEl: FormInstance | undefined) => {

  if (!checkFormData(formEl)) return;

  addSchool(creatForm).then((res) => {
    const { code } = res;
    if (code === 200) {
      getSchools();
      console.log("添加学校", res);
      ElMessage({
        message: "添加成功.",
        type: "success"
      });
      dialogFormVisible.value = false;
    }

  });
};

function updateSchool(formEl: FormInstance | undefined) {
  if (!checkFormData(formEl)) return;

  upDateSchool(creatForm)
    .then((res: any) => {
      const { code } = res;
      if (code === 200) {
        ElMessage({
          message: "更新成功.",
          type: "success"
        });
        getSchools();
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

function deleteSchoolById(schoolId) {
  ElMessageBox.confirm("确定要删除所选学校?", "Warning", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  })
    .then(() => {
      deleteSchool(schoolId)
        .then((res) => {
          if (res.code == 200) {
            ElMessage({
              message: "删除成功.",
              type: "success"
            });
            getSchools();
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

function importSchoolData(formData) {
  importSchool(formData).then((res: { message: string, code: number }) => {
    const { message, code } = res;
    if (code == 200) {
      // onSubmit();
      getSchools();
      ElMessage.success(message);
    } else {
      ElMessage.error(message);
    }
  });
}

function exportSchoolData() {
  const parmeter = {
    schoolProvince: filterSchoolData.schoolProvince,
    schoolCity: filterSchoolData.schoolCity,
    schoolDistrict: filterSchoolData.schoolDistrict,
    schoolName: filterSchoolData.fuzzySchoolName,
    schoolType: filterSchoolData.schoolType
  };
  exportSchool(parmeter).then((res: any) => {
    const { message, code } = res;
    if (code == 200) {
      getSchools();
      ElMessage.success(message);
    } else {
      ElMessage.error(message);
    }
    console.log("上传文件");
  });
}

const filterSchoolData = reactive({
  pageNum: 1,
  pageSize,
  schoolProvince: "",
  schoolCity: "",
  schoolDistrict: "",
  fuzzySchoolName: "",
  schoolType: ""
});

function changeFilterCity(area) {
  filterSchoolData.schoolProvince = area.province;
  filterSchoolData.schoolCity = area.city;
  filterSchoolData.schoolDistrict = area.district;
  console.log("选择城市", creatForm, area);
}

const tableData = reactive({
  pageNum: 0,
  pageSize: 0,
  total: 0,
  totalPage: 1,
  list: []
});
const getSchools = () => {
  const parmeter = filterSchoolData;
  getSchoolList(parmeter).then((res) => {
    const { data } = res;
    tableData.pageNum = data.pageNum;
    tableData.list = data.list;
    tableData.total = data.total;
    console.log("学校列表", data, tableData);
  });
};

function handleSizeChange(size: number) {
  filterSchoolData.pageSize = size;
  getSchools();
}

function handleCurrentChange(currentPage: number) {
  filterSchoolData.pageNum = currentPage;
  getSchools();
  console.log("页吗改变", filterSchoolData);
}

onMounted(() => {
  getSchools();
});
</script>

<style>
</style>
