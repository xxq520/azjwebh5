<template>
    <div id="app">
        <div v-cloak class="mainBox">
            <header class="mint-header">
                <img src="../../assets/img/back.png" alt="" @click="goback">
                <h1 class="mint-header-title">开播码</h1>
                <div class="kill">提示</div>
            </header>
            <div class="codeContent">
                <!--watchCode-->
                <img :src="liveData.sharePosters" alt="">
                <p @click="newShare" class="newShare">分享保存</p>
            </div>
            <div class="share-block hui-text-center dis_share" style="height: auto;">
                <div class="bringIn">选择分享平台</div>
                <ul class="share-content">
                </ul>
                <ul class="savePicture">
                    <li @click="savePicture">
                        <img src="../../assets/img/zbdh_icon_save.png" alt="">
                        <p>保存图片</p>
                    </li>
                </ul>
                <div class="hui-text-center" id="closeShare"><img
                        src="../../assets/img/classfiyImg2.png" width="20" @click="closes">
                </div>
            </div>
            <div class="shareImg" v-if="isEwm" @click="closeEwm">
                <img :src="liveData.watchCode" alt="">
                <p>长按图片即可保存
                </p>
            </div>
        </div>
    </div>
</template>

<script>
    // import  flexible from "../../../common/lib/flexible/flexible"
    import common from "../../../common/js/common"
    import index from "../../../upms/static/goods_shopper_apply/index"
    import hostUrl from "../../assets/js/apis"
    import request from "../../assets/js/request"

    export default {
        name: 'app',
        components: {},
        data() {
            return {
                // 是否显示保存图片弹窗
                isEwm: false,
                // 直播间id
                roomId: 0,
                // 直播间数据
                liveData: {}
            }
        },
        created() {
            //获取url中的参数
            function getUrlParam(name) {
                var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
                var r = window.location.search.substr(1).match(reg);  //匹配目标参数
                if (r != null) return unescape(r[2]);
                return null; //返回参数值
            }

            //如果是微信接口直播列表中返回回来的数据
            var sharePosters = getUrlParam("sharePosters");
            if (sharePosters) {
                this.liveData = {sharePosters: sharePosters, watchCode: sharePosters}
            } else {
                this.roomId = getUrlParam("id");
                this.getLiveDedatil();
            }
        },
        mounted() {
            // this.selectShop()
        },
        methods: {
            // 关闭二维码弹窗
            closeEwm() {
                this.isEwm = false
            },
            // 点击保存图片时的点击事件
            savePicture() {
                this.isEwm = true
            },
            // 获取用户直播间数据
            getLiveDedatil() {
                var that = this;
                request("GET", `${hostUrl}/localQuickPurchase/live/findLiveRoom/${that.roomId}`, {}).then(response => {
                    that.liveData = {
                        sharePosters: response.data.sharePosters,
                        watchCode: response.data.sharePosters
                    };
                    hui.loading(false, true);
                });
            },
            closes: function () {
                $('.share-block').slideUp(200);
                $('#hui-mask').remove()
            },
            newShare: function () {
                var shareTitle = '分享直播码';
                var shareUrl = window.location.href;
                //判断是否是app
                var u = navigator.userAgent;
                var isappwebview = u.indexOf('app_webview') > -1;
                if (isappwebview) {
                    // 调用app的方法唤起分享功能
                    window.action.webShare(shareUrl, shareTitle, shareTitle, this.liveData.sharePosters, 0);
                } else {
                    share520LoveWeb(shareUrl, shareTitle,shareTitle, this.liveData.sharePosters,'.share-content');
                    hui.dialogBase();
                    $(".share-block").slideDown(100);
                }
            },
            is_weixn: function () {
                var ua = navigator.userAgent.toLowerCase();
                if (ua.match(/MicroMessenger/i) == "micromessenger") {
                    return true;
                } else {
                    return false;
                }
            },
            // 返回上层
            goback: function () {
                history.go(-1);
            },
        }
    }
</script>

