<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { check, get, getUserRole, login, refresh } from "@/api";
import { setToken, setUserRoles } from "@/utils/auth.js";
import LoadingButton from "@/components/LodingButton.vue";
import { useStore } from "vuex";
import { ElMessage } from "element-plus";

const form = reactive({
  captcha: "",
  keepLoggedIn: false,
  password: "",
  token: "",
  username: ""
});
const store = useStore();
const msg = ref("");

const imgURL = ref("");
const submitButton = ref();
const router = useRouter();
const getCode = () => {
  get().then(({ data }) => {
    const { cToken, img } = data;
    imgURL.value = "data:image/png;base64," + img;
    form.token = cToken;
  });
};
getCode();

const handleRefresh = () => {
  refresh({ preCaptchaUUID: form.token }).then(
    ({ data }) => {
      const { cToken, img } = data;
      imgURL.value = "data:image/png;base64," + img;
      form.token = cToken;
    }
  );
};
// refresh()
const submit = () => {
  msg.value = "";
  submitButton.value.startLoading();
  check({ id: form.token, text: form.captcha }).then(({ data, code }) => {
    debugger
    submitButton.value.stopLoading();
    if (code === 200) {
      login(form).then(async res => {
        console.log("ok", res);
        const { id, token, tokenHead } = res.data;
        setToken(token, tokenHead);
        store.commit("User/setUserRoles", res.data);
        await getRole(id);
      }).catch(() => {
        msg.value = "用户名或密码，请重新输入";
        submitButton.value.stopLoading();
      });
    } else {
      getCode();
      submitButton.value.stopLoading();
      msg.value = "验证码错误";
    }
  }).catch(e => {
    msg.value = "验证码错误";
    getCode();
    submitButton.value.stopLoading();
  });
};

const getRole = (id) => {
  getUserRole(id).then(async (res) => {
    const { data, code, message } = res;
    if (code !== 200) {
      return ElMessage.error(message);
    }
    setUserRoles(data[0]);
    await store.dispatch("setStyle", "white");
    await store.dispatch("User/getRoutes");
    await router.replace({ name: "overview" });
  }).catch(e => {
    const { code, message } = e;

    if (code !== 200) {
      // return ElMessage.error(message)
    }
  });
};
</script>

<template>
  <div
    class="w-full h-screen bg-login-bg  bg-cover flex items-center justify-center bg-[url('@/img/loginPic4.png')] -z-1 "
  >
    <div class=" w-full h-full flex object-center min-h-screen items-center ">
      <div class="mx-auto lg:w-8/12 w-screen   h-3/5   flex   relative  shadow-2xl  z-30 bg-white">
        <div
          class=" hidden  lg:block w-[50%] h-full bg-[url('@/img/loginPic3.png')]   bg-cover bg-left-top -ml-7  absolute top-0  left-0 z-30"
        >
          <!--          <img-->
          <!--            src="@/img/ball.png"-->
          <!--            alt=""-->
          <!--            class="absolute bottom-[2.33rem] left-[-2rem]"-->
          <!--          >-->
        </div>
        <div class="lg:w-5/12 w-full space-y-4 pr-10  absolute right-0 top-0 px-6">
          <h1 class="mt-20 text-xl font-medium ">
            济南智慧体育云管理平台
          </h1>
          <div
            v-show="msg"
            class="text-red-700 text-xs "
          >
            {{ msg }}
          </div>
          <input
            v-model.trim="form.username"
            type="text"
            class="px-2 h-10 py-1 text-xs focus:outline-none focus:ring-0 w-full   border-0 border-b border-gray-400"
            placeholder="请输入用户名"
          >
          <input
            v-model.trim="form.password"
            type="password"
            placeholder="请输入密码"
            class="px-2 h-10 py-1 text-xs focus:outline-none focus:ring-0 w-full   border-0 border-b border-gray-400"
          >
          <div class="relative h-full">
            <input
              v-model.trim="form.captcha"
              placeholder="请输入验证码"
              type="text"
              class="block h-10 px-2  py-1 text-xs focus:outline-none focus:ring-0 w-full   border-0 border-b border-gray-400 "
              @keydown.enter="submit"
            >
            <div class="absolute h-full  bottom-1/2 right-0 translate-y-1/2 flex justify-end item-align ">
              <div class="w-5/12  h-full py-1 ">
                <img
                  class="h-full"
                  :src="imgURL"
                  alt=""
                >
              </div>
              <button
                class="text-xs w-14 text-gray-300"
                @click="handleRefresh"
              >
                换一张
              </button>
            </div>
          </div>
          <div class="flex justify-start items-center">
            <!--            <el-checkbox-->
            <!--              v-model="form.keepLoggedIn"-->
            <!--              label=""-->
            <!--              size="large"-->
            <!--            />-->
            <!--            <span class="  w-auto  ml-2 text-xs">记住密码</span>-->
          </div>
          <div>
            <div class="mt-2" />
            <!--            <button-->
            <!--              class=" rounded-sm text-white text-center py-3 bg-blue-500 w-full text-sm "-->
            <!--              @click="submit"-->
            <!--            >-->
            <!--              登录-->
            <!--            </button>-->
            <LoadingButton
              ref="submitButton"
              class=" rounded-sm text-white text-center py-3 bg-blue-500 w-full text-sm "
              @click="submit"
            >
              登录
            </LoadingButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
