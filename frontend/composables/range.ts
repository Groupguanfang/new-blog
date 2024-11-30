interface UseNumberRangeOptions {
  step?: number
  immediate?: boolean
  interval?: number
}

export function useNumberRange(min: number, max: number, options: UseNumberRangeOptions = { step: 1, immediate: true, interval: 0 }) {
  const range = ref(min)
  const isReverting = ref(false)
  let interval: ReturnType<typeof setInterval>

  function start() {
    interval = setInterval(() => {
      if (isReverting.value) {
        range.value -= options.step || 1
      }
      else {
        range.value += options.step || 1
      }

      if (range.value >= max || range.value <= min) {
        isReverting.value = !isReverting.value
      }

      if (range.value >= max) {
        range.value = max
      }

      if (range.value <= min) {
        range.value = min
      }
    }, options.interval || 0)
  }

  function stop() {
    clearInterval(interval)
  }

  onMounted(() => {
    if (options.immediate === true) {
      start()
    }
  })

  return {
    range,
    start,
    stop,
  }
}
