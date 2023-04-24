//发送ajax请求
/**
 * 1.封装功能函数
 *    1.功能点明确
 *    2.函数内部保留固定代码(静态的)
 *    3.将动态的数据抽取成形参，由使用者根据使用情况动态的传入实参
 *    4.一个良好的函数应设置形参的默认值(ES6的形参默认值)
 * 2.封装功能组件
 *    1.功能点明确
 *    2.组件内部保留固定代码(静态的)
 *    3.将动态的数据抽取成props参数，由使用者根据使用情况以标签形式动态传入props数据
 *    4.一个良好的组件应设置组件的必要性以及类型数据
 *    props:{
 *      msg:{
 *          required:ture,
 *          default:默认值,
 *          type:String
 *  }     
 * }
 * 
 */
import config from './config'

export default (url, data = {}, method = 'GET') => {
  return new Promise((resolve, reject) => {
    //1.new Promise初始化Promise实例的状态是Pending
    wx.request({
      url: config.host + url,
      data,
      method,
      success: (res) => {
        //console.log('请求成功：', res)
        resolve(res.data)  //resolve修改Promise状态为成功状态resolved
      },
      fail: (err) => {
        //console.log('请求失败：', err)
        reject(err)  //reject修改Promise状态为成功状态rejected
      }
    })
  })


}