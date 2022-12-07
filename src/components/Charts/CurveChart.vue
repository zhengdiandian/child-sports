<script lang="js">
import resize from "./mixins/resize.js";
import * as echarts from "echarts";
// import "@/utils/echarts.js";

// console.warn(window.echarts, "echarts");
import("./theme/macarons.js");
const unwarp = (obj) => obj && (obj.__v_raw || obj.valueOf() || obj);

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
      this.chart = echarts.init(this.$refs.chart, "macarons");
      this.setOptions(this.chartData);
    },
    setOptions() {
      const chartData = this.chartData;
      // if(!chartData.standard)return
      const scoreList = ([1, 2, 3, 4, 5]).map((item, index) => item + '分');
      const ageList = ['3岁', '3岁半', '4岁', "4岁半", '5岁', '6岁']
      const standardKeys = Object.keys(chartData.standard).sort((a, b) => a - b)
      const series = scoreList.map((key, index) => {
        return {
          name: key,
          type: 'line',
          stack: 'Total',
          areaStyle: {},
          emphasis: {
            focus: 'series'
          },
          data: standardKeys.map(s => {
            return chartData.standard[s][index]
          })
        }
      })
      console.log(series, 1111)
      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
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
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: ageList
          }
        ],
        yAxis: [
          {
            type: 'value'
          },

        ],
        series: [...series]
        //   [
        //   {
        //     name: 'Email',
        //     type: 'line',
        //     stack: 'Total',
        //     areaStyle: {},
        //     emphasis: {
        //       focus: 'series'
        //     },
        //     data: [120, 132, 101, 134, 90, 230, 210]
        //   },
        //   {
        //     name: 'Union Ads',
        //     type: 'line',
        //     stack: 'Total',
        //     areaStyle: {},
        //     emphasis: {
        //       focus: 'series'
        //     },
        //     data: [220, 182, 191, 234, 290, 330, 310]
        //   },
        //   {
        //     name: 'Video Ads',
        //     type: 'line',
        //     stack: 'Total',
        //     areaStyle: {},
        //     emphasis: {
        //       focus: 'series'
        //     },
        //     data: [150, 232, 201, 154, 190, 330, 410]
        //   },
        //   {
        //     name: 'Direct',
        //     type: 'line',
        //     stack: 'Total',
        //     areaStyle: {},
        //     emphasis: {
        //       focus: 'series'
        //     },
        //     data: [320, 332, 301, 334, 390, 330, 320]
        //   },
        //   {
        //     name: 'Search Engine',
        //     type: 'line',
        //     stack: 'Total',
        //     label: {
        //       // show: true,
        //       position: 'top'
        //     },
        //     areaStyle: {},
        //     emphasis: {
        //       focus: 'series'
        //     },
        //     data: [820, 932, 901, 934, 1290, 1330, 1320]
        //   }
        // ]
      };
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
