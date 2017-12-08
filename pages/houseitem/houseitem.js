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
    console.log(options);
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
    console.log(this.data.item);
    return {
      title: this.data.item.estate + '/'+this.data.item.area+ '/' + this.data.item.struct +'/'+ this.data.item.totalprice +'/' + this.data.item.unitprice + '/' + this.data.item.fitment+this.data.item.title,
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
  }  
})