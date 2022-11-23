<script lang="ts" setup>
import ChartC from "@/components/Charts/Chart.vue";
import { useRoute } from "vue-router";
import {
  dailytestRes,
  downloadTemplate,
  lighting,
  list,
  listDailyTestById,
  peDataExport,
  peDataImport,
  update
} from "@/api/peData";
import { findColor } from "@/utils/levelColors";
import { computed, reactive, ref } from "vue";
import { Search } from "@element-plus/icons-vue";
import { ExamManagementResult } from "@/interface/examData";
import { pageSize, pageSizes } from "@/hooks/pagination";
import { ElMessage } from "element-plus/es";
import dateFormat from "@/utils/dateFormat";
import dataProcessing from "@/hooks/dataProcessing";
import TimeInput from "@/components/TimeInput.vue";
import checkPermissions from "@/hooks/checkPermissions";
import { statusNameList } from "@/utils/baseData";

const route = useRoute();
let { dailytestId }: any = route.query;
const disabledUpdate = (time: any): boolean => {
  return +new Date() - (+new Date(time) + 1000 * 60 * 60 * 24 * 7) > 0;
};
const downloadText = computed(() => {
  return peDataInfo.value.schoolName + peDataInfo.value.dailytestClassName + dateFormat(peDataInfo.value?.dailytestDate, "yyyy-mm-dd");
});
let formData: any = reactive({
  fuzzyQuery: "",
  pageNum: 1,
  pageSize: pageSize,
  dailytestId,
  studentGender: [],
  className: "",
  sort: undefined
});
const sortChangeHandler = ({ column, prop, order }) => {
  let sortText = `${prop}:`;
  if (order === "ascending") {
    sortText += "asc";
    formData.sort = sortText;
  }
  if (order === "descending") {
    sortText += "des";
    formData.sort = sortText;
  }
  if (order === "") {
    formData.sort = undefined;
  }
  getList();
};
const clickStatusHandler = (project: string, row: any, projectData: any) => {
  lighting({ dailytestId, project, studentId: row.studentId }).then((res: any) => {
    if (res.code === 200) {
      ElMessage.success(`${projectData.data ? "取消点亮" : "点亮"}${project}`);
      projectData.data = !projectData.data;
    }
  });

};
const genderList = ["男", "女"];
let tableList = ref({
  list: [],
  total: 0,
  pageNum: 1,
  pageSize: pageSize
});
let peDataInfo: any = ref({});
let chartData = ref(null);
const formatData = (data: any) => {
  const keys = Object.keys(data);
  const chartData: any = {
    // test: {"不及格":1.41,"优秀":3.41,"及格":64.86,"良好":1.32,"未完成率":0}
  };
  // let project = projectJson === undefined ? projectJson: 'totalScore'
// if (!avrScore) {
//
// }
  keys.forEach(key => {
    const { testfree, total, levelNum, avrScore, projectName } = data[key];
    let obj: any = {};

    levelNum.map(({ level, number }: any) => {
      obj[level] = number === 0 ? 0 : number;
      return obj;
    });
    // obj["未完成"] = testfree === 0 ? 0 : Math.round(testfree / total * 10000) / 100;
    chartData[projectName] = {};
    chartData[projectName] = obj;
    // Object.keys(levelNum).forEach((item:any) => {
    //   let  obj = {}
    //   obj[item.level] = Math.round(item.number / total * 10000) / 100;
    //   chartData[projectName] = obj;
    //
    // });
    // levelNum["未完成率"] = Math.round(testfree / total * 10000) / 100;
    // levelNum.avrScore = Math.round(avrScore * 100) / 100;
  });
  console.log("ok", chartData);
  // delete chartData.BMI;
  return chartData;
};

const save = (row: any) => {
  row.isEdit = !(row?.isEdit);
  if (!row.isEdit) {
    const parmeter = {
      studentId: row.studentId,
      dailytestId: dailytestId,
      projectData: row.projectData
    };
    update(parmeter).then((res: { code: number, message: string }) => {
      const { message, code } = res;
      if (code == 200) {
        getList();
        ElMessage.success(message);
      } else {
        ElMessage.error(message);
      }
    });
  }
};
// dailytestRes({ dailytestId }).then(({ data }: any) => {
//   chartData.value = formatData(data);
// });
// listDailyTestById({ dailytestId }).then((res: ExamManagementResult) => {
//   peDataInfo.value = res.data;
// });
const getList = () => {

  const studentGender = formData?.studentGender?.length == 2 ? undefined : formData?.studentGender[0];
  list({ ...formData, studentGender }).then(({ data }: any) => {
    tableList.value = data;
  });
};
const init = () => {
  dailytestRes({ dailytestId }).then(({ data }: any) => {
    chartData.value = formatData(data);
  });
  listDailyTestById({ dailytestId }).then((res: ExamManagementResult) => {
    peDataInfo.value = res.data;
  });
  getList();

};
init();

// onActivated(init)
function handleSizeChange(size: number) {
  formData.pageSize = size;
  getList();
}

