import { sleep } from "../../../../utils/utils";
import {
  getRankingBooks,
  getRecommendedBooksByUserId,
  getTypes,
} from "../../../../apis/book";
import { getUID } from "../../../../utils/permission";
Component({
  properties: {
    top: { type: Number, value: 0 },
    scrollTop: { type: Number, value: 0 },
  },
  data: {
    activeIndex: 0,
    isSticky: false,
    tabBarTop: 0,
    measured: false,
    loading: false,
    tabs: [
      { key: "recommend", title: "推荐" },
      { key: "categories", title: "分类" },
      { key: "ranking", title: "排行榜" },
    ],
  },
  observers: {
    scrollTop(scrollTop) {
      this.checkSticky(scrollTop);
    },
  },
  lifetimes: {
    created() {
      this.initFetchData();
    },
  },
  methods: {
    onTabClick(e) {
      this.setData({ activeIndex: e.currentTarget.dataset.index });
    },
    onSwiperChange(e) {
      this.setData({ activeIndex: e.detail.current });
    },
    checkSticky(scrollTop) {
      if (!this.data.measured) {
        const query = this.createSelectorQuery();
        query.in(this).select(".tab-bar").boundingClientRect();
        query.exec((res) => {
          if (res[0]) {
            const tabBarTop = res[0].top + scrollTop;
            this.setData({ tabBarTop, measured: true }, () => {
              this.checkSticky(scrollTop);
            });
          }
        });
        return;
      }

      const shouldStick = scrollTop >= this.data.tabBarTop - this.data.top;
      if (shouldStick !== this.data.isSticky) {
        this.setData({ isSticky: shouldStick });
      }
    },
    async initFetchData() {
      const resps = await Promise.all([
        getRecommendedBooksByUserId(getUID()),
        getRankingBooks(),
        getTypes(),
      ]);
      // 初始化的推荐书籍
      const recommendBooks = (resps?.[0]?.data || []).map((i) => i.book);
      // 初始化的排行榜书籍
      const rankingBooks = resps[1]?.data?.books || [];
      // 分类数据
      const categoriesContent = resps?.[2]?.data?.data || [];
      console.log("分类数据 ===>", categoriesContent);
      this.setData({
        tabs: [
          {
            key: "recommend",
            title: "推荐",
            content: recommendBooks,
          },
          {
            key: "categories",
            title: "分类",
            content: categoriesContent,
          },
          { key: "ranking", title: "排行榜", content: rankingBooks },
        ],
      });
    },
    async onScrollToLower() {
      console.log(33333, this.data.loading);
      if (!this.data.loading) {
        this.setData({ loading: true });
        await sleep(2000);
        this.setData({ loading: false });
      }
    },
  },
});
