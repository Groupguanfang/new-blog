<script setup lang="ts">
// https://github.com/vueuse/head
// you can use this to manipulate the document head in any components,
// they will be rendered correctly in the html results with vite-ssg
useHead({
  title: '你好, 文博知浅',
  meta: [
    {
      name: 'description',
      content: 'Opinionated Vite Starter Template',
    },
    {
      name: 'theme-color',
      content: () => isDark.value ? '#00aba9' : '#ffffff',
    },
  ],
  link: [
    {
      rel: 'icon',
      type: 'image/svg+xml',
      href: () => preferredDark.value ? '/favicon-dark.svg' : '/favicon.svg',
    },
  ],
})
</script>

<template>
  <RouterView>
    <template #default="{ Component }">
      <KeepAlive>
        <Suspense>
          <component :is="Component" />
          <template #fallback>
            <div fixed justify-center items-center h-full w-full>
              Loading...
            </div>
          </template>
        </Suspense>
      </KeepAlive>
    </template>
  </RouterView>
</template>
