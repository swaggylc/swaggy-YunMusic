/**
 * 登陆流程
 * 1.收集表单项数据
 * 2.前端验证
 *    2.1验证用户信息（用户名、密码）是否合法
 *    2.2前端验证不通过则提示用户，不需要发请求给后端
 *    2.3前端验证通过，则发请求（携带账号、密码）给服务器端
 * 3.后端验证
 *    3.1验证用户是否存在
 *    3.2用户不存在则直接返回，提示前端用户不存在
 *    3.3用户存在，则验证密码是否正确
 *    3.4密码不正确则返回前端密码不正确
 *    3.5密码正确则提示登陆成功，返回用户数据信息
 */

import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    key: '',
    cookie: '',
    qrimg: '',
    code: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },
  // //表单项内容发生改变的回调
  // headleInput(event) {
  //   let type = event.currentTarget.id //type的取值是 phone 或 passward
  //   this.setData({
  //     [type]: event.detail.value
  //   })
  // },

  //登陆的回调
  async login() {

    // let {
    //   phone,
    //   passward
    // } = this.data
    // //前端验证、手机号验证
    // /**
    //  * 1.内容为空
    //  * 2.格式不正确
    //  * 3.格式正确，验证通过
    //  */
    // if (!phone) {
    //   wx.showToast({
    //     title: '手机号不能为空',
    //     icon: 'none'
    //   })
    //   return
    // }
    // //定义正则表达式
    // let phoneReg = /^1(3|4|5|6|7|8|9)\d{9}$/
    // if (!phoneReg.test(phone)) {
    //   wx.showToast({
    //     title: '手机号格式不正确',
    //     icon: 'none'
    //   })
    //   return
    // }
    // if (!passward) {
    //   wx.showToast({
    //     title: '密码不能为空',
    //     icon: 'none'
    //   })
    //   return
    // }

    //二维码验证
    //1.请求生成二维码的key
    let imgKey = await request('/login/qr/key', {})
    let rekey = imgKey.data.unikey
    console.log(rekey);
    this.setData({
      key: rekey,
      timestamp: Date.now()
    })

    //2.使用获得的key生成二维码(base64位格式)
    let imgBase64 = await request('/login/qr/create', {
      key: rekey,
      qrimg: true,
      timestamp: Date.now()
    })
    let qrimg = imgBase64.data.qrimg
    this.setData({
      qrimg: qrimg
    })



    var timesRun = 0;
    var interval = setInterval(() => {
      timesRun += 1;
      if (timesRun === 7) {
        clearInterval(interval);
      }


      //3. 二维码检测扫码状态
      let cook = request('/login/qr/check', {
        key: rekey,
        timestamp: Date.now()
      })

      console.log('这里是二维码的状态:', cook)

      cook.then((coded) => {
        let code = coded.code
        let cookied = coded.cookie





        if (code === 803) {

          wx.showToast({
            title: '登陆成功',
          })

          wx.setStorageSync('usercookie', cookied)


          //4.检测登陆状态,带cookie参数
          let state = request('/login/status', {
            cookie: cookied
          })




          //调用then()方法获得数据
          state.then((stated) => {
            console.log('这里是登陆状态数据：', stated)

            let id = stated.data.account.id
            console.log('这里是用户id值：', id);


            //5.获取用户的详细信息
            let userMsg = request('/user/detail', {
              uid: id
            })

            console.log('这是用户详细信息：', userMsg);

            userMsg.then((userMsged) => {
              userMsg.profile = userMsged.profile;

              //将用户信息储存到本地
              wx.setStorageSync('userinfo', userMsg.profile)

              //跳转至个人中心personal页面，强制个人中心页面重新加载来获得个人数据
              wx.reLaunch({
                url: '/pages/personal/personal',
              })



            })











            clearInterval(interval);








          })









        } else if (code === 800) {
          wx.showToast({
            title: '二维码过期',
            icon: 'none'
          })
        } else if (code === 801) {
          wx.showToast({
            title: '等待扫码',
            icon: 'none'
          })
        } else if (code === 802) {
          wx.showToast({
            title: '请确认登陆',
            icon: 'none'
          })
        } else {
          wx.showToast({
            title: '未知错误',
            icon: 'none'
          })
        }


      })


    }, 5000);

























    //   //后端验证
    //   let result = await request('/login/cellphone', {
    //     phone,
    //     passward
    //   })
    //   if (result.code === 200) {
    //     wx.showToast({
    //       title: '登陆成功',
    //     })







    //   } else if (result.code === 400) {
    //     wx.showToast({
    //       title: '手机号错误',
    //       icon: 'none'
    //     })
    //   } else if (result.code === 502) {
    //     wx.showToast({
    //       title: '密码错误',
    //       icon: 'none'
    //     })
    //   } else {
    //     wx.showToast({
    //       title: '登陆失败，未知错误！',
    //       icon: 'none'
    //     })
    //   }
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