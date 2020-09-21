<template>
    <div id="app">
        <div v-cloak class="mainBox">
            <header class="mint-header">
                <img src="../../assets/img/back.png" alt="" @click="goback">
                <h1 class="mint-header-title">开播码</h1>
                <div class="kill">提示</div>
            </header>
            <div class="codeContent">
                <div class="kbcard">
                    <div class="a1">观众端:小程序推流入口</div>
                    <div class="a2">主播通关微信扫码进入小程序进行直播推流</div>
                    <div class="kb">
                        <img :src="liveData.watchCode"/>
                    </div>
                    <div class="btn" @click="newShare">分享保存</div>
                </div>
                <div class="kbcard">
                    <div class="a1">主播端小程序</div>
                    <div class="a2">识别二维码开启直播,首次使用需认证身份</div>
                    <div class="kb">
                        <img :src="liveData.liveCode"/>
                    </div>
                </div>
                <div class="share-block hui-text-center dis_share" style="height: auto;">
                    <div class="bringIn">分享商品</div>
                    <p class="explain">只要你的好友通过你的链接买此商品，你就能得到此商品的利润哦~</p>
                    <ul class="share-content">
                    </ul>
                    <div class="hui-text-center" id="closeShare"><img
                            src="../../assets/img/classfiyImg2.png" width="20" @click="closes">
                    </div>
                </div>
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

            this.roomId = getUrlParam("id");
            this.getLiveDedatil()
        },
        mounted() {
            // this.selectShop()
        },
        watch: {
            'goodCode': function (newVal) {
                this.saveLocalStorage("goodCode", newVal)
            }
        },

        methods: {
            // 获取用户直播间数据
            getLiveDedatil() {
                var that = this;
                request("GET", `${hostUrl}/localQuickPurchase/live/findLiveRoom/${that.roomId}`, {}).then(response => {
                    that.liveData = response.data;
                    hui.loading(false, true);
                })
            },
            closes: function () {
                $('.share-block').slideUp(200);
                $('#hui-mask').remove()
            },
            newShare: function () {
                location.href = `./shareLive.html?id=${this.liveData.id}`
                // var shareTitle = '分享直播码';
                // var shareUrl = window.location.href;
                // //判断是否是app
                // var u = navigator.userAgent;
                // var isappwebview = u.indexOf('app_webview') > -1;
                // if (isappwebview) {
                //     // 分享
                //     share520Love(shareUrl, shareTitle, '', '', '.share-content');
                // } else {
                //     share520LoveWeb(shareUrl, shareTitle, '', '', '.share-content');
                //     hui.dialogBase();
                //     $(".share-block").slideDown(100);
                //
                //     if( this.is_weixn){
                //         soshm.weixinSharetip()
                //     }
                // }
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
    @import "liveCode.less";
    @import "../../assets/css/style.css";

    .codeContent {
        margin-top: 40px;
    }

    .share-block {
        width: 100%;
        height: 6.5rem;
        position: fixed;
        bottom: 0;
        z-index: 1000;
        background: white;
        display: none;
    }

    .share-block .bringIn {
        font-size: 1rem;
        color: #e4393c;
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
        font-size: 0.512rem;
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

    #closeShare {
        margin-top: 0.5rem;
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
