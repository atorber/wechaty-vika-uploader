## 简介

wechaty+vika聊天消息备份插件

wechaty <= v0.6.9

## 快速入门

1. 到维格表官网（https://vika.cn/) 注册维格表账号
2. 创建一个名字为 mp-chatbot 的空间，导入初始化表格，将本项目 database 目录下的四个表格导入到该空间

![vika](./doc/images/vika.png)

3. 获取维格表token

![vika](./doc/images/vika_token.png)

4. 在examples/ding-dong-bot.js中配置，示例中使用了padlocal，可以自行更换为其他puppet

5. 运行node examples/ding-dong-bot.js

## NPM方式安装

该插件已发布为npm包，运行 npm install wechaty-vika-link 安装，使用demo参考 examples/ripe-npm.js

## 效果展示

![vika](./doc/images/demo.png)
