interface FrontmatterableElement extends HTMLElement {
  frontmatter?: Record<string, any>
}

export function useRouterViewFrontmatter(el: Ref<FrontmatterableElement | null>) {
  /** Frontmatter必须要在`onMounted`钩子里才能拿到。 */
  const frontmatter = computed<Record<string, any>>(() => {
    if (!el)
      return {}
    if (!el?.value || !el?.value?.frontmatter)
      return {}
    return el.value.frontmatter
  })

  return {
    /** Frontmatter必须要在`onMounted`钩子里才能拿到。 */
    frontmatter,
  }
}
