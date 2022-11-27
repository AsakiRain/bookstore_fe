<template>
  <main class="main" :style="{width: $route.meta.expand ? '100%' : '1200px'}">
    <div class="side-bar" id="side-bar">
      <div class="side-title">用户信息</div>
      <a-avatar id="user-avatar" :size="64">
        <img alt="avatar"
             src="https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/3ee5f13fb09879ecb5185e440cef6eb9.png~tplv-uwbnlip3yd-webp.webp"/>
      </a-avatar>
      <div id="user-nickname">{{ userStore.nickname }}</div>
      <div id="user-username">@{{ userStore.username }}</div>
      <div id="user-sex">
        <span>性别：</span>
        <a-tag color="arcoblue">{{ userStore.sex }}</a-tag>
      </div>
      <div id="user-created-at">创建于{{ new Date(userStore.created_at).toLocaleDateString() }}</div>
    </div>
    <div class="content">
      <div class="content-title">用户信息</div>
      <a-form
        id="userinfo-form"
        :model="userInfoForm"
        @submit="handleUpdateInfo"
        layout="vertical"
        class="user-form"
      >
        <div class="subtitle">修改用户信息：</div>
        <a-form-item
          field="username"
          label="用户名"
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
            v-model="userInfoForm.username"
            disabled
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
          :validate-trigger="['blur']"
          :rules="[
                { required: true, message: '昵称不能为空' },
                {
                  match: /^[\u4E00-\u9FA5A-Za-z0-9_]{2,20}$/,
                  message: '只能输入2-20位可见字符',
                },
              ]"
        >
          <a-input v-model="userInfoForm.nickname" placeholder="请输入昵称">
            <template #prefix>
              <icon-at/>
            </template>
          </a-input>
        </a-form-item>
        <a-form-item field="sex" label="性别" :validate-trigger="['blur']"
                     :rules="[
                { required: true, message: '请选择性别' }
              ]">
          <a-select placeholder="请选择性别" v-model="userInfoForm.sex" allow-create>
            <a-option>未指定</a-option>
            <a-option>男</a-option>
            <a-option>女</a-option>
          </a-select>
        </a-form-item>
        <div id="time-row">
          <div>创建日期</div>
          <div>
            <a-date-picker
              showTime
              v-model="created_at"
              disabled
            />
          </div>
          <div>上次更新</div>
          <div>
            <a-date-picker
              showTime
              v-model="updated_at"
              disabled
            />
          </div>
        </div>
        <div id="button-wrapper">
          <a-button type="primary" long html-type="submit">保存</a-button>
        </div>
      </a-form>
      <a-form
        id="password-form"
        :model="passwordForm"
        @submit="handleUpdatePassword"
        layout="vertical"
        class="user-form"
      >
        <div class="subtitle">修改密码：</div>
        <a-form-item
          field="current_password"
          label="当前密码"
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
            v-model="passwordForm.current_password"
            placeholder="请输入密码"
            type="password"
            allow-clear
          >
            <template #prefix>
              <icon-lock/>
            </template>
          </a-input>
        </a-form-item>
        <a-form-item
          field="new_password"
          label="新密码"
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
            v-model="passwordForm.new_password"
            placeholder="请输入密码"
            type="password"
            allow-clear
          >
            <template #prefix>
              <icon-lock/>
            </template>
          </a-input>
        </a-form-item>
        <div id="button-wrapper">
          <a-button type="primary" long html-type="submit">修改</a-button>
        </div>
      </a-form>
    </div>
  </main>
</template>
<script lang="ts" setup>
  import useUserStore from '@/store/user';
  import { computed, onMounted, reactive } from 'vue';
  import { IconUser, IconLock, IconAt } from '@arco-design/web-vue/es/icon';
  import { PasswordForm, UserInfoForm } from '@/models/user';
  import { Message, ValidatedError } from '@arco-design/web-vue';

  const userStore = useUserStore();

  const userInfoForm = reactive<UserInfoForm>({
    username: userStore.username!,
    nickname: userStore.nickname!,
    sex: userStore.sex!
  });

  const passwordForm = reactive<PasswordForm>({
    current_password: '',
    new_password: ''
  });
  const created_at = computed(() => userStore.created_at);
  const updated_at = computed(() => userStore.updated_at);

  onMounted(async () => {
    await userStore.info();
    userInfoForm.username = userStore.username!;
    userInfoForm.nickname = userStore.nickname!;
    userInfoForm.sex = userStore.sex!;
  });

  const handleUpdateInfo = async ({
                                    values,
                                    errors
                                  }: { values: UserInfoForm, errors: Record<string, ValidatedError> }) => {
    if (errors) return;

    if (await userStore.update(values)) {
      Message.success('修改成功');
      await userStore.info();
    }
  };

  const handleUpdatePassword = async ({
                                        values,
                                        errors
                                      }: { values: PasswordForm, errors: Record<string, ValidatedError> }) => {
    if (errors) return;
    if (await userStore.updatePassword(values)) {
      Message.success('修改成功');
      await userStore.info();
    }
  };
</script>
<style lang="css" scoped>
  #side-bar {
    align-items: center;
  }

  #user-avatar {
    margin: 16px 0;
  }

  #user-nickname {
    font-size: 20px;
    font-weight: bold;
  }

  #user-username {
    font-size: 16px;
    color: #CCCCCC;
    margin-bottom: 12px;
  }

  #user-sex {
    margin-bottom: 8px;
    display: flex;
    align-items: center;
  }

  #user-created-at {
    font-style: italic;
    color: #999999;
    margin-bottom: 24px;
  }

  #userinfo-form {
    margin-top: 24px;
    width: 600px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;

  }

  .subtitle {
    font-weight: bold;
    font-size: 20px;
    margin-bottom: 24px;
  }

  #time-row {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
  }

  .user-form {
    margin-top: 24px;
    margin-bottom: 24px;
    width: 600px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

</style>