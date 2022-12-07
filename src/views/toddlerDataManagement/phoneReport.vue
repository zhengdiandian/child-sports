<script setup>
import {useRoute} from "vue-router";
import {report} from '@/api/toddlerDataManagement'
import {nextTick, onMounted, ref} from "vue";
import dateFormat from "@/utils/dateFormat.js";
// import echarts from 'echarts' // echarts theme
import * as echarts from "echarts";
import a from '@/img/优秀.png'
import b from '@/img/良好.png'
import c from '@/img/及格.png'
import d from '@/img/不及格.png'

const imgUrlObject = {
  '优秀': a,
  '良好': b,
  '及格': c,
  '不及格': d
}
const route = useRoute();

const recordId = route.query.recordId
const reportData = ref({
  scoreList: []
});
const colors = ['#000000', '#E66022', '#EBA939', '#43B772', '#5470C6', '#3FA5EA'];
const weightColors = [colors[0], colors[2], colors[4], colors[2], colors[0], colors[0]]
const colors2 = [...colors].reverse()
const findColor = (name, index) => {
  debugger
  console.log(name, index)
  if (['体重'].includes(name)) {
    return weightColors[index]
  }
  if (['10米折返跑', '走平衡木', '10米折返跑'].includes(name)) {
    return colors2[index]
  }
  return colors[index]
}
const chartRef = ref('');
(async () => {
  const res = await report({recordId})
  res.data.projectData.forEach(item => {
    if (item.standard[0] === 0) {
      item.standard.shift()
    }

    const before = (item.standard[0] * 2 - item.standard[1]);
    const after = item.standard[item.standard.length - 1] * 2 - item.standard[item.standard.length - 2];
    item.standard.unshift(before)
    // item.standard.push(after)
    item.after = after
    item.before = before
    item.total = after - before
    item.widthList = []
    item.userWidth = ((item.value - before) / item.total * 100).toFixed(2) + '%'
    item.standard.forEach((standardItem, index) => {

      if (index === 0) {
        debugger
        item.widthList.push((item.standard[index + 1] - item.before))
        console.log(index, (item.standard[index + 1] - item.before), item.standard[index + 1], item.after, 'ssss')

        // alert((item.standard[index +1] -  item.after ))
      } else if (index === item.standard.length - 1) {
        item.widthList.push(item.after - (standardItem))
      } else {
        item.widthList.push((item.standard[index + 1] - standardItem))

      }


    })
    item.arr = item.widthList
    item.widthList = item.widthList.map((num => (num / item.total * 100).toFixed(2) + '%'))
    item.userIndex = item.standard.findIndex(num => num > item.value)
    item.userIndex = item.userIndex === -1 ? item.standard.length - 1 : item.userIndex

  })
  reportData.value = res.data
  await nextTick(initChart)
})()
// (async () =>{

// })()

