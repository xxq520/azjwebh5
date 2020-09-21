<template>
    <div id="app">
        <div class="mainBox ">
            <header class="mint-header">
                <img src="../../assets/img/back.png" alt="" @click="goback">
                <h1 class="mint-header-title ">创建直播间</h1>
                <div class="kill">提示</div>
            </header>
        </div>
        <div class="createContent">
            <div class="detail">
                <!--直播标题-->
                <div class="live-title">
                    <span class="title">直播标题:</span>
                    <input type="text" class="live-input" placeholder="请输入标题，最多17个字符"
                           @input="handleTitleChange($event,'title')" v-model="title">
                    <!--<span class="enterNum">{{title.length}}/17</span>-->
                </div>
                <!--开播时间-->
                <div class="live-title">
                    <span class="title">开播时间:</span>
                    <div class="startTime time">
                        <input type="text" :value="startTimeNum"  readonly="readonly" class="noneTime" placeholder="选择开始时间">
                        <input type="text" readonly="readonly"  id="show01" placeholder="选择开始时间">
                        <img class="enterNum" src="../../assets/img/right.png" alt="">
                    </div>
                </div>
                <!--结束时间-->
                <div class="live-title">
                    <span class="title">结束时间:</span>
                    <div class="endTime time">
                        <input type="text" :value="endTimeNum"  readonly="readonly" class="noneTime" placeholder="选择结束时间">
                        <input type="text" id="show02"  readonly="readonly" placeholder="选择结束时间">
                        <img class="enterNum" src="../../assets/img/right.png" alt="">
                    </div>
                </div>
                <p class="Tips">
                    开播时间段仅供参考，不是实际直播间开播的时间，直播间在开始时间前也可以开播，并且到结束时间后不会强制结束；若到结束时间仍未开播，则直播间无法开播。
                </p>
            </div>
            <div class="detail detailTwo">
                <!--主播昵称-->
                <div class="live-title">
                    <span class="title">主播昵称:</span>
                    <input type="text" class="live-input" placeholder="请输入昵称，最多15个字符"
                           @input="handleTitleChange($event,'live')" v-model="liveName">
                </div>
                <!--主播昵称-->
                <div class="live-title">
                    <span class="title">主播微信:</span>
                    <input type="text" v-model="liveWX" placeholder="微信账号，用于主播认证">
                </div>
                <p class="Tips">
                    每个直播间需绑定一个用作核实主播身份，不会展示给观众，请添加客服账号，联系客服认证主播身份后开通直播。
                </p>
            </div>
            <div class="share-img util">
                <p class="share-title">直播间功能:</p>
                <div class="live-util">
                    <div class="util-item" @click="handleSelectUtil(0)">
                        <img :src="selectUtil[0]?require('../../assets/img/tg_icon_del_choose.png'):require('../../assets/img/tg_icon_tel_choose.png')"
                             alt="">
                        <p>评论</p>
                    </div>
                    <div class="util-item" @click="handleSelectUtil(1)">
                        <img :src="selectUtil[1]?require('../../assets/img/tg_icon_del_choose.png'):require('../../assets/img/tg_icon_tel_choose.png')"
                             alt="">
                        <p>点赞</p>
                    </div>
                    <div class="util-item" @click="handleSelectUtil(2)">
                        <img :src="selectUtil[2]?require('../../assets/img/tg_icon_del_choose.png'):require('../../assets/img/tg_icon_tel_choose.png')"
                             alt="">
                        <p>商品货架</p>
                    </div>
                </div>
            </div>
        </div>
        <!--新建直播间-->
        <p class="createLive" @click="next" >下一步</p>
    </div>
</template>

