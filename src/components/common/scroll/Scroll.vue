<template>
  <div class="wrapper" ref="wrapper">
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>
<script>
import BScroll from "better-scroll";
export default {
  name: "Scroll",
  props: {
    probeType: {
      type: Number,
      default: 0,
    },
    pullUpLoad: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      scroll: null,
    };
  },
  // 组件创建完后调用
  mounted() {
    // document.querySelector(".wrapper") => wrapper名字容易重复
    // ref如果是绑定在组件中，那么通过this.$ref.refname获取到的是一个组件对象
    // ref如果是绑定在普通元素中，那么通过this.$ref.refname获取到的是一个元素对象

    // 1.创建BScroll对象
    this.scroll = new BScroll(this.$refs.wrapper, {
      click: true,
      probeType: this.probeType,
      pullUpLoad: this.pullUpLoad,
    });
    // 2.监听滚动的位置
    if (this.probeType === 2 || this.probeType === 3) {
      this.scroll.on("scroll", (position) => {
        //  console.log(position);
        this.$emit("scroll", position);
      });
    }
    // 3.监听scroll滚动到底部
    if (this.pullUpLoad) {
      this.scroll.on("pullingUp", () => {
        // console.log("监听到滚动到底部");
        this.$emit("pullingUp");
      });
    }
    // console.log(this.scroll);
  },
  methods: {
    scrollTo(x, y, time = 300) {
      this.scroll && this.scroll.scrollTo(x, y, time);
    },
    refresh() {
      // console.log("---")
      this.scroll && this.scroll.refresh();
    },
    finishPullUp() {
      this.scroll && this.scroll.finishPullUp();
    },
    getSCrollY() {
      return this.scroll ? this.scroll.y : 0;
    },
  },
};
</script>
<style scoped></style>
