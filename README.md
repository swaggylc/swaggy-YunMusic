# swaggy-YunMusic
#一个听音乐的小程序，需使用node.js作为后端服务器，使用最新网易云node版即可
# 小程序相关

## 1.  数据绑定

1. 小程序
    1. data中初始化数据
    2. 修改数据： this.setData()
        1. 修改数据的行为始终是同步的
    3. 数据流： 
        1. 单项： Model ---> View
2. Vue
    1. data中初始化数据
    2. 修改数据: this.key = value
    3. 数据流： 
        1. Vue是单项数据流： Model ---> View
        2. Vue中实现了双向数据绑定： v-model
3. React
    1. state中初始化状态数据
    2. 修改数据: this.setState()
        1. 自身钩子函数中(componentDidMount)异步的
        2. 非自身的钩子函数中(定时器的回调)同步的
    3. 数据流： 
        1. 单项： Model ---> View

## 2. 获取用户基本信息

1. 用户未授权(首次登陆)

    1.button open-type=‘getUserInfo’

2. 用户已经授权(再次登陆)

    1.wx.getUserInfo

    *注意：wx.getUserProfile(Object object)，该接口用于替换 `wx.getUserInfo`*

## 3. 前后端交互

1. 语法: wx.request()

2. 注意点: 

    1. 协议必须是https协议

    2. 一个接口最多配置20个域名

    3. 并发限制上限是10个

    4. **开发过程中设置不校验合法域名**： 开发工具 ---> 右上角详情 ----> 本地设置 ---> 不校验

    5. 封装request请求方法。好处：

        1.功能点明确

         2.函数内部保留固定代码(静态的)

         3.将动态的数据抽取成形参，由使用者根据使用情况动态的传入实参

         4.一个良好的函数应设置形参的默认值(ES6的形参默认值)



## 4. 本地存储

1. 语法: wx.setStorage() || wx.setStorageSync() || .....
2. 注意点： 
    1. 建议存储的数据为json对象数据，若服务器返回的数据为js对象数据，则需要转换为json对象数据才能进行存储，同理想使用js对象数据也需要转换回来。
    2. 单个 key 允许存储的最大数据长度为 1MB，所有数据存储上限为 10MB
    3. 属于永久存储，同H5的localStorage一样

## 5.Login页

### 5.1reLaunch路由跳转

​      //跳转至个人中心personal页面，强制个人中心页面重新加载来获得个人数据

​      wx.reLaunch({

​       url: '/pages/personal/personal',

​      })

实际并不会刷新页面，bug暂未解决              2023.3.4

## 6.视频页

### 6.1导航的回调

通过id向event传参时，如果传的是number类型，会自动将其转化为string类型

### 6.2搜索框(flex)的拉伸等属性

![image-20230308160133894](C:\Users\juhe\AppData\Roaming\Typora\typora-user-images\image-20230308160133894.png)

# 扩展内容

## 1. 事件流的三个阶段

1. 捕获: 从外向内
2. 执行目标阶段
3. 冒泡: 从内向外

## 2. 事件委托

1. 什么是事件委托
    1. 将子元素的事件委托(绑定)给父元素
2. 事件委托的好处
    1. 减少绑定的次数
    2. 后期新添加的元素也可以享用之前委托的事件
3. 事件委托的原理
    1. 冒泡
4. 触发事件的是谁
    1. 子元素
5. 如何找到触发事件的对象
    1. event.target
6. currentTarget VS target
    1. currentTarget要求绑定事件的元素一定是触发事件的元素
    2. target绑定事件的元素不一定是触发事件的元素

## 3. 定义事件相关

1. 分类
    1. 标准DOM事件
    2. 自定义事件
2. 标准DOM事件
    1. 举例： click，input。。。
    2. 事件名固定的，事件由浏览器触发
3. 自定义事件
    1. 绑定事件
        1. 事件名
        2. 事件的回调
        3. 订阅方: PubSub.subscribe(事件名，事件的回调)
        4. 订阅方式接受数据的一方
    2. 触发事件
        1. 事件名
        2. 提供事件参数对象， 等同于原生事件的event对象
        3. 发布方: PubSub.publish(事件名，提供的数据)
        4. 发布方是提供数据的一方































