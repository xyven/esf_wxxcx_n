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
    searchLoadingComplete: false,  //“没有数据”的变量，默认false，隐藏
    onloadlist:false,
    lastdate:'',
    onfuzzysearch:false,
    isindexchecked:false,
    isletchecked:true,
    isrentchecked:false,
    isdengchecked:false,
    isminechecked:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this; 
    var date = new Date();
    date.setDate(date.getDate() - 1);
    console.log(options);
    //console.log(date.Format("yyyy-MM-dd"))
    wx.request({
      url: config.service.getallhouses,
      data: { 'agentid': options.id, 'pageindx' : that.data.pageindx }, //options.id  ym19870817
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        //console.log(res)
        that.setData({
          lstforlet: res.data.housetolet,
          lstforrent: res.data.housetorent,
          numoflet: res.data.housetolet.length,
          numofrent: res.data.housetorent.length,
          agentid: res.data.agent.id,
          'ischecked.agentid': res.data.agent.id,
          agentname: res.data.agent.name,
          agentphone: res.data.agent.telno,
          qrcode: res.data.agent.qrcode,
          isfirstload: false,
          searchLoading: true,
          lastdate: date.Format("yyyy-MM-dd")
        })
        wx.setNavigationBarTitle({
          title: that.data.agentname + '的微门店(在售' + that.data.numoflet + '套出租' + that.data.numofrent+'套)',
        })
      },
      fail: function () {
        console.log("request fail!")
      }
    });
 },

  searchScrollLower: function () {     
    var that = this;
    if (that.data.onloadlist)
      return;
    if (that.data.onfuzzysearch)
      return;
    //console.log('到底了');
    //console.log(that.data);
    if (that.data.searchLoading && !that.data.searchLoadingComplete) {
      that.setData({
        pageindx: that.data.pageindx + 1,  //每次触发上拉事件，把searchPageNum+1  
        isfirstload: false, //触发到上拉事件，把isFromSearch设为为false
        searchLoading: true,  //把"上拉加载"的变量设为false，显示
        onloadlist:true
      });
      //console.log(that.data.pageindx);
      that.fetchSearchList();
    }
  },

  fetchSearchList: function () {
    let that = this;
    that.data.doesloadall = false;
    gethousesbypage(that.data.agentid, that.data.pageindx, function (res) {
      if (res.data.housetolet.length != 0) {
        //有数据
        var resultlist = [];
        //console.log(that.data.lstforlet);
        resultlist = that.data.lstforlet.concat(res.data.housetolet);
        that.setData({
          lstforlet: resultlist,
          searchLoading: true,  //把上拉加载的变量设为true， 显示
          onloadlist: false
        })        
      }
      else {
        //没数据
        that.setData({
          searchLoadingComplete: true, //把“没有数据”设为true，显示  
          searchLoading: false,  //把"上拉加载"的变量设为false，隐藏 
          onloadlist: false 
        });
      }
    })
  },

  onblur: function (e) {
    var that = this;
    if (e.detail.value != '')
      this.setData({
        searchkey: e.detail.value,
        searchLoadingComplete: true, //把“没有数据”设为true，显示  
        searchLoading: false,  //把"上拉加载"的变量设为false，隐藏
      });
    else {
      that.setData({
        lstforlet:[],
        pageindx: 1,
        searchkey: e.detail.value,
        searchLoading: true
      });  
      wx.request({
        url: config.service.getallhouses,
        data: { 'agentid': that.data.agentid, 'pageindx': that.data.pageindx }, //options.id  ym19870817
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          //console.log(res)
          that.setData({
            lstforlet: res.data.housetolet.slice(3),            
            searchLoading: true,
            searchLoadingComplete: false, //把“没有数据”设为false 不显示
            onfuzzysearch: false,
          })
        },
        fail: function () {
          console.log("request fail!")
        }
      });
    }
  },

  fuzzysearch: function (e) {
    var that = this;
    //console.log(that.data.searchkey);
    wx.request({
      url: config.service.getallhouses + '/fuzzy',
      data: { 'agentid': that.data.agentid, 'key': that.data.searchkey }, //options.id  ym19870817
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        //console.log(res);
        that.setData({
          lstforlet: res.data,
          onfuzzysearch: true,
          searchLoadingComplete: true
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
      toview:'search',
      isindexchecked: false,
      isletchecked: true,
      isrentchecked: false,
      isdengchecked: false,
      isminechecked: false
    })    
  },

  torenthouse:function(){
    var that=this;
    that.setData({
      toview: 'search',
      isindexchecked: false,
      isletchecked: false,
      isrentchecked: true,
      isdengchecked: false,
      isminechecked: false
    })
  },

  toindex:function(){
    var that = this;
    that.setData({
      isindexchecked: true,
      isletchecked: false,
      isrentchecked: false,
      isdengchecked: false,
      isminechecked: false
    })
    wx.reLaunch({
      url: '../index/index',
    })
    //console.log('rt-index');
  },

  tosalehouse:function(){
    var that = this;
    wx.redirectTo({
      url: '../reg/reg?agentid=' + that.data.agentid,
    })
    //console.log('nt-reg');
  },

  onhtmletitem_swiper:function(event){
    var that = this;
    //console.log(event);
    var hi = that.data.lstforswiper[event.currentTarget.id];
    wx.navigateTo({
      url: '../houseitem/houseitem?' + parseParam(hi)
    });
    //console.log('nt-houseletitem');
  },

  onhtmletitem: function (event) {
    var that = this;
    //console.log(event);
    var hi = that.data.lstforlet[event.currentTarget.id];
    wx.navigateTo({
      url: '../houseitem/houseitem?' + parseParam(hi)
    });
    //console.log('nt-houseletitem');
  },

  onhtmrentitem: function (event) {
    var that = this;
    var hi = that.data.lstforrent[event.currentTarget.id];
    wx.navigateTo({
      url: '../houseitem/houseitem?' + parseParam(hi)
    });
    //console.log('nt-houserentitem');
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
    //console.log('1231');
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
        //console.log(res.data);
        //console.log(res.data.length);
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
        //console.log(res)
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

  toperson:function(e){
    var that = this;
    that.setData({
      isindexchecked: false,
      isletchecked: false,
      isrentchecked: false,
      isdengchecked: false,
      isminechecked: true
    })
    wx.navigateTo({
      url: '../person/person'
    })
  }  
})