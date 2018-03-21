<template>
  <div class="seller" ref='sellerWrapper'>
    <div class="seller-wrapper">
      <div class="desc">
        <div class="seller-box">
          <h1 class="title">{{seller.name}}</h1>
          <div class="desc-content">
            <star :size='36' :score='seller.score'></star>
            <span class="text">({{seller.rankRate}})</span>
            <span class="text">月售{{seller.sellCount}}单</span>
          </div>
          <div class="favorite"  @click="torggleFacorite">
            <i class="icon-favorite" :class="{'active':isFavorite}"></i>
            <p>{{favoriteText}}</p>
          </div>
        </div>
        <div class="remark">
          <ul>
            <li>
              <p class="title">起送价</p>
              <p class="val"><span>{{seller.minPrice}}</span>元</p>
            </li>
            <li>
              <p class="title">商家配送</p>
              <p class="val"><span>{{seller.deliveryPrice}}</span>元</p>
            </li>
            <li>
              <p class="title">平均配送时间</p>
              <p class="val"><span>{{seller.deliveryTime}}</span>元</p>
            </li>
          </ul>
        </div>
      </div>
      <split></split>
      <div class="bulletin">
        <h1 class="title">公告与活动</h1>
        <p class="text">{{seller.bulletin}}</p>
        <ul class="supports-wrapper">
          <li class="supports-item" v-for="(item,index) in seller.supports" :key='index'>
            <icon :icon-type='item.type'></icon>
            <span class="desc">{{item.description}}</span>
          </li>
        </ul>
      </div>
      <split></split>
      <div class="seller-pics">
        <h1 class="title">商家实景</h1>
        <div class="pic-wrapper" ref='picsWrapper'>
          <ul class="pic-list" ref='piclist'>
            <li class="pic-item" v-for="(item,index) in seller.pics" :key='index'>
              <img class="pic" :src="item" alt="" height="90" width="120">
            </li>
          </ul>
        </div>
      </div>
      <split></split>
      <div class="seller-info">
        <h1 class="title">商家信息</h1>
        <ul class="info-list">
          <li class="info-item" v-for='(item,index) in seller.infos' :key='index'>{{item}}</li>
        </ul>
      </div>
      <shopcart :delivery-price='seller.deliveryPrice' :min-price='seller.minPrice'></shopcart>
    </div>
  </div>
</template>
<script type='text/ecmascript-6'>
import BScroll from 'better-scroll'
import star from '../star/star'
import split from '../split/split'
import icon from '../iconClassMap/iconClassMap'
import shopcart from '../shopcart/shopcart'
export default {
  props:{
    seller:{
      type:Object
    }
  },
  data(){
    return{
      isFavorite:false
    }
  },

  watch:{
    'seller'(){ //监控props里面的seller数据变化
      this.$nextTick(() => {
        console.log(this.seller);
        this._initScorll();
        this._initPicScroll();
      })
    }
  },
  mounted(){
    this.$nextTick(() => {
      this._initScorll();
      this._initPicScroll();
    })
  },
  methods:{
    _initScorll(){
      if(!this.scroll){
          this.scroll=new BScroll(this.$refs.sellerWrapper,{
              click:true
          });
        }else{
          this.scroll.refresh();
        }
    },
    _initPicScroll(){ //图片的横向滚动
      if(this.seller.pics){
        let picW = 120,
        margin=6,
        w = (picW+margin)*this.seller.pics.length-margin;
        this.$refs.piclist.style.width = w +'px'
        this.$nextTick(()=>{
          if(!this.picScroll){
            this.picScroll=new BScroll(this.$refs.picsWrapper,{
              scrollX:true,
              eventPassthrough:'vertical', //横向滚动
              click:true
            })
          }else{
            this.pics.refresh();
          }
        })
      }
    },
    torggleFacorite(event){
      if (!event._constructed) {
        return
      }
      this.isFavorite = !this.isFavorite;
      // 将状态缓存到localstorage
      localStorage.setItem('isFavorite',this.isFavorite)
    }
  },
  computed:{
    favoriteText(){
      return this.isFavorite?'已收藏':'收藏'
    }
  },
  components:{
    star,split,icon,shopcart
  },
}
</script>

<style lang='stylus'>
@import '../../common/stylus/mixin'
.seller
  position absolute
  width 100%
  top 174px
  left 0
  bottom 0
  overflow hidden
  .desc
    .seller-box
      position relative
      padding 18px
    .title
      font-size 14px
      color rgb(7,17,27)
      line-height 14px
      margin-bottom 8px
    .desc-content
      .star,.text
        display inline-block
        vertical-align top
      .star
        margin-right 8px
      .text
        font-size 10px;
        color rgb(77,85,93)
        line-height 18px
        &:nth-child(2)
          margin-right 12px
    .favorite
      width 40px
      text-align center  
      position absolute
      right 18px
      top 20px
      i
        display inline-block
        color rgb(147,153,159)
        font-size 24px
        margin-bottom 4px
        &.active
          color rgb(240,20,20)
      p
        font-size 10px
        color rgb(77,85,93)
        line-height 10px
    .remark
      padding 18px
      ul
        padding-top 18px
        display flex
        box-sizing border-box
        border-top 1px solid rgba(7,17,27,.1)
        li
          flex 1
          text-align center 
          &:not(:last-child)
            border-right 1px solid  rgba(7,17,27,0.1)
          .title
            font-size 10px
            color rgb(147,153,159)
            line-height 10px
            margin-bottom 4px
          .val
            font-weight 200
            color rgb(7,17,27)
            line-height 24px
            font-size 10px
            span 
              font-size 24px
  .bulletin
    font-size 0
    padding 0 18px
    .title
      font-size 14px
      padding-top 18px
      color rgb(7,17,27)
      margin-bottom 8px
    .text
      padding 0 12px 16px 12px
      font-size 12px
      color rgb(240,20,20)
      line-height 24px
      border-1px(rgba(7,17,27,.1))
    .supports-wrapper
      font-size 0
      .supports-item
        border-1px(rgba(7,17,27,.1))
        padding 16px 12px
        .icon 
          width 16px
          height 16px
          background-size 16px
        .desc
          font-size 12px
          font-weight 200
          color rgb(7,17,27)
          line-height 16px
  .seller-pics
    padding 18px 0 18px 18px
    .title
      font-size 14px
      color rgb(7,17,27)
      line-height 14px
      margin-bottom 12px
    .pic-wrapper
      width:100%
      overflow:hidden
      white-space:nowrap
      .pic-list
        font-size 0
        .pic-item
          display inline-block
          margin-right 6px
          width 120px
          height 90px
          &:last-child
            margin 0
  .seller-info
    padding 18px 0 18px 18px
    .title
      font-size 14px
      color rgb(7,17,27)
      line-height 14px
      padding-bottom 12px
      border-1px(rgba(7,17,27,.1))
    .info-list
      .info-item
        font-size 12px
        font-weight 200
        color rgb(7,17,27)
        line-height 16px
        padding 16px 12px
        &:not(:last-child)
          border-1px(rgba(7,17,27,.1))






    

</style>
