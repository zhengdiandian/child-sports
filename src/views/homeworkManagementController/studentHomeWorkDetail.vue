<script setup lang="ts">
import { nextTick, reactive, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  exportStudentHomeworkHistory,
  listStudentHomeworkById,
  reviewHomework,
  studentHomeworkHistory
} from "@/api/homeworkManagementController";
import { pageSize, pageSizes } from "@/hooks/pagination";
import type { TabsPaneContext } from "element-plus";
import { ElForm } from "element-plus";
import dateFormat from "@/utils/dateFormat.js";
import { getStudentInfo } from "@/api/examData";
import "vue3-video-play/dist/style.css";
import { ElMessage } from "element-plus/es";
import rules from "@/utils/rules";
import { avatarGeneration, gradeConversion } from "@/utils/baseData";
import ClassHomeWorkDetail from "@/views/homeworkManagementController/classHomeWorkDetail.vue";
import checkPermissions from "@/hooks/checkPermissions";

const formSize = ref("large");

const router = useRouter();
let { studentId, homeworkId } = useRoute().query;
const toInfo = (id: any) => {
  router.replace({ name: "studentHomeWorkDetail", query: { studentId, homeworkId: id } });
  activeName.value = "detail";
  homeworkId = id;
  getDetails(homeworkId);
};
const filterData: any = reactive({
  studentId,
  "pageNum": 1,
  "pageSize": pageSize

});
const tableData = reactive({
  pageNum: 0,
  pageSize: pageSize,
  total: 0,
  totalPage: 1,
  list: []
});
const options = ({
  width: "100%", //播放器高度
  height: "450px", //播放器高度
  color: "#409eff", //主题色
  title: "", //视频名称
  picUrl: "",
  src: "", //视频源
  muted: false, //静音
  webFullScreen: false,
  speedRate: ["0.75", "1.0", "1.25", "1.5", "2.0"], //播放倍速
  autoPlay: false, //自动播放
  loop: false, //循环播放
  mirror: false, //镜像画面
  ligthOff: false, //关灯模式
  volume: 0.3, //默认音量大小
  control: true, //是否显示控制
  controlBtns: [
    "audioTrack",
    "quality",
    "speedRate",
    "volume",
    "setting",
    "pip",
    "pageFullScreen",
    "fullScreen"
  ] //显示所有按钮,
});
const homeworkVideoList: any = ref([]);
const detail = ref({});
const getDetails = (id: any = homeworkId) => {

  listStudentHomeworkById({ studentId, homeworkId: id }).then((res: { data: any }) => {
    const { data } = res;
    detail.value = data;
    nextTick(() => {
      creatForm.commentary = data?.reviewsInfo?.commentary ?? "";
      creatForm.commentaryScore = data?.reviewsInfo?.commentaryScore ?? undefined;
    });
    if (data?.homeworkVideo) {
      homeworkVideoList.value = data?.homeworkVideo?.map((v: { picUrl: string, videoUrl: string }) => {
        let o = { ...options };

        o.src = v.videoUrl.replace("https:", "http:");
        o.picUrl = v.picUrl;
        return o;
      });
    } else {
      homeworkVideoList.value = [];
    }


  });

};
const getHistory = () => {
  studentHomeworkHistory(filterData).then((res: { data: any }) => {
    const { data } = res;
    tableData.pageNum = data.pageNum;
    tableData.list = data.list;
    tableData.total = data.total;
  });
};
const studentInfo = ref({});
getStudentInfo({ studentId }).then(({ data }: any) => {
  studentInfo.value = data;
});
const activeName = ref("detail");
watch(() => activeName.value, () => {
  if (activeName.value === "history") {
    getHistory();
  } else {
    getDetails();
  }
}, {
  immediate: true
});
const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab.props.name, event);
};

function handleSizeChange(size: number) {
  filterData.pageSize = size;
  getHistory();
}

function handleCurrentChange(currentPage: number) {
  filterData.pageNum = currentPage;
  getHistory();
  console.log("页吗改变", filterData);
}


const ruleFormRef = ref<FormInstance>();

type FormInstance = InstanceType<typeof ElForm>
let creatForm: any = ref({
  "commentary": "",
  "commentaryScore": undefined,
  homeworkId,
  "studentIds": []
}).value;
const isLoading = ref<boolean>(false);

const submitForm = (formEl: FormInstance | undefined, urlIndex = 0) => {
  if (!formEl) return;
  formEl.validate((valid: any) => {
    if (valid) {
      isLoading.value = true;
      const parameter = { ...creatForm };
      parameter.studentIds = [studentId];

      reviewHomework(parameter).then((res: any) => {
        if (res.code === 200) {
          ElMessage({
            message: "点评成功",
            type: "success"
          });
          // resetForm(formEl);
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
      });
      console.log("submit!");
    } else {
      console.error("error submit!");
      return false;
    }
  });
};

function checkFormData() {
  if (!ruleFormRef.value) return false;
  let isPass = true;
  ruleFormRef.value.validate((val: any) => {
    console.log("验证的值", val);
    isPass = val;
  });
  return isPass;
}

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};


