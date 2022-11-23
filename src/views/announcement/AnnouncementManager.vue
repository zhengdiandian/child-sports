<template>
  <div
    class="p-8"
    :class="[openEdit? 'level-view': '']"
  >
    <div class="pb-8 flex">
      <el-button
        class="mr-5"
        type="text"
        :disabled="!checkPermissions('add')"
        @click="add"
      >
        <span
          class="iconfont icon-jiajianzujianjiahao pr-1.5"
          :class="ruleForm.dailytestSchoolId? 'text-blue': ''"
        />

        <span class="text-black underline text-lg font">发布公告</span>
      </el-button>
      <div>
        <!--        <el-date-picker-->
        <!--          v-model="filterData.dailytestGrade"-->
        <!--          type="month"-->
        <!--          placeholder="选择月份"-->
        <!--        />-->
        <el-date-picker
          v-model="datePicker"
          end-placeholder="结束日期"
          range-separator="至"
          start-placeholder="开始日期"
          type="daterange"
          @change="changeDate"
        />
      </div>
      <div class="w-50 mx-4">
        <el-input
          v-model="filterData.title"
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
          prop="id"
          width="80"
        />
        <el-table-column
          align="center"
          class-name="text-black"
          label="文章标题"
          prop="title"
          width="auto"
        >
        </el-table-column>
        <el-table-column
          align="center"
          class-name="text-black"
          label="副标题"
          prop="subtitle"
          width="auto"
        />
        <el-table-column
          align="center"
          class-name="text-black"
          label="发布人"
          prop="announcementPublisher"
          width="90"
        >
        </el-table-column>
        <el-table-column
          align="center"
          class-name="text-black"
          label="发布人单位"
          prop="publisherUnit"
          width="180"
        />
        <el-table-column
          align="center"
          class-name="text-black"
          label="阅读次数"
          prop="readingNum"
          width="90"
        />
        <el-table-column
          align="center"
          label="发布目标"
          prop="publishObject"
          width="180px"
        >
        </el-table-column>
        <el-table-column
          align="center"
          label="发布日期"
          prop="announcementDate"
          width="220"
        >
          <template #default="scope">
            <div>{{ dateFormat(scope.row?.announcementDate) }}</div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="状态"
          prop="announcementState"
          width="80"
        />
        <el-table-column
          align="center"
          label="操作"
          prop="address"
          width="220px"
        >
          <template #default="scope">
            <el-link
              class="mr-4"
              type="primary"
              :disabled="!checkPermissions('update')"
              @click="openCreateDialog( scope.row)"
            >
              编辑
            </el-link>
            <el-link
              class="mr-4"
              type="primary"
              :disabled="!checkPermissions('update')"
              @click="toInfo(scope.row)"
            >
              {{ scope.row.announcementState === "0" ? "发布" : "下架" }}
            </el-link>
            <el-link
              type="primary"
              :disabled="!checkPermissions('delete')"
              @click="deletePe(scope.row.id)"
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
        @click="exportAnnouncement(filterData)"
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
  <div
    :class="[!openEdit? 'level-view': '']"
    class=" container  h-full  mx-auto px-6   :lg max-w-full  "
  >
    <div class="w-full flex justify-between border-b border-gray-300 pb-2 pt-3">
      <div>
        <h3 class="text-xl text-black  flex items-center">
          <span class="iconfont icon-jiajianzujianjiahao text-blue  text-2xl"></span>
          <span
            class="pl-2"
          >公告发布</span>
        </h3>
      </div>
      <div>
        <el-button
          type="text"
          class="text-gray-700 text-lg"
          @click="openEdit = false"
        >
          <span class="iconfont icon-fanhui text-2xl"></span>
          <span class="underline align-text-bottom ">返回</span>
        </el-button>
      </div>
    </div>
    <div class="mx-auto w-2/3 mt-24">
      <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        :rules="rules"
        label-width="auto"
        class="demo-ruleForm space-y-10"
        :size="formSize"
      >
        <el-form-item
          label="文章标题"
          prop="title"
        >
          <el-input
            v-model="ruleForm.title"
            placeholder="请输入文章标题"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="文章副标题"
          prop="subtitle"
        >
          <el-input
            v-model="ruleForm.subtitle"
            placeholder="请输入文章副标题"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="发布目标"
          prop="publishObject"
        >
          <el-checkbox-group v-model="ruleForm.publishObject">
            <el-checkbox
              v-for="(label, i) in clientList "
              :key="i"
              :disabled="teacherId&&label==='教师端'"
              :label="label"
              :value="label"
            >
              {{ label }}
            </el-checkbox>
            <!--            <el-radio label="中学"></el-radio>-->
          </el-checkbox-group>
        </el-form-item>
        <el-form-item
          :required="true"
          label="范 围："
        >
          <div>
            <SchoolSelect
              v-model:province-code.number="tableItem.announcementProvinceCode"
              v-model:city-code.number="tableItem.announcementCityCode"
              v-model:district-code.number="tableItem.announcementDistrictCode"
              v-model:school-info="tableItem.schoolList"
              v-model:class-info="tableItem.classList"
              :show-info="false"
              :showitems="['schoolNames', 'schoolType', 'className']"
            ></SchoolSelect>
          </div>

          <el-button
            class="rounded border-blue mt-2 ml-4"
            @click="addHandler(tableItem)"
          >
            <span
              class="iconfont icon-jiajianzujianjiahao pr-1.5"
              :class="ruleForm.dailytestSchoolId? 'text-blue': ''"
            />添加
          </el-button>
          <el-table
            :border="true"
            :data="addTableData"
            class="mt-4"
            :header-cell-style="{ background: '#3470D0', color: 'white' }"
          >
            <el-table-column
              align="center"
              label="区域"
              prop="schoolexamId"
              width="auto"
            >
              <template #default="{row}">
                <div>
                  {{ districts[100000][row.announcementProvinceCode] }}
                  {{ districts[row.announcementProvinceCode][row.announcementCityCode] }}
                  {{ districts[row.announcementCityCode][row.announcementDistrictCode] }}
                </div>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              class-name="text-black"
              label="学校"
              prop="schoolexamName"
              show-overflow-tooltip
              width="auto"
            >
              <template #default="{row}">
                <div>
                  {{ row.schoolList?.name ?? "所有学校" }}
                </div>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              class-name="text-black"
              label="班级"
              prop="classGrade"
              width="auto"
            >
              <template #default="{row}">
                <div>
                  {{ row.classList?.name ?? "所有班级" }}
                </div>
              </template>
            </el-table-column>


            <el-table-column
              align="center"
              label="操作"
              prop="address"
              width="220px"
            >
              <template #default="{$index}">
                <el-link
                  type="primary"
                  @click="deleteTableItem($index)"
                >
                  删除
                </el-link>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>

        <!--        <el-form-item-->
        <!--          label="年&nbsp;&nbsp;&nbsp;&nbsp;   级"-->
        <!--          prop="randomtestGrade"-->
        <!--        >-->
        <!--          <el-select-->
        <!--            v-model="ruleForm.randomtestGrade"-->
        <!--            placeholder="请选择年级"-->
        <!--            class="w-full"-->
        <!--          >-->
        <!--            <template-->
        <!--              v-for="{value, label} in gradeList"-->
        <!--              :key="value"-->
        <!--            >-->
        <!--              <el-option-->
        <!--                :label="label"-->
        <!--                :value="value"-->
        <!--              ></el-option>-->
        <!--            </template>-->
        <!--          </el-select>-->
        <!--        </el-form-item>-->
        <el-form-item
          label="内容"
          prop="announcementContent"
        >
          <EditorInput
            ref="editor"
            v-model.async="ruleForm.announcementContent"
          ></EditorInput>
        </el-form-item>

        <!--        <div v-hmtl="ruleForm.announcementContent"></div>-->
        <el-form-item
          label="公告有效期"
          prop="validDate"
        >
          <el-radio-group v-model="ruleForm.validDate">
            <el-radio
              :label="0"
            >
              永久
            </el-radio>
            <el-radio
              :label="dayNum"
            >
              <template #default>
                &nbsp;
              </template>
            </el-radio>
            <el-input
              v-model="dayNum"
              class="inline-block w-40"
              type="number"
              :min="1"
              placeholder="请输入天数"
            >
              <template #suffix>
                <div class="text-black">
                  天
                </div>
              </template>
            </el-input>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <div class=" w-full flex justify-around py-20">
            <el-button
              class="w-36"
              @click="submitForm(ruleFormRef, ruleForm.id? 2: 0)"
            >
              {{ btnText }}
            </el-button>

            <el-button
              v-loading="isLoading"
              :element-loading-text="'btnText'"
              :disabled="isLoading"
              type="primary"
              class="w-36"
              @click="submitForm(ruleFormRef,ruleForm.id?3: 1)"
            >
              {{ btnText }}并发布
            </el-button>
          </div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import districts from "@/utils/city.js";
