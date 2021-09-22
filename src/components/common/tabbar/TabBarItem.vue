<template>
  <div class="tab-bar-item" @click="itemClick">
    <!-- 展示同一个图片，同一个文字 -->
    <div v-if="!isActive"><slot name="item-icon"></slot></div>
    <div v-else><slot name="item-icon-active"></slot></div>
    <div :style="activeStyle"><slot name="item-text"></slot></div>
  </div>
</template>
<script>
export default {
  name: "TabBarItem",
  props: {
    path: String,
    activeColor: {
      type: String,
      default: "red",
    },
  },
  data() {
    return {
      // isActive: true
    };
  },
  computed: {
    isActive() {
      // 最活跃的那个
      return this.$route.path.indexOf(this.path) !== -1;
    },
    activeStyle() {
      return this.isActive ? { color: this.activeColor } : {};
    },
  },
  methods: {
    itemClick() {
      // 需要浏览器左上方可以返回，就用push,反之，设置replace.
      this.$router.replace(this.path);
    },
  },
};
</script>
<style scoped>
.tab-bar-item {
  /* 均分 */
  flex: 1;
  text-align: center;
  height: 49px;
  font-size: 14px;
}
.tab-bar-item img {
  width: 24px;
  height: 24px;
  margin-top: 3px;
  vertical-align: middle;
  margin-bottom: 2px;
}
</style>
