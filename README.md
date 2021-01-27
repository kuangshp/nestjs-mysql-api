## 一、项目介绍

* 1、采用`java`的`MVC`的经典开发模型(在`nestjs`开发中也可以使用基于`angular`方式的模块化开发模式,看个人喜好),来构建项目结构,也符合后端企业开发的需求。
* 2、项目是基于`mysql`数据库开发的
* 3、使用`jwt`的方式进行登录鉴权(颗粒度仅到菜单权限)

## 二、使用项目

* 1、本项目仅仅是实现了`rbac`的权限系统,对于其他的功能需要自己基于这个基础上去扩展
* 2、先在本地创建数据库
* 3、在项目的根目录的`.env`文件修改为你自己的数据库基本配置(地址、用户名、密码、数据库)
* 4、启动项目

  ```shell
  npm run start:dev
  ```

* 5、运行第五步的时候会默认初始化菜单数据和用户数据(账号:`admin`,密码:123456)
* 6、如果你想初始化别的数据,可以在`src/services/init-db`中写上你要初始化的数据

## 二、主要实现功能

- [x] 实现用户的登录、`jwt`鉴权

- [x] 如果你是要将已有的项目改造成新的项目(基于已经有数据表的时候),可以尝试使用命令
  ```shell
  # 会将数据库文件映射生成typeORM的实体类
  npm run db1
  ```

- [x] 基于`RBAC`实现权限控制

  项目中采用基于账号的方式来替换用户的,(对一个用户可能有几个账号的情况下的扩展),所以拿到项目后，一般流程是
  * 先创建用户
  * 创建账号的时候关联对应的用户

  ![](https://shuiping.oss-cn-shenzhen.aliyuncs.com/nest-mysql-api/access.png)

- [x] 采用创建账号的时候可以选择该账号对应的角色
  ![](https://shuiping.oss-cn-shenzhen.aliyuncs.com/nest-mysql-api/account.png)

- [x] 创建角色的时候权限列表采用树机构展示出来,可以选择对应的权限
  ![](https://shuiping.oss-cn-shenzhen.aliyuncs.com/nest-mysql-api/role.png)

- [x] 字典管理主要是用于项目中配置下拉框使用的

- [x] 集成`swagger`文档

  ```shell
  localhost:7000/api/v1/docs
  # 端口号根据.env文件的PORT=7000	来写
  ```

- [x] 在`module`中统一封装了几个模块
  * `code`是验证码模块
  * `file`是文件模块
    * `upload-img`图片上传，可以上传到本地和阿里云`oss`上
    * `upload-excel`导入`excel`文件
  * `redis-utils`封装了几个关于`redis`的模块
  * `yunpian-sms`是云片网发送手机短信的

- [x] `ecosystem.config.js`是采用`PM2`的配置文件,项目开发完后直接运行命令一键部署

  ```shell
  npm run build
  # 开发环境
  npm run pm2:dev
  # 生产环境
  npm run pm2:prod
  ```

- [x] 日志系统没有开发,直接使用`PM2`查看日志

  ```shell
  pm2 log
  ```

- [x] 如果你的想做日志收集可以继承`Kafka`

## 三、技术解答

> 本项目还在持续集成新功能进来,最后会加上前端做一个`cms`系统的`api`,后期会拉分支使用`graphql`提供`api`

- 1、有关于`nestjs`的技术问题或索要关于`nestjs`的电子书可以直接加我微信(微信号:332904234)<font color="#f00">备注:nest 开发</font>

  <img src="https://shuiping.oss-cn-shenzhen.aliyuncs.com/nest-mysql-api/wx.jpg" width="200" height="220" style="margin-left:0" />

- 2、如果你觉得本项目对你帮助很大,**给一个赞**
