<script setup>
import {curve} from '@/api/toddlerDataManagement'
import {useRoute} from "vue-router";
import {ref} from "vue";
import CurveChart from '@/components/Charts/CurveChart.vue'
import CurveChart2 from '@/components/Charts/CurveChart2.vue'

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
    <div class="flex justify-start">
      <div></div>
      <div class="text-2xl">
        xxx
      </div>
      <div class="flex flex-col">
        <div>性别：</div>
        <div>生日：</div>
      </div>
    </div>
    <div>
      <el-tabs
        v-model="activeName"
        class="demo-tabs"
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
