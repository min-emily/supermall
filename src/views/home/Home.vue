<template>
  <div id="home">
    <nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>
    <tab-control
      class="tab-control"
      :titles="['流行', '新款', '精选']"
      @tabClick="tabClick"
      ref="tabControl1"
      v-show="isTabFixed"
    />
    <scroll
      class="content"
      ref="scroll"
      :probe-type="3"
      @scroll="contentScroll"
      :pull-up-load="true"
      @pullingUp="loadMore"
    >
      <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad" />
      <recommend-view :recommends="recommends" />
      <feature-view />
      <tab-control
        :titles="['流行', '新款', '精选']"
        @tabClick="tabClick"
        ref="tabControl2"
      />
      <!-- <good-list :goods="goods['pop'].list"></good-list> -->
      <good-list :goods="showGoods" />
    </scroll>
    <!-- 组件不能直接监听点击，需要加上.native -->
    <back-top @click.native="backClick" v-show="isShowBackTop" />
  </div>
</template>
<script>
import HomeSwiper from "./childComps/HomeSwiper";
import RecommendView from "./childComps/RecommendView";
import FeatureView from "./childComps/FeatureView";

import NavBar from "@/components/common/navbar/NavBar";
import TabControl from "@/components/content/tabControl/TabControl";
import GoodList from "@/components/content/goods/GoodsList";
import Scroll from "@/components/common/scroll/Scroll";

import { getHomeMultidata, getHomeGoods } from "@/network/home";
import { debouce } from "@/common/utils";
import { itemListenerMixin,backTopMixin } from "@/common/mixin";

export default {
  name: "Home",
  components: {
    HomeSwiper,
    RecommendView,
    FeatureView,
    NavBar,
    TabControl,
    GoodList,
    Scroll,
  },
  mixins: [itemListenerMixin,backTopMixin],
  data() {
    return {
      // result: null,
      banners: [],
      recommends: [],
      goods: {
        new: { page: 0, list: [] },
        pop: { page: 0, list: [] },
        sell: { page: 0, list: [] },
      },
      // 默认类型
      currentType: "pop",
      tabOffsetTop: 0,
      save: 0,
      // 默认不需要吸顶
      isTabFixed: false,
      saveY: 0,
    };
  },
  computed: {
    showGoods() {
      return this.goods[this.currentType].list;
    },
    // 活跃
    activated() {
      this.$refs.scroll.scrollTop(0, this.saveY, 0);
      this.$refs.scroll.refresh();
    },
    deactivated() {
      // 1.保存Y值
      this.saveY = this.$refs.scroll.getSCrollY();
      // 2.取消全局事件的监听
      this.$bus.$off("");
    },
  },
  created() {
    // 1.请求多个数据
    this.getHomeMultidata();
    // 2.请求商品数据
    this.getHomeGoods("pop");
    this.getHomeGoods("new");
    this.getHomeGoods("sell");
    // 3.手动代码点击一次
    this.tabClick(0);
  },
  methods: {
    // 事件监听相关方法
    tabClick(index) {
      // console.log(index);
      switch (index) {
        case 0:
          this.currentType = "pop";
          break;
        case 1:
          this.currentType = "new";
          break;
        case 2:
          this.currentType = "sell";
          break;
      }
      // 让两个tabControl的currentIndex保持一致
      if (this.$refs.topTabControl !== undefined) {
        this.$refs.tabControl1.currentIndex = index;
        this.$refs.tabControl2.currentIndex = index;
      }
    },
    contentScroll(position) {
      // console.log(position);
      // position.y<1000;
      // 1.判断BackTop是否显示 （监听滚动，拿到滚动位置）
      this.isShowBackTop = -position.y > 1000;
      // 2.决定tabControl是否吸顶（position：fixed）
      this.isTabFixed = -position.y > this.tabOffsetTop;
    },
    loadMore() {
      // console.log("上拉加载更多");
      this.getHomeGoods(this.currentType);
    },
    swiperImageLoad() {
      this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop;
    },
    // 网络请求相关方法
    getHomeMultidata() {
      getHomeMultidata().then((res) => {
        // this.result = res;
        // console.log(res)
        this.banners = res.data.banner.list;
        this.recommends = res.data.recommend.list;
      });
    },
    getHomeGoods(type) {
      const page = this.goods[type].page + 1;
      getHomeGoods(type, page).then((res) => {
        // console.log(res);
        this.goods[type].list.push(...res.data.list);
        this.goods[type].page += 1;

        // 完成上拉加载更多
        this.$refs.scroll.finishPullUp();
      });
    },
  },
};
</script>
<style scoped>
/* scoped:作用域 */
#home {
  /* padding-top: 44px; */
  /* vh:视口高度单位 */
  height: 100vh;
  position: relative;
}
.home-nav {
  background-color: var(--color-tint);
  color: #fff;

  /*在使用浏览器原生滚动时，为了让导航不跟随一起滚动  */
  /* position: fixed;
  left: 0;
  right: 0;
  top: 0;
  z-index: 9; */
}
.content {
  /* height: 300px; */
  overflow: hidden;
  position: absolute;
  top: 44px;
  bottom: 49px;
  left: 0;
  right: 0;
}
.tab-control {
  position: relative;
  z-index: 9;
}
/* .content {
  height: calc(100% - 93px);
  overflow: hidden;
  margin-top: 44px;
} */
</style>
