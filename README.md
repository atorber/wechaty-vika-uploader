## 简介

wechaty+vika+mqtt聊天机器人无服务架构方案

wechaty <= v0.6.9

## 操作步骤

1. 注册维格表，创建mp-chatbot空间
2. 导入初始化表格，将database目录下的四个表格导入到该空间
3. 配置bot表下的secret行的value，内容如下（使用自己的mqtt配置和维格表token替换对应字段，mqtt推荐使用百度云物联网核心套件）：

```
{"mqtt":{"DeviceKey":"7813159edb154cb1a5c7cca80b82509f","host":"baiduiot.iot.gz.baidubce.com","password":"","port":443,"username":"alvxdkj/mpclient"},"vika":{"host":"https://api.airtable.com","token":""}}
```

5. 获取维格表token，替换index.js中vika_token
6. 运行node index.js
