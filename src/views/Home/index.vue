<template>
  <main id="main">
    <div id="side-bar">
      <div id="side-title">
        图书分类
      </div>
      <div id="cate-bar">
        <router-link v-for="item in cateLinks" :key="item.title" :to="item.path" class="nav-link block-link">
          {{ item.title }}
        </router-link>
      </div>
      <router-link id="clear-link" to="/" class="nav-link block-link">全部</router-link>
    </div>
    <div id="content"></div>
  </main>
</template>
<script lang="ts" setup>
  import { reactive } from 'vue';
  import type { RouteLink } from '@/models/common';

  const cateLinks = reactive<RouteLink[]>([
    {
      title: '编程',
      path: '/cate/programming'
    },
    {
      title: '互联网',
      path: '/cate/internet'
    },
    {
      title: '科普',
      path: '/cate/science'
    },
    {
      title: '算法',
      path: '/cate/algorithm'
    },
    {
      title: '通信',
      path: '/cate/communication'
    },
    {
      title: '哲学',
      path: '/cate/philosophy'
    }
  ]);
</script>
<style lang="css" scoped>
  #main {
    align-self: center;
    width: 1200px;
    display: flex;
  }

  #side-bar {
    align-self: start;
    width: 200px;
    margin: 12px;
    background-color: #FFFFFF;
    display: flex;
    flex-direction: column;
    border-radius: 8px;
  }

  #side-title {
    font-weight: bold;
    font-size: 16px;
    text-align: center;
    padding: 16px;
    border-bottom: 1px solid #E0E0E0;
  }

  #content {
    flex-grow: 1;
    background-color: #FFFFFF;
    margin: 12px 0 12px 12px;
    border-radius: 8px;
  }

  #cate-bar {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    font-size: 16px;
  }

  .block-link {
    padding: 12px 16px;
  }

  #clear-link {
    border-top: 1px solid #E0E0E0;
    padding: 16px;
    font-weight: bold;
    font-size: 16px;
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
  }

</style>