<template>
    <transition name="move">
        <div class="food" v-show='showFlag' ref='food'>
            <div class="food-content">
                <div class="image-header">
                    <img :src="food.image" alt="商品图片">
                    <div class="back" @click='hideFood()'>
                        <i class="icon-arrow_lift"></i>
                    </div>
                </div>
                <div class="content">
                    <div class="title">{{food.name}}</div>
                    <div class="detail">
                        <span class="sell-count">月售{{food.sellCount}}</span>
                        <span class="sell-count">好评率{{food.rating}}%</span>
                    </div>
                    <div class="price">
                        <span class="now">¥{{food.price}}</span><span class="old" v-show='food.oldPrice'>¥{{food.oldPrice}}</span>
                    </div>
                    <div class="cartcontrol-wrapper">
                        <cartcontrol :food='food'></cartcontrol>
                    </div>
                    <div class="buy" @click.stop='addFirst' v-show='!food.count || food.count ===0'>加入购物车</div>
                </div>
                <split v-show='food.info'></split>
                <div class="info" v-show='food.info'>
                    <h1 class="title">商品介绍</h1>
                    <p class="text">{{food.info}}</p>
                </div>
                <split></split>
                <div class="rating">
                    <h1 class="title">商品评价</h1>
                    <!-- @ 就是v-on 父组件监听子组件 -->
                    <ratingselect :select-type='selectType' :only-content='onlyContent' :desc='desc' :ratings='food.ratings' @selRatings='filterRatings' @isContent='isContent'></ratingselect>
                    <div class="ratings-wrapper">
                        <ul v-show='food.ratings && food.ratings.length'>
                            <li v-show='needShow(rating.rateType,rating.text)' v-for='rating in food.ratings' :key='rating.index' class='rating-item border-1px'>
                                <div class="user">
                                    <span class="name">{{rating.username}}</span>
                                    <img  class='avatar' :src="rating.avatar" width='12' height='12' alt="">
                                </div>
                                <div class="time">{{rating.rateTime | formatDate}}</div>
                                <p class="text">
                                    <span :class="{'icon-thumb_up':rating.rateType===0,'icon-thumb_down':rating.rateType===1}"></span>{{rating.text}}
                                </p>
                            </li>
                        </ul>
                        <div class="no-ratings" v-show='!food.ratings || !food.ratings.length'>暂无评价</div>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>
<script type='text/ecmascript-6'>
import BScroll from 'better-scroll'
// 引入模块
import {formatDate} from '../../common/js/date.js'
import cartcontrol from '../cartcontrol/cartcontrol'
import ratingselect from '../ratingselect/ratingselect'
import split from '../split/split'
import Vue from 'vue'
const POSITVE =0; //正面赞赏评价
const MEGATIVE =1; // 负面差评
const ALL = 2; // 全部评价
export default {
    props:{
        food:{
            type:Object
        }
    },
    data () {
        return {
            showFlag:false,
            selectType : ALL,
            onlyContent:false,
            desc:{
                all:'全部',
                positive:'推荐',
                negative:'吐槽'
            }
        }
    },
    methods: {
        show() {  //该方法被父组件goods调用
            this.showFlag = true
            this.onlyContent = false
            this.selectType = MEGATIVE
            this.$nextTick(()=>{
                if(!this.scroll){
                    this.scroll=new BScroll(this.$refs.food,{
                        click:true
                    });
                }else{
                    this.scroll.refresh();
                }
            })
        },
        hideFood(){
            this.showFlag=!this.showFlag;
        },
        addFirst(event){ //添加第一个商品 
            if(event._contrusted){  //防止pc多次点击
                return
            }
            Vue.set(this.food,'count',1)
        },
        isContent(b){ //查看只有内容的评价
            this.onlyContent=b;
            this.$nextTick(()=>{
                this.scroll.refresh();
            })
        },
        filterRatings(type) { // 获取子组件点击事件传递过来的数据 过滤 好评或者差评
            this.selectType = type;
            this.$nextTick(() => {
                this.scroll.refresh();
            });
        },
        needShow(type,text){
            if(this.onlyContent && !text){ // 判断 如果查看有内容为true 同事 内容又为false 则返回 false 不显示
                return false;
            }
            if(this.selectType === ALL){ // 如果是查看所有 先返回true 
                return true  
            }else{ // 否则 返回type 和 selectType 一样的
                return type === this.selectType;
            }
        }
    },
    filters:{
        formatDate(time){
            let date= new Date(time);
            return formatDate(date,'yyyy-MM-dd hh:mm');
        }
    },
    components:{
        cartcontrol,
        split,
        ratingselect
    }
}
</script>
<style lang='stylus'>
@import '../../common/stylus/mixin';
.food
    position fixed
    left 0
    top 0
    bottom 48px
    z-index 5
    width 100%
    background #ffffff
    transform translate3d(0,0,0)
    transition:all 0.2s linear
    &.move-enter-active, &.move-leave-active
        transform translate3d(100%,0,0)
    .image-header
        position relative
        width 100%
        height 0
        // padding值为100% 相对于盒子的宽度100% 看起来就是一个正方形
        padding-top 100%
        img 
            position absolute
            top 0
            left 0
            width 100%
            height 100%
        .back
            position absolute
            top 10px
            left 0
            .icon-arrow_lift
                display block
                padding 10px
                font-size 20px
                color #fff
    .content
        padding 18px
        position relative
        .title
           font-weight 700
           line-height 14px
           margin-bottom 8px
           font-size 14px
           color rgb(7,17,27)
        .detail
            font-size 0
            margin-bottom 18px
            line-height 10px
            height 10px
            .sell-count,.rating
                color rgb(147,153,159)
                font-size 10px
            .sell-count
                margin-right 12px
        .price
          font-weight 700
          line-height 24px
          .now
            font-size 14px
            margin-right 8px
            color rgb(240,20,20)
          .old
            font-size 10px
            color rgb(147,153,159)
            text-decoration line-through
        .cartcontrol-wrapper
            position absolute
            right 12px
            bottom 12px
        .buy
            position absolute
            right 18px
            bottom 18px
            z-index 10
            height 24px
            line-height 24px
            padding 0 12px
            box-sizing border-box
            font-size 10px
            color #ffffff
            background rgb(0,160,220)
            border-radius 12px 
    .info
        padding 18px
        .title
            font-size 14px
            margin-bottom 6px
            line-height 14px
            color rgb(7,17,27)
        .text
            color rgb(77,85,93)
            line-height 24px
            font-size 12px
            padding 0 8px
    .rating
        padding-top 18px
        .title
            line-height 14px
            margin-left 18px
        .ratings-wrapper
            padding 0 18px
            .rating-item
                position relative
                padding  16px 0
                border-1px(rgba(7,17,27,.2)) 
                .user
                    position absolute
                    right 0
                    top 16px
                    font-size 0
                    line-height 12px
                    .name
                        margin-right 6px
                        font-size 10px
                        color rgb(147,153,159)
                        display inline-block
                    .avatar
                        border-radius 50%
                .time
                    font-size 10px
                    color rgb(147,153,159) 
                    margin-bottom 6px
                    line-height 12px
                .text
                    font-size 12px
                    color rgb(7,17,27)
                    line-height 16px
                    vertical-align top
                    span
                        font-size 16px
                        margin-right 4px
                        display inline-block
                        vertical-align top
                    .icon-thumb_down
                        color rgb(147,153,159) 
                    .icon-thumb_up
                        color rgb(0,160,220)
            .no-ratings
                padding  16px 0
                font-size 12px
                color rgb(147,153,159)

</style>
