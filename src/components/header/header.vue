<template>
  <div class="header">
    <div class="content-wrapper">
      <div class="avatar">
        <img :src="sellers.avatar">
      </div>
      <div class="content">
        <div class="title">
          <span class="brand"></span>
          <span class="name">{{sellers.name}}</span>
        </div>
        <div class="description">
          {{sellers.description}}/{{sellers.deliveryTime}}/分送达
        </div>
        <div v-if='sellers.supports' class="support">
          <span class="icon" :class="this.classMap[sellers.supports[0].type]"></span>
          <span class="text">{{sellers.supports[0].description}}</span>
        </div>
      
      </div>
      <div v-if='sellers.supports' class="support-count" @click="showDetail()">
        <span class="count">{{sellers.supports.length}}个</span>
        <i class="icon-keyboard_arrow_right"></i>
      </div>
    </div>
    <div class="bulletin-wrapper" @click="showDetail()">
      <span class="bulletin-title"></span>
      <span class="bulletin-text">{{sellers.bulletin}}</span>
      <i class="icon-keyboard_arrow_right"></i>
    </div>
    <div class="background">
      <img :src="sellers.avatar" width="100%">
    </div>
    <!-- 弹出的浮层 -->
    <transition name='fade'>
      <div v-show='detailShow' class="detail">
      <div class="detail-wrapper clearfix">
        <div class="detail-main">
          <h1 class="name">{{sellers.name}}</h1>
          <div class="star-wrapper">
            <v-star :size='48' :score='sellers.score'></v-star>
          </div>
          <div class="title">
            <div class="line"></div>
            <div class="text">优惠信息</div>
            <div class="line"></div>
          </div>
          <ul v-if="sellers.supports" class="supports">
              <li class="support-item" v-for='(item,index) in sellers.supports' :key='index'>
                <icon :icon-type='item.type'></icon>
                <!-- <span class="icon" :class="classMap[sellers.supports[index].type]"></span> -->
                <span class="text">{{sellers.supports[index].description}}</span>
              </li>
          </ul>
           <div class="title">
            <div class="line"></div>
            <div class="text">商家公告</div>
            <div class="line"></div>
          </div>
          <div class="bulletin">
            <p class="content">{{sellers.bulletin}}</p>
          </div> 
        </div>
      </div>
      <div class="detail-close" @click="hideDetail()">
        <i class="icon-close"></i>
      </div>
      </div>
    </transition>
  </div>
</template>
<script type='text/ecmascript-6'>
import star from '../star/star'
import icon from '../iconClassMap/iconClassMap'
export default { //接收父元素传递的seller数据
  props :{
    sellers:{
      type : Object
    }
  },
  data() {
    return {
      detailShow : false
    };
  },
  methods: {
    showDetail(){
      this.detailShow = true;
    },
    hideDetail(){
      this.detailShow = false;
    }
  },
  created() {
      this.classMap = ['decrease','discount','special','invoice','guarantee']
  },
  components:{
    'v-star':star,
    icon
  }
}
</script>
<style lang='stylus'>
@import '../../common/stylus/mixin';
.header 
  position relative
  color #fff
  overflow hidden
  background rgba(7,17,27,.5)
  .content-wrapper
    font-size 0
    position relative
    padding 24px 12px 18px 24px
    .avatar
      display inline-block
      vertical-align top
      img 
        border-radius 2px
        width 64px
        height 64px
    .content
      display inline-block  
      margin-left 16px
      .title
          margin 2px 0 8px 0
          .brand
            display inline-block
            width 30px
            height 18px
            bg-image('brand')
            vertical-align top
            background-size 30px 18px;
          .name
            margin-left 6px
            font-size 16px
            line-height 18px
            font-weight bold
        .description
          margin-bottom 10px
          line-height 12px
          font-size 12px
        .support
          .text
            line-height 12px
            font-size 12px
    .support-count
      position absolute
      right 12px
      bottom 14px
      padding 0 8px
      height 24px
      line-height 24px
      border-radius 14px
      background rgba(0,0,0,.2)
      text-align center 
      .count
        font-size 10px
      .icon-keyboard_arrow_right
        font-size 10px
        line-height 24px
        margin-left 2px
  .bulletin-wrapper
    font-size 0
    height 28px
    line-height 28px
    padding 0 22px 0 12px
    font-size 10px
    white-space nowrap
    overflow hidden
    text-overflow ellipsis
    background rgba(7,17,27,.2)
    position relative
    .bulletin-title
      vertical-align top
      margin-top  7px
      display inline-block
      width 22px
      height 12px
      bg-image('bulletin')
      background-size 22px 12px
    .bulletin-text
      vertical-align top
      margin 0 4px
      font-size 10px
    .icon-keyboard_arrow_right
      position absolute
      font-size 10px
      right 12px
      top 8px
  .background
    width 100%
    height 100%
    position absolute
    top 0
    z-index -1
    filter blur(10px)
    img
      width 100%
      height 100%
  .detail
    position fixed
    z-index 100
    width 100%
    height 100%
    overflow auto
    background rgba(7,17,27,0.8)
    top 0
    left 0
    backface-visibility 10px
    // 进入 离开的样式 （detail样式的过度）
    &.fade-enter-active, &.fade-leave-active
      transition: all 0.5s ease  
      opacity 1
      background  rgba(7,17,27,0.8) 
    &.fade-enter, &.fade-leave-active
      opacity: 0 
    .detail-wrapper
      width 100%
      min-height 100%
      .detail-main
        margin-top 64px
        padding-bottom 64px 
        .name
          line-height 16px
          text-align center 
          font-weight 700
          font-size 16px
        .star-wrapper
          margin-top 18px
          padding 2px 0
          text-align center
        .title
          display flex
          width 80%
          margin:28px auto
          .line
            position relative
            flex 1
            top -6px
            border-bottom 1px solid rgba(255,255,255,.2)
          .text
            padding 0 12px
            font-size 14px
            font-weight 700
        .supports
          width 80%
          margin 0 auto
          .support-item
            padding 0 12px
            margin-bottom 12px
            font-size 0
            &:last-child
              margin-bottom 0
            .icon
              display inline-block
              width 16px
              height 16px
              vertical-align top
              margin-right 6px
              background-size 16px
              background-repeat no-repeat
              &.decrease
                bg-image('decrease_2') 
              &.discount
                bg-image('discount_2')
              &.guarantee
                bg-image('guarantee_2')
              &.invoice
                bg-image('invoice_2')
              &.special
                bg-image('special_2')
            .text
              font-size 12px
              line-height 16px
        .bulletin
          width 80%
          margin 0 auto
          .content
            padding 0 12px
            line-height 24px 
            font-size 12px
    .detail-close
      position relative
      width 32px
      height 32px
      margin -64px auto 0 auto
      font-size 32px
</style>
