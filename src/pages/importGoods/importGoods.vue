<template>
    <div id="app">
        <div class="mainBox ">
            <header class="mint-header">
                <img src="../../assets/img/back.png" alt="" @click="goback">
                <h1 class="mint-header-title ">选择对应商品</h1>
                <div class="kill">提示</div>
            </header>
        </div>
        <div class="createContent">
            <div class="shopQuery">
                <input v-model="goodsName" placeholder="输入商品信息查找" type="text">
                <p @click="searchGoods">搜索</p>
            </div>
        </div>
       <div class="content">
           <div class="shopList" v-for="(item,index) in shopList">
               <img class="shopImg" :src="item.coverImg" alt="">
               <div class="shopTitle">
                   <p class="goodsName">{{item.name}}</p>
                   <div class="shopPrice">
                       <p class="liveName" v-if="item.priceType===1">{{item.targetPrice}}元</p>
                       <p class="liveName" v-if="item.priceType===2">原价：{{item.descPrice}}元</p>
                       <p class="liveName" v-if="item.priceType===2">现价：{{item.targetPrice}}元</p>
                       <p class="liveName" v-if="item.priceType===3">{{item.descPrice}}元-{{item.targetPrice}}元</p>
                   </div>
               </div>
               <img class="shop-select" v-if="item.select" @click="selectedId(index,item)"
                    src="../../assets/img/tg_icon_del_choose.png" alt="">
               <img class="shop-select" @click="selectedId(index,item)" v-else
                    src="../../assets/img/tg_icon_tel_choose.png" alt="">
           </div>
       </div>
        <img class="noneData" v-if="!shopList.length" src="../../assets/img/liveNone.png" alt="">
        <!--新建直播间-->
        <p class="createLive" @click="importGoods" v-if="shopList.length">确定</p>
    </div>
</template>

<script>
    import flexible from "../../../common/lib/flexible/flexible"
    import common from "../../../common/js/common"
    import index from "../../../upms/static/goods_shopper_apply/index"
    import hostUrl from "../../assets/js/apis"
    import request from "../../assets/js/request"

    export default {
        name: 'app',
        components: {},
        data() {
            return {
                // 商家的seq
                shopSeq: 5783708,
                // 按照商品的名称查询
                goodsName: '',
                // 当前选中的code码
                goodCode: '',
                // 商品数据
                shopList: [],
                // 直播间主键
                roomId: 1,
                // 当前请求数据的页码
                goodsPage: 1,
                // 请求每页的数据10条
                limit: 10,
                // 是否还可以加载更多
                goodsLoadMore: true
            }
        },
        created() {
            // 获取url中的参数
            function getUrlParam(name) {
                var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
                var r = window.location.search.substr(1).match(reg);  //匹配目标参数
                if (r != null) return unescape(r[2]);
                return null; //返回参数值
            }

            this.roomId = getUrlParam("id");
            // 获取商品库数据
            this.getUsergoods()
        },
        mounted() {
            // this.selectShop()
            hui.loadMore(this.getUsergoods, '1', '1');
        },
        watch: {
            'goodCode': function (newVal) {
                this.saveLocalStorage("goodCode", newVal)
            }
        },
        methods: {
            // 更改选中商品状态
            selectedId(index) {
                var shopList = this.shopList;
                this.shopList[index].select = !this.shopList[index].select;
                this.$set(shopList, index, this.shopList[index])
            },
            // 获取商品id
            getShopid() {
            },
            // 确定按钮事件
            saveToexamine() {
                console.log("提交审核")
            },
            // 保存数据到缓存
            saveLocalStorage(key, value) {
            },
            // 获取用户商品库数据
            getUsergoods() {
                var that = this;
                var xhr = new XMLHttpRequest();
                // 没有更多数据
                if (!this.goodsLoadMore) {
                    return
                }
                // 请求接口所需要的参数
                var data = {
                    "pageIndex": that.goodsPage,
                    "pageSize": that.limit,
                    "type": 2,   // 1为商品库查询  2为直播间导入商品查询
                    "id": that.roomId,  // 直播间的id
                    goodsName: that.goodsName,  // 商品的名称可传空
                    "seq": localStorage.getItem("seq")
                };
                request("POST", `${hostUrl}/localQuickPurchase/live/goods/list`, data).then(response => {
                    if (response.data && response.data.list) {
                        that.shopList = that.shopList.concat(response.data.list);
                        that.goodsPage = that.goodsPage + 1;
                        hui.endLoadMore();
                    } else {
                        hui.toast("商品数据为空", "short");
                    }
                    // 如果是没有数据的话就禁止加载更多
                    if (response.data.list.length < that.limit) {
                        that.goodsLoadMore = false
                    }
                    hui.loading(false, true);
                })
            },
            // 点击搜索按钮事件
            searchGoods() {
                this.shopList = [];
                this.goodsPage = 1;
                this.goodsLoadMore = true;
                this.getUsergoods();
            },
            // 返回上一级
            goBack() {
                // 更改完状态跳转
                this.goback()
            },
            // 返回上层
            goback: function () {
                try {
                    //判断是否是app
                    var u = navigator.userAgent;
                    var isappwebview = u.indexOf('app_webview') > -1;
                    // 如果不是app打开的  则返回首页
                    if (isappwebview) {
                        try {
                            //如果没有上一页尝试返回原生
                            // 调app原生返回  webview
                            window.action.app_back();
                        } catch (e) {
                        }
                        try {
                            var json = {
                                'function': 'goBack'
                            };
                            window.webkit.messageHandlers.goBack.postMessage(json);
                        } catch (e) {
                        }
                    } else {
                        window.location.href = "./operManagement.html?id=" + this.roomId;
                    }
                } catch (e) {
                }
            },
            // 导入商品到商品库
            importGoods() {
                var that = this;
                // 导入商品是一个list 可以一次导入多个商品id
                var selectGoods = [];
                for (var i = 0; i < this.shopList.length; i++) {
                    if (this.shopList[i].select) {
                        selectGoods.push(this.shopList[i].id)
                    }
                }

                if (!selectGoods.length) {
                    hui.toast('请选择商品')
                    return
                }
                var data = {
                    "liveRoomId": that.roomId,
                    "liveGoodsIds": selectGoods
                };
                request("POST", `${hostUrl}/localQuickPurchase/live/exportGoods`, data).then(response => {
                    if (response.message == "请求成功") {
                        hui.toast("导入成功", "short");
                        that.goodsName = '';
                        // 重新加载商品数据
                        that.goodsPage = 1;
                        that.goodsLoadMore = true;
                        that.shopList = [];
                        that.getUsergoods()
                    }
                    hui.loading(false, true);
                    // 选择商品导入后返回到上一页
                    setTimeout(function () {                   
                        location.href = "./operManagement.html?id=" + that.roomId;
                    },600)
                })
            }
        }
    }
