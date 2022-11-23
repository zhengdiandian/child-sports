<template>
  <div class="relative">
    <div
      ref="chart"
      :class="className"
      :style="{height:height,width:width}"
    />
  </div>
</template>

<script>
import * as echarts from "echarts";
// import echarts from 'echarts' // echarts theme
import resize from "./mixins/resize.js";

import("./theme/macarons.js");
//
// const chart = { chart: null }
function colorRgba(color, a) {
  let sColor = color.toLowerCase();
  //十六进制颜色值的正则表达式
  const reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
  // 如果是16进制颜色
  if (sColor && reg.test(sColor)) {
    if (sColor.length === 4) {
      let sColorNew = "#";
      for (let i = 1; i < 4; i += 1) {
        sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
      }
      sColor = sColorNew;
    }
    //处理六位的颜色值
    let sColorChange = [];
    for (let i = 1; i < 7; i += 2) {
      sColorChange.push(parseInt("0x" + sColor.slice(i, i + 2)));
    }
    return "RGB(" + sColorChange.join(",") + `,${a}` + ")";
  }
  return sColor;
}

const unwarp = (obj) => obj && (obj.__v_raw || obj.valueOf() || obj);
export default {
  name: "Chart",
  mixins: [resize],
  props: {
    color: {
      default: "#877DF6"
    },
    seriesName: {
      default: "rgba(135, 125, 246, .35)"
    },
    seriesName2: {
      default: "rgba(135, 125, 246, .35)"
    },
    chartConfig: {
      default: function() {
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
      default: "420px"
    },
    autoResize: {
      type: Boolean,
      default: true
    },
    chartData: {
      type: Object,
      default: function() {
        return null;
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

      $_resizeHandler: null
    };
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
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
        this.setOptions(val);
      }
    }
  },

  mounted() {
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
        return 10;
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
      if (chartData === null) return;
      let option = {
        xAxis: {
          // name: '日期',
          nameGap: 10,
          // nameTextStyle: 'mytextStyle',
          data: this.chartData.timeList,
          boundaryGap: false,
          axisTick: {
            show: true,
            alignWithLabel: true
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: "#E5E5E5 "
            }
          },
          axisLabel: {
            show: true,
            textStyle: {
              color: "#333333", // 更改坐标轴文字颜色
              fontSize: 16 // 更改坐标轴文字大小
            }
          }
        },
        // dataZoom: [{
        //   // startValue: '12-04'
        // }, {
        //   type: 'inside'
        // }],
        grid: {
          left: 60,
          right: 30,
          bottom: 60,
          top: 60
          // containLabel: true
        },
        tooltip: {
          backgroundColor: colorRgba("#000000", .35),
          textStyle: {
            color: "#ffffff"
          },
          trigger: "axis",
          // formatter: function (params, value) {
          //   let relVal = params[0].name
          //   for (let i = 0, l = params.length; i < l; i++) {
          //     labelUnit ? relVal += '<br/>' + params[i].marker + params[i].seriesName + params[i].value + `${labelUnit}` : relVal += '<br/>' + params[i].marker + params[i].seriesName + params[i].value
          //   }
          //   return relVal
          // },
          axisPointer: {
            type: "cross"
          },

          padding: [5, 10]
        },
        yAxis: {
          name: this.yAxisName,
          nameGap: 10,
          axisLabel: {
            show: true,
            textStyle: {
              color: "#333333", // 更改坐标轴文字颜色
              fontSize: 16 // 更改坐标轴文字大小
            }
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: "#E5E5E5 "
            }
          },
          type: "value",
          scale: true,
          max: this.ceilNumber((Math.max.apply(null, this.chartData.data))),
          min: 0,
          splitNumber: 5,
          boundaryGap: [0.2, 0.2],
          axisTick: {
            show: true,
            alignWithLabel: true
          }
        },
        legend: {
          orient: "vertical",
          top: "0%",
          right: "8%"
        },
        series: [
          {
            name: this.seriesName,
            smooth: true,
            type: "line",
            itemStyle: {
              normal: {
                color: this.color,
                lineStyle: {
                  color: this.color,
                  width: 4,
                  borderWidth: 6
                },
                areaStyle: {
                  color: colorRgba(this.color, .35)
                }
              }
            },
            // markPoint: {
            //   symbol: 'pin', // 'circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'pin', path://m 0,0 h 48 v 20 h -30 l -6,10 l -6,-10 h -6 z,  path://m 0,0 h 48 v 20 h -34 l -6,10 l -6,-10 h -2 z
            //   // symbolSize: function(val){
            //   //   return [textSize(toHSpeed(val, 2),"12px").width+5,40]
            //   // },
            //   // symbolOffset: ['34%', '-50%'],
            //   symbolKeepAspect: true, // 如果 symbol 是 path:// 的形式，是否在缩放时保持该图形的长宽比。
            //   // label:{
            //   //   position: "insideTop",
            //   //   distance: 7,
            //   //   formatter: function (data){
            //   //     return toHSpeed(data.value, 2);
            //   //   }
            //   // },
            //   symbolSize:40,
            //   itemStyle: {
            //     normal: {
            //       label: {
            //         // formatter: function (param) {
            //         //   return param.value + `${labelUnit}`
            //         // },
            //         textStyle: {
            //           fontSize: 10
            //         }
            //       }
            //     }
            //
            //   },
            //   data: [
            //     { name: '当日值', value: expectedLastValue, yAxis: expectedLastValue, xAxis: (formatExpectedData.length - 1) }
            //     // {type: 'min', name: '最小值'}
            //   ]
            // },
            data: this.chartData.data,
            animationDuration: 2800,
            animationEasing: "cubicInOut"
          },
          {
            name: this.seriesName2,
            smooth: true,
            type: "line",
            itemStyle: {
              normal: {
                color: "#FFBB01",
                lineStyle: {
                  color: "#FFBB01",
                  width: 4,
                  borderWidth: 6
                },
                areaStyle: {
                  color: colorRgba("#FFBB01", .35)
                }
              }
            },
            // markPoint: {
            //   symbol: 'pin', // 'circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'pin', path://m 0,0 h 48 v 20 h -30 l -6,10 l -6,-10 h -6 z,  path://m 0,0 h 48 v 20 h -34 l -6,10 l -6,-10 h -2 z
            //   // symbolSize: function(val){
            //   //   return [textSize(toHSpeed(val, 2),"12px").width+5,40]
            //   // },
            //   // symbolOffset: ['34%', '-50%'],
            //   symbolKeepAspect: true, // 如果 symbol 是 path:// 的形式，是否在缩放时保持该图形的长宽比。
            //   // label:{
            //   //   position: "insideTop",
            //   //   distance: 7,
            //   //   formatter: function (data){
            //   //     return toHSpeed(data.value, 2);
            //   //   }
            //   // },
            //   symbolSize:40,
            //   itemStyle: {
            //     normal: {
            //       label: {
            //         // formatter: function (param) {
            //         //   return param.value + `${labelUnit}`
            //         // },
            //         textStyle: {
            //           fontSize: 10
            //         }
            //       }
            //     }
            //
            //   },
            //   data: [
            //     { name: '当日值', value: expectedLastValue, yAxis: expectedLastValue, xAxis: (formatExpectedData.length - 1) }
            //     // {type: 'min', name: '最小值'}
            //   ]
            // },
            data: this.chartData.data2,
            animationDuration: 2800,
            animationEasing: "cubicInOut"
          }

        ]
      };
      unwarp(this.chart).setOption(option);
    }
  }
};
</script>
