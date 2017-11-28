// pages/houseitem/houseitem.js
var parseParam = function (param, key) {
  var paramStr = "";
  if (param instanceof String || param instanceof Number || param instanceof Boolean) {
    paramStr += "&" + key + "=" + encodeURIComponent(param);
  } else {
    for (var i in param) {
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
    item:{},
    pic:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      item: options,
      pic:options.pic.split(',')
    })
    //console.log(options);
  },

  toback:function(){
    wx.navigateBack({      
    });
    console.log('nb');
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
    return {
      title: this.data.item.title + ',总价:'+ this.data.item.totalprice + ',单价:' + this.data.item.unitprice + '。',
      path: 'pages/houseitem/houseitem?' + parseParam(this.data.item),
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
    wx.showModal({
      title:'提示',
      content: '确定拨打中介电话:' + this.data.item.agentphone,
      success: function (res) {
        if (res.confirm) {
          wx.makePhoneCall({
            phoneNumber: this.data.item.agentphone
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })    
  }
})