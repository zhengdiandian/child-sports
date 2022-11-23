<template>
  <div class="relative">
    <div class="absolute  top-0 left-0 flex item-center z-50">
      <span>数据排序：</span>
      <el-radio-group
        v-model="radio"
        size="small"
        @change="change"
      >
        <el-radio-button :label="1">
          降序
        </el-radio-button>
        <el-radio-button :label="2">
          升序
        </el-radio-button>
      </el-radio-group>
    </div>

    <div
      ref="chart"
      :class="className"
      :style="{height:h,width:width}"
    />
    <div
      v-if="notInvolved.length"
      class="p-4 break-words relative"
    >
      <h3 class="text-center text-red text-2xl mb-4">
        以下无数据
      </h3>
      <span
        v-for="text in notInvolved"
        :key="text"
        class="p-2.5 inline-block text-gray-500"
      >
        {{ text }}
      </span>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";
// import echarts from 'echarts' // echarts theme
import resize from "./mixins/resize.js";
import { BMILevel, colors, level } from "@/utils/levelColors";

import("./theme/macarons.js");
//
// const chart = { chart: null }
const unwarp = (obj) => obj && (obj.__v_raw || obj.valueOf() || obj);
export default {
  name: "Chart",
  mixins: [resize],
  props: {
    fixedSorting: {
      type: Array,
      default() {
        return level;
      }
    },
    chartConfig: {
      default: function() {
        return {};
      },
      type: Object
    },
    unit: {
      default: "%"
    },
    fixedName: {
      default: "全区平均"
    },
    fixedValue: {
      default: "district"
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
      default: "420px"
    },
    autoResize: {
      type: Boolean,
      default: true
    },
    chartData: {
      type: Object,
      default: function() {
        return {};
      }
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
      show: false,
      $_resizeHandler: null,
      h: "420px",
      notInvolved: []
    };
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        this.show = false;
        this.show = true;
        // const data = {
        //   expectedData: [],
        //   actualData: []
        // }
        // val.forEach(item => {
        //   if (item.purpose.toUpperCase() === 'C') {
        //     data.expectedData.push(item)
        //   } else if (item.purpose.toUpperCase() === 'X') {
        //     data.actualData.push(item)
        //   }
        // })
        this.chart.dispose();
        this.chart = null;
        this.initChart();
      }
    }
  },
  created() {
    // const chartData = this.chartData;
    // const participate = {};
    // const notInvolved = [];
    // Object.keys(chartData).forEach(key => {
    //   let total = 0;
    //   Object.keys(chartData[key]).forEach(k => {
    //     total += chartData[key][k];
    //   });
    //   console.log(total);
    //   if (total === 0 && isNaN(total)) {
    //     notInvolved.push(key);
    //   } else {
    //     participate[key] = chartData[key];
    //   }
    // });
    // this.h = Math.max(Object.keys(participate).length * 30, 200) + "px";

  },
  mounted() {
    this.$nextTick(() => {
      this.initChart(this.chartData);
    });
  },
  activated() {
    this.$nextTick(() => {
      this.initChart(this.chartData);
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
      return Math.ceil(number) * 1.3 * Math.pow(10, bite);
    },
    initChart() {
      this.chart = echarts.init(this.$refs.chart, "macarons");
      this.setOptions(this.chartData);
    },
    setOptions(chartData) {
      if (typeof chartData === "object" && chartData === null && Object.keys(chartData).length === 0) return;

      const keyName = this.fixedName;
      const participate = {};
      const notInvolved = [];
      Object.keys(chartData).forEach(key => {
        let total = 0;
        Object.keys(chartData[key]).forEach(k => {
          total += chartData[key][k];
        });
        if (total === 0 || isNaN(total)) {
          notInvolved.push(key);
        } else {
          participate[key] = chartData[key];
        }
      });
      this.notInvolved = notInvolved;
      this.h = Math.max(Object.keys(participate).length * 40, 400) + "px";
      chartData = { ...participate };

      // chartData[keyName] = chartData[this.fixedValue];
      // delete chartData[this.fixedValue];

      // const yAxis
      console.log(this.chartData, "111");
      let fixedSorting = this.fixedSorting;
      if (!fixedSorting.includes(Object.keys(chartData[Object.keys(chartData)[0]])[0])) {
        fixedSorting = BMILevel;
      }
      console.log(fixedSorting, "fixedSorting", Object.keys(chartData));
      let keys = Object.keys(chartData)
        .filter(item => {
          return item !== keyName;
        });
      if (this.radio === 2) {
        if (this.unit === "%") {
          fixedSorting.forEach((str, index) => {
            if (index === 0) {
              return keys = keys.sort((a, b) => chartData[a][fixedSorting[0]] - chartData[b][fixedSorting[0]]);
            } else {
              return keys = keys.sort((a, b) => {
                if ((chartData[a][fixedSorting[index - 1]] === chartData[b][fixedSorting[index - 1]])) {
                  return chartData[a][fixedSorting[index]] - chartData[b][fixedSorting[index]];
                } else {
                  return 0;
                }
              });
            }
          });

        } else {
          keys = keys.sort((a, b) => chartData[a][Object.keys(chartData[a])[0]] - chartData[b][Object.keys(chartData[b])[0]]);
        }
      } else {
        if (this.unit === "%") {
          fixedSorting.forEach((str, index) => {
            if (index === 0) {
              return keys = keys.sort((a, b) => chartData[b][fixedSorting[0]] - chartData[a][fixedSorting[0]]);
            } else {
              return keys = keys.sort((a, b) => {
                if ((chartData[b][fixedSorting[index - 1]] === chartData[a][fixedSorting[index - 1]])) {
                  return chartData[b][fixedSorting[index]] - chartData[a][fixedSorting[index]];
                } else {
                  return 0;
                }
              });
            }
          });

          // keys = keys.sort((a, b) => chartData[b][fixedSorting[0]] - chartData[a][fixedSorting[0]]);

        } else {
          keys = keys.sort((a, b) => chartData[b][Object.keys(chartData[b])[0]] - chartData[a][Object.keys(chartData[a])[0]]);
          // keys = keys.sort((a, b) => chartData[b][fixedSorting[0]] - chartData[a][fixedSorting[0]]);

        }
      }
      if (keys.length === Object.keys(chartData).length) {
        keys = [...keys];


      } else {
        keys = [...keys, keyName];

      }

      // keys.sort()
      // const valueKeys = Object.keys(chartData.district)
      // const values = []
      const series = [];
      const arr = [];
      fixedSorting.forEach(key => {
        arr.push([...keys.map(k => {
          return chartData[k][key];
        })]);
      });
      const unit = this.unit;
      fixedSorting.forEach((key, i) => {
        // console.log(key, 'key', [chartData.district[key], chartData['山东省济南第二十七中学'][key]])
        const data = {
          name: key,
          type: "bar",
          stack: "total",
          label: {
            show: true,
            // textStyle: {
            color: "white",
            fontSize: 16,
            // },
            formatter: function(data) {
              if (data.value > 0) return data.value + unit;
              return "";
            }
          },
          emphasis: {
            focus: "series"
          },
          color: colors[i],
          data: arr[i].map(num => Number.isNaN(num) ? 0 : num ?? 0)
        };
        series.push(data);
      });
      console.log(series, "series");
      const option = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // Use axis to trigger tooltip
            type: "shadow" // 'shadow' as default; can also be 'line' or 'shadow'
          },
          formatter: function(params) {

            console.log(params, params.dataIndex, params.seriesIndex);
            let str = `<h1 class="text-center  text-black">${params[0]?.axisValue}</h1>`;
            params.forEach(param => {
              const { dataIndex, seriesIndex, marker, seriesName, seriesType, axisValue, data } = param;
              return str += `${marker}  ${seriesName}:  ${data}% <br/>`;
            });
            return str;
          }
        },
        // eslint-disable-next-line multiline-ternary
        legend: fixedSorting.length < 2 ? null : {
          top: 0,
          right: "4%",
          // padding: 20,
          itemWidth: 40,
          itemHeight: 19

        },
        grid: {
          left: "1%",
          right: "4%",
          bottom: "6%",
          containLabel: true
        },
        xAxis: {
          axisLine: {
            show: true,
            color: "#E5E5E5"
            // onZero: false
          },

          position: "top",
          type: "value",
          max: unit === "%" ? 100 : undefined,
          // min: 0,
          splitNumber: 5,
          axisLabel: {
            show: true,
            // textStyle: {
            color: "#000000", // 更改坐标轴文字颜色
            fontSize: 16 // 更改坐标轴文字大小
            // }
          }

        },
        yAxis: {
          type: "category",
          data: keys,
          axisLabel: {
            show: true,
            // textStyle: {
            color: "#000000", // 更改坐标轴文字颜色
            fontSize: 16 // 更改坐标轴文字大小
            // }
          },
          // type: 'value',
          scale: true,
          // max: 100,
          min: 0.1,
          // splitNumber: 5,
          boundaryGap: [0.2, 0.2],
          axisTick: {
            show: true,
            alignWithLabel: true
          }
        },
        series
        // series: [
        //   {
        //     name: 'Direct',
        //     type: 'bar',
        //     stack: 'total',
        //     label: {
        //       show: true
        //     },
        //     emphasis: {
        //       focus: 'series'
        //     },
        //     data: [320, 302, 301, 334, 390, 330, 320]
        //   },
        //   {
        //     name: 'Mail Ad',
        //     type: 'bar',
        //     stack: 'total',
        //     label: {
        //       show: true
        //     },
        //     emphasis: {
        //       focus: 'series'
        //     },
        //     data: [120, 132, 101, 134, 90, 230, 210]
        //   },
        //   {
        //     name: 'Affiliate Ad',
        //     type: 'bar',
        //     stack: 'total',
        //     label: {
        //       show: true
        //     },
        //     emphasis: {
        //       focus: 'series'
        //     },
        //     data: [220, 182, 191, 234, 290, 330, 310]
        //   },
        //   {
        //     name: 'Video Ad',
        //     type: 'bar',
        //     stack: 'total',
        //     label: {
        //       show: true
        //     },
        //     emphasis: {
        //       focus: 'series'
        //     },
        //     data: [150, 212, 201, 154, 190, 330, 410]
        //   },
        //   {
        //     name: 'Search Engine',
        //     type: 'bar',
        //     stack: 'total',
        //     label: {
        //       show: true
        //     },
        //     emphasis: {
        //       focus: 'series'
        //     },
        //     data: [820, 832, 901, 934, 1290, 1330, 1320]
        //   }
        // ]
      };
      console.log("option", option);
      setTimeout(() => {
        unwarp(this.chart).setOption(option);
        this.chart.resize();

      }, 0);
    }
  }
};
</script>
