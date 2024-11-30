import { Awaitable } from '@vueuse/core'

type MaybeRefOrGetterable<T> = MaybeRefOrGetter<T> | T

export interface UseBindLocalStorageOptions {
  onBinderChange?: (v: any) => Awaitable<unknown>
  onLocalStorageChange?: (v: any) => Awaitable<unknown>
  defaultValue?: MaybeRefOrGetterable<string | boolean | number | null>
}

function isOptions(
  defaultValueOrOptions: MaybeRefOrGetterable<string | boolean | number | null> | UseBindLocalStorageOptions,
): defaultValueOrOptions is UseBindLocalStorageOptions {
  return (typeof defaultValueOrOptions === 'object' && defaultValueOrOptions !== null && !isRef(defaultValueOrOptions))
    || false
}

export function useBindLocalStorage(
  key: string,
  binderRef: Ref,
  defaultValue?: MaybeRefOrGetterable<string | boolean | number | null>,
): void
export function useBindLocalStorage(
  key: string,
  binderRef: Ref,
  options?: UseBindLocalStorageOptions,
): void
export function useBindLocalStorage(
  key: string,
  binderRef: Ref,
  defaultValueOrOptions: MaybeRefOrGetterable<string | boolean | number | null> | UseBindLocalStorageOptions = null,
) {
  const localStorageRef = useLocalStorage(
    key,
    isOptions(defaultValueOrOptions)
      ? defaultValueOrOptions.defaultValue ?? null
      : defaultValueOrOptions,
  )

  watch(binderRef, async (v) => {
    if (isOptions(defaultValueOrOptions) && defaultValueOrOptions.onBinderChange)
      await defaultValueOrOptions.onBinderChange(v)
    localStorageRef.value = v
  }, { immediate: true })

  watch(localStorageRef, async (v) => {
    if (isOptions(defaultValueOrOptions) && defaultValueOrOptions.onLocalStorageChange)
      await defaultValueOrOptions.onLocalStorageChange(v)
    binderRef.value = v
  }, { immediate: true })
}
