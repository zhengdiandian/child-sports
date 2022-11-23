<script setup lang="ts">
import { reactive, ref } from "vue";
import { useStore } from "vuex";
import { pageSizes } from "@/hooks/pagination";
import {
  downloadScoreCardTemplate,
  randomTestDataDownloadTemplate,
  randomTestDataExport,
  randomTestDataImport,
  randomTestDataList,
  randomTestDataUpdate
} from "@/api/randomtest";
import { ElMessage } from "element-plus";
import RandomTestInfoBar from "@/views/sampling/components/RandomTestInfoBar.vue";
import dataProcessing from "@/hooks/dataProcessing";
import TimeInput from "@/components/TimeInput.vue";

import checkPermissions from "@/hooks/checkPermissions";
import { findColor } from "@/utils/levelColors";

const save = (row: any) => {
  row.isEdit = !(row?.isEdit);
  if (!row.isEdit) {
    const parmeter = {
      studentId: row.studentId,
      randomTestId: randomtestId,
      projectData: row.projectData
      //   .map(item => {
      //   item.projectData = +item.projectData;
      //   return item;
      // })
    };
    randomTestDataUpdate(parmeter).then((res: { code: number, message: string }) => {
      const { message, code } = res;
      if (code == 200) {
        onSubmit();
        ElMessage.success(message);
      } else {
        ElMessage.error(message);
      }
    });
  }
};
const randomtestId = useStore().state.RandomTest.randomtestId;
const state = ref({

  total: 0,
  list: []
});
const pageSize = ref(10);
const pageNum = ref(1);
const formInline = reactive({
  fuzzyQuery: undefined,
  pageNum: pageNum,
  pageSize: pageSize,
  randomtestId
});
const onSubmit = () => {
  randomTestDataList(formInline).then((res: any) => {
    state.value = (res.data);
  });
};
onSubmit();

function handleSizeChange(size: number) {
  pageSize.value = size;
  onSubmit();
}

function handleCurrentChange(currentPage: number) {
  pageNum.value = currentPage;
  onSubmit();
}

