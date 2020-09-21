<template>
    <div id="app">
        <div class="mainBox ">
            <header class="mint-header">
                <img src="../../assets/img/back.png" alt="" @click="goBack">
                <h1 class="mint-header-title ">直播回放</h1>
                <div class="kill">提示</div>
            </header>
        </div>
        <div class="createContent">
            <div class="liveList">
                <div class="liveHead">
                    <div class="liveTitle">{{liveDetail.name}}</div>
                    <div class="liveBottom">
                        <div class="liveName">{{liveDetail.anchorName}}</div>
                        <p class="liveTime">
                            直播时间：{{liveDetail.startTime|formDate("day")}}-{{liveDetail.endTime|formDate("day")}}
                            {{liveDetail.startTime|formDate("time")}}-{{liveDetail.endTime|formDate("time")}}
                        </p>
                    </div>
                </div>
                <div class="liveContent" v-for="(item,index) in liveBack">
                    <p>第{{index+1}}段</p>
                    <img src="../../assets/img/zbdh_img_fx.png"
                         alt="" class="share">
                    <img class="videoIcon" @click="changeVideo(item)" src="../../assets/img/azj_spxq_icon_bp_1.png" alt="">
                </div>
            </div>
        </div>
        <div class="alertMsg"  @click="changeVideo" v-if="isVideo"></div>
        <div v-show="isVideo">
            <img @click="fullScreen" v-if="isApp" :src="close?require('../../../localQuickPurchase/distributionApp/images/narrow.png'):require('../../../localQuickPurchase/distributionApp/images/fullScreen.png')" class="creen" alt="">
            <video id="my-player" class="video-js" controls>
                <source id="source" type="video/mp4">
            </video>
        </div>
    </div>
</template>

