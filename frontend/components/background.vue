<script setup lang="tsx">
import { useNumberRange } from '~/composables/range'

const { range: range1 } = useNumberRange(3, 300, { interval: 100, immediate: true })
const { range: range2 } = useNumberRange(-180, 200, { interval: 100, immediate: true })
const { range: range3 } = useNumberRange(-150, 150, { interval: 200, immediate: true })
const { range: range4 } = useNumberRange(0, 1, { step: 0.01, interval: 100, immediate: true })
</script>

<template>
  <svg v-if="isDark" class="[mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)] fixed inset-0 h-full w-full stroke-white/10 -z-10" aria-hidden="true">
    <defs>
      <pattern id="983e3e4c-de6d-4c3f-8d64-b9761d1534cc" width="200" height="200" x="50%" y="-1" patternUnits="userSpaceOnUse">
        <path d="M.5 200V.5H200" fill="none" />
      </pattern>
    </defs>
    <svg x="50%" y="-1" class="overflow-visible fill-gray-800/20">
      <path d="M-200 0h201v201h-201Z M600 0h201v201h-201Z M-400 600h201v201h-201Z M200 800h201v201h-201Z" stroke-width="0" />
    </svg>
    <rect width="100%" height="100%" stroke-width="0" fill="url(#983e3e4c-de6d-4c3f-8d64-b9761d1534cc)" />
  </svg>
  <svg v-else class="[mask-image:radial-gradient(32rem_32rem_at_center,white,transparent)] absolute inset-x-0 top-0 h-[64rem] w-full stroke-gray-200 -z-10" aria-hidden="true">
    <defs>
      <pattern id="1f932ae7-37de-4c0a-a8b0-a6e3b4d44b84" width="200" height="200" x="50%" y="-1" patternUnits="userSpaceOnUse">
        <path d="M.5 200V.5H200" fill="none" />
      </pattern>
    </defs>
    <svg x="50%" y="-1" class="overflow-visible fill-gray-50">
      <path d="M-200 0h201v201h-201Z M600 0h201v201h-201Z M-400 600h201v201h-201Z M200 800h201v201h-201Z" stroke-width="0" />
    </svg>
    <rect width="100%" height="100%" stroke-width="0" fill="url(#1f932ae7-37de-4c0a-a8b0-a6e3b4d44b84)" />
  </svg>
  <!-- 占位 -->
  <div class="fixed left-0 right-0 top-0 transform-gpu overflow-hidden sm:left-1/2 -z-10 -ml-24 lg:ml-24 xl:ml-48" aria-hidden="true" :style="{ filter: `blur(64px) invert(${range4})` }">
    <div
      class="animate-gradient-flow aspect-[801/1036] w-[50.0625rem] from-yellow to-blue bg-gradient-to-tr opacity-60 transition-all transition-all-1000"
      :style="`clip-path: polygon(63.1% 29.5%, 100% 17.1%, 76.6% ${range1}%, 48.4% 0%, 44.6% 4.7%, 54.5% 25.3%, 59.8% 49%, 55.2% 57.8%, ${range2}% 57.2%, 27.8% 47.9%, 35.1% 81.5%, 0% 97.7%, 39.2% 100%, 35.2% ${range3}%, 97.2% 52.8%, 63.1% 29.5%)`"
    />
  </div>
</template>
