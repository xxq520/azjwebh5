<template>
    <div id="app">
        <div class="mainBox ">
            <header class="mint-header">
                <img src="../../assets/img/back.png" alt="" @click="goback">
                <h1 class="mint-header-title ">520直播</h1>
                <div class="kill">提示</div>
            </header>
        </div>
        <div class="createContent">
            <!--watchCode: ""-->
            <!--coverImg: "http://mmbiz.qpic.cn/mmbiz_png/g9f3AAkWHFLiaTGVrTc2gEhZpBzTpOeuRYaicVQuQAQ5oc2vHzLHFmBEianNpsRVB2iapQgE4tsJVGxkxyYmMGTdyw/0"-->
            <!--anchorName: "阿呆"-->
            <!--liveStatus: 103-->
            <!--roomId: 18-->
            <!--shareImg: "http://mmbiz.qpic.cn/mmbiz_png/g9f3AAkWHFLiaTGVrTc2gEhZpBzTpOeuRjPzO12S9licYHUGdDIeHfMRhQFqvxKmgmqylSljLCJEicNIdcq8mna8g/0-->
            <div class="liveList" v-for="(item,index) in liveList" @click="goLiveroom(item)">
                <div class="liveHead">
                    <div class="liveTitle">{{item.name}}</div>
                    <div class="liveBottom">
                        <div class="liveName">{{item.anchorName}}</div>
                        <p class="liveTime">
                            直播时间：{{item.startTime|formDate("day")}}-{{item.endTime|formDate("day")}}
                            {{item.startTime|formDate("time")}}-{{item.endTime|formDate("time")}}
                        </p>
                    </div>
                </div>
                <div class="liveContent">
