<script lang="js">
import resize from "./mixins/resize.js";
import * as echarts from "echarts";
// import "@/utils/echarts.js";

// console.warn(window.echarts, "echarts");
import("./theme/macarons.js");
const unwarp = (obj) => obj && (obj.__v_raw || obj.valueOf() || obj);
// import ecStat from 'echarts-stat';
// echarts.registerTransform(ecStat.transform.regression);
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
      radio: 2
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
      if (!chartData.standard) return
      const colors = ['#CAD3EF','#E7F0D7', '#FDEECC', '#FCCFCF', '#D5ECF5', '#C4E3D5']
      const scoreList = ([0,1, 2, 3, 4, 5]).map((item, index) => item + '分');
      if(['身高'].includes(chartData.projectName)){
        colors.shift()
        scoreList.shift()
        Object.keys(chartData.standard).forEach(keys => chartData.standard[keys].shift())
      }
      const isReverse = ['10米折返跑', '双脚连续跳', '走平衡木'].includes(chartData.projectName);
      if (isReverse) {
        colors.reverse();
        scoreList.reverse()
      }
      const childData = chartData.dataList.sort((a, b) => a.age - b.age).map(data => data.projectData)
      console.log('data', childData)
      const ageList = ['3岁-3岁半', '3岁半-4岁', '4岁-4岁半', "4岁半-5岁", '5岁-5岁半', '5岁半-6岁', '6岁-6岁半']
      const ageList2 = ['3岁', '3岁半', '4岁', "4岁半", '5岁', '5岁半', '6岁', '六岁半']
      const xList = [3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5]
      const source = chartData.dataList.map(item => [item.age , item.projectData])
      const dataList = [0,1, 2, 3, 4, 5].map( () => [])
      const standardKeys = Object.keys(chartData.standard).sort((a, b) => a - b)
      let maxDataList = chartData.standard['6.0']
      // if(isReverse) {
      //   maxDataList = chartData.standard['3.0']
      // }
      const max = Math.ceil( Math.max.apply(null, [Math.abs(maxDataList[maxDataList.length-1] * 2 - maxDataList[maxDataList.length-2]), ...childData]))
      const min = Math.floor( Math.min.apply(null, [Math.abs(maxDataList[0] * 2 - maxDataList[1]), ...childData]))
      // alert(min)
      // alert(`max: ${max}`)
      console.log('standard', standardKeys)
      standardKeys.forEach((key,i) => {
        // if(['身高'].includes(chartData.projectName))return
        // if(isReverse) return  chartData.standard[key].push(Math.abs( min))
        chartData.standard[key].push(Math.abs( max))
      })
      console.log( chartData.standard, 'xx')
      standardKeys.forEach((key,i) => {
        chartData.standard[key].forEach((num, index) => {
          if(index === 0) {
            dataList[index].push(num)
          }
          else {
            dataList[index].push( Math.abs( num - chartData.standard[key][index-1]).toFixed(2))
          }
        })
      })
      console.log(dataList, 'datalist')
      // dataList.push(dataList[dataList.length-1])
      const series = colors.map((key, index) => {
        console.log(index, 'index')
        debugger
        return {
          // offset: 0,
          xAxisIndex: 0,

          name: scoreList[index],
          type: 'bar',
          areaStyle: {},
          emphasis: {
            focus: 'series'
          },
          barCategoryGap: "0%",
          stack: "level",
          itemStyle: {
            normal: {
              color: colors[index],
              // barBorderRadius:[12, 12, 0, 0],
              label: {
                // offset: 1,
                show: index === 4? true: true,
                position: 'inside',
                textStyle: { fontSize: '18px', },
                formatter(param) {
                  // console.log(param)
                  const {seriesIndex,componentIndex, value, dataIndex} = param
                  if(dataIndex ===6) return scoreList[seriesIndex]
                  return  ''
                }
              },
            }
          },


          data: dataList[index]
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
          trigger: 'axis',
          axisPointer: {
            // type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
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
        // grid: {
        //   left: '3%',
        //   right: '4%',
        //   bottom: '6%',
        //   containLabel: true
        // },
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
            show: false
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
            max,
            // inverse: isReverse,
            type: 'value',
            // scale: true

          },  {

            // inverse: isReverse,
            type: 'value',
            scale: false

          },

        ],
        series: [...series,
          {
            xAxisIndex:1,
            min:3,
            name: '测量值',
            // type: 'scatter',
            type: 'line',
            symbol: 'circle',
            symbolSize: 10,
            // datasetIndex: 0,
            itemStyle: {
              color: 'rgba(255, 148, 3, 1)',
              borderColor: 'rgba(255, 148, 3, 1)',
              borderWidth: 2
            },
          },

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
