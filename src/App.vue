<template>
  <router-view></router-view>
</template>
<script setup lang="ts"></script>
<style>
* {
  --at-apply: box-border font-[Roboto];
}
body {
  --at-apply: h-screen m-0;
}

#app {
  --at-apply: flex flex-col min-h-screen;
}

#app::before {
  --at-apply: content-none fixed -inset-2.5 bg-[url(/img/back.jpeg)] bg-cover bg-no-repeat
    blur-6px -z-1;
}
</style>
