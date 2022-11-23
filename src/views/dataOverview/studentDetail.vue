<script setup lang="ts">
import { getStudentInfo } from "@/api/examData";
import { exportStudentTestData } from "@/api/peData";
import { check, history, progress } from "@/api/doStudent.ts";
// import use from "@/hooks/useHook";
import { reactive, ref } from "vue";
import { pageNum, pageSize, pageSizes } from "@/hooks/pagination";
import dateFormat from "@/utils/dateFormat";
import type { ElForm, TabsPaneContext } from "element-plus";
import { findColor, scoreToLevel } from "@/utils/levelColors";
import userHooks from "@/hooks/useHook";
import rules from "@/utils/rules";
import { ElMessage } from "element-plus/es";
import StackChart from "@/components/Charts/LineStackChart.vue";
import { avatarGeneration, gradeConversion } from "@/utils/baseData";
import checkPermissions from "@/hooks/checkPermissions";
import { useRoute } from "vue-router";

type FormInstance = InstanceType<typeof ElForm>
const formRef = ref<FormInstance>();
const studentId: any = useRoute().query.studentId;
let activeName = ref("");
const formData = reactive({
  project: activeName.value,
  pageNum: pageNum,
  pageSize: pageSize,
  studentId
});
let studentInfo: any = ref({});
getStudentInfo({ studentId }).then(({ data }: any) => {
  studentInfo.value = data;
});
const exportData = () => {
  const { schoolName, studentName, className } = studentInfo.value;
  const fileName = `${schoolName}-${className}-${studentName}`;
  exportStudentTestData(formData, fileName);
};
let tableList = ref({
  list: [],
  total: 0,
  pageNum: pageNum,
  pageSize: pageSize
});
let tabs: any = ref([]);


const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event);
  getList();
};
const getList = () => {
  history(formData).then(({ data }: any) => {
    // tableList.value = data;
    tableList.value.list = data.records.map((record: any) => {
      const { startDate, endDate } = record;
      record.dataList = record.dataList.map((item: any) => {
        item.startDate = startDate;
        item.endDate = endDate;
        return item;
      });
      return record;
    });
  });

};
(async () => {
  await progress({ studentId }).then(({ data }: any) => {
    tabs.value = data.map((item: any) => ({
      name: item?.projectName + `(${item?.unit})`,
      id: item?.projectField,
      projectName: item?.projectName
    }));
    formData.project = tabs.value[0].id;
    let cObj: any = {};
    data.map((item: any, i: number) => {
      const { level, target, dateList, testList, projectName, teacherList, targetList } = item;
      level.forEach((l: any) => l.level = l.name);
      cObj[item?.projectName] = {
        projectName: projectName,
        target,
        datas: dateList.map((date: string, index: number) => {
          return {
            projectData: testList[index]?.value ?? 0,
            target: targetList[index],
            standard: level,
            semester: date,
            projectName,
            teacherData: teacherList[index]?.value ?? 0

          };
        })

      };
      chartData.value = cObj;
    });
  });
  await getList();
})();

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
// listDataInThisSemester({ studentId } as StudentDetail).then(({ data }: any) => {
//   // const keys: [string] = Object.keys(data);
//   // keys.forEach((key: string) => {
//   //   chartData[key] = data[key];
//   // });
//   // chartData.value = { jumpRope: data.jumpRope };
//   chartData.value = Object.values(data).map((item: any) => {
//     return {
//       projectName: item.projectName,
//       datas: item.projectData.map((p: any) => {
//         return {
//           projectData: p.projectData,
//           semester: dateFormat(p.testDate, "yyyy-mm-dd"),
//           standard: item.standard
//         };
//       })
//     };
//   });
//
// });

