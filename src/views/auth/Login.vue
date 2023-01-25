<template>
  <div class="text-center text-4xl mb-9">登录</div>
  <a-form :model="loginForm">
    <a-form-item field="username" label="用户名" hide-label>
      <a-input v-model="loginForm.username" placeholder="请输入用户名">
        <template #prefix>
          <icon-user />
        </template>
      </a-input>
    </a-form-item>
    <a-form-item field="password" label="密码" hide-label>
      <a-input
        v-model="loginForm.password"
        placeholder="请输入密码"
        type="password"
        allow-clear
      >
        <template #prefix>
          <icon-lock />
        </template>
      </a-input>
    </a-form-item>
    <div class="mt-3 flex flex-col gap-y-3">
      <a-button type="primary" long @click="handleLogin">登录</a-button>
      <a-button type="outline" long @click="$router.push('/register')">
        注册
      </a-button>
    </div>
  </a-form>
</template>
<script lang="ts" setup>
import { reactive } from "vue";
import { IconUser, IconLock } from "@arco-design/web-vue/es/icon";
import { useRouter } from "vue-router";
import { Message } from "@arco-design/web-vue";
import { LoginForm } from "@/models/auth";
import useUserStore from "@/store/user";
import sleep from "@/utils/sleep";

const router = useRouter();
const userStore = useUserStore();
const loginForm = reactive<LoginForm>({
  username: "rainchen",
  password: "ssr129631",
});

const handleLogin = async () => {
  console.log(loginForm);
  if (await userStore.login(loginForm)) {
    Message.success("登录成功");
    await sleep(500);
    await router.push("/");
  }
};
</script>
<style lang="css"></style>
