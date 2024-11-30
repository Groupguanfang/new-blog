<script setup lang="tsx">
defineProps<{
  title?: string
  description?: string
  tagline?: string
}>()

const { toggleLocales } = useSwitchLocale()

function isEnableTransitions() {
  return 'startViewTransition' in document
    && window.matchMedia('(prefers-reduced-motion: no-preference)').matches
}

async function toggleWithAnimate({ clientX: x, clientY: y }: MouseEvent, action: () => any) {
  if (!isEnableTransitions())
    return action()

  const clipPath = [
    `circle(0px at ${x}px ${y}px)`,
    `circle(${Math.hypot(
      Math.max(x, innerWidth - x),
      Math.max(y, innerHeight - y),
    )}px at ${x}px ${y}px)`,
  ]

  await document.startViewTransition(async () => {
    action()
    await nextTick()
  }).ready

  document.documentElement.animate(
    { clipPath: !isDark ? clipPath.reverse() : clipPath },
    {
      duration: 400,
      easing: 'ease-in',
      pseudoElement: `::view-transition-${!isDark ? 'old' : 'new'}(root)`,
    },
  )
}
</script>

<template>
  <div w-full mt-20 md:mt-30>
    <div flex="~ gap-3 md:gap-4" mb-3 md:mb-0 w-full text-size-5 md:justify-center>
      <div class="home-button" i-ph-house-duotone @click="$router.push('/')" />
      <div class="theme-switcher-reverse" i-ph-ruler-duotone title="项目" @click="$router.push('/projects')" />
      <div
        v-if="isDark" class="theme-switcher" i-ph-sun-duotone title="切换主题"
        @click="(e) => toggleWithAnimate(e, toggleDark)"
      />
      <div
        v-else class="theme-switcher"
        i-ph-moon-duotone title="切换主题"
        @click="(e) => toggleWithAnimate(e, toggleDark)"
      />
      <div class="home-button" i-ph-translate-duotone title="切换语言" @click="(e) => toggleWithAnimate(e, toggleLocales)" />
    </div>
    <h1 v-if="title" mt-5 w-full font-bold font-size-9 text-left md:font-size-10 md:text-center>
      {{ title }}
    </h1>
    <p v-if="description" mt-3 w-full text-left md:text-center italic op-90>
      {{ description }}
    </p>
    <p v-if="tagline" font-size-3 mt-2 w-full text-left md:text-center op-70>
      {{ tagline }}
    </p>
  </div>
</template>

<style scoped>
.home-button {
  @apply cursor-pointer
    hover:transform-scale-105
    active:transform-scale-95
    transition-transform
    duration-400;
}

.theme-switcher-reverse {
  @apply cursor-pointer
    hover:transform-rotate-10
    active:transform-rotate--10
    transition-transform
    duration-400;
}

.theme-switcher {
  @apply cursor-pointer
    hover:transform-rotate--10
    active:transform-rotate-10
    transition-transform
    duration-400;
}
</style>
