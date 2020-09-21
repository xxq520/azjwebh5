<template>
    <div id="app">
        <div class="mainBox ">
            <header class="mint-header">
                <img src="../../assets/img/back.png" alt="" @click="goback">
                <h1 class="mint-header-title">运营管理</h1>
                <div class="kill">提示</div>
            </header>
            <!--直播间信息-->
            <div class="liveDetails">
                <p class="liveTile">直播间：{{userLive.nickName}}</p>
                <p class="liveTime" v-if="userLive.startTime">直播时间：{{userLive.startTime|formDate}}</p>
            </div>
            <!--商品库列表展示-->
            <div class="commodLibrary">
                <div class="list-item" v-for="(item,index) in liveGoods">
                    <img class="list-item-img"
                         :src="item.coverImg"
                         alt="">
                    <div class="list-item-title">
                        <p class="title">{{item.name}}</p>
                        <div class="shopPrice">
                            <p class="liveName" v-if="item.priceType==3">原价：{{item.descPrice}}元</p>
                            <p class="liveName" v-if="item.priceType==3">现价：{{item.targetPrice}}元</p>
                            <p class="liveName" v-if="item.priceType==1">{{item.targetPrice}}元</p>
                            <p class="liveName" v-if="item.priceType==2">{{item.descPrice}}元-{{item.targetPrice}}元</p>
                        </div>
                    </div>
                    <!--直播状态 直播中class:nowLive,未开始：noLive,已结束：liveed-->
                    <div class="list-item-status">
                        <div>
                            <span @click="handleAlertMsg(true,item)">删除</span>
                        </div>
                    </div>
                </div>
                <!--暂无商品数据-->
                <img class="noneData" v-if="!liveGoods.length" src="../../assets/img/liveNone.png" alt="">
                <!--新建直播间-->
                <p class="createLive" @click="goImportShop">从商品库导入商品</p>
            </div>
        </div>
        <div class="delShop" v-if="alertMsg" @click="handleAlertMsg(true)"></div>
        <div class="alertMsg" v-if="alertMsg">
            <p class="denger">温馨提示</p>
            <div class="msg-content">
                此商品将从此直播间删除，
                且不可恢复!
            </div>
            <div class="alertMsgBtn">
                <p class="b-r" @click="handleAlertMsg(false)">取消</p>
                <p @click="delGoods">删除</p>
            </div>
        </div>
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
                // 是否显示温馨提示弹窗
                alertMsg: false,
                // 当前运营的直播间id
                roomId: '',
                // 当前直播间运营的商品
                liveGoods: [],
                // 删除商品的id
                delId: '',
                // 每次请求直播中运营的商品数据数量
                limit: 10,
                // 当前请求的页数数据
                goodsPage: 1,
                // 是否还可以加载更多数据
                goodsLoadMore: true,
                // 主播的信息
                userLive: {}

            }
        },
        filters: {
            //格式化时间
            formDate(data) {
                var date = new Date(data);
                var y = date.getFullYear();
                var m = date.getMonth() + 1;
                m = m < 10 ? ('0' + m) : m;
                var d = date.getDate();
                d = d < 10 ? ('0' + d) : d;
                var h = date.getHours();
                h = h < 10 ? ('0' + h) : h;
                var minute = date.getMinutes();
                var second = date.getSeconds();
                minute = minute < 10 ? ('0' + minute) : minute;
                second = second < 10 ? ('0' + second) : second;
                return y + '/' + m + '/' + d + " " + h + ":" + minute + ":" + second
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

            var rooomId = getUrlParam("id");
            this.roomId = rooomId
            // 获取用户直播列表数据
            this.getLiveshop()
        },
        mounted() {
            hui.loadMore(this.getLiveshop, '1', '1');
        },
        filters: {

            //格式化时间
            formDate(data) {
                var date = new Date(data);
                var y = date.getFullYear();
                var m = date.getMonth() + 1;
                m = m < 10 ? ('0' + m) : m;
                var d = date.getDate();
                d = d < 10 ? ('0' + d) : d;
                var h = date.getHours();
                h = h < 10 ? ('0' + h) : h;
                var minute = date.getMinutes();
                var second = date.getSeconds();
                minute = minute < 10 ? ('0' + minute) : minute;
                second = second < 10 ? ('0' + second) : second;
                return y + '/' + m + '/' + d + " " + h + ":" + minute + ":" + second
            }
        },
        methods: {
            // 点击从商品库导入商品事件
            goImportShop() {
                location.href = "./importGoods.html?id=" + this.roomId
            },
            // 删除商品事件
            delGoods() {
                var that = this;
                request("POST", `${hostUrl}/localQuickPurchase/live/delete?liveId=${that.roomId}&goodsId=${that.delId}`, {}).then(response => {
                    if (response.code == 200) {
                        hui.toast("删除成功", "short");
                        that.handleAlertMsg(false);
                        // 重新加载商品数据
                        that.goodsPage = 1;
                        that.goodsLoadMore = true;
                        that.liveGoods = [];
                        that.getLiveshop()
                    }
                })
            },
            handleChangeSelect(selectIndex) {
                this.selectTab = Number(selectIndex)
            },
            // 关闭温馨提示遮罩层
            handleAlertMsg(type, item) {
                if (item) {
                    this.delId = item.id;
                }
                this.alertMsg = type
            },
            // 获取用户直播间列表数据
            getLiveshop() {
                // 如果没有更多数据则不发送请求
                if (!this.goodsLoadMore) {
                    return
                }
                // 首次加载才显示加载动画
                if (!this.liveGoods.length) {
                    hui.loading("数据加载中...");
                }
                var that = this;
                // 请求所需要的参数
                var data = {
                    "pageIndex": that.goodsPage,
                    "pageSize": that.limit,
                    "seq": localStorage.getItem("seq"),
                    "isWarRoomId": that.roomId  // 直播间的id
                };
                request("POST", `${hostUrl}/localQuickPurchase/live/exportGoodslist`, data).then(response => {
                    if (response.data && response.data.list) {
                        that.userLive = response.data.list[0];
                        if (response.data.list[0]) {
                            that.liveGoods = that.liveGoods.concat(response.data.list[0].liveGoods || []);
                        }
                        that.goodsPage = that.goodsPage + 1;
                        hui.endLoadMore();
                    } else {
                        hui.toast("运营商品加载失败", "short")
                    }
                    // 如果是没有数据的话就禁止加载更多
                    if (response.data.list.length < that.limit) {
                        hui.endLoadMore(true, '已经到底了...');
                        that.goodsLoadMore = false
                    }
                    hui.loading(false, true);
                })
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
                        window.location.href = "./liveRooms.html";
                    }
                } catch (e) {
                }
            },
        }

    }
</script>

<style>
    @import "operManagement.less";
    @import "../../assets/css/style.css";

    .noneData {
        width: 70%;
        margin: 0 auto;
        display: block;
    }

    html {
        width: 100%;
        height: 100%;
        background-color: #F5F5F5;
    }

    #hui-load-more {
        display: none !important;
    }

    [v-cloak] {
        display: none;
    }

    #app {
        font-size: 0.26rem;
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

    .mint-header .mint-button {
        width: 32px;
    }

    .mint-header img {
        width: 26px;
        height: 26px;
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

    /*直播间列表*/
    .liveShop {
        margin-top: 42px;
        width: 100%;
        height: 0.88rem;
        background: rgba(255, 255, 255, 1);
        display: flex;
        justify-content: space-around;
        margin-bottom: 0.2rem;
    }

    .liveDetails {
        margin-top: 50px;
        text-align: center;
    }

    .liveDetails .liveTile {
        font-size: 0.28rem;
        font-family: Hiragino Sans GB;
        font-weight: normal;
        color: rgba(102, 102, 102, 1);
        margin-bottom: 0.04rem;
    }

    .liveDetails .liveTime {
        font-size: 0.28rem;
        font-family: Hiragino Sans GB;
        font-weight: normal;
        color: rgba(102, 102, 102, 1);
        margin-bottom: 0.2rem;
    }

    .endTime {
        font-size: 0.24rem;
        font-family: PingFang SC;
        font-weight: 500;
        color: rgba(229, 0, 18, 1);
        margin-top: 0.05rem;
    }

    .liveShop div {
        width: 1.6rem;
        height: 97%;
        line-height: 0.88rem;
        font-size: 0.28rem;
        font-family: PingFang SC;
        font-weight: 500;
        text-align: center;
    }

    .liveShopActive {
        color: rgba(228, 57, 60, 1);
        width: 1.6rem;
        border-bottom: 0.03rem solid rgba(228, 57, 60, 1);
    }

    .list-item {
        display: flex;
        position: relative;
        /*height:1.6rem;*/
        background: rgba(255, 255, 255, 1);
        padding: 0.2rem;
        box-sizing: border-box;
        border-bottom: 0.01rem solid rgba(238, 238, 238, 1);
        background-color: #fff;
    }

    .list-item-img {
        width: 1rem;
        height: 1rem;
        border-radius: 50%;
        margin-right: 0.18rem;
        margin-top: 0.02rem;
    }

    .list-item-status {
        position: absolute;
        right: 0.2rem;
        bottom: 0.2rem;
    }

    .list-item-title {
        padding-left: 0.02rem;
    }

    .list-item-title .title {
        width: 4.2rem;
        height: 0.28rem;
        font-size: 0.28rem;
        font-family: PingFang SC;
        font-weight: 500;
        color: rgba(51, 51, 51, 1);
        padding-bottom: 0.22rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .liveName {
        font-size: 0.24rem;
        font-family: PingFang SC;
        font-weight: 500;
        color: rgba(102, 102, 102, 1);
    }

    .list-item-status {
        font-size: 0.22rem;
        font-family: Hiragino Sans GB;
        font-weight: normal;
        text-align: right;
    }

    input {
        outline: none;
    }

    .nowLive {
        color: rgba(243, 47, 50, 1);
    }

    .noLive {
        font-size: 0.22rem;
        font-family: Hiragino Sans GB;
        font-weight: normal;
        color: rgba(255, 156, 28, 1);
    }

    .liveed {
        font-size: 0.22rem;
        font-family: Hiragino Sans GB;
        font-weight: normal;
        color: rgba(153, 153, 153, 1);
    }

    .list-item-status p {
        margin-bottom: 0.2rem;
    }

    .list-item-status div span {
        font-size: 0.22rem;
        font-family: Hiragino Sans GB;
        font-weight: normal;
        color: #afafaf;
        padding: 0.06rem 0.18rem;
        border-radius: 0.1rem;
        margin-left: 0.1rem;
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
        margin-top: 0.81rem;
        margin-bottom: 0.6rem;
    }

    /*商品库列表*/
    .commodLibrary {

    }

    .commodLibrary .list-item-img {
        width: 1rem;
        height: 1rem;
        border-radius: 8%;
        margin-right: 0.18rem;
        margin-top: 0.02rem;
    }

    .commodLibrary .shopPrice {
        display: flex;
        margin-top: 0.07rem;
    }

    .commodLibrary .shopPrice .liveName {
        width: 1.5rem;
    }

    .commodLibrary .shopPrice .shopStatus {
        font-size: 0.24rem;
        font-family: PingFang SC;
        font-weight: 500;
        color: rgba(243, 47, 50, 1);
    }

    .commodLibrary .createLive {
        margin-top: 3.82rem;
    }

    .delShop {
        background: #000;
        opacity: 0.3;
        height: 100vh;
        width: 100vw;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 1000;
    }

    .alertMsg {
        width: 5.8rem;
        background: rgba(252, 253, 255, 1);
        border-radius: 0.2rem;
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 1001;
    }

    .alertMsgBtn {
        display: flex;
        justify-content: space-between;
    }

    .alertMsgBtn p {
        height: 0.9rem;
        font-size: 0.32rem;
        font-family: PingFang SC;
        font-weight: 500;
        color: rgba(219, 0, 32, 1);
        width: 50%;
        text-align: center;
        line-height: 0.9rem;
    }

    .b-r {
        border-right: 0.01rem solid rgba(196, 196, 196, .8);
    }

    .denger {
        font-size: 0.32rem;
        font-family: PingFang SC;
        height: 0.9rem;
        line-height: 0.9rem;
        font-weight: 500;
        color: rgba(17, 17, 17, 1);
        text-align: center;
    }

    .msg-content {
        padding: 0.4rem 0.3rem;
        font-size: 0.32rem;
        font-family: PingFang SC;
        font-weight: 500;
        text-align: center;
        color: rgba(102, 102, 102, 1);
        border-top: 0.01rem solid rgba(196, 196, 196, 0.8);
        border-bottom: 0.01rem solid rgba(196, 196, 196, 0.8);
    }

    .noneShop {
        height: 3.23rem;
        width: 4.3rem;
        margin: 0 auto;
        display: block;
        margin-top: 1.6rem;
    }
</style>
