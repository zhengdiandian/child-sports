<script setup lang="ts">
import {
  exportStudentExamData,
  getStudentExamData,
  getStudentInfo,
  listNew,
  listStudentExamDataResult
} from "@/api/examData";
// import use from "@/hooks/useHook";
import { StudentDetail } from "@/interface/examData";
import { useRoute } from "vue-router";
import { reactive, ref } from "vue";
import { pageNum, pageSize, pageSizes } from "@/hooks/pagination";
import { Top } from "@element-plus/icons-vue";
import dateFormat from "@/utils/dateFormat";
import StackChart from "@/components/Charts/StackChart.vue";
import { avatarGeneration, gradeConversion } from "@/utils/baseData";

const studentId: any = useRoute().query.studentId;
const formData = reactive({
  fuzzyQuery: "",
  pageNum: pageNum,
  pageSize: pageSize,
  studentId,
  schoolexamDate: undefined
});
let studentInfo = ref({});
getStudentInfo({ studentId }).then(({ data }: any) => {
  studentInfo.value = data;
});
let tableList = ref({
  list: [],
  total: 0,
  pageNum: pageNum,
  pageSize: pageSize
});
const getList = () => {
  getStudentExamData(formData).then(({ data }: any) => {
    tableList.value = data;
  });

};
getList();
let newData: any = ref([]);
listNew({ studentId }).then(({ data }: any) => {
  newData.value = (data);
});

function handleSizeChange(size: number) {
  formData.pageSize = size;
  getList();
}

function handleCurrentChange(currentPage: number) {
  formData.pageNum = currentPage;
  getList();
  console.log("页吗改变", formData);
}

