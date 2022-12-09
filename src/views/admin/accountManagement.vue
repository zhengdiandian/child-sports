<template>
  <div class="  ">
    <div class="bg-white p-4">
      <div class="py-8 flex">
        <el-button
          :disabled="false"
          class="mr-5"
          type="text"
          @click="goEdit"
        >
          <span
            :class="creatForm.dailytestSchoolId && checkPermissions('add')? 'text-blue': ''"
            class="iconfont icon-jiajianzujianjiahao pr-1.5"
          />

          <span class="text-black underline text-lg font">添加账号</span>
        </el-button>
        <div>
          <!--        <el-date-picker-->
          <!--          v-model="filterData.dailytestGrade"-->
          <!--          type="month"-->
          <!--          placeholder="选择月份"-->
          <!--        />-->
        </div>
        <div class="w-50 mx-4">
          <el-input
            v-model="filterData.fuzzyQuery"
            placeholder="请输入查询内容"
          />
        </div>
        <el-select
          v-model="filterData.rule"
          class="mr-4"
        >
          <el-option
            v-for="{id,name} in roleList"
            :key="id"
            :label="name"
            :value="id"
          ></el-option>
        </el-select>
        <el-button

          type="primary"
          @click="getList"
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
            label="账号"
            prop="username"
            show-overflow-tooltip
            width="120"
          >
          </el-table-column>
          <el-table-column
            align="center"
            class-name="text-black"
            label="角色"
            prop="role"
            width="100"
          >
          </el-table-column>
          <el-table-column
            align="center"
            class-name="text-black"
            label="昵称"
            prop="nickName"
            show-overflow-tooltip
            width="120"
          >
          </el-table-column>
          <el-table-column
            align="center"
            class-name="text-black"
            label="省份"
            prop="province"
            width="90"
          />
          <el-table-column
            align="center"
            class-name="text-black"
            label="市"
            prop="city"
            width="90"
          >
          </el-table-column>
          <el-table-column
            align="center"
            class-name="text-black"
            label="区"
            prop="district"
            width="90"
          />
          <el-table-column
            align="center"
            class-name="text-black"
            label="学校"
            prop="schoolName"
            width="auto"
          />
          <el-table-column
            align="center"
            label="学校类型"
            prop="schoolType"
            width="120"
          >
            <template #default="{ row: { schoolType } }">
              <div class="truncate">
                {{ schoolType ?? "--" }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="手机号"
            prop="phone"
            width="220"
          />
          <el-table-column
            align="center"
            label="状态"
            prop="status"
            width="80"
          >
            <template #default="{ row: { status } }">
              <div class="truncate">
                {{ status === 1 ? "启用" : "停用" ?? "--" }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            fixed="right"
            label="操作"
            prop="address"
            width="260px"
          >
            <template #default="scope">
              <el-link
                :disabled="scope.row.username === 'admin'"
                class="mr-4"
                type="primary"
              >
                <el-switch
                  v-model="scope.row.status"
                  :active-value="1"
                  :disabled="scope.row.username === 'admin'"
                  :inactive-value="0"
                  :width="60"
                  active-text="启用"
                  inactive-text="停用"
                  inline-prompt
                  @change="changeStatus(scope.row.id,$event)"
                />
              </el-link>
              <el-link
                :disabled="!checkPermissions('update')"
                class="mr-4"
                type="primary"
                @click="editClickHandle(scope.row)"
              >
                编辑
              </el-link>
              <el-link
                :disabled="!checkPermissions('update')"
                class="mr-4"
                type="primary"
                @click="resetPassword(scope.row)"
              >
                重置密码
              </el-link>
              <el-link
                :disabled="!checkPermissions('delete')"
                type="primary"
                @click="deletePe(scope.row)"
              >
                删除
              </el-link>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="flex justify-between pt-5">
        <!--        <el-button-->
        <!--          size="large"-->
        <!--          class="lg:text-base"-->
        <!--          type="warning"-->
        <!--          @click="peListExport(filterData)"-->
        <!--        >-->
        <!--          导出数据-->
        <!--        </el-button>-->
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
  </div>

  <Password
    :user-info="resetPasswordData"
    type="reset"
  ></Password>
</template>

<script lang="ts" setup>
import {onActivated, provide, reactive, ref} from "vue";
import type {ElForm} from "element-plus";
import {ElMessage, ElMessageBox} from "element-plus";
import {adminDelete, list, listAll, register, updateStatus} from "@/api/accountManagement";
import {filterGradeList} from "@/utils/baseData";
import type {ExamListAddResult} from "@/interface/examListAdd";
import type {BizUpdateSchoolexamParam} from "@/interface/examUpdate";
import {useRoute, useRouter} from "vue-router";
import {pageSize, pageSizes} from "@/hooks/pagination";
import checkPermissions from "@/hooks/checkPermissions";
import {useStore} from "vuex";
import Password from "@/components/Password.vue";

onActivated(() => {
  const route = useRoute();
  if (route.query.now) {
    getList();
  }
});
const dialogFormVisible = ref(false);
const resetPasswordData = ref({});
provide("dialogFormVisible", dialogFormVisible);
const resetPassword = (row: any) => {
  dialogFormVisible.value = true;
  resetPasswordData.value = row;
};
type FormInstance = InstanceType<typeof ElForm>
const store = useStore();
const router = useRouter();
const formRef = ref<FormInstance>();
const schoolType = ref("");
const isCreate = ref(true);
const roleList = ref([]);
listAll().then(({ data }: any) => {
  roleList.value = data;
});
const statusList = ref([
  {
    status: 1,
    name: "启用"
  },
  {
    status: 0,
    name: "停用"
  }
]);
const changeStatus = (id: any, status: any) => {
  updateStatus({ id, status });
};
const filterData: any = reactive({
  fuzzyQuery: "",
  pageNum: 1,
  pageSize,
  ifInfant: 1
});
// const changeDate = (dataArr: [string, string]) => {
//   filterData.dailytestDateMin = dataArr[0];
//   filterData.dailytestDateMax = dataArr[1];
// };
const editClickHandle = (row: any) => {
  store.commit("Admin/setEditData", row);
  goEdit();
};
const goEdit = () => {
  router.push({ name: "accountManagementUpdate" });
};
const openCreateDialog = async (state: boolean, row: BizUpdateSchoolexamParam) => {
  const keys = Object.keys(creatForm);
  if (!state) {
    keys.forEach(key => {
      creatForm[key] = row[key];
    });
    // await getProject();
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

let creatForm: any = reactive(
  {
    "city": undefined,
    "district": undefined,
    "email": undefined,
    "icon": undefined,
    "nickName": undefined,
    "note": undefined,
    "password": undefined,
    "phone": undefined,
    "province": undefined,
    "schoolName": undefined,
    "schoolType": undefined,
    "teacherCode": undefined,
    "username": undefined
  }
);
const options = ref([]);

const disabledStartDate = (time: Date) => {
  return time.getTime() < (Date.now() - (1000 * 60 * 60 * 24 * 8));
};

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
  register(parmeter)
    .then((res: ExamListAddResult) => {
      debugger;
      console.log("添加", res.code);
      ElMessage({
        message: "添加成功.",
        type: "success"
      });
      dialogFormVisible.value = false;
      getList();
      resetForm(formRef.value);
    })
    .catch((e: object) => console.error(e));
};

function updateClassList() {
  if (!checkFormData()) return;
  const params = { ...creatForm };
  update(params)
    .then(() => {
      ElMessage({
        message: "更新成功.",
        type: "success"
      });
      getList();
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

function deletePe(row: any) {
  ElMessageBox.confirm("确定要删除所选账号" + `${row.username}`, "Warning", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    // peListDelete({ dailytestId })
    adminDelete(row)
      .then((res: any) => {
        if (res.code === 200) {
          ElMessage({
            message: "删除成功.",
            type: "success"
          });
          getList();
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
const getList = () => {
  list(filterData).then((res: { data: any }) => {
    const { data } = res;
    tableData.pageNum = data.pageNum;
    tableData.list = data.list;
    tableData.total = data.total;
    console.log("学校列表", data, tableData);
  });
};

getList();

function getSchoolId(type: "小学" | "初中", id: number) {
  filterData.schoolId = id;
  // filterData.dailytestGrade = (type === "小学") ? 1 : 2;
  creatForm.dailytestSchoolId = id;
  // creatForm.classType = type === "小学" ? 1 : 2;
  schoolType.value = type;
  gradeList.value = filterGradeList(type);
  getList();
}

function handleSizeChange(size: number) {
  filterData.pageSize = size;
  getList();
}

function handleCurrentChange(currentPage: number) {
  filterData.pageNum = currentPage;
  getList();
  console.log("页吗改变", filterData);
}

const checkAll = ref(false);
const isIndeterminate = ref(true);

const handleCheckAllChange = (val: boolean) => {
  creatForm.dailytestProjectList = val ? options.value : [];
  isIndeterminate.value = false;
};
const handleCheckedCitiesChange = (value: string[]) => {
  const checkedCount = value.length;
  checkAll.value = checkedCount === options.value.length;
  isIndeterminate.value = checkedCount > 0 && checkedCount < options.value.length;
};
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
