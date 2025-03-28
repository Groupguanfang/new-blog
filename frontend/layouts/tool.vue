<script setup lang="tsx">
const routerViewRef = ref<HTMLElement | null>(null)
const { frontmatter } = useRouterViewFrontmatter(routerViewRef)

const url = ref('')

const handleJump = () => location.href = url.value
</script>

<template>
  <main max-w-5xl mx-auto px-4 text="center gray-700 dark:gray-200">
    <Header v-bind="frontmatter" md:mb-10 />
    <Background />

    <div>跳转工具（临时给腕上浏览器使用的😋）</div>
    <input type="text" placeholder="请输入网址">
    <button @click="handleJump">
      跳转
    </button>
  </main>
</template>
