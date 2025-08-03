
Page({
  data: {
    scrollTop: 0,
    eventInfo: {}
  },

  onPageScroll: function (e) {
    console.log(222222,e.scrollTop);
    this.setData({scrollTop: e.scrollTop})
  },

  onSticky: function (e) {
    this.setData({eventInfo: e.detail})
  }
})
