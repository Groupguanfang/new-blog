---
title: 做了一个nest.js prisma模块，让prisma支持了切面编程的精髓：监听器
date: 2024-02-05
description: 一个nest.js prisma模块，让prisma支持了切面编程的精髓：监听器。
tags:
  - TypeScript
  - Nest.js
  - Prisma
  - Node.js
---

开头先上正菜。安装方法：
```bash
pnpm i @nailyjs.nest.modules/prisma
```

- [Github](https://github.com/nailyjs/nest-prisma)

- [npm](https://www.npmjs.com/package/@nailyjs.nest.modules/prisma)

没装Prisma的请先装：
```bash
pnpm i prisma @prisma/client
```
这俩是必须滴。

## 使用

和其他三方nest模块一样，参照`README.md`先从`@nailyjs.nest.modules/prisma`中导入`PrismaModule`到你的`根模块`中。

```typescript
import { PrismaModule } from '@nailyjs.nest.modules/prisma'
import { Module } from '@nestjs/common'

@Module({
  imports: [
    // 导入Prisma模块。如果不注册任何监听器，可以这么导入。
    PrismaModule.forRoot(),
  ],
})
export class AppModule {}
```
然后在任何地方都可以注入`PrismaService`和`PrismaClient`两个类了。

> `PrismaClient`从`@prisma/client`包导入，监听器不会监听到`PrismaClient`发出的事件；`PrismaService`的基类就是`PrismaClient`,在`PrismaClient`的基础上实现了监听器的功能。

一般情况下，请使用`PrismaService`; 除非有特殊的需求，不想让监听器监听到，那就可以使用`PrismaClient`。

`PrismaClient`本来是`不能被nest.js注入`的，但是由于`PrismaModule.forRoot()`了，此时`PrismaClient`就是可以被注入的类了。可以很轻松地使用这俩类😜

### 撰写Service

```typescript
import { PrismaService } from '@nailyjs.nest.modules/prisma'
import { Injectable } from '@nestjs/common'

@Injectable()
export class AppService {
  constructor(
    // 这是能被监听器监听到的
    private readonly prismaService: PrismaService,
    // 这是不能的
    private readonly prismaClient: PrismaClient
  ) {}

  async findMany() {
    return this.prismaService.user.findMany()
  }
}
```

### 一个示例Subscriber

import语句我就不写了，懒得弄。看得懂就行。

```typescript
@Injectable()
export class PrismaListener {
  /**
   * 假设您有一个名为`user`的prisma模型，可以在这里注册一个监听器，监听`findMany`事件。
   * BeforeListen顾名思义，就是在`findMany`方法执行之前执行的方法。
   */
  @BeforeListen('user', 'findMany')
  public async beforeFindMany() {
    console.log('before findMany')
  }

  /**
   * AfterListen顾名思义，就是在`findMany`方法执行之后执行的方法。
   */
  @AfterListen('user', 'findMany')
  public async afterFindMany() {
    console.log('after findMany')
  }
}
```
> `BeforeListen`和`AfterListen`从`@nailyjs.nest.modules/prisma`包导入。

写好了之后，还要注册到`forRoot`：
```typescript
@Module({
  imports: [
    PrismaModule.forRoot({
      subscribers: [PrismaListener]
    }),
  ],
})
export class AppModule {}
```

然后每次调用`user`表里的`findMany`方法时，都会先依次触发`PrismaListener`里的`beforeFindMany`方法，然后结束后再触发`afterFindMany`方法。

这样，就实现了切面的逻辑分离了。

> 这个包于2024年2月5日新鲜出炉，想上生产的都先等会（）说不定有bug呢（自己玩一玩还是不错滴
