<template>
  <div class="stroke_title">
    <h1 absolute top--10>
      <slot />
    </h1>
  </div>
</template>

<style scoped>
.stroke_title {
  @apply text-stroke-2
    select-none
    text-nowrap
    font-size-20
    md:font-size-24
    transition-all
    font-extrabold
    text-left
    m-auto
    max-w-5xl
    w-full
    relative
    op-50
    z--1;

  -webkit-text-stroke-color: #555;
  -webkit-text-stroke-width: 1px;
  color: transparent;
  font-family:
    Inter,
    ui-sans-serif,
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    Segoe UI,
    Roboto,
    Helvetica Neue,
    Arial,
    Noto Sans,
    sans-serif,
    'Apple Color Emoji',
    'Segoe UI Emoji',
    Segoe UI Symbol,
    'Noto Color Emoji' !important;
}
</style>
