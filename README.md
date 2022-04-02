## 简介

wechaty微信机器人聊天消息备份到维表格vika插件

依赖wechaty <= v0.6.9

## 快速入门

1. 到维格表官网（https://vika.cn/) 注册维格表账号

2. 创建一个名字为 mp-chatbot 的空间

3. 获取维格表token

![vika](./doc/images/vika_token.png)

4. 在examples/ding-dong-bot.js中配置，示例中使用了padlocal，可以自行更换为其他puppet

5. 运行node examples/ding-dong-bot.js

> 首次运行时，会自动在 mp-chatbot 空间创建四张表group、material、bot、ChatRecord，但是实际只有ChatRecord会被用到

![vika](./doc/images/vika.png)

## NPM方式安装

该插件已发布为npm包

安装:

```
npm install wechaty-vika-link@latest

```

使用demo参考 examples/ripe-npm.js

## 效果展示

![vika](./doc/images/demo.png)
