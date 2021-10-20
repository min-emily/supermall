import { debouce } from "./utils";
import BackTop from "@/components/content/backTop/BackTop";

// 混入
export const itemListenerMixin = {
  data() {
    return {
      itemImgListener: null,
      refresh: null,
    };
  },
  mounted() {
    this.refresh = debouce(this.$refs.scroll.refresh, 100);
    this.itemImgListener = () => {
      refresh();
    };
    this.$bus.$on("itemImgLoad", this.itemImgListener);
    // console.log("我是混入中的内容");
  },
};

export const backTopMixin = {
  components:{
    BackTop
  },
  data(){
    return{
      isShowBackTop: false
    }
  },
  methods:{
    backClick() {
      // 拿到Scroll.vue内的data属性scroll:null
      // 300:300毫秒内返回到顶部
      // this.$refs.scroll.scroll.scrollTo(0, 0,300);
      this.$refs.scroll.scrollTo(0, 0,300);
    },
  }
};
