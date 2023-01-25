<template>
  <div id="menu">
    <div id="menu-title">菜单</div>
    <div class="line-divider"></div>
    <div id="menu-content">
      <router-link class="block-link nav-link" to="/"> 全部商品 </router-link>
      <router-link class="block-link nav-link" to="/search">
        搜索商品
      </router-link>
      <router-link class="block-link nav-link" to="/cart"> 购物车 </router-link>
      <router-link class="block-link nav-link" to="/order">
        订单管理
      </router-link>
      <router-link class="block-link nav-link" to="/user">
        个人中心
      </router-link>
      <div class="line-divider"></div>
      <router-link class="block-link nav-link bold" to="/manage">
        后台管理
      </router-link>
    </div>
  </div>
</template>
<style lang="css" scoped>
#menu {
  align-self: start;
  width: 200px;
  background-color: var(--backgroud-color);
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  position: sticky;
  top: 80px;
  z-index: 1;
  flex-shrink: 0;
  overflow: hidden;
}

#menu-title {
  align-self: stretch;
  font-weight: bold;
  font-size: 16px;
  text-align: center;
  padding: 16px;
  border-bottom: 1px solid var(--border-color);
}

#menu-content {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  font-size: 16px;
}
.block-link {
  padding: 12px 16px;
}

</style>
