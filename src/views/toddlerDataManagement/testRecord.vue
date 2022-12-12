<template>
  <div class="p-8">
    <div class="flex justify-between">
      <el-button
        type="text"
        @click="$router.push({name: 'addTestRecord'})"
      >
        <span class="iconfont icon-jiajianzujianjiahao" />
        添加测试记录
      </el-button>
      <div>
        <el-form
          v-model="filterStudentData"
          class="flex flex-wrap"
        >
          <el-form-item
            class="mr-5"
            label="性别："
          >
            <el-radio-group
              v-model="filterStudentData.infantGender"
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


          <el-form-item class="mr-5">
            <el-input
              v-model="filterStudentData.fuzzyQuery"
              placeholder="请输入查询内容"
            />
          </el-form-item>
          <el-button
            type="primary"
            @click="handleCurrentChange(1)"
          >
            搜索
          </el-button>
        </el-form>
      </div>
    </div>

    <div>
      <el-table
        :border="true"
        :data="tableData.list"
        :header-cell-style="{background:'#3470D0',color:'white'}"
      >
        <el-table-column
          align="center"
          label="序号"
          type="index"
          width="60"
        />
        <el-table-column
          align="center"
          label="测试时间"
          prop="testTime"
          width="120"
        >
          <template #default="scope">
            <div>
              {{ dateFormat(scope.row.testTime, "yyyy-mm-dd") }}
            </div>
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          label="姓名"
          prop="infantName"
          width="120"
        />
        <el-table-column
          align="center"
          label="性别"
          prop="infantGender"
          width="60"
        />


        <el-table-column
          align="center"
          label="生日"
          prop="infantBirthday"
          width="120"
        >
          <template #default="scope">
            <div>
              {{ dateFormat(scope.row.infantBirthday, "yyyy-mm-dd") }}
            </div>
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          label="家长手机号码"
          prop="infantParentPhone"
          width="190"
        />
        <el-table-column
          align="center"
          label="综合得分"
          prop="score"
          width="120"
        />
        <el-table-column
          align="center"
          label="教练"
          prop="coach"
          width="120"
        />


        <el-table-column
          align="center"
          label="测评报告"
          min-width="220px"
          prop="address"
          width="auto"
        >
          <template #default="scope">
            <el-link
              class="mr-10"
              type="primary"
              @click="$router.push({name:'addTestRecord', query: {
                recordId:scope.row.recordId
              }})"
            >
              编辑
            </el-link>
            <el-link
              type="primary"
              @click="openReview( scope.row.recordId)"
            >
              报告
            </el-link>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          fixed="right"
          label="操作"
          min-width="220px"
          prop="address"
          width="auto"
        >
          <template #default="scope">
            <el-link
              type="primary"
              @click="deleteStudentById(scope.row.recordId)"
            >
              删除
            </el-link>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="flex justify-between pt-5">
      <ImportAndExportFile
        @downloadTemplate="infantTestRecordDownloadTemplate"
        @exportData="infantTestRecordExport"
        @importData="importStudentData"
      />
      <el-pagination
        v-model:currentPage="filterStudentData.pageNum"
        v-model:page-size="filterStudentData.pageSize"
        :page-sizes="pageSizes"
        :total="tableData.total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>


  <el-dialog
    v-model="dialogFormVisible2"
    title="报告预览"
  >
    <div
      v-if="showQrcode"
      class="flex justify-center"
    >
      <qrcode-vue
        :size="300"
        :value="url"
        level="H"
      />
    </div>

    <Preview
      v-else
      :url="url"
    ></Preview>
    <!--    <QRCodeVue3-->
    <!--      :value="url"-->
    <!--    />-->

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogFormVisible2 = showQrcode = false">取消</el-button>
        <el-button
          type="primary"
          @click="copyLink"
        >复制分享链接</el-button>
        <el-button
          type="primary"
          @click="showQrcode= true"
        >二维码分享</el-button>
      </span>
    </template>
  </el-dialog>
  <el-dialog

    v-model="dialogFormVisible"
    :title="isCreate ? '新建测试记录' : '编辑测试记录'"
  >
    <el-form
      ref="formRef"
      :model="creatForm"
      :rules="rules"
      label-position="right"
      label-width="126px"
    >
      <el-form-item

        label="姓名："
        prop="infantName"
      >
        <el-input
          v-model="creatForm.infantName"
          autocomplete="off"
          placeholder="请输入姓名"
        />
      </el-form-item>


      <el-form-item
        class="mr-5"
        label="性别："
        prop="infantGender"
      >
        <el-radio-group
          v-model="creatForm.infantGender"
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
        label="生日："
        prop="infantBirthday"
      >
        <el-date-picker
          v-model="creatForm.infantBirthday"
          class="w-full date-picker"
          type="date"
        />
      </el-form-item>
      <el-form-item
        label="家长手机号码："
        prop="infantParentPhone"
        required
      >
        <el-input
          v-model="creatForm.infantParentPhone"
          placeholder="请输入家长手机号码"
          type="number"
        />
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
  <input
    id="copy-input"
    v-model="url"
    class="absolute left-[-1000px] top-[-1000px]"
    type="text"
  />
</template>

<script lang="ts" setup>

import {nextTick, reactive, ref, watch} from "vue";

