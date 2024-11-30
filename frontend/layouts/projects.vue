<script setup lang="tsx">
const { locale } = useI18n()
const routerViewRef = ref<HTMLElement | null>(null)
const { frontmatter } = useRouterViewFrontmatter(routerViewRef)

const categories = computed(() =>
  Object.values<any>(frontmatter.value.projects || {})
    .reduce((acc, { category }) => {
      if (!acc.includes(category))
        acc.push(category)
      return acc
    }, [] as string[]),
)

function filterProjects(category: string) {
  return Object.entries<any>(frontmatter.value.projects || {})
    .filter(([, { category: c }]) => c === category)
    .reduce((acc, [key, value]) => {
      acc[key] = value
      return acc
    }, {} as Record<string, any>)
}
</script>

<template>
  <main flex="~ col items-center" px-5 max-w-7xl mx-auto>
    <Header v-bind="frontmatter" />
    <Background />

    <RouterView mt-15 :name="locale">
      <template #default="{ Component }">
        <Component :is="Component" ref="routerViewRef" />
      </template>
    </RouterView>

    <div gap-10 flex="~ col">
      <div v-for="(category, index) in categories" :key="index">
        <StrokeTitle>{{ category }}</StrokeTitle>
        <ProjectCardGrid>
          <ProjectCard
            v-for="(project, projectName) in filterProjects(category)" :key="projectName"
            v-bind="project" :title="projectName"
          />
        </ProjectCardGrid>
      </div>
    </div>

    <Footer mt-20 mb-30 />
  </main>
</template>
