<template>
  <div id="app">
     <!-- :sellers='seller' 把seller数据传递给header组件 -->
   <v-header :sellers='seller'></v-header>
    <div class="tab">
      <div class="tab-item"><router-link to="/goods">商品</router-link></div>
      <div class="tab-item"><router-link to="/ratings">评论</router-link></div>
      <div class="tab-item"><router-link to="/seller">商家</router-link></div>
    </div>
    <div class="content">
      <!-- 传递seller组件 -->
      <router-view :seller='seller'></router-view>
    </div>
  </div>
</template>
<script type='text/ecmascript-6'>
import header from './components/header/header.vue';
// import {urlParse} from './common/js/util'
const ERR_OK=0;
export default {
  data() { //函数
    return{
      seller:{ 
        // id:(()=>{ //真实环境下 每个商家都会有个id
        //   let querParam= urlParse();
        //   console.log(querParam)
        //   return querParam.id
        // })() // 立即执行函数
      } 
    }
  },
  created(){
   this.$http.get("/api/seller").then((res) => {
        if(res.data.errno===ERR_OK){
          this.seller=res.data.data;
          console.log(this.seller)
        }
    }).catch((error) => {
        console.log(error);
    })
  },
  components:{
    'v-header':header
  }
}
</script>

<style lang='stylus'>
@import './common/stylus/mixin.styl';
#app
  .tab
    display flex
    height 40px
    line-height 40px
    .tab-item
      flex 1
      text-align center 
      border-1px(rgba(7,17,27,.1)) 
      & > a
        display block
        font-size 14px
        color rgb(77,85,93)
        &.active
          color rgb(240,20,20)
</style>
