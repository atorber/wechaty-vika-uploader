## 简介

wechaty微信机器人聊天消息备份到维表格vika插件

依赖wechaty <= v0.6.9

## 快速入门

1. 到 [维格表官网](https://vika.cn/) 注册维格表账号

2. 创建一个名字为 mp-chatbot 的空间

3. 获取维格表token

![vika](./doc/images/vika_token.png)

4. 运行如下命令配置环境变量，示例中使用了padlocal，可以自行更换为其他puppet，可以在 [padlocal官网](http://pad-local.com/#/login) 申请7天免费token

```
export WECHATY_PUPPET=wechaty-puppet-padlocal
export WECHATY_PUPPET_PADLOCAL_TOKEN="替换为padloac token"
export VIKA_TOKEN="替换为维格表token"
```
> 当前版本需要在主程序文件相同目录下新建一个folder文件夹用于存放文件缓存

5. 运行 

```
npm run ding-dong-bot
```

> 首次运行时，会自动在 mp-chatbot 空间默认创建一个名为ChatRecord的表，如果有多个bot也可以使用环境变量指定表名称（只有一个bot时建议不指定）

```
export VIKA_DATASHEETNAME="替换为维格表名称"
```

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

## 版本

v0.17.0

1. 变更表字段名称为英文命名方式
