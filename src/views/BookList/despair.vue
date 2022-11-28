<template>
  <main class="main" :style="{width: $route.meta.expand ? '100%' : '1200px'}">
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
      <div id="tool-bar">
        <a-button type="primary" status="success">添加图书</a-button>
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
      <div class="pag-wrapper">
        <a-pagination :total="total" v-model:current="page" :page-size="20"/>
      </div>
      <a-spin :loading="loading" id="list-wrapper">
        <a-grid :cols="2" :col-gap="16" :row-gap="16" id="booklist">
          <a-grid-item v-for="book in current" :key="book.isbn">
            <a-card class="book-card" :body-style="{padding: 0}">
              <div class="card-content">
                <div class="img-wrapper">
                  <img :alt="book.title" class="book-image" :src="'/api/proxy?url='.concat(book.cover)"/>
                </div>
                <div class="text-wrapper">
                  <div class="info-wrapper">
                    <div class="basic-wrapper">
                      <div class="info-item info-title">{{ book.title }}</div>
                      <div class="info-item book-isbn">ISBN：{{ book.isbn }}</div>
                      <div class="info-item">
                        <span class="book-author">{{ book.author }}</span>
                        <span class="book-translator" v-if="book.translator"> / {{ book.translator }}[译]</span>
                        <span class="book-publisher"> / {{ book.publisher }}</span>
                      </div>
                    </div>
                    <div class="action-wrapper">
                      <a-button type="secondary" status="success" size="small" @click="()=>showDetail(book.isbn)">
                        <template #icon>
                          <icon-info-circle/>
                        </template>
                        详情
                      </a-button>
                      <a-popconfirm content="确认删除吗？" @ok="()=>delBook(book.isbn)">
                        <a-button type="secondary" status="danger" size="small">
                          <template #icon>
                            <icon-delete/>
                          </template>
                          删除
                        </a-button>
                      </a-popconfirm>
                    </div>
                  </div>
                  <div class="intro-wrapper">{{ book.intro }}</div>
                </div>
              </div>
            </a-card>
          </a-grid-item>
        </a-grid>
      </a-spin>
      <div class="pag-wrapper">
        <a-pagination :total="total" v-model:current="page" :page-size="20"/>
      </div>
    </div>
  </main>
  <a-modal v-model:visible="modalVis" ok-text="保存" cancel-text="关闭"
           :modal-style="{width: 'auto'}"
           :body-style="{width: 'auto'}">
    <template #title>
      图书详情
    </template>
    <template #footer>
      <a-button status="danger" type="primary" @click="">从书库删除</a-button>
      <a-button status="danger" >从书单删除</a-button>
      <a-button type="primary">编辑</a-button>
      <a-button>关闭</a-button>
    </template>
    <div id="detail-content">
      <div id="detail-title">{{ book.title }}</div>
      <div id="detail-main">
        <img id="detail-image" :alt="book.title" :src="'/api/proxy?url='.concat(book.cover)"/>
        <div id="detail-text">
          <div id="detail-split">
            <div id="detail-left">
              <div class="detail-item" v-for="key in filterKeys(book)" :key="key">
                <span class="detail-label">{{ findAlias(key) }}：</span>
                <span class="detail-value">{{ book[key] }}</span>
              </div>
            </div>
            <div id="detail-right" v-if="book.rating">
              <a-rate :default-value="book.rating" allow-half disabled/>
              <div>
                <span id="rating-people">{{ book.rating_people }}</span>
                <span>人评价</span>
              </div>
            </div>
          </div>
          <div class="detail-item" id="detail-intro">{{ book.intro }}</div>
        </div>
      </div>
    </div>
  </a-modal>
</template>
<script lang="ts" setup>
import useUserStore from '@/store/user';
import {useRoute, useRouter} from 'vue-router';
import {ref, watch} from 'vue';
import useSwitch from '@/utils/useSwitch';
import type {Book} from '@/models/book';
import {
  IconSearch,
  IconDelete,
  IconInfoCircle
} from '@arco-design/web-vue/es/icon';
import {Message} from '@arco-design/web-vue';
import findAlias from "@/utils/findAlias";
import filterKeys from "@/utils/filterKeys";

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();

