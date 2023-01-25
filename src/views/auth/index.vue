<template>
  <div class="flex justify-center items-center h-screen">
    <div class="bg-white rounded-xl">
      <div class="flex h-500px">
        <div
          class="w-360px flex flex-col items-center p-9 justify-center"
        >
          <RouterView />
        </div>
        <div
          class="w-340px bg-cover bg-no-repeat rounded-r-xl bg-[url(/img/card-right.jpeg)]"
        ></div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup></script>
<style lang="css"></style>
