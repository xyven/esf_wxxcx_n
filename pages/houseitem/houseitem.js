const app = getApp()
var config = require('../../config');
var util = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    item:{},
    pic:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    console.log(options);
    that.setData({
      item: options,
      pic:options.pic.split(',')
    })
    //上报足迹
    wx.login({
      success:function(res){
        wx.request({
          url: config.service.bindagnet + 'updatefootprint',
          data: { 'wxcode': res.code, 'houseid': that.data.item.id, 'agentid': that.data.item.agentid },
          method: 'POST',
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          success: function (res) {
            console.log(res);
          }
        })
      }
    })        
    console.log(app.globalData.userInfo);
  },

  toback:function(){
    wx.navigateBack({      
    });
  },

  toindex: function () {
    var that = this;
    wx.reLaunch({
      url: '../index/index',
    });
    console.log('rt-index');
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var that=this;
    console.log(this.data.item);
    return {
      title: this.data.item.estate + '|'+this.data.item.area+ '|' + this.data.item.struct +'|'+ this.data.item.totalprice +'|' + this.data.item.unitprice + '|' + this.data.item.fitment+this.data.item.title,
      path: 'pages/houseitem/houseitem?' + util.parseParam(this.data.item),
      imageUrl: that.data.pic[0],
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },

  connectagent:function(e){
    var that=this;
    wx.showModal({
      title:'提示',
      content: '确定拨打中介电话:' + this.data.item.agentphone,
      success: function (res) {
        console.log(res);
        if (res.confirm) {
          wx.makePhoneCall({
            phoneNumber: that.data.item.agentphone
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })    
  },

  lookmore:function(e){ 
    var that = this;
    wx.redirectTo({
      url: '../agentshop/agentshop?id=' + that.data.item.agentid
    });
  },

  toperson: function (e) {
    var that = this;
    wx.navigateTo({
      url: '../person/person'
    })
  },

  toagentshop:function(){
    var that=this;
    wx.reLaunch({
      url: '../agentshop/agentshop?id=' + that.data.item.agentid
    })
  } 
})