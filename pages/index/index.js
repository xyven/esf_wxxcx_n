//index.js
//获取应用实例
const app = getApp()

// 引入 QCloud 小程序增强 SDK
var qcloud = require('../../vendor/qcloud-weapp-client-sdk/index');

// 引入配置
var config = require('../../config');

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    lst: [],
    agentid:"",
    lstofnews:[],
    maincontant:'agents'
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },

  getnewhouses:function(){
    var that=this;
    wx.request({
      url: config.service.getallhouses + '/getnewhouses',
      data: {},
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res);
        that.setData({
          lstofnews: res.data,
          maincontant: 'newhouses'
        })
      },
      fail: function () {
        console.log("request fail!")
      }
    })
  },

  getagentlist:function(){
    var that=this;
    if(that.data.lst.length>0)
    {
      that.setData({
        maincontant: 'agents'
      })
    }
    else
    {
      that.onLoad();
    }
  },


  //点击列表进入微门店
  onTapAgent:function(event){
    //console.log(event)
    var that = this;
    var idx = event.currentTarget.id;
    wx.navigateTo({
      url: '../agentshop/agentshop?id=' + that.data.lst[idx].id
    });
    console.log('nt-shop');
  },
  onLoad: function () {    
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

  onShareAppMessage: function () {
    var that = this;
    return {
      title: '房天下二手房合作中介微门店',
      path: 'pages/index/index',
      imageUrl: '../icon/mainqrcode.jpg',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  
  getUserInfo: function(e) {
    //console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  toperson: function (e) {
    var that = this;
    wx.navigateTo({
      url: '../person/person'
    })
  }  
})
