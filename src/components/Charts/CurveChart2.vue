<script lang="js">
import resize from "./mixins/resize.js";
import * as echarts from "echarts";
// import ecStat from 'echarts-stat';
// echarts.registerTransform(ecStat.transform.regression);
import dateFormat from "@/utils/dateFormat.js";
// import "@/utils/echarts.js";

// console.warn(window.echarts, "echarts");
import("./theme/macarons.js");
const unwarp = (obj) => obj && (obj.__v_raw || obj.valueOf() || obj);
const colors = ['#7CDFB2', '#7ED6F8', '#FCDA8B', '#F99090', '#D5ECF5', '#C4E3D5']

const textList = ['优秀(测试全部)', '良好(测试全部)', '合格(测试全部)', '不合格(测试全部)']
const textList2 = ['优秀(测试部分)', '良好(测试部分)', '合格(测试部分)', '不合格(测试部分)']
export default {
  mixins: [resize],
  props: {
    onlyOne: {
      default: false
    },
    chartConfig: {
      default: function () {
        return {};
      },
      type: Object
    },
    className: {
      type: String,
      default: "chart"
    },
    width: {
      type: String,
      default: "100%"
    },
    height: {
      type: String,
      default: "80vh"
    },
    autoResize: {
      type: Boolean,
      default: true
    },
    chartData: {
      type: Object
      // required: true
    },
    labelUnit: {
      type: String,
      default: ""
    },
    yAxisName: {
      default: "小时",
      type: String
    },
    type: {
      default: "",
      type: String
    }
  },
  data() {
    return {
      chart: null,
      radio: 2,
      textList,
      colors,
      textList2
    };
  },
  watch: {
    chartData: {
      // deep: true,
      handler(val) {
        this.chart.dispose()
        this.initChart()
        this.setOptions(val);
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart(this.chartData, "macarons");
    });
  },
  beforeUnmount() {
    if (!this.chart) {
      return;
    }
    this.chart.dispose();
    this.chart = null;
  },

  methods: {
    change(value) {
      this.radio = value;
      this.setOptions(this.chartData);
    },
    ceilNumber(number) {
      let bite = 0;
      if (number < 10) {
        return number;
      }
      while (number >= 10) {
        number /= 10;
        bite += 1;
      }
      return Math.ceil(number) * Math.pow(10, bite);
    },
    initChart() {
      this.chart = echarts.init(this.$refs.chart);
      this.setOptions(this.chartData);
    },
    setOptions() {
      const chartData = JSON.parse( JSON.stringify(this.chartData));
      if (!chartData.dataList) return
      const scoreList = ([0,1, 2, 3, 4, 5]).map((item, index) => item + '分');
      const  isWeight = ['体重'].includes(chartData.projectName)
      const findColorIndex = (name) => {
        debugger
        let index = 0
        if(name.includes('优秀')) index=  0
        if(name.includes('良好')) index = 1
        if(name.includes('不合格')) index =  3
        if(name.includes('合格')) index = 2
        console.log('name', name, index)

        return colors[ index]
      }
      let series = []
      let max = undefined
      // if(['身高'].includes(chartData.projectName)){
      //   colors.shift()
      //   scoreList.shift()
      //   Object.keys(chartData.standard).forEach(keys => chartData.standard[keys].shift())
      // }
      const sortDataList = chartData.dataList.sort((a, b) => a.age - b.age)
      const childData = sortDataList.map(data => data.projectData)

      console.log('data', childData)
      const ageList = ['3岁-3岁半', '3岁半-4岁', '4岁-4岁半', "4岁半-5岁", '5岁-5岁半', '5岁半-6岁', '6岁-6岁半']
      const ageList2 = ['3岁', '3岁半', '4岁', "4岁半", '5岁', '5岁半', '6岁', '6岁半']
      const xList = [3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5]

      let source = sortDataList.map(item => [item.age , item.projectData])

      const nameList = sortDataList.map(item => item.level)
      // const dataList = [0,1, 2, 3, 4, 5].map( () => [])
        // console.log(dataList, 'datalist')
        // dataList.push(dataList[dataList.length-1])
        series = source.map((key, index) => {

          console.log(colors[findColorIndex(nameList[index])], 'index', index, findColorIndex(nameList[index]))
          return {
            // offset: 0,
            xAxisIndex: 1,
            markLine: {

              symbol: '',
              silent: false,
              lineStyle: {
                color: '#F29838',
                // type: 'solid'
              },
              label: {
                padding: [0, -80, -30, -45],
                option: 'start',
                formatter() {
                  return '今日'
                }
              },
              data: [
                {
                  xAxis: chartData.day
                },
              ]
            },
            name: nameList[index],
            type: 'scatter',
            // areaStyle: {},
            // emphasis: {
            //   focus: 'series'
            // },
            itemStyle: {
              borderWidth: nameList[index].includes('部分') ? 2: 0,
              borderColor: findColorIndex(nameList[index]),
              color:nameList[index].includes('部分') ? '#fff': findColorIndex(nameList[index]),
            },
            barCategoryGap: "0%",


            data: [source[index]]
          }
        })



      console.log(series, 1111, source, 'xxxx')
      const option = {
        dataset: [
          {
            source
            // : [
            //           [3, 10],
            //           [3.2, 18],
            //         [3.5, 15],
            //         [4, 15],
            //         [4.2, 15],
            //         [5, 15],
            //         [5.5, 15],
            //         [6, 15],
            //         ],
          },
          // {
          //   transform: {
          //     type: 'ecStat:regression',
          //     config: {
          //       method: 'exponential'
          //     }
          //   }
          // }
        ],
        tooltip: {
          trigger: "item",
          show:true,
          // trigger: 'axis',
          axisPointer: {
            // type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          },
          formatter(param) {
            const { dataIndex, seriesIndex, marker, seriesName, seriesType } = param;
            console.log(param)
            return  `${marker} <span class="text-2xl " style="color: #000000 ; font-size: 18px ">综合得分${sortDataList[seriesIndex].projectData}/</span><span class="text-2xl " style="color: #333333 ; font-size: 16px ">满分${sortDataList[seriesIndex].fullScore}</span>
            <div style="color: #333333 ; font-size: 16px ; padding-left: 20px;">

            ${   dateFormat(sortDataList[seriesIndex].testTime, "yyyy-mm-dd")}
            </div>`


          }
        },
        axisLabel: {
          show: true,
          // textStyle: {
          color: "#000000", // 更改坐标轴文字颜色
          fontSize: 26 // 更改坐标轴文字大小
          // }
        },
        legend: {
          show: false
          // data: ['Email', 'Union Ads', 'Video Ads', 'Direct', 'Search Engine']
        },
        // toolbox: {
        //   feature: {
        //     saveAsImage: {}
        //   }
        // },
        grid: {
          left: '3%',
          right: '6%',
          bottom: '6%',
          containLabel: true
        },
        xAxis: [{
          show:false,
          type: 'category',
          data: ageList,
          position: 'bottom',
          // offset: 20,
          axisTick: {
            inside: false,  // 刻度线朝上 或朝下，默认为false为朝下
            lineStyle: { //刻度线样式
              color: '#ff9800'
            },
          }
        }, {
          // show:false,
          boundaryGap: false,
          position: 'bottom',
          offset: 30, // 向下偏移，为了不和第一条x轴重合
          //x轴 轴线
          axisLine: {
            show: true,
            lineStyle: { //刻度线样式
              color: '#00A8E5',
              lineStyle:{
                type: 'dashed'
              }
            },
          },
          splitLine:{
            show:false
          },
          axisTick: {
            inside: false,  // 刻度线朝上 或朝下，默认为false为朝下
            lineStyle: { //刻度线样式
              color: '#00A8E5'
            },
          },
          axisLabel: {
            inside: true,
            formatter: function (value, index) {
              return ageList2[index];


            },
          },

          interval:0.5,
          min:3,
          max:6.5,
          type:'value',

          data: xList
        }],
        yAxis: [
          {
            // min,
            name: '分值',
            nameLocation: 'end',
            nameGap:40,
            nameTextStyle:{
              color: '#000000',
              verticalAlign: 'middle',
              padding: [0,0,0,-30]
            },
            axisLine: {
              // show: false,
              lineStyle: { //刻度线样式
                color: '#DDDDDD',
                lineStyle:{
                  type: 'dashed'
                }
              },
            },

            axisTick: {
              // show: false,
              inside: false,  // 刻度线朝上 或朝下，默认为false为朝下
              // lineStyle: { //刻度线样式
              //   color: '#00A8E5'
              // },
            },
            // max: isWeight? 120: max,
            // inverse: isReverse,
            // type: 'value',
            // scale: true

          },
          {
            axisLine: {
              show: false,
              lineStyle: { //刻度线样式
                color: '#00A8E5',
                lineStyle:{
                  type: 'dashed'
                }
              },
            },
            // inverse: isReverse,
            // type: 'value',
            // scale: false

          },

        ],
        series: [...series,
          // {
          //   xAxisIndex:1,
          //   min:3,
          //   name: '测量值',
          //   // type: 'scatter',
          //   type: 'line',
          //   symbol: 'circle',
          //   symbolSize: 10,
          //   // datasetIndex: 0,
          //   itemStyle: {
          //     color: 'rgba(255, 148, 3, 1)',
          //     borderColor: 'rgba(255, 148, 3, 1)',
          //     borderWidth: 2
          //   },
          //
          // },

        ]

      };
      console.log(option, `xxx`)
      unwarp(this.chart).setOption(option);
      // this.chart.setOption(option);

    }
  }
};
</script>
<template>
  <div>
    <div class="grid grid-cols-4 ">
      <div
        v-for="(text, i) in textList"
        :key="text"
        class="text-[10px] text-[#333333] flex items-center justify-center"
      >
        <span
          :style="{backgroundColor: colors[i]}"
          class="w-2 h-2 inline-block rounded-full bg-violet-700"
        ></span>
        {{ text }}
      </div>
      <div
        v-for="(text, i) in textList2"
        :key="text"
        class="text-[10px] text-[#333333] flex items-center justify-center mt-4"
      >
        <span
          :style="{borderColor: colors[i]}"
          class="w-[0.55rem] h-[0.55rem] inline-block rounded-full border-2  "
        ></span>
        {{ text }}
      </div>
    </div>
    <div
      id="chart"
      ref="chart"
      :class="className"
      :style="{height:height,width:width}"
    />
  </div>
</template>

<style lang="scss" scoped>

</style>
