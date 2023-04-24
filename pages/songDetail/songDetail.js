import PubSub from 'pubsub-js'
import request from '../../utils/request'
import moment from 'moment'

const appInstance = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPlay: false, //音乐是否播放
    musicId: '', //音乐的id
    musicDetail: [], //音乐的详细信息
    musicUrl: '', //音乐的播放地址
    currentTime: '00:00', //音乐的实时时间
    allTime: '00:00', //音乐的总时间
    currentWidth: 0 //实时进度条的宽度
  },
  //点击播放/暂停的回调
  headleMusicPlay() {
    let isPlay = !this.data.isPlay
    //修改是否播放的状态
    // this.setData({
    //   isPlay
    // })
    let {
      musicId,
      musicUrl
    } = this.data
    this.musicControl(isPlay, musicId, musicUrl)
  },

  //控制音乐播放/暂停的功能函数
  async musicControl(isPlay, musicid, musicLink) {
    if (isPlay) {
      // 让歌曲播放
      if (!musicLink) {
        //获取音乐的播放链接
        let musicUrlData = await request('/song/url/v1', {
          id: musicid,
          level: "exhigh"
        })
        let url = musicUrlData.data[0].url

        this.setData({
          musicUrl: url
        })
      }

      // this.setData({
      //   musicUrl:url
      // })

      this.backgroundMusic.src = this.data.musicUrl
      this.backgroundMusic.title = this.data.musicDetail[0].name

    } else {
      // 让歌曲暂停
      this.backgroundMusic.pause()
    }
  },

  //获取音乐的详细信息
  async getSongDetail(musicId) {
    let songData = await request('/song/detail', {
      ids: musicId
    })
    // 获取歌曲时长
    let time = moment(songData.songs[0].dt).format('mm:ss')
    this.setData({
      allTime: time,
      musicDetail: songData.songs
    })
  },

  //修改播放状态的功能函数
  changeIsPlay(isPlay) {
    this.setData({
      isPlay
    })
    //修改全局音乐播放的状态
    appInstance.globalData.isMusicPlay = isPlay
  },

  //点击切歌的回调（上/下一曲）
  handleSwitch(event) {
    //获取切歌的类型
    let type = event.currentTarget.id
    // 关闭当前的音乐
    this.backgroundMusic.stop()

    //订阅来自recommendSong页面发布的musicId消息
    PubSub.subscribe('musicId', (msg, musicId) => {
      // console.log(musicId);
      // 获取音乐的详细信息
      this.setData({
        musicId
      })
      this.getSongDetail(musicId)
      //自动播放音乐
      this.musicControl(true, musicId)

      //取消订阅
      PubSub.unsubscribe('musicId')
    })





    //发布数据消息给recommendSong页面
    PubSub.publish('switchType', type)

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    //options专门用来接收路由跳转的query参数
    //原生小程序中路由传参，对参数的长度有限制，如果参数长度过长会被自动截取
    let musicId = options.musicId
    this.setData({
      musicId
    })
    this.getSongDetail(musicId)

    //创建控制音乐播放的实例
    this.backgroundMusic = wx.getBackgroundAudioManager()

    /**
     * 问题:  当用户通过系统栏来操作音乐的播放与停止时，
     * 页面的状态不会因此而改变，导致页面状态与实际播放效果不一致
     * 解决： 
     * 1.通过音频实例去监视音乐的播放与暂停
     * 
     */
    //判断当前的页面音乐是否在播放
    if (appInstance.globalData.isMusicPlay && appInstance.globalData.musicId === musicId) {
      // 修改音乐的播放状态
      this.setData({
        isPlay: true
      })
    }

    //监视音乐播放/暂停/停止
    this.backgroundMusic.onPlay(() => {
      // 修改音乐是否播放的状态
      this.changeIsPlay(true)
      appInstance.globalData.musicId = musicId
    })
    this.backgroundMusic.onPause(() => {
      this.changeIsPlay(false)
    })
    this.backgroundMusic.onStop(() => {
      this.changeIsPlay(false)
    })


    // 监听音乐播放自然结束
    this.backgroundMusic.onEnded(()=>{
      // 自动切换至下一首并自动播放
      PubSub.publish('switchType', 'next')
      // 实施进度条变为0
      this.setData({
        currentWidth:0,
        currentTime: '00:00'
      })
    })






    // 监听音乐实时播放的进度
    this.backgroundMusic.onTimeUpdate(() => {
      let currentTime = moment(this.backgroundMusic.currentTime * 1000).format('mm:ss')

      let currentWidth = this.backgroundMusic.currentTime / this.backgroundMusic.duration * 450

      this.setData({
        currentTime,
        currentWidth
      })
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