
// 引入配置
var config = require('../../config');

Page({
  data:{
    num:[0,1,2,3,4,5,6,7,8,9,10],
    fitlevel:['高档','中档','低档','毛坯'],
    index:0,
    multiArray1: [[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]],
    multiIndex1:[0,0],
    multiArray2: [[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]],
    multiIndex2: [0, 0, 0, 0],
    letorrent:'let',
    residentialareaname:'',
    floor:0,
    allfloor:0,
    haveelevator:false,
    nroom:0,
    nhall:0,
    nchicken:0,
    ntoilet:0,
    direction:'南',
    priceofletfirst:0,
    priceofletland:0,
    priceofrent:0,
    fitmentlevel:'中档',
    discription:'',
    phonenumber:'',
    facility:[],
    frequence:12,
    agentid:''
  },

  onLoad:function(option){
    this.setData({
      agentid:option.agentid
    })

  },

  //事件响应函数
  radioChange:function(e){    
    this.setData({
      letorrent:e.detail.value
    });     
  },

  onblur:function(e){
    this.setData({
      residentialareaname:e.detail.value
    })    
  }, 

  bindMultiPickerChange1:function(e){
    this.setData({
      floor:e.detail.value[0],
      allfloor:e.detail.value[1]
    })    
  },

  //电梯
  onelevatorchange:function(e){
    this.setData({
      haveelevator:e.detail.value
    })
    var that = this;    
    console.log(that.data.haveelevator);
  },

  bindMultiPickerChange2: function (e) {
    this.setData({
      nroom:e.detail.value[0],
      nhall: e.detail.value[1],
      nchicken: e.detail.value[2],
      ntoilet: e.detail.value[3],
    })    
  },

  onchangedire: function (e) {
    this.setData({
      housedirection: e.detail.value
    })
  },

  onchangepricefirst: function (e) {
    this.setData({
      priceofletfirst: e.detail.value
    })
  },

  onchangepriceland: function (e) {
    this.setData({
      priceofletland: e.detail.value
    })
  },
  bindPickerChange: function (e) {
    var that = this;
    this.setData({
      fitmentlevel: that.data.fitlevel[e.detail.value]
    })    
    console.log(that.data.fitmentlevel);
  },
  //描述
  onchangediscription: function (e) {
    this.setData({
      discription: e.detail.value
    })
  },

  onchangephone:function(e){
    this.setData({
      phonenumber: e.detail.value
    })
  },

  oncheckfacility:function(e){
    this.setData({
      facility: e.detail.value
    })
  },

  onfreqchange:function(e){
    this.setData({
      frequence:e.detail.value
    })
    var that=this;
    console.log(that.data.frequence)
  },

  onchangerentprice:function(e){
    this.setData({
      priceofrent:e.detail.value
    })
  },

  toback: function () {
    wx.navigateBack({
    })
  },

  onreg:function(e){
    var formData = e.detail.value;
    console.log(formData);
    var that = this;
    wx.request({
      url: config.service.regnewhouse,
      data: formData,
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        wx.showToast({
          title: '登记成功',
          icon: 'success',
          duration: 2000
        })        
      },
      fail:function(res){
        wx.showToast({
          title: '登记失败，可能是网络原因',
          icon: 'success',
          duration: 2000
        })        
      }
    }) 
  }
})