<script>
    import flexible from "../../../common/lib/flexible/flexible"
    import common from "../../../common/js/common"
    import index from "../../../upms/static/goods_shopper_apply/index"
    import hostUrl from "../../assets/js/apis"
    import request from "../../assets/js/request"

    var player;
    export default {
        name: 'app',
        components: {},
        data() {
            return {
                // 是否显示部分层
                isVideo: false,
                // 获取直播列表开始条数
                start: 1,
                // 获取直播列表条数
                limit: 50,
                // 直播列表数据
                liveBack: [],
                // 当前播放视频的下标
                playIndex: 0,
                // 直播间号
                room_id: 0,
                // 回放直播间数据
                liveDetail: {},
                // 是否是app
                isApp:false,
                // 是否点击了关闭全屏
                close: false
            }
        },
        created() {
            var u = navigator.userAgent;
            // 如果是小程序的话跳转至直播间 否则跳转分享海报
            var ua = navigator.userAgent.toLowerCase();
            var isappwebview = u.indexOf('app_webview') > -1;
            // 判断是否是app端，如果是的话 未开始直接跳转至小程序端进行观看直播
            if (isappwebview) {
                this.isApp = true
            }
            // 获取url中的参数
            function getUrlParam(name) {
                var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
                var search = decodeURIComponent(window.location.search);
                var r = search.substr(1).match(reg);  //匹配目标参数
                if (r != null) return unescape(r[2]);
                return null; //返回参数值
            }

            this.liveDetail = JSON.parse(getUrlParam("detail"));
            this.room_id = this.liveDetail.roomId
        },
        mounted() {
            this.getBackVideo();
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
            // 更改视频显示状态
            changeVideo(item) {
                var that = this;
                try {
                    if (item) {
                        player.src([item]);
                        var u = navigator.userAgent;
                        // 如果是小程序的话跳转至直播间 否则跳转分享海报
                        var ua = navigator.userAgent.toLowerCase();
                        var isappwebview = u.indexOf('app_webview') > -1;
                        // 判断是否是app端，如果是的话 未开始直接跳转至小程序端进行观看直播
                        if (isappwebview) {
                            window.action.app_goMiniAppsPlay(item.src);
                            return
                        }
                    }
                    if (!this.isVideo) {
                        player.play();
                        setTimeout(function () {                      
                            that.isVideo = !that.isVideo
                        },200)
                    } else {
                        player.pause();
                        this.isVideo = !this.isVideo
                    }
                }catch (e) {
                    if (item) {
                        player.src([item]);
                    }
                    if (!this.isVideo) {
                        player.play();
                        setTimeout(function () {                      
                            that.isVideo = !that.isVideo
                        },200)
                    } else {
                        player.pause();
                        this.isVideo = !this.isVideo
                    }
                }

            },
            // 全屏视频播放
            fullScreen(){
                var Player = document.getElementById("my-player");
                if (!this.close){
                    $(".video-js").css({height:"87%",width:"94%"});
                    $(".alertMsg").css({backgroundColor:" rgba(0, 0, 0, 1)"})
                    $("#my-player").css({top:"0.9rem"})
                } else {
                    $(".video-js").css({height:"74%",width:"74%"});
                    $(".alertMsg").css({backgroundColor:" rgba(0, 0, 0, .5)"})
                    $("#my-player").css({top:"1.5rem"})
                }
                this.close = !this.close
            },
            // 直播回放
            getBackVideo() {
                var that = this;
                var data = {
                    "action": "get_replay", // 获取回放
                    "room_id": that.room_id, // 直播间   id
                    "start": 0, // 起始拉取视频，start =   0   表示从第    1   个视频片段开始拉取
                    "limit": 50 // 每次拉取的个数上限，不要设置过大，建议  100 以内
                };
                // 请求后台接口数据
                request("POST", `${hostUrl}/localQuickPurchase/small/pay/getLiveReplay`, data).then(response => {
                    if (!response.code || response.code !== 200) {
                        hui.alert("回放加载失败," + response.message);
                    }
                    if (response.data) {
                        // 返回回来的数据不是按正常时间排序的，所以需要反转一下
                        that.liveBack = response.data.reverse();
                        var soucrce = [];
                        try {
                            for (var i = 0; i < that.liveBack.length; i++) {
                                var mediaUrl = {};
                                mediaUrl.src = that.liveBack[i].mediaUrl;
                                if (that.liveBack[i].mediaUrl.endsWith(".mp4")) {
                                    mediaUrl.type = 'video/mp4'
                                } else if (that.liveBack[i].mediaUrl.endsWith(".m3u8")) {
                                    mediaUrl.type = 'application/x-mpegURL'
                                }
                                soucrce.push(mediaUrl)
                            }
                        } catch (e) {
                            hui.alert("暂无直播回放视频," + response.message);
                        }
                        that.liveBack = soucrce;
                        player = videojs('my-player', {
                            width: 320,
                            heigh: 460,
                            sources: [soucrce[0]]
                        });
                        // that.playIndex = that.playIndex + 1;
                        // // 监听是否播放完成
                        // player.on('ended', function (e) {
                        //     if (that.playIndex > that.liveBack.length) {
                        //         that.playIndex = 0;
                        //     }
                        //     player.src(that.liveBack[that.playIndex]);
                        //     player.play();
                        //     that.playIndex = that.playIndex + 1;
                        // });
                    }
                })
            },
            // 返回上一级按钮事件
            goBack() {
                window.location = "./nowLivelist.html"
            }
        }
    }
</script>

<style>
    @import "liveBack.less";
    @import "../../assets/css/style.css";

    .is-active {
        display: block;
    }
    .creen{
        z-index: 10000;
        position: absolute;
        top: 10px;
        right: 10px;
        width: 0.6rem;
        height: 0.6rem;
    }
    #my-player {
        position: fixed;
        top: 1.5rem;
        left: 50%;
        transform: translate(-50%, 0);
        width: 74%;
        height: 74%;
        z-index: 10001;
    }
    .share{
        margin-bottom:0.3rem;
    }

    .alertMsg {
        position: fixed;
        z-index: 1000;
        top: 0;
        width: 100%;
        height: 100%;
        left: 0;
        background-color: rgba(0, 0, 0, .5);
    }

    .videoIcon {
        height: 1.3rem !important;
        width: 1.3rem !important;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
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
        height: 4.7rem;
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
