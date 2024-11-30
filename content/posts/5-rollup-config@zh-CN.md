---
title: 一个简单的Node库，运行前究竟如何打包是好？
date: 2024-05-02
description: 一个简单的Node库，运行前究竟如何打包是好？目前有很多打包工具，如何选择？
tags:
  - 前端
  - 开源
---

前端娱乐圈本就是火热的。

而Rust的风一吹来，更使这个火盆花式迸发出各种各样的`打包工具`,`转换工具`。现在要开发一个简单的`node`项目，东选西选，家家都说自己快，家家都说自己厉害，最后不知道该选什么了。

> 来看看现在都有哪些可供你用的镰刀锤子了。

### TypeScript
本质上，`TypeScript`和`Babel`都只是一个`转译器`,所以现在很多工具都尝试优化`TypeScript`的编译速度。

`TypeScript`是一个转译器，因此它其实也是有`插件系统`的，这个插件系统就叫做`transformer`，能够和`Babel`一样操作`TypeScript`AST。

> **✅目前的最佳实践**
>
> 把`转换`这个步骤，让`Babel`去完成，或让`SWC`完成，只让`TypeScript`做`校验`这个步骤（即`noEmit`)。

### Babel
6TO5，JavaScript转译器，众所周知，最常用的场景是用来将新版本的JS代码转换为老版本的JS。但是它的扩展性非常好，可以写各种各样的插件，要是你有精力，甚至可以自己用Babel造一门编译语言。

### Babel的继任：SWC
`SWC`可以说是一个`Rust`版的`Babel`，但是我又不太承认，因为`Babel`的插件生态它没法用，但是基础的`Babel`功能，以及内置对`TypeScript`的支持，让它足以胜任大多数生产环境下的场景，生产环境肯定是可以上的。

### Webpack
打包工具的老大哥，倾向于打包生产环境的程序。社区和基于它的loaders/plugins非常多，功能最强大，但是加上各种各样的loader之后，速度是目前最慢的了。

### Webpack继任：Rspack
用~~原神~~Rust编写，速度确实快了，内置了`SWC`的Loader，可以替代掉`Babel Loader`；但是正如上面所说，`SWC`不兼容`Babel`的插件，如果要做`SWC`的插件，只能用`Rust`编写，这个门槛就高了喔...

### Rollup
另一个打包工具，和`Webpack`不一样的是更倾向于打包`库`，像`Vue`就是用它打包的。而且`Rollup`靠的是`Treeshake`发家，对`Treeshaking`有一流的支持；插件也算齐全，哪怕是生产环境现在它也能胜任了。

但是和`Webpack`一样，JS编写，比较慢，😂

### Rollup继任：Rolldown
也是`Vue Core Team`成员发起的一个项目，用`Rust`重写`Rollup`，但是目前还是为时尚早，文档都不全，还是不推荐使用的。

### ESBuild
另一个使用`Go语言`编写的打包工具，也是以速度极快闻名，但是扩展性和`SWC`一样欠缺，照样不是特别好。

### tsup
开发库的不二选择，是基于`ESBuild`的上层封装，速度极快，支持生产`d.ts`，如果是开发一般的`node`库或前端库，我就选它了。

### bun
集大成者，但是目前还是没有`tsup`等功能强大，因此打包库的场景下，建议还是不要使用`bun`进行打包，毕竟也有局限（除非你开发的就是`Bun`库）。

## 所以该怎么选？
如果用不到`装饰器`、`transformer`等TypeScript高级特性，选择`tsup`即可满足绝大多数需求。

如果用得到这些有关于`TypeScript`的转换需求呢？我选择使用`Rollup`。

我这个人有个习惯，一有点想法，就创一个新项目。为此，我专门为`Rollup`开发了一个库，仿照`@antfu/eslint-config`一样，做了一个`@naiable/rollup-config`。每次创建一个新项目，都要创建`src`文件夹，创建`src/index.ts`文件，创建`package.json`文件，创建`tsconfig.json`文件；然后才是配置`rollup`打包。由于嫌配置麻烦，就做了这个库，方便自己配置。

用法和antfu的eslint-config差不多，很简单，直接安装：

```bash
pnpm i @naiable/rollup-config
```

```ts
// rollup.config.ts
import naiup, { presetLib } from '@naiable/rollup-config'

export default naiup(
  // 用于打包`Library`的预设
  presetLib({
    // naiup的选项
    resolve: false
  })
)
```

```json
// package.json
{
  "scripts": {
    "build": "naiup"
  }
}
```
然后直接运行`pnpm build`即可输出`lib`文件夹，里面包含`cjs`、`esm`、`types`三个文件夹，懂的都懂了诶嘿～

除了`presetLib`之外，我还提供了一个`presetApp`，用来打包App：

```ts
// rollup.config.ts
import naiup, { presetApp } from '@naiable/rollup-config'

export default naiup(
  // 用于打包`App`的预设
  presetApp({
    // naiup的选项
  })
)
```

内置了`resolve`、`alias`、`dts`、`commonjs`这四个rollup插件，最常用的也就这些了。

同时，预设还支持切换`compiler`：

![选择compiler](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/94e97ba90b06433989bd748e09fca167~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1422&h=392&s=209697&e=png&b=30302a)

也支持覆写配置，（毕竟配置文件就是`rollup.config.ts`），要怎么自定义你的预设，请随意喵
