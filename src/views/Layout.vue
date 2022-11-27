<template>
  <header id="header">
    <div id="header-content" :style="{width: $route.meta.expand ? '100%' : '1200px'}">
      <div id="main-title">
        <router-link to="/" class="nav-link">BOOKSTORE</router-link>
      </div>
      <div id="nav-bar">
        <router-link v-for="item in routeLinks" :key="item.title" :to="item.path" class="nav-link btn-link">
          {{ item.title }}
        </router-link>
      </div>
      <div id="user-bar">
        <a-avatar>
          <img alt="avatar"
               src="https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/3ee5f13fb09879ecb5185e440cef6eb9.png~tplv-uwbnlip3yd-webp.webp"/>
        </a-avatar>
        <a-dropdown>
          <div id="bar-username" class="nav-link btn-link">{{ userStore.nickname }}</div>
          <template #content>
            <a-doption @click="$router.push('/user')">用户信息</a-doption>
            <a-doption @click="$router.push('/manager')">管理商店</a-doption>
            <a-doption @click="logout">退出登录</a-doption>
          </template>
        </a-dropdown>
      </div>
    </div>
  </header>
  <router-view></router-view>
  <footer id="footer">
    AsakiRain | 2022
  </footer>
</template>

<script lang="ts" setup>
  import { onMounted, reactive } from 'vue';
  import type { RouteLink } from '@/models/common';
  import useUserStore from '@/store/user';
  import { useRouter } from 'vue-router';
  import { Message } from '@arco-design/web-vue';

  const userStore = useUserStore();
  const router = useRouter();

  onMounted(async () => {
    if (!await userStore.info()) {
      await router.push('/login');
    }
  });

  const logout = async () => {
    await userStore.logout();
    Message.info('已经退出登录');
    await router.push('/login');
  };
  const routeLinks = reactive<RouteLink[]>([
    {
      title: '首页',
      path: '/'
    },
    {
      title: '我的书单',
      path: '/booklist'
    },
    {
      title: '我的购物车',
      path: '/cart'
    },
    {
      title: '我的订单',
      path: '/orders'
    },
    {
      title: '管理商店',
      path: '/manage'
    }
  ]);
</script>

<style lang="css">
  #header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 2;
    display: flex;
    justify-content: center;
    background-color: #FFFFFF;
  }

  #header-content {
    margin: 0 24px;
    height: 64px;
    display: flex;
    align-items: center;
  }

  #main-title {
    font-size: 20px;
    font-weight: bold;
    margin-right: 16px;
    cursor: pointer;
  }

  #nav-bar {
    text-decoration: none;
    flex-grow: 1;
    display: flex;
    font-size: 16px;
  }

  .nav-link {
    padding: 0 16px;
    text-decoration: none;
    color: #1F1F1F;
    transition: 0.28s background-color cubic-bezier(.4, 0, .2, 1);
  }

  .btn-link {
    height: 36px;
    line-height: 36px;
    border-radius: 4px;
  }

  .nav-link:hover {
    background-color: #EEEEEE;
  }

  #user-bar {
    display: flex;
    align-items: center;
    font-size: 16px;
  }

  #footer {
    text-align: center;
    height: 16px;
    line-height: 1;
  }

  #bar-username {
    padding: 0 8px;
    cursor: pointer;
  }

  .main {
    flex-grow: 1;
    align-self: center;
    display: flex;
    margin-top: 64px;
  }

  .side-bar {
    align-self: start;
    width: 200px;
    margin: 16px;
    background-color: #FFFFFF;
    display: flex;
    flex-direction: column;
    border-radius: 8px;
    position: sticky;
    top: 80px;
    z-index: 1;
    flex-shrink: 0;
  }

  .side-title {
    align-self: stretch;
    font-weight: bold;
    font-size: 16px;
    text-align: center;
    padding: 16px;
    border-bottom: 1px solid #E0E0E0;
  }

  .content {
    flex-grow: 1;
    background-color: #FFFFFF;
    margin: 16px 16px 16px 0;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .content-title {
    align-self: stretch;
    font-weight: bold;
    font-size: 16px;
    text-align: center;
    padding: 16px;
    border-bottom: 1px solid #E0E0E0;
  }

</style>
