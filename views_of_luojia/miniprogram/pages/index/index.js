//index.js
const app = getApp()

Page({
  data: {
    avatarUrl: 'https://i.loli.net/2020/11/22/a5cKs9CG1LAeIWp.png',
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: '',
    location:{
      latitude: 10.040415,
      longtitude: 116.273511
    },
    collectionsIcon: '../../icons/collections.png',
    selfCenterIcon: '../../icons/self_center.png'
  },

  checkIfSign: function(){
    if (!wx.getStorageSync('logged')) {
      wx.navigateTo({
        url: '../signIn/signIn'
      })
      return false;
    } else return true;
  },

  enterCollections: function(){
    this.setData({
      collectionsIcon: '../../icons/collections_focus.png'
    })
    if(this.checkIfSign())
    wx.navigateTo({
      url: '../collections/collections',
    })


  },

  enterSelfCenter: function(){
    this.setData({
      selfCenterIcon: '../../icons/self_center_focus.png'
    })
    if(this.checkIfSign())
    wx.navigateTo({
      url: '../selfCenter/selfCenter',
    })

  },

  analyzeImg: function(){
    if(this.checkIfSign()){
      this.choosePic();

    }
  },

  choosePic: function(options) {
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {
        console.log(res);
        wx.showLoading({
          title: '努力识图中...',
        })
        var tempFilePath = res.tempFilePaths[0];
        wx.setStorageSync('targetImgPath', tempFilePath);
        console.log(tempFilePath);
        wx.uploadFile({
          url: app.globalData.url + 'test/picHandler/predict/',
          filePath: tempFilePath,
          name: 'file',
          // header: {"Content-Type": "multipart/form-data"},
          formData: {

          },
          success: function(res) {
            console.log(res);
            wx.navigateTo({
              url: '../analyzeImg/analyzeImg',
            })
          }

        })
      },
      fail: function(res) {
        console.log(res.errMsg);
      },
      complete: function() {
        wx.hideLoading();
      }
    })
  },

  onLoad: function() {
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }

    console.log(wx.getStorageSync('openid'));

    // 激活定位控件
    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        const {latitude, longitude} = res;
        this.setData({
          location: {
            latitude,
            longitude
          }
        });
        this.moveTolocation();
      }
    });




  },

  onShow: function() {
    this.setData({
      collectionsIcon: '../../icons/collections.png',
      selfCenterIcon: '../../icons/self_center.png'
    })
  },

  moveTolocation: function() {
    this.mapCtx = wx.createMapContext('map')
    this.mapCtx.moveToLocation()
  },

})