// watch(() => pageNum.value, onSubmit, );
// watch(() => pageSize.value, onSubmit, );
const exportData = () => {
  randomTestDataExport({ randomtestId, fuzzyQuery: formInline.fuzzyQuery });
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
    formData.append("randomtestId", randomtestId);
    randomTestDataImport(formData).then(res => {
      fileInput.value.value = null;
      const { message, code } = res;
      if (code == 200) {
        onSubmit();
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
  <div class=" px-2.5 pt-3 bg-gray-100 min-h-modal">
    <div class="wrapper bg-white">
      <RandomTestInfoBar></RandomTestInfoBar>
      <el-form
        :inline="true"
        :model="formInline"
        class="demo-form-inline mt-6 flex justify-center lg:justify-start"
        size="large"
      >
        <el-form-item>
          <el-input
            v-model="formInline.fuzzyQuery"
            size="large"
            placeholder="请输入要查询的内容"
          />
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
      <el-table
        :data="state.list"
        class="max-h-min"
        style="width: 100%"
        table-layout="auto"
        :header-cell-style="{background:'#3470D0',color:'white'}"
      >
        <el-table-column
          align="center"
          prop="schoolName"
          label="学校"
          width="180"
        />
        <el-table-column
          align="center"
          header-align="center"
          prop="randomtestGroup"
          label="组号"
          width="100"
        />
        <el-table-column
          align="center"
          prop="className"
          label="班级名"
          width="220"
        />
        <el-table-column
          align="center"
          prop="studentCode"
          label="学籍号"
          width="190"
        />
        <el-table-column
          align="center"
          prop="studentName"
          label="姓名"
          width="180"
        />
        <el-table-column
          align="center"
          prop="studentGender"
          label="性别"
          width="90"
        />
        <el-table-column
          align="center"
          prop="testFree"
          label="是否免测"
          width="90"
        >
          <template #default="{row:{testFree}}">
            {{ testFree ? "是" : "否" }}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="score"
          label="总分"
          width="90"
        >
          <template #default="{row:{scoreLevel, score}}">
            <div
              :style="{backgroundColor:findColor(scoreLevel)}"
              class="w-full h-full text-black"
            >
              {{ score }}
            </div>
          </template>
        </el-table-column>
        <template v-if="state.list.length">
          <el-table-column
            v-for="(item, key) in state.list[0].projectData"
            :key="key"
            :prop="item.projectName"
            align="center"
            class-name="text-black"
            :label="item.projectName"
            width="180"
          >
            <template #default="{row, column, $index}">
              <template
                v-if="row.isEdit&&column.label!=='BMI(千克/米2)'&& row.projectData[column.rawColumnKey]?.value !== null"
              >
                <time-input
                  v-if="['800米跑(秒)', '1000米跑(秒)', '50米×8往返跑(秒)'].includes(column.label)"
                  v-model.number="row.projectData[column.rawColumnKey].projectData"
                  @change="value => row.projectData[column.rawColumnKey].projectData = value"
                >
                </time-input>
                <el-input
                  v-else
                  v-model.number="row.projectData[column.rawColumnKey].projectData"
                  type="number"
                  @change="value => row.projectData[column.rawColumnKey].projectData = value"
                ></el-input>
              </template>

              <div v-else>
                {{
                  dataProcessing(row, column, "projectData")
                }}
              </div>
            </template>
          </el-table-column>
        </template>

        <!--      <el-table-column-->
        <!--        v-for="(item, key) in state.list[0].projectData"-->
        <!--        :key="key"-->
        <!--        align="center"-->
        <!--        :label="item.name"-->
        <!--        width="auto"-->
        <!--      >-->
        <!--        <template #default="{ row, column, $index}">-->
        <!--          {{ state.list[$index].projectData }}-->
        <!--        </template>-->
        <!--      </el-table-column>-->
        <!--      <el-table-column-->
        <!--        align="center"-->
        <!--        prop="name"-->
        <!--        label="身高(CM)"-->
        <!--        width="180"-->
        <!--      >-->
        <!--        <template #default="{row:{randomtestSchoolId}}">-->
        <!--          {{ randomtestSchoolId }}-->
        <!--        </template>-->
        <!--      </el-table-column>-->

        <el-table-column
          prop="name"
          label="成绩记录"
          width="180"
        />
        <el-table-column
          align="center"
          fixed="right"
          label="操作"
          width="auto"
          min-width="180"
        >
          <template #default="{row}">
            <el-button
              class="lg:text-base underline"
              type="text"
              size="default"
              :disabled="!checkPermissions('update')"
              @click="save(row)"
            >
              {{ row?.isEdit ? "保存" : "编辑" }}
            </el-button>
            <el-button
              class="lg:text-base underline"
              type="text"
              size="default"
              @click="$router.push({name: 'viewResults', query:$route.query})"
            >
              详情
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
            :disabled="!checkPermissions('update')"
            @click="importData"
          >
            导入数据
          </el-button>

          <!--        </label>-->
          <el-button
            size="large"
            class="lg:text-base"
            type="warning"
            @click="exportData"
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
              @click="downloadScoreCardTemplate({randomtestId })"
            >下载成绩登记卡</span>
          </el-button>
          <el-button
            class=" -mx-2"
            type="text"
          >
            <span class="iconfont icon-xiazai  text-4xl"></span>
            <span
              class=" underline text-black mx-2.5 lg:text-base"
              @click="randomTestDataDownloadTemplate({randomtestId})"
            >下载成绩导入模版</span>
          </el-button>
        </div>
        <el-pagination
          v-model:currentPage="state.pageNum"
          v-model:page-size="state.pageSize"
          class=""
          :page-sizes="pageSizes"
          :small="false"
          :disabled="false"
          :background="false"
          layout="total, sizes, prev, pager, next"
          :total="state.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>

</style>
