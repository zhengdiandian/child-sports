<template>
  <div
    :class="className"
    :style="{height:height,width:width}"
  />
</template>

<script>
import echarts from 'echarts' // echarts theme
import resize from './mixins/resize'
require('./theme/macarons')

export default {
  mixins: [resize],
  props: {
    chartConfig: {
      default: function () {
        return {}
      },
      type: Object
    },
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '220px'
    },
    autoResize: {
      type: Boolean,
      default: true
    },
    chartData: {
      type: Object,
      required: true
    },
    labelUnit: {
      type: String,
      default: ''
    },
    yAxisName: {
      default: '小时',
      type: String
    },
    type: {
      default: '',
      type: String
    }
  },
  data () {
    return {
      chart: null
    }
  },
  watch: {
    chartData: {
      deep: true,
      handler (val) {
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
        this.setOptions(val)
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeUnmount () {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    ceilNumber (number) { let bite = 0; if (number < 10) { return number } while (number >= 10) { number /= 10; bite += 1 } return Math.ceil(number) * 1.3 * Math.pow(10, bite) },
    initChart () {
      this.chart = echarts.init(this.$el, 'macarons')
      this.setOptions(this.chartData)
    },
    setOptions ({ expectedData, actualData } = {}) {
      const formatActualData = actualData.map(item => item.dayCount)
      const lastValue = formatActualData[formatActualData.length - 1]
      const formatExpectedData = expectedData.map(item => item.dayCount)
      const expectedLastValue = formatExpectedData[formatExpectedData.length - 1]
      const labelUnit = this.labelUnit
      this.chart.setOption(Object.assign(this.chartConfig,
        {
          xAxis: {
            name: '日期',
            nameGap: 10,
            nameTextStyle: 'mytextStyle',
            data: expectedData.map(item => item.dayTime),
            boundaryGap: false,
            axisTick: {
              show: true,
              alignWithLabel: true
            },
            axisLabel: {
              show: true,
              textStyle: {
                color: '#333333', // 更改坐标轴文字颜色
                fontSize: 16 // 更改坐标轴文字大小
              }
            }
          },
          dataZoom: [{
            // startValue: '12-04'
          }, {
            type: 'inside'
          }],
          grid: {
            left: 60,
            right: 60,
            bottom: 60,
            top: 30
            // containLabel: true
          },
          tooltip: {
            trigger: 'axis',
            formatter: function (params, value) {
              let relVal = params[0].name
              for (let i = 0, l = params.length; i < l; i++) {
                labelUnit ? relVal += '<br/>' + params[i].marker + params[i].seriesName + params[i].value + `${labelUnit}` : relVal += '<br/>' + params[i].marker + params[i].seriesName + params[i].value
              }
              return relVal
            },
            axisPointer: {
              type: 'cross'
            },
            padding: [5, 10]
          },
          yAxis: {
            name: this.yAxisName,
            nameGap: 10,
            axisLabel: {
              show: true,
              textStyle: {
                color: '#333333', // 更改坐标轴文字颜色
                fontSize: 16 // 更改坐标轴文字大小
              }
            },
            type: 'value',
            scale: true,
            max: this.ceilNumber((Math.max.apply(null, [...formatActualData, ...formatExpectedData]))),
            min: 0,
            splitNumber: 7,
            boundaryGap: [0.2, 0.2],
            axisTick: {
              show: true,
              alignWithLabel: true
            }
          },
          // legend: {
          //   data: ['expected', 'actual']
          // },
          series: [
            {
              name: this.type === 'homeWork' ? '综合完成率' : '闯关模式',
              smooth: true,
              type: 'line',
              itemStyle: {
                normal: {
                  color: this.type === 'homeWork' ? '#2CB774' : '#F7B02B',
                  lineStyle: {
                    color: this.type === 'homeWork' ? '#2CB774' : '#F7B02B',
                    width: 4,
                    borderWidth: 6
                  },
                  areaStyle: {
                    color: this.type === 'homeWork' ? 'rgba(44, 183, 116, 0.4)' : 'rgba(247, 176, 43, 0.26)'
                  }
                }
              },
              markPoint: {
                symbol: 'pin', // 'circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'pin', path://m 0,0 h 48 v 20 h -30 l -6,10 l -6,-10 h -6 z,  path://m 0,0 h 48 v 20 h -34 l -6,10 l -6,-10 h -2 z
                // symbolSize: function(val){
                //   return [textSize(toHSpeed(val, 2),"12px").width+5,40]
                // },
                // symbolOffset: ['34%', '-50%'],
                symbolKeepAspect: true, // 如果 symbol 是 path:// 的形式，是否在缩放时保持该图形的长宽比。
                // label:{
                //   position: "insideTop",
                //   distance: 7,
                //   formatter: function (data){
                //     return toHSpeed(data.value, 2);
                //   }
                // },
                symbolSize: expectedLastValue.toString().includes('.') ? 60 : 40,
                itemStyle: {
                  normal: {
                    label: {
                      formatter: function (param) {
                        return param.value + `${labelUnit}`
                      },
                      textStyle: {
                        fontSize: 10
                      }
                    }
                  }

                },
                data: [
                  { name: '当日值', value: expectedLastValue, yAxis: expectedLastValue, xAxis: (formatExpectedData.length - 1) }
                  // {type: 'min', name: '最小值'}
                ]
              },
              data: formatExpectedData,
              animationDuration: 2800,
              animationEasing: 'cubicInOut'
            },
            {
              name: this.type === 'homeWork' ? '综合得分率' : '自由模式',
              smooth: true,
              type: 'line',
              itemStyle: {
                normal: {
                  color: this.type === 'homeWork' ? '#EDA986' : '#0090FF',
                  lineStyle: {
                    color: this.type === 'homeWork' ? '#EDA986' : '#0090FF',
                    width: 4,
                    borderWidth: 6
                  },
                  areaStyle: {
                    color: this.type === 'homeWork' ? '#E8B397' : 'rgba(110, 190, 215, 0.4)'
                  }
                }
              },
              markPoint: {
                symbol: 'pin', // 'circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'pin', path://m 0,0 h 48 v 20 h -30 l -6,10 l -6,-10 h -6 z,  path://m 0,0 h 48 v 20 h -34 l -6,10 l -6,-10 h -2 z
                // symbolSize: function(val){
                //   return [textSize(toHSpeed(val, 2),"12px").width+5,40]
                // },
                // symbolOffset: ['34%', '-50%'],
                symbolKeepAspect: true, // 如果 symbol 是 path:// 的形式，是否在缩放时保持该图形的长宽比。
                // label:{
                //   position: "insideTop",
                //   distance: 7,
                //   formatter: function (data){
                //     return toHSpeed(data.value, 2);
                //   }
                // },
                symbolSize: lastValue.toString().includes('.') ? 60 : 40,
                itemStyle: {
                  normal: {
                    label: {
                      formatter: function (param) {
                        return param.value + `${labelUnit}`
                      },
                      textStyle: {
                        fontSize: 10
                      }
                    }
                  }
                //
                },
                data: [
                  { name: '当日值', value: lastValue, yAxis: lastValue, xAxis: (formatActualData.length - 1) }
                // {type: 'min', name: '最小值'}
                ]
              },
              data: formatActualData,
              animationDuration: 2800,
              animationEasing: 'quadraticOut'
            }]
        })
      )
    }
  }
}
</script>