import EditorInput from "@/components/EditorInput.vue";
import { computed, nextTick, reactive, ref, watch } from "vue";
import dateFormat from "@/utils/dateFormat.js";
import { ElForm, ElMessage, ElMessageBox } from "element-plus";
import { all, announcementDelete, exportAnnouncement, list, release, takeDown, update } from "@/api/announcement";
import rules from "@/utils/rules";
import SchoolSelect from "@/components/SchoolSelect/index.vue";
import { useRouter } from "vue-router";
import { pageSize, pageSizes } from "@/hooks/pagination";
import { AreaInformation, DailyPhysical } from "@/interface/data-overview";
import checkPermissions from "@/hooks/checkPermissions";
import { useStore } from "vuex";

type FormInstance = InstanceType<typeof ElForm>

const openEdit = ref(false);
const router = useRouter();
const formRef = ref<FormInstance>();
const dialogFormVisible = ref(false);
const schoolType = ref("");
const isCreate = ref(true);
const datePicker = ref([]);
const ruleFormRef = ref<FormInstance>();
const editor: any = ref("");
const isLoading = ref<boolean>(false);
const formSize = ref("large");

const btnText = ref("保存");
const filterData: any = reactive({
  title: "",
  subtitle: "",
  pageNum: 1,
  pageSize,
  schoolId: 1,
  dailytestGrade: "",
  startDate: undefined,
  endDate: undefined
});
const teacherId = useStore().state.User?.userRoles?.teacherId;
const clientList = computed(() => {
  if (teacherId) return ["家长端", "校外家长端"];
  return ["教师端", "家长端", "校外家长端"];
});
const addHandler = (tableItem: any) => {
  const item: any = { ...tableItem, classId: tableItem?.classList?.id };
  if (addTableData.value.filter((data: any) => data.classId === item.classId).length) {
    return ElMessage.warning("班级已存在");
  }
  addTableData.value.push(item);
};
const dayNum = ref("");
let addTableData: any = ref([]);
const add = () => {
  openEdit.value = true;
  btnText.value = "保存";
  nextTick(() => {
    resetForm(ruleFormRef.value);

    addTableData.value = [];
    setTimeout(() => {
      editor.value.reset();
      editor.value.valueHtml = " ";
      ruleForm.value.announcementContent = " ";

    }, 400);
  });
};
const deleteTableItem = (index: number) => {

  addTableData.value.splice(index, 1);
};
const changeDate = (dataArr: [string, string]) => {
  filterData.startDate = dataArr[0];
  filterData.endDate = dataArr[1];
};
watch(() => dayNum.value, () => {
  ruleForm.value.validDate = dayNum.value;

});
const changeDay = (value: number) => {
  if (value !== 0) {
    ruleForm.value.validDate = dayNum.value;
  }

};

