<template>
    <div id="app">
        <div class="mainBox ">
            <header class="mint-header">
                <img src="../../assets/img/back.png" alt="" @click="goback">
                <h1 class="mint-header-title ">创建直播间</h1>
                <div class="kill">提示</div>
            </header>
            <div class="createContent">
                <div class="share-img">
                    <p class="share-title">分享卡片封面:</p>
                    <img :src="shareImg" alt="" class="shareImg">
                    <input type="file" accept="image/*" @change="uploadFile($event,1)" class="upload-input shareImg">
                    <p class="share-denger">
                        观众在微信对话框内分享的直播间将心分享卡片的形式呈现，建议尺寸800*640 大小不超过1M
                    </p>
                </div>
                <div class="share-img bgc">
                    <p class="share-title">直播间背景墙:</p>
                    <img class="liveBgc SliveBgc" :src="liveBgc" alt="">
                    <input type="file" accept="image/*" @change="uploadFile($event,2)" class="upload-input SliveBgc">
                    <p class="share-denger">
                        直播间背景墙是每个直播间的默认背景，建议尺寸1080*1920 大小不超过2M
                    </p>
                </div>
                <!--新建直播间-->
                <div class="liveBtn">
                    <p @click="back" class="back">上一步</p>
                    <p class="createLive" @click="saveToexamine">创建</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import flexible from "../../../common/lib/flexible/flexible"
    import common from "../../../common/js/common"
    import index from "../../../upms/static/goods_shopper_apply/index"
    import hostUrl from "../../assets/js/apis"
    import request from "../../assets/js/request";
    import { Toast } from 'mint-ui';
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
                // 分享卡片图片
                shareImg: require("../../assets/img/zbdh_img_fx.png"),
                // 直播背景墙
                liveBgc: require("../../assets/img/liveBgc.png"),
                // 防止多次点击
                postTrue: true,
            }
        },
        created() {
            // 获取缓存中创建直播间数据
            var createLiveData = JSON.parse(localStorage.getItem("createLiveData")) || {};
            if (createLiveData) {
                // 如果缓存中存在 分享图
                if (createLiveData.shareImg) {
                    this.shareImg = createLiveData.shareImg;
                }
                // 如果缓存中存在 背景墙
                if (createLiveData.liveBgc) {
                    this.liveBgc = createLiveData.liveBgc;
                }
            }
        },
        mounted() {
        },
        watch: {
            'shareImg': function (newVal) {
                this.saveLocalStorage("shareImg", newVal)
            },
            'liveBgc': function (newVal) {
                this.saveLocalStorage("liveBgc", newVal)
            }
        },
        methods: {
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
            // 返回上步
            back() {
              history.go(-1);
            },
            // 保存并提审的事件处理
            saveToexamine() {
                this.next();
            },
            next() {
                var createLiveData = JSON.parse(localStorage.getItem("createLiveData"));
                // 验证微信号
                // 验证直播标题是否符合规则
                if (!createLiveData.title || typeof createLiveData.title === undefined || typeof createLiveData.title === null ) {
                    hui.toast("直播标题必须为3-17个字符", "short");
                    return
                }
                var nowDate = new Date();
                if ((Date.parse(createLiveData.startTimeNum) - Date.parse(nowDate)) < (1000 * 60 * 30)) {
                    hui.toast("开播时间需为30分钟后", "short");
                    return
                }
                if (!createLiveData.startTimeNum){
                    hui.toast("请选择开播时间", "short");
                    return
                }
                if (!createLiveData.endTimeNum) {
                    hui.toast("请选择结束时间", "short");
                    return
                }
                if ((Date.parse(createLiveData.endTimeNum) - Date.parse(createLiveData.startTimeNum)) < (1000 * 60 * 30)) {
                    hui.toast("直播时长不得短于30分钟", "short");
                    return
                }
                if ((Date.parse(createLiveData.endTimeNum) - Date.parse(createLiveData.startTimeNum)) > (1000 * 60 * 60 * 12)) {
                    hui.toast("直播时长最多为12小时", "short");
                    return
                }
                if (!createLiveData.liveName || createLiveData.liveName.length < 2) {
                    hui.toast("主播昵称必须为2-15个字符", "short");
                    return
                }
                if (!createLiveData.liveWX || !/^[a-zA-Z]([-_a-zA-Z0-9]{5,19})+$/.test(createLiveData.liveWX)) {
                    hui.toast("请输入正确的微信账号", "short");
                    return
                }
                this.saveCreateLive();
            },
            // 保存数据到缓存
            saveLocalStorage(key, value) {
                var createLiveData = JSON.parse(localStorage.getItem("createLiveData")) || {};
                createLiveData[key] = value;
                localStorage.setItem("createLiveData", JSON.stringify(createLiveData));
            },
            // 上传图片接口
            uploadFile(obj, type) {
                var that = this;
                hui.loading('图片上传中,请稍后...');
                var files = obj.target.files || [];
                if (files.length === 0) {
                    return;
                }
                var file = files[0];
                var formdata = new FormData();
                formdata.append("multipartFiles", file);
                var xhr = new XMLHttpRequest();
                // 绑定上传事件
                // 完成
                xhr.addEventListener("load", function (e) {
                    // 从文件中删除上传成功的文件  false是不执行onDelete回调方法
                    console.log(e, 333);
                    if (e.srcElement.response != null) {
                        var result = eval('(' + e.srcElement.response + ')');
                        console.log(result, '123');
                        if (result.code == null || result.code == "") {
                            hui.alert("很抱歉上传失败了...");
                            hui.loading(false, true);
                        } else {
                            //上传成功
                            if (type === 1) {
                                that.shareImg = result.data[0]+"?imageView2/1/w/800/h/640"
                            } else if (type === 2) {
                                that.liveBgc = result.data[0]+"?imageView2/1/w/1080/h/1920"
                            }
                            hui.loading(false, true);
                        }
                    }
                }, false);
                // 错误
                xhr.addEventListener("error", function (e) {
                    // 回调到外部
                    hui.alert("很抱歉上传失败了...");
                    hui.loading(false, true);
                }, false);
                xhr.open("POST", `${hostUrl}/localQuickPurchase/live/uploadFile`, true);
                //选择包含中文名的图片会报错
                xhr.send(formdata);
            },
            // 保存用户创建直播间
            saveCreateLive() {
                var that = this;
                // 如果是修改直播间的话调用修改直播间接口
                var url = '';
                var createLiveData = JSON.parse(localStorage.getItem("createLiveData"));
                if (createLiveData.id) {
                    url = `${hostUrl}/localQuickPurchase/live/update`
                } else {
                    url = `${hostUrl}/localQuickPurchase/live/save`
                }
                // 判断直播功能是否为空
                if (!createLiveData.selectUtil) {
                    createLiveData.selectUtil = this.selectUtil
                }
                var saveData = {
                    "seq": Number(localStorage.getItem("seq")) , // 用户seq
                    "liveTitle": createLiveData.title, //直播间标题
                    "startTime": createLiveData.startTimeNum,  // 开始时间
                    "endTime": createLiveData.endTimeNum, //结束时间
                    "nickName": createLiveData.liveName,  //主播昵称
                    "weChatAccount": createLiveData.liveWX, //播微信账号
                    "give": createLiveData.selectUtil ? createLiveData.selectUtil[1] : false, //点赞
                    "comment": createLiveData.selectUtil ? createLiveData.selectUtil[0] : true, //评论
                    "goodsShelves": createLiveData.selectUtil ? createLiveData.selectUtil[2] : false, //商品货架
                    "coverImg":createLiveData.liveBgc || "http://filets.520shq.com/file/1597906942091liveBgc.png?imageView2/1/w/1080/h/1920",
                    "shareImg": createLiveData.shareImg || "http://filets.520shq.com/file/1597906898015zbdh_img_fx.png?imageView2/1/w/800/h/640",
                };
                // 如果是修改商品 传入需要修改直播间的id
                if (createLiveData.id) {
                    saveData.id = createLiveData.id
                }
                // 防止多次提交事件
                if (!this.postTrue){
                    return
                }
                this.postTrue = false;
                setTimeout(function () {
                    that.postTrue = true
                },3000);
                request("POST", url, saveData).then(response => {
                    if (response.code == 400) {
                        hui.alert("暂无该直播间信息", "确认");
                    }
                    if (response.code == 200) {
                        localStorage.removeItem("createLiveData");
                        location.href = "./liveRooms.html"
                    } else  if (response.errors){
                        Toast({
                            message: response.errors[0].defaultMessage,
                            position: 'bottom',
                            duration: 2000
                        });
                    }
                }).catch(err=>{
                    hui.toast("创建失败，请稍后再试!", "short");
                })
            },
        }
    }
