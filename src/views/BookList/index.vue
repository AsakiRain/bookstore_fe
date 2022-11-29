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
        <a-button type="primary" status="success" @click="()=>showEditor()">添加图书</a-button>
        <a-input
            id="list-search"
            v-model="keyword"
            placeholder="请输入关键词"
        >
          <template #prefix>
            <icon-search/>
          </template>
        </a-input>
        <a-button type="primary" @click="goSearch">搜索书单</a-button>
        <a-button type="outline" @click="handleShowAll">清空条件</a-button>
      </div>
      <a-spin :loading="loading" id="booklist">
            <a-card class="book-card" :body-style="{padding: 0}" v-for="book in current" :key="book.isbn">
              <div class="card-content">
                <div class="img-wrapper">
                  <img :alt="book.title" class="book-image" :src="makeProxy(book.cover)"/>
                </div>
                <div class="text-wrapper">
                  <div class="info-split">
                    <div class="info-left">
                      <div class="title-item">
                        <span class="info-title">{{ book.title }}</span>
                        <span class="info-title-original" v-if="book.original_title">{{ book.original_title }}</span>
                      </div>
                      <div class="isbn-item">ISBN：{{ book.isbn }}</div>
                      <div class="info-item">
                        {{
                          mergeText(makeAuthor(book.author), makeTranslator(book.translator), book.publisher, book.publish_at)
                        }}
                      </div>
                      <div class="info-item">
                        {{ mergeText(makePage(book.page), book.binding) }}
                      </div>
                      <div class="info-item">
                        {{ mergeText(makeProducer(book.producer), book.series) }}
                      </div>
                    </div>
                    <div class="info-right">
                      <a-button status="warning" @click="()=>showEditor(book.isbn)">
                        <template #icon>
                          <icon-edit/>
                        </template>
                        编辑图书信息
                      </a-button>
                      <a-popconfirm content="确认删除吗？" @ok="()=>delFromList(book.isbn)">
                        <a-button status="danger">
                          <template #icon>
                            <icon-delete/>
                          </template>
                          从书单中删除
                        </a-button>
                      </a-popconfirm>
                    </div>
                  </div>
                  <div class="intro-wrapper">
                    <div class="intro-item">
                      {{ book.intro }}
                    </div>
                    <div class="expand-item">
                      <a-button type="primary" @click="()=>expandIntro(book.intro)">阅读全文</a-button>
                    </div>
                  </div>
                </div>
              </div>
            </a-card>
      </a-spin>
      <div class="pag-wrapper" v-if="!showSearch">
        <a-pagination :total="total" v-model:current="page" :page-size="20"
                      @change="$router.push(`/booklist/${page}`);"/>
      </div>
    </div>
  </main>
  <a-drawer :width="600" :visible="drawerVis" unmountOnClose :maskClosable="true" :footer="false"
            @cancel="()=>setDrawerVis(false)">
    <template #title>
      图书简介-全文
    </template>
    <div id="intro-full">
      {{ intro }}
    </div>
  </a-drawer>
  <a-modal v-model:visible="modalVis" fullscreen @cancel="()=>setModalVis(false)">
    <template #title>
      编辑图书
    </template>
    <template #footer>
      <a-button @click="()=>setModalVis(false)">
        <template #icon>
          <icon-undo/>
        </template>
        取消
      </a-button>
      <a-popconfirm content="确认删除吗？" @ok="()=>delFromDB()">
        <a-button status="danger">
          <template #icon>
            <icon-delete/>
          </template>
          从图书库中删除
        </a-button>
      </a-popconfirm>
      <a-popconfirm content="确认删除吗？" @ok="()=>delFromList()">
        <a-button status="danger">
          <template #icon>
            <icon-delete/>
          </template>
          从书单中删除
        </a-button>
      </a-popconfirm>
      <a-button type="primary" @click="applyEdit">
        <template #icon>
          <icon-save/>
        </template>
        保存修改
      </a-button>
    </template>
    <div id="editor-content">
      <a-form :model="form" id="editor-form" v-if="modalVis">
        <a-form-item v-for="item in form" :key="item.key" :label="item.label">
          <a-input v-model="single[item.key]" :disabled="item.disabled"></a-input>
        </a-form-item>
        <a-form-item label="图书简介">
          <a-textarea v-model="single.intro" auto-size></a-textarea>
        </a-form-item>
      </a-form>
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
  IconEdit,
  IconSave,
  IconUndo
} from '@arco-design/web-vue/es/icon';
import {Message} from '@arco-design/web-vue';
import {mergeText, makeTranslator, makeAuthor, makeProducer, makePage, makeProxy} from "@/utils/make";
import {genForm, genNewForm} from "@/utils/genForm";
import type {FormItem} from "@/utils/genForm";

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();

