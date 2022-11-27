<template>
  <div id="card-wrapper">
    <div id="card">
      <div id="card-content">
        <div id="card-left">
          <div id="login-title">登录</div>
          <a-form id="login-form" :model="loginForm">
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
            <div id="button-wrapper">
              <a-button type="primary" long @click="handleLogin">登录</a-button>
              <a-button type="outline" long @click="goRegsiter">注册</a-button>
            </div>
          </a-form>
        </div>
        <div id="card-right"></div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { reactive } from "vue";
import { IconUser, IconLock } from "@arco-design/web-vue/es/icon";
import { useRouter } from "vue-router";
import { Message } from "@arco-design/web-vue";

const router = useRouter();
const loginForm = reactive({
  username: "rainchen",
  password: "ssr129631",
});

const goRegsiter = () => {
  router.push("/register");
};

const handleLogin = async () => {
  console.log(loginForm);
  try {
    const resp = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginForm),
    });
    const payload = await resp.json();
    console.log(payload);
    if (payload.code === 20000) {
      Message.success("登录成功");
      await router.push("/");
    } else {
      Message.warning(payload.message);
    }
  } catch (err: any) {
    console.log(err);
    Message.error(err.message);
  }
};
</script>
<style lang="css">
#card-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
#card {
  background-color: #ffffff;
  border-radius: 12px;
}
#card-content {
  display: flex;
}
#card-left,
#card-right {
  height: 500px;
}
#card-left {
  width: 360px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 36px;
  justify-content: center;
}
#card-right {
  width: 340px;
  background-image: url("/img/card-right.jpeg");
  background-size: cover;
  background-repeat: no-repeat;
  border-radius: 0 12px 12px 0;
}
#login-title {
  text-align: center;
  font-size: 36px;
  margin-bottom: 36px;
}
#login-form {
  width: 100%;
}
#button-wrapper {
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  row-gap: 12px;
}
</style>
