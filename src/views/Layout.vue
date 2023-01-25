<template>
  <header id="header">
    <div
      id="header-content"
      :style="{ width: $route.meta.expand ? '100%' : '1200px' }"
    >
      <div id="main-title">BOOKSTORE</div>
      <div id="nav-bar">
        <router-link to="/" class="nav-link btn-link"> 首页 </router-link>
        <router-link to="/user" class="nav-link btn-link">
          个人信息
        </router-link>
        <router-link to="/cart" class="nav-link btn-link">
          我的购物车
        </router-link>
        <router-link to="/order" class="nav-link btn-link">
          我的订单
        </router-link>
      </div>
      <div id="user-bar">
        <a-avatar>
          <img
            alt="avatar"
            src="https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/3ee5f13fb09879ecb5185e440cef6eb9.png~tplv-uwbnlip3yd-webp.webp"
          />
        </a-avatar>
        <a-dropdown>
          <div id="bar-username" class="nav-link btn-link">
            {{ userStore.nickname }}
          </div>
          <template #content>
            <a-doption @click="$router.push('/user')">用户信息</a-doption>
            <a-doption @click="$router.push('/manager')">管理商店</a-doption>
            <a-doption @click="logout">退出登录</a-doption>
          </template>
        </a-dropdown>
      </div>
    </div>
  </header>
  <main id="main" :style="{ width: $route.meta.expand ? '100%' : '1200px' }">
    <Menu />
    <router-view></router-view>
  </main>
  <footer id="footer">AsakiRain | 2022</footer>
</template>

<script lang="ts" setup>
import { onMounted } from "vue";
import useUserStore from "@/store/user";
import { useRouter } from "vue-router";
import { Message } from "@arco-design/web-vue";
import Menu from "@/components/Menu.vue";
const userStore = useUserStore();
const router = useRouter();

onMounted(async () => {
  if (!(await userStore.info())) {
    await router.push("/login");
  }
});

const logout = async () => {
  await userStore.logout();
  Message.info("已经退出登录");
  await router.push("/login");
};
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
  background-color: var(--backgroud-color);
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
  cursor: pointer;
}

#nav-bar {
  text-decoration: none;
  flex-grow: 1;
  display: flex;
  font-size: 16px;
  margin: 0 16px 0 16px;
}

.nav-link {
  padding: 0 16px;
  text-decoration: none;
  color: var(--text-color);
  transition: 0.28s background-color cubic-bezier(0.4, 0, 0.2, 1);
}

.btn-link {
  height: 36px;
  line-height: 36px;
  border-radius: 4px;
}

.nav-link:hover {
  background-color: var(--hover-backgroud-color);
  color: var(--a-hover-color);
}

#user-bar {
  display: flex;
  align-items: center;
  font-size: 16px;
}

#footer {
  text-align: center;
  color: var(--footer-color);
}

#bar-username {
  padding: 0 8px;
  cursor: pointer;
}

#main {
  flex-grow: 1;
  align-self: center;
  display: flex;
  margin-top: 64px;
}

.content {
  flex-grow: 1;
  background-color: var(--backgroud-color);
  margin: 16px 16px 0 16px;
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
  border-bottom: 1px solid var(--border-color);
}

@media (max-width: 1200px) {
  #header-content {
    width: 100vw;
  }

  .main {
    width: 100% !important;
  }

  .content {
    margin: 0;
    border-radius: 0;
    border-top: 1px solid var(--border-color);
  }

  #footer {
    border-top: 1px solid var(--border-color);
    background-color: var(--backgroud-color);
  }

  .content-title {
    display: none;
  }

  #route-title {
    display: inline;
    font-weight: bold;
    font-size: 16px;
    text-align: center;
  }
}
</style>
