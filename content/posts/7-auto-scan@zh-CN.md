---
title: 去掉繁重的@Module，基于Vite做了一个Nest.js下自动扫描@Module的插件，直接爽了
date: 2024-08-08
description: 去掉繁重的@Module，基于Vite做了一个Nest.js下自动扫描@Module的插件，直接爽了! 🚀
tags:
  - Nest.js
  - Vite
  - TypeScript
---

偶看到[vite-plugin-node](https://www.npmjs.com/package/vite-plugin-node)这个Vite插件，发现用它可以很方便地把`Nest.js`项目接入`Vite`生态。

当即立马有了一个想法：做`Nest.js`的项目，创一个业务类就要往`@Module`里放，烦死个人。能不能做一个自动扫描`Nest.js`类的Vite插件呢？

## 安装配置

说干就干，直接安装：

```sh
pnpm i vite-nest-auto-scan
```

然后配置vite.config.ts:

```typescript
import { NestAutoScan } from 'vite-nest-auto-scan'

export default defineConfig({
  plugins: [
    NestAutoScan({
    // 是否开启Log
      enableLogger: false,
      // 启动文件位置 默认`join(cwd(), 'src/main.ts')`
      entryPath: join(cwd(), 'src/main.ts'),
      // 模块文件名的以什么为结尾，默认`['.module.ts']`
      moduleSuffix: ['.module.ts'],
      // 根模块的位置 默认`join(cwd(), './src/app.module.ts')`。
      // 只有根模块才可以使用`@RootScan`装饰器
      rootModulePath: join(cwd(), './src/app.module.ts'),
      // `@RootScan`装饰器选项
      rootScanOptions: {
        // 顾名思义了，就是controllers/providers/imports数组的glob匹配
        // 相对于`@RootScan`module的位置

        // 默认./controllers/**/*.controller.ts
        controllersGlob: [],
        // 默认有四个匹配：
        // ./services/**/*.service.ts
        // ./providers/**/*.service.ts
        // ./services/**/*.provider.ts
        // ./providers/**/*.provider.ts
        providersGlob: [],
        // 默认./modules/**/*.module.ts
        importsGlob: []
      }
    })
  ]
})
```

配置好了之后，在src目录下创建一个`shims.d.ts`文件，添加一个三斜杠指令：

```typescript
/// <reference types="vite-nest-auto-scan/client" />
```
这样就引入了`@AutoScan`和`@RootScan`的类型定义了，它俩是全局的，但是只能在`.module.ts`用（上面`vite.config.ts`里可以改)，`@RootScan`更严格，只能在`rootModulePath`中用，插件会根据你的`vite.config.ts`中定义的选项对你的代码进行`transform`。

正常的`nest.js`项目结构基本都是这样：一个入口main.ts + 一个入口模块（一般为app.module.ts），这个入口模块的`imports`数组里注册了所有的src目录下的`modules`。所以项目一大，这个`imports`数组会无比的巨大，眼花缭乱找不着北。因此，根模块现在引入了一个只有根模块可用的`RootScan`装饰器，帮助我们减少繁重的`imports`。

解决掉这个问题，再解决子模块的`providers`/`controllers`数组繁重的问题：再引入一个只有`.module.ts`文件可用的装饰器`AutoScan`，会将当前目录下的所有`Injectable`/`Controller`都给注入到`providers`/`controllers`数组中。

这样，两个装饰器下来，你开发就简单了很多，配置好`RootScan`装饰器之后，只管往`src/modules`创建文件夹和文件就行，只要一个`AutoScan`装饰器就可以包揽全部，既做到了`隔离的业务逻辑`的作用，又不需要写那繁重的`providers`/`controllers`，直接爽飞天！😁

<p align=center>
    <img src="/static/images/7-auto-scan/folder-structure.webp" alt="典型目录结构"  />
</p>

上面就是一个非常明了的目录结构了。我的`app.module.ts`内容长这样：

<p align=center>
    <img src="/static/images/7-auto-scan/app-module-ts.webp" alt="app.module.ts"  />
</p>

可以看到，除了一些共享的三方模块，如配置、Mongoose、微信、Jwt、错误拦截模块等，`src/modules`里面的模块一点都不需要导入🙅，爽！

> ⚠️这里要注意的是：`@Module`只会覆盖配置，所以请确保`@RootScan`和`@AutoScan`装饰器永远都在`@Module`装饰器的上面，这样才能合并配置。

再看看我的`address.module.ts`：

<p align=center>
    <img src="/static/images/7-auto-scan/address-module-ts.webp" alt="address.module.ts"  />
</p>

没了，就两行！只有两行！妈妈再也不用担心我的`@Module`了！

## 为什么不用require来实现这两个装饰器，而要使用vite的插件来实现，是不是有点拐弯抹角了？

其实主要是vite的生态，比如`unplugin-auto-import`，用上了这个插件，装饰器们再也不需要`import xxx from xxx`了，舒服的一批～

其次，本身`vite`当开发服务器也不差，用了`vite-plugin-node`这个插件之后自我感觉体验反而比官方的`tsc`/`swc`/`webpack`编译更好了：因为它保存文件后不会自动重启nest服务器，会在你请求nest服务器的时候快速用`swc`编译好立马给nest服务器开起来，这个体验不逊于前端HMR，也是爽了。

再结合vitest做单元测试，不是一家人不进一家门，诶嘿

> 另外用`require`来做这两个装饰器也不是不行，但是你就得用`node`的`fs`模块来读文件夹下的所有文件，而且必须要sync因为装饰器不允许async...
>
> 或者另一种方案就是采用nest的依赖注入的方法将亲爱的类们收集起来，然后再在根模块register....
>
> 有空哪位大佬出一个qwq
