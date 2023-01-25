<template>
  <header
    id="header"
    class="fixed top-0 left-0 right-0 z-2 flex justify-center bg-white"
  >
    <div
      id="header-content"
      :style="{ width: $route.meta.expand ? '100%' : '1200px' }"
      class="h-16 flex items-center"
    >
      <div id="main-title" class="text-xl font-bold cursor-pointer">
        BOOKSTORE
      </div>
      <div id="nav-bar" class="grow flex text-base my-0 mx-4"></div>
      <div id="user-bar" class="flex items-center text-base">
        <a-avatar>
          <img
            alt="avatar"
            src="https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/3ee5f13fb09879ecb5185e440cef6eb9.png~tplv-uwbnlip3yd-webp.webp"
          />
        </a-avatar>
        <a-dropdown>
          <div
            id="bar-username"
            class="py-0 px-2 cursor-pointer nav-link btn-link"
          >
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
  <main
    id="main"
    :style="{ width: $route.meta.expand ? '100%' : '1200px' }"
    class="flex mt-20 grow self-center gap-x-4"
  >
    <Menu />
    <router-view></router-view>
  </main>
  <footer id="footer" class="text-center text-gray-600 text-sm">
    AsakiRain | 2022
  </footer>
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
.content {
  --at-apply: grow bg-white rounded-lg flex flex-col items-center;
}

.content-title {
  --at-apply: self-stretch font-bold text-base text-center p-4 border-b
    border-b-solid border-b-gray-300;
}
</style>
