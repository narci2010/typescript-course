# typescript 系统知识

Reflect Metadata
Reflect Metadata 是 ES7 的一个提案，它主要用来在声明的时候添加和读取元数据。TypeScript 在 1.5+ 的版本已经支持它，你只需要：

npm i reflect-metadata --save

Module not found: Error: Can't resolve 'style-loader'
npm i style-loader css-loader -D

在 typescript 中导入第三方类库 import 报错
因为第三方类库并没有 ts 的声明文件，查阅网上资料，有 typings 和@types 两种声明方式，typings 使用起来很繁琐就不再考虑了。我们就采用 ts2.0 以后支持的@types。

相关的类库 types 支持可以在 typesearch 上查询。

解决方案
在 lodash 安装的前提下再增加安装@types 的 npm modules 即可

npm install --save @types/lodash
