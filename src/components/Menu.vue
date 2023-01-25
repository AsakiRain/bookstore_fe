<template>
  <div
    class="self-start w-50 bg-white flex flex-col rounded-lg sticky z-1 shrink-0 overflow-hidden"
  >
    <div
      class="self-stretch font-bold text-base text-center p-4 border-b border-b-solid border-b-gray-300"
    >
      菜单
    </div>
    <div class="flex flex-col items-stretch text-base">
      <router-link class="nav-link block-link" to="/"> 全部商品 </router-link>
      <router-link class="nav-link block-link" to="/search">
        搜索商品
      </router-link>
      <router-link class="nav-link block-link" to="/cart"> 购物车 </router-link>
      <router-link class="nav-link block-link" to="/order">
        订单管理
      </router-link>
      <router-link class="nav-link block-link" to="/user">
        个人中心
      </router-link>
      <router-link
        class="nav-link block-link border-t border-t-solid border-t-gray-300"
        to="/manage"
      >
        后台管理
      </router-link>
    </div>
  </div>
</template>
<style lang="css" scoped></style>
