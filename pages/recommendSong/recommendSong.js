import PubSub from 'pubsub-js'
import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    month: '',
    day: '',
    dailySongsList: [], //每日推荐歌曲列表
    index: 0 //点击音乐的下标
  },

  async getRecommendSongList() {
    let usercookie = wx.getStorageSync('usercookie')
    let RecommendSongListData = await request('/recommend/songs', {
      cookie: usercookie
    })
    let dailySongsList = RecommendSongListData.data.dailySongs
    this.setData({
      dailySongsList
    })


  },

  //跳转至SongDetail页面
  toSongDetail(event) {
    //解构赋值
    let {
      song,
      index
    } = event.currentTarget.dataset
    this.setData({
      index
    })

    //路由跳转传参：query参数
    //不能将song对象直接作为参数传递，长度过长会被自动截取
    wx.navigateTo({
      url: '/pages/songDetail/songDetail?musicId=' + song.id,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 判断用户是否登录
    let userInfo = wx.getStorageSync('userinfo')
    if (!userInfo) {
      wx.showToast({
        title: '请先登录',
        icon: 'none',
        success: () => {
          // 跳转至登陆界面
          wx.reLaunch({
            url: '/pages/login/login',
          })
        }
      })
    }


    // 获取当前的月份和日期
    this.setData({
      day: new Date().getDate(),
      month: new Date().getMonth() + 1
    })
    //获取每日推荐的数据
    this.getRecommendSongList()

    //订阅来自songDetail页面发布的消息
    PubSub.subscribe('switchType', (msg, type) => {
      let {
        dailySongsList,
        index
      } = this.data
      if (type === 'pre') {
        //上一首
        (index === 0) && (index = dailySongsList.length)
        index -= 1
      } else {
        //下一首
        (index === dailySongsList.length - 1) && (index = -1)
        index += 1
      }
      //更新下标
      this.setData({
        index
      })
      // console.log(dailySongsList[index].id);
      let musicId = dailySongsList[index].id
      //将musicId回传给songDetail页面
      PubSub.publish('musicId', musicId)
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