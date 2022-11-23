<script lang="ts" setup>
import { reactive, ref, watch } from "vue";
import { downloadTemplate, randomTestExport, randomTestImport, randomtestList } from "@/api/randomtest";
import { handleCurrentChange, handleSizeChange, pageNum, pageSize, pageSizes } from "@/hooks/pagination";
import { Grade, gradeConversion, SchoolType } from "@/utils/baseData";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { ElMessage } from "element-plus";
import dateFormat from "@/utils/dateFormat";
import checkPermissions from "@/hooks/checkPermissions";

const router = useRouter();
// const pageSize = ref(10)
// const pageNum  = ref(1)
// const total = ref(0)
const store = useStore();
let state = ref({
  total: 0,
  list: []
});

const formInline = reactive({
  fuzzyQuery: undefined,
  pageNum: pageNum,
  pageSize: pageSize,
  randomtestGrade: undefined,
  randomtestSchoolType: undefined,
  randomtestStartDate: undefined
});
const shortcuts = [
  {
    text: "今天",
    value: new Date()
  },
  {
    text: "昨天",
    value: () => {
      const date = new Date();
      date.setTime(date.getTime() - 3600 * 1000 * 24);
      return date;
    }
  },
  {
    text: "一周以前",
    value: () => {
      const date = new Date();
      date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
      return date;
    }
  }
];
const getData = () => {
  randomtestList(formInline).then(({ data: res }) => {
    // state.value = (res)
    state.value.total = res.total;
    state.value.list = res.list;
    // tableList = res.list
  });
};

getData();

const disabledDate = (time: Date) => {
  return time.getTime() > Date.now();
};
const goViewResults = ({ randomtestId }) => {
  store.commit("RandomTest/randomtestId", randomtestId);
  router.push({ name: "viewResults", query: { randomtestId } });
};
const goViewInfo = ({ randomtestId }) => {
  store.commit("RandomTest/randomtestId", randomtestId);
  router.push({ name: "viewInfo", query: { randomtestId } });
};
const goSamplingRelease = (randomtest) => {
  debugger;
  const { randomtestId, randomtestProjects } = randomtest;
  randomtest.randomtestProjectList = randomtestProjects;
  store.commit("RandomTest/randomtest", { ...randomtest });
  store.commit("RandomTest/randomtestId", randomtestId);
  router.push({ name: "samplingRelease", query: { randomtestId } });
};
const onSubmit = () => {
  getData();
};
watch(pageNum, getData, { deep: true });
watch(pageSize, getData, { deep: true });
const exportData = () => {
  randomTestExport(formInline).then((res) => {
    res;
  });
};

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
    randomTestImport(formData).then((res: any) => {
      fileInput.value.value = null;
      const { message, code } = res;
      if (code == 200) {
        getData();
        ElMessage.success(message);
      } else {
        ElMessage.error(message);
      }
    }).catch(() => {
      fileInput.value.value = null;
    });
    // readyFile.status = 'loading' // 上传之前将状态设置为loading
    // axios.post(props.actions, formData, {
    //   headers: {
    //     "Content-Type": 'multipart/form-data'
    //   }
    // }).then(resp=> {
    //   console.log('resp', resp)
    //   readyFile.status = 'success' // 上传成功将状态设置为success
    // }).catch(error=> {
    //   readyFile.status = 'error' // // 上传失败将状态设置为error
    // })
  }
};
</script>

