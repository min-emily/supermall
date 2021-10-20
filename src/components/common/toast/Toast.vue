<template>
  <div class="toast" v-show="isShow">
    <div>{{ message }}</div>
  </div>
</template>
<script>
export default {
  name: "Toast",
  props: {
    // message: {
    //   type: String,
    //   default: '',
    // },
    // show: {
    //   type: Boolean,
    //   default: false,
    // },
  },
  data() {
    return {
      message: "",
      isShow: false,
    };
  },
  methods: {
    show(message, duration) {
      this.isShow = true;
      this.message = message;
      setTimeout(() => {
        this.isShow = false;
        this.message = "";
      }, duration);
    },
  },
};
</script>
<style scoped>
/* translate()函数是css3的新特性.在不知道自身宽高的情况下，可以利用它来进行水平垂直居中.。
当使用：top: 50%;left: 50%;， 是以左上角为原点，故不处于中心位置
translate(-50%,-50%) 作用是，往上（x轴）,左（y轴）移动自身长宽的 50%，以使其居于中心位置。 */
.toast {
  position: fixed;
  top: 50%;
  left: 50%;
  padding: 8px 10px;
  color: #fff;
  background-color: rgba(0, 0, 0, 0.6);
  transform: translate(-50%, -50%);
  z-index: 999;
}
</style>