</script>

<style>
    @import "importGoods.less";
    @import "../../assets/css/style.css";

    #hui-load-more {
        display: none !important;
    }

    .noneData {
        width: 70%;
        margin: 0 auto;
        display: block;
    }

    .shopList {
        width: 100%;
        height: 1.4rem;
        background: rgba(255, 255, 255, 1);
        padding: 0.2rem 0.25rem 0.2rem 0.24rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        box-sizing: border-box;
        border-bottom: 0.01rem solid rgba(238, 238, 238, 1);
    }
    .content{
        margin-bottom: 2rem;
    }

    .shopList .shopImg {
        width: 1rem;
        height: 1rem;
        border-radius: 0.1rem;
    }

    .shopList .shopTitle {
        width: 5.2rem;
        font-size: 0.28rem;
        font-family: PingFang SC;
        font-weight: 500;
        color: rgba(51, 51, 51, 1);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .shopList .shop-select {
        width: 0.34rem;
        height: 0.34rem;
    }

    .shopPrice {
        display: flex;
        margin-top: 0.07rem;
    }

    .shopPrice .liveName {
        width: 1.5rem;
        font-size: 0.24rem;
        font-family: PingFang SC;
        font-weight: 500;
        color: rgba(102, 102, 102, 1);
    }

    html {
        width: 100%;
        height: 100%;
        background-color: #f6f6f6;
    }

    [v-cloak] {
        display: none;
    }

    #app {
        font-size: 0.26rem;
    }

    body {
        background: transparent;
    }

    * {
        margin: 0;
        padding: 0;
    }

    .mainBox {
        color: #444;
        transform: none;
        background-color: #f6f6f6;
    }

    input {
        outline: none;
    }

    .mint-header {
        width: 100%;
        background-color: #fff;
        color: #fff;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 1000;
        font-family: Hiragino Sans GB;
        box-shadow: 0.01rem 0.01rem 0.04rem 0rem rgba(204, 204, 204, 1);
    }

    .b-b {
        border-bottom: 0.01rem solid rgba(238, 238, 238, .8);
    }

    .mint-header .mint-button {
        width: 32px;
    }

    .mint-header img {
        width: 26px;
        height: 26px;
    }

    .live-input {
        width: 4.9rem;
    }

    .mintui-back:before {
        content: "\E600";
        font-size: 22px;
        color: #212121;
    }

    .mint-header-title {
        font-size: 16px;
        color: #212121;
    }

    .mint-header-title {
        font-size: 16px;
        color: #212121;
    }

    .kill {
        visibility: hidden;
    }

    .shopQuery {
        width: 6rem;
        height: 0.66rem;
        background: rgba(255, 255, 255, 1);
        border-radius: 0.66rem;
        margin: 0.16rem auto 0.3rem auto;
        display: flex;
        overflow: hidden;
    }

    .shopQuery input {
        width: 4.8rem;
        height: 0.66rem;
        line-height: 0.66rem;
        background: rgba(255, 255, 255, 1);
        box-sizing: border-box;
        padding-left: 0.22rem;
        border: none;
    }

    .shopQuery input::placeholder {
        font-size: 0.28rem;
        font-family: Hiragino Sans GB;
        font-weight: normal;
        color: rgba(153, 153, 153, 1);
    }

    .shopQuery p {
        width: 1.2rem;
        height: 0.66rem;
        background: rgba(219, 0, 32, 1);
        font-size: 0.26rem;
        font-family: Hiragino Sans GB;
        font-weight: normal;
        color: rgba(255, 255, 255, 1);
        line-height: 0.66rem;
        text-align: center;
    }

    .createContent {
        margin: 0 0.2rem 0rem 0.2rem;
        margin-top: 49px;
    }

    .createLive {
        width: 5.4rem;
        height: 0.72rem;
        line-height: 0.72rem;
        text-align: center;
        background: rgba(243, 47, 50, 1);
        font-size: 0.28rem;
        font-family: Hiragino Sans GB;
        font-weight: normal;
        color: rgba(255, 255, 255, 1);
        border-radius: 2rem;
        margin: 0 auto;
        position: fixed;
        bottom: 0.5rem;
        left: 50%;
        transform: translateX(-50%);
    }
</style>
