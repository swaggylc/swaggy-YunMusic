import request from '../../utils/request'
let isSend = false //供函数节流使用
Page({

  /**
   * 页面的初始数据
   */
  data: {
    placeholderContent: '', //placeholder的内容
    hotList: [], //热搜榜数据
    searchContent: '', //用户输入的表单项数据
    searchList: [], //关键字模糊匹配的数据
    historyList: [] //存放历史搜索数据
  },
  // 获取初始化的数据（搜索）
  async getInitData() {
    let placeholderData = await request('/search/default')
    let hotListData = await request('/search/hot/detail')
    this.setData({
      placeholderContent: placeholderData.data.showKeyword,
      hotList: hotListData.data
    })
  },

  // 表单项内容发生改变的回调
  headleInputChange(event) {
    // 更新表单项的数据
    this.setData({
      searchContent: event.detail.value.trim()
    })
    if (isSend) {
      return
    }
    isSend = true
    this.getSearchList()
    // 函数节流
    setTimeout(() => {
      isSend = false
    }, 300);




  },

  // 获取搜索数据的功能函数
  async getSearchList() {
    if (!this.data.searchContent) {
      this.setData({
        searchList: []
      })
      return
    }

    let {
      searchContent,
      historyList
    } = this.data
    // 发请求获取关键字模糊匹配的数据
    let searchListData = await request('/cloudsearch', {
      keywords: this.data.searchContent,
      limit: 10
    })
    this.setData({
      searchList: searchListData.result.songs
    })

    // 将搜索的关键字添加到搜索历史记录中
    if (historyList.indexOf(searchContent) !== -1) {
      historyList.splice(historyList.indexOf(searchContent), 1)
    }
    historyList.unshift(searchContent)
    this.setData({
      historyList
    })

    wx.setStorageSync('search', historyList)
  },

  // 获取本地搜索记录的功能函数
  getSearchHistory() {
    let historyList = wx.getStorageSync('search')
    if (historyList) {
      this.setData({
        historyList
      })
    }
  },

  // 清空搜索栏的功能函数
  clearSearchContent() {
    this.setData({
      searchContent: '',
      searchList: []
    })
  },

  // 删除搜索历史记录的功能函数
  deleteSearchHistory() {
    // 清空data中的historyList
    this.setData({
      historyList: []
    })
    // 移除本地储存中的历史记录
    wx.removeStorageSync('search')
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getInitData()
    // 获取本地的搜索历史记录
    this.getSearchHistory()
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