<script setup>
import {curve} from '@/api/toddlerDataManagement'
import {useRoute} from "vue-router";
import {ref} from "vue";
import CurveChart from '@/components/Charts/CurveChart.vue'

const activeName = ref('')
const chartData = ref({})
const handleClick = (tab, event) => {
  chartData.value = curveData.value.projectData[tab.index]
  console.log(tab, event)
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
})
</script>
<template>
  <div class="bg-white">
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
          User
        </el-tab-pane>
      </el-tabs>
      <CurveChart
        v-if="chartData.standard"
        :chart-data="chartData"
      ></CurveChart>
    </div>
  </div>
</template>


<style lang="scss" scoped>


</style>
