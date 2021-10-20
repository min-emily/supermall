<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav" @titleClick="titleClick" ref="nav" />
    <scroll
      class="content"
      ref="scroll"
      :probe-type="3"
      @scroll="contentScroll"
    >
      <!-- 属性：topImages 传入值：top-images -->
      <detail-swiper :top-images="topImages" />
      <detail-base-info :goods="goods" />
      <detail-shop-info :shop="shop" />
      <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad" />
      <detail-param-info ref="params" :param-info="itemParams" />
      <detail-comment-info ref="comment" :comment-info="commentInfo" />
      <goods-list ref="recommend" :goods="recommends" />
    </scroll>
    <detail-bottom-bar @addCart="addToCart" />
    <back-top @click.native="backClick" v-show="isShowBackTop" />
    <!-- <toast :message="message" :show="show" /> -->
  </div>
</template>
<script>
import DetailNavBar from "./childComps/DetailNavBar";
import DetailSwiper from "./childComps/DetailSwiper";
import DetailBaseInfo from "./childComps/DetailBaseInfo";
import DetailShopInfo from "./childComps/DetailShopInfo";
import DetailGoodsInfo from "./childComps/DetailGoodsInfo";
import DetailParamInfo from "./childComps/DetailParamInfo";
import DetailCommentInfo from "./childComps/DetailCommentInfo";
import DetailBottomBar from "./childComps/DetailBottomBar";

import Scroll from "@/components/common/scroll/Scroll";
import GoodsList from "@/components/content/goods/GoodsList";
// import Toast from "@/components/common/toast/Toast";

import { getDetail, getRecommend, Goods, Shop } from "@/network/detail";
import { debouce } from "@/common/utils";
import { itemListenerMixin, backTopMixin } from "@/common/mixin";
import { BACKTOP_DISTANCE } from "@/common/const";
export default {
  name: "Detail",
  components: {
    DetailNavBar,
    DetailSwiper,
    DetailBaseInfo,
    DetailShopInfo,
    DetailGoodsInfo,
    DetailParamInfo,
    DetailCommentInfo,
    DetailBottomBar,
    Scroll,
    GoodsList,
    // Toast,
  },
  mixins: [itemListenerMixin, backTopMixin],
  data() {
    return {
      iid: null,
      topImages: [],
      goods: {},
      shop: {},
      detailInfo: {},
      itemParams: {},
      commentInfo: {},
      recommends: [],
      themeTopYs: [],
      getThemeTopY: null,
      currentIndex: 0,
      // message: '',
      // show: false,
    };
  },
  created() {
    // 1.保存传入的iid
    this.iid = this.$route.params.iid;
    // 2.根据iid请求详情数据
    getDetail(this.iid).then((res) => {
      console.log(res);
      // 1.获取顶部的图片轮播数据
      const data = res.result;
      // 2.取出轮播图的数据
      this.topImages = data.itemInfo.topImages;
      // 3.获取商品信息
      this.goods = new Goods(
        data.itemInfo,
        data.columns,
        data.shopInfo.services
      );
      // 4.创建店铺信息对象
      this.shop = new Shop(data.shopInfo);
      // 5.保存商品的详情数据
      this.detailInfo = data.detailInfo;
      // 6.获取参数信息
      // this.paramInfo = new GoodsParam(
      //   data.itemParams.info,
      //   data.itemParams.rule
      // );
      this.itemParams = data.itemParams;
      // 7.取出评论信息
      if (data.rate.cRate !== 0) {
        this.commentInfo = data.rate.list[0];
      }
      // this.$nextTick(() => {
      //   // 根据最新的数据，对应的DoM是已经被渲染出来，但是图片依然没有加载完（目前获得到的offsetTop不包含图片）
      //   this.themeTopYs = [];

      //   this.themeTopYs.push(0);
      //   this.themeTopYs.push(this.$refs.params.$el.offsetTop);
      //   this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
      //   this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);

      //   console.log(this.themeTopYs);
      // });
    });
    // 3.请求推荐的数据
    getRecommend().then((res) => {
      // console.log(res);
      this.recommends = res.data.list;
    });
    // 给getThemeTopY赋值(对给this.themeTopYs赋值的操作进行防抖)
    this.getThemeTopY = debouce(() => {
      this.themeTopYs = [];

      this.themeTopYs.push(0);
      this.themeTopYs.push(this.$refs.params.$el.offsetTop);
      this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
      this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);
      this.themeTopYs.push(Number.MAX_VALUE);

      // console.log(this.themeTopYs);
    }, 100);
  },
  destroyed() {
    // console.log("destroyed");
    this.$bus.$off("itemImgLoad", this.itemImgListener);
  },
  methods: {
    // 4.监听详情的图片加载完成
    imageLoad() {
      this.refresh();
      this.getThemeTopY();
    },
    titleClick(index) {
      // console.log(index)
      this.$refs.scroll.scrollTo(0, -this.themeTopYs[index], 200);
    },
    contentScroll(position) {
      // 1.获取y值
      // console.log(position)
      const positionY = -position.y;
      // 2.positionY和主题中值进行对比
      let length = this.themeTopYs.length;
      for (let i = 0; i < length - 1; i++) {
        // console.log(i);
        if (
          this.currentInde !== i &&
          positionY >= this.themeTopYs[i] &&
          positionY < this.themeTopYs[i + 1]
        ) {
          this.currentIndex = i;
          this.$refs.nav.currentIndex = this.currentIndex;
          // }
        }
        // if (
        //   this.currentIndex !== i &&
        //   ((i < length - 1 &&
        //     positionY >= this.themeTopYs[i] &&
        //     positionY < this.themeTopYs[i + 1]) ||
        //     (i === length - 1 && positionY >= this.themeTopYs[i]))
        // ) {
        //   this.currentIndex = i;
        //   console.log(this.currentIndex);
        //   this.$refs.nav.currentIndex = this.currentIndexF
        // }
      }
      // 3.判断BackTop是否显示 （监听滚动，拿到滚动位置）
      // （DISTANCE：距离）
      this.isShowBackTop = -position.y > BACKTOP_DISTANCE;
    },
    addToCart() {
      // console.log("+++++")
      //1. 获取购物车需要展示的信息
      const prodect = {};
      prodect.image = this.topImages[0];
      prodect.title = this.goods.title;
      prodect.desc = this.goods.desc;
      prodect.price = this.goods.realPrice;
      prodect.iid = this.iid;
      // 2.将商品添加到购物车里
      // this.$store.commit("addCart", prodect);
      this.$store.dispatch("addCart", prodect).then((res) => {
        // console.log(res);
        // this.show = true;
        // this.message = res;
        // setTimeout(() => {
        //   this.show = false;
        //   this.message = '';
        // }, 1500);
        this.$toast.show(res,1000)
      });
    },
  },
};
</script>
<style scoped>
#detail {
  position: relative;
  z-index: 9;
  background-color: #fff;
  height: 100vh;
}
.detail-nav {
  position: relative;
  z-index: 9;
  background-color: #fff;
}
.content {
  height: calc(100% - 44px - 49px);
}
</style>
