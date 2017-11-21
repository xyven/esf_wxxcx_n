// pages/agentshop/agentshop.js
const App=getApp()
var config = require('../../config');
var parseParam = function (param, key) {
  var paramStr = "";
  if (param instanceof String || param instanceof Number || param instanceof Boolean)   {
    paramStr += "&" + key + "=" + encodeURIComponent(param);
  } else {
    for(var i in param){
      paramStr += '&' + i + "=" + param[i];
    };
  }
  return paramStr.substr(1);
};

Page({

  /**
   * 页面的初始数据
   */
  data: {
    agentid:'',
    agentname:'',
    agentphone:'',
    curpagename:'',
    lstforswiper:[],
    lstforlet:[],
    lstforrent:[],
    numoflet:0,
    numofrent:0,
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 1000,
    circular:true,
    toview:'htl_title'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    console.log(options);
    wx.setNavigationBarTitle({
      title: '房天下合作经纪人：'+ options.name,
    })
    wx.request({
      url: config.service.getallhouses,
      data: { 'agentid': options.id }, //options.id  ym19870817
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res)
        that.setData({
          lstforswiper:res.data.housetolet.slice(0,3),
          lstforlet: res.data.housetolet.slice(3),
          lstforrent: res.data.housetorent,
          numoflet: res.data.housetolet.length,
          numofrent:res.data.housetorent.length,
          agentid: options.id,
          agentname: options.name,
          agentphone: options.telno
        })
      },
      fail: function () {
        console.log("request fail!")
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

  //点击买房按钮
  tobuyhouse:function(){
    var that = this;
    that.setData({
      toview:'htl_title'
    })
  },

  torenthouse:function(){
    var that=this;
    that.setData({
      toview: 'htr_title'
    })
  },

  tosalehouse:function(){
    var that = this;
    wx.navigateTo({
      url: '../reg/reg?agentid=' + that.data.agentid,
    })
  },

  onhtmletitem:function(event){
    var that = this;
    console.log(event);
    var hi = that.data.lstforlet[event.currentTarget.id];
    wx.navigateTo({
      url: '../houseitem/houseitem?' + parseParam(hi)
    })
  },

  onhtmrentitem: function (event) {
    var that = this;
    var hi = that.data.lstforrent[event.currentTarget.id];
    wx.navigateTo({
      url: '../houseitem/houseitem?' + parseParam(hi)
    })
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
    return {
      title: this.data.agentname+'的二手房微门店',
      path: 'pages/agentshop/agentshop?id=' + this.data.agentid + '&name=' + this.data.agentname + '&telno=' + this.data.agentphone,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})