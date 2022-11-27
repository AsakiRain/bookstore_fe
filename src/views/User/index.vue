<template>
  <main id="main">
    <div id="side-bar">
      <div id="side-title">
        用户信息
      </div>

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
<style lang="css">
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
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
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