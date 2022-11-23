<script setup lang="ts">
import { useRoute } from "vue-router";
import { homeworkInfo } from "@/api/homeworkManagementController";
import { ref } from "vue";
import { gradeConversion } from "@/utils/baseData";
import dateFormat from "@/utils/dateFormat.js";

const route = useRoute();
const { homeworkId } = route.query;
const detail: any = ref({});
homeworkInfo({ homeworkId }).then(({ data }: any) => {
  detail.value = data;
});
</script>
<template>
  <div class="px-4">
    <div class="w-full flex justify-between  pb-10 pt-3">
      <div>
        <h3 class="text-xl text-[#666666]  flex items-center">
          <span
            class="pl-2"
          >发布日期：{{ dateFormat(detail?.homeworkDate) }}</span>
        </h3>
      </div>
      <h1 class="text-black text-3xl font-semibold">
        {{ detail?.homeworkName }}
      </h1>
      <div>
        <el-button
          type="text"
          class="text-gray-700 text-lg"
          @click="$router.go(-1)"
        >
          <span class="iconfont icon-fanhui text-2xl"></span>
          <span class="underline align-text-bottom ">返回</span>
        </el-button>
      </div>
    </div>
    <div class="px-3 divide-y-2 divide-[#E5E5E5] space-y-4  divide-dashed ">
      <div class="grid    grid-cols-7   pt-6">
        <div class="square ">
          学 校：<span class="text-blue">{{ detail?.schoolName }}</span>
        </div>
        <div class="square ">
          年级：<span class="text-blue">{{ gradeConversion(detail?.homeworkGrade) }}</span>
        </div>
        <div class="square ">
          人数：<span class="text-blue">{{ detail?.studentTotalNum }}</span>
        </div>
        <div class="square ">
          体育老师：<span class="text-blue">{{ detail?.peTeacherName }}</span>
        </div>
        <div class="square ">
          学 校：<span class="text-blue">{{ detail?.schoolName }}</span>
        </div>
        <div class=" ">
          <span class="iconfont icon-renyuan text-yellow  text-xl mr-1"></span>
          已交作业：<span class="text-blue">{{ detail?.submittedNum }}/</span>{{ detail?.unSubmittedNum }}
        </div>
        <div class=" ">
          <span class="iconfont icon-xiaoxi text-yellow  text-xl mr-1"></span>
          已点评：<span class="text-blue">{{ detail?.submittedNum - detail?.noCommentaryNum
          }}/
          </span>
          {{ detail?.studentTotalNum }}
        </div>
      </div>

      <div class="grid       pt-6 ">
        <div class=" ">
          <span class="iconfont icon-shijian text-yellow  text-xl mr-1"></span>开始日期：<span
            class="text-blue"
          >{{ dateFormat(detail?.homeworkDate) }}</span>
        </div>
      </div>
      <div class="grid     pt-6 ">
        <div class=" ">
          <span class="iconfont icon-riqi1 text-yellow mr-1"></span>
          作业期限：<span
            class="text-blue"
          >{{ new Date(detail?.homeworkDeadline).getDate() - new Date(detail?.homeworkDate).getDate()
          }}</span> 天
        </div>
      </div>
      <div class="grid     pt-6 ">
        <div class=" ">
          <span class="iconfont icon-xiangmu2 text-yellow mr-1"></span>
          班 级：<span class="text-blue">{{ detail?.homeworkClasses?.toString() }}</span>
        </div>
      </div>
      <div class="grid     pt-6 ">
        <div class=" ">
          <span class="iconfont icon-gengduoneirong text-yellow mr-1"></span>
          作业项目：<span class="text-blue">{{ detail?.homeworkProject?.toString() }}</span>
        </div>
      </div>
      <div class="grid    grid-cols-7 pt-6 ">
        <div class=" ">
          <span class="iconfont icon-neirongguanli text-yellow mr-1"></span>
          作业内容：<span class="text-blue"></span>
        </div>
      </div>
    </div>
    <div
      class="m-4"
      pb-4
    >
      <div v-html="detail?.homeworkIntroduction"></div>
    </div>
  </div>
</template>


<style lang="scss" scoped>


</style>
