<script setup lang="tsx">
const { locale } = useI18n()
const routerViewRef = ref<HTMLElement | null>(null)
const { frontmatter } = useRouterViewFrontmatter(routerViewRef)
</script>

<template>
  <main flex="~ col items-center" max-w-5xl mx-auto px-4 text="center gray-700 dark:gray-200">
    <Header v-bind="frontmatter" md:mb-10 />
    <Background />

    <RouterView class="max-w-100%" :name="locale">
      <template #default="{ Component }">
        <div v-if="!Component" class="text-center text-sm opacity-50">
          No {{ locale }} version for this article.
        </div>
        <component :is="Component" ref="routerViewRef" />
      </template>
    </RouterView>
    <Footer mt-20 mb-10 />
  </main>
</template>