const initChart = () => {
  let chart = echarts.init(document.getElementById('chartRef'))
  let option = {
    color: ['#67F9D8', '#FFE434', '#56A3F1', '#FF917C'],
    // title: {
    //   text: 'Customized Radar Chart'
    // },
    legend: {
      show: false
    },
    radar: [
      {
        indicator: reportData.value?.scoreList?.map(item => ({text: item.projectName, max: 5})),
        //   [
        //   { text: 'Indicator1' },
        //   { text: 'Indicator2' },
        //   { text: 'Indicator3' },
        //   { text: 'Indicator4' },
        //   { text: 'Indicator5' }
        // ],
        name: {
          textStyle: {
            padding: [-20, -22]
          }
        },
        center: ['50%', '50%'],
        radius: 85,
        startAngle: 90,
        splitNumber: 4,
        shape: 'circle',
        axisName: {
          formatter: '【{value}】',
          color: '#428BD4'
        },
        splitArea: {
          areaStyle: {
            color: ['#77EADF', '#26C3BE', '#64AFE9', '#428BD4'],
            shadowColor: 'rgba(0, 0, 0, 0.2)',
            shadowBlur: 10
          }
        },
        axisLine: {
          lineStyle: {
            color: 'rgba(211, 253, 250, 0.8)'
          }
        },
        splitLine: {
          lineStyle: {
            color: 'rgba(211, 253, 250, 0.8)'
          }
        }
      },
      // {
      //   indicator: [
      //     { text: 'Indicator1', max: 150 },
      //     { text: 'Indicator2', max: 150 },
      //     { text: 'Indicator3', max: 150 },
      //     { text: 'Indicator4', max: 120 },
      //     { text: 'Indicator5', max: 108 },
      //     { text: 'Indicator6', max: 72 }
      //   ],
      //   center: ['75%', '50%'],
      //   radius: 120,
      //   axisName: {
      //     color: '#fff',
      //     backgroundColor: '#666',
      //     borderRadius: 3,
      //     padding: [3, 5]
      //   }
      // }
    ],
    series: [
      {
        type: 'radar',
        emphasis: {
          lineStyle: {
            width: 4
          }
        },
        data: [
          {
            value: reportData.value?.scoreList?.map(item => item?.score),
            name: 'Data A'
          },
          // {
          //   value: [60, 5, 0.3, -100, 1500],
          //   name: 'Data B',
          //   areaStyle: {
          //     color: 'rgba(255, 228, 52, 0.6)'
          //   }
          // }
        ]
      },
      // {
      //   type: 'radar',
      //   radarIndex: 1,
      //   data: [
      //     {
      //       value: [120, 118, 130, 100, 99, 70],
      //       name: 'Data C',
      //       symbol: 'rect',
      //       symbolSize: 12,
      //       lineStyle: {
      //         type: 'dashed'
      //       },
      //       label: {
      //         show: true,
      //         formatter: function (params) {
      //           return params.value;
      //         }
      //       }
      //     },
      //     // {
      //     //   value: [100, 93, 50, 90, 70, 60],
      //     //   name: 'Data D',
      //     //   areaStyle: {
      //     //     color: new echarts.graphic.RadialGradient(0.1, 0.6, 1, [
      //     //       {
      //     //         color: 'rgba(255, 145, 124, 0.1)',
      //     //         offset: 0
      //     //       },
      //     //       {
      //     //         color: 'rgba(255, 145, 124, 0.9)',
      //     //         offset: 1
      //     //       }
      //     //     ])
      //     //   }
      //     // }
      //   ]
      // }
    ]
  };
  chart.setOption(option)

}
onMounted(() => {
  // initChart()
})