<!--                    ../../assets/img/zbdh_img_fx.png-->
                    <img :src="item.shareImg" alt="">
                    <p v-if="item.liveStatus===101">直播中</p>
                    <p v-if="item.liveStatus===102">未开始</p>
                    <p v-if="item.liveStatus===103">已结束</p>
                </div>
            </div>
        </div>
        <!--暂无数据-->
        <img class="noneData" v-if="!liveList.length" src="../../assets/img/liveNone.png" alt="">
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
                // 获取直播列表开始条数
                start: 1,
                // 获取直播列表条数
                limit: 4,
                // 直播列表数据
                liveList: [],
                // 是否可以加载更多
                loadMore: true
            }
        },
        created() {
            // localStorage.setItem("seq",4595736)
            // 获取当前正在直播中的列表数据
            this.getLivelist();
            // 初始化加载更多
            hui.loadMore(this.getLivelist, '加载中...', '加载中...');
        },
        mounted() {
        },
        filters: {
            //格式化时间
            formDate(data, type) {
                var date = new Date(data * 1000);
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
                if (type === "day") {
                    return m + '/' + d
                } else if (type === "time") {
                    return h + ':' + minute
                }
            }
        },
        methods: {
            // 跳转至直播间
            goLiveroom(item) {
                // 如果是未开始和直播中的状态
                if (item.liveStatus === 101 || item.liveStatus === 102) {
                    var u = navigator.userAgent;
                    // 如果是小程序的话跳转至直播间 否则跳转分享海报
                    var ua = navigator.userAgent.toLowerCase();
                    var isappwebview = u.indexOf('app_webview') > -1;
                    // 判断是否是app端，如果是的话 未开始直接跳转至小程序端进行观看直播
                    if (isappwebview && item.liveStatus === 101) {
                        // 调用app方法跳转至小程序
                        window.action.app_goMiniApps("gh_8f8753cb8b60", `plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=${item.roomId}&custom_params=true`);
                        //判断是否是微信
                    } else if (ua.match(/MicroMessenger/i) == "micromessenger") {
                        //ios的ua中无miniProgram，但都有MicroMessenger（表示是微信浏览器）
                        //如果是小程序中打开则不显示分享方式弹窗，直接跳转至微信小程序分享界面
                        wx.miniProgram.getEnv((res) => {
                            // 如果如果是小程序 并且状态为直播中的话跳转到相应的直播间
                            if (res.miniprogram && item.liveStatus === 101) {
                                //是否显示二维码图片分享选项
                                wx.miniProgram.navigateTo({url: `plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=${item.roomId}&custom_params=true`})
                            } else {
                                // 判断是否是小程序 是则跳转小程序分享页面
                                if (res.miniprogram) {
                                    wx.miniProgram.navigateTo({url: `/pages/liveShare/liveShare?share=${item.sharePosters}&title=${item.name}&room=${item.roomId}`});
                                    return
                                }
                                // 如果是h5端则跳转至分享海报页面
                                if (item.sharePosters) {
                                    location.href = `./shareLive.html?sharePosters=${item.sharePosters}`;
                                } else {
                                    hui.toast("直播间正在审核，请稍后再试", "short");
                                }
                            }
                        })
                    } else {
                        // 如果存在分享海报才跳转至分享海报页面
                        if (item.sharePosters) {
                            location.href = `./shareLive.html?sharePosters=${item.sharePosters}`;
                        } else {
                            hui.toast("直播间正在审核，请稍后再试", "short");
                        }
                    }
                    // 如果是已结束的直播间的话跳转至直播回放页面
                } else if (item.liveStatus === 103) {
                        location.href = `./liveBack.html?detail=${encodeURIComponent(JSON.stringify(item))}`
                }
            },
            // 获取商家商品列表
            getLivelist() {
                var that = this;
                // 判断是否加载全部
                if (!this.loadMore) {
                    return false
                }
                // 请求接口所需要的参数
                var data = {
                    start: this.start,
                    limit: this.limit
                };
                // 发送请求
                request("POST", `${hostUrl}/localQuickPurchase/small/pay/getLiveRooms`, data).then(response => {
                    if (!response.code || response.code !== 200) {
                        hui.alert("加载失败," + response.message);
                    }
                    if (response.data.list.length) {
                        that.liveList = that.liveList.concat(response.data.list);
                        // 更改获取数据开始的索引
                        that.start = that.start + 1;
                        hui.endLoadMore();
                    }
                    // 如果是没有数据的话就禁止加载更多
                    if (response.data.list.length < that.limit) {
                        hui.endLoadMore(true, '已经到底了...');
                        that.loadMore = false
                    }
                })
            },
            // 返回上层
            goback() {
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
                        location.href = "/localQuickPurchase/distributionVA/index"
                    }
                } catch (e) {
                }
            },
        }
    }
</script>

<style>
    @import "nowLivelist.less";
    @import "../../assets/css/style.css";
    /*#hui-load-more {*/
        /*display: none !important;*/
    /*}*/
    .noneData {
        width: 70%;
        margin: 0 auto;
        display: block;
    }

    #hui-load-more {
        font-size: 15px;
        display: none !important;
    }

    .liveList {
        padding: 0.24rem;
        background: #fff;
        margin-bottom: 0.2rem;
        padding-bottom: 0.17rem;
    }

    .liveBottom {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.08rem 0 0.2rem 0;
    }

    .liveTitle {
        font-size: 0.28rem;
        font-family: Hiragino Sans GB;
        font-weight: normal;
        color: rgba(33, 33, 33, 1);
    }

    .liveName {
        font-size: 0.26rem;
        font-family: Hiragino Sans GB;
        font-weight: normal;
        color: rgba(102, 102, 102, 1);
    }

    .liveTime {
        font-size: 0.26rem;
        font-family: Hiragino Sans GB;
        font-weight: normal;
        color: rgba(102, 102, 102, 1);
    }

    .liveContent {
        position: relative;
    }

    .liveContent p {
        padding: 0 0.14rem;
        height: 0.4rem;
        background: rgba(0, 0, 0, .3);
        border-radius: 0.3rem;
        color: #fff;
        position: absolute;
        top: 0.2rem;
        right: 0.2rem;
        text-align: center;
        line-height: 0.4rem;
    }

    .liveContent img {
        width: 7.02rem;
        height: 4.6rem;
        border-radius: 0.2rem;
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

    .createContent {
        margin-top: 49px;
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
</style>