let chartData = ref({});
listStudentExamDataResult({ studentId } as StudentDetail).then(({ data }: any) => {
  // const keys: [string] = Object.keys(data);
  // keys.forEach((key: string) => {
  //   chartData[key] = data[key];
  // });
  // chartData.value = { jumpRope: data.jumpRope };
  chartData.value = data;

});
</script>
<template>
  <div class="wrapper bg-gray-100 space-y-4">
    <div class="bg-white px-2.5 py-3.5 flex nowrap justify-between ">
      <div class="flex nowrap items-center ">
        <img
          :src="avatarGeneration( studentInfo.studentGender) "
          alt=""
          class="w-20"
        >
        <div>
          <div class="ml-4">
            <div class="grid grid-cols-4 grid-row-2 gap-4 ">
              <div class="square ">
                姓&nbsp;&nbsp;&nbsp;&nbsp;名：<span class="text-blue">{{ studentInfo.studentName }}</span>
              </div>
              <div class="square">
                性&nbsp;&nbsp;&nbsp;&nbsp;别：<span class="text-blue truncate ">
                  {{ studentInfo.studentGender }}
                </span>
              </div>
              <div class="square ">
                学籍号：<span class="text-blue truncate">
                  {{ studentInfo.studentCode }}
                </span>
              </div>
              <div class="square">
                是否免测：<span class="text-blue">
                  {{ studentInfo.studentTestfree ? "是" : "否" }}
                </span>
              </div>
              <div class="square">
                学校名称：<span class="text-blue">{{ studentInfo.schoolName }}</span>
              </div>

              <div class="square">
                年&nbsp;&nbsp;&nbsp;&nbsp;级：<span class="text-blue">{{ gradeConversion(studentInfo.studentGrade)
                }}</span>
              </div>
              <div class="square">
                班&nbsp;&nbsp;&nbsp;&nbsp;级：<span class="text-blue">{{ studentInfo.className }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <el-button
        type="text"
        class="text-gray-700 text-lg"
        @click="$router.go(-1)"
      >
        <span class="iconfont icon-fanhui text-3xl"></span>
        <span class="underline align-text-bottom">返回</span>
      </el-button>
    </div>
    <div class="bg-white px-2.5 py-3.5">
      <h3 class="text-xl text-black font-semibold mb-4 ">
        <span class="iconfont icon-jiangpai-shi text-2xl text-yellow"></span>
        {{ dateFormat(newData?.schoolexamDate, "yyyy-mm-dd") }}体测成绩
      </h3>
      <el-table
        :border="true"
        :data="[newData]"
        :header-cell-style="{ background: '#3470D0', color: 'white' }"
      >
        <el-table-column
          align="center"
          label="考试日期"
          width="120"
        >
          <template #default="{row}">
            {{ dateFormat(row?.schoolexamDate, "yyyy-mm-dd") }}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="体育老师"
          width="120"
          prop="peTeacher"
        ></el-table-column>
        <el-table-column
          v-for="(item, key) in newData.projectData"
          :key="key"
          align="center"
          :label="item.name"
          width="auto"
        >
          <template #default="{ row, column, $index}">
            <div
              v-if="newData.projectData[key]?.data"
              class="text-black flex flex-col "
            >
              <p>
                {{ newData.projectData[key].name.includes("次") ? newData.projectData[key]?.data ?? 0 : newData.projectData[key].data.toFixed(2)
                }}
                <span v-if="newData.projectData[key].level">({{ newData.projectData[key].level }})</span>
                <span
                  :class="[Number.parseInt(newData.projectData[key].compareToLast)< 0? 'text-green-400':'text-red']"
                ><Top
                  class="w-[1em] inline-block "
                  :class="[Number.parseInt(newData.projectData[key].compareToLast)< 0? 'origin-center transform rotate-180':'']"
                ></Top>{{ newData.projectData[key].compareToLast
                }}</span>
              </p>

              <p v-if="newData.projectData[key]?.nextLevel">
                <template v-if="newData.projectData[key]?.level !== '优'">
                  <span class="text-xs">升档差距</span>
                  {{ newData.projectData[key].compareToStandard > 0 ? "+" : "" }}
                  {{ newData.projectData[key].name.includes("次") ? newData.projectData[key]?.compareToStandard ?? 0 : newData.projectData[key]?.compareToStandard.toFixed(2)
                  }}
                  ({{ newData.projectData[key].nextLevel }})
                </template>
              </p>
              <p v-else>
                --
              </p>
            </div>
            <p v-else>
              --
            </p>
            <!--            {{ row[key] }}-->
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="bg-white px-2.5 py-3.5">
      <h3 class="text-xl text-black font-semibold mb-4 ">
        <span class="iconfont icon-icon_jilu text-2xl text-yellow"></span> 历史体测成绩
      </h3>
      <div class="grid grid-cols-2 gap-4">
        <div
          v-for="(chart, i) in chartData"
          :key="i"
        >
          <StackChart
            :chart-data="chart"
          ></StackChart>
        </div>
      </div>

      <div class="space-x-6 nowrap  my-4">
        <!--      <div class="w-50 mx-4">-->
        <div class="inline-block text-black">
          月份：
          <el-date-picker
            v-model="formData.schoolexamDate"
            type="month"
            placeholder="请选择月份"
          />
        </div>
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
        :border="true"
        :data="tableList.list"
        :header-cell-style="{ background: '#3470D0', color: 'white' }"
      >
        <el-table-column
          align="center"
          label="序号"
          type="index"
          width="60"
        />
        <el-table-column
          align="center"
          class-name="text-black"
          label="体考学年"
          prop="schoolexamSemester"
          show-overflow-tooltip
          width="120px"
        />

        <el-table-column
          align="center"
          class-name="text-black"
          label="考试日期"
          prop="schoolexamDate"
          show-overflow-tooltip
          width="120px"
        >
          <template #default="{row: {schoolexamDate}}">
            {{ dateFormat(schoolexamDate, "yyyy-mm-dd") }}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          class-name="text-black"
          label="体育老师"
          prop="peTeacher"
          show-overflow-tooltip
          width="120px"
        />
        <el-table-column
          v-for="(item) in tableList?.list[0]?.projectData.map(p => p.projectName)"
          :key="item"
          align="center"
          class-name="text-black"
          :label="item"
          prop="studentGender"
          show-overflow-tooltip
          width="auto"
        >
          <template #default="{row}">
            {{ row.projectData.find(i => i.projectName === item).data ?? "--" }}
          </template>
        </el-table-column>
      </el-table>
      <div class="flex justify-between mt-5">
        <div class="space-x-10 ">
          <el-button
            size="large"
            class="lg:text-base"
            type="warning"
            @click="exportStudentExamData({...formData, studentId})"
          >
            导出数据
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


<style lang="scss" scoped>


</style>
