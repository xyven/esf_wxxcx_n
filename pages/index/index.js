//index.js
//获取应用实例
const app = getApp()

// 引入 QCloud 小程序增强 SDK
//var qcloud = require('../../vendor/qcloud-weapp-client-sdk/index');

// 引入配置
var config = require('../../config');

Page({
  data: {    
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    lst: [],
    agentid:""
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  //点击头像
  onTapAgent:function(event){
    //console.log(event)
    var that = this;
    var idx = event.currentTarget.id;
    wx.redirectTo({
      url: '../agentshop/agentshop?id=' + that.data.lst[idx].id + '&name=' + that.data.lst[idx].name + '&telno=' + that.data.lst[idx].telno
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
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
            hasUserInfo: true
          })
        }
      })
    }
    var that = this;
    wx.request({
      url: config.service.getAgents,
      data: {},
      method:'POST',
      header:{
        'content-type':'application/x-www-form-urlencoded'
      },
      success:function(res){
        //console.log(res)
        that.setData({
            lst:res.data
            })
      },
      fail:function(){
        console.log("request fail!")
      }
    })
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
