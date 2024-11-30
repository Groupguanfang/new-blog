---
title: 前端又推陈出新了：Dlight.js，一个我认为目前JS端DX最好的框架
date: 2024-03-03
description: 一个我认为目前JS端DX最好的框架。
cover: /static/images/dlight.jpg
tags:
  - JavaScript
  - 前端
---

老规矩，开头先上正菜🥣：

> 官网：https://dlight.dev

> Github：https://dlight.dev

![image.png](/static/images/dlight.jpg)

现在关注这个框架还是非常非常早的。但是无妨让我们来探索、了解它。

现在官网首页已经有汉化了，我们看看它的code style，DX真的是`Max`：

![image.png](/static/images/dlight-demo.jpg)

```typescript
@View
class MusicChooser {
  @Prop musics
  musicIdx = this.random()
  music = this.musics[this.musicIdx]
  random() {
    return Math.floor(Math.random() * this.musics.length)
  }

  View() {
    PrettyBtn('Get a new song!')
      .onClick(() => {
        this.musicIdx = this.random()
      })
    MusicDisplay(music)
  }
}
```

## 让我们从最基础的开始

声明一个`div`，非常简单:

```typescript
div('Hello world')
```

改变`div`的样式？添加`div`的`class/id`？添加`div`的事件？也非常简单，采用链式语法，一路`.`下去：

```typescript
div('Hello world')
// 添加行内样式
  .style({ padding: '10px' })
// 设置Id
  .id('app')
// 设置class
  .class('root')
// 添加事件
  .onClick(() => {
    // 在这里添加逻辑
  })
```

如果你了解过鸿蒙的`ArkTS`，又或者是做过苹果的原生`Swift UI`的开发，你应该能倍感亲切；但是有些东西还是和`ArkTS`是不一样的，比如自定义一个元素内部的内容，dlight.js是这么写的：

```typescript
div().onClick(() => {
  // 在这里添加逻辑
}); {
  // 在这里自定义内容
}
```
而`ArkTS`的语法是这样的：

```typescript
Text() {
   // 在这里自定义内容
}.onClick(() => {
  // 在这里添加逻辑
})
```

可以看到，dlight.js的`div()`，实际上由`;`分号隔了两段，实际上是由两段代码组合而成的；那么，怎么渲染到页面上呢？

没错，`Babel`插件嘛。仓库是Monorepo的，看到这个文件夹，我就已经知道了（）

有兴趣的可以看看：[dlight/packages/core/babel-preset-dlight](https://github.com/dlight-js/dlight/tree/main/packages/core/babel-preset-dlight)

再谈流程控制，都直接`{}`了，你想要在这个`{}`中操作整个View类的上下文干什么都可以了，比如亲爱的`if/else`、`switch-case`、`for`循环：

![image.png](/static/images/dlight-code-style.jpg)

## 响应式

一般的字符串，和数字，直接声明一个类属性即可：

```typescript
@View
class MusicChooser {
  // 如果这个属性在View函数中用了，它就是响应式的；
  // 如果没有用，它就是正常的类变量。非常智能了属于是
  test: string = 'Hello world'

  View() {}
}
```

Props，也能很好地响应：

```typescript
@View
class MusicChooser {
  // 有这个@Prop，就是一个prop
  // 如果 = 了required，就表示是必传的
  @Prop
  test: string = required

  View() {}
}
```

## TypeScript支持

特别是子组件，非常需要TypeScript的支持，因为dlight的组件设计是去除`new`关键字的组件，所以导出一个组件的时候，必须要用一个比较蹩脚的`as any as T`：

```typescript
interface MyCompProps {
  /** 这是 prop1 */
  prop1: string
  /** Prop2是一个number */
  prop2: number
  /** Prop3是一个布尔值 */
  prop3: boolean
}

@View
class MyComp implements MyCompProps {
  @Prop prop1 = required
  @Prop prop2 = required
  @Prop prop3 = required

  View() {}
}

// 这个Pretty实际上就是any😂更语义化，语义化一点嘛（
export default MyComp as Pretty as Typed<MyCompProps>
```

## 性能

这方面文档上没有明说，但是据说与`solid.js`差不多哦，贴一个dlight团队发的链接，可以看到benchmark：

https://krausest.github.io/js-framework-benchmark/current.html

---

整体大概这么多。整个看下来，这个框架无疑是极好的（（（（就是还没生态

现在Dlight还有一个叫`Model`的东西，类似`React hook` `Vue hook`这种，用于抽象API，以方便在视图中使用，但是文档现在还没有，再等等吧（）

帮dlight的群引个流：

- Discord：https://discord.gg/sD57p7NakQ
- 微信：找知乎上的[IanDx](https://www.zhihu.com/people/iandx)大佬要个二维码吧（）
