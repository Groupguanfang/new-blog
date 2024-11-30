<template>
  <span relative class="inline-underline" font-bold>
    <slot />
  </span>
</template>

<style lang="less" scoped>
@height: 4px;

.inline-underline::before {
  content: "";
  display: block;
  position: absolute;
  height: 100%;
  background: #0000003d;
  width: 0;
  left: 0;
  bottom: 0;
  transition: width 400ms;
  pointer-events: none;

  html.dark & {
    background: #ffffff3d;
  }
}

.inline-underline:hover::before {
  width: 100%;
}

.inline-underline::after {
  content: "";
  display: block;
  height: @height;
  background: #000;
  width: 100%;
  position: absolute;
  right: 0;
  bottom: 0;
  transition: width 400ms;
}

.inline-underline:hover::after {
  width: 0;
}

.inline-underline::before {
  transition-delay: 0s;
}

.inline-underline:hover::before {
  transition-delay: 100ms;
}

.inline-underline::after{
  transition-delay: 100ms;
}

.inline-underline:hover::after{
  transition-delay: 0s;
}
</style>
