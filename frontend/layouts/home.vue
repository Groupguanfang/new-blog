<script setup lang="tsx">
const routerViewRef = ref<HTMLElement | null>(null)
const { frontmatter } = useRouterViewFrontmatter(routerViewRef)
const { locale } = useI18n()
const router = useRouter()

const postList: Record<string, any> = reverseObject(
  import.meta.glob('../../content/posts/*.md', { eager: true }),
)

function reverseObject(obj: Record<string, any>) {
  return Object.keys(obj).reverse().reduce((acc, key) => {
    acc[key] = obj[key]
    return acc
  }, {} as Record<string, any>)
}

function pushToPostDetail(postPath: string) {
  const pathname = URL.parse(postPath, import.meta.url)?.pathname
  const basename = pathname?.substring(pathname?.lastIndexOf('/') + 1)
    .replace(/\.md$/, '')
    .replace(/@.*/, '')

  if (basename)
    router.push(`/posts/${basename}`)
}
</script>

<template>
  <main mx-3 lg:mx-0 flex="~ col items-center gap-2">
    <Background />
    <Header :title="frontmatter.title" />
    <div mb5 flex flex-wrap gap2 overflow-x-auto op-70>
      <InfoItem v-for="(item, index) in frontmatter.section" :key="index" icon="i-carbon-education" content="大学, 大二" :hr="true" v-bind="item" />
    </div>

    <RouterView max-w-7xl :name="locale">
      <template #default="{ Component }">
        <component :is="Component" ref="routerViewRef" />
      </template>
    </RouterView>

    <StrokeTitle class="md:font-size-34!">
      {{ $t('layouts.focus.title') }}
    </StrokeTitle>

    <ol flex flex-col px-5 gap5 mt-5 sm:mt-10 max-w-5xl>
      <li
        v-for="(item, index) in frontmatter.focus" :key="index"
        hover:underline hover:underline-amber
      >
        <span op-70>{{ index + 1 }}.</span>
        {{ item }}
      </li>
    </ol>

    <StrokeTitle class="md:font-size-34!">
      {{ $t('layouts.posts.title') }}
    </StrokeTitle>

    <div md:mt-10 columns-1 md:columns-2 lg:columns-3 gap-3 gap-2 max-w-6xl mx-auto>
      <div
        v-for="(item, index) in postList" :key="index"
        cursor-pointer flex="~ col items-center" break-inside-avoid
        dark:hover:bg-dark-1 hover:bg-gray-300 hover:bg-op-70 hover:backdrop-blur-sm
        transition-all px-5 py-5 rounded-2xl @click="pushToPostDetail(index)"
      >
        <div v-if="item.cover" mb-2 w-full>
          <img :src="item.cover" rounded-2xl w-full max-h-50 object-cover>
        </div>
        <h2 w-full font-size-6 font-bold :class="item.cover ? 'mt-2' : ''">
          {{ item.title }}
        </h2>
        <h3 v-if="item.date" w-full mt-2>
          撰于 {{ new Date(item.date).toLocaleDateString() }}
        </h3>
        <p v-if="item.description" mt-1 w-full op-70>
          {{ item.description }}
        </p>
        <div v-if="(item.tags || []).length" w-full flex="~ gap-3 wrap" mt-2>
          <div
            v-for="(tag, tagIndex) in item.tags || []" :key="tagIndex"
            bg="green dark:green-700" rounded-md px-2
          >
            {{ tag }}
          </div>
        </div>
      </div>
    </div>

    <Footer prose mt-10 mb-10 max-w-7xl />
  </main>
</template>

<style scoped />