<template>
  <div class="px-2.5 pt-3 bg-gray-100 min-h-modal">
    <div class="wrapper bg-white">
      <div class="flex justify-items-start my-4  ">
        <el-form
          :inline="true"
          :model="formInline"
          class="demo-form-inline mt-6"
          size="large"
        >
          <el-form-item label="学校类别">
            <el-radio-group
              v-model="formInline.randomtestSchoolType"
              size="large"
            >
              <el-radio
                v-for="{ label } in SchoolType"
                :key="label"
                :label="label"
                :value="label"
              ></el-radio>

              <!--            <el-checkbox :key="label"-->
              <!--                         :value="label"-->
              <!--                         :label="label"-->
              <!--                         v-for="{label} in SchoolType">-->
              <!--            </el-checkbox>-->
            </el-radio-group>
          </el-form-item>
          <el-form-item>
            <el-select
              v-model="formInline.randomtestGrade"
              placeholder="请选择年级"
              size="large"
            >
              <el-option
                v-for="{ label, value } in Grade"
                :key="label"
                :label="label"
                :value="value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-date-picker
              v-model="formInline.randomtestStartDate"
              :shortcuts="shortcuts"
              placeholder="选择开始时间"
              size="large"
              type="date"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-input
              v-model="formInline.fuzzyQuery"
              placeholder="请输入要查询的内容"
              size="large"
            ></el-input>
          </el-form-item>

          <el-form-item>
            <el-button
              size="large"
              type="primary"
              @click="handleCurrentChange(1)"
            >
              查询
            </el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table
        v-model:data="state.list"
        :header-cell-style="{ background: '#3470D0', color: 'white' }"
        class="max-h-min"
        style="width: 100%"
        table-layout="auto"
      >
        <el-table-column
          align="center"
          label="抽测名称"
          prop="randomtestName"
          width="180"
        />
        <el-table-column
          align="center"
          header-align="center"
          label="抽测范围"
          prop="randomtestDistrict"
          width="180"
        />
        <el-table-column
          align="center"
          label="开始日期"
          prop="randomtestStartDate"
          width="180"
        >
          <template #default="{ row: { randomtestStartDate } }">
            {{ dateFormat(randomtestStartDate, "yyyy-mm-dd") }}
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          label="结束日期"
          prop="randomtestEndDate"
          width="180"
        >
          <template #default="{ row: { randomtestEndDate } }">
            {{ dateFormat(randomtestEndDate, "yyyy-mm-dd") }}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="学校类型"
          prop="randomtestSchoolType"
          width="180"
        />
        <el-table-column
          align="center"
          label="抽测年级"
          prop="randomtestGrade"
          width="180"
        >
          <template #default="{ row: {randomtestGrade}}">
            {{ gradeConversion(randomtestGrade) }}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="年级编号"
          prop="name"
          width="90"
        />
        <el-table-column
          align="center"
          label="参与学校数"
          prop="name"
          width="120"
        >
          <template #default="{ row: { randomtestSchoolsIds } }">
            {{
              randomtestSchoolsIds?.length ?? "--"
            }}
          </template>
        </el-table-column>
        <el-table-column
          label="班级数"
          prop="name"
          width="120"
        >
          <template #default="{ row: { randomtestClassesIds } }">
            {{
              randomtestClassesIds?.length ?? "--"
            }}
          </template>
        </el-table-column>
        <el-table-column
          label="总人数"
          prop="randomtestStudentNum"
          width="180"
        />
        <el-table-column
          label="免测人数"
          prop="randomtestTestfreeNum"
          width="180"
        />
        <el-table-column
          label="发布人"
          prop="name"
          width="180"
        />
        <el-table-column
          label="抽测状态"
          prop="name"
          width="180"
        />
        <el-table-column
          label="成绩状态"
          prop="name"
          width="180"
        />
        <el-table-column
          fixed="right"
          label="操作"
          width="320"
        >
          <template #default="{ row }">
            <el-button
              class="lg:text-base underline"
              size="large"
              type="text"
              :disabled="!checkPermissions('update')"

              @click="goSamplingRelease(row)"
            >
              修改
            </el-button>
            <el-button
              class="lg:text-base underline"
              size="default"
              type="text"
              :disabled="!checkPermissions('select')"

              @click="goViewInfo(row)"
            >
              抽测详情
            </el-button>
            <el-button
              class="lg:text-base underline"
              size="large"
              type="text"
              :disabled="!checkPermissions('select')"
              @click="goViewResults(row)"
            >
              结果查看
            </el-button>
            <el-button
              class="lg:text-base underline"
              size="large"
              type="text"
              :disabled="!checkPermissions('update')"
              @click="$router.push({name:'adjustClass', query:{randomtestId:row.randomtestId}})"
            >
              调整班级
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="flex justify-between mt-5">
        <div class="space-x-10">
          <input
            v-show="false"
            id="fileInput"
            ref="fileInput"
            type="file"
            @change="fileChange"
          />
          <!--        <label for="fileInput"  class="inline-block">-->
          <el-button
            class="lg:text-base px-6"
            size="large"
            type="primary"
            :disabled="!checkPermissions('add')"
            @click="importData"
          >
            导入数据
          </el-button>

          <!--        </label>-->
          <el-button
            class="lg:text-base"
            size="large"
            type="warning"
            @click="exportData"
          >
            导出数据
          </el-button>
          <el-button
            class="-mx-2"
            type="text"
          >
            <span class="iconfont icon-xiazai text-4xl"></span>
            <span
              class="underline text-black mx-2.5 lg:text-base"
              @click="downloadTemplate()"
            >下载模板</span>
          </el-button>
        </div>
        <el-pagination
          v-model:currentPage="pageNum"
          v-model:page-size="pageSize"
          :background="false"
          :disabled="false"
          :page-sizes="pageSizes"
          :small="false"
          :total="state.total"
          class=""
          layout="total, sizes, prev, pager, next"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