const {v: showSearch, set: setSearch} = useSwitch();    // 是否有搜索条件，用来控制左侧计数
const {v: loading, set: setLoading} = useSwitch();  // 是否正在请求
const {v: modalVis, set: setModalVis} = useSwitch();  // 是否显示详情弹窗

const keyword = ref('');          // 搜索关键字
const current = ref<Book[]>([]);  // 当前页的书，可以是分页也可以是搜索结果
const book = ref<Book>({});         // 当前选中的书
const total = ref<number>(0);     // 整个书单有几本书
const count = ref<number>(0);    // 搜索结果有几本书
const page = ref<number>(parseInt(route.params.page! as string)); // 当前页码，一定能从路由获取到，不然会被重定向到第一页

const update = async (newPage: number) => {
  await router.push(`/booklist/${newPage}`);
  setLoading(true);
  try {
    const resp = await fetch(`/api/booklist/page?page=${newPage}`, {
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
};
watch(page, async (newPage) => await update(newPage), {immediate: true});

const delBook = async (isbn: string) => {
  try {
    const resp = await fetch(`/api/booklist?isbn=${isbn}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token') || ''
      }
    });
    const payload = await resp.json();
    if (payload.code !== 20000) {
      Message.error(payload.message);
      return;
    }
    Message.success('删除成功');
    await update(page.value);
  } catch (err: any) {
    Message.error(err.message);
    return;
  }
};

const showDetail = async (isbn: string) => {
  try {
    const resp = await fetch(`/api/book?isbn=${isbn}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const payload = await resp.json();
    if (payload.code !== 20000) {
      Message.error(payload.message);
      return;
    }
    book.value = payload.data.book_info;
    setModalVis(true);
  } catch (err: any) {
    Message.error(err.message);
    return;
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

#booklist-count {
  margin-bottom: 24px;
  display: flex;
  align-items: center;
}

#tool-bar {
  display: flex;
  column-gap: 8px;
  margin: 24px 0;
  align-items: center;
}

#list-search {
  min-width: 300px;
}


#list-wrapper, .pag-wrapper {
  margin-bottom: 24px;
}

#booklist {
  margin: 0 24px;
}

.card-content {
  display: flex;
  height: 240px;
  font-size: 10px;
}

.img-wrapper {
  width: 180px;
  background-color: #EBF1F5;
  font-size: 0;
  display: flex;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;
}

.book-image {
  border-radius: 4px;
}

.text-wrapper {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  background-color: #F6F9FB;
  padding: 12px;
  row-gap: 4px;
  overflow: hidden;
  line-break: anywhere;
}

.info-wrapper {
  display: flex;
  align-items: start;
  margin-bottom: 4px;
}

.action-wrapper {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  row-gap: 4px;
}

.basic-wrapper {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}


.info-title {
  font-size: 2em;
  font-weight: bold;
}

.book-isbn {
  font-size: 1.2em;
  color: #AAAAAA;
  margin-bottom: 4px;
}

.book-author, .book-translator, .book-publisher {
  font-size: 1.4em;
}

.intro-wrapper {
  flex: 1;
  overflow: hidden;
  font-size: 1.2em;
  line-height: 1.4em;
}

#detail-content {
  font-size: 10px;
  width: max-content;
}

#detail-title {
  font-size: 2.4em;
  font-weight: bold;
}

#detail-main {
  display: flex;
  margin-top: 8px;
  column-gap: 24px;
  align-items: center;
}

.detail-label {
  color: #666666;
}

#detail-text {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  row-gap: 8px;
  justify-content: center;
}

.detail-item {
  font-size: 1.3em;
}

.detail-value {
  color: #111111;
}

#detail-intro {
  min-width: 600px;
  max-width: 700px;
}

#detail-image {
  min-width: 200px;
}

#detail-split {
  display: flex;
}

#detail-left {
  flex-grow: 1;
}

#detail-right {
  font-size: 1.6em;
  color: #666666;
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>