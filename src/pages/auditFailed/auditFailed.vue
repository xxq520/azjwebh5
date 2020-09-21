<template>
    <div id="app">
        <div class="mainBox ">
            <header class="mint-header">
                <img src="../../assets/img/back.png" alt="" @click="goBack">
                <h1 class="mint-header-title ">审核失败</h1>
                <div class="kill">提示</div>
            </header>
        </div>
        <div class="createContent">
            <div class="detail">
                <!--审核时间-->
                <div class="live-title b-b">
                    <span class="title">审核时间:</span>
                    <p class="auditTime">{{liveUser.auditTime|formDate}}</p>
                </div>
                <!--审核失败原因-->
                <div class="live-title b-b">
                    <span class="title">失败原因:</span>
                    <p class="failed">{{liveUser.auditReason}}</p>
                </div>
                <div v-if="liveUser.errorCode==300036" class="Error">
                    <img :src="liveUser.liveCode" alt="">
                </div>
                <!--结束时间-->
                <!--<div class="live-title">-->
                    <!--<span class="title">工作人员:</span>-->
                    <!--<p>{{liveUser.operator}}</p>-->
                <!--</div>-->
            </div>
        </div>
        <!--新建直播间-->
        <p class="createLive" @click="editLive">前往修改</p>
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
                // 直播id
                id: '',
                liveUser: {}
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

            this.id = getUrlParam("id");
            this.getLiveData();
        },
        mounted() {
        },
        methods: {
            //修改直播间信息
            editLive() {
                localStorage.removeItem("createLiveData");
                location.href = `./createLive.html?id=${this.id}`
            },
            // 返回上一级
            goBack() {
                history.go(-1)
            },
            getLiveData() {
                var that = this;
                // 请求后台接口
                request("GET", `${hostUrl}/localQuickPurchase/live/findLiveRoom/${that.id}`, {}).then(response => {
                    if (!response.code || response.code !== 200) {
                        hui.alert("直播间加载失败");
                    }
                    if (response.data) {
                        that.liveUser = response.data
                    }
                    if (!response.data.auditTime) {
                        hui.alert("直播间状态已发生改变", "返回", () => {
                            location.href = "./liveRooms.html"
                        });
                    }
                })
            }
        }
    }
</script>

<style>
    @import "auditFailed.less";
    @import "../../assets/css/style.css";
    .Error{

    }
    .Error img{
        width: 180px;
        height: 180px;
        display: block;
        margin: 10px auto;
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

    body {
        background-color: transparent;
    }

    .b-b {
        border-bottom: 0.01rem solid rgba(238, 238, 238, 1);
    }

    .mainBox {
        color: #444;
        transform: none;
        cursor: pointer;
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

    .mintui-back:before {
        content: "\E600";
        font-size: 22px;
        color: #212121;
    }

    .mint-header-title {
        font-size: 16px;
        color: #212121;
    }

    .kill {
        visibility: hidden;
    }

    .createContent {
        margin-top: 49px;
    }

    .detail {
        background-color: #fff;
        padding: 0 0.24rem;
    }

    .live-title {
        min-height: 0.88rem;
        line-height: 0.88rem;
        display: flex;
        position: relative;
        margin: 0.02rem 0;
    }

    .live-title .title {
        width: 1.5rem;
        font-size: 0.26rem;
        font-family: Hiragino Sans GB;
        font-weight: normal;
        color: rgba(102, 102, 102, 1);
    }

    .live-title p {
        font-size: 0.26rem;
        font-family: Hiragino Sans GB;
        font-weight: normal;
        color: rgba(153, 153, 153, 1);
    }

    .failed {
        font-size: 0.26rem;
        font-family: Hiragino Sans GB;
        font-weight: normal;
        color: rgba(153, 153, 153, 1);
        line-height: 0.4rem;
        max-width: 79%;
        padding-top: 0.2rem;
        padding-bottom: 0.2rem;
    }

    .createLive {
        position: fixed;
        bottom: 1rem;
        left: 50%;
        transform: translateX(-50%);
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
    }

</style>
