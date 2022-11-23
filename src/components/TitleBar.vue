<script>
// import {mdiGithub} from '@mdi/js'
import { useRoute, useRouter } from "vue-router";
import { onMounted, reactive, toRefs, watch } from "vue";

// defineProps({
//   titleStack: {
//     type: Array,
//     default: () => []
//   }
// })
export default {
  setup() {
    const route = useRoute();
    const router = useRouter();
    const state = reactive({
      routerList: []
    });
    // onMounted
    onMounted(() => {
      const matched = route.matched;// 获取菜单对应的路由信息
      state.list = matched;
    });

    // watch
    watch(() => route.matched, (newVal, oldVal) => {
      const matched = newVal;
      state.routerList = matched;// 更新路由菜单数组
      console.log(matched, 11);
    });
    const to = (title, index) => {
      debugger
      console.log(title, index);
      if (index !== 0 && index !== state.routerList.length - 1) {
        router.go(-1);
      }
    };
    // return
    return {
      to,
      ...toRefs(state) // toRefs() 将数据变成响应式数据
    };
  }
};

</script>

<template>
  <section class="p-6">
    <level>
      <ul>
        <li
          v-for="(title, index) in routerList"
          :key="index"
          class="title-stack-item inline-block pr-3 text-xl text-gray-500 dark:text-gray-400 last:pr-0 last:font-black
            last:text-black dark:text-gray-100 cursor-text "
          :class="[index !==0 && index!==routerList.length -1? 'underline cursor-pointer': '']"
          @click="to(title,index)"
        >
          {{ title.meta.title }}
        </li>
      </ul>
      <!--      <jb-button-->
      <!--        href="https://github.com/justboil/admin-one-vue-tailwind"-->
      <!--        color="info"-->
      <!--        label="Star on GitHub"-->
      <!--        target="_blank"-->
      <!--        :icon="mdiGithub"-->
      <!--      />-->
    </level>
  </section>
</template>

<style scoped>
li.title-stack-item:not(:last-child):after {
  content: '/';
  @apply inline-block pl-3;
}
</style>