let creatForm = reactive({
  date: undefined,
  id: undefined,
  teacherId: userHooks().id,
  value: undefined,
  targetId: undefined
});
const dialogFormVisible = ref(false);
const resetForm: any = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate((valid) => {
    if (valid) {
      const parmeter = creatForm;
      // parmeter.randomtestProjectList = JSON.stringify(parmeter.randomtestProjectList)
      check(parmeter).then((res: any) => {
        if (res.code === 200) {

          ElMessage({
            message: "成功",
            type: "success"
          });
          resetForm(formEl);
          dialogFormVisible.value = false;
          getList();
        }
      }).catch((error: any) => {
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
const checkHandle = (id: any, target = false) => {
  if (target) {
    creatForm.targetId = id;
    creatForm.id = undefined;
  } else {
    creatForm.id = id;

  }
  dialogFormVisible.value = true;
};
</script>
<template>
  <div class="bg-gray-100 space-y-4">
    <div class="bg-white px-2.5 py-3.5 flex nowrap justify-between ">
      <div class="flex nowrap items-center ">
        <img
          :src="avatarGeneration(studentInfo.studentGender)"
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
      <h3 class="text-2xl text-black font-semibold mb-4 ">
        进步情况
      </h3>
      <el-tabs
        v-model="formData.project"
        class="demo-tabs"
        @tab-click="handleClick"
      >
        <el-tab-pane
          v-for="{name, id, projectName} in tabs"
          :key="id"
          :label="name"
          :name="id"
        >
          <template #label>
            <span class="text-2xl">{{ projectName }}</span>
          </template>
          <!--          <span class="text-2xl">          {{ tab }}</span>-->
        </el-tab-pane>
      </el-tabs>
      <div
        v-for="(chart, i) in chartData"
        :key="i"
      >
        <StackChart
          v-if="chart.projectName ===tabs.find((item) =>item.id === formData.project)?.projectName"
          :only-one="true"
          :chart-data="chart"
        ></StackChart>
      </div>
    </div>
    <div class="bg-white px-2.5 py-3.5">
      <div class="flex justify-between">
        <h3 class="text-2xl text-black font-semibold mb-4 ">
          测试记录
        </h3>
        <!--        <el-button-->
        <!--          class="mr-5"-->
        <!--          type="text"-->
        <!--          @click="dialogFormVisible=true"-->
        <!--        >-->
        <!--          <span-->
        <!--            class="iconfont icon-jiajianzujianjiahao pr-1.5 text-blue"-->
        <!--          />-->

        <!--          <span class="text-black underline text-lg font">添加审核记录</span>-->
        <!--        </el-button>-->
      </div>


      <el-table

        :border="false"
        :data="tableList.list"
        :header-cell-style="{ background: '#3470D0', color: 'white' }"
      >
        <el-table-column type="expand">
          <template #default="props">
            <div>
              <!--              <p m="t-0 b-2">State: {{ props.row.state }}</p>-->
              <!--              <p m="t-0 b-2">City: {{ props.row.city }}</p>-->
              <!--              <p m="t-0 b-2">Address: {{ props.row.address }}</p>-->
              <!--              <p m="t-0 b-2">Zip: {{ props.row.zip }}</p>-->
              <!--              <h3 class="text-2xl text-black">-->
              <!--                自定义目标-->
              <!--              </h3>-->
              <el-table
                :data="props.row.dataList"
                :border="false"
              >
                <el-table-column
                  class-name="text-black"
                  label="来源"
                  prop="name"
                />
                <!--                <el-table-column-->
                <!--                  align="center"-->
                <!--                  class-name="text-black"-->
                <!--                  label="开始"-->
                <!--                  prop="startDate"-->
                <!--                  show-overflow-tooltip-->
                <!--                  width="120px"-->
                <!--                >-->
                <!--                  <template #default="{row: {startDate}}">-->
                <!--                    {{ dateFormat(startDate, "yyyy-mm-dd") }}-->
                <!--                  </template>-->
                <!--                </el-table-column>-->
                <el-table-column
                  align="center"
                  class-name="text-black"
                  label="结束"
                  prop="startDate"
                  show-overflow-tooltip
                  width="120px"
                >
                  <template #default="{row: {time}}">
                    {{ dateFormat(time, "yyyy-mm-dd") }}
                  </template>
                </el-table-column>
                <el-table-column
                  align="center"
                  class-name="text-black"
                  :label="tabs.find((item) =>item.id === formData.project)?.name"
                  prop="value"
                  show-overflow-tooltip
                  width="auto"
                >
                  <template #default="{row: {value}}">
                    {{ value }}
                  </template>
                </el-table-column>
                <el-table-column
                  align="center"
                  class-name="text-black"
                  label="目标达成度"
                  prop="value"
                  show-overflow-tooltip
                  width="auto"
                >
                  <template #default="{row: {ratio}}">
                    <div>
                      {{ ratio }}%
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  align="center"
                  class-name="text-black"
                  label="评分"
                  prop="score"
                  show-overflow-tooltip
                  width="auto"
                >
                  <template #default="{row: {score}}">
                    <div
                      class="text-white "
                      :style="{backgroundColor:findColor(scoreToLevel(score))}"
                    >
                      {{ score }}
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  fixed="right"
                  align="center"
                  label="操作"
                  prop="address"
                  width="220px"
                >
                  <template #default="{row:{name,id}}">
                    <el-link
                      v-if="name !=='自测记录'"
                      class="mr-4"
                      type="primary"
                      :disabled="!checkPermissions('update')"
                      @click="checkHandle(id)"
                    >
                      编辑
                    </el-link>
                    <!--                    <el-link-->
                    <!--                      class="mr-4"-->
                    <!--                      type="primary"-->
                    <!--                      @click="checkHandle(id)"-->
                    <!--                    >-->
                    <!--                      教师审核-->
                    <!--                    </el-link>-->
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          label="目标/测量"
          prop=""
          width="220"
        >
          <template #default="{row: {startDate}}">
            <span class="text-blue text-2xl">自定目标</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          class-name="text-black"
          label="开始"
          prop="startDate"
          show-overflow-tooltip
          width="120px"
        >
          <template #default="{row: {startDate}}">
            <span class="text-blue">
              {{ dateFormat(startDate, "yyyy-mm-dd") }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          class-name="text-black"
          label="结束"
          prop="endDate"
          show-overflow-tooltip
          width="120px"
        >
          <template #default="{row: {endDate}}">
            <span class="text-blue">
              {{ endDate ? dateFormat(endDate, "yyyy-mm-dd") : "--" }}

            </span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          class-name="text-black"
          :label="tabs.find((item) =>item.id === formData.project)?.name"
          prop="peTeacher"
          show-overflow-tooltip
          width="auto"
        >
          <template #default="{row: {targetValue}}">
            <span class="text-blue">
              {{ targetValue ?? "--" }}
            </span>
          </template>
        </el-table-column>
        <!--        <el-table-column-->
        <!--          align="center"-->
        <!--          label="百分比"-->
        <!--          prop="address"-->
        <!--          width="220px"-->
        <!--        >-->
        <!--          <template #default="scope">-->
        <!--            <el-link-->
        <!--              class="mr-4"-->
        <!--              type="primary"-->
        <!--              :disabled="!scope.row.state"-->
        <!--            >-->
        <!--              编辑-->
        <!--            </el-link>-->
        <!--          </template>-->
        <!--        </el-table-column>-->
        <el-table-column
          align="center"
          label="评分"
          prop="score"
          width="220px"
        >
          <template #default="{row: {score}}">
            <span class="text-blue">
              {{ score ?? "--" }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          align="center"
          label="操作"
          prop="address"
          width="220px"
        >
          <template #default="scope">
            <el-link
              :disabled="!checkPermissions('add')"
              class="mr-4"
              type="primary"
              @click="checkHandle(scope.row.targetId, true)"
            >
              添加审核记录
            </el-link>
          </template>
        </el-table-column>
      </el-table>
      <div class="flex justify-between mt-5">
        <div class="space-x-10 ">
          <!--          <el-button-->
          <!--            size="large"-->
          <!--            class="lg:text-base"-->
          <!--            type="warning"-->
          <!--            @click="exportData"-->
          <!--          >-->
          <!--            导出数据-->
          <!--          </el-button>-->
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


  <el-dialog
    v-model="dialogFormVisible"
    destroy-on-close
    title="添加审核记录"
    center
  >
    <template #title>
      <h3
        class="text-blue text-left"
      >
        <span class="iconfont icon-jiajianzujianjiahao pr-1.5" />
        <span class="text-black text-lg font-medium"> 添加审核记录 </span>
      </h3>
    </template>
    <el-form
      ref="formRef"
      :model="creatForm"
      :rules="rules"
      class="mx-8"
      label-position="left"
      label-width="126px"
    >
      <el-form-item
        label="日期："
        prop="date"
      >
        <el-date-picker
          v-model="creatForm.date"
          class="w-full date-picker"
          type="date"
          value-format="YYYY-MM-DD HH:mm:ss"
        />
      </el-form-item>
      <el-form-item
        :label="tabs.find((item) =>item.id === formData.project)?.name"
        prop="value"
      >
        <el-input
          v-model="creatForm.value"
          autocomplete="off"
          placeholder="请输入"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>

        <el-button
          type="primary"
          @click="submitForm(formRef)"
        >保存</el-button>
      </span>
    </template>
  </el-dialog>
</template>


<style lang="scss" scoped>


</style>