let dailytestId = ref(0);
const toInfo = (row: any) => {
  if (row.announcementState === "0") {
    return release(row.id).then((res: any) => {
      if (res.code == 200) {
        ElMessage({
          message: "发布成功.",
          type: "success"
        });
        return getEm();

      }
      ElMessage({
        message: "发布失败.",
        type: "error"
      });
    });
  } else {
    takeDown(row.id).then((res: any) => {
      if (res.code == 200) {
        ElMessage({
          message: "下架成功.",
          type: "success"
        });
        return getEm();
      }
      ElMessage({
        message: "下架失败.",
        type: "error"
      });
    });
  }

};

const areaInformation = new AreaInformation();
const tableItem = ref({
  announcementCityCode: areaInformation.city,
  announcementDistrictCode: areaInformation.district,
  announcementProvinceCode: areaInformation.province,
  schoolIds: new DailyPhysical().schoolId,
  classIds: undefined
});
let classList: any = ref([]);

let ruleForm: any = ref({
  announcementContent: "",
  id: undefined,
  validDate: 0,
  subtitle: "",
  title: "",
  list: [],
  publishObject: []
});
const openCreateDialog = (row: any) => {
  openEdit.value = true;
  btnText.value = "修改";
  nextTick(() => {
    ruleForm.value.validDate = row.validDate;
    ruleForm.value.subtitle = row.subtitle;
    ruleForm.value.title = row.title;
    ruleForm.value.id = row.id;
    ruleForm.value.announcementContent = row.announcementContent;
    ruleForm.value.publishObject = row.publishObject;
    addTableData.value = row.list
      .map((item: any) => {
        // if(item.classList.length) {
        item.classList = item.classList?.[0] ?? undefined;
        // }else
        // if(item.schoolList.length) {
        item.schoolList = item.schoolList?.[0] ?? undefined;
        // }
        // item.classInfo = item.schoolInfo = {}
        // item.classInfo.class_name = item.className
        // item.schoolInfo.schoolName
        // item.classInfo = item.classList
        // item.schoolInfo = item.schoolList
        return item;
      });
  });


};
const options = ref([]);