const {v: showSearch, set: setSearch} = useSwitch();    // 是否有搜索条件，用来控制左侧计数
const {v: loading, set: setLoading} = useSwitch();  // 是否正在请求
const {v: modalVis, set: setModalVis} = useSwitch();  // 是否显示详情弹窗
const {v: drawerVis, set: setDrawerVis} = useSwitch();  // 是否显示详情抽屉

const keyword = ref('');          // 搜索关键字
const current = ref<Book[]>([]);  // 当前页的书，可以是分页也可以是搜索结果
const single = ref<Book>({});         // 当前选中的书
const newBook = ref<boolean>(false);  // 是否是新建书
const form = ref<FormItem[]>([]);  // 修改信息表单
const intro = ref<string>('');     // 当前查看的简介
const total = ref<number>(0);     // 整个书单有几本书
const count = ref<number>(0);    // 搜索结果有几本书
const page = ref<number>(1); // 当前页码，一定能从路由获取到，不然会被重定向到第一页

// 图书分页展示
const list = async () => {
  // 设置搜索页标记为false
  setSearch(false);
  setLoading(true);
  try {
    const resp = await fetch(`/api/booklist/page?page=${page.value}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token') || ''
      }
    });
    const payload = await resp.json();
    // 把总书目赋值给total，分页展示要用
    total.value = payload.data.book_count;
    // 把当前页的所有书赋值给current
    current.value = payload.data.book_list;
    // 滚动回顶部
    window.scroll(0, 0);
  } catch (err: any) {
    Message.error(err.message);
  } finally {
    setLoading(false);
  }
};

//图书搜索
const search = async () => {
  // 设置搜索页标记为true
  setSearch(true);
  setLoading(true);
  try {
    const resp = await fetch(`/api/booklist/search?keyword=${keyword.value}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token') || ''
      }
    });
    const payload = await resp.json();
    // 返回字段名和列表页有区别
    count.value = payload.data.search_count;
    current.value = payload.data.search_result;
  } catch (err: any) {
    Message.error(err.message);
  } finally {
    setLoading(false);
  }
}

