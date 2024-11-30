<script setup lang="tsx"></script>

<template>
  <div w-full flex="~ justify-between col items-start md:row">
    <div flex="~ gap-3 md:gap-4" text-size-5 md:justify-center>
      <a class="social-icon" i-ant-design-github-outlined title="Github" href="https://github.com/Groupguanfang" target="_blank" />
      <a class="social-icon" i-ant-design-x-outlined title="X" href="https://x.com/GCZZero" target="_blank" />
      <a class="social-icon color-pink-600! hover:color-pink-400!" i-ant-design-bilibili-outlined title="B站" href="https://space.bilibili.com/269291212" target="_blank" />
      <a class="social-icon color-blue-600! hover:color-blue-400!" i-tabler-brand-juejin title="掘金" href="https://juejin.cn/user/3224244048892728" target="_blank" />
    </div>
    <div mt-2 text-center text-sm opacity-50>
      粤ICP备2023102563号-1&nbsp;&nbsp;Zero的栈记
    </div>
  </div>
</template>

<style scoped>
.social-icon {
  @apply cursor-pointer
    text-gray-600
    hover:text-gray-800
    dark:text-gray-300
    dark:hover:text-gray-200
    hover:transform-scale-110
    active:transform-scale-90
    transition-all
    duration-400;
}
</style>
