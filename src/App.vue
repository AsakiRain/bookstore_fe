<template>
  <router-view></router-view>
</template>
<script setup lang="ts"></script>
<style>
html {
  --backgroud-color: #ffffff;
  --text-color: #262626;
  --sub-text-color: #ababab;
  --a-text-color: #458bff;
  --a-hover-color: #40a9ff;
  --hover-backgroud-color: #eeeeee;
  --border-color: #e0e0e0;
  --backgroud-image: url("/img/back-light.png");
  --footer-color: #bfbfbf;
}

* {
  box-sizing: border-box;
  font-family: Roboto, sans-serif;
}

body {
  height: 100vh;
}

#app {
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  min-height: 100vh;
}

#app::before {
  content: "";
  position: fixed;
  top: -10px;
  left: -10px;
  right: -10px;
  bottom: -10px;
  background-image: url("/img/back.jpeg");
  background-size: cover;
  background-repeat: no-repeat;
  filter: blur(6px);
  z-index: -1;
}
</style>