//从书单中删除
const delFromList = async () => {
  if(!single.value.isbn){
    Message.error("没有ISBN号");
    return;
  }
  try {
    const resp = await fetch(`/api/booklist?isbn=${single.value.isbn}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token') || ''
      }
    });
    const payload = await resp.json();
    if (payload.code !== 20000) {
      Message.error(payload.message);
      return false;
    }
    Message.success('从书单删除成功');
    setModalVis(false);
    // 无论是书单和搜索结果，删除后都要重新请求
    if (showSearch.value) {
      await search();
    } else {
      await list();
    }
    return true;
  } catch (err: any) {
    Message.error(err.message);
    return false;
  }
};

// 从图书库中删除
const delFromDB = async () => {
  if(!single.value.isbn) {
    Message.error("没有ISBN号");
    return;
  }
  // 从图书库中删除以后，还要从书单删除
  if(!await delFromList()) return;
  try {
    const resp = await fetch(`/api/book?isbn=${single.value.isbn}`, {
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
    Message.success('从图书库删除成功');
  } catch (err: any) {
    Message.error(err.message);
    return;
  }
};
// 展开详情
const expandIntro = (text: string) => {
  intro.value = text;
  setDrawerVis(true);
}

// 展示编辑器
const showEditor = async (isbn?: string) => {
  // 如果有isbn，说明是编辑，否则是新建
  if (isbn !== undefined) {
    // 设置新书标记为false
    newBook.value = false;
    // 从当前页书中找到对应的书
    single.value = current.value.find((b) => b.isbn === isbn)!;
    // genForm生成的表单只能编辑部分值
    form.value = genForm(single.value);
  } else {
    // 设置新书标记为true
    newBook.value = true;
    // 生成一本空的书
    single.value = {};
    // genNewForm生成的表单可以编辑全部值
    form.value = genNewForm();
  }
  setModalVis(true);
}

// 保存修改
const applyEdit = async () => {
  try {
    const resp = await fetch("/api/book", {
      // 创建新书使用POST，更新信息使用PUT
      method: newBook.value ? "POST" : "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": localStorage.getItem('token') || ''
      },
      body: JSON.stringify(single.value)
    });
    let payload = await resp.json();
    if (payload.code !== 20000) {
      Message.error(payload.message);
      return;
    }
    setModalVis(false);
    Message.success(newBook.value ? "创建成功" : "修改成功");
    // 如果是创建新书，还要记得创建完以后添加到书单里
    if (newBook.value) {
      try {
        const resp = await fetch(`/api/booklist?isbn=${single.value.isbn}`, {
          method: 'PUT',
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
        Message.success('添加到书单成功');
      } catch (err: any) {
        Message.error(err.message);
        return;
      }
    }
    // 无论是创建还是修改，都要重新获取书单
    if (!showSearch.value) {
      await list();
    } else if (showSearch.value && newBook.value) {
      await list();
    } else {
      await search();
    }
  } catch (err: any) {
    Message.error(err.message);
  }
}

// 路由到搜索页
const goSearch = async () => {
  // 判断输入是否为空
  if (keyword.value.trim() == "") {
    Message.warning("请输入关键字");
    return;
  }
  // 路由到搜索页
  await router.push({
    path: `/booklist/search/${keyword.value}`,
    query: {"return": page.value}
  })
}

// 返回到书单页
const handleShowAll = async () => {
  // 只有在搜索页才有行为
  if (route.name === "BookListSearch") {
    // 清空搜索框
    keyword.value = "";
    // 常熟获取页码，获取不成功就赋值为1
    page.value = isNaN(parseInt(route.query.return as string)) ? 1 : parseInt(route.query.return as string);
    // 路由到原先书单页
    await router.push(`/booklist/${page.value}`);
  }
}

// 监视路由变化做出反应
watch(() => route.fullPath, async (newRoute) => {
  // 如果是书单页
  if (route.name === "BookList") {
    // 如果获取不到页码，就跳转到第一页
    if (!route.params.page || isNaN(parseInt(route.params.page as string))) await router.push("/booklist/1");
    // 把获取到的页码赋值给page
    page.value = parseInt(route.params.page as string);
    // 获取当前页书单
    await list();
  }
  // 如果是搜索页
  if (route.name === "BookListSearch") {
    // 获取不到搜索关键词的话就返回书单页
    if (!route.params.keyword) await router.push(`/booklist/1`);
    // 把获取到的关键词赋值给keyword
    keyword.value = route.params.keyword as string;
    // 获取搜索结果
    await search();
  }
}, {immediate: true})
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


.pag-wrapper {
  margin-bottom: 24px;
}

#booklist {
  margin: 24px;
  display: flex;
  flex-direction: column;
  row-gap: 16px;
}

.card-content {
  display: flex;
  height: 300px;
  font-size: 10px;
}

.img-wrapper {
  width: 220px;
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
  flex-grow: 1;
  background-color: #F6F9FB;
  padding: 1.6em;
  overflow: hidden;
  line-break: anywhere;
  display: flex;
  flex-direction: column;
  align-items: stretch;
}

.info-split {
  display: flex;
  margin-bottom: 1em;
}

.info-left {
  flex-grow: 1;
}

.title-item {
  display: flex;
  column-gap: 4px;
  align-items: end;
}

.info-title {
  font-size: 2.4em;
  font-weight: bold;
}

.info-title-original {
  font-size: 1.8em;
  color: #AAAAAA;
}

.isbn-item {
  font-size: 1.4em;
  color: #AAAAAA;
  margin-bottom: 1.2em;
}

.info-item {
  margin-top: 4px;
  font-size: 1.6em;

}

.info-right {
  display: flex;
  column-gap: 4px;
}

.intro-wrapper {
  display: flex;
  flex-direction: column;
  row-gap: 8px;
  overflow: hidden;
}

.intro-item {
  font-size: 1.6em;
  line-height: 1.4em;
  overflow: hidden;
  flex: 1;
}

#intro-full {
  font-size: 20px;
}

#editor-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

#editor-form {
  width: 1200px;
}
</style>