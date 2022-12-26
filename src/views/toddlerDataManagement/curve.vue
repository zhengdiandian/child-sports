<script setup>
import {curve} from '@/api/toddlerDataManagement'
import {useRoute} from "vue-router";
import {ref} from "vue";
import CurveChart from '@/components/Charts/CurveChart.vue'
import CurveChart2 from '@/components/Charts/CurveChart2.vue'
import dateFormat from "@/utils/dateFormat.js";

const activeName = ref('综合得分')
const chartData = ref({})
const handleClick = (tab, event) => {
  // curveData.value.projectData[tab.index].day = (new Date() -  +new Date( curveData.value.birthday)) / 1000/ 60 / 60/ 24/365
  chartData.value = curveData.value.projectData[tab.index]
  chartData.value.day = (new Date() -  +new Date( curveData.value.birthday)) / 1000/ 60 / 60/ 24/365
  // console.log(tab, event, chartData.value)
}
const infantId = useRoute().query.infantId
const curveData = ref({
  projectData: [],
  birthday: '',
  gender: '',
  name: ''
})
curve({infantId}).then((res) => {
  curveData.value = res.data
  handleClick({index: 0})
})
</script>
<template>
  <div class="bg-white">
    <div class="flex justify-start py-2 px-4">
      <div class="w-20">
        <img
          alt=""
          class="w-25"
          src="@/img/logo.png"
        >
      </div>

      <div class="flex flex-col pl-4">
        <div class=" flex items-center px-2 pl-4">
          {{ curveData.name }}
        </div>
        <div>
          <span class="iconfont  icon-geren text-[#FF9403]"></span>
          性别：{{ curveData.gender }}
        </div>
        <div>
          <span class="iconfont  icon-shengri text-[#FF9403]"></span>
          生日：{{ dateFormat(curveData.birthday, "yyyy-mm-dd") }}
        </div>
      </div>
    </div>
    <div>
      <el-tabs
        v-model="activeName"
        class="px-4"
        @tab-click="handleClick"
      >
        <el-tab-pane
          v-for="item in curveData.projectData"
          :key="item.projectName"
          :label="item.projectName"
          :name="item.projectName"
        >
        </el-tab-pane>
      </el-tabs>
      <CurveChart
        v-if="chartData.projectName !=='综合得分'"
        :chart-data="chartData"
      ></CurveChart>
      <CurveChart2
        v-else
        :chart-data="chartData"
      ></CurveChart2>
    </div>
  </div>
</template>


<style lang="scss" scoped>


</style>
