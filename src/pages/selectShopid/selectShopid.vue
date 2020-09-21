<template>
    <div id="app">
        <div class="mainBox ">
            <header class="mint-header">
                <img src="../../assets/img/back.png" alt="" @click="goBack">
                <h1 class="mint-header-title ">选择对应商品</h1>
                <div class="kill">提示</div>
            </header>
        </div>
        <div class="createContent">
            <div class="shopQuery">
                <input v-model="goodsName" placeholder="输入商品信息查找" type="text">
                <p @click="search">搜索</p>
            </div>
        </div>
        <div class="content">
            <div class="shopList" v-for="(item,index) in shopList">
                <img class="shopImg" :src="item.thumbnail" alt="">
                <p class="shopTitle">{{item.goodsName}}</p>
                <img class="shop-select" v-if="select===index" @click="selectedId(index,item)"
                     src="../../assets/img/tg_icon_del_choose.png" alt="">
                <img class="shop-select" @click="selectedId(index,item)" v-else
                     src="../../assets/img/tg_icon_tel_choose.png" alt="">
            </div>
        </div>
        <!--暂无直播间数据-->
        <img class="noneShop" src="../../assets/img/liveNone.png" alt="" v-if="!shopList.length">
        <!--新建直播间-->
        <p class="createLive" @click="goBacks()">确定</p>
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
                // 当前选中的商品
                select: '',
                // 当前选中的code码
                goodCode: '',
                // 商品的图片
                shopImg: '',
                // 商品数据
                shopList: [],
                // 选中的商品名称
                prevshopName: '',
                // 当前请求的页数
                goodsPage: 1,
                // 当前请求的数据数量
                limit: 10,
                // 是否还可以加载更多
                goodsLoadMore: true
            }
        },
        mounted() {
            this.selectShop();
            hui.loadMore(this.selectShop, '1', '1');
        },
        methods: {
            // 点击搜索
            search (){
                this.shopList = [];
                this.goodsPage = 1;
                this.goodsLoadMore = true;
                this.selectShop()
            },
            // 更改选中商品状态
            selectedId(index, item) {
                this.select = index;
                this.goodCode = item.goodsId;
                this.shopImg = item.thumbnail;
                this.prevshopName = item.goodsName
            },
            // 保存并提审的事件处理
            saveToexamine() {
                console.log("提交审核")
            },
            // 保存数据到缓存
            saveLocalStorage(key, value) {
                var createLiveData = JSON.parse(localStorage.getItem("addLiveshop")) || {};
                createLiveData[key] = value;
                localStorage.setItem("addLiveshop", JSON.stringify(createLiveData));
            },
            // 获取商家商品列表
            selectShop() {
                var that = this;
                // 没有更多数据
                if (!this.goodsLoadMore) {
                    return
                }
                // 请求接口的参数
                var data = {
                    shopSeq: Number(localStorage.getItem("seq")),
                    goodsName: this.goodsName, //商品名称查询 可传空
                    pageIndex: this.goodsPage,
                    pageSize: this.limit
                };
                // 发送请求
                request("POST", `${hostUrl}/localQuickPurchase/live/goods/djChooseGoods`, data).then(response => {
                    if (!response.code || response.code !== 200) {
                        hui.alert("商品加载失败," + response.message);
                    }
                    if (response.data.list) {
                        that.shopList = that.shopList.concat(response.data.list);
                        that.goodsPage = that.goodsPage + 1;
                        hui.endLoadMore();
                    }
                    // 如果是没有数据的话就禁止加载更多
                    if (response.data.list.length < that.limit) {
                        that.goodsLoadMore = false
                    }
                })
            },
            // 点击确认按钮事件
            goBacks() {
                // 判断是有选中数据
                // console.log(this.goodCode);
                // return
                if (this.goodCode) {
                    this.saveLocalStorage("goodCode", this.goodCode);
                    this.saveLocalStorage("shopImg", this.shopImg);
                    this.saveLocalStorage("shopName", this.prevshopName.slice(0, 14));
                    window.location = "./addLiveshop.html"

                } else  {
                    hui.toast("请选择商品");
                }
            },
            goBack() {
                history.go(-1)
            },
        }
    }
</script>

<style>
    @import "selectShopid.less";
    @import "../../assets/css/style.css";

    #hui-load-more {
        display: none !important;
    }

    .noneShop {
        height: 3.23rem;
        width: 4.3rem;
        margin: 0 auto;
        display: block;
        margin-top: 1.6rem;
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
    .content{
        margin-bottom: 2rem;
    }
</style>