<script>
    const imgUrl = require('../../assets/img/a.png');
    import flexible from "../../../common/lib/flexible/flexible"
    import common from "../../../common/js/common"
    import index from "../../../upms/static/goods_shopper_apply/index"
    import jeDate from "../../assets/js/jeDate/jedate.min"
    import hostUrl from "../../assets/js/apis"
    import { Toast } from 'mint-ui';
    // 数据请求
    import request from "../../assets/js/request"

    export default {
        name: 'app',
        components: {},
        data() {
            return {
                // 直播标题
                title: '',
                // 主播昵称
                liveName: '',
                // 开播时间
                startTimeNum: '',
                // 结束时间
                endTimeNum: '',
                // 主播微信
                liveWX: '',
                // 选中的直播间功能
                selectUtil: [true, false, false],
                // 修改直播间的id
                id: '',
                // 防止多次提交事件
                postTrue: true,
                // 分享图
                shareImg: "",
                // 背景图
                liveBgc : ""
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

            // 当前修改的直播间id
            this.id = getUrlParam("id");
            // 获取修改直播间的数据
            this.id && this.getLiveData();
            // 获取缓存中创建直播间数据
            var createLiveData = JSON.parse(localStorage.getItem("createLiveData")) || {};
            if (createLiveData) {
                // 如果缓存中存在title
                if (createLiveData.title) {
                    this.title = createLiveData.title;
                }
                // 如果缓存中存在 主播昵称
                if (createLiveData.liveName) {
                    this.liveName = createLiveData.liveName;
                }
                // 如果缓存中存在 开播时间
                if (createLiveData.startTimeNum) {
                    this.startTimeNum = createLiveData.startTimeNum;
                }
                // 如果缓存中存在 结束时间
                if (createLiveData.endTimeNum) {
                    this.endTimeNum = createLiveData.endTimeNum;
                }
                if (createLiveData.liveWX) {
                    this.liveWX = createLiveData.liveWX;
                }
                if (createLiveData.selectUtil) {
                    this.selectUtil = createLiveData.selectUtil;
                }
                if (createLiveData.id) {
                    this.id = createLiveData.id;
                }
                if (createLiveData.shareImg) {
                    this.shareImg = createLiveData.shareImg;
                }
                if (createLiveData.liveBgc) {
                    this.liveBgc = createLiveData.liveBgc;
                }
            }
        },
        watch: {
            'id' : function (newVal) {
                this.saveLocalStorage("id", newVal)
            },
            'title': function (newVal) {
                this.saveLocalStorage("title", newVal)
            },
            'liveName': function (newVal) {
                this.saveLocalStorage("liveName", newVal)
            },
            'startTimeNum': function (newVal) {
                this.saveLocalStorage("startTimeNum", newVal)
            },
            'endTimeNum': function (newVal) {
                this.saveLocalStorage("endTimeNum", newVal)
            },
            'liveWX': function (newVal) {
                this.saveLocalStorage("liveWX", newVal)
            },
            'selectUtil': function (newVal) {
                this.saveLocalStorage("selectUtil", newVal)
            },
            'shareImg': function (newVal) {
                this.saveLocalStorage("shareImg", newVal)
            },
            'liveBgc': function (newVal) {
                this.saveLocalStorage("liveBgc", newVal)
            }
        },
        mounted() {
            this.formDate();
            var nowt = new Date().format("yyyy-MM-dd");
            var that = this;
            // 判断是否是创建直播间
            // 初始化时间选择插件
            var startData = {
                format: "YYYY-MM-DD hh:mm:ss",
                minDate: nowt,
                donefun: function (obj) {
                    // 获取当前input对象
                    var date = obj.elem.value.replace(/-/g, '/');
                    // 判断选择的时间是否在三十分钟后
                    var nowDate = new Date();
                    if ((Date.parse(date) - Date.parse(nowDate)) < (1000 * 60 * 30)) {
                        hui.alert("开播时间需为30分钟后");
                        that.startTimeNum = "";
                    } else {
                        that.startTimeNum = date;
                    }
                }
            };
            // 结束时间
            var endData = {
                format: "YYYY-MM-DD hh:mm:ss",
                minDate: nowt,
                donefun: function (obj) {
                    // 获取当前input对象
                    var date = obj.elem.value.replace(/-/g, '/');
                    that.endTimeNum = date;
                }
            };
            // 在新建直播间的时候需要把时间插件显示当前时间后三十分钟
            if (!this.id){
                startData.isinitVal=true;
                startData.initDate=[{YYYY:that.getDateTime("y",1920000),MM:that.getDateTime("m",1920000),DD:that.getDateTime("d",1920000),hh:that.getDateTime("h",1920000),mm:that.getDateTime("minute",1920000),ss:that.getDateTime("second",1920000)},false];
                endData.isinitVal=true;
                endData.initDate=[{YYYY:that.getDateTime("y",3840000),MM:that.getDateTime("m",3840000),DD:that.getDateTime("d",3840000),hh:that.getDateTime("h",3840000),mm:that.getDateTime("minute",3840000),ss:that.getDateTime("second",3840000)},false];
            }
            jeDate("#show01",startData);
            jeDate("#show02", endData);
        },
        methods: {
            // 更改选中直播间的功能
            handleSelectUtil(index) {
                console.log(index);
                var selectUtil = this.selectUtil;
                this.$set(selectUtil, index, !selectUtil[index])
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
                        window.location.href = "./liveRooms.html";
                    }
                } catch (e) {
                }
            },
            // 直播标题事件更改
            handleTitleChange(e, type) {
                // 判断直播标题是否大于17字符
                if (type === "title") {
                    if (e.target.value.length > 17) {
                        this.title = e.target.value.slice(0, 17);
                    }
                } else if (type === "live") {
                    // 判断主播昵称是否大于15字符
                    if (e.target.value.length > 15) {
                        this.liveName = e.target.value.slice(0, 15);
                    }
                }
            },
            // 保存数据到缓存
            saveLocalStorage(key, value) {
                var createLiveData = JSON.parse(localStorage.getItem("createLiveData")) || {};
                createLiveData[key] = value;
                localStorage.setItem("createLiveData", JSON.stringify(createLiveData));
            },
            // 点击提交审核
            next() {
                // 验证名称
                function getByteLen(val) {
                    var len = 0;
                    for (var i = 0; i < val.length; i++) {
                        var a = val.charAt(i);
                        if (a.match(/[^\x00-\xff]/ig) != null) {
                            len += 1;
                        }
                        else {
                            len += 0.5;
                        }
                    }
                    return len;
                }
                // 验证微信号
                // 验证直播标题是否符合规则
                if (!this.title || typeof this.title === undefined || typeof this.title === null || getByteLen(this.title) < 3) {
                    Toast({
                        message: '直播标题必须为3-17个字符（一个字等于两个英文字符或特殊字符）',
                        position: 'bottom',
                        duration: 2000
                    });
                    return
                }
                var nowDate = new Date();
                if ((Date.parse(this.startTimeNum) - Date.parse(nowDate)) < (1000 * 60 * 30)) {
                    hui.toast("开播时间需为30分钟后", "short");
                    this.startTimeNum = "";
                    return
                }
                if (!this.startTimeNum){
                    hui.toast("请选择开播时间", "short");
                    return
                }
                if (!this.endTimeNum) {
                    hui.toast("请选择结束时间", "short");
                    return
                }
                if ((Date.parse(this.endTimeNum) - Date.parse(this.startTimeNum)) < (1000 * 60 * 30)) {
                    hui.toast("直播时长不得短于30分钟", "short");
                    this.endTimeNum = "";
                    return
                }
                if ((Date.parse(this.endTimeNum) - Date.parse(this.startTimeNum)) > (1000 * 60 * 60 * 12)) {
                    hui.toast("直播时长最多为12小时", "short");
                    return
                }
                if (!this.liveName || getByteLen(this.liveName) < 2) {
                    Toast({
                        message: "主播昵称，最短2个汉字，最长15个汉字，1个汉字相当于2个字符",
                        position: 'bottom',
                        duration: 2000
                    });
                    return
                }
                if (!this.liveWX || !/^[a-zA-Z]([-_a-zA-Z0-9]{5,19})+$/.test(this.liveWX)) {
                    hui.toast("请输入正确的微信账号", "short");
                    return
                }
                location.href = "./saveCreateLive.html"
            },
            // 时间格式化
            formDate() {
                Date.prototype.format = function (format) {
                    var o = {
                        "M+": this.getMonth() + 1, // month
                        "d+": this.getDate(), // day
                        "h+": this.getHours(), // hour
                        "m+": this.getMinutes(), // minute
                        "s+": this.getSeconds(), // second
                        "q+": Math.floor((this.getMonth() + 3) / 3), // quarter
                        "S": this.getMilliseconds()
                        // millisecond
                    };
                    if (/(y+)/.test(format)) {
                        format = format.replace(RegExp.$1, (this.getFullYear() + "")
                            .substr(4 - RegExp.$1.length));
                    }
                    for (var k in o) {
                        if (new RegExp("(" + k + ")").test(format)) {
                            format = format.replace(RegExp.$1,
                                RegExp.$1.length == 1 ? o[k] : ("00" + o[k])
                                    .substr(("" + o[k]).length));
                        }
                    }
                    return format;
                };
            },
            // 修改直播间数据获取直播间详情
            getLiveData() {
                var that = this;
                request("GET", `${hostUrl}/localQuickPurchase/live/findLiveRoom/${that.id}`, {}).then(response => {
                    if (!response.code || response.code !== 200) {
                        hui.alert("加载失败," + response.message, "确认");
                    }
                    // 初始化页面数据
                    if (response.data) {
                        var data = response.data;
                        that.title = data.liveTitle,
                            that.liveName = data.nickName,
                            that.startTimeNum = that.getDateTime("",0,data.startTime),
                            that.endTimeNum = that.getDateTime("",0,data.endTime),
                            that.shareImg = data.shareImg;
                            that.liveBgc = data.coverImg;
                            that.liveWX = data.weChatAccount;
                            that.selectUtil = [data.comment, data.give, data.goodsShelves];
                    }
                })
            },
            // 获取年或其他
            getDateTime(type,num=0,formDate) {
                var date;
                // 判断是否是格式化时间，还是获取当前的时间
                if (formDate){
                    date = new Date(formDate);
                } else {
                    date = new Date(Date.parse(new Date())+num);
                }
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
                if (type==="y"){
                    return y
                } else if(type==="m") {
                    return m
                } else if(type==="d") {
                    return d
                } else if(type==="h") {
                    return h
                } else if(type==="minute") {
                    return minute
                } else if(type==="second") {
                    return second
                } else {
                    return y + '/' + m + '/' + d + " " + h + ":" + minute + ":" + second
                }
            }
        }

    }