</script>
<template>
  <div class="bg-white px-2.5 py-3.5 flex nowrap justify-between ">
    <div class="flex nowrap items-center ">
      <img
        :src="avatarGeneration(studentInfo?.studentGender)"
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
                {{ studentInfo?.studentGender }}
              </span>
            </div>
            <div class="square ">
              学籍号：<span class="text-blue truncate">
                {{ studentInfo?.studentCode }}
              </span>
            </div>
            <div class="square">
              是否免测：<span class="text-blue">
                {{ detail?.testFree ? "是" : "否" }}
              </span>
            </div>
            <div class="square">
              学校名称：<span class="text-blue">{{ studentInfo?.schoolName }}</span>
            </div>

            <div class="square">
              年&nbsp;&nbsp;&nbsp;&nbsp;级：<span class="text-blue">{{ gradeConversion(studentInfo?.studentGrade) }}</span>
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
  <div class="w-full h-4 bg-gray-100" />
  <div class="bg-white px-4 py-8">
    <el-tabs
      v-model="activeName"
      class="demo-tabs"
      @tab-click="handleClick"
    >
      <el-tab-pane
        name="history"
      >
        <template #label>
          <span class="text-2xl">历史作业</span>
        </template>
      </el-tab-pane>
      <el-tab-pane
        name="detail"
      >
        <template #label>
          <span class="text-2xl">学生作业详情</span>
        </template>
      </el-tab-pane>
    </el-tabs>
    <div
      v-if="activeName=== 'history'"
    >
      <div>
        <el-table
          :border="true"
          :data="tableData.list"
          :header-cell-style="{ background: '#3470D0', color: 'white' }"
        >
          <el-table-column
            align="center"
            label="日期"
            prop="studentName"
            width="120"
          >
            <template #default="{row:{homeworkDate}}">
              {{ homeworkDate ? dateFormat(homeworkDate) : "--" }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="作业名称"
            prop="homeworkName"
            width="auto"
          />
          <el-table-column
            align="center"
            label="体育老师"
            prop="peTeacher"
            width="80"
          />
          <el-table-column
            align="center"
            label="作业视频"
            prop="homeworkVideo"
            width="90"
          >
            <template #default="{row:{homeworkVideo}}">
              {{ homeworkVideo ? "已提交" : "未提交" }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            class-name="text-black"
            label="作业提交时间"
            prop="submitTime"
            width="220"
          >
            <template #default="{row:{submitTime}}">
              {{ submitTime ? dateFormat(submitTime) : "--" }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            class-name="text-black"
            label="点评得分"
            prop="commentaryScore"
            width="90"
          >
            <template #default="{row:{commentaryScore}}">
              {{ commentaryScore ?? "--" }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="点评内容"
            prop="commentary"
            width="auto"
          >
            <template #default="{row:{commentary}}">
              {{ commentary ?? "--" }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="点评时间"
            prop="commentaryTime"
            width="220"
          >
            <template #default="{row:{commentaryTime}}">
              {{ commentaryTime ? dateFormat(commentaryTime) : "--" }}
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            width="220"
            align="center"
          >
            <template #default="{ row:{homeworkId} }">
              <el-button
                class="lg:text-base underline"
                size="large"
                type="text"
                @click="toInfo(homeworkId)"
              >
                作业详情
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="flex justify-between pt-5">
        <el-button
          size="large"
          class="lg:text-base"
          type="warning"
          @click="exportStudentHomeworkHistory(filterData, studentInfo.studentName)"
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
      v-else
    >
      <template v-if="homeworkVideoList.length">
        <div
          :class="[homeworkVideoList.length == 1 ?'': 'grid  grid-cols-2 gap-4 auto-cols-auto' ]"
        >
          <div
            v-for="(options, index) in homeworkVideoList"
            :key="index"
            class=""
          >
            <vue3VideoPlay

              v-bind="options"

              :poster="options.picUrl"
            />
          </div>
        </div>

        <div class="flex justify-end pr-8 mt-4">
          <div>完成日期: {{ dateFormat(detail?.submitTime) }}</div>
        </div>
      </template>
      <div
        v-else
        class="text-3xl text-center font-semibold  py-20"
      >
        <h1>暂未完成</h1>
      </div>
    </div>
  </div>
  <template
    v-if="activeName !== 'history'"
  >
    <div class="w-full h-4 bg-gray-100" />
    <div
      v-if="checkPermissions('add')"
      class="bg-white px-4 pt-8"
    >
      <div

        class="px-52 mt-6"
      >
        <el-form
          ref="ruleFormRef"
          :model="creatForm"
          :rules="rules"
          label-width="auto"
          class="demo-ruleForm "
          :size="formSize"
          :inline="true"
        >
          <el-form-item
            label="点评得分："
            prop="commentaryScore"
            class="w-18"
          >
            <el-input
              v-model.number="creatForm.commentaryScore"
              type="number"
              placeholder="请输入点评得分"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="点评内容："
            prop="commentary"
            class="w-full"
          >
            <el-input
              v-model.trim="creatForm.commentary"
              type="textarea"
              placeholder="请输入点评内容"
              :autosize="{ minRows: 8 }"
            ></el-input>
          </el-form-item>
          <el-form-item
            class="w-full"
          >
            <div class=" w-full flex justify-end mb-8 pr-10">
              <el-button
                v-loading="isLoading"
                :element-loading-text="'提交中...'"
                :disabled="isLoading|| !checkPermissions('add')"
                type="primary"
                class="w-36"
                @click="submitForm(ruleFormRef)"
              >
                点评
              </el-button>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="w-full h-4 bg-gray-100" />
    <div class="py-4">
      <ClassHomeWorkDetail></ClassHomeWorkDetail>
    </div>
    <div
      v-if="checkPermissions('add')"
      class="w-full h-4 bg-gray-100"
    />
  </template>
</template>


<style lang="scss" scoped>


</style>