function checkFormData() {
  if (!formRef.value) return false;
  let isPass = true;
  formRef.value.validate((val: boolean) => {
    console.log("验证的值", val);
    isPass = val;
  });
  return isPass;
}

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};

function updateClassList() {
  if (!checkFormData()) return;
  const params = { ...ruleForm, dailytestId: dailytestId.value };
  update(params)
    .then((res: any) => {
      if (res.code == 200) {
        ElMessage({
          message: "更新成功.",
          type: "success"
        });
        getEm();
        return resetForm(formRef.value);
      }
      ElMessage({
        message: "更新失败.",
        type: "error"
      });
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

function deletePe(id: number) {
  ElMessageBox.confirm("确定要删除所选公告", "Warning", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    announcementDelete(id.toString())
      .then((res: any) => {
        if (res.code === 200) {
          ElMessage({
            message: "删除成功.",
            type: "success"
          });
          return getEm();
        }
        ElMessage({
          message: "删除失败.",
          type: "error"
        });
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
  list(filterData).then((res: { data: any }) => {
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

const submitForm = (formEl: FormInstance | undefined, urlIndex = 0) => {
  if (!formEl) return;
  formEl.validate((valid: boolean) => {
    if (valid) {
      isLoading.value = true;
      const list = addTableData.value.map((data: any) => {
        let item: any = {
          announcementCityCode: data.announcementCityCode,
          announcementDistrictCode: data.announcementDistrictCode,
          announcementProvinceCode: data.announcementProvinceCode
        };
        if (data?.schoolList?.id) {
          item.schoolList = [data.schoolList];
        } else {
          delete item.schoolList;
        }
        if (data?.classList?.id) {
          item.classList = [data.classList];
        } else {
          delete item.classList;
        }
        return item;
      });
      const parmeter = { ...ruleForm.value, list, publishObject: ruleForm.value.publishObject };
      // parmeter.randomtestProjectList = JSON.stringify(parmeter.randomtestProjectList)
      all(parmeter, urlIndex).then((res: any) => {
        if (res.code === 200) {
          openEdit.value = false;
          ElMessage({
            message: "成功",
            type: "success"
          });
          getEm();
          resetForm(formEl);
        }
        isLoading.value = false;
      }).catch((error: any) => {
        isLoading.value = false;
        console.log(error);
        const { message } = error;
        ElMessage({
          message,
          type: "error"
        });
        // ElMessage.error(message)
      });
      console.log("submit!");
    } else {
      console.error("error submit!");
      return false;
    }
  });
};

</script>

<style lang="css" scoped>
.level-view {
  @apply absolute top-[3000px] right-[3000px]
}


</style>
