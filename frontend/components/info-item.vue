<script setup lang="tsx">
defineProps({
  content: String,
  icon: String,
  hr: [String, Boolean],
})
</script>

<template>
  <div flex gap2>
    <div flex gap1>
      <div text-size-sm :class="icon" />
      <!-- eslint-disable-next-line -->
      <div text-size-2.8 text-nowrap>{{ content }}</div>
    </div>
    <div v-if="hr" op-70 border-l="1px dashed blueGray" :class="hr" />
  </div>
</template>
