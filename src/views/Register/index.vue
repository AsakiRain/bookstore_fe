<template>
  <div id="card-wrapper" class="flex justify-center items-center h-screen">
    <div id="card" class="bg-white rounded-xl">
      <div id="card-content" class="flex h-500px">
        <div id="card-left" class="w-360px flex flex-col items-center p-9 justify-center">
          <div id="register-title" class="text-center text-4xl mb-9">注册</div>
          <a-form
            id="register-form"
            :model="registerForm"
            @submit="handleRegister"
          >
            <a-form-item
              field="username"
              label="用户名"
              hide-label
              :validate-trigger="['blur']"
              :rules="[
                { required: true, message: '用户名不能为空' },
                {
                  match: /^[a-zA-Z0-9_]{2,20}$/,
                  message: '只能输入2-20位字母、数字和下划线',
                },
              ]"
            >
              <a-input
                v-model="registerForm.username"
                placeholder="请输入用户名"
              >
                <template #prefix>
                  <icon-user/>
                </template>
              </a-input>
            </a-form-item>
            <a-form-item
              field="nickname"
              label="昵称"
              hide-label
              :validate-trigger="['blur']"
              :rules="[
                { required: true, message: '昵称不能为空' },
                {
                  match: /^[\u4E00-\u9FA5A-Za-z0-9_]{2,20}$/,
                  message: '只能输入2-20位可见字符',
                },
              ]"
            >
              <a-input v-model="registerForm.nickname" placeholder="请输入昵称">
                <template #prefix>
                  <icon-at/>
                </template>
              </a-input>
            </a-form-item>
            <a-form-item
              field="password"
              label="密码"
              hide-label
              :validate-trigger="['blur']"
              :rules="[
                { required: true, message: '密码不能为空' },
                {
                  match: /[\x21-\x7e]{8,36}$/,
                  message: '只能输入8-36位字母、数字和符号',
                },
              ]"
            >
              <a-input
                v-model="registerForm.password"
                placeholder="请输入密码"
                type="password"
                allow-clear
              >
                <template #prefix>
                  <icon-lock/>
                </template>
              </a-input>
            </a-form-item>
            <a-form-item field="sex" label="性别"
                         :validate-trigger="['blur']"
                         :rules="[
                { required: true, message: '请选择性别' },
              ]">
              <a-select placeholder="请选择性别" v-model="registerForm.sex" allow-create>
                <a-option>未指定</a-option>
                <a-option>男</a-option>
                <a-option>女</a-option>
              </a-select>
            </a-form-item>
            <div id="button-wrapper" class="mt-3 flex flex-col gap-y-3">
              <a-button type="primary" long html-type="submit">注册</a-button>
              <a-button type="outline" long @click="$router.push('/login')">登录</a-button>
            </div>
          </a-form>
        </div>
        <div id="card-right" class="w-340px bg-cover bg-no-repeat rounded-r-xl bg-[url(/img/card-right.jpeg)]"></div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { reactive } from 'vue';
  import { IconUser, IconLock, IconAt } from '@arco-design/web-vue/es/icon';
  import { useRouter } from 'vue-router';
  import { Message, ValidatedError } from '@arco-design/web-vue';
  import type { RegisterForm } from '@/models/auth';
  import useUserStore from '@/store/user';
  import sleep from '@/utils/sleep';

  const router = useRouter();
  const userStore = useUserStore();
  const registerForm = reactive<RegisterForm>({
    username: 'rainchen',
    nickname: 'rainchen',
    password: 'ssr129631',
    sex: '男'
  });

  const handleRegister = async ({
                                  values,
                                  errors
                                }: { values: RegisterForm, errors: Record<string, ValidatedError> }) => {
    if (errors) return;
    console.log(values);
    if (await userStore.register(values)) {
      Message.success('注册成功');
      await sleep(500);
      await router.push('/');
    }
  };
</script>
<style lang="css">
</style>
