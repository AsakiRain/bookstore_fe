<template>
  <main class="main">
    <div class="side-bar" id="side-bar">
      <div class="side-title">我的书单</div>
      <a-avatar id="user-avatar" :size="64">
        <img alt="avatar"
             src="https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/3ee5f13fb09879ecb5185e440cef6eb9.png~tplv-uwbnlip3yd-webp.webp"/>
      </a-avatar>
      <div id="user-nickname">{{ userStore.nickname }}</div>
      <div id="user-username">@{{ userStore.username }}</div>
      <div id="booklist-count" v-if="showSearch">
        <span>搜索到</span>
        <a-tag color="arcoblue">{{ count }}</a-tag>
        <span>本书</span>
      </div>
      <div id="booklist-count" v-else>
        <span>书单中共有</span>
        <a-tag color="arcoblue">{{ total }}</a-tag>
        <span>本书</span>
      </div>
    </div>
    <div class="content">
      <div class="content-title">我的书单</div>
      <div id="list-search-wrapper">
        <a-input
          id="list-search"
          v-model="keyword"
          placeholder="请输入关键词"
        >
          <template #prefix>
            <icon-search/>
          </template>
        </a-input>
        <a-button type="primary">搜索书单</a-button>
        <a-button type="outline">清空条件</a-button>
      </div>
      <a-spin :loading="loading" id="list-wrapper">
        <a-grid :cols="4" :col-gap="12" :row-gap="16" id="booklist">
          <a-grid-item v-for="book in current" :key="book.isbn">
            <a-card class="book" :body-style="{padding: 0}">
              <div class="card-content">
                <div class="img-wrapper">
                  <img class="book-image" :src="'/api/proxy?url='.concat(book.cover)"/>
                </div>
                <div class="info-wrapper">
                  <div class="book-title info-item">{{ book.title }}</div>
                  <div class="info-item book-author">{{ book.author }}</div>
                  <div class="info-item book-translator" v-if="book.translator">{{ book.translator }}（译者）</div>
                  <div class="info-item book-publisher">{{ book.publisher }}</div>
                </div>
              </div>
            </a-card>
          </a-grid-item>
        </a-grid>
      </a-spin>
      <div id="pag-wrapper">
        <a-pagination :total="total" v-model:current="page" :page-size="20"/>
      </div>
    </div>
  </main>
</template>
<script lang="ts" setup>
  import useUserStore from '@/store/user';
  import { useRoute, useRouter } from 'vue-router';
  import { computed, onMounted, ref, watch } from 'vue';
  import useSwitch from '@/utils/useSwitch';
  import type { Book } from '@/models/book';
  import { IconSearch } from '@arco-design/web-vue/es/icon';
  import { Message } from '@arco-design/web-vue';

  const router = useRouter();
  const route = useRoute();
  const userStore = useUserStore();

  const { v: showSearch, set: setSearch } = useSwitch();    // 是否有搜索条件，用来控制左侧计数
  const { v: loading, set: setLoading } = useSwitch();  // 是否正在请求

  const keyword = ref('');          // 搜索关键字
  const current = ref<Book[]>([]);  // 当前页的书，可以是分页也可以是搜索结果
  const total = ref<number>(0);     // 整个书单有几本书
  const count = ref<number>(0);    // 搜索结果有几本书
  const page = ref<number>(parseInt(route.params.page! as string)); // 当前页码，一定能从路由获取到，不然会被重定向到第一页

  watch(page, async (newPage) => {
      await router.push(`/booklist/${ newPage }`);
      setLoading(true);
      try {
        const resp = await fetch(`/api/booklist/page?page=${ newPage }`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('token') || ''
          }
        });
        const payload = await resp.json();
        total.value = payload.data.book_count;
        current.value = payload.data.book_list;
      } catch (err: any) {
        Message.error(err.message);
      } finally {
        setLoading(false);
      }
    },
    { immediate: true });

</script>
<style lang="css" scoped>
  #side-bar{
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

  #booklist-count {
    margin-bottom: 24px;
    display: flex;
    align-items: center;
  }

  #list-search-wrapper {
    display: flex;
    column-gap: 8px;
    margin-top: 24px;
    margin-bottom: 48px;
    align-items: center;
    width: 600px;
  }

  .img-wrapper {
    background-color: #EBF1F5;
    height: 156px;
    padding: 8px 0;
    text-align: center;
    font-size: 0;
    display: flex;
    justify-content: center;
  }

  .info-wrapper {
    background-color: #F6F9FB;
    text-align: center;
    height: 108px;
    overflow: hidden;
    padding: 8px 16px;
  }

  .book-image {
    border-radius: 4px;
  }

  #booklist {
    width: 900px;
  }

  #list-wrapper {
    margin-bottom: 24px;
  }

  #pag-wrapper {
    margin-bottom: 24px;
  }
</style>