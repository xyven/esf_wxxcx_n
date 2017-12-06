// pages/person/person.js
//获取应用实例
const app = getApp()
var config = require('../../config');

//倒计时
var maxTime = 60
var currentTime = maxTime //倒计时的事件（单位：s）  
var interval = null
var hintMsg = null // 提示  

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:null,
    code:null,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    lstofhouse:[],
    histories:[],
    dobindagent:false,
    time: currentTime,
    sendenable:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      var that = this;
      if(app.globalData.userInfo){
        that.setData({
          userInfo: app.globalData.userInfo,
          code:app.globalData.code,
          hasUserInfo: true
        })
        console.log(that.data.userInfo)
      } else if (this.data.canIUse) {
        // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
        // 所以此处加入 callback 以防止这种情况
        app.userInfoReadyCallback = res => {
          this.setData({
            userInfo: res.userInfo,
            code: app.globalData.code,
            hasUserInfo: true
          })
        }
      } else {
        // 在没有 open-type=getUserInfo 版本的兼容处理
        wx.getUserInfo({
          success: res => {
            app.globalData.userInfo = res.userInfo
            this.setData({
              userInfo: res.userInfo,
              code: app.globalData.code,
              hasUserInfo: true
            })
          }
        })
      }

  },

  bindagent:function(e){
    console.log('bindagent');
    var that = this;
    that.setData({
      dobindagent:true
    })
  },

  sendPhoneNum:function(e){
    console.log(e);
    var that = this;
    interval = setInterval(function () {
      currentTime--;
      that.setData({
        time: currentTime,
        sendenable:false
      })

      if (currentTime <= 0) {
        clearInterval(interval)
        currentTime = maxTime
        that.setData({
          time: currentTime,
          sendenable: true
        })
      }
    }, 1000);
    //将手机号码发送的服务器
    wx.request({
      url: config.service.telcheck,
      data: { 'code': this.data.code, 'tel': e.detail.value.tel },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if (res.statusCode == 200) {
          callback(res);
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})