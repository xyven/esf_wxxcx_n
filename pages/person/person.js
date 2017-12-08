// pages/person/person.js
//获取应用实例
const app = getApp()
var config = require('../../config');


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
    sendenable:true,
    isbindagent:false
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
      //判断是否绑定
      var that = this;
      wx.request({
        url: config.service.bindagnet + 'check',
        data: {
          'wxcode': that.data.code,
        },
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          if(res.data!='')
          that.setData({
            isbindagent:true                                                                                          
          })
        }
      })
    },

  tobindagent:function(e){
    console.log('bindagent');
    var that = this;
    that.setData({
      dobindagent:true
    })
  },

  bindagent:function(e){    
    var that=this;
    wx.request({
      url: config.service.bindagnet,
      data: {
        'agentid': e.detail.value['agentid'],
        'name': e.detail.value['name'],
        'telno': e.detail.value['telno'],
        'code': e.detail.value['code'],
        'wxcode': that.data.code,
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if (res.statusCode == 200) {
          wx.showToast({
            title: '绑定成功',
            icon: 'success',
            duration: 2000
          })
          that.setData({
            dobindagent:false
          })
        }
      }
    })
  },

  nobind:function(e){
    var that = this;
    that.setData({
      dobindagent:false
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