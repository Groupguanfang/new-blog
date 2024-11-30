<script setup lang="ts">
const router = useRouter()
const { t } = useI18n()
</script>

<template>
  <main p="x4 y10" text="center teal-700 dark:gray-200">
    <div text-4xl>
      <div i-carbon-warning inline-block />
    </div>
    <span class="ml-2">{{ t('layouts.404.title') }}</span>
    <RouterView />
    <div>
      <button text-sm btn m="3 t8" @click="router.back()">
        {{ t('layouts.404.back') }}
      </button>
    </div>
  </main>
</template>
