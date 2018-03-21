<template>
  <div class="ratings" ref='ratings'>
    <div class="ratings-content">
        <div class="overview">
            <div class="overview-left">
                <p class="score">{{seller.score}}</p>
                <p class="text">综合评分</p>
                <p class="higher">高于周边商家 <span>{{seller.rankRate}}%</span></p>
            </div>
            <div class="overview-right">
              <div class="content">
                <span class="title">服务态度 </span>
                <div class="star-box">
                  <star :size='36' :score='seller.serviceScore'></star>
                </div>
                <span class="count">{{seller.serviceScore}}</span>
              </div>
              <div class="content">
                <span class="title">服务态度 </span>
                <div class="star-box">
                  <star :size='36' :score='seller.score'></star>
                </div>
                <span class="count">{{seller.score}}</span>
              </div>
              <div class="content">
                <span class="title">送达时间 </span>
                <div class="star-box">
                  <span class="deliveryTime">{{seller.deliveryTime}}分钟</span>
                </div>
              </div>
            </div>
        </div>
        <split></split>
        <ratingselect :ratings='ratings' :select-type='selectType' :desc='desc' :only-content='onlyContent' @selRatings='filterRatings' @isContent='isContent'></ratingselect>
        <div class="rating-wrapper">
          <ul>
            <li class="rating-item" v-for='(item,index) in ratings' :key='index' v-show='needShow(item.rateType,item.text)'>
              <div class="avatar">
                <img :src="item.avatar" width='28' height='28' alt="">  
              </div>
              <div class="content">
                <h2 class="title">{{item.username}} <span class="order-date">{{item.rateTime | formatDate}}</span> </h2>
                <div class="deliverytime">
                  <star class="score" :size='24' :score='item.score'></star>
                  <span class="time">{{item.deliveryTime}}分钟送达</span>
                </div>
                <p class="text">{{item.text}}</p>
                <p class="recommend" v-show='item.recommend.length !== 0'>
                  <i :class="{'icon-thumb_up':item.rateType===0,'icon-thumb_down':item.rateType===1}"></i>
                  <a class="text" v-for='(recommend,index) in item.recommend' :key='index'>{{recommend}}</a>
                </p>
              </div>
            </li>
          </ul>
        </div>
    </div>
  </div>
</template>
<script type='text/ecmascript-6'>
import BScroll from 'better-scroll'
import {formatDate} from '../../common/js/date.js'
import star from '../star/star'
import split from '../split/split'
import ratingselect from '../ratingselect/ratingselect'
const ERR_OK=0;
const POSITVE =0; //正面赞赏评价
const MEGATIVE =1; // 负面差评
const ALL = 2; // 全部评价
export default {
  props:{
    seller:{
      type:Object
    }
  },
  data() {
    return {
      ratings:[],
      selectType:ALL,
      onlyContent:true,
      desc:{
        all:'全部',
        positive:'满意',
        negative:'不满意'
      }
    }
  },
  filters:{
    formatDate(time){
        let date= new Date(time);
        return formatDate(date,'yyyy-MM-dd hh:mm');
    }
  },
   created(){
    this.$http.get('/api/ratings').then((res) => {
        if(res.data.errno===ERR_OK){
          this.ratings=res.data.data;
          this.$nextTick(()=>{
            this._initscroll();
          })
        }
    }).catch((error) => {
        console.log(error);
    })
  },
  methods:{
    _initscroll(){
      if(!this.scroll){
          this.scroll=new BScroll(this.$refs.ratings,{
              click:true
          });
      }else{
          this.scroll.refresh();
      }
    },
    filterRatings(type){
      this.selectType= type;
      this.$nextTick(()=>{
        this.scroll.refresh();
      })
    },
    isContent(b){
      this.onlyContent=b;
      this.$nextTick(()=>{
        this.scroll.refresh();
      })
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
  components:{
    star,
    split,
    ratingselect
  }
}
</script>

<style lang='stylus'>
@import '../../common/stylus/mixin';
.ratings
  position absolute
  top 174px
  width 100%
  left 0
  bottom 0
  overflow hidden
  .overview
    padding 18px 0
    font-size 0
    box-sizing border-box
    display flex
    .overview-left
      text-align center
      width 137px
      flex 0 0 137px
      border-right 1px solid rgba(7,17,27,0.1)
      @media only screen and (max-width:320px)//适配320px以下小屏
        flex:0 0 120px
        width:120px
      .score
        font-size 24px
        color rgb(255,153,0)
        line-height 28px
        margin-bottom 6px
      .text
        font-size 12px
        color rgb(7,17,27)
        line-height 12px
        margin-bottom 8px
      .higher
        font-size 10px
        color rgb(147,153,159)
        line-height 10px
        margin-bottom 6px
        span 
          font-weight bold
    .overview-right
      flex 1
      padding 6px 0 0 24px
      font-size 0
      @media only screen and (max-width:320px)//适配320px以下小屏
        padding 6px
      .content
        &:nth-child(2)
          margin 8px 0
      .title
        display inline-block
        font-size 12px
        color rgb(7,17,27)
        line-height 18px
        vertical-align top  
      .star-box
        display inline-block
        vertical-align top  
        margin 0 12px
        @media only screen and (max-width:320px)//适配320px以下小屏
          margin 0 6px
        .deliveryTime
          font-size 12px
          color rgb(147,153,159)
          line-height 18px
      .count 
        font-size 12px
        color rgb(255,153,0)
        line-height 18px
        display inline-block
        vertical-align top
  .rating-wrapper
    padding 0 18px
    .rating-item
      padding 18px 0
      font-size 0
      display flex
      border-1px(rgba(7,17,27,0.1))
      .avatar
        width 28px
        flex 0 0 28px
        margin-right 12px
        img 
          border-radius 50%
      .content
        flex 1
        .title
          font-size 10px
          color rgb(7,17,27)
          margin-bottom 4px
          .order-date
            float right 
            color rgb(147,153,159)
            font-size 10px
            font-weight 200
            line-height 12px
        .deliverytime
          margin-bottom 6px
          .score
            display inline-block
          .time
            color rgb(147,153,159)
            font-size 10px
            font-weight 200
            line-height 12px
        .text
          font-size 12px
          color rgb(7,17,27)
          line-height 18px
          margin-bottom 8px
        .recommend
          i
            font-size 12px
            display inline-block
            vertical-align top
            line-height 16px
            margin-right 8px
            &.icon-thumb_up
              color rgb(0,160,200)
            &.icon-thumb_down
              color rgb(183,187,191)
          .text
            display:inline-block
            width:70px
            box-sizing:border-box
            margin-right:8px
            padding:0 6px
            border:1px solid rgba(7,17,27,0.1)
            border-radius:1px
            background:#fff
            text-align:center
            overflow:hidden
            text-overflow:ellipsis
            white-space:nowrap
            font-size:9px
            line-height:16px
            color:rgb(147,153,159)


</style>
