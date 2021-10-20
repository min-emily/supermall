<template>
  <div class="bottom-bar">
    <div class="check-content">
      <check-button
        :is-checked="isSelectAll"
        class="check-button"
        @click.native="checkClick"
      />
      <span>全选</span>
    </div>
    <div class="price">合计：{{ totalPrice }}</div>
    <div class="calculate" @click="calcClick">去计算({{ checkLength }})</div>
  </div>
</template>
<script>
import CheckButton from "@/components/content/checkButton/CheckButton";

export default {
  name: "CartBottomBar",
  components: {
    CheckButton,
  },
  methods: {
    checkClick() {
      // console.log("---")
      if (this.isSelectAll) {
        //全部选中
        this.$store.state.cartList.forEach((item) => (item.checked = false));
      } else {
        //部分或者全部不选中
        this.$store.state.cartList.forEach((item) => (item.checked = true));
      }
    },
    calcClick() {
      console.log(this.checkLength > 0);
      console.log(this.checkLength);
      if (this.checkLength > 0) {
        alert("计算成功");
      } else {
        this.$toast.show("请选择购买的商品", 2000);
      }
    },
  },
  computed: {
    totalPrice() {
      return (
        "￥" +
        this.$store.state.cartList
          .filter((item) => {
            return item.checked;
          })
          .reduce((preValue, item) => {
            return preValue + item.price * item.count;
          }, 0)
          .toFixed(2)
      );
    },
    checkLength() {
      return this.$store.state.cartList.filter((item) => item.checked).length;
    },
    // 是否选中
    isSelectAll() {
      if (this.$store.state.cartList.length === 0) return false;
      // 高阶函数解决
      // 1.使用filter
      // return !(this.$store.state.cartList.filter((item) => !item.checked).length);
      // 2.使用find函数
      // return !this.$store.state.cartList.find((item) => !item.checked);

      // 3.普通遍历
      for (let item of this.$store.state.cartList) {
        if (!item.checked) {
          return false;
        }
      }
      return true;
    },
  },
};
</script>
<style scoped>
.bottom-bar {
  position: relative;

  height: 40px;
  line-height: 40px;

  background-color: #eee;
  display: flex;
  font-size: 14px;
}
.check-content {
  display: flex;
  /* align-items 属性定义flex子项在flex容器的当前行的侧轴（纵轴）方向上的对齐方式。  */
  align-items: center;
  margin-left: 10px;
  width: 60px;
}
.check-button {
  width: 20px;
  height: 20px;
  line-height: 20px;
  margin-right: 5px;
}
.price {
  margin-left: 30px;
  flex: 1;
}
.calculate {
  width: 90px;
  background: var(--color-tint);
  color: #fff;
  text-align: center;
}
</style>