</script>

<style>
    @import "saveCreateLive.less";
    @import "../../assets/css/style.css";

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
        padding: 0 0.2rem 0.08rem 0.2rem;
        background: #fff;
    }
    .liveBtn{
        display: flex;
        justify-content: space-around;
    }
    .liveBtn .back {
        width:2.4rem;
        height:0.62rem;
        line-height: 0.62rem;
        text-align: center;
        font-family: Hiragino Sans GB;
        font-weight: normal;
        border-radius: 2rem;
        margin: 0 auto;
        margin-top: 0.8rem;
        margin-bottom: 0.6rem;
        background:rgba(180,180,180,1);
        font-size:0.26rem;
        font-family:Hiragino Sans GB;
        font-weight:normal;
        color:rgba(255,255,255,1);
    }
    .liveBtn .createLive {
        width:2.4rem;
        height:  0.62rem;
        line-height:  0.62rem;
        text-align: center;
        background: rgba(243, 47, 50, 1);
        font-size:0.26rem;
        font-family: Hiragino Sans GB;
        font-weight: normal;
        color: rgba(255, 255, 255, 1);
        border-radius: 2rem;
        margin: 0 auto;
        margin-top: 0.8rem;
        margin-bottom: 0.6rem;
    }

    .share-img {
        border-bottom: 0.01rem solid rgba(238, 238, 238, 1);
        position: relative;
    }

    .share-img img {
        width: 2.4rem;
        height: 2rem;
        margin: 0.2rem auto;
        display: block;
    }

    .share-img .share-title {
        font-size: 0.26rem;
        font-family: Hiragino Sans GB;
        font-weight: normal;
        color: rgba(33, 33, 33, 1);
        padding-top: 0.2rem;
    }

    .share-img .share-denger {
        font-size: 0.22rem;
        font-family: Hiragino Sans GB;
        font-weight: normal;
        color: rgba(153, 153, 153, 1);
        margin-bottom: 0.1rem;
    }

    .bgc .liveBgc {
        height: 3rem;
        width: 2.4rem;
        border-radius: 0.04rem;
    }

    input {
        outline: none;
    }

    .util {
        border-bottom: none;
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
    .SliveBgc{
        width:2.16rem !important;
        height:3.81rem !important;
    }
    .shareImg{
        width:2.5rem !important;
        height:2rem !important;
    }
</style>
