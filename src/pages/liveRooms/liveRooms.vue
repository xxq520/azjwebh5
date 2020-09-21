<template>
    <div id="app">
        <div class="mainBox ">
            <header class="mint-header">
                <img src="../../assets/img/back.png" alt="" @click="goback">
                <h1 class="mint-header-title">直播带货</h1>
                <div class="kill">提示</div>
            </header>
            <!--直播间 商品库-->
            <div class="liveShop">
                <div :class="{liveRoom:true,liveShopActive:selectTab==1}" @click="handleChangeSelect(1)">直播间</div>
                <div :class="{shoplive:true,liveShopActive:selectTab==2}" @click="handleChangeSelect(2)">商品库</div>
            </div>
            <!--直播间列表展示-->
            <div class="liveList" v-if="selectTab==1">
                <!--每一个直播间包含：直播头像、直播名称、直播状态、开播码、运营-->
                <div class="list-item" v-for="(item,index) in userLiveList">
                    <img class="list-item-img"
                         :src="item.shareImg || 'http://dfs2.520shq.com:80/group1/M00/07/FD/wKgAC19oPv6AFtcVAABJ-lSRLYk153.png'" alt="">
                    <div class="list-item-title">
                        <p class="title">{{item.liveTitle}}</p>
                        <p class="liveName">主播:{{item.nickName}}</p>
                        <p class="endTime">直播结束时间:{{item.endTime|formDate}}</p>
                    </div>
                    <!--直播状态 直播中class:nowLive,未开始：noLive,已结束：liveed-->
                    <div class="list-item-status">
                        <p class="nowLive" v-if="item.status==0||!item.status">审核中</p>
                        <p class="nowLive" v-if="item.status==1">未开始</p>
                        <p class="nowLive" v-if="item.status==2">直播中</p>
                        <p class="nowLive" v-if="item.status==3">已结束</p>
                        <p class="nowLive" v-if="item.status==4">已过期</p>
                        <p class="nowLive" v-if="item.status==5" @click="goFail(item.id)">审核失败</p>
                        <div>
                            <span v-if="item.status==1||item.status==2"
                                  @click="goLivecode(item)">开播码</span>
                            <span @click="goLiveDetail(item.status,item.id)"
                                  v-if="item.status!=3&&item.status!=4">运营</span>
                        </div>
                    </div>
                </div>
                <!--暂无直播间数据-->
                <img class="noneShop" src="../../assets/img/liveNone.png" alt="" v-if="!userLiveList.length">
                <!--新建直播间-->
                <p class="createLive" @click="goCreateLive">创建直播间</p>
            </div>
            <!--商品库列表展示-->
            <div class="commodLibrary" v-if="selectTab==2">

                <div class="list-item" v-for="(item,index) in userGoodslist">
                    <img class="list-item-img"
                         :src="item.coverImg" alt="">
                    <div class="list-item-title">
                        <p class="title">{{item.name}}</p>
                        <div class="shopPrice">
                            <p class="liveName" v-if="item.priceType==3">原价:{{item.descPrice}}元</p>
                            <p class="liveName" v-if="item.priceType==3">现价:{{item.targetPrice}}元</p>
                            <p class="liveName" v-if="item.priceType==1">{{item.targetPrice}}元</p>
                            <p class="liveName" v-if="item.priceType==2">{{item.descPrice}}元-{{item.targetPrice}}元</p>
                            <p class="shopStatus">{{item.isWarehousing==1?"已入库":"未入库"}}</p>
                        </div>
                    </div>
                    <!--直播状态 直播中class:nowLive,未开始：noLive,已结束：liveed-->
                    <div class="list-item-status">
                        <p class="liveed" v-if="item.status===0">未审核</p>
                        <p class="liveed" v-if="item.status===1">审核通过</p>
                        <p class="liveed" v-if="item.status===2">审核失败</p>
                        <div>
<!--                            <span @click="editPrice(item)">修改价格</span>-->
                            <span @click="handleAlertMsg(true,item)">删除</span>
                        </div>
                    </div>
                </div>
                <!--暂无商品数据-->
                <img class="noneShop" src="../../assets/img/zbdh_bg_kb.png" alt="" v-if="!userGoodslist.length">
                <!--新建直播间-->
                <p class="createLive" @click="addGoods">添加商品</p>
            </div>
        </div>
        <div class="delShop" v-if="alertMsg" @click="handleAlertMsg(true)"></div>
        <div class="alertMsg" v-if="alertMsg">
            <p class="denger">温馨提示</p>
            <div class="msg-content">
                此商品将从所有直播间同步删除，
                且不可恢复!
            </div>
            <div class="alertMsgBtn">
                <p class="b-r" @click="handleAlertMsg(false)">取消</p>
                <p @click="delGoods">删除</p>
            </div>
        </div>
        <div class="noneLive" v-if="noneliveData">
            <img src="../../assets/img/hb_bg_01.png" alt="">
            <p @click="goCreateLive">创建直播间</p>
        </div>
    </div>
