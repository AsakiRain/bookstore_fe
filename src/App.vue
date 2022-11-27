<template>
  <router-view></router-view>
</template>
<script setup lang="ts"></script>
<style>
* {
  box-sizing: border-box;
  font-family: Roboto, sans-serif;
}
body {
  margin: 0;
  padding: 0;
  background-image: url("/img/back.jpeg");
  background-size: cover;
  background-repeat: no-repeat;
  height: 100vh;
}
#app{
  background-color: transparent;
  backdrop-filter: blur(6px);
  height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>
