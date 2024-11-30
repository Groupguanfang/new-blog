<script setup lang="tsx">
const { sources = [], classes = [] } = defineProps<{
  sources: string[]
  classes: string[]
}>()

function getCustomClasses(index: number) {
  return classes[index] || ''
}
</script>

<template>
  <div columns-2 gap-5>
    <div v-for="(item, index) in sources" :key="index" mb5 transition-all hover:transform-rotate-1 hover:transform-scale-101 :class="getCustomClasses(index)">
      <img rounded-2xl :src="item">
    </div>
  </div>
</template>
