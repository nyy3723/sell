<template>
  <!-- 商品加减按钮的组件 -->
  <div class="cartcontrol">
      <!-- <div class="cart-descrease" v-show='food.count>0'></div> -->
       <transition name='move'>
        <div class="cart-descrease"  v-show='food.count>0'  @click.stop="desCart($event)">
            <span class="inner"><i class="icon-remove_circle_outline"></i></span>
        </div>
       </transition>
      <div class="count"  v-show='food.count>0'>{{food.count}}</div>
      <div class="cart-add" @click.stop="addCart($event)">
          <i class="icon-add_circle"></i>
      </div>
  </div>
</template>
<script type='text/ecmascript-6'>
import Vue from 'vue'
export default {
    props:{
        food:{
            type :Object
        }
    },
    methods:{
        addCart(event){
            if(!event._constructed){ //解决pc端 点击会出现两个index
                return;
            }
            if(!this.food.count){
                // 向food数据中插入count属性
                Vue.set(this.food,'count',1);
            }else{
                this.food.count++;
            }
        },
        desCart(event){
            if(!event._constructed){ //解决pc端 点击会出现两个index
                return;
            }
           if(this.food.count>=0){
               this.food.count--;
           }
        }
    }
}
</script>

<style lang='stylus'>
.cartcontrol
    font-size 0
    .cart-descrease,.count,.cart-add
        display inline-block
    .cart-descrease,.cart-add
        padding 6px
        font-size 24px
        color rgb(0,160,220)
    .cart-descrease
        transition all 0.4s linear
        &.move-transition
            opacity 1
            transform translate3d(0,0,0)
            .inner
                display inline-block
                transition all 0.4s linear
                transform rotate(0) 
        &.move-enter, &.move-leave
            opacity 0
            transform translate3d(24,0,0) 
            .inner
                transform rotate(180deg) 
        // &.fade-enter, &.fade-leave-active
    .count
        font-size 10px
        vertical-align top
        width 12px
        padding-top 6px
        line-height 24px
        text-align center
        color rgb(147,153,159)
</style>
