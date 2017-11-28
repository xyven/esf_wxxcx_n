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
/*
var checkImgExists=function(imgurl) {
  var ImgObj = new Image(); //判断图片是否存在  
  ImgObj.src = imgurl;
  //没有图片，则返回-1  
  if (ImgObj.fileSize > 0 || (ImgObj.width > 0 && ImgObj.height > 0)) {
    return true;
  } else {
    return false;
  }
} */

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
    toview:'htl_title',
    qrcode: '../icon/timg.jpg'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;   
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
          agentid: res.data.agent.id,
          agentname: res.data.agent.name,
          agentphone: res.data.agent.telno,      
          qrcode: config.service.qrcode + res.data.agent.id + '.jpg'    
        })
        //检查图片链接
       // if (checkImgExists(config.service.qrcode + res.data.agent.id + '.jpg'))
      //  {
       //    that.setData({
        //     qrcode: config.service.qrcode + res.data.agent.id + '.jpg'
        //   })
        //}
        wx.setNavigationBarTitle({
          title: that.data.agentname+'的微门店',
        })   
      },
      fail: function () {
        console.log("request fail!")
      }
    })   
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

  toindex:function(){
    var that = this;
    wx.reLaunch({
      url: '../index/index',
    })
    console.log('rt-index');
  },

  tosalehouse:function(){
    var that = this;
    wx.navigateTo({
      url: '../reg/reg?agentid=' + that.data.agentid,
    })
    console.log('nt-reg');
  },

  onhtmletitem:function(event){
    var that = this;
    console.log(event);
    var hi = that.data.lstforlet[event.currentTarget.id];
    wx.navigateTo({
      url: '../houseitem/houseitem?' + parseParam(hi)
    });
    console.log('nt-houseletitem');
  },

  onhtmrentitem: function (event) {
    var that = this;
    var hi = that.data.lstforrent[event.currentTarget.id];
    wx.navigateTo({
      url: '../houseitem/houseitem?' + parseParam(hi)
    });
    console.log('nt-houserentitem');
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var that=this;
    return {
      title: this.data.agentname+'的二手房微门店',
      path: 'pages/agentshop/agentshop?id=' + this.data.agentid,
      imageUrl: that.data.qrcode,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },

  //预览二维码
  previewImage: function(e){
    wx.previewImage({
      current:this.data.qrcode,
      urls: [this.data.qrcode]
    })
  },

  errorloadimg:function(e)
  {
    var that=this;
    that.setData({
      qrcode:'../icon/timg.jpg'
    })
    console.log('1231');
  }
})