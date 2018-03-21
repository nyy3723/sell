<template>
    <span class='icon' :class="classMap[iconType]"></span>
</template>
<script type='text/ecmascript-6'>
export default {
  props:{
      iconType:{
          type:Number
      }
  },
  created(){
    this.classMap = ['decrease','discount','special','invoice','guarantee']
  }
}
</script>

<style lang='stylus'>
@import '../../common/stylus/mixin'
.icon
    vertical-align top
    display inline-block
    width 12px
    height 12px
    margin-right 4px
    background-size 12px
    background-repeat no-repeat
    &.decrease
        bg-image('decrease_1') 
    &.discount
        bg-image('discount_1')
    &.guarantee
        bg-image('guarantee_1')
    &.invoice
        bg-image('invoice_1')
    &.special
        bg-image('special_1')
</style>
