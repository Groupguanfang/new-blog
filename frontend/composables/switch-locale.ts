import { availableLocales, loadLanguageAsync } from '~/modules/i18n'

export const LocaleStorageKey = '__naily:blog_locale__'

export function useSwitchLocale() {
  const { locale } = useI18n()

  useBindLocalStorage(LocaleStorageKey, locale, {
    onBinderChange: v => loadLanguageAsync(v),
    onLocalStorageChange: v => loadLanguageAsync(v),
    defaultValue: 'zh-CN',
  })

  async function toggleLocales() {
  // change to some real logic
    const locales = availableLocales
    const newLocale = locales[(locales.indexOf(locale.value) + 1) % locales.length]
    await loadLanguageAsync(newLocale)
    locale.value = newLocale
  }

  return {
    toggleLocales,
  }
}
