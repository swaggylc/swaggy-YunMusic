let startY = 0 //手指开始的坐标
let moveY = 0 //手指移动后的坐标
let moveDistance = 0 //手指移动的距离

import request from '../../utils/request'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    coverTransform: 'translateY(0)', //加载时回到原位置
    coverTransition: '', //下拉的数据
    userinfo: {}, //用户信息
    recentPlayList: [] //用户的播放记录
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    //注意：实例生命周期上最好不要用async，否则页面加载可能会出现问题

    //读取用户的基本信息
    let userinfo = wx.getStorageSync('userinfo')
    if (userinfo) {
      //更新userinfo的状态
      this.setData({
        userinfo: userinfo
      })
      //获取用户的播放记录
      this.getUserRecentPlayList(this.data.userinfo.userId)
    }
  },
  //获取用户播放记录的功能函数
  async getUserRecentPlayList(userId) {
    //请求用户播放记录
    let recentPlayListData = await request('/user/record', {
      uid: userId,
      type: 1,
      timestamp:Date.now()
    })
    let index=0
    let recentPlayList=recentPlayListData.weekData.splice(0,10).map(item=>{
      item.id=index++
      return item
    })
    this.setData({
      recentPlayList:recentPlayList
    })


  },




  headerTouchStart(event) {
    this.setData({
      coverTransform: `translateY(0rpx)`,
      coverTransition: ''
    })
    //获取手指的起始坐标
    startY = event.touches[0].clientY
  },
  headerTouchMove(event) {
    moveY = event.touches[0].clientY
    moveDistance = moveY - startY
    if (moveDistance < 0) {
      return
    }
    if (moveDistance > 80) {
      moveDistance = 80
    }
    //动态更新coverTransform的状态值
    this.setData({
      coverTransform: `translateY(${moveDistance}rpx)`
    })
  },
  headerTouchEnd() {
    this.setData({
      coverTransform: `translateY(0rpx)`,
      coverTransition: 'transform 0.5s linear'
    })
  },
  //跳转到登陆页面
  toLogin() {
    wx.navigateTo({
      url: '/pages/login/login',
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})