</template>

<script>
    import flexible from "../../../common/lib/flexible/flexible"
    import common from "../../../common/js/common"
    import index from "../../../upms/static/goods_shopper_apply/index"
    import {MessageBox} from 'mint-ui';
    import hostUrl from "../../assets/js/apis"
    import request from "../../assets/js/request"

    export default {
        name: 'app',
        components: {},
        data() {
            return {
                // 显示直播间还是商品库
                selectTab: 1,
                // 是否显示温馨提示弹窗
                alertMsg: false,
                // 当前用户直播列表数据
                userLiveList: [],
                // 当前用户商品库数据
                userGoodslist: [],
                // 删除的商品id
                delId: '',
                // 直播列表加载页数
                livePage: 1,
                // 商品列表加载
                goodsPage: 1,
                // 加载数据每次加载的数量
                limit: 10,
                // 是否还可以加载更多直播间间数据
                liveLoadMore: true,
                // 是否还可以加载更多商品库数据
                goodsLoadMore: true,
                // 没有直播间数据展示海报
                noneliveData: false,
            }
        },
        created() {
            // localStorage.setItem("seq",4595736)
            // 获取url中的参数
            function getUrlParam(name) {
                var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
                var r = window.location.search.substr(1).match(reg);  //匹配目标参数
                if (r != null) return unescape(r[2]);
                return null; //返回参数值
            }

            // 根据url中的select项进行选中tabbar
            this.selectTab = getUrlParam("selectTab") || 1;
            // 获取用户直播列表数据
            this.getUserLive();
            // 获取用户商品库数据
            this.getUsergoods();
            // 初始化加载更多
            hui.loadMore(this.loadMore, '1', '1');

        },
        mounted() {

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
            // 删除商品事件
            delGoods() {
                var that = this;
                var xhr = new XMLHttpRequest();
                xhr.addEventListener("load", function (e) {
                    var response = JSON.parse(e.srcElement.response);
                    if (response.code == 200) {
                        hui.toast("删除成功", "short");
                        that.handleAlertMsg(false);
                        // 重新加载商品数据
                        that.changeGoodHide();
                    }
                }, false);
                xhr.open("POST", `${hostUrl}/localQuickPurchase/live/goods/delete?id=${that.delId}`, true);
                xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                xhr.send();
            },
            // 删除商品库的某个商品 虚拟删除
            changeGoodHide() {
                var userGoodslist = this.userGoodslist;
                for (var i = 0; i < userGoodslist.length; i++) {
                    if (userGoodslist[i].id == this.delId) {
                        this.userGoodslist.splice(i, 1);
                        return
                    }
                }
            },
            // 点击创建直播间点击事件
            goCreateLive() {
                localStorage.removeItem("createLiveData");
                location.href = "./createLive.html"
            },
            // 修改商品价格
            editPrice(createLiveData) {
                var editPrice = {};
                editPrice.edit = true;
                if (createLiveData.coverImg) {
                    editPrice.shopImg = createLiveData.coverImg
                }
                if (createLiveData.name) {
                    editPrice.shopName = createLiveData.name
                }
                if (createLiveData.goodsCode) {
                    editPrice.goodCode = createLiveData.goodsCode
                }
                if (createLiveData.priceType) {
                    editPrice.shopPricetype = createLiveData.priceType
                }
                if (createLiveData.targetPrice) {
                    editPrice.shopPrice = createLiveData.targetPrice
                }
                if (createLiveData.descPrice) {
                    editPrice.minPrice = createLiveData.descPrice
                }
                if (createLiveData.id) {
                    editPrice.id = createLiveData.id;
                }
                if (createLiveData.isWarehousing) {
                    editPrice.isWarehousing = createLiveData.isWarehousing;
                }
                localStorage.setItem("addLiveshop", JSON.stringify(editPrice));
                location.href = "./addLiveshop.html"
            },
            // 开播码点击事件
            goLivecode(item) {
                location.href = `./liveCode.html?id=${item.id}`
            },
            // 点击运营跳转事件
            goLiveDetail(status, liveId) {
                // 如果是审核失败的话就跳转审核失败页面
                location.href = "./operManagement.html?id=" + liveId
            },
            // 跳转到直播审核失败页面
            goFail(liveId) {
                location.href = `./auditFailed.html?id=${liveId}`
            },
            // 更改直播间商品库tab选项卡切换
            handleChangeSelect(selectIndex) {
                this.selectTab = Number(selectIndex);
                // 每次切换数据置为空
                if (selectIndex === 1) {
                    this.livePage = 1;
                    this.liveLoadMore = true;
                    this.userLiveList = [];
                    this.getUserLive();
                } else {
                    this.goodsPage = 1;
                    this.goodsLoadMore = true;
                    this.userGoodslist = [];
                    this.getUsergoods();
                }
                //重置加载更多状态
                hui.resetLoadMore();
            },
            // 关闭温馨提示遮罩层
            handleAlertMsg(type, item) {
                if (item) {
                    this.delId = item.id;
                    console.log(item)
                }
                this.alertMsg = type
            },
            // 获取用户直播间列表数据
            getUserLive() {
                var that = this;
                // 是否还可以加载更多数据
                if (!this.liveLoadMore) {
                    return false
                }
                var data = {
                    "pageIndex": that.livePage,
                    "pageSize": that.limit,
                    "seq": localStorage.getItem("seq")
                };
                request("POST", `${hostUrl}/localQuickPurchase/live/list`, data).then(response => {
                    if (response.data && response.data.list) {
                        that.userLiveList = that.userLiveList.concat(response.data.list);
                        that.livePage = that.livePage + 1;
                        hui.endLoadMore();
                    } else {
                        hui.toast("直播列表加载失败", "short");
                    }
                    // 如果是没有数据的话就禁止加载更多
                    if (response.data.list.length < that.limit) {
                        hui.endLoadMore(true, '已经到底了...');
                        that.liveLoadMore = false
                    }
                    // 判断是否有直播间数据，如果没有直播间数据则显示海报提示用户创建直播间
                    if (!that.userLiveList.length) {
                        that.noneliveData = true
                    }
                })
            },
            // 获取用户商品库数据
            getUsergoods() {
                var that = this;
                // 是否还可以加载更多数据
                if (!this.goodsLoadMore) {
                    return false
                }
                // 错误
                var data = {
                    "pageIndex": that.goodsPage,
                    "pageSize": that.limit,
                    "type": 1,
                    "seq": localStorage.getItem("seq")
                };
                request("POST", `${hostUrl}/localQuickPurchase/live/goods/list`, data).then(response => {
                    if (response.data && response.data.list) {
                        that.userGoodslist = that.userGoodslist.concat(response.data.list);
                        that.goodsPage = that.goodsPage + 1;
                        hui.endLoadMore();
                    }
                    // 如果是没有数据的话就禁止加载更多
                    if (response.data && response.data.list.length < that.limit && that.selectTab === 2) {
                        hui.endLoadMore(true, '已经到底了...');
                        that.goodsLoadMore = false
                    }
                    hui.loading(false, true);
                })
            },
            // 点击添加商品事件
            addGoods() {
                // 删除缓存中的新增商品数据
                localStorage.removeItem("addLiveshop");
                location.href = "./addLiveshop.html"
            },
            // 加载更多数据
            loadMore() {
                if (this.selectTab === 1) {
                    this.getUserLive();
                } else {
                    this.getUsergoods();
                }
            },
            // 返回上层
            goback() {
                location.href = "/upms/static/personalCenter.html"
            },
        }
    }
