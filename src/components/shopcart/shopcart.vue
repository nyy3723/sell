<template>
<div class="wrapper">
 <div class="shopcart">
    <div class="content" @click='toggleList()'>
        <div class="content-left">
            <div class="logo-wrapper">
                <div class="logo" :class="{'highlight':totalCount>0}">
                    <i class="icon-shopping_cart" :class="{'highlight':totalCount>0}"></i>
                </div>
                <div class="num" v-show='totalCount>0'>{{totalCount}}</div>
            </div>
            <div class="price" :class="{'highlight':totalCount>0}">¥{{totalPrice}}</div>
            <div class="desc">另需配送费¥{{deliveryPrice}}元</div>
        </div>
        <div class="content-right" @click.stop="pay">
            <div class="pay" :class="payClass">
               {{payDesc}}
            </div>
        </div>
    </div>
    <transition name='fold'>
     <div class="shopcart-list" v-show='listShow'>
        <div class="list-header">
            <h1 class="title">购物车</h1>
            <span class="empty" @click='empty()'>清空</span>
        </div>
        <div class="list-content" ref='listContent'>
            <ul>
                <li class="food" v-for="food in selectFoods">
                    <span class="name">{{food.name}}</span>
                    <div class="price">
                        <!-- <span>{{food}}</span> -->
                        <span>¥ {{food.price}}</span> 
                    </div>
                    <div class="cartcontrol-wrapper">  
                        <cartcontrol :food='food'></cartcontrol>
                    </div>
                </li>
            </ul>
        </div>
    </div>
    </transition>
  </div>
  <transition name="fade">
    <div class="list-mask" @click="hideList()" v-show="listShow"></div>
  </transition>
</div>
 
</template>
<script type='text/ecmascript-6'>
import BScroll from 'better-scroll'
import cartcontrol from '../cartcontrol/cartcontrol'
export default {
    // 接受父组件的信息
    props:{
        selectFoods:{ //接受选择的商品
            type:Array, //类型为数组时需要加个默认的返回值
            default(){
                return [];
            }
        },
        deliveryPrice:{
            type:Number
        },
        minPrice:{
            type:Number
        }
    },
    data() {
        return {
            fold:true,
        }
    },
    computed: {
        totalPrice(){ //计算商品总价
            let total = 0;
            this.selectFoods.forEach((food)=>{
                total += food.price * food.count
            })
            return total;
        },
        totalCount(){ //所选商品的总和
            let count = 0
             this.selectFoods.forEach((food)=>{
                count +=  food.count
            })
            return count;
        },
        payDesc(){ //看是否达到起送价 
            if(this.totalPrice===0){ 
                return `¥${this.minPrice}元起送`
            }else if(this.totalPrice <this.minPrice){
                 return `还差¥${this.minPrice - this.totalPrice}元起送`
            }else {
                return '去结算';
            }
        },
        payClass(){ //未达到起送价和达到起送价 对应的不同的样式
            if(this.totalPrice <this.minPrice){
                return 'not-enough'
            }else{
                return 'enough'
            }
        },
        listShow(){
            if(!this.totalCount){
                this.fold=true;
                return false
            }
            let show=!this.fold;
            if (show){
                this.$nextTick(()=>{
                    if(!this.scroll){
                        this.scroll = new BScroll(this.$refs.listContent,{
                            click:true
                        });
                    }else{
                         this.scroll.refresh() //有就刷新 没有就重新声明
                    }
                })
            }
            return show;
        }

    },
    methods: {
        toggleList(){
            if(!this.totalCount){
                return 
            }
           this.fold=!this.fold;
        },
        empty(){
            this.selectFoods.forEach((food)=>{
                food.count=0
            })
        },
        hideList(){
            this.fold=!this.fold;
        },
        pay(){
            if(this.totalPrice<this.minPrice){
                return;
            }
            window.alert(`支付${this.totalPrice}元`)
        }
    },
    components: {
        cartcontrol
    }
}
</script>
<style lang='stylus'>
@import '../../common/stylus/mixin'
.shopcart
    position fixed
    height 48px
    width 100%
    left 0
    bottom 0
    z-index 10
    .content
        background #141d27
        display flex
        font-size 0
        color rgba(255,255,255,.4)
        .content-left
            flex 1 
            .logo-wrapper,.price,.desc
                display inline-block
                vertical-align top
            .logo-wrapper
                position relative
                top -10px
                margin 0 12px
                padding 6px
                width 56px
                height 56px
                box-sizing border-box
                border-radius 50%
                background #141d27
                .logo
                    width 100%
                    height 100%
                    border-radius 50%
                    background #2b343c
                    text-align center
                    &.highlight
                        background rgb(0,160,220)
                    .icon-shopping_cart
                        font-size 24px
                        color #80858a
                        line-height 44px
                        &.highlight
                            color #fff
                .num
                    position absolute
                    top 0
                    right 0
                    width 24px
                    height 16px
                    line-height 16px
                    text-align center
                    font-size 9px
                    border-radius 16px
                    color #fff
                    font-weight 700
                    background rgb(240,20,20)
                    box-shadow 0 4px 8px 0 rgna(0,0,0,.4)
            .price
                font-size 16px
                margin-top 12px
                line-height 24px
                padding-right  12px
                box-sizing border-box
                font-weight 700
                border-right 1px solid rgba(255,255,255,.1)
                &.highlight
                    color #fff
            .desc
                font-size  10px
                line-height 24px
                margin 12px 0 0 12px
        .content-right
            flex 0 0 105px
            width 105px
            text-align center
            .pay
                height 48px
                line-height 48px
                font-size 12px
                font-weight 700
                &.not-enough
                    background #2b333b 
                &.enough
                    background #00b43c
                    color #fff
    .shopcart-list
        background #ffffff
        position absolute
        z-index -1
        width 100%
        top 0
        left 0
        transition  all .3s
        transform translate3d(0,-100%,0)
        &.fold-enter-active,&.fold-leave-active
            transform translate3d(0,0,0)
        .list-header
            height 40px
            line-height 40px
            padding 0 18px
            background #f3f5f7
            border-bottom 1px solid rgbs(7,17,07,0.1)
            .title
                float left 
                font-size 14px
                color rgb(7,17,27)
            .empty
                float right
                font-size 12px
                color rgb(0,160,220)
        .list-content
            padding 0 18px
            max-height 217px
            overflow hidden
            background #fff
            .food
                border-1px(rgba(7,17,27,.1)) 
                position relative
                padding 12px 0
                box-sizing border-box
                .name
                    line-height 24px
                    color rgb(7,17,27)
                    font-size 14px
                .price
                    position absolute
                    right 90px
                    bottom 12px
                    line-height 24px
                    font-size 14px
                    font-weight 700
                    color rgb(240,20,20)
                .cartcontrol-wrapper
                    position absolute
                    right 0
                    bottom 6px
.list-mask
    position fixed
    top 0
    left 0
    width 100%
    height 100%
    background rgba(7,17,27,0.6)
    backface-visibility 10px
    &.fade-enter-active, &.fade-leave-active
      transition:all 0.3s ease
      opacity 1
      background  rgba(7,17,27,0.6) 
    &.fade-enter, &.fade-leave-active
      opacity: 0 
</style>
