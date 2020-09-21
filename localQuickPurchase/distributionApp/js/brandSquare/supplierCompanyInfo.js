function appendInfo(info){
    sheng=info.provinceName;
    shengId=info.provinceId;
    shi=info.cityName;
    shiId=info.cityId;
    qu=info.areaName;
    quId=info.areaId;
    street=info.streetName;
    streetId=info.streetId;
    backGroundObjectId=info.id;

    //pc不填写街道兼容方法
    if(quId != null && (street== null || street == "")){
        $.ajax({
            url: "/localQuickPurchase/brandSquare/region",
            type: "GET",
            data: {
                pid:quId,
                type:4
            },
            async: true,
            dataType: "json",
            success: function (data) {
                streetdata = data;
            }
        });
    }
    $("span[id='province-btn']").text(sheng);
    $("span[id='city-btn']").text(shi);
    $("span[id='county-btn']").text(qu);
    if(street == null || street == ""){
        $("span[id='street-btn']").text("请选择街道");
    }else{
        $("span[id='street-btn']").text(street);
    }
    $("input[name='sname']").attr("value",info.storeName);
    if(info.stroTypeName == "" || info.stroTypeName == null){
        $("span[id='storeType-btn']").text('请选择店铺类型');
    }else{
        $("span[id='storeType-btn']").text(info.stroTypeName);
        storeType=info.stroType;
    }
    $("input[name='brand']").attr("value",info.storeBrand);
    $("input[id='creditcode']").attr("value",info.socialCode);
    $("input[id='licenseregistrationnumber']").attr("value",info.businessLicense);
    $("input[class='organizationCode']").attr("value",info.organizingCode);
    $("input[class='identificationcode']").attr("value",info.ratepayerCode);
    $("span[id='trademarkregistrationtype'].active").attr("value");

    //组织机构
    $("img[class='zuzhijigou']").attr("src",info.imgfileListN1imageHttp);
    $("input[class='zuzhijigou']").attr("value",info.imgfileListN1path);
    $("input[class='zuzhijigouName']").attr("value",info.imgfileListN1name);
    //品牌授权
    $("img[class='pinpai_shouquan']").attr("src",info.imgfileListN3imageHttp);
    $("input[class='pinpai_shouquan']").attr("value",info.imgfileListN3path);
    $("input[class='pinpai_shouquanName']").attr("value",info.imgfileListN3name);
    //税务登记
    $("img[class='shuihudengji']").attr("src",info.imgfileListN2imageHttp);
    $("input[class='shuihudengji']").attr("value",info.imgfileListN2path);
    $("input[class='shuihudengjiName']").attr("value",info.imgfileListN2name);
    $("input[id='companyTitle']").attr("value",info.enterpriseName);
    $("input[id='addressDetailId']").attr("value",info.enterpriseAddress);
    if(info.certificateType == "0"){
        papersTypeTab(0);
        $("span[id='d3']").text(info.taxregistrationDate);
        $("span[id='d1']").text(info.businessDate);
        $("span[id='d2']").text(info.organizingDate);
        //营业执照
        $("img[class='yingyezhizhao_zero']").attr("src",info.imgfileList2imageHttp);
        $("input[class='yingyezhizhao_zero']").attr("value",info.imgfileList2path);
        $("input[class='yingyezhizhaoName_zero']").attr("value",info.imgfileList2name);

        $("img[class='kaihuxukezheng_zero']").attr("src",info.imgfileList78imageHttp);
        $("input[class='kaihuxukezheng_zero']").attr("value",info.imgfileList78path);
        $("input[class='kaihuxukezhengName_zero']").attr("value",info.imgfileList78name);
    }else{
        //营业执照
        $("img[class='yingyezhizhao']").attr("src",info.imgfileList2imageHttp);
        $("input[class='yingyezhizhao']").attr("value",info.imgfileList2path);
        $("input[class='yingyezhizhaoName']").attr("value",info.imgfileList2name);

        $("img[class='kaihuxukezheng']").attr("src",info.imgfileList78imageHttp);
        $("input[class='kaihuxukezheng']").attr("value",info.imgfileList78path);
        $("input[class='kaihuxukezhengName']").attr("value",info.imgfileList78name);
    }
    if(info.trademarkType=="1"){
        trademarkTab(1);
        $("span[id='d5']").text(info.authorizationDate);
        if(info.trademarkDate == null || info.trademarkDate == ""){
            $("span[id='d4']").text("请选择商标注册日期");
        }else{
            $("span[id='d4']").text(info.trademarkDate);
        }
        $("input[id='trademarkingId_one']").attr("value",info.trademarkCode);
        $("img[class='shangbiao_one']").attr("src",info.imgfileList4imageHttp);
        $("input[class='shangbiao_one']").attr("value",info.imgfileList4path);
        $("input[class='shangbiao_Name_one']").attr("value",info.imgfileList4name);
    }else{
        if(info.trademarkDate == null || info.trademarkDate == ""){
            $("span[id='d6']").text("请选择商标注册日期");
        }else{
            $("span[id='d6']").text(info.trademarkDate);
        }
        $("input[id='trademarkingId_zero']").attr("value",info.trademarkCode);
        $("img[class='shangbiao_zero']").attr("src",info.imgfileList4imageHttp);
        $("input[class='shangbiao_zero']").attr("value",info.imgfileList4path);
        $("input[class='shangbiao_Name_zero']").attr("value",info.imgfileList4name);
    }
}

//店铺类型
function storeTypepicker(id1){
    var show = document.querySelector(id1);
    storedata = shopdata.data;
    var provinceSelect = new IosSelect(1,
        [storedata],
        {
            container: '.container',
            title: '店铺类型',
            itemHeight: 35,
            relation:[1,1],
            callback: function (selectOneObj) {
                show.innerHTML = selectOneObj.value;
                show.dataset['id'] = selectOneObj.id;
                storeType = selectOneObj.id;
            }
        });
}

//选择省
function provincepicker(id1){
    var show = document.querySelector(id1);
    provi = provincedata.data;
    var provinceSelect = new IosSelect(1,
        [provi],
        {
            container: '.container',
            title: '省',
            itemHeight: 35,
            relation:[1,1],
            callback: function (selectOneObj) {
                show.innerHTML = selectOneObj.value;
                show.dataset['id'] = selectOneObj.id;
                shengId = selectOneObj.id;
                sheng = selectOneObj.value;
                $.ajax({
                    url: "/localQuickPurchase/brandSquare/region",
                    type: "GET",
                    data: {
                        pid:shengId,
                        type:2
                    },
                    async: true,
                    dataType: "json",
                    success: function (data) {
                        citydata = data;
                        console.log(citydata);
                    }
                });
            }
        });
}

//选择市
function citypicker(id2){
    if(shengId == undefined){
        hui.toast('请先选择所在省');
        return false;
    }
    var show = document.querySelector(id2);
    var citys = citydata.data;
    var citySelect = new IosSelect(1,
        [citys],
        {
            container: '.container',
            title: '市',
            itemHeight: 35,
            relation:[1,1],
            callback: function (selectOneObj) {
                show.innerHTML = selectOneObj.value;
                show.dataset['id'] = selectOneObj.id;
                shiId = selectOneObj.id;
                shi = selectOneObj.value;
                $.ajax({
                    url: "/localQuickPurchase/brandSquare/region",
                    type: "GET",
                    data: {
                        pid:shiId,
                        type:3
                    },
                    async: true,
                    dataType: "json",
                    success: function (data) {
                        countydata = data;
                    }
                });
            }
        });
}

//选择区
function countypicker(id3){
    if(shiId == undefined){
        hui.toast('请先选择所在市');
        return false;
    }
    var show = document.querySelector(id3);
    var countyId = document.querySelector('#county');
    var countys = countydata.data;
    var countySelect = new IosSelect(1,
        [countys],
        {
            container: '.container',
            title: '区/县',
            itemHeight: 35,
            relation:[1,1],
            callback: function (selectOneObj) {
                show.innerHTML = selectOneObj.value;
                show.dataset['id'] = selectOneObj.id;
                quId = selectOneObj.id;
                qu = selectOneObj.value;
                $.ajax({
                    url: "/localQuickPurchase/brandSquare/region",
                    type: "GET",
                    data: {
                        pid:quId,
                        type:4
                    },
                    async: true,
                    dataType: "json",
                    success: function (data) {
                        streetdata = data;
                    }
                });
            }
        });
}

