# 抗议专版，助力抗议信息收集统计

## 简介

使用wechaty机器人+维格表 收集防疫群统计信息，可运行与任何windows环境，登陆个人wechat账号和维格表账号


## 快速入门

1. 到 [维格表官网](https://vika.cn/) 注册维格表账号

2. 创建一个名字为 mp-chatbot 的空间

3. 获取维格表token

![vika](./doc/images/vika_token.png)

4. 替换ding-dong-bot.ts文件中的vika-token

5. 运行 

```
npm run start
```

## 效果展示

### 抗原检测截图收集

![image](https://user-images.githubusercontent.com/19552906/164364958-5cd6dc49-9966-4987-a36b-fd8e416caab9.png)

### 打卡签到统计

![image](https://user-images.githubusercontent.com/19552906/164365509-39655e25-def2-4721-8cfb-395b3a84dafb.png)

### 楼栋统计

![image](https://user-images.githubusercontent.com/19552906/164365570-062eca07-2b91-468b-8a95-b8eb872c62c3.png)

### 更多报表

只需要在vika里创建相应的视图，设置筛选条件即可输出新的报表，可以根据统计需求自行设计

![image](https://user-images.githubusercontent.com/19552906/164367464-71759603-b976-4cdc-9d29-5735ba378979.png)