</script>
<template>
  <div class="bg-[#FBE9B6] h-[11rem] pt-[1.4rem] border-b-4 border-b-[#EAA836]">
    <h1 class="text-center text-[#3F240] font-size[3.33rem] font-semibold text-xl">
      优小享家动员学员健康测评报告
    </h1>
    <div class="flex justify-around pt-1 text-sm">
      <div class="">
        测试日期：
        {{ dateFormat(reportData.testTime, "yyyy-mm-dd") }}
      </div>
      <div>
        测试人：{{ reportData.infantName }}
      </div>
    </div>
    <div class="pl-2 pt-8 flex   flex-nowrap">
      <div class="rounded-full w-12 h-12  overflow-hidden">
        <img
          alt=""
          src="@/img/pic1.png"
        >
      </div>
      <div class="flex-auto pl-2">
        <div>
          学生姓名：{{ reportData.infantName }} <span class="pl-4">性别：{{ reportData.infantGender }}</span>
        </div>
        <div>
          出生日期： {{ dateFormat(reportData.infantBirthday, "yyyy-mm-dd") }}
        </div>
      </div>
    </div>
  </div>

  <div class="pl-2 pt-2 pr-1 border-b-2 border-b-gray bg-white">
    <div class="flex justify-between">
      <div class="text-2xl text-[#3F240] ">
        身体成分
      </div>
      <div>
        测试日年龄：5岁8个月
      </div>
    </div>
    <div class="flex justify-around pt-6 pb-2">
      <div class="flex flex-col ">
        <div class="text-xl">
          {{ reportData.height }} <span class="text-sm">cm</span>
        </div>
        <div class="text-black-1 text-center">
          身高
        </div>
      </div>
      <div class="flex flex-col">
        <div class="text-xl">
          {{ reportData.weight }} <span class="text-sm">kg</span>
        </div>
        <div class="text-black-1 text-center">
          体重
        </div>
      </div>
      <div class="flex flex-col">
        <div class="text-xl">
          {{ reportData.bmi }} <span class="text-sm"></span>
        </div>
        <div class="text-black-1 text-center">
          BMI
        </div>
      </div>
    </div>
  </div>

  <div class="pl-2 pt-3 pb-6 pr-1 border-b-2 border-b-gray bg-white">
    <div class="text-2xl text-[#3F240] ">
      运动能力
    </div>
    <div class="w-full h-[20rem]">
      <div
        id="chartRef"
        ref="chartRef"
        class="w-full h-full"
      ></div>
    </div>
    <div class="flex justify-end">
      <div
        v-for="(color, index) in colors"
        :key="index"
        :class="true?`before:bg-[${color}]`: ''"
        class="text-black  flex items-center mr-2"
      >
        <span
          :style="{backgroundColor:color}"
          class="inline-block mr-1 w-4 h-1.5"
        ></span> {{ index }}分
      </div>
    </div>
    <template v-if="reportData?.projectData.length">
      <div
        v-for="(project, index) in reportData?.projectData"
        :key="index"
        class="mt-4 "
      >
        <h3 class="text-black text-xl">
          {{ project.projectName }} <span class="text-sm text-black-1">({{ project.title }})/ {{ project.unit }}</span>
        </h3>
        <div class="w-full  flex justify-start flex-nowrap  pr-2 ">
          <div class="w-full overflow-hidden">
            <div
              :style="{backgroundColor:findColor( project.projectName, project.userIndex + (project.widthList.length === 5? 1: 0)), width: project.userWidth }"
              class="h-4 inline-block relative "
            >
              <span
                class="absolute right-[0%] bottom-[50%] text-sm translate-y-2/4 translate-x-8"
              >{{ project.value }}</span>
            </div>
          </div>
        </div>
        <div class="w-full  flex justify-start flex-nowrap  pr-2 pb-4">
          <div
            v-for="(item, index) in project.widthList"
            :key="index"
            :style="{backgroundColor:findColor( project.projectName, index+ (project.widthList.length === 5? 1: 0)), width: item}"
            class="h-2 inline-block relative "
          >
            <span
              v-if=" index !== project.widthList.length -1"
              class="absolute right-0 bottom-[-250%] text-sm translate-x-2/4"
            >{{
              project.projectName === '立定跳远' ? Number.parseInt(project.standard[index]) : project.standard[index].toFixed(1)
            }}</span>
          </div>
        </div>
      </div>
    </template>
  </div>
  <div class=" pt-3 pr-1 bg-white">
    <div class="flex justify-around flex-wrap">
      <div
        v-for="(item,index ) in reportData.spiritData"
        :key="index"
        :style="{width: item.projectName.length>2 }"
        class="flex flex-normal w-1/2"
      >
        <span class="flex-auto text-right">{{ item.projectName }}：</span>
        <el-rate
          v-model="item.score"
          disabled
          text-color="#ff9900"
        />
      </div>
    </div>
    <div class="flex justify-around items-center mt-4">
      <div>
        <div class="text-black-1 pb-4">
          综合得分
        </div>
        <div>
          <span class="text-3xl text-[#FF8F22]">{{ reportData?.score }}</span>/{{ reportData.fullScore ?? 100 }}
        </div>
      </div>
      <div class="">
        <div class="w-28 ">
          <img :src="imgUrlObject[reportData?.scoreLevel]">
        </div>
        <div class="text-center  text-2xl">
          {{ reportData?.scoreLevel }}
        </div>
      </div>
    </div>
  </div>
  <div class="pl-2 pt-4 pb-10 pr-1  bg-white">
    <div class="text-2xl text-black-1 ">
      训练建议
    </div>
    <div
      class="overflow-ellipsis w-full break-words pt-2 text-xl"
      style="text-indent: 2em"
    >
      {{ reportData?.trainAdvice }}
    </div>
  </div>
</template>


<style lang="scss" scoped>


</style>
