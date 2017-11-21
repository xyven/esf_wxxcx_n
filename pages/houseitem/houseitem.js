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

  toback:function(){
    wx.navigateBack({      
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
      title: this.data.item.title,
      path: 'pages/houseitem/houseitem?' + parseParam(this.data.item),
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