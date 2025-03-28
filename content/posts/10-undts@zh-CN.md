---
title: 如何生成ts，tsx，vue，svelte，astro，vine.ts等模版的d.ts文件？用undts
date: 2024-7-26
lang: zh-CN
description: 2024年，时光流转。后疫情时代，处处折射出人对未来的迷茫与对家庭的深切感悟。生活在琐碎中展现出沉重与思索，平凡却不失深刻。
---

> 撰于2024年12月14日。

目前，似乎前端社区内很少有方便好用的`.d.ts`生成工具，于是便动手做了一个。目前支持的有：

- `.ts`和`.tsx`文件，不用多说
- `.vue`模版：https://vuejs.org
- `.svelte`模版：https://svelte.dev
- `.astro`模版：https://astro.build
- `vine.ts`文件（其实就是写vue模版另外一种方式）：https://vue-vine.dev

话不多说，先放仓库地址：

[github unbuilderjs/undts](https://github.com/unbuilderjs/undts)

安装它也很简单：

```bash
pnpm i undts
```

秉着一切从简的原则，我想要做一个既强大，又易用的`.d.ts`生成工具，所以如果轻度使用，配置项会变得和`tsup`，`@antfu/eslint-config`那样简单到爆炸💥~

在你的项目根目录中创建一个`build.js`（或者你用`ts`然后用`tsx`/`ts-node`等的工具来跑也行）:

```typescript
import { build } from 'undts'

build({
  // 这里放你的程序入口点，就像`tsup`那样，但是只能是一个数组
  entry: [
    './src/index.ts',
  ],

  // 默认情况下，所有模版编译都是开启的，选项取决于你
  // 比如你正在开发vue组件库，你可以把其他的都关了，如下：
  astro: false,
  svelte: false,
  vine: false,

  // 你可以自定义alias和resolve选项，这样你就可以在你的项目中
  // 使用别名之类的，扔掉../../../这种超长的路径导入
  alias: {},
  resolve: {},
})
```
还有一些高级的选项，可以参考jsdoc提示得知，也是非常的简单。

理论上来讲，一般的项目只需要定义`entry`选项，还有开关这些模版编译的开关就行，你就说是不是方便到爆炸吧。

## 原理

很简单粗暴，没有考虑性能，只考虑了生成的结果是不是最令人满意的：

`启动一个tsc服务器` - `内置转换插件转换（vue啊svelte啊等等）` - `rollup + rollup-plugin-dts打包到一起`

大致的原理就是这样。将这个工具与`tsup`等工具结合使用，会更加爽歪歪的😋
