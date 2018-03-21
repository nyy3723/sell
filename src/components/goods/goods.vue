<template>
  <div class="goods">
    <div class="menu-wrapper" ref='menuWrapper'>
      <ul>
        <li v-for='(item,index) in goods' :key="item.id" class="menu-item" :class="{'current':currentIndex === index}" @click="selectMenu(index,$event)">
          <span class="text">
            <span v-show='item.type > 0 ' class="icon" :class="classMap[item.type]"></span>{{item.name}}
          </span>
        </li>
      </ul>
    </div>
    <div class="foods-wrapper" ref='foodsWrapper'>
      <ul>
        <li v-for='item in goods' :key="item.id"  class="foods-list food-list-hook">
          <h1 class="title">{{item.name}}</h1>
          <ul>
            <li @click='selectFood(food,$event)' v-for="food in item.foods"  :key="food.id"   class="food-item border-1px">
              <div class="icon">
                <img :src="food.icon" alt="">
              </div>
              <div class="content">
                <h2 class="name">{{food.name}}</h2>
                <p class="desc">{{food.description}}</p>
                <div class="extra">
                  <span class="count">月售{{food.sellCount}}份</span>
                  <span>好评率{{food.rating}}%</span>
                </div>
                <div class="price">
                  <span class="now">¥{{food.price}}</span>
                  <span class="old" v-show='food.oldPrice'>¥{{food.oldPrice}}</span>
                </div>
                <!-- 传入food商品 -->
                <div class="cartcontrol-wrapper">
                  <cartcontrol :food='food' ></cartcontrol>
                </div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <!-- 购物车 -->
    <!-- 将配送费 起送费传入子组件 -->
    <shopcart :select-foods='selectFoods' :delivery-price='seller.deliveryPrice' :min-price='seller.minPrice'></shopcart>
    <food :food='selectedFood' ref='food'></food>
  </div>
</template>
<script type='text/ecmascript-6'>
import BScroll from 'better-scroll'
import shopcart from '../shopcart/shopcart'
import cartcontrol from '../cartcontrol/cartcontrol'
import food from '../food/food'
const ERR_OK=0;
export default {
  props:{
    seller:{
      type:Object
    }
  },
  data() {
    return {
       goods:[],
       listHeight:[],
       scrollY:0,
       selectedFood:{} //保存选择的商品
    }
  },
  computed:{
    currentIndex(){ //计算到达哪个区域的区间时候的对应的索引值
      for(let i=0;i<this.listHeight.length;i++){
        let height1 =this.listHeight[i];  //当前menu子块的高度
        let height2 =this.listHeight[i+1]; //下一个menu的字块高度
        //滚动到底部的时候height2是undefined 确定是在两个menu字块的高度区间
        if(!height2 || (this.scrollY >= height1 && this.scrollY < height2)){
          return i; //返回这个的menu字块的索引
        }
      }
      return 0;
    },
    selectFoods(){ //选择商品
      let foods=[];
      this.goods.forEach((good)=>{
        good.foods.forEach((food)=>{
          if(food.count){
            foods.push(food);
          }
        })
      })
      return foods;
    }
  },
  created(){
    this.classMap = ['decrease','discount','special','invoice','guarantee']
    this.$http.get('/api/goods').then((res) => {
        if(res.data.errno===ERR_OK){
          this.goods=res.data.data;
          this.$nextTick(()=>{
              this._initScroll();
              this._calcHeight();
            })
        }
    }).catch((error) => {
        console.log(error);
    })
  },
  methods: {
    selectMenu(index,event){
      if(!event._constructed){ //解决pc端 点击会出现两个index
          return;
      }
      let foodList=this.$refs.foodsWrapper.getElementsByClassName('food-list-hook')
      let el=foodList[index];
      this.foodsScroll.scrollToElement(el,300)
    },
    _initScroll() {
      this.menuScroll =new BScroll(this.$refs.menuWrapper,{
        click:true
      });
      this.foodsScroll=new BScroll(this.$refs.foodsWrapper,{
        click:true,
        probeType: 3 //结合BScroll的接口使用,3实时派发scroll事件，探针的作用
      });
      this.foodsScroll.on('scroll',(pos)=>{ //事件的回调函数
         this.scrollY = Math.abs(Math.round(pos.y)) 
      })
     
    },
    _calcHeight() {
      // 获取每一个food的dom对象
      let foodList=this.$refs.foodsWrapper.getElementsByClassName('food-list-hook')
      let height = 0
      this.listHeight.push(height); //初始化第一个高度为0
      for (let i =0; i < foodList.length; i++){
        let item= foodList[i]; //每一个item都是刚才获取的food的每一个dom
        height += item.clientHeight; //主要是为了获取每一个foods内部块的高度
        this.listHeight.push(height); 
      }
    },
    selectFood(food,event){
      console.log(food)
      if(!event._constructed){ //解决pc端 点击会出现两个index
          return;
        }
        this.selectedFood = food;
        this.$refs.food.show(); //调用food组件中的show方法
        // console.log(this.selectedFood)
    }
  },
  components:{
    shopcart,
    cartcontrol,
    food
  }
}
</script>

<style lang='stylus'>
@import '../../common/stylus/mixin';
.goods
  // 商品展示的视口的宽高
  position absolute
  width 100%
  top 174px
  bottom 46px
  overflow hidden
  display flex
  .menu-wrapper
    flex 0 0 80px
    width 80px
    background #f3f5f7
    .menu-item
      display table
      height 54px
      width 56px
      padding 0 12px
      line-height 14px
      &.current
        background #fff
        position relative
        margin-top -1px
        z-index 10
        .text
          border-none()
          font-weight 700
      .icon

        display inline-block
        vertical-align top
        width 12px
        height 12px
        background-size 12px
        margin-right 2px
        &.decrease
          bg-image('decrease_3') 
        &.discount
          bg-image('discount_3')
        &.guarantee
          bg-image('guarantee_3')
        &.invoice
          bg-image('invoice_3')
        &.special
          bg-image('special_3')
      .text
        font-size 12px
        vertical-align middle
        display table-cell
        border-1px(rgba(7,17,27,.1)) 
  .foods-wrapper
    flex 1
    .title
      padding-left 24px
      height 26px
      line-height 26px
      border-left 2px solid #d9dde1
      font-size 12px
      color rgb(147,153,159)
      background #f3f5f7
    .food-item
      display flex
      margin 18px
      padding-bottom 18px
      border-1px(rgba(7,17,27,.1)) 
      &:last-child
        border-none() 
        margin-bottom 0
      .icon
        flex 0 0 57px
        margin-right 10px
        img
          width 100%
      .content
        flex 1
        .name
          margin 2px 0 8px 0
          height 14px
          line-height 14px
          color rgb(7,17,27)
          font-size 14px
        .desc,.extra
          line-height 10px
          font-size 10px
          color rgb(147,153,159)
        .desc
          margin-bottom 8px
          line-height 12px
        .extra
          line-height 10px
          .count
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
          right 0
          bottom 12px
</style>
