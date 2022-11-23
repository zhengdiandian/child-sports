<!--<script setup lang="ts">-->

<!--import { nextTick, onMounted, reactive, ref, toRefs, onBeforeUnmount } from 'vue'-->
<!--import * as echarts from 'echarts'-->
<!--import('./theme/macarons.js')-->

<!--const unwarp = (obj) => obj && (obj.__v_raw || obj.valueOf() || obj)-->

<!--const props = defineProps({-->
<!--  fixedSorting: {-->
<!--    type: Array,-->
<!--    default () {-->
<!--      return ['优秀', '良好', '及格', '不及格', '未完成率']-->
<!--    }-->
<!--  },-->
<!--  chartConfig: {-->
<!--    default: function () {-->
<!--      return {}-->
<!--    },-->
<!--    type: Object-->
<!--  },-->
<!--  className: {-->
<!--    type: String,-->
<!--    default: 'chart'-->
<!--  },-->
<!--  width: {-->
<!--    type: String,-->
<!--    default: '100%'-->
<!--  },-->
<!--  height: {-->
<!--    type: String,-->
<!--    default: '420px'-->
<!--  },-->
<!--  autoResize: {-->
<!--    type: Boolean-->
<!--    // default: true-->
<!--  },-->
<!--  chartData: {-->
<!--    type: Object-->
<!--    // required: true-->
<!--  },-->
<!--  labelUnit: {-->
<!--    type: String,-->
<!--    default: ''-->
<!--  },-->
<!--  yAxisName: {-->
<!--    default: '小时',-->
<!--    type: String-->
<!--  },-->
<!--  type: {-->
<!--    default: '',-->
<!--    type: String-->
<!--  }-->
<!--})-->

<!--const { chartData, className, height, width } = toRefs(props)-->

<!--const chartDom = ref(null)-->
<!--let chart-->
<!--debugger-->
<!--const initChart = () => {-->
<!--  chart = echarts.init(chartDom.value, 'macarons')-->
<!--  setOptions(chartData)-->
<!--}-->
<!--onMounted(() => {-->
<!--  nextTick(-->
<!--    initChart-->
<!--  )-->
<!--})-->
<!--onBeforeUnmount(() => {-->
<!--  if (chart) {-->
<!--    return-->
<!--  }-->
<!--  chart.dispose()-->
<!--  chart = null-->
<!--})-->
<!--const setOptions = (chartData) => {-->
<!--  const option = {-->
<!--    tooltip: {-->
<!--      trigger: 'item'-->
<!--    },-->
<!--    legend: {-->
<!--      orient: 'vertical',-->
<!--      top: 'center',-->
<!--      left: '2%'-->
<!--    },-->
<!--    series: [-->
<!--      {-->
<!--        name: 'Access From',-->
<!--        type: 'pie',-->
<!--        radius: ['40%', '70%'],-->
<!--        avoidLabelOverlap: false,-->
<!--        label: {-->
<!--          show: false,-->
<!--          position: 'center'-->
<!--        },-->
<!--        emphasis: {-->
<!--          label: {-->
<!--            show: true,-->
<!--            fontSize: '40',-->
<!--            fontWeight: 'bold'-->
<!--          }-->
<!--        },-->
<!--        labelLine: {-->
<!--          show: false-->
<!--        },-->
<!--        data: [-->
<!--          { value: 1048, name: 'Search Engine' },-->
<!--          { value: 735, name: 'Direct' },-->
<!--          { value: 580, name: 'Email' },-->
<!--          { value: 484, name: 'Union Ads' },-->
<!--          { value: 300, name: 'Video Ads' }-->
<!--        ]-->
<!--      }-->
<!--    ]-->
<!--  }-->

<!--  chart.setOption(option)-->
<!--}-->
<!--</script>-->

<script lang="js">
import resize from "./mixins/resize.js";
import * as echarts from "echarts";

import("./theme/macarons.js");
const unwarp = (obj) => obj && (obj.__v_raw || obj.valueOf() || obj);
export default {
  mixins: [resize],
  props: {
    fixedSorting: {
      type: Array,
      default() {
        return ["优秀", "良好", "及格", "不及格", "未完成率"];
      }
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
      return Math.ceil(number) * 1.3 * Math.pow(10, bite);
    },
    initChart() {
      this.chart = echarts.init(this.$refs.chart, "macarons");
      this.setOptions(this.chartData);
    },
    setOptions() {
      const data = [
        { value: this.chartData?.excellentRate ?? 0, name: "优秀率" },
        { value: this.chartData?.goodRate ?? 0, name: "良好率" },
        { value: this.chartData?.passRate ?? 0, name: "及格率" },
        { value: this.chartData?.noPassRate ?? 0, name: "不及格率" },
        { value: this.chartData?.undoneRate ?? 0, name: "未完成率" }
      ];
      const option = {
        color: ["#47A09A", "#60C2DA", "#F48B58", "#FCD879", "#435B79", "#435C79"],
        tooltip: {
          trigger: "item",
          formatter: function(data) {
            console.log(data);
            if (data.value > 0) return data.marker + data.name + ":" + data.value + "%";
            return "";
          }
        },
        legend: {
          orient: "vertical",
          top: "center",
          left: "0"
        },
        // grid: {
        //   left: '10%',
        //   right: '4%',
        //   bottom: '6%',
        //   containLabel: true
        // },
        series: [
          {
            // name: "Access From",
            type: "pie",
            radius: ["40%", "90%"],

            avoidLabelOverlap: false,
            label: {
              show: false,
              position: "center"
            },
            emphasis: {
              label: {
                show: true,
                fontSize: "40",
                fontWeight: "bold"
              }
            },
            labelLine: {
              show: false
            },
            data
          }
        ]
      };

      unwarp(this.chart).setOption(option);
    }
  }
};
</script>
<template>
  <div
    id="chart"
    ref="chart"
    :class="className"
    :style="{height:height,width:width}"
  />
</template>

<style lang="scss" scoped>

</style>
