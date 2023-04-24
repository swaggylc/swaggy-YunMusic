import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoGroupList: [], //导航标签数据
    navId: '', //导航的点击标识
    videoList: [], //视频的列表数据
    videoId: '', //视频的id标识
    videoUpdataTime: [], //视频播放的时长
    isTriggered: false, //标识下拉刷新是否被触发
    count: '' //视频列表下拉触底偏移
  },
  //获取导航的标签的数据
  async getVideoGroupListData() {
    let VideoGroupListData = await request('/video/group/list', {})
    this.setData({
      videoGroupList: VideoGroupListData.data.slice(0, 14),
      navId: VideoGroupListData.data[0].id
    })
    //获取视频列表数据
    this.getVideoList(this.data.navId)

  },
  //获取标签的列表视频数据
  async getVideoList(navId) {
    let usercookied = wx.getStorageSync('usercookie')
    let videoListData = await request('/video/group', {
      id: navId,
      cookie: usercookied
    })

    //关闭微信消息提示框
    wx.hideLoading()




    let index = 0
    let videoList = videoListData.datas.map((item) => {
      item.id = index++
      return item
    })

    this.setData({
      videoList,
      isTriggered: false //关闭下拉刷新
    })
    //获取标签列表视频的地址
    this.getVideoUrl(videoList)
  },

  //获取标签列表视频的地址
  async getVideoUrl(videoList) {
    let resultArr = []

    for (let i = 0; i < videoList.length; i++) {
      let videoUrlData = await request('/video/url', {
        id: videoList[i].data.vid
      })
      videoList[i].url = videoUrlData.urls[0].url
    }
    this.setData({
      videoList: videoList
    })
  },









  //点击切换导航的回调
  navChange(event) {
    // let navId = event.currentTarget.id
    let navId = event.currentTarget.dataset.id
    this.setData({
      navId: navId,
      videoList: []
    })
    //显示正在加载
    wx.showLoading({
      title: '正在努力加载中...'
    })
    //动态获取当前导航对应的视频数据
    this.getVideoList(this.data.navId)
  },

  //点击播放/继续播放的回调
  handlePlay(event) {
    /** 
     * 问题：多个视频可以同时播放
     * 需求：
     * 1.在点击播放的事件中找到上一个播放的视频
     * 2.在播放新的视频之前关闭上一个视频
     * 关键：
     * 1.如何找到上一个视频的实例对象
     * 2.如何确认点击播放的视频和上一个视频不是同一个视频
     * 单例模式：
     * 1.需要创建多个对象的场景下，通过一个变量接收，始终保持只有一个对象
     * 2.节省内存空间
     */

    let vid = event.currentTarget.id
    //关闭上一个播放的视频
    // this.vid !== vid && this.videoContext && this.videoContext.stop()
    // this.vid = vid
    //更新data中videoId的状态数据
    this.setData({
      videoId: vid
    })
    //创建控制video标签的实例对象
    this.videoContext = wx.createVideoContext(vid)
    //判断当前的视频是否有播放记录，若有则跳转至指定的播放位置
    let {
      videoUpdataTime
    } = this.data
    let videoItem = videoUpdataTime.find(item => item.vid === vid)
    if (videoItem) {
      this.videoContext.seek(videoItem.currentTime)
    }
    this.videoContext.play()
  },

  //监听视频播放进度的回调
  headleTimeUpdata(event) {
    let videoTimeObj = {
      vid: event.currentTarget.id,
      currentTime: event.detail.currentTime
    }
    let {
      videoUpdataTime
    } = this.data
    /**
     * 思路：判断记录播放时长的数组中videoUpdataTime是否有当前视频的播放记录
     * 1.如果有，在原有的播放记录中修改播放时间为当前的播放时间
     * 2.如果没有，需要在数组中添加当前播放的视频对象
     */
    let videoItem = videoUpdataTime.find(item => item.vid === videoTimeObj.vid)
    if (videoItem) { //之前有该视频对象
      videoItem.currentTime = event.detail.currentTime
    } else { //之前没有
      videoUpdataTime.push(videoTimeObj)
    }
    //更新videoUpdataTime的状态
    this.setData({
      videoUpdataTime
    })
  },

  //视频结束的回调
  headleEnd(event) {
    //移除播放记录数组中当前视频的对象
    let {
      videoUpdataTime
    } = this.data
    let index = videoUpdataTime.findIndex(item => item.vid === event.currentTarget.id)
    videoUpdataTime.splice(index, 1)
    this.setData({
      videoUpdataTime
    })
  },

  //自定义下拉刷新的回调,针对scroll-view
  headleRefresher() {
    // 再次发请求，获取最新的视频列表数据
    this.getVideoList(this.data.navId)
  },

  //自定义上拉触底的回调,针对scroll-view

  async headleToLower(navId, count = 1) {
    /**数据分页效果：
     * 1.后端分页
     * 2.前端分页
     * 
     *  */
    if (this.data.count) {
      count = this.data.count
    }

    let usercookied = wx.getStorageSync('usercookie')
    navId = this.data.navId
    // console.log(navId, 'navid');
    // console.log(usercookied, 'usercookied');
    let newVideoList = await request('/video/group', {
      id: navId,
      cookie: usercookied,
      offset: 8 * count
    })
    count = ++count
    // console.log(newVideoList);
    let videoList = this.data.videoList
    let newVideo = newVideoList.datas
    //将视频的最新数据更新到视频列表中
    // console.log(newVideo);
    videoList.push(...newVideo)
    this.setData({
      videoList,
      count
    })


  },

  // 切换至搜索页面
  toSearch(){
    wx.navigateTo({
      url: '/pages/search/search',
    })
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    //获取导航的标签的数据
    this.getVideoGroupListData()

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