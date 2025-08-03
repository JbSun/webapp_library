Component({
  properties: {
    top: { type: Number, value: 0 },
    scrollTop: { type: Number, value: 0 },
    tabs: { type: Array, value: [] },
    newsList: { type: Array, value: [] },
    loadingNews: { type: Boolean, value: false },
    finishedNews: { type: Boolean, value: false }
  },
  data: {
    activeIndex: 0,
    isSticky: false,
    tabBarTop: 0,
    measured: false
  },
  observers: {
    scrollTop(scrollTop) {
      this.checkSticky(scrollTop)
    }
  },
  methods: {
    onTabClick(e) {
      this.setData({ activeIndex: e.currentTarget.dataset.index })
    },
    onSwiperChange(e) {
      this.setData({ activeIndex: e.detail.current })
    },
    checkSticky(scrollTop) {
      if (!this.data.measured) {
        const query = this.createSelectorQuery()
        query.in(this).select('.tab-bar').boundingClientRect()
        query.exec(res => {
          if (res[0]) {
            const tabBarTop = res[0].top + scrollTop
            this.setData({ tabBarTop, measured: true }, () => {
              this.checkSticky(scrollTop)
            })
          }
        })
        return
      }

      const shouldStick = scrollTop >= this.data.tabBarTop - this.data.top
      if (shouldStick !== this.data.isSticky) {
        this.setData({ isSticky: shouldStick })
      }
    },
    onNewsScrollToLower() {
      console.log(33333)
      if (!this.data.loadingNews && !this.data.finishedNews) {
        this.triggerEvent('loadmore')
      }
    }
  }
})
