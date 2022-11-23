<template>
  <div>
    <h3 class="text-black text-2xl mb-4">
      {{ state.randomtestName }}
    </h3>
    <div class="space-y-2">
      <div class="grid    grid-cols-7 gap-y-2">
        <div class="square ">
          抽测时间：<span class="text-blue">{{ dateFormat(state?.randomtestStartDate ?? "", "yyyy-mm-dd") }}</span>
        </div>
        <div class="square">
          抽测地点：<span class="text-blue">{{ state.randomtestAddress }}</span>
        </div>
        <div class="square col-span-3">
          抽测项目：<span class="text-blue truncate">{{
            state.randomtestProjects ? (state.randomtestProjects).join(" ") : ""
          }}</span>
        </div>
        <div class="square">
          覆盖范围：<span class="text-blue">{{ state.randomtestDistrict }}</span>
        </div>
      </div>
      <div class="grid    grid-cols-7 gap-y-2">
        <div class="square">
          参与年级：<span class="text-blue">{{ state.randomtestSchoolType }}</span>
        </div>
        <div class="square">
          参与学校：<span class="text-blue">{{ state?.randomtestSchoolsNames?.length ?? 0 }} </span> 所
        </div>
        <div class="square">
          参与班级数量：<span class="text-blue">{{ state?.randomtestSchoolsNames?.length ?? 0 }}</span>个
        </div>
        <div class="square">
          班级标号：<span class="text-blue">2021年09月12日</span>
        </div>
        <div class="square">
          参与人数：<span class="text-blue">{{ state.randomtestStudentNum }}</span>
        </div>
        <div class="square">
          免测人数：<span class="text-blue">{{ state.randomtestTestfreeNum }}</span>
        </div>
        <div class="square">
          发布人：<span class="text-blue">{{ state?.randomtestPublisher ?? "" }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import dateFormat from "@/utils/dateFormat";
import { getRandomTestById } from "@/api/randomTest";
import { useStore } from "vuex";
import { defineEmits, defineExpose, onBeforeMount, ref } from "vue";
import { useRoute } from "vue-router";

console.log(1);
const emit = defineEmits(["state"]);

// export default {
//   setup () {
const randomtestId = useRoute().query.randomtestId || useStore().state.RandomTest.randomtestId;
const state = ref({
  randomtestId: 22,
  randomtestLevel: "",
  randomtestProvince: "",
  randomtestCity: "",
  randomtestDistrict: "",
  randomtestName: "",
  randomtestSchoolType: "",
  randomtestGrade: 1,
  randomtestClass: 1,
  randomtestStartDate: "",
  randomtestEndDate: "",
  randomtestAddress: "",
  randomtestProject: "",
  randomtestPublisher: "test",
  randomtestIntroduction: "",
  randomtestClassId: null,
  randomtestClassName: null,
  randomtestSchoolId: null,
  randomtestSchoolName: null,
  randomtestStudentNum: null,
  randomtestTestfreeNum: null,
  randomtestTestState: null,
  randomtestScoreState: null,
  randomtestProjects: []
});
defineExpose({
  state
});
onBeforeMount(async () => {
  const res = await getRandomTestById({ randomtestId });
  state.value = res.data;
  emit("state", state.value);
});
//     return {
//       data: state,
//       ...toRefs(state)
//     }
//   }
// }

// const data = reactive(res.data)

// getRandomTestById({ randomtestId }).then(({ data }) => {
//   debugger
//   test = reactive(data)
// })
// const {..test} = test
</script>

<style lang="scss" scoped>

</style>
