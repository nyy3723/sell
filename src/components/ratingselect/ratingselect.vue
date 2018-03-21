<template>
  <div class="ratingselect">
      <div class="rating-type border-1px">
          <span @click='select(2,$event)' class="block positive" :class="{'active':selectType===2}">{{desc.all}}<span class="count">{{ratings.length}}</span></span>
          <span @click='select(0,$event)'  class="block positive" :class="{'active':selectType===0}">{{desc.positive}}<span class="count">{{positives.length}}</span></span>
          <span @click='select(1,$event)' class="block negative" :class="{'active':selectType===1}">{{desc.negative}}<span class="count">{{negatives.length}}</span></span>
      </div>
      <div @click="toggleContent" class="swtich" :class="{'on':onlyContent}">
          <span class="icon-check_circle"></span>
          <span class="text"> 只看有内容的评价</span>
      </div>
  </div>
</template>
<script type='text/ecmascript-6'>
const POSITVE =0; //正面赞赏评价
const NEGATIVE =1; // 负面差评
const ALL = 2; // 所有差评
export default {
    props:{ //接受父组件传入进来的参数
        ratings:{
            type:Array,
            default(){
                return []
            }
        },
        selectType:{
            type:Number,
            default :ALL
        },
        onlyContent:{
            type :Boolean,
            default:false
        },
        desc:{
            type:Object,
            default(){
                return{
                    all:'全部',
                    positive:'满意',
                    negative:'不满意'
                }
            }
        }
    },
    computed: {
        positives() { //过滤好评的
            return this.ratings.filter((item) => {
                return item.rateType === POSITVE;
            });
        },
        negatives() { //过滤吐槽的
            return this.ratings.filter((item) => {
                return item.rateType === NEGATIVE;
            });
        }
    },
    methods:{
        select(type,event){
            if (!event._constructed) { //去掉自带的click事件点击，即pc端直接返回
                return;
            }
            this.selectType = type;
            // 自定义事件，并向父级传输数据
            this.$emit('selRatings', this.selectType);
        },
        toggleContent(event){
            if (!event._constructed) { //去掉自带的click事件点击，即pc端直接返回
                return;
            }
            this.onlyContent = !this.onlyContent;
            // 自定义事件，并想父级传输数据
            this.$emit('isContent', this.onlyContent);
        }
    }
}
</script>

<style lang='stylus'>
@import '../../common/stylus/mixin';
.ratingselect
    .rating-type
        padding 18px 0;
        margin 0 18px
        border-1px(rgba(7,17,27,.1))
        font-size 0
        .block
            padding 8px 12px
            border-right 2px
            margin-right 8px
            border-radius 1px
            color rgb(77,85,93)
            font-size 12px
            &.active
                color #fff
            .count
                font-size 8px //浏览器中看不了小于12px的字体
                margin-left 2px
            &.positive
                background rgba(0,160,220,.2)
                &.active
                    background rgb(0,160,220)
            &.negative
                background rgba(77,85,93,.2)
                &.active
                    background rgb(77,85,93)
    .swtich
        padding 12px 18px
        line-height 24px
        border-bottom 1px solid rgba(7,17,27,0.1)
        color rgb(147,153,159)
        font-size 0
        &.on
            .icon-check_circle
                color #00c850
        .icon-check_circle,.text
            display inline-block
            vertical-align top
        .icon-check_circle
            font-size 24px
            margin-right 4px
        .text
            font-size 12px

</style>