<style>
    .shareImg {
        width: 100vw;
        height: 100vh;
        position: fixed;
        opacity: 1;
        background: rgba(0, 0, 0, 0.5);
        z-index: 1000;
        top: 0;
        left: 0;
    }

    .soshm-item {
        overflow: auto !important;
    }

    .soshm-item {
        height: 76px !important;
    }

    .shareImg img {
        width: 70%;
        margin: 0 auto;
        margin-top: 100px;
        display: block;
    }

    .shareImg p {
        width: 70%;
        margin: 0 auto;
        margin-top: 50px;
        text-align: center;
        background: #e83535;
        height: 30px;
        line-height: 30px;
        font-size: 14px;
        color: #fff;
        border-radius: 30px;
    }

    .share-content {

    }

    @import "shareLive.less";
    @import "../../assets/css/style.css";
    .savePicture {
    }

    .savePicture li {
        width: 27%;
    }

    .savePicture li img {
        width: 50px;
        height: 50px;
    }

    .savePicture li p {
        text-align: center;
        font-size: 14px;
    }

    .codeContent {
        padding-top: 40px;
        position: relative;
        height: 100vh;
        box-sizing: border-box;
    }

    .codeContent img {
        box-sizing: border-box;
        width: 100vw;
        height: 100%;
    }

    .codeContent p {
        width: 100px;
        height: 28px;
        background: rgba(42, 0, 255, 1);
        border-radius: 40px;
        color: #fff;
        position: absolute;
        bottom: 20px;
        font-size: 14px;
        left: 50%;
        margin-left: -50px;
        line-height: 28px;
        text-align: center;
    }

    .share-block {
        width: 100%;
        height: 6.5rem;
        position: fixed;
        bottom: 0;
        z-index: 1000;
        background: white;
        display: none;
        box-sizing: border-box;
    }

    .share-block .bringIn {
        font-size: 1rem;
        margin: .75rem 0;
        text-align: center;
    }

    .share-block .explain {
        font-size: .5rem;
        padding: 0 2rem;
    }

    .soshm {
        text-align: center;
        -webkit-tap-highlight-color: transparent;
    }

    .share-content {
        margin-top: 1rem;
    }

    .share-block ul {
        height: auto;
        display: flex;
        justify-content: space-between;
    }

    .share-block .fuzhi {

        list-style: none;
        display: flex;
        justify-content: flex-start;
        margin: 15px 0;
    }

    .share-block .fuzhi li {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 25%;
        font-size: 12px;

    }

    .share-block .fuzhi li img {
        width: 50px;
        height: 50px;
    }

    .soshm-item {
        width: 20%;
        height: 50px;

        cursor: pointer;
    }

    .soshm-item-icon {

        width: 40px !important;
        height: 40px !important;

    }

    .hui-text-center {
        padding: 0.5rem;
        text-align: center;

    }

    .soshm-item .soshm-item-text {
        display: block;
        font-size: 14px;
        color: #212121;
        margin-top: 4px;
    }

    .mask {
        opacity: 1;
        background: rgba(0, 0, 0, 0.5);
        z-index: 1001;
        position: fixed;
        height: 100%;
        width: 100%;
        top: 0;
        display: none;
    }

    .ewmcode {
        position: fixed;
        text-align: center;
        top: 3rem;
        left: 0;
        right: 0;
        margin: 0 auto;
        z-index: 15;
        width: 100%;
        text-align: center;
    }

    .ewmcode img {
        width: 200px;
        height: 200px;

    }

    .mint-button img {
        width: 12px;
        height: 20px;
    }

    /* 复制提示 */
    .copy-tips {
        position: fixed;
        z-index: 999;
        top: 30%;
        left: 50%;
        margin: 0 0 -20px -80px;
        background-color: rgba(0, 0, 0, 0.2);
        filter: progid:DXImageTransform.Microsoft.Gradient(startColorstr=#30000000, endColorstr=#30000000);
        padding: 6px;
    }

    .copy-tips-wrap {
        padding: 10px 20px;
        text-align: center;
        border: 1px solid #F4D9A6;
        background-color: #FFFDEE;
        font-size: 14px;
    }

    .kbcard {
        margin-top: 0.6rem;
        background-color: #fff;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        padding: 1rem 0.5rem;
    }

    .kbcard .a1 {
        font-size: 1rem;
        color: #333;
        line-height: 1.5rem;

    }

    .kbcard .a2 {
        font-size: 0.8rem;
        color: #999;
        line-height: 1.5rem;
    }

    .kbcard .kb {
        width: 100%;
        height: 10rem;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .kbcard .kb img {
        width: 9rem;
        height: 9rem;
    }

    .kbcard .btn {
        width: 6rem;
        height: 2rem;
        border-radius: 1rem;
        background-color: #e4393c;
        color: #fff;
        line-height: 2rem;
        text-align: center;
        margin: 10px 0;
        font-size: 14px;
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
        margin-top: 3.61rem;
        margin-bottom: 0.6rem;
    }
</style>
