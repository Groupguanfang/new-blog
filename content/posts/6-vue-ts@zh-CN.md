---
title: 解锁Vue3完全体：全完备的TS支持
date: 2024-07-26
description: Vue对于TS的支持一直令人诟病，从V2～V3，一直都是不完备的。最近Volar大版本更新，变成了Vue - Official之后，更多BUG来了；编辑器卡顿、一点提示都不出......纷至沓来，更是让大家伙儿的印象更加差。这篇文章就来擦擦屁股：论如何在Vue3中得到完备的类型支持😎
tags:
  - Vue
  - TypeScript
---

Vue对于TS的支持一直令人诟病，从V2～V3，一直都是不完备的。

最近Volar大版本更新，变成了Vue - Official之后，更多BUG来了；编辑器卡顿、一点提示都不出......纷至沓来，更是让大家伙儿的印象更加的差。这篇文章就来擦擦屁股：论如何在Vue3中得到完备的类型支持😎

## 解决方案一：舍弃.vue模版，向TSX靠齐

没错！这个方法应该是所有人都知道的：使用TSX语法，这样就和React差不多，能得到TypeScript支持，而TypeScript和VSCode又本来就是同一家人，所以从语言到编辑器，全套下来都是能拥有完整的类型安全的😋

```tsx
interface Props {}

export function Test({}: Props) {
  return <div></div>
}
```
这是一种类似React的写法，还有一种是老版Vue Options的写法：
```ts
export const Test = defineComponent({
  setup() {}
})
```
两种写法都能实现`类型安全`，但是前提———

得用TSX。

## 解决方案二：使用auto import

`unplugin-auto-import`隶属`unjs`旗下，本质和Vue是一家人。

有些人好奇为什么用auto-import就有类型提示了：其实很简单，因为用了`auto-import`之后，它会动态生成`d.ts`文件。

我们在创建完一个新vue项目之后，如果碰到类型出问题，很多时候都会在`env.d.ts`里加入这样一段代码：

```ts
declare module '*.vue' {
  import type { DefineComponent } from 'vue'

  const component: DefineComponent<object, object, any>
  export default component
}
```

如果加上了这个代码，而没有使用`auto-import`，就会导致所有的Vue模版都会指向这个`env.d.ts`文件，所以才一直令人诟病。

说到这里可能大多数人已经明白我的意思了，特别是用过antfu大佬的`Vitesse`这个模版的，可以知道它是有完整的类型提示的，原理就是使用了`auto-import`。

加上这个插件之后，直接设置一下`d.ts`要生成到哪儿，以及哪些`.vue`文件需要被`auto-import`，这样无论是Prop、组件Tag标签、插槽，都会有相应的提示了。