function handleCurrentChange(currentPage: number) {
  formData.pageNum = currentPage;
  getList();
  console.log("页吗改变", formData);
}

// getList();
const fileInput: any = ref<null | HTMLInputElement>(null);

const exportData = (fileName: string) => {
  const studentGender = formData.studentGender.length === 2 ? undefined : genderList.find(item => item === formData.studentGender[0]);
  peDataExport({ dailytestId, fuzzyQuery: formData.fuzzyQuery, studentGender }, fileName);
};
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
    formData.append("dailytestId", dailytestId);
    peDataImport(formData).then((res: { message: string, code: number }) => {
      fileInput.value.value = null;
      const { message, code } = res;
      if (code == 200) {
        // onSubmit();
        getList();
        ElMessage.success(message);
      } else {
        ElMessage.error(message);
      }
    }).catch(() => {
      fileInput.value.value = null;
    });
  }
};
</script>
<template>
  <!--  <Search></Search>-->
  <div class=" bg-gray-100 space-y-4 min-h-modal">
    <div class="bg-white px-2.5 py-3.5">
      <h3 class="text-black text-2xl mb-4 font-semibold">
        {{ peDataInfo.dailytestName }}
      </h3>
      <div class="space-y-2">
        <div class="grid    grid-cols-4 gap-y-2">
          <div class="square">
            学校名称：<span class="text-blue truncate ">{{ peDataInfo.schoolName }}</span>
          </div>
          <div class="square ">
            班级信息：<span class="text-blue truncate">{{
              peDataInfo?.dailytestClassName ?? ""
            }}</span>
          </div>
          <div class="square">
            学生人数：<span class="text-blue">{{ peDataInfo?.dailytestStudentNum ?? 0 }}</span>
          </div>
          <div class="square">
            免测人数：<span class="text-blue">{{ peDataInfo?.dailytestTestfreeNum ?? 0 }}</span>
          </div>

          <div class="square ">
            体育课时间：<span class="text-blue">{{ dateFormat(peDataInfo?.dailytestDate, "yyyy-mm-dd")

            }}</span>
          </div>
          <div class="square col-span-2">
            训练项目：<span class="text-blue truncate">{{
              peDataInfo.dailytestProject ? (peDataInfo.dailytestProject).join("&nbsp;&nbsp;&nbsp;&nbsp;") : ""
            }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="bg-white px-2.5 py-3.5">
      <h3 class="text-xl text-black font-semibold mb-4 ">
        <span class="iconfont icon-shuzhuangtu text-2xl text-yellow"></span> 体育课项目成绩统计
      </h3>
      <ChartC
        v-if="chartData"
        :chart-data="chartData"
      ></ChartC>
    </div>
    <div class="bg-white px-2.5 py-3.5">
      <h3 class="text-xl text-black font-semibold ">
        <span class="iconfont icon-minganxinxizongjilushu text-2xl text-yellow"></span> 学生成绩详情
      </h3>

      <div class="space-x-6 nowrap  my-4">
        <!--      <div class="w-50 mx-4">-->
        <div class="inline-block text-black">
          性别：
          <el-checkbox-group
            v-model="formData.studentGender"
            class="inline-block"
          >
            <template
              v-for="label in genderList"
              :key="label"
            >
              <el-checkbox
                :label="label"
              >
                {{ label }}
              </el-checkbox>
            </template>
          </el-checkbox-group>
        </div>
        <!--        <el-select v-model="formData.className">-->
        <!--          <el-option-->
        <!--            v-for="schoolName in peDataInfo.dailytestClasses"-->
        <!--            :key="schoolName"-->
        <!--            :value="schoolName"-->
        <!--          ></el-option>-->
        <!--        </el-select>-->
        <el-input
          v-model="formData.fuzzyQuery"
          class="w-40"
          placeholder="请输入查询内容"
        >
          <template #prefix>
            <el-icon class="el-input__icon">
              <Search />
            </el-icon>
          </template>
        </el-input>
        <el-button
          class="rounded w-0"
          type="primary"
          @click="handleCurrentChange(1)"
        >
          搜索
        </el-button>
      </div>
      <el-table
        class="w-full"
        :border="true"
        :data="tableList.list"
        :header-cell-style="{ background: '#3470D0', color: 'white' }"
        @sort-change="sortChangeHandler"
      >
        <el-table-column
          align="center"
          label="序号"
          type="index"
          width="60"
          fixed="left"
        />
        <el-table-column
          align="center"
          class-name="text-black"
          label="姓名"
          prop="studentName"
          show-overflow-tooltip
          width="180px"
          fixed="left"
        />
        <el-table-column
          align="center"
          class-name="text-black"
          label="编号"
          prop="studentNumber"
          show-overflow-tooltip
          width="120px"
        />
        <el-table-column
          align="center"
          class-name="text-black"
          label="性別"
          prop="studentGender"
          show-overflow-tooltip
          width="60px"
        />
        <el-table-column
          align="center"
          class-name="text-black"
          label="是否免测"
          prop="testFree"
          width="100px"
        >
          <template #default="{row:{testFree}}">
            <div>{{ testFree ? "是" : "否" }}</div>
          </template>
        </el-table-column>
        <template v-if="tableList.list.length !== 0">
          <el-table-column

            v-for="(item , key) in tableList.list[0].projectData"
            :key="key"
            align="center"
            class-name="text-black"
            :label="item.projectName"
            :prop="item.projectName"
            show-overflow-tooltip
            width="180px"
            sortable="custom"
          >
            <template #default="{row, column, $index}">
              <el-button
                v-if="statusNameList.map(item => item.name).includes(column.label)"
                class="lg:text-base"
                type="text"
                size="default"
                :disabled="!checkPermissions('update')|| disabledUpdate(row.dailytestDate)"
                @click="clickStatusHandler(column.label, row, row.projectData[column.rawColumnKey])"
              >
                <div
                  class="iconfont text-2xl cursor-pointer"
                  :style="[row.projectData[column.rawColumnKey].data? `color:${statusNameList.find(i => i.name == column.label ).color};` : 'color: #333']"
                  :class="[statusNameList.find(item => item.name == column.label ).icon, ]"
                >
                </div>
              </el-button>

              <div
                v-else
                :style="{backgroundColor:findColor(row.projectData[column.rawColumnKey].level)}"
              >
                <template
                  v-if="row.isEdit&&column.label!=='BMI(千克/米2)'&& row.projectData[column.rawColumnKey]?.data !== null"
                >
                  <time-input
                    v-if="['800米跑(秒)', '1000米跑(秒)', '50米×8往返跑(秒)'].includes(column.label)"
                    v-model.number="row.projectData[column.rawColumnKey].data"
                    @change="value => row.projectData[column.rawColumnKey].data = value"
                  >
                  </time-input>
                  <el-input
                    v-else
                    v-model.number="row.projectData[column.rawColumnKey].data"
                    type="number"
                    :class="[findColor(row.projectData[column.rawColumnKey].data)]"
                    @change="value => row.projectData[column.rawColumnKey].data = value"
                  ></el-input>
                </template>

                <div v-else>
                  {{ row.projectData[column.rawColumnKey].level }}
                  {{
                    dataProcessing(row, column, "data")
                  }}
                  <!--                {{ column }}-->
                </div>
              </div>
            </template>
          </el-table-column>
        </template>
        <el-table-column
          align="center"
          class-name="text-black"
          label="测试时间"
          prop="dailytestDate"
          show-overflow-tooltip
          width="180px"
        >
          <template #default="{row: {dailytestDate}}">
            {{ dateFormat(dailytestDate, "yyyy-mm-dd") }}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          class-name="text-black"
          label="班级"
          prop="className"
          show-overflow-tooltip
          width="180px"
        />
        <!--        <el-table-column-->
        <!--          align="center"-->
        <!--          class-name="text-black"-->
        <!--          label="学籍号"-->
        <!--          prop="studentCode"-->
        <!--          show-overflow-tooltip-->
        <!--          width="180px"-->
        <!--        />-->
        <el-table-column
          fixed="right"
          label="操作"
          width="auto"
          min-width="220"
          align="center"
        >
          <template #default="{row}">
            <el-button
              class="lg:text-base underline"
              type="text"
              size="default"
              :disabled="!checkPermissions('update')|| disabledUpdate(row.dailytestDate)"
              @click="save(row)"
            >
              {{ row?.isEdit ? "保存" : "编辑" }}
            </el-button>

            <el-button
              class="lg:text-base underline"
              type="text"
              size="default"
              :disabled="!checkPermissions('select')"
              @click="$router.push({name:'studentDetail', query: {studentId: row.studentId, dailytestId}})"
            >
              学生体育课详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="flex justify-between mt-5">
        <div class="space-x-10 ">
          <input
            v-show="false"
            id="fileInput"
            ref="fileInput"
            type="file"
            @change="fileChange"
          >
          <!--        <label for="fileInput"  class="inline-block">-->
          <el-button
            size="large"
            class="lg:text-base px-6"
            type="primary"
            :disabled="disabledUpdate(peDataInfo?.dailytestDate)"
            @click="importData"
          >
            导入数据
          </el-button>

          <!--        </label>-->
          <el-button
            size="large"
            class="lg:text-base"
            type="warning"
            @click="exportData(downloadText)"
          >
            导出数据
          </el-button>
          <el-button
            class=" -mx-2"
            type="text"
          >
            <span class="iconfont icon-xiazai  text-4xl"></span>
            <span
              class=" underline text-black mx-2.5 lg:text-base"
              @click="downloadTemplate({dailytestId}, downloadText)"
            >下载模板</span>
          </el-button>
        </div>
        <el-pagination
          v-model:currentPage="tableList.pageNum"
          v-model:page-size="tableList.pageSize"
          class=""
          :page-sizes="pageSizes"
          :small="false"
          :disabled="false"
          :background="false"
          layout="total, sizes, prev, pager, next"
          :total="tableList.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
