// pages/agentshop/agentshop.js
const App=getApp()
var config = require('../../config');
var util = require('../../utils/util.js');
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

var gethousesbypage = function (agentid, pageindex, callback) {
  wx.request({
    url: config.service.getallhouses,
    data: { 'agentid': agentid, 'pageindx': pageindex },
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
} 


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
    isfirstload:true,
    lstforrent:[],
    numoflet:0,
    numofrent:0,
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 1000,
    circular:true,
    toview:'htl_title',
    qrcode: '../icon/timg.jpg',
    ischecked:{
      agentid: '',
      up10000: false,
      down10000: false,
      t100: false,
      t100150: false,
      t150200: false,
      t200: false,
      xiqu: false,
      dsouth: false,
      ff: false,
      room3: false
    },
    searchkey:'',
    pageindx:1,
    searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
    searchLoadingComplete: false  //“没有数据”的变量，默认false，隐藏
  },

  fetchSearchList:function(){
    var that = this;
    gethousesbypage(that.data.agentid, that.data.pageindx, function(res){
      if (res.data.housetolet.length != 0) {
        //有数据
        var resultlist = [];
        resultlist = that.data.housetolet.concat(res.data.housetolet);
        //that.data.isfirstload ? resultlist = res.data.housetolet.slice(3) : resultlist = that.data.housetolet.concat(res.data.housetolet);
        if (that.data.isfirstload) {
          that.setData({
            lstforswiper: res.data.housetolet.slice(0, 3),
            lstforlet: resultlist,
            lstforrent: res.data.housetorent,
            numoflet: resultlist.length,
            numofrent: res.data.housetorent.length,
            agentid: res.data.agent.id,
            'ischecked.agentid': res.data.agent.id,
            agentname: res.data.agent.name,
            agentphone: res.data.agent.telno,
            qrcode: res.data.agent.qrcode,
            isfirstload: false,
            searchLoading: true
          })
        }
        else {
          that.setData({
            lstforlet: resultlist,
            searchLoading: true  //把上拉加载的变量设为true， 显示
          })
        }
      }
      else {
        //没数据
        that.setData({
          searchLoadingComplete: true, //把“没有数据”设为true，显示  
          searchLoading: false  //把"上拉加载"的变量设为false，隐藏  
        });
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;   
    wx.request({
      url: config.service.getallhouses,
      data: { 'agentid': options.id, 'pageindx' : that.data.pageindx }, //options.id  ym19870817
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res)
        //判断是否有数据
        if(res.data.housetolet.length!=0){
          //有数据
          var resultlist = [];
          that.data.isfirstload ? resultlist = res.data.housetolet.slice(3) : resultlist = that.data.housetolet.concat(res.data.housetolet)
          if (that.data.isfirstload){
            that.setData({
              lstforswiper: res.data.housetolet.slice(0, 3),
              lstforlet: resultlist,
              lstforrent: res.data.housetorent,
              numoflet: resultlist.length,
              numofrent: res.data.housetorent.length,
              agentid: res.data.agent.id,
              'ischecked.agentid': res.data.agent.id,
              agentname: res.data.agent.name,
              agentphone: res.data.agent.telno,
              qrcode: res.data.agent.qrcode,
              isfirstload:false,
              searchLoading: true
            })
          }
          else{
            that.setData({
              lstforlet: resultlist,
              searchLoading: true  //把上拉加载的变量设为true， 显示
            })
          }          
        }
        else{
          //没数据
          that.setData({
            searchLoadingComplete: true, //把“没有数据”设为true，显示  
            searchLoading: false  //把"上拉加载"的变量设为false，隐藏  
          }); 
        }
        wx.setNavigationBarTitle({
          title: that.data.agentname+'的小程序微门店',
        })
      },
      fail: function () {
        console.log("request fail!")
      }
    })   
  },

  searchScrollLower: function () {
    console.log('到底了');
    var that = this;
    if (that.data.searchLoading && !that.data.searchLoadingComplete) {
      that.setData({
        pageindx: that.data.pageindx + 1,  //每次触发上拉事件，把searchPageNum+1  
        isfirstload: false, //触发到上拉事件，把isFromSearch设为为false
        searchLoading: true   //把"上拉加载"的变量设为false，显示
      });
      that.fetchSearchList();
    }
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
  },

  s_up10000:function(e){
    var that=this;
    that.setData({
      'ischecked.up10000': !that.data.ischecked.up10000
    });
    wx.request({
      url: config.service.getallhouses + '/conditions',
      data: that.data.ischecked, //options.id  ym19870817
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res.data);
        console.log(res.data.length);
        that.setData({
          lstforlet: res.data
        })
      },
      fail: function () {
        console.log("request fail!")
      }
    })  
  },

  s_down10000: function (e) {
    var that = this;
    that.setData({
      'ischecked.down10000': !that.data.ischecked.down10000
    })
    wx.request({
      url: config.service.getallhouses + '/conditions',
      data: that.data.ischecked, //options.id  ym19870817
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        that.setData({
          lstforlet: res.data
        })
      },
      fail: function () {
        console.log("request fail!")
      }
    })  
  },

  s_100: function (e) {
    var that = this;
    that.setData({
      'ischecked.t100': !that.data.ischecked.t100
    })
    wx.request({
      url: config.service.getallhouses + '/conditions',
      data: that.data.ischecked, //options.id  ym19870817
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        that.setData({
          lstforlet: res.data
        })
      },
      fail: function () {
        console.log("request fail!")
      }
    })  
  },

  s_100150: function (e) {
    var that = this;
    that.setData({
      'ischecked.t100150': !that.data.ischecked.t100150
    })
    wx.request({
      url: config.service.getallhouses + '/conditions',
      data: that.data.ischecked, //options.id  ym19870817
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        that.setData({
          lstforlet: res.data
        })
      },
      fail: function () {
        console.log("request fail!")
      }
    })  
  },

  s_150200: function (e) {
    var that = this;
    that.setData({
      'ischecked.t150200': !that.data.ischecked.t150200
    })
    wx.request({
      url: config.service.getallhouses + '/conditions',
      data: that.data.ischecked, //options.id  ym19870817
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        that.setData({
          lstforlet: res.data
        })
      },
      fail: function () {
        console.log("request fail!")
      }
    })  
  },

  s_200: function (e) {
    var that = this;
    that.setData({
      'ischecked.t200': !that.data.ischecked.t200
    })
    wx.request({
      url: config.service.getallhouses + '/conditions',
      data: that.data.ischecked, //options.id  ym19870817
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res)
        that.setData({
          lstforlet: res.data
        })
      },
      fail: function () {
        console.log("request fail!")
      }
    })  
  },

  s_xiqu: function (e) {
    var that = this;
    that.setData({
      'ischecked.xiqu': !that.data.ischecked.xiqu
    })
    wx.request({
      url: config.service.getallhouses + '/conditions',
      data: that.data.ischecked, //options.id  ym19870817
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        that.setData({
          lstforlet: res.data
        })
      },
      fail: function () {
        console.log("request fail!")
      }
    })  
  },

  s_dsouth: function (e) {
    var that = this;
    that.setData({
      'ischecked.dsouth': !that.data.ischecked.dsouth
    })
    wx.request({
      url: config.service.getallhouses + '/conditions',
      data: that.data.ischecked, //options.id  ym19870817
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        that.setData({
          lstforlet: res.data
        })
      },
      fail: function () {
        console.log("request fail!")
      }
    })  
  },

  s_fullfurbished: function (e) {
    var that = this;
    that.setData({
      'ischecked.ff': !that.data.ischecked.ff
    })
    wx.request({
      url: config.service.getallhouses + '/conditions',
      data: that.data.ischecked, //options.id  ym19870817
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        that.setData({
          lstforlet: res.data
        })
      },
      fail: function () {
        console.log("request fail!")
      }
    })  
  },

  s_3room: function (e) {
    var that = this;
    that.setData({
      'ischecked.room3': !that.data.ischecked.room3
    })
    wx.request({
      url: config.service.getallhouses + '/conditions',
      data: that.data.ischecked, //options.id  ym19870817
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        that.setData({
          lstforlet: res.data
        })
      },
      fail: function () {
        console.log("request fail!")
      }
    })  
  },

  onblur:function(e){    
    var that = this;
    this.setData({
      searchkey: e.detail.value
    })
  },

  fuzzysearch:function(e){
    var that = this;    
    console.log(that.data.searchkey);
    wx.request({
      url: config.service.getallhouses + '/fuzzy',
      data: { 'agentid': that.data.agentid, 'key': that.data.searchkey}, //options.id  ym19870817
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res);
        that.setData({
          lstforlet: res.data
        })
      },
      fail: function () {
        console.log("request fail!")
      }
    })
  }
})