</script>

<style>
    @import "liveRooms.less";
    @import "../../assets/css/style.css";

    #hui-load-more {
        display: none !important;
    }

    [v-cloak] {
        display: none;
    }
    div{
    }
    .noneLive {
        position: fixed;
        z-index: 10;
        top: 0;
        left: 0;
        height: 100vh;
        width: 100vw;
    }

    .noneLive img {
        padding-top: 42px;
        box-sizing: border-box;
        width: 100%;
        height: 100%;

    }

    .liveList {
        margin-top: 1.9rem;
        padding-bottom: 2rem;
    }

    .noneLive p {
        position: absolute;
        bottom: 17px;
        left: 50%;
        margin-left: -1.2rem;
        width: 2.4rem;
        height: 0.56rem;
        background: rgba(42, 0, 255, 1);
        border-radius: 0.5rem;
        font-size: 0.3rem;
        font-family: SimHei;
        font-weight: bold;
        color: rgba(255, 255, 255, 1);
        line-height: 0.56rem;
        text-align: center;
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
        width: 100%;
        height: 0.88rem;
        background: rgba(255, 255, 255, 1);
        display: flex;
        justify-content: space-around;
        margin-bottom: 0.2rem;
        position: fixed;
        top: 40px;
        border-top: 2px solid #f6f6f6;
        z-index: 10;
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
        top: 0.2rem;
        height: 1.4rem;
        width:3rem;
        overflow: auto !important;
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
        width: 3.5rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
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
        margin-bottom: 0.16rem;
    }
    .list-item-status div{
        height: 0.5rem;
        line-height: 0.5rem;
        width: 3rem;
        overflow: auto !important;
    }
    .list-item-status div span {
        font-size: 0.22rem;
        font-family: Hiragino Sans GB;
        font-weight: normal;
        color: rgba(255, 255, 255, 1);
        background-color: #F32F32;
        padding: 0.04rem 0.18rem;
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
        position: fixed;
        bottom: 0.5rem;
        left: 50%;
        transform: translateX(-50%);
    }

    /*商品库列表*/
    .commodLibrary {
        margin-top: 1.9rem;
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
        width: 1.3rem;
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
        color: rgba(102, 102, 102, 1);
        text-align: center;
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
