<script setup lang="ts">
import { inject, reactive, ref } from "vue";
import { ElForm } from "element-plus";
import { ExamListAddResult } from "@/interface/examListAdd";
import { ElMessage } from "element-plus/es";
import { updatePassword } from "@/api/accountManagement";
import { useStore } from "vuex";

const store = useStore();
const props = defineProps({
  username: {
    default: undefined
  },
  type: {
    default: "update"
  },
  userInfo: {
    default: {
      id: undefined
    }
  }
});
let dialogFormVisible = inject("dialogFormVisible");
let defaultData = {
  "newPassword": "",
  "oldPassword": "",
  username: props.username,
  newPassword2: ""
};

let statusText = "";
if (props.type === "update") {
  statusText = "修改";

} else {
  statusText = "重置";


}
let creatForm: any = reactive(defaultData);
type FormInstance = InstanceType<typeof ElForm>
const formRef = ref<FormInstance>();
const validatePass = (rule: any, value: any, callback: any) => {
  if (value === "") {
    callback(new Error("请输入密码！"));
  } else {
    if (creatForm.newPassword !== "") {
      if (!formRef.value) return;
      formRef.value.validateField("checkPass", () => null);
    }
    callback();
  }
};
const validatePass2 = (rule: any, value: any, callback: any) => {
  if (value === "") {
    callback(new Error("请输入确认密码！"));
  } else if (value !== creatForm.newPassword) {
    callback(new Error("俩次密码必须一致！"));
  } else {
    callback();
  }
};

const rules = reactive({
  newPassword: [{ validator: validatePass, trigger: "blur", required: true }],
  newPassword2: [{ validator: validatePass2, trigger: "blur", required: true }],
  oldPassword: [{ trigger: "blur", required: true }]
});
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};

function checkFormData() {
  if (!formRef.value) return false;
  let isPass: any = true;
  formRef.value.validate((val) => {
    console.log("验证的值", val);
    isPass = val;
  });
  return isPass;
}

const submitForm = () => {
  if (!checkFormData()) return;
  let parameter = { ...creatForm };
  parameter.username = props.username;
  if (props.type !== "update") {
    parameter = {
      id: props.userInfo?.id,
      password: creatForm.newPassword
    };
  }
  updatePassword(parameter, props.type)
    .then((res: ExamListAddResult) => {
      if (res.code === 200) {
        ElMessage({
          message: statusText + "成功！",
          type: "success"
        });
        dialogFormVisible.value = false;
        resetForm(formRef.value);
      }

    });
};
</script>
<template>
  <Teleport to="body">
    <div>
      <el-dialog
        v-model="dialogFormVisible"
        destroy-on-close
        title="修改密码"
        center
      >
        <template #title>
          <h3 class="text-xl text-black  flex items-center">
            <span class="iconfont icon-xiugai1 text-blue  text-2xl"></span>
            <span
              class="pl-2"
            >修改密码</span>
          </h3>
        </template>
        <el-form
          ref="formRef"
          :model="creatForm"
          :rules="rules"
          class="mx-8"
          label-position="left"
          label-width="126px"
        >
          <template v-if="props.type === 'update'">
            <el-form-item
              label="原始密码："
              prop="oldPassword"
            >
              <el-input
                v-model.trim="creatForm.oldPassword"
                autocomplete="off"
                placeholder="请输入原始密码"
              />
            </el-form-item>
          </template>
          <template v-else>
            <el-form-item
              label="登录账号："
            >
              <span class="text-blue">{{ userInfo.username }}</span>
            </el-form-item>
            <el-form-item
              label="账号角色："
            >
              <span class="text-blue">{{ userInfo.role }}</span>
            </el-form-item>
            <el-form-item
              label="姓 名："
            >
              <span class="text-blue">{{ userInfo.nickName }}</span>
            </el-form-item>
          </template>
          <el-form-item
            label="新密码："
            prop="newPassword"
          >
            <el-input
              v-model.trim="creatForm.newPassword"
              type="password"
              autocomplete="new-password"
              placeholder="请输入新密码"
            />
          </el-form-item>
          <el-form-item
            label="确认密码："
            prop="newPassword2"
          >
            <el-input
              v-model.type="creatForm.newPassword2"
              type="password"
              autocomplete="new-password"
              placeholder="请确认密码"
            />
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button
              @click="dialogFormVisible = false"
            >取消</el-button>

            <el-button
              class="ml-12"
              type="primary"
              @click="submitForm"
            >确定</el-button>
          </span>
        </template>
      </el-dialog>
    </div>
  </Teleport>
</template>


<style lang="scss" scoped>


</style>
