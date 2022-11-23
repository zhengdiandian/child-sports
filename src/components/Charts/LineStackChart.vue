<script lang="js">
import resize from "./mixins/resize.js";
// import * as echarts from "echarts";
import "@/utils/echarts.js";

import("./theme/macarons.js");
const unwarp = (obj) => obj && (obj.__v_raw || obj.valueOf() || obj);

export default {
  mixins: [resize],
  props: {
    onlyOne: {
      default: false
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
      default: "400px"
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
      const isReverse = this.chartData.projectName.includes("跑");
      let min;
      const chartData = this.chartData;
      const projectData = this.chartData.datas.map(data => data.projectData);
      const targetData = this.chartData.datas.map(data => data.target);
      const teacherData = this.chartData.datas.map(data => data.teacherData);
      const dateList = this.chartData.datas.map(data => data.semester);
      let max = Math.max.apply(null, projectData);
      this.chartData.datas.map((data, index) => {


        data.standard.forEach((lavel, i) => {
          console.log(lavel, i);

          if (i === data.standard.length - 1) {
            let b1 = (data.standard[i].value * 2) - data.standard[i - 1].value;
            lavel.nextValue = Math.max(b1, max);
            lavel.v = Math.abs(lavel.nextValue - data.standard[i].value);

          } else if (i == 0) {
            let a1 = 0;

            if (["1分钟仰卧起坐(次)", "1分钟跳绳(次)"].includes(this.chartData.projectName)) {
              // lavel.nextValue = a1;
            } else {
              a1 = (data.standard[i + 1].value * 2) - data.standard[i + 2].value;

            }
            lavel.nextValue = Math.min(a1, Math.min.apply(null, projectData));
            min = a1;
            // lavel.nextValue = data.standard[i + 1].value;
            lavel.v = Math.abs(lavel.nextValue - data.standard[i + 1].value);
            // lavel.nextValue = 2;

          } else {

            lavel.nextValue = data.standard[i].value;
            lavel.v = Math.abs(lavel.nextValue - data.standard[i + 1].value);


          }
        });
        console.log("data", data.standard, max);

      });
      let levelList = this.chartData.datas[0].standard.map(data => data.level);
      const colors = ["#B8C5E6FF", "#C6E3B7FF", "#FBE0AAFF", "#F3AEAEFF", "#79BAB5FF"];
      const colors2 = ["#FCE39DFF", "#F6AB86FF", "#8BD3E4FF", "#79BAB5FF"];
      if (isReverse) {
        colors2.reverse();
      }
      const barColor = levelList.includes("差") ? colors2 : colors;
      const arrayProcessing = (arr) => {
        let length = arr.length;
        return arr.map((item, i) => {
          if (i === length - 1) {
            return Math.abs(item - arr[-1]);
          } else {
            return Math.abs(item - arr[i + 1]);
          }
        });
      };
      let o;
      let barList = levelList.map((level, i) => {
        if (i === 0) {
          o = {
            name: level,
            type: "bar",
            stack: "level",
            itemStyle: {
              normal: {
                color: barColor[i]
              }
            },

            emphasis: {
              focus: "series"
            },
            data: this.chartData.datas.map(data => {
              return data.standard.find(s => s.level == level).nextValue;
            })
          };
        }
        return {
          name: level,
          type: "bar",
          // barGap: '100%',
          barCategoryGap: this.onlyOne ? "-100000%" : "30%",
          stack: "level",
          itemStyle: {
            normal: {
              color: barColor[i]
            }
          },

          emphasis: {
            focus: "series"
          },
          data: this.chartData.datas.map(data => {
            return data.standard.find(s => s.level == level).v;
          })
        };
      });
      // o.data = o.data.map(data => Math.min.apply(null, o.data));
      barList.unshift(o);
      // let barList2 = barList.map((bar, i) => {
      //   let
      //   return
      // })

      let barMax = barList.map((item, index) => {

        return item.data[index];
      });
      let yMax = Math.max.apply(null, barList.map((item, index) => {

        return item.data[index];
      }));
      console.log("levelList", levelList, barMax);

      console.log("barList", barList);
      // if (["坐位体前屈(厘米)", "1分钟仰卧起坐(次)"].includes(this.chartData.projectName)) {
      //   alert(1);
      // }
      // console.log(, "sss");
      // alert(Math.min.call(null, projectData));
      const option = {
        // title: {
        //   text: "xx",
        //   textStyle: {
        //     color: "#3470D0FF",
        //     fontSize: 26
        //   }
        // },
        legend: {
          padding: 20,
          data: levelList
        },
        tooltip: {
          trigger: "item",
          axisPointer: {
            type: "shadow"
          },
          formatter(param) {
            const { dataIndex, seriesIndex, marker, seriesName, seriesType } = param;

            // console.log(param, param.dataIndex, param.seriesIndex);
            if (seriesType === "line") {
              return marker + seriesName + "：" + param.value;
            }
            if (seriesIndex === 2) {
              return marker + seriesName + "<" + chartData.datas[dataIndex].standard[seriesIndex - 1].value;
            }
            if (seriesIndex === 5) {
              return marker + seriesName + ">" + chartData.datas[dataIndex].standard[seriesIndex - 2].value;
            }
            return marker + seriesName + chartData.datas[dataIndex].standard[seriesIndex - 2].value + "~" + chartData.datas[dataIndex].standard[seriesIndex - 1].value;
            // + `<br> >`  + "< " + chartData.datas[param.dataIndex].standard[param.dataIndex + 1].nextValue;
          }
        },
        grid: {
          // top: "0%",
          left: "0%",
          right: "0%",
          bottom: "0%",
          containLabel: true
        },
        xAxis: [
          {
            // offset: 40,
            boundaryGap: true, //xAxis中的boundaryGap属性，设置为false代表是零刻度开始，设置为true代表离零刻度间隔一段距离
            type: "category",
            // axisLine: { onZero: true },
            // splitLine: { show: true },
            // splitArea: { show: true },
            axisTick: {
              alignWithLabel: true
            },
            axisLine: {
              show: true,
              onZero: false,
              lineStyle: {
                color: "#E0E7F1FF"
              }
            },


            axisLabel: {
              show: true,
              // textStyle: {
              color: "#000000", // 更改坐标轴文字颜色
              fontSize: 16 // 更改坐标轴文字大小
              // }
            },
            data: dateList
          }
        ]

        ,
        yAxis: [
          {
            position: "left",
            type: "value",
            alignTicks: false,
            splitLine: {
              show: false
            },
            inverse: isReverse,
            // interval: this.ceilNumber(Number.parseInt(max / 6)),
            axisLine: {
              onZero: false,

              show: true,
              lineStyle: {
                color: "#E0E7F1FF"
              }
            },
            axisTick: {
              show: true,
              alignWithLabel: true
            },
            axisLabel: {
              show: true,
              color: "#666666", // 更改坐标轴文字颜色
              fontSize: 16 // 更改坐标轴文字大小
            },
            scale: true

            // min:isReverse? Math.min.apply(null, projectData):  Math.ceil( Math.min.apply(null, o.data))
            // min: Math.min.apply(null, projectData),
            // max: (400),
            // interval: 5
            // splitNumber: 4
            // data: barMax
            // splitLine: { show: false },
            // axisLabel: {
            //   show: true
            // },
            // data: this.chartData.datas.map(data => data.semester)
          }
          // {
          //   type: "category",
          //   position: "right",
          //
          //   axisLine: {
          //     show: false,
          //     color: "#E5E5E5",
          //     onZero: false
          //   },
          //   axisLabel: {
          //     show: true,
          //     color: "#333333", // 更改坐标轴文字颜色
          //     fontSize: 16 // 更改坐标轴文字大小
          //   },
          //   data: levelList
          // }
        ],
        series: [

          {
            name: "自测记录",
            type: "line",
            emphasis: {
              focus: "series"
            },
            symbolSize: 10,
            axisLine: {
              show: false,
              color: "#E5E5E5",
              onZero: false
            },
            // stack: "level",
            itemStyle: {
              normal: {
                color: "#FFFFFFFF",
                lineStyle: {
                  color: "#3470D0FF",
                  width: 4,
                  borderWidth: 6
                }

              }
            },
            markLine: {
              // label: {
              //   // show: false,
              //   position: "middle" //标线位置，start，middle，end
              // },
              lineStyle: {
                type: "solid",
                color: "#000000",
                width: 4,
                borderWidth: 6

              },

              symbol: "none",
              label: {
                show: false,

                formatter: "自定义目标",
                fontSize: "20"
              },
              data: dateList.map((date, index) => {
                return [
                  {
                    coord: [dateList[index], targetData[index]]
                  },
                  {

                    coord: [dateList[index + 1], targetData[index]]
                  }
                ];
              })


            },
            // markLine: {
            //   label: {
            //     // position: "middle" //标线位置，start，middle，end
            //   },
            //   data: [
            //
            //     {
            //       name: "xxx",
            //       lineStyle: {
            //         type: "solid",
            //         color: "#000000",
            //         width: 4,
            //         borderWidth: 6
            //
            //       },
            //       label: {
            //         formatter: "自定义目标",
            //         fontSize: "20"
            //       },
            //       xAxis: this.chartData.datas.map(data => data.semester)[0]
            //     }
            //     // {
            //     //   name: "xxx",
            //     //   lineStyle: {
            //     //     type: "solid",
            //     //     color: "#000000",
            //     //     width: 4,
            //     //     borderWidth: 6
            //     //
            //     //   },
            //     //   label: {
            //     //     // formatter: "自定义目标",
            //     //     fontSize: "20"
            //     //   },
            //     //   yAxis: 10
            //     // }
            //   ]
            // },
            data: projectData
          },
          {
            name: "教师记录",
            type: "line",
            emphasis: {
              focus: "series"
            },
            symbolSize: 10,
            axisLine: {
              show: false,
              color: "#E5E5E5",
              onZero: false
            },
            // stack: "level",
            itemStyle: {
              normal: {
                color: "#FFFFFFFF",
                lineStyle: {
                  color: "#07B57C",
                  width: 4,
                  borderWidth: 6
                }

              }
            },
            data: teacherData
          },
          // {
          //   name: "自定义目标",
          //   type: "line",
          //   emphasis: {
          //     focus: "series"
          //   },
          //   symbolSize: 10,
          //   axisLine: {
          //     show: false,
          //     color: "#E5E5E5",
          //     onZero: false
          //   },
          //   // stack: "level",
          //   itemStyle: {
          //     normal: {
          //       color: "#FFFFFFFF",
          //       lineStyle: {
          //         color: "#000000",
          //         width: 4,
          //         borderWidth: 6
          //       }
          //
          //     }
          //   },
          //   data: targetData
          // },
          // {
          //   name: "差",
          //   type: "bar",
          //   stack: "level",
          //   emphasis: {
          //     focus: "series"
          //   },
          //   data: [-53, -43, -53, -53, -53]
          // },
          ...barList
          // {
          //   name: "Emailx",
          //   type: "bar",
          //   stack: "Ad",
          //   emphasis: {
          //     focus: "series"
          //   },
          //   data: [-53]
          // },

          // {
          //   name: "e",
          //   type: "bar",
          //   stack: "Ad",
          //   emphasis: {
          //     focus: "series"
          //   },
          //   data: [70]
          // },
          // {
          //   name: "a",
          //   type: "bar",
          //   stack: "Ad",
          //   emphasis: {
          //     focus: "series"
          //   },
          //   data: [16]
          // },
          // {
          //   name: "b",
          //   type: "bar",
          //   stack: "Ad",
          //   emphasis: {
          //     focus: "series"
          //   },
          //   data: [16]
          // }

          // {
          //   name: "Union Ads",
          //   type: "bar",
          //   stack: "Ad",
          //   emphasis: {
          //     focus: "series"
          //   },
          //   data: [220, 182, 191, 234, 290, 330, 310]
          // }
          // {
          //   name: "Video Ads",
          //   type: "bar",
          //   stack: "Ad",
          //   emphasis: {
          //     focus: "series"
          //   },
          //   data: [150, 232, 201, 154, 190, 330, 410]
          // },
          // {
          //   name: "Video ",
          //   type: "bar",
          //   stack: "Ad",
          //   emphasis: {
          //     focus: "series"
          //   },
          //   data: [150, 232, 201, 154, 190, 330, 410]
          // }
        ]
      };
      unwarp(this.chart).setOption(option);
      // this.chart.setOption(option);

    }
  }
};
</script>
<template>
  <h3 class="square -mb-10   w-full flex ">
    <div class="flex justify-between w-full">
      <div class="">
        <span class="text-blue text-2xl text-left">{{ chartData.projectName }}</span>
      </div>
      <div class=" flex nowrap space-x-6">
        <div class="square before:bg-black before:rounded-full">
          目标
        </div>
        <div class="square before:bg-blue before:rounded-full">
          自测记录
        </div>
        <div class="square before:bg-[#07B57C] before:rounded-full">
          教师记录
        </div>
      </div>
    </div>
  </h3>
  <div
    id="chart"
    ref="chart"
    :class="className"
    :style="{height:height,width:width}"
  />
</template>

<style lang="scss" scoped>

</style>