import type {ElForm} from "element-plus";
import {ElMessage, ElMessageBox} from "element-plus";
import dateFormat from "@/utils/dateFormat.js";
import rulesList from "@/utils/rules";
import {pageSize, pageSizes} from "@/hooks/pagination";
import {IdCard} from "@/utils/index";
import {
  add,
  infantTestRecordDelete,
  infantTestRecordDownloadTemplate,
  infantTestRecordExport,
  infantTestRecordImport,
  infantTestRecordList,
  update
} from '@/api/toddlerDataManagement'
import ImportAndExportFile from "@/components/ImportAndExportFile/index.vue";
import Preview from "@/components/Preview.vue";
import QrcodeVue from 'qrcode.vue'

const genderList = ["男", "女"];

type FormInstance = InstanceType<typeof ElForm>

const formRef = ref<FormInstance>();
const dialogFormVisible = ref(false);
const dialogFormVisible2 = ref(false);
const isCreate = ref(true);
const schoolType = ref("");
const url = ref("")
const showQrcode = ref(false)
const openReview = (id: number) => {
  showQrcode.value = false
  dialogFormVisible2.value = true
  url.value = window.location.origin + `/#/report?recordId=${id}`
}
let creatForm: any = reactive(
  {
    "infantBirthday": "",
    "infantGender": "",
    "infantName": "",
    "infantParentPhone": ""
  }
);
const copyLink = (): void => {
  setTimeout(() => {
    const copyDom = document.getElementById('copy-input') as HTMLInputElement;
    copyDom.select()
    document.execCommand("Copy"); //复制
    ElMessage({
      type: 'success',
      message: '复制成功!'
    })
  }, 1)
}

watch(() => creatForm.studentIdentity, (value) => {
  if (!value) return;
  if (value.length === 18) {
    creatForm.studentGender = IdCard(value, 2);
  }

});
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};

const openCreateDialog = (state: boolean, row: any) => {
  isCreate.value = state;
  dialogFormVisible.value = true;
  if (!state) {
    nextTick(() => {
      Object.keys(creatForm).forEach(key => {
        creatForm[key] = row[key];
      });
      creatForm.infantId = row.infantId;
    });

    // eslint-disable-next-line no-empty
  } else {
    nextTick(() => {
      resetForm(formRef.value);
      Object.keys(creatForm).forEach(key => {
        creatForm[key] = "";
      });
      creatForm.infantId = undefined
    });


  }
};

function checkFormData() {
  if (!formRef.value) return false;
  let isPass = true;
  formRef.value.validate(val => {
    console.log("验证的值", val);
    isPass = val as boolean;
  });
  return isPass;
}

const rules = reactive({
  infantName: [{required: true, message: "请输入姓名", trigger: "blur"}],
  infantBirthday: [{required: true, message: "请选择生日", trigger: "change"}],
  infantGender: [{required: true, message: "请选择性别", trigger: "change"}],
  infantParentPhone: rulesList.phone
});


const creatStudent = () => {
  console.log("新建测试记录", creatForm);
  if (!checkFormData()) return;
  const parmeter = creatForm;

  add(parmeter).then((res: any) => {
    if (res.code == 200) {
      console.log("添加测试记录", res);
      ElMessage({
        message: "添加成功.",
        type: "success"
      });
      getlist();
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
  const parameter = {...creatForm};

  update(parameter)
    .then((res: any) => {
      if (res.code == 200) {
        ElMessage({
          message: "更新成功.",
          type: "success"
        });
        getlist();
      } else {
        ElMessage({
          message: "更新失败.",
          type: "error"
        });
      }

    })
    .catch((err: any) => {
      ElMessage({
        message: "更新失败.",
        type: "error"
      });
      console.log("删除错误信息", err);
    });
  dialogFormVisible.value = false;
}

function deleteStudentById(recordId: number) {
  ElMessageBox.confirm("确定要删除所选测试记录?", "Warning", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  })
    .then(() => {
      infantTestRecordDelete({recordId})
        .then((res: any) => {
          if (res.code === 200) {
            ElMessage({
              message: "删除成功.",
              type: "success"
            });
            getlist();
          } else {
            ElMessage({
              message: "删除失败.",
              type: "error"
            });
          }

        })
        .catch((err: any) => {
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

function importStudentData(formData: any) {
  console.log("上传文件", formData.get("file"));
  infantTestRecordImport(formData).then((res: any) => {
    const {message, code} = res;
    if (code == 200) {
      getlist();
      ElMessage.success(message);
    } else {
      ElMessage.error(message);
    }
    console.log("上传文件");
  });
}

const filterStudentData = reactive({
  pageNum: 1,
  pageSize,
  infantGender: undefined,
  fuzzyQuery: ""
});

const tableData = reactive({
  pageNum: 0,
  pageSize: 0,
  total: 0,
  totalPage: 1,
  list: []
});
const getlist = () => {
  const parmeter = filterStudentData;
  infantTestRecordList(parmeter).then((res) => {
    const {data} = res;
    tableData.pageNum = data.pageNum;
    tableData.list = data.list;
    tableData.total = data.total;
    console.log("学校列表", data, tableData);
  });
};
getlist()

function handleSizeChange(size: number) {
  filterStudentData.pageSize = size;
  getlist();
}

function handleCurrentChange(currentPage: number) {
  filterStudentData.pageNum = currentPage;
  getlist();
  console.log("页吗改变", filterStudentData);
}

</script>

<style>
</style>