</script>

<style>
    @import "createLive.less";
    @import "../../assets/js/jeDate/jedate.css";
    @import "../../assets/css/style.css";

    .util {
        border-bottom: none;
        background: #fff;
        margin-top: 0.2rem;
        padding: 0.2rem;
    }

    .live-util {
        display: flex;
    }

    .live-util .util-item {
        display: flex;
        align-items: center;
    }

    .live-util .util-item img {
        display: flex;
        height: 0.34rem;
        width: 0.34rem;
    }

    .share-title {
        margin-bottom: 0.26rem;
        height: 0.26rem;
        font-size: 0.26rem;
        font-family: Hiragino Sans GB;
        font-weight: normal;
        color: rgba(33, 33, 33, 1);
    }

    .util-item {
        margin-right: 0.6rem;
    }

    .util-item p {
        margin-left: 0.21rem;
        font-size: 0.26rem;
        font-family: Hiragino Sans GB;
        font-weight: normal;
        color: rgba(102, 102, 102, 1);
    }

    .upload-input {
        width: 2.4rem;
        height: 2rem;
        background: #ccc;
        position: absolute;
        top: 0.8rem;
        left: 50%;
        transform: translate(-50%, 0);
        opacity: 0;
        outline: none;
    }

    .bgc .upload-input {
        height: 3rem;
    }

    html {
        width: 100%;
        height: 100%;
        background-color: #f6f6f6;
    }

    [v-cloak] {
        display: none;
    }

    input {
        outline: none;
    }

    body {
        background: transparent;
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
        cursor: pointer;
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

    .createContent {
        margin-top: 49px;
    }

    .detail {
        background-color: #fff;
        padding: 0 0.24rem;
    }

    .live-title {
        height: 0.88rem;
        line-height: 0.88rem;
        display: flex;
        position: relative;
        margin: 0.02rem 0;
        justify-content: space-between;
        border-bottom: 0.01rem solid rgba(238, 238, 238, 1);
    }

    .live-title .title {
        width: 1.8rem;
        height: 0.26rem;
        font-size: 0.26rem;
        font-family: Hiragino Sans GB;
        font-weight: normal;
        color: rgba(33, 33, 33, 1);
    }

    input {
        border: none;
        outline: none;
        text-align: right;
        height: 0.86rem;
        line-height: 0.86rem;
    }

    input::placeholder {
        font-size: 0.26rem;
        font-family: Hiragino Sans GB;
        font-weight: normal;
        color: rgba(153, 153, 153, 1);
    }

    /* 选择开始时间样式 */
    .startTime {
        position: relative;
    }
    .startTime #show01{
        position: absolute;
        right: 0.316rem;
        top: 0;
        opacity: 0;
    }

    /* 选择结束时间样式 */
    .endTime {
        position: relative;
    }
    .endTime #show02{
        position: absolute;
        right: 0.316rem;
        top: 0;
        opacity: 0;
    }

    .time {
        display: flex;
        align-items: center;
    }

    .time input {
        max-width: 4rem;
    }

    .time img {
        width: 0.3rem;
        height: 0.28rem;
        margin-left: 0.16rem;
    }

    .Tips {
        padding: 0.2rem 0;
        font-family: Hiragino Sans GB;
        font-weight: normal;
        color: rgba(153, 153, 153, 1);
        font-size: 0.24rem;
        font-weight: normal;
        line-height: 0.36rem;
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
        margin-top: 1.75rem;
        margin-bottom: 0.6rem;
    }

    .detailTwo {
        margin-top: 0.2rem;
    }

    /* 遮罩层 */
    #hui-mask {
        position: fixed;
        z-index: 20;
        background: rgba(0, 0, 0, 0.3);
        width: 100%;
        left: 0px;
        top: 0px;
        height: 100%;
    }

    /* 对话框 */
    @keyframes hui-a-fade-in {
        0% {
            opacity: 0;
        }
        100% {
            opacity: 1
        }
    }

    @-moz-keyframes hui-a-fade-in {
        0% {
            opacity: 0;
        }
        100% {
            opacity: 1
        }
    }

    @-webkit-keyframes hui-a-fade-in {
        0% {
            opacity: 0;
        }
        100% {
            opacity: 1
        }
    }

    @-o-keyframes hui-a-fade-in {
        0% {
            opacity: 0;
        }
        100% {
            opacity: 1
        }
    }

    .hui-fade-in {
        animation: hui-a-fade-in 180ms linear;
        -moz-animation: hui-a-fade-in 180ms linear;
        -webkit-animation: hui-a-fade-in 180ms linear;
        -o-animation: hui-a-fade-in 180ms linear;
    }

    #hui-icon-toast {
        width: 158px;
        position: fixed;
        z-index: 99999;
        left: 50%;
        top: 50%;
        -webkit-transform: translate(-50%, -50%);
        transform: translate(-50%, -50%);
        -moz-transform: translate(50%, 50%);
        -o-transform: translate(50%, 50%);
        background: rgba(0, 0, 0, 0.9);
        border-radius: 5px;
    }

    #hui-icon-toast * {
        color: #FFFFFF;
    }

    #hui-icon-toast .hui-icons {
        text-align: center;
        font-size: 50px;
        height: 40px;
        font-weight: 700;
        line-height: 40px;
        padding: 28px 0px 18px 0px;
    }

    #hui-icon-toast .hui-text-center {
        line-height: 30px;
        padding-bottom: 15px;
        font-size: 16px;
        height: auto;
    }

    @keyframes hui-a-up-toast {
        0% {
            top: -35px;
        }
        100% {
            top: 0
        }
    }

    @-moz-keyframes hui-a-up-toast {
        0% {
            top: -35px;
        }
        100% {
            top: 0
        }
    }

    @-webkit-keyframes hui-a-up-toast {
        0% {
            top: -35px;
        }
        100% {
            top: 0
        }
    }

    @-o-keyframes hui-a-up-toast {
        0% {
            top: -35px;
        }
        100% {
            top: 0
        }
    }

    #hui-up-toast {
        width: 100%;
        height: 50px;
        line-height: 50px;
        background: rgba(0, 0, 0, 0.9);
        position: fixed;
        z-index: 21;
        left: 0px;
        top: 0px;
        animation: hui-a-up-toast 200ms linear;
        -moz-animation: hui-a-up-toast 200ms linear;
        -webkit-animation: hui-a-up-toast 200ms linear;
        -o-animation: hui-a-up-toast 200ms linear;
        color: #FFFFFF;
        text-align: center;
    }

    #hui-up-toast * {
        color: #FFFFFF;
        text-align: center;
    }

    #hui-dialog {
        width: 100%;
        position: fixed;
        z-index: 21;
        left: 50%;
        top: 50%;
        -webkit-transform: translate(-50%, -50%);
        transform: translate(-50%, -50%);
        -moz-transform: translate(-50%, -50%);
        -o-transform: translate(-50%, -50%);
    }

    #hui-dialog-in {
        width: 290px;
        margin: 0 auto;
        background: #FFFFFF;
        border-radius: 1px;
    }

    #hui-dialog-msg {
        padding: 28px 15px;
        font-size: 16px;
        text-align: center;
        line-height: 32px;
        padding-bottom: 22px;
    }

    #hui-dialog-btn-line {
        height: 48px;
        line-height: 48px;
        color: #4C9ED9;
        border-top: 1px solid #F4F5F6;
        text-align: center;
        font-size: 16px;
    }

    #hui-dialog-btn-line > div {
        width: 50%;
        color: #FFFFFF;
        float: left;
        height: 48px;
        line-height: 48px;
        text-align: center;
        font-size: 16px;
        background: #4C9ED9;
    }

    #hui-dialog-btn-line > div:first-child {
        color: #999999 !important;
        background: #FFFFFF;
    }

    #hui-dialog-input-in {
        width: 85%;
        padding: 0px 2%;
        margin: 0 auto;
        border: 1px solid #D1D1D1;
        height: 35px;
    }

    #hui-dialog-input {
        width: 100%;
        border: none;
        height: 35px;
        line-height: 35px;
    }

    #hui-toast {
        width: 100%;
        position: fixed;
        z-index: 9999;
        left: 0;
        bottom: 50px;
        text-align: center;
    }

    #hui-toast-msg {
        margin: 0 auto;
        height: 36px;
        line-height: 36px;
        background: rgba(0, 0, 0, 0.7);
        padding: 2px 10px;
        color: #FFFFFF;
        font-size: 14px;
        text-align: center;
        max-width: 200px;
        border-radius: 6px;
        display: inline-block;
    }

    /* laoding */
    @keyframes hui-a-rotate360 {
        0% {
            transform: rotate(0deg);
        }
        50% {
            transform: rotate(180deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }

    @-webkit-keyframes hui-a-rotate360 {
        0% {
            -webkit-transform: rotate(0deg);
        }
        50% {
            -webkit-transform: rotate(180deg);
        }
        100% {
            -webkit-transform: rotate(360deg);
        }
    }

    @-moz-keyframes hui-a-rotate360 {
        0% {
            -moz-transform: rotate(0deg);
        }
        50% {
            -moz-transform: rotate(180deg);
        }
        100% {
            -moz-transform: rotate(360deg);
        }
    }

    @-o-keyframes hui-a-rotate360 {
        0% {
            -o-transform: rotate(0deg);
        }
        50% {
            -o-transform: rotate(180deg);
        }
        100% {
            -o-transform: rotate(360deg);
        }
    }

    .hui-loading-wrap {
        position: absolute;
        z-index: 1;
        left: 50%;
        top: 50%;
        -webkit-transform: translate(-50%, -50%);
        transform: translate(-50%, -50%);
        -moz-transform: translate(-50%, -50%);
        -o-transform: translate(-50%, -50%);
    }

    .hui-loading {
        width: 22px;
        height: 22px;
        line-height: 20px;
        font-size: 18px;
        text-align: center;
        font-family: "hui-font" !important;
        animation: hui-a-rotate360 1s infinite linear;
        -webkit-animation: hui-a-rotate360 1s infinite linear;
        -moz-animation: hui-a-rotate360 1s infinite linear;
        -o-animation: hui-a-rotate360 1s infinite linear;
        float: left;
    }

    .hui-loading:before {
        content: "\e647";
    }

    .hui-loading-text {
        float: left;
        line-height: inherit;
        padding-left: 3px;
    }
</style>
