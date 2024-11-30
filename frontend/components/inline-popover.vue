<script setup lang="ts">
defineProps<{
  trigger: string
  panelClass?: string
}>()
</script>

<template>
  <Popover as="span" relative>
    <PopoverButton relative class="inline-bg" outline-none hover:op-80 transition-all underline="~ wavy">
      {{ trigger }}
    </PopoverButton>

    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="transform opacity-0 translate-y-1"
      enter-to-class="transform opacity-100 translate-y-0"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="transform opacity-100 translate-y-0"
      leave-to-class="transform opacity-0 translate-y-1"
    >
      <PopoverPanel absolute z-10>
        <div :class="panelClass" relative dark:bg-gray-5 bg-emerald px-2 py-1 rounded-md>
          <slot />
        </div>
      </PopoverPanel>
    </Transition>
  </Popover>
</template>

<style>
.inline-bg::before {
  content: "";
  display: block;
  position: absolute;
  height: 100%;
  background: #00000014;
  width: 0;
  left: 0;
  bottom: 0;
  transition: width 400ms;
}

.inline-bg:hover::before {
  width: 100%;
}
</style>
