//app.js
var config = require('./config');
var qcloud = require('./vendor/qcloud-weapp-client-sdk/index');

App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    qcloud.setLoginUrl(config.service.loginUrl); //设置客户端登录地址
    // 登录
    var that = this;
    wx.login({
      success: res => {
        // 登录成功 获取用户信息 并存入全局变量
        console.log(res)
        that.globalData.code = res.code
        that.globalData.islogin = true
        wx.getUserInfo({
          success: function (res) {
            that.globalData.userInfo = res.userInfo;
            console.log(res.userInfo);
          }
        })        
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              console.log(res)
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    code:null,
    islogin: false
  }
})