<template>
    <div id="app">
        <div class="mainBox ">
            <header class="mint-header">
                <img src="../../assets/img/back.png" alt="" @click="goBack">
                <h1 class="mint-header-title ">{{edit?"修改商品":"添加商品"}}</h1>
                <div class="kill">提示</div>
            </header>
            <div class="createContent">
                <div class="shopName ">
                    <p>商品id:</p>
                    <div v-if="edit">
                        <p class="shopId">{{goodCode}}</p>
                        <img src="../../assets/img/right.png" alt="">
                    </div>
                    <div @click="getShopid" v-else>
                        <p class="shopId">{{goodCode||'点击选择商品'}}</p>
                        <img src="../../assets/img/right.png" alt="">
                    </div>
                </div>
                <div class="share-img">
                    <p class="share-title">商品封面:</p>
                    <img :src="shopImg" v-if="shopImg" alt="">
                    <div class="uploadFile" v-else>上传图片</div>
                    <input type="file" accept="image/*" @change="uploadFile($event,1)" class="upload-input"
                           v-if="!edit">
                    <p class="share-denger">
                        建议尺寸：200*200 大小不超过50KB
                    </p>
                </div>
                <div class="shopName b-b">
                    <p>商品名称:</p>
                    <input type="text" v-model="shopName" @input="shopNameChange" :disabled="edit"
                           placeholder="请输入商品名称，最多14个字符">
                </div>
            </div>
        </div>
        <div class="price">
            <div class="priceTitle">价格形式:</div>
            <div class="priceRight">
                <!--一口价-->
                <div class="priceType b-b">
                    <div class="typeItems" @click="selectedPricetype(1)">
                        <img v-if="shopPricetype===1"
                             src="../../assets/img/tg_icon_del_choose.png" alt="">
                        <img v-else src="../../assets/img/tg_icon_tel_choose.png" alt="">
                        <span>一口价</span>
                    </div>
                    <div class="price-input">
                        <input type="text" :disabled="shopPricetype!=1" v-if="shopPricetype!=1">
                        <input type="number" v-model.number="shopPrice" v-else>
                        <span>元</span>
                    </div>
                </div>
                <!--区间价格-->
                <div class="b-b qujain">
                    <div class="typeItems" @click="selectedPricetype(2)">
                        <img v-if="shopPricetype===2" src="../../assets/img/tg_icon_del_choose.png" alt="">
                        <img v-else src="../../assets/img/tg_icon_tel_choose.png" alt="">
                        <span>价格区间</span>
                    </div>
                    <div class="price-input">
                        <p class="qujianTitle">价格区间</p>
                        <div class="qujian-con">
                            <div class="qujainPrice">
                                <!-- 需要选中对应的价格形式才可以输入文字 -->
                                <input type="number" :disabled="shopPricetype!=2" v-if="shopPricetype!=2">
                                <!-- 区间价格左侧价格需要低于右侧价格 -->
                                <input type="number" v-model.number="minPrice" v-else>
                                <span>元</span>
                            </div>
                            <p class="line"></p>
                            <div class="qujainPrice">
                                <input type="number" :disabled="shopPricetype!=2" v-if="shopPricetype!=2">
                                <input type="number" v-model.number="shopPrice" v-else @blur="verificationPrice">
                                <span>元</span>
                            </div>
                        </div>
                    </div>
                </div>
                <!--显示折扣价-->
                <div class="b-b qujain discount">
                    <div class="typeItems" @click="selectedPricetype(3)">
                        <img v-if="shopPricetype===3" src="../../assets/img/tg_icon_del_choose.png" alt="">
                        <img v-else src="../../assets/img/tg_icon_tel_choose.png" alt="">
                        <span>显示折扣价</span>
                    </div>
                    <div class="price-input">
                        <div class="discountItem">
                            <p class="qujianTitle">原价</p>
                            <div class="qujainPrice">
                                <input type="number" :disabled="shopPricetype!=3" v-if="shopPricetype!=3">
                                <input type="number" v-model.number="minPrice" v-else @blur="verificationPrice">
                                <span>元</span>
                            </div>
                        </div>
                        <div class="discountItem">
                            <p class="qujianTitle">现价</p>
                            <div class="qujainPrice">
                                <input type="number" :disabled="shopPricetype!=3" v-if="shopPricetype!=3">
                                <input type="number" v-model.number="shopPrice" v-else @blur="verificationPrice">
                                <span>元</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!--新建直播间-->
        <p class="createLive" @click="saveToexamine">{{edit?"修改价格并提审":"保存并提审"}}</p>
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
                // 商品的封面
                shopImg: '',
                // 商品的名称
                shopName: '',
                // 商品的id
                goodCode: '',
                // 商品的价格形式
                shopPricetype: 1,
                // 商品的价格
                shopPrice: '',
                // 商品区间价 折扣价
                minPrice: '',
                // 是否是修改商品
                edit: false,
                // 防止多次提交事件
                postTrue:true
            }
        },
        created() {
        },
        mounted() {
            var createLiveData = JSON.parse(localStorage.getItem("addLiveshop")) || {};
            if (createLiveData) {
                if (createLiveData.shopImg) {
                    this.shopImg = createLiveData.shopImg
                }
                if (createLiveData.shopName) {
                    this.shopName = createLiveData.shopName
                }
                if (createLiveData.goodCode) {
                    this.goodCode = createLiveData.goodCode
                }
                if (createLiveData.shopPricetype) {
                    this.shopPricetype = createLiveData.shopPricetype
                }
                if (createLiveData.shopPrice) {
                    this.shopPrice = createLiveData.shopPrice
                }
                if (createLiveData.minPrice) {
                    this.minPrice = createLiveData.minPrice
                }
                if (createLiveData.id) {
                    this.id = createLiveData.id
                }
                if (createLiveData.isWarehousing) {
                    this.isWarehousing = createLiveData.isWarehousing
                }
                // 修改商品
                if (createLiveData.edit) {
                    this.edit = createLiveData.edit
                }
            }
        },
        watch: {
            'shopImg': function (newVal) {
                this.saveLocalStorage("shopImg", newVal)
            },
            'shopName': function (newVal) {
                this.saveLocalStorage("shopName", newVal)
            },
            'goodCode': function (newVal) {
                this.saveLocalStorage("goodCode", newVal)
            },
            'shopPricetype': function (newVal) {
                this.saveLocalStorage("shopPricetype", newVal)
            },
            'shopPrice': function (newVal) {
                if (isNaN(newVal)){
                    this.shopPrice = this.shopPrice.slice(0,this.shopPrice.length-1)
                    return
                }
                if(this.shopPrice.toString().indexOf(".")>-1){
                    this.shopPrice =  Number(this.shopPrice.toString().slice(0,this.shopPrice.toString().indexOf(".")+3))
                }
                this.saveLocalStorage("shopPrice", newVal)
            },
            'minPrice': function (newVal) {
                if(this.minPrice.toString().indexOf(".")>-1){
                    this.minPrice =  Number(this.minPrice.toString().slice(0,this.minPrice.toString().indexOf(".")+3))
                }
                this.saveLocalStorage("minPrice", newVal)
            }
        },
        methods: {
            // 商品名称限制
            shopNameChange(e) {
                this.shopName = e.target.value.slice(0, 14);
                if (e.target.value.length >= 14) {
                    hui.toast("商品名称必须为3-14个汉字", "short");
                }
            },
            // 文本框失焦事件
            verificationPrice() {
                // 区间价格验证
                if (this.shopPricetype == 2) {
                    if (this.minPrice > this.shopPrice) {
                        hui.alert("左侧价格需要比右侧价格低");
                    }
                    // 显示折扣价验证
                } else if (this.shopPricetype == 3) {
                    if (this.minPrice < this.shopPrice) {
                        hui.alert("现价价格需要比原价价格低");
                    }
                }
            },
            // 价格的类型
            selectedPricetype(index) {
                this.shopPricetype = index;
            },
            // 获取商品id
            getShopid() {
                window.location = "./selectShopid.html"
            },
            // 保存并提审的事件处理
            saveToexamine() {
                // 如果是新增商品的话
                // 防止多次提交事件
                var that = this;
                if (!this.postTrue){
                    return
                }
                this.postTrue = false;
                setTimeout(()=>{
                    that.postTrue = true
                },3000);
                if (!this.edit) {
                    this.savsGood();
                    // 如果是修改商品的话
                } else {
                    this.saveEditGood()
                }
            },
            // 保存数据到缓存
            saveLocalStorage(key, value) {
                var createLiveData = JSON.parse(localStorage.getItem("addLiveshop")) || {};
                createLiveData[key] = value;
                localStorage.setItem("addLiveshop", JSON.stringify(createLiveData));
            },
            // 更改选中直播间的功能
            handleSelectUtil(index) {
                var selectUtil = this.selectUtil;
                this.$set(selectUtil, index, !selectUtil[index])
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
                // 判断图片上传的格式
                if (!/\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(file.name)) {
                    hui.toast("图片须为.gif,jpeg,jpg,png格式", "short");
                    hui.loading(false, true);
                    return false;
                }
                that.compressImage(file, 0.5, that.uploadImg)
            },
            // 压缩完图片进行上传图片
            uploadImg(file) {
                var that = this;
                var formdata = new FormData();
                formdata.append("multipartFiles", file);
                var xhr = new XMLHttpRequest();
                // 绑定上传事件
                // 完成
                xhr.addEventListener("load", function (e) {
                    // 从文件中删除上传成功的文件  false是不执行onDelete回调方法
                    if (e.srcElement.response != null) {
                        var result = eval('(' + e.srcElement.response + ')');
                        if (result.code == null || result.code == "") {
                            hui.alert("很抱歉上传失败了...");
                            hui.loading(false, true);
                        } else {
                            //上传成功
                            that.shopImg = result.data[0]+"?imageView2/1/w/200/h/200";
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
            // 保存新增商品到数据库
            savsGood() {
                var that = this;
                var createLiveData = JSON.parse(localStorage.getItem("addLiveshop")) || {};
                // 提交到数据库的数据
                var saveData = {
                    "addOrUpdate": 1, // 是新增商品还是修改
                    "coverImg": createLiveData.shopImg, // 商品封面
                    "goodsCode": createLiveData.goodCode, //商品的code码
                    "descPrice": 0,
                    "name": createLiveData.shopName, // 商品的名称
                    "priceType": createLiveData.shopPricetype || that.shopPricetype, // 1一口价  2价格区间  3显示折扣价
                    "seq": Number(localStorage.getItem("seq")), // 用户的seq
                    "targetPrice": createLiveData.shopPrice,  // 商品的价格 最高价格或一口价
                };
                // 判断是否是区间价格 或折扣价格
                if (createLiveData.shopPricetype != 1) {
                    saveData.descPrice = createLiveData.minPrice;
                }
                // 验证数据是否符合
                var isTrue = this.valDetails(saveData);
                if (isTrue.errMessage) {
                    hui.alert(isTrue.errMessage);
                    return
                }
                // 请求后台接口
                request("POST", `${hostUrl}/localQuickPurchase/live/goods/save`, saveData).then(response => {
                    if (!response.code || response.code !== 200) {
                        hui.alert("商品加载失败," + response.message);
                    }
                    // 数据插入成功或修改成功
                    if (response.code === 200) {
                        localStorage.removeItem("addLiveshop");
                        location.href = "./liveRooms.html?selectTab=2"
                    }
                })
            },
            // 修改商品保存
            saveEditGood() {
                var that = this;
                var createLiveData = JSON.parse(localStorage.getItem("addLiveshop")) || {};
                // 提交到数据库的数据
                var saveData = {
                    "id": createLiveData.id, // 商品新增后的id
                    "isWarehousing": createLiveData.isWarehousing, // 是否入库
                    "coverImg": createLiveData.shopImg, // 商品封面
                    "goodsCode": createLiveData.goodCode, //商品的code码
                    "descPrice": createLiveData.minPrice || 0, //原价或区间价第一价格
                    "name": createLiveData.shopName, // 商品的名称
                    "priceType": createLiveData.shopPricetype || that.shopPricetype, // 1一口价  2价格区间  3显示折扣价
                    "seq": Number(localStorage.getItem("seq")), // 用户的seq
                    "targetPrice": createLiveData.shopPrice,  // 商品的价格 最高价格或一口价
                };
                // 判断是否是区间价格 或折扣价格
                if (createLiveData.shopPricetype != 1) {
                    saveData.descPrice = createLiveData.minPrice;
                }
                // 验证数据是否符合
                var isTrue = this.valDetails(saveData);
                if (isTrue.errMessage) {
                    hui.alert(isTrue.errMessage);
                    return
                }
                // 请求后台接口
                request("POST", `${hostUrl}/localQuickPurchase/live/goods/update`, saveData).then(response => {
                    if (!response.code || response.code !== 200) {
                        hui.alert("商品加载失败," + response.message);
                    }
                    // 数据插入成功或修改成功
                    if (response.code === 200) {
                        hui.toast("修改成功", "short");
                        setTimeout(() => {
                            localStorage.removeItem("addLiveshop");
                            location.href = "./liveRooms.html?selectTab=2"
                        }, 2000)
                    }
                })
            },
            // 验证商品的数据是否符合规则
            valDetails(saveData) {
                if (!saveData.coverImg) {
                    return {errMessage: "请上传商品封面图片"}
                } else if (!saveData.goodsCode) {
                    return {errMessage: "请选择需要上传的商品Id"}
                } else if (!saveData.name || typeof saveData.name === undefined || typeof saveData.name === null) {
                    return {errMessage: "请输入商品的名称"}
                } else if (saveData.name.length < 3) {
                    return {errMessage: "商品名称必须为3-14个汉字"}
                }
                if (saveData.name.length > 14) {
                    return {errMessage: "商品名称必须为3-14个汉字"}
                }
                if (this.shopPricetype == 1) {
                    // 区间价格验证
                    var isNumber = this.isRealNum(this.shopPrice);
                    if (!isNumber) {
                        return {errMessage: "请输入正确的价格"}
                    }
                } else if (this.shopPricetype == 2) {
                    if (this.minPrice > this.shopPrice) {
                        return {errMessage: "左侧价格需要比右侧价格低"}
                    }
                    if (this.minPrice <= 0) {
                        return {errMessage: "价格不能小于或等于0"}
                    }
                    if (this.minPrice<0.01||this.shopPrice>10000000) {
                        return {errMessage: "请输入0.01-10000000元的金额"}
                    }
                    // 显示折扣价验证
                } else if (this.shopPricetype == 3) {
                    if (this.minPrice <= this.shopPrice) {
                        return {errMessage: "现价价格需要比原价价格低"}
                    }
                    if (this.minPrice <= 0) {
                        return {errMessage: "价格不能小于或等于0"}
                    }
                }
                if (this.shopPrice <= 0) {
                    return {errMessage: "价格不能小于或等于0"}
                }

                // 验证通过
                return {}
            },
            // 是否是数字
            isRealNum(val) {
                // isNaN()函数 把空串 空格 以及NUll 按照0来处理 所以先去除，
                if (val === "" || val == null) {
                    return false;
                }
                if (!isNaN(val)) {
                    //对于空数组和只有一个数值成员的数组或全是数字组成的字符串，isNaN返回false，例如：'123'、[]、[2]、['123'],isNaN返回false,
                    //所以如果不需要val包含这些特殊情况，则这个判断改写为if(!isNaN(val) && typeof val === 'number' )
                    return true;
                } else {
                    return false;
                }
            },
            // 返回上一级按钮事件
            goBack() {
                window.location = "./liveRooms.html?selectTab=2"
            },
            // 上传图片时进行压缩处理
            compressImage(file, quality, func) {
                var that = this;
                // 图片小于0.5M不压缩
                if (Math.ceil(file.size / 1024) < 512) {
                    func && func(file);
                    return
                }
                //默认0.5倍压缩
                quality = quality;
                //保存文件名，后边用到
                var name = file.name;
                var reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = function (e) {
                    var src = e.target.result;
                    var img = new Image();
                    img.src = src;
                    img.onload = function (e) {
                        var w = img.width;
                        var h = img.height;
                        //生成canvas
                        var canvas = document.createElement('canvas');
                        var ctx = canvas.getContext('2d');
                        // 创建属性节点
                        var anw = document.createAttribute("width");
                        anw.nodeValue = w;
                        var anh = document.createAttribute("height");
                        anh.nodeValue = h;
                        canvas.setAttributeNode(anw);
                        canvas.setAttributeNode(anh);
                        //铺底色 PNG转JPEG时透明区域会变黑色
                        ctx.fillStyle = "#fff";
                        ctx.fillRect(0, 0, w, h);
                        ctx.drawImage(img, 0, 0, w, h);
                        // quality值越小，所绘制出的图像越模糊
                        var base64 = canvas.toDataURL('image/jpeg', quality); //图片格式jpeg或webp可以选0-1质量区间
                        //去掉url的头，并转换为byte
                        var bytes = window.atob(base64.split(',')[1]);
                        //处理异常,将ascii码小于0的转换为大于0
                        var ab = new ArrayBuffer(bytes.length);
                        var ia = new Uint8Array(ab);
                        for (var i = 0; i < bytes.length; i++) {
                            ia[i] = bytes.charCodeAt(i);
                        }
                        //通过Blob生成新图片文件对象
                        file = new File([new Blob([ab], {type: 'image/jpeg'})], file.name, {
                            type: file.type,
                            lastModified: Date.now()
                        });
                        if (Math.ceil(file.size / 1024) >= 50) {
                            that.compressImage && that.compressImage(file, 0.5, func);
                            return
                        }
                        //这里需要重新设置文件名
                        func && func(file);
                    };
                };
            }
        }
    }
</script>

<style>
    @import "addLiveshop.less";
    @import "../../assets/css/style.css";

    input:disabled {
        background-color: transparent;
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

    .createContent {
        margin-top: 49px;
        padding: 0 0.2rem 0rem 0.2rem;
        background: #fff;
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
        margin-top: 0.61rem;
        margin-bottom: 0.6rem;
    }

    .share-img {
        border-bottom: 0.01rem solid rgba(238, 238, 238, .8);
        position: relative;
    }

    .share-img img {
        width: 2rem;
        height: 2rem;
        margin: 0.2rem auto;
        display: block;
    }

    .share-img .uploadFile {
        width: 2rem;
        height: 2rem;
        background: rgba(255, 255, 255, 1);
        border: 1px solid rgba(196, 196, 196, .6);
        border-radius: 0.12rem;
        margin: 0.2rem auto;
        display: block;
        font-size: 0.26rem;
        font-family: Hiragino Sans GB;
        font-weight: normal;
        color: rgba(153, 153, 153, 1);
        text-align: center;
        line-height: 2rem;
    }

    .share-img .share-title {
        font-size: 0.26rem;
        font-family: Hiragino Sans GB;
        font-weight: normal;
        color: rgba(33, 33, 33, 1);
        padding-top: 0.33rem;
    }

    .share-img .share-denger {
        font-size: 0.22rem;
        font-family: Hiragino Sans GB;
        font-weight: normal;
        color: rgba(153, 153, 153, 1);
        margin-bottom: 0.16rem;
        text-align: center;
    }

    .shopName {
        display: flex;
        justify-content: space-between;
        height: 0.88rem;
        line-height: 0.88rem;
        border-bottom: 0.01rem solid rgba(238, 238, 238, .8);
    }

    .shopName p {
        font-size: 0.26rem;
        font-family: Hiragino Sans GB;
        font-weight: normal;
        color: rgba(33, 33, 33, 1);
    }

    .shopName input {
        font-size: 0.26rem;
        font-family: Hiragino Sans GB;
        font-weight: normal;
        color: rgba(102, 102, 102, 1);
        border: none;
        outline: none;
        width: 70%;
        text-align: right;
    }

    .shopName input::placeholder {
        font-size: 0.26rem;
        font-family: Hiragino Sans GB;
        font-weight: normal;
        color: rgba(153, 153, 153, 1);
    }

    .shopId {
        font-size: 0.26rem;
        font-family: Hiragino Sans GB;
        font-weight: normal;
        color: rgba(102, 102, 102, 1) !important;
        width: 3rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        text-align: right;
    }

    .shopName span {
        font-size: 0.26rem;
        font-family: Hiragino Sans GB;
        font-weight: normal;
        color: rgba(102, 102, 102, 1);
    }

    .shopName img {
        width: 0.26rem;
        height: 0.26rem;
        margin-left: 0.1rem;
    }

    .shopName div {
        display: flex;
        align-items: center;
        justify-content: end;
    }

    .upload-input {
        width: 2rem;
        height: 2rem;
        background: #ccc;
        position: absolute;
        top: 0.8rem;
        left: 50%;
        transform: translate(-50%, 0);
        opacity: 0;
        outline: none;
    }

    .price {
        background: #fff;
        display: flex;
        margin-top: 0.2rem;
        padding: 0 0.22rem;
        line-height: 0.9rem;
        justify-content: space-between;
    }

    .priceTitle {
        width: 1.3rem;
        font-size: 0.26rem;
        font-family: Hiragino Sans GB;
        font-weight: normal;
        color: rgba(33, 33, 33, 1);
    }

    .qujianTitle {
        font-size: 0.26rem;
        font-family: Hiragino Sans GB;
        font-weight: normal;
        color: rgba(102, 102, 102, 1);
    }

    .typeItems {
        height: 0.92rem;
        display: flex;
        align-items: center;
    }

    .qujain .typeItems {
        height: 0.72rem;
        line-height: 0.72rem;
    }

    .typeItems img {
        height: 0.34rem;
        line-height: 0.34rem;
    }

    .typeItems span {
        font-size: 0.26rem;
        font-family: Hiragino Sans GB;
        font-weight: normal;
        padding-left: 0.2rem;
        color: rgba(102, 102, 102, 1);
        padding-right: 0.13rem;
    }

    .qujian-con {
        width: 4.2rem;
    }

    .line {
        width: 0.2rem;
        height: 0.02rem;
        margin: 0 0.16rem;
        background: #C4C4C4FF;
        position: relative !important;
    }

    .priceType {
        display: flex;
        align-items: center;
        line-height: 0.92rem;
        justify-content: space-between;
    }

    .qujain {
        display: block;
    }

    .priceRight {
    }

    .price-input {
        position: relative;
    }

    .price-input input {
        width: 4.11rem;
        height: 0.5rem;
        border: none;
        outline: none;
        background: rgba(238, 238, 238, 1);
        text-align: right;
        box-sizing: border-box;
        padding-right: 0.5rem;
        font-size: 0.26rem;
        font-family: Hiragino Sans GB;
        font-weight: normal;
        color: rgba(102, 102, 102, 1);
    }

    .price-input span {
        position: absolute;
        right: 0.13rem;
        top: 0rem;
        font-size: 0.26rem;
        font-family: Hiragino Sans GB;
        font-weight: normal;
        color: rgba(153, 153, 153, 1);
    }

    .qujainPrice {
        position: relative;
    }

    .qujainPrice span {

    }

    .qujain .price-input {
        display: flex;
        justify-content: space-between;
        height: 0.5rem;
        line-height: 0.5rem;
        margin-bottom: 0.2rem;
    }

    .qujain .price-input input {
        width: 1.85rem;
    }

    .discount input {
        background: rgba(238, 238, 238, 1);
        height: 0.5rem;
        margin-left: 0.2rem;
    }

    .discount .price-input {
        justify-content: space-between;
    }

    .discountItem {
        display: flex;
    }

    .qujian-con {
        display: flex;
        align-items: center;
    }
</style>
