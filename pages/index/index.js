
import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bannerList: [], //轮播图数据
    recommendList: [], //推荐歌单数据
    topList: [], //排行榜数据
  },
  intoRecommendSong(){
    wx.navigateTo({
      url: '/pages/recommendSong/recommendSong',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    let bannerListData = await request('/banner', {
      type: 2
    });
    //console.log('结果数据：',result)
    this.setData({
      bannerList: bannerListData.banners
    })

    //获取推荐歌单的数据
    let recommendListData = await request('/personalized', {
      limit: 15
    });
    this.setData({
      recommendList: recommendListData.result
    })

    //获取排行榜数据
    /**
     * 需求分析：
     *    1.需要根据idx的值来获得相应的数据
     *    2.dix的取值范围是0-20，我们只需要0-4
     *    3.所以需要发送5次请求
     * 前++和后++的区别：
     *    1.先看到运算符还是值
     *    2.先看到运算符则先运算后赋值
     *    3.先看到值则先赋值后运算
     */
    let index = 0;
    let i=0;

    let resultArr = [];
    let idArr=[19723756,60198,3778678,3779629,2884035]
    while (i < 5) {
      let topListData = await request('/playlist/detail', {
        id: idArr[i++]
      });
      // splice(会修改原数组，可以对指定的数组进行增删改) slice(不会修改原数组)
      let topListItem = {
        name: topListData.playlist.name,
        tracks: topListData.playlist.tracks.slice(0, 3)
      };
      resultArr.push(topListItem);
      // 不需要等待五次请求全部结束才更新，用户体验较好，但是渲染次数会多一些
      this.setData({
        topList: resultArr
      })
    }


    //更新topList的状态值,放在此处更新会导致发送请求的过程中长时间白屏，用户体验差

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