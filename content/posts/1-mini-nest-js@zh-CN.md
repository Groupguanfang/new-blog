---
title: 一个人用两天时间实现自己的mini Nest.js
description: 肝了好多天，研究了Nest.js的装饰器实现，觉得有亿点牛啊，所以想记录下来。
date: 2023-05-10
cover: /static/images/nest-logo.png
---

![nest-logo.svg](/static/images/nest-logo.png)

第一次发文章，肝了`两天`研究了Nest.js的装饰器实现，觉得有亿点牛啊，所以想记录下来。

一篇短文，以后我的文章都不会写太长，太长不会有人看下去。~~其实就是懒（bushi~~

知道有些人等不及，先放个成果出来让大家看看吧。

环境：`node.js 16` + `pnpm`下开发

打开终端，运行：

```sh
pnpx naily
```
然后根据脚手架的提示创建项目就行。简单吧。

这是Github链接：[Groupguanfang/naily](https://github.com/Groupguanfang/naily)

## 前置知识

> 这篇文章适合使用`Nest.js`和`Express`有一段时间的人，如果您之前一直没有用过`Nest.js`，可能这篇文章并不适合你。

> 看这篇文章之前除了要有一定的`Nest.js`知识，也要有点`TypeScript Decorator`的基础知识，要不然是不可能看得懂的。

> 看这篇文章之前除了要有一定的`TypeScript Decorator`知识，也要有点`reflect-metadata`的基础知识，要不然是不可能看得懂的。

## 起步

好！经过上面的铺垫，我想你应该饱腹八股文了吧（误

我一开始也觉得是。但是当我真正上手`Decorator`和`reflect-metadata`的时候，我却无从下手，不知道从哪里开始写起，才能把`Express`框架包一层。

npm包下载完，`index.ts`，然后愣在那傻的，也不会写。然后就到处百度，Github，到处搜，看看有没有现成的。

诶嘿还真给我找到个现成的。但是说他现成吧，也不是现成，因为他功能只实现了俩：`@Controller`和`@Get`。

链接在此: [JYbill/implement-nestjs-controller-get: 通过ts 反射 + 装饰器实现低配版的nest的@Controller、@Get (github.com)](https://github.com/JYbill/implement-nestjs-controller-get)

然后我就把他的源码下载下来研究，总算是起了个头。

下一步，就要开始操作了～

![IMG_2192.jpeg](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6dc30a8d25e34574a05f58c591587623~tplv-k3u1fbpfcp-watermark.image?)

## 架构分析

架构不是说妙，是`真的妙`。整个程序启动的生命周期是这样的：

### 生命周期第一步

装饰器获取到`控制器类`以及`里面的方法`，将控制器类在`装饰器`里`new`一下，将`new`出来的结果使用`Reflect.defineMetadata`定义为`metadata`。与此同时，将类存入一个名为`componentContiner`的数组中，之后方便取出使用。

这是[JYbill/implement-nestjs-controller-get](https://github.com/JYbill/implement-nestjs-controller-get)大佬的源码，他的源码很基础，我随便加了点注释，应该很容易看懂吧（试探）：

```typescript
// 容器装载所有的类
export const componentContiner = []

// 定义一下metadata的key
export enum HTTP_KEY {
  Controller = 'controller',
  Get = 'get'
}

/**
 * 控制器
 *
 * @description 这个就是控制器类了
 * @param {string} path 传入一个Express Router路径
 * @returns {ClassDecorator} 返回一个装饰类的装饰器
 */
export function Controller(path: string = '/'): ClassDecorator {
  return (Target: any) => {
    // 为了不再index页面手动new对象，采用类似spring容器的方式管理
    componentContiner.push(Target)

    // 反射会用到一些信息
    Reflect.defineMetadata(HTTP_KEY.Controller, {
      // 这个地方，把装饰器传入的Express Router path路径也传进来了！
      path,
      // 这个地方！new了Class！
      clazz: new Target()
    }, target)
  }
}

/**
 * Get方法
 *
 * @description 这个是Get装饰器哦
 * @param {string} path 传入一个Express Router路径
 * @returns {MethodDecorator} 返回一个装饰方法的装饰器
 */
export const Get = function (path: string = '/'): MethodDecorator {
  return (target: any, methodName: string, desc: TypedPropertyDescriptor<unknown>) => {
    // 会用到原始函数
    Reflect.defineMetadata(HTTP_KEY.Get, {
      // 和前面的控制器一样
      // 把path传进metadata
      path,
      // 使用.value能单独获取到这个方法
      // 暂且就先将这个方法存进metadata里
      // 后面用得到
      fn: desc.value
    }, desc.value)
  }
}
```

接下来，让我们创建一个测试的`控制器`：

```typescript
import { Controller, Get } from '../decorator/http.decorator'

@Controller()
export class TestController {
  @Get()
  getHello() {
    return 'hello world~'
  }
}
```
### 生命周期第二步

创建`Express`服务器，遍历`componentContiner`数组内的`控制器`，使用`Reflect.getMetadata`获取`控制器`内存的内容，每个部分都装载进`Express`。

`index.ts`:

```typescript
// 导入metadata反射包
import 'reflect-metadata'
/**
 * 导入express
 * import express = require('express')相当于
 * import * as express from "express"
 */
import express = require('express')
// 导入 componentContiner和HTTP_KEY enum
import { componentContiner, HTTP_KEY } from './decorator/http.decorator'

// 直接导入你写的控制器
import './controller/user.controller'

// 创建Express服务器
const app = express()

// 遍历下componentContiner 实现路由分配
componentContiner.forEach((item) => {
  // 获取Controller反射
  // 还记得之前Reflect.defineMetadata定义的内容吗
  // 可以使用Reflect.getMetadata获取到哦
  // 这个clazz就是类，就是那个new过的类
  const { path, clazz } = Reflect.getMetadata(HTTP_KEY.Controller, item)
  // 使用Object.getPrototypeOf()获取Controller类的原型
  const prototype = Object.getPrototypeOf(clazz)
  // 获取原型上的方法名并过滤构造函数
  const methodNames = Object.getOwnPropertyNames(prototype)
    .filter(item => item !== 'constructor')

  // 遍历方法名
  methodNames.forEach((element: string) => {
    // 找出位于class原型上的这个方法
    const method = prototype[element]
    // 获取Get反射
    // 还记得之前Reflect.defineMetadata定义在Get里面的内容吗
    // 照样可以使用Reflect.getMetadata拿到的
    const { info, fn } = Reflect.getMetadata(HTTP_KEY.Get, method)

    // 路由组装
    // 就是把Controller和Get装饰器的路径拼起来
    // 以便传给Express
    const urlPath = join(`/${path}`, info).replace(/\\/g, '/')

    // 然后就是大家熟知的app.get了
    app.get(urlPath, (req, res) => {
      // 执行一下这个函数
      const ret = fn()
      // 然后发送函数返回的内容
      res.send(ret)
    })
  })
})
```

然后直接执行`index.ts`即可。

怎么样，是不是很妙？

其实，上面的代码，从`创建Express服务器`开始，我们就可以拿来封装起来。使开发端看上去像这样：

```typescript
// 注入控制器
import './app.controller'

// 导入app
import app from 'naily/app'
// 在8000端口启动
app.boot(8000)
```

这就是核心原理了。知道了核心原理，要实现`@Post`，`@Put`等装饰器直接照葫芦画瓢，哈哈哈😂～

以上都是大佬的仓库内容，接下来的技术实现，准备分多篇文章来讲，~~（但是可能会拖更很久哈哈哈哈嗝懒得写~~

## 实现更多的功能

我现在在大佬的`@Controller`和`@Get`上，还实现了更多：

* `@Get` `@Post` `@Put` `@Patch` `@Options` `@Delete`和`@All`，这几个装饰器可以照葫芦画瓢，很容易做出来的；
* `@RequestParam` `@RequestQuery` `@RequestBody` `@RequestIp` `@Req` 和 `@Res`
* 支持`Promise`，`Promise`这玩意儿需要单独做支持，要不然执行函数全是同步的，Promise内容无法求出返回值。
* `@Injectable`，依赖注入，这玩意耗了我很长时间，两天时间有一天都是在研究这个依赖注入的，全程没有参考任何百度上的代码，就去`MDN`上找了几个`JS函数`比如`Object`等...不过最终还是实现了，但是晚上头疼欲裂，人都要炸了💥
* `@UseFilter`以及`HttpException`，组合成错误过滤器（~~筛子QWQ~~），用`Express`时最希望的就是把那冗长的`try...catch...`给去掉，错误过滤器就把大部分`try...catch...`都去掉了。部分情况仍然需要使用，那也没办法。

>实际上`Nest.js`里，不仅有`HttpException`，还有`BadRequestException`等等等等的`Exception`错误抛出类，但是我就实现了一个基础的`HttpException`，练手嘛。

> `app.useGlobalFilter()`全局使用某个过滤器的函数我仍然在开发中，还没有什么思路，~~懒癌晚期患者~~

> 我为这个库加了超级超级多的`注释`，虽然有些地方做得很垃圾但是注释多，也有助于你了解`Nest.js`的底层原理。

> 这个库刚弄没多久，没有star，~~懒癌晚期患者~~，如果你觉得这个库还不错，可以给我一个star，谢谢。

懒得写了，撩笔，下篇文章见。
