<script setup lang="tsx">
defineProps<{
  title: string
  description: string
  href: string
  icon: string
}>()
</script>

<template>
  <a block flex items-center transition-all hover:op-70 :href="href" target="_blank">
    <div mr-3>
      <div :class="icon" font-size-10 op-80 />
    </div>
    <div flex flex-col>
      <div mb-1 font-size-5 font-bold>{{ title }}</div>
      <div font-size-3.5 op-60>{{ description }}</div>
    </div>
  </a>
</template>