//选择街道
function streetpicker(id4){
    if(quId == undefined){
        hui.toast('请先选择所在区');
        return false;
    }
    var show = document.querySelector(id4);
    var streets = streetdata.data;
    var streetSelect = new IosSelect(1,
        [streets],
        {
            container: '.container',
            title: '街道',
            itemHeight: 35,
            relation:[1,1],
            callback: function (selectOneObj) {
                show.innerHTML = selectOneObj.value;
                show.dataset['id'] = selectOneObj.id;
                street  = selectOneObj.value;
                streetId = selectOneObj.id;
            }
        });
}


//时间控件
function datepicker(id1,id2){
    console.log(111);
    var selectDateDom = $(id1);
    var showDateDom = $(id2);
    // 初始化时间
    var now = new Date();
    var nowYear = now.getFullYear();
    var nowMonth = now.getMonth() + 1;
    var nowDate = now.getDate();
    showDateDom.attr('data-year', nowYear);
    showDateDom.attr('data-month', nowMonth);
    showDateDom.attr('data-date', nowDate);
    // 数据初始化
    function formatYear (nowYear) {
        var arr = [];
        for (var i = nowYear - 5; i <= nowYear + 5; i++) {
            arr.push({
                id: i + '',
                value: i + '年'
            });
        }
        return arr;
    }
    function formatMonth () {
        var arr = [];
        for (var i = 1; i <= 12; i++) {
            arr.push({
                id: i + '',
                value: i + '月'
            });
        }
        return arr;
    }
    function formatDate (count) {
        var arr = [];
        for (var i = 1; i <= count; i++) {
            arr.push({
                id: i + '',
                value: i + '日'
            });
        }
        return arr;
    }
    var yearData = function(callback) {
        callback(formatYear(nowYear))
    }
    var monthData = function (year, callback) {
        callback(formatMonth());
    };
    var dateData = function (year, month, callback) {
        if (/^(1|3|5|7|8|10|12)$/.test(month)) {
            callback(formatDate(31));
        }
        else if (/^(4|6|9|11)$/.test(month)) {
            callback(formatDate(30));
        }
        else if (/^2$/.test(month)) {
            if (year % 4 === 0 && year % 100 !==0 || year % 400 === 0) {
                callback(formatDate(29));
            }
            else {
                callback(formatDate(28));
            }
        }
        else {
            throw new Error('month is illegal');
        }
    };
    var oneLevelId = showDateDom.attr('data-year');
    var twoLevelId = showDateDom.attr('data-month');
    var threeLevelId = showDateDom.attr('data-date');
    var iosSelect = new IosSelect(3,
        [yearData, monthData, dateData],
        {
            title: '日期选择',
            itemHeight: 35,
            oneLevelId: oneLevelId,
            twoLevelId: twoLevelId,
            threeLevelId: threeLevelId,
            showLoading: false,
            callback: function (selectOneObj, selectTwoObj, selectThreeObj) {
                showDateDom.attr('data-year', selectOneObj.id);
                showDateDom.attr('data-month', selectTwoObj.id);
                showDateDom.attr('data-date', selectThreeObj.id);
                showDateDom.html(selectOneObj.value  + selectTwoObj.value  + selectThreeObj.value);
            }
        });
}

function submitCompanyInfo(brandSquareSupplierInfo){
    $.ajax({
        type : "POST",
        url : "/localQuickPurchase/brandSquare/save",
        dataType : "json",
        contentType:"application/json;charset=utf-8",
        data : JSON.stringify(brandSquareSupplierInfo),
        async : false,
        success : function(data) {
            if (data.code == 200) {
                var objectId = data.data.objectId;
                window.location.href="/localQuickPurchase/distributionVA/brandSquare/supplierShopperInfo?objectId="+objectId;
            }else if(data.code == 201){
                hui.toast("请填写完所有栏目!");
            }else {
                hui.toast(data.data);
            }
        }
    });
}

function backPersonalCenter(){
    var _content = "/localQuickPurchase";
    // 部分原始app 返回原生界面
    try{
        //app 首页返回链接
        window.action.app_back();
    }catch (e) {
    }
    var  _thisURl=document.referrer;
    if(_thisURl.indexOf("onlyRefund") > 0 || _thisURl.indexOf("refundDetail") > 0){
        personalCenter();
    }else if(_thisURl.indexOf("distributionVA") > 0){
        hui.back();
    }else{
        personalCenter();
    }
}


