var u = navigator.userAgent;
var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端

$(function () {
    $(".imgList img").click(function () {
        var large_image = '<img src= ' + $(this).attr("src") + '></img>';
        $('#dialog_large_image').html($(large_image).animate({height: '50%', width: '50%'}, 500));
    });
});

$(function () {
    getCircleInfo1();

    var identifyNumber = getQueryString("identifyNumber");
    if (!identifyNumber) {
        $("#hui-footer").css("display", "block");
    }
});

var pageIndex = 1;
var pageValue = 1;
var goodsIdValue = "";
var distributorSeq = seq;
var switch1 = true;
var switch2 = true;
var rediskey = "";
var circleId = "";
var thisValue = "";
var statisticsTypeValue = "";
var commentsValue = "";
var realShareValue = "";
var pressValueText = "";
var goodsName = "";
var saveImgUrl = "";

$("#nav-circle").addClass("active");
$("#nav-circle").find("img").attr("src", "/localQuickPurchase/distributionApp/images/circleInfoRed.png");

//显示佣金
function showCommission(distributionProfit, profitPrice) {
    var preferentialPrice = getCommission(distributionProfit, profitPrice);
    if (preferentialPrice > 0) {
        if (isRoleAgent() || isRoleDealer()) {
            return preferentialPrice;
        }
    }
}

/**
 * 根据当前用户类型获取佣金
 * @param distributionProfit
 * @param profitPrice
 */
function getCommission(distributionProfit, profitPrice) {
    var preferentialPrice;
    if (isRoleAgent()) {
        preferentialPrice = distributionProfit;//分销商佣金
    } else if (isRoleDealer()) {
        preferentialPrice = profitPrice;//经销商佣金
    }
    return preferentialPrice;
}

function getCircleInfo1() {
    //每日爆款
    $(".boomList").dropload({
        scrollArea: window,
        loadDownFn: function (me) {
            $.ajax({
                type: 'GET',
                dataType: 'json',
                async: true,
                contentType: "application/json;charset=utf-8",
                url: '/localQuickPurchase/propagandaCircleAction/getCircleInfo?pageIndex=' + pageIndex + '&pageSize=2&choseMark=1&userSeq=' + seq,
                success: function (data) {
                    pageIndex++;
                    if (data.code == "200" && switch1 == true) {
                        if (data.data && data.data.length > 0) {
                            var dataResult = data.data;
                            var circleInfoHTML = "";
                            for (var i = 0; i < dataResult.length; i++) {
                                if (dataResult[i].cirCleDataListInfo) {
                                    var isShow = dataResult[i].cirCleDataListInfo.isShow;
                                    var headImg = dataResult[i].cirCleDataListInfo.headImg;
                                    var name = dataResult[i].cirCleDataListInfo.name;
                                    var type = dataResult[i].cirCleDataListInfo.type;
                                    var shareNum = dataResult[i].cirCleDataListInfo.shareNum;
                                    var comment = dataResult[i].cirCleDataListInfo.comment;
                                    var content = dataResult[i].cirCleDataListInfo.content;
                                    var picture = dataResult[i].cirCleDataListInfo.picture;
                                    var realShare = dataResult[i].cirCleDataListInfo.realShare;

                                    var realShareNumber = 0;

                                    if (shareNum !== null && shareNum !== "" && shareNum !== undefined) {
                                        if (realShare !== null && realShare !== "" && realShare !== undefined) {
                                            realShareNumber = shareNum + realShare;
                                        }
                                    }


                                    var createTime = "";
                                    var redisKey = "";
                                    var circleId = "";

                                    var goodsType = 1;
                                    if (dataResult[i].cirCleDataListInfo.goodsType) {
                                        goodsType = dataResult[i].cirCleDataListInfo.goodsType;
                                    }

                                    if (dataResult[i].cirCleDataListInfo.id) {
                                        circleId = dataResult[i].cirCleDataListInfo.id;
                                    }

                                    if (dataResult[i].cirCleDataListInfo.createTime) {
                                        createTime = dataResult[i].cirCleDataListInfo.createTime.substring(0, 11);
                                    }

                                    if (createTime && circleId) {
                                        redisKey = dataResult[i].cirCleDataListInfo.id + "_" + dataResult[i].cirCleDataListInfo.createTime;
                                    }

                                    var goodsId = "";
                                    if (dataResult[i].goodsId) {
                                        goodsId = dataResult[i].goodsId;
                                    }

                                    var goodsName = "";
                                    if (dataResult[i].goodsName) {
                                        goodsName = dataResult[i].goodsName;
                                    }

                                    var goodsImg = "";
                                    if (dataResult[i].goodsImg) {
                                        goodsImg = dataResult[i].goodsImg;
                                    }

                                    var companyState = "";
                                    if (dataResult[i].companyState) {
                                        companyState = dataResult[i].companyState;
                                    }

                                    var activityState = "";
                                    if (dataResult[i].activityState) {
                                        activityState = dataResult[i].activityState;
                                    }


                                    //佣金计算

                                    var distributionProfit = dataResult[i].distributionProfit;
                                    var profitPrice = dataResult[i].profitPrice;
                                    var commission = showCommission(distributionProfit, profitPrice);

                                    circleInfoHTML += "<li class='boomItem'>";

                                    circleInfoHTML += "<div class='avatar'>" +
                                        "<img src='" + headImg + "'>" +
                                        "</div>" +
                                        "<div class='faquanMain'>" +
                                        "<p class='title'>" +
                                        "<span class='name fs32'>" + name + "</span>" +
                                        "<span class='share fs24' goodsId='" + goodsId + "' goodsName='" + goodsName + "' goodsImg='" + goodsImg + "' redisKey='" + redisKey + "' circleId='" + circleId + "' seckillMark = '" + goodsType + "' onclick='shareGoodsClick(this)' realShare='" + realShareNumber + "'><img src='/localQuickPurchase/distributionApp/images/propagandaIcon.png'/></span>" +
                                        "</p>";

                                    if (commission) {
                                        circleInfoHTML += "<p class='commission fs28'>预估佣金￥" + cutPriceDown(commission) + "</p>"+
                                            "<div class='forward' style='margin-top: -.89999rem;' circleId='" + circleId + "'>"+
                                            "<p class='hasBeanTran grayText'>次</p><p class='hasBeanTran redText'>"+realShareNumber+"</p><p class='hasBeanTran grayText'>已转发</p>"+
                                            "</div>";
                                    }else{
                                        circleInfoHTML += "<div class='forward' style='margin-top:.2777rem' circleId='" + circleId + "'>"+
                                            "<p class='hasBeanTran grayText'>次</p><p class='hasBeanTran redText'>"+realShareNumber+"</p><p class='hasBeanTran grayText'>已转发</p>"+
                                            "</div>";
                                    }



                                    if (content && content != 0 && goodsId) {
                                        if (goodsType == 2) {
                                            if (activityState == 1) {
                                                circleInfoHTML +=
                                                    "<div class='text fs28' goodsId='" + goodsId + "' redisKey='" + redisKey + "' circleId='" + circleId + "' seckillMark='" + goodsType + "' >" + content + "</div>";
                                            } else {
                                                circleInfoHTML +=
                                                    "<div class='text fs28' goodsId='" + goodsId + "' redisKey='" + redisKey + "' circleId='" + circleId + "' seckillMark='" + goodsType + "' onclick='checkGoodsDetail(this)' >" + content + "</div>";
                                            }

                                        } else {
                                            circleInfoHTML +=
                                                "<div class='text fs28' goodsId='" + goodsId + "' redisKey='" + redisKey + "' circleId='" + circleId + "' seckillMark='" + goodsType + "' onclick='checkGoodsDetail(this)' >" + content + "</div>";
                                        }
                                    }
                                    if (goodsId && isShow == 1) {
                                        if (goodsType == 2) {
                                            if (activityState == 1) {
                                                circleInfoHTML += "<p class='goDetails' goodsId='" + goodsId + "' redisKey='" + redisKey + "' circleId='" + circleId + "' seckillMark='" + goodsType + "'><a href='#' class='fs28'>查看详情</a></p>";
                                            } else {
                                                circleInfoHTML += "<p class='goDetails' goodsId='" + goodsId + "' redisKey='" + redisKey + "' circleId='" + circleId + "' seckillMark='" + goodsType + "' onclick='checkGoodsDetail(this)'><a href='#' class='fs28'>查看详情</a></p>";
                                            }

                                        } else {
                                            circleInfoHTML += "<p class='goDetails' goodsId='" + goodsId + "' redisKey='" + redisKey + "' circleId='" + circleId + "' seckillMark='" + goodsType + "' onclick='checkGoodsDetail(this)'><a href='#' class='fs28'>查看详情</a></p>";
                                        }

                                    }
                                    circleInfoHTML += "<div class='imgList'>";
                                    if (goodsImg && goodsId) {
                                        if (goodsType == 2) {
                                            if (activityState == 1) {
                                                circleInfoHTML += "<div class='hiden-opacity'>" +
                                                    "<img class='clickImg' goodsId='" + goodsId + "' src='" + goodsImg + "' redisKey='" + redisKey + "' circleId='" + circleId + "' clickImgMark='1'>" +
                                                    "<div class='hidenBottom'>" +
                                                    "<p>已抢光</p>" +
                                                    "</div>" +
                                                    "</div>";
                                            } else {
                                                circleInfoHTML += "<img class='clickImg' goodsId='" + goodsId + "' src='" + goodsImg + "' redisKey='" + redisKey + "' circleId='" + circleId + "' clickImgMark='1'>";

                                            }

                                        } else {
                                            if (companyState == 1) {
                                                circleInfoHTML += "<div class='hiden-opacity'>" +
                                                    "<img class='clickImg' goodsId='" + goodsId + "' src='" + goodsImg + "' redisKey='" + redisKey + "' circleId='" + circleId + "' clickImgMark='1'>" +
                                                    "<div class='hidenBottom'>" +
                                                    "<p>已抢光</p>" +
                                                    "</div>" +
                                                    "</div>";
                                            } else {
                                                circleInfoHTML += "<img class='clickImg' goodsId='" + goodsId + "' src='" + goodsImg + "' redisKey='" + redisKey + "' circleId='" + circleId + "' clickImgMark='1'>";

                                            }
                                        }
                                    }
                                    circleInfoHTML += "</div>" +
                                        "<p class='time fs20'>" + createTime + "</p>";
                                    if (comment && comment != 0 && comment != "0") {
                                        circleInfoHTML += "<div class='commentList'>" +
                                            "<ul>" +
                                            "<li class='commentItem'>";
                                        if (comment && comment != 0 && comment != "0") {
                                            if (goodsType == 2) {
                                                if (activityState == 1) {
                                                    circleInfoHTML += "<p class='text fs28' >" + comment + "</p>";
                                                } else {
                                                    circleInfoHTML += "<p class='text fs28' goodsId='" + goodsId + "' redisKey='" + redisKey + "' circleId='" + circleId + "' seckillMark='" + goodsType + "' onclick='checkGoodsDetail(this)'>" + comment + "</p>";
                                                }

                                            } else {
                                                circleInfoHTML += "<p class='text fs28' goodsId='" + goodsId + "' redisKey='" + redisKey + "' circleId='" + circleId + "' seckillMark='" + goodsType + "' onclick='checkGoodsDetail(this)'>" + comment + "</p>";
                                            }

                                        }
                                        circleInfoHTML += "<p class='copyBox'>" +
                                            "<span class='copy fs24 copyComments' id='copyComments' onclick='sendApp(this)'><img src='/localQuickPurchase/distributionApp/images/propagandaCircleCopy.png'/><span>复制评论</span></span>" +
                                            "</p>" +
                                            "</li>" +
                                            "</ul>" +
                                            "<div class='sanjiaoxing'>" +
                                            "<div class='triangle_border_up'>" +
                                            "</div>" +
                                            "</div>" +
                                            "</div>";
                                    }

                                    circleInfoHTML += "</div></li>";

                                    circleInfoHTML += "<HR align=center width=300  SIZE=1 class='hrClass'>";
                                }
                            }
                            $(".dropload-down").before(circleInfoHTML);
                            me.resetload();
                        } else {
                            var hrClassList = $(".hrClass");
                            var lastOneHr = hrClassList.length - 1;
                            var lastHTML = "--------我是有底线的--------";
                            $(hrClassList[lastOneHr]).append(lastHTML);
                            $(hrClassList[lastOneHr]).css("margin-top", "1rem");
                            $(".dropload-down").hide();
                        }
                    }
                }, error: function (xhr, type) {
                    //alert('Ajax error!');
                    // 即使加载出错，也得重置
                    me.resetload();
                }
            });
        }
    });
}


function getCircleInfo2() {
    //宣传推广
    $(".extendList").dropload({
        scrollArea: window,
        loadDownFn: function (me) {
            $.ajax({
                type: 'GET',
                dataType: 'json',
                async: true,
                contentType: "application/json;charset=utf-8",
                url: '/localQuickPurchase/propagandaCircleAction/getCircleInfo?pageIndex=' + pageValue + '&pageSize=2&choseMark=2&userSeq=' + seq,
                success: function (data) {
                    pageValue++;
                    if (data.code == "200" && switch2 == true) {
                        if (data.data && data.data.length > 0) {
                            var dataResult = data.data;
                            var circleInfoHTML2 = "";
                            for (var i = 0; i < dataResult.length; i++) {
                                if (dataResult[i].cirCleDataListInfo) {
                                    var isShow = dataResult[i].cirCleDataListInfo.isShow;
                                    var id = dataResult[i].cirCleDataListInfo.id;
                                    var headImg = dataResult[i].cirCleDataListInfo.headImg;
                                    var name = dataResult[i].cirCleDataListInfo.name;
                                    var type = dataResult[i].cirCleDataListInfo.type;
                                    var shareNum = dataResult[i].cirCleDataListInfo.shareNum;
                                    var comment = dataResult[i].cirCleDataListInfo.comment;
                                    var content = dataResult[i].cirCleDataListInfo.content;
                                    var picture = dataResult[i].cirCleDataListInfo.picture;
                                    var realShare = dataResult[i].cirCleDataListInfo.realShare;
                                    var realShareNumber = 0;
                                    if (shareNum !== null && shareNum !== "" && shareNum !== undefined) {
                                        if (realShare !== null && realShare !== "" && realShare !== undefined) {
                                            realShareNumber = shareNum + realShare;
                                        }
                                    }

                                    var createTime = "";
                                    var redisKey = "";
                                    var circleId = "";
                                    if (dataResult[i].cirCleDataListInfo.id) {
                                        circleId = dataResult[i].cirCleDataListInfo.id;
                                    }
                                    if (dataResult[i].cirCleDataListInfo.createTime) {
                                        createTime = dataResult[i].cirCleDataListInfo.createTime.substring(0, 11);
                                    }
                                    if (createTime && circleId) {
                                        redisKey = dataResult[i].cirCleDataListInfo.id + "_" + dataResult[i].cirCleDataListInfo.createTime;
                                    }

                                    if (isShow == 1) {

                                        circleInfoHTML2 += "<li class='extendItem'>";

                                        circleInfoHTML2 += "<div class='avatar'>" +
                                            "<img src='" + headImg + "'>" +
                                            "</div>" +
                                            "<div class='faquanMain'>" +
                                            "<p class='title'>" +
                                            "<span class='name fs32'>" + name + "</span>" +
                                            "<span class='fs24 shareExtension' redisKey='" + redisKey + "' circleId='" + circleId + "' onclick='shareExtensionClick(this)' realShare='" + realShareNumber + "' mergeImg='"+picture+"'><img src='/localQuickPurchase/distributionApp/images/propagandaIcon.png'/></span>" +
                                            "</p>";

                                        circleInfoHTML2 += "<div class='forward' style='margin-top:.2777rem' circleId='" + circleId + "'>"+
                                            "<p class='hasBeanTran grayText'>次</p><p class='hasBeanTran redText'>"+realShareNumber+"</p><p class='hasBeanTran grayText'>已转发</p>"+
                                            "</div>";

                                        if (content) {
                                            circleInfoHTML2 +=
                                                "<div class='text fs28' hotSaleGoodsMark='1'>" + content + "</div>";
                                        }
                                        circleInfoHTML2 += "<div class='imgList'>";
                                        if (picture) {
                                            circleInfoHTML2 += "<img src='" + picture + "' clickImgMark='2'>";
                                        }

                                        circleInfoHTML2 += "</div>" +
                                            "<p class='time fs20'>" + createTime + "</p>";
                                        if (comment && comment != 0 && comment != "0") {
                                            circleInfoHTML2 += "<div class='commentList'>" +
                                                "<ul>" +
                                                "<li class='commentItem'>";
                                            if (comment && comment != 0 && comment != "0") {
                                                circleInfoHTML2 += "<p class='text fs28' hotSaleGoodsMark='1'>" + comment + "</p>";
                                            }
                                            circleInfoHTML2 += "<p class='copyBox'>" +
                                                "<span class='copy fs24 copyComments' id='copyComments' onclick='sendApp(this)'><img src='/localQuickPurchase/distributionApp/images/propagandaCircleCopy.png'/><span>复制评论</span></span>" +
                                                "</p>" +
                                                "</li>" +
                                                "</ul>" +
                                                "<div class='sanjiaoxing'>" +
                                                "<div class='triangle_border_up'>" +
                                                "</div>" +
                                                "</div>" +
                                                "</div>";
                                        }
                                        circleInfoHTML2 += "</div></li>";
                                        circleInfoHTML2 += "<HR align=center width=300  SIZE=1 class='hrClassSend'>";
                                    }
                                }
                            }
                            $(".dropload-down").before(circleInfoHTML2);
                            me.resetload();
                        } else {
                            //获取底部最后一个间距加上底线
                            var hrList = $(".hrClassSend");
                            var lastOneHr = hrList.length - 1;
                            var lastHTML = "--------我是有底线的--------";
                            $(hrList[lastOneHr]).append(lastHTML);
                            $(hrList[lastOneHr]).css("margin-top", "1rem");
                            $(".dropload-down").hide();
                        }
                    }
                }, error: function (xhr, type) {
                    //alert('Ajax error!');
                    // 即使加载出错，也得重置
                    $(".dropload-down").hide();
                }
            });
        }
    });
}

//切换每日爆款与推广
$('.taggle').each(function (i, item) {
    $(this).click(function () {
        $(this).addClass('active').siblings().removeClass('active');
        if (i == 0) {

            if (isiOS == true) {
                window.location.reload()
            }else {
                $(".dropload-down").hide();
                switch2 = false;
                switch1 = true;
                pageIndex = 1;
                $('.extendList').html("");
                getCircleInfo1();
                $('.boomList').show();
                $('.extendList').hide();
                $(".explosive_product").hide();
                //隐藏二级tab
                resetSecondTab();
                $(".tab2").css("display", "block");
            }
        } else {

            $(".dropload-down").hide();
            pageIndex = 1;
            $('.extendList').html("");
            getCircleInfo1();
            $('.extendList').hide();
            $(".explosive_product").hide();
            $('.boomList').show();

            $(".dropload-down").hide();
            switch1 = false;
            switch2 = true;
            pageValue = 1;
            $('.boomList').html("");
            getCircleInfo2();
            $('.boomList').hide();
            $(".explosive_product").hide();
            $('.extendList').show();
            //隐藏二级tab
            $(".tab2").css("display","none");
        }
    })
});

var qrcode = "";
function initmeqrcode(){
    $.ajax({
        url: '/localQuickPurchase/virtualShopAction/makeMeQRCode',
        type: 'POST',
        data: {
            'seq':seq
        },
        dataType: 'JSON',
        success: function (result) {
            if(result != null && result.code == 200){
                virtualShop=result.data;
                qrcodeValue = virtualShop.qrcode;
                if(qrcodeValue != null ){
                    qrcode = qrcodeValue;
                }
            }else{
            }
        },
        error: function (result) {
        }
    });
}
initmeqrcode();


//复制评论
function sendApp(thisAppValue) {
    var comments = $(thisAppValue).parent().prev().text();
    if (comments) {
        commentsValue = comments;

        setTimeout(function () {
            try {
                if (isiOS == true) {
                    //ios复制方法
                    window.action.app_sendCopyValue(commentsValue);
                    //ios跳转微信方法
                    window.action.app_goWeChat();
                } else {
                    //Dialog.init("进入跳转微信方法", 500);
                    //安卓调用微信
                    window.action.redirectWeChat();
                }
            } catch (e) {
                console.log(e);
            }
        }, 1500);
    }
}


//点击复制
var clipboard = new Clipboard('.copyComments', {
    // 点击copy按钮，直接通过text直接返回复印的内容
    text: function () {
        return commentsValue;
    }
});


clipboard.on('success', function (e) {
    Dialog.init("复制成功", 500);
    e.clearSelection();
});

function checkGoodsDetail(goodsValue) {
    var thisValue = $(goodsValue);
    var goodsId = thisValue.attr("goodsid");
    if (goodsId) {
        var redisKeyValue = thisValue.attr("redisKey");
        var circleIdValue = thisValue.attr("circleId");
        var seckillMark = thisValue.attr("seckillMark");

        if (redisKeyValue && circleIdValue) {
            addRealShare(redisKeyValue, circleIdValue, 2);
        }
        if (seq == null || seq == 0) {
            seq = 0;
        }
        // 进入原生商品详情界面
        try {
            window.action.app_goodsDetails(goodsId, 0);
        } catch (e) {
        }
        if (seckillMark == 2) {
            window.location.href = "/localQuickPurchase/distributionVA/seckill/sgDetail?goodsId=" + goodsId + "&distributorSeq=0&shareSeq=0";
        } else {
            window.location.href = "/localQuickPurchase/distributionVA/goodsDetail/" + goodsId + "/0/" + seq;
        }
    }
}


//点击分享商品
function shareGoodsClick(ObjectValue) {
    if (!isLogin()) {
        var returnUrl = window.location.href;
        setCookie("loginRetrunUrl",returnUrl);
        loginPage();
    } else {
        thisValue = $(ObjectValue);
        rediskey = $(ObjectValue).attr("redisKey");
        circleId = $(ObjectValue).attr("circleId");
        goodsName = $(ObjectValue).attr("goodsName");
        realShareValue = $(ObjectValue).attr("realShare");
        goodsidValue = $(ObjectValue).attr("goodsid");
        var seckillMark = $(ObjectValue).attr("seckillMark");
        statisticsTypeValue = 1;
        $(".bringIn").html("分享商品");
        $(".explain").html("只要你的好友通过你的链接买此商品，你就能得到此商品的利润哦~");
        $(".shareUL").css("display", "none");

        // $("#nav-shop").css("display", "none");

        //获取图片与内容
        var parentDiv = $(ObjectValue).parent().parent();
        //文字信息
        var textList = parentDiv.find(".text").find("p");
        var goods_name = "";
        for (var i = 0; i < textList.length; i++) {
            goods_name += $(textList[i]).text();
        }

        //已复制到粘贴板
        $('#textCopy').attr("value", goods_name);
        copyText();

        if (isiOS == true) {
            try {
                window.action.app_sendCopyValue(goods_name);
            } catch (e) {
                console.log(e);
            }
        } else {
            Dialog.init("已复制到粘贴板", 500);
        }

        setTimeout(function () {
            var id = $(ObjectValue).attr("goodsid");
            goodsIdValue = id;
            // 生成二维码
            $(".ewmcode img").attr("src", "/localQuickPurchase/shareQRCode/goodsCode/" + id + "/" + 0 + "/" + seq);
            $.ajax({
                type: 'POST',
                dataType: 'json',
                url: '/localQuickPurchase/shareQRCode/shareGoodsURL',
                data: {
                    goodsId: id,
                    distributorSeq: 0,
                    seq: seq
                },
                async: false,
                success: function (data) {
                    urlCode = data.data.URL;
                },
            });
            var $this = $(ObjectValue);
            //var shareGoodsPic = $(this).attr("goods_img") != '' ? $(this).attr("goods_img") : "";

            var shareGoodsPic = $(ObjectValue).attr("goodsImg");
            if (shareGoodsPic == undefined) {
                shareGoodsPic = "";
            }

            /*
            获取海报图
             */
            //http://nfxts.520shq.com:7050/localQuickPurchase/dGoodsAction/makePostersIO?seq=5757774&goodsId=5b91e307ea1e58575b2067ea&url=http://nfxts.520shq.com:7050/localQuickPurchase/distributionVA/goodsDetail/5b91e307ea1e58575b2067ea/0/0?checkShare=1&shareSeq=5757774
            //获取当前域名
            var referrerValue = window.location.host;
            if (referrerValue.indexOf("http") == -1) {
                referrerValue = "http://" + referrerValue;
            } else {
                referrerValue = referrerValue;
            }

            var picImg = "";
            if(seckillMark == 2) {
                var encodingValue = referrerValue + "/localQuickPurchase/distributionVA/seckill/sgDetail?goodsId=" + goodsidValue +"7&checkShare=1&shareSeq="+seq+"&distributorSeq=0";
                var encodingValueUrl = encodeURI(encodingValue);
                picImg = referrerValue + "/localQuickPurchase/sgMongoAction/makePostersIO?seq=" + seq + "&goodsId=" + goodsidValue + "&url=" + encodingValueUrl;
            }else{
                var encodingValue = referrerValue + "/localQuickPurchase/distributionVA/goodsDetail/" + goodsidValue + "/0/" + seq + "?checkShare=1&shareSeq=" + seq;
                var encodingValueUrl = encodeURI(encodingValue);
                picImg = referrerValue + "/localQuickPurchase/dGoodsAction/makePostersIO?seq=" + seq + "&goodsId=" + goodsidValue + "&url=" + encodingValueUrl;
            }
            picImg=$(ObjectValue).attr("goodsimg");
            //判断是否是app
            var u = navigator.userAgent;
            var isappwebview = u.indexOf('app_webview') > -1;

            /**
             * 分享点击跳转链接
             *
             **/
            if (seckillMark == 2) {
                urlCode = referrerValue + "/localQuickPurchase/distributionVA/seckill/sgDetail?goodsId=" + goodsidValue + "&distributorSeq=0&shareSeq=" + seq;
            }else{
                urlCode = referrerValue + "/localQuickPurchase/distributionVA/goodsDetail/"+goodsidValue+"/0/"+seq+"?checkShare=1&shareSeq=" + seq;
            }
            if (isappwebview) {
                // 分享
                share520Love(urlCode, goodsName, goods_name, picImg, '.share-content');
            } else {
                share520LoveWeb(urlCode, goodsName, goods_name, picImg, '.share-content');
                $("#hui-mask").css("display", "block");
                hui.dialogBase();
                $(".share-block").slideDown(100);
            }
        }, 1000);

    }
}


//点击分享宣传推广shareExtension
function shareExtensionClick(ObjectValue) {
    if (!isLogin()) {
        var returnUrl = window.location.href;
        setCookie("loginRetrunUrl",returnUrl);
        loginPage();
    } else {
        thisValue = $(ObjectValue);
        rediskey = $(ObjectValue).attr("redisKey");
        var mergeImg = $(ObjectValue).attr("mergeimg");
        if (mergeImg) {
            circleId = $(ObjectValue).attr("circleId");
            statisticsTypeValue = 1;
            realShareValue = $(ObjectValue).attr("realShare");
            $(".bringIn").html("宣传推广");
            $(".explain").html("");
            $(".shareUL").css("display", "none");

            //获取图片与内容
            var parentDiv = $(ObjectValue).parent().parent();
            //文字信息
            var textList = parentDiv.find(".text").find("p");
            var goods_name = "";
            for (var i = 0; i < textList.length; i++) {
                goods_name += $(textList[i]).text();
            }

            //已复制到粘贴板
            $('#textCopy').attr("value", goods_name);
            copyText();
            if (isiOS == true) {
                try {
                    window.action.app_sendCopyValue(goods_name);
                } catch (e) {
                    console.log(e);
                }
            } else {
                Dialog.init("已复制到粘贴板", 500);
            }


            setTimeout(function () {
                var domain = window.location.origin;
                if (mergeImg==''||mergeImg=='undefined'){
                    mergeImg='http://nfxts.520shq.com/localQuickPurchase/distributionApp/images/_logo.png'
                }
                var shareGoodsPic = domain+"/localQuickPurchase/propagandaCircleAction/propagandaDrawImg?userSeq=" + seq + "&backGroundImg=" + mergeImg;
                //当前路径
                var urlCodeForNow = window.location.href;
                //判断是否是app
                var u = navigator.userAgent;
                var isappwebview = u.indexOf('app_webview') > -1
                if (isappwebview) {
                    //alert("urlCode: " + urlCode);
                    // 分享
                    share520Love(urlCodeForNow, "爱之家推广", goods_name, shareGoodsPic, '.share-content');
                } else {
                    share520LoveWeb(urlCodeForNow, "爱之家推广", goods_name, shareGoodsPic, '.share-content');
                    $("#hui-mask").css("display", "block");
                    hui.dialogBase();
                    $(".share-block").slideDown(100);
                }
            }, 1000);
        }
    }
};

$("body").on("touchstart", ".soshm-item", function () {

    if (rediskey && circleId) {
        addRealShare(rediskey, circleId, 1);
    }
    var realShareNumberValue = thisValue.find(".shareCount").text();
    if (realShareNumberValue !== null && realShareNumberValue !== "" && realShareNumberValue !== undefined) {
        thisValue.find(".shareCount").text(parseInt(realShareNumberValue) + 1);
    }
});

//c_alert_dialog dialog_close

/*---------------点击复制或分享---------------*/
function getGoodsImg($thisElement) {
    $thisElement = $($thisElement);
    var goods_Img = $thisElement.attr("goods_img");
    return $thisElement.attr("goods_img") != '' ? $thisElement.attr("goods_img") : "";
}

// 复制链接
var clipboard = new Clipboard('.copylink', {
    // 点击copy按钮，直接通过text直接返回复印的内容
    text: function () {
        return urlCode;
    }
});

clipboard.on('success', function (e) {
    Dialog.init("复制成功", 500);
    e.clearSelection();
});

clipboard.on('error', function (e) {
    Dialog.init("复制失败", 500);
});

$(function () {

    $(".shopCode").click(function (e) {
        e.stopPropagation();
        if ($(".ewmcode").length == 0) {
            var weixinCode = '<div class="ewmcode" value="0"><img src=""/></div>';
            $("body").append(weixinCode);
        }
        var ewmcodeVal = $(".shopCode").attr("value");
        if (ewmcodeVal == "1") {
            $(".ewmcode").hide();
            $(".shopCode").attr("value", "0");
        } else {
            $(".ewmcode").show();
            $(".shopCode").attr("value", "1");
        }
    })

})

/*---------------点击复制或分享---------------*/

function testFunction() {
    $("#nav-shop").css("display", "block");
}


$(document).on("touchstart", ".closeShareBottom,#closeShare2,#hui-mask", function () {
    $("#hui-mask").css("display", "none");
    $(".share-block").slideUp(100);
    $(".ewmcode").hide();
    setTimeout("testFunction()", "1000");
});


function getShareParameter() {
    var rediskeyParam = rediskey;
    var circleIdParam = circleId;
    var statisticsTypeParam = statisticsTypeValue;
    $.ajax({
        type: "GET",	//定义提交的类型9
        url: "/localQuickPurchase/brandCountAction/addShareNumber?key=" + rediskeyParam + "&circleId=" + circleIdParam + "&statisticsType=" + statisticsTypeParam + "&userSeq=" + seq,
        async: false,	//是否异步请求，false为同步
        success: function (data) {
            if (data.data != true) {
                console.log("增加关注量出现错误");
            } else {
                console.log("调用成功");

                var shareList = $(".share");
                for (var i = 0; i < shareList.length; i++) {
                    if ($(shareList[i]).attr("circleId") == circleId) {
                        var shareNumber = $(shareList[i]).text();
                        $(shareList[i]).find(".shareCount").text(parseInt(shareNumber) + 1);
                    }
                }


                var shareExtensionList = $(".shareExtension");
                for (var i = 0; i < shareExtensionList.length; i++) {
                    if ($(shareExtensionList[i]).attr("circleId") == circleId) {
                        var shareNumber = $(shareExtensionList[i]).text();
                        $(shareExtensionList[i]).find(".shareCount").text(parseInt(shareNumber) + 1);
                    }
                }
            }
        }
    });

}


function addRealShare(key, circleId, statisticsType) {
    //增加关注数
    $.ajax({
        type: "GET",	//定义提交的类型9
        url: "/localQuickPurchase/brandCountAction/addShareNumber?key=" + key + "&circleId=" + circleId + "&statisticsType=" + statisticsType + "&userSeq=" + seq,
        async: false,	//是否异步请求，false为同步
        success: function (data) {
            if (data.data != true) {
                console.log("增加关注量出现错误");
            }else{
                console.log("调用成功");

                var shareList = $(".forward");
                for (var i = 0; i < shareList.length; i++) {
                    if ($(shareList[i]).attr("circleId") == circleId) {
                        var shareNumber = $(shareList[i]).find(".redText").text();
                        $(shareList[i]).find(".redText").text(parseInt(shareNumber) + 1);
                    }
                }


                // var shareExtensionList = $(".forward");
                // for (var i = 0; i < shareExtensionList.length; i++) {
                //     if ($(shareExtensionList[i]).attr("circleId") == circleId) {
                //         var shareNumber = $(shareList[i]).find(".redText").text();
                //         $(shareList[i]).find(".redText").text(parseInt(shareNumber) + 1);
                //     }
                // }
            }
        }
    });
}

/*  ---------------------------                 点击放大图片      ---------------------------                     */

$(document).on("click", ".imgList img", function () {
    var _this = $(this);//将当前的pimg元素作为_this传入函数
    saveImgUrl = _this.attr("src");
    $(".downloadImg").attr("sendImg", saveImgUrl);
    $(".circleDetail").css("display", "none");
    imgShow("#outerdiv", "#innerdiv", "#bigimg", _this);
});

function imgShow(outerdiv, innerdiv, bigimg, _this) {
    var src = _this.attr("src");//获取当前点击的pimg元素中的src属性
    var clickImgMark = _this.attr("clickImgMark");
    $(bigimg).attr("src", src);//设置#bigimg元素的src属性

    /*获取当前点击图片的真实大小，并显示弹出层及大图*/
    $("<img/>").attr("src", src).load(function () {
        var windowW = $(window).width();//获取当前窗口宽度
        var windowH = $(window).height();//获取当前窗口高度
        var realWidth = 1000;//获取图片真实宽度
        var realHeight = 1000;//获取图片真实高度
        var imgWidth, imgHeight;
        var scale = 1;//缩放尺寸，当图片真实宽度和高度大于窗口宽度和高度时进行缩放

        if (realHeight > windowH * scale) {//判断图片高度
            imgHeight = windowH * scale;//如大于窗口高度，图片高度进行缩放
            imgWidth = imgHeight / realHeight * realWidth;//等比例缩放宽度
            if (imgWidth > windowW * scale) {//如宽度扔大于窗口宽度
                imgWidth = windowW * scale;//再对宽度进行缩放
            }
        } else if (realWidth > windowW * scale) {//如图片高度合适，判断图片宽度
            imgWidth = windowW * scale;//如大于窗口宽度，图片宽度进行缩放
            imgHeight = imgWidth / realWidth * realHeight;//等比例缩放高度
        } else {//如果图片真实高度和宽度都符合要求，高宽不变
            imgWidth = realWidth;
            imgHeight = realHeight;
        }
        if (clickImgMark == "1") {
            $(innerdiv).removeAttr("style");
            $(bigimg).css("width", imgWidth);//以最终的宽度对图片缩放
            $(bigimg).css("height", imgWidth);
            var w = (windowW - imgWidth) / 2;//计算图片与窗口左边距
            var h = (windowH - imgHeight) / 2;//计算图片与窗口上边距
            $(innerdiv).css({"top": "20%", "left": w, "position": "absolute"});//设置#innerdiv的top和left属性
        } else {
            $(innerdiv).css({
                "top": "0",
                "left": "0",
                "right": "0",
                "bottom": "0",
                "width": "12.5rem",
                "height": "21.25rem",
                "margin": "auto"
            });
            $(bigimg).css("width", "12.5rem");
            $(bigimg).css("height", "21.25rem");
            $(bigimg).css("max-width", "100%");
            $(bigimg).css("max-height", "100%");
        }
        $(outerdiv).fadeIn("fast");//淡入显示#outerdiv及.pimg
    });

    $(outerdiv).click(function () {//再次点击淡出消失弹出层
        $(this).fadeOut("fast");
        $(".circleDetail").css("display", "block");
    });
}

/*  ---------------------------                 点击放大图片      ---------------------------                     */


/*  ---------------------------                 长按复制文本      ---------------------------                     */
var timeOutEvent = 0;
// 复制链接
$(document).on("touchstart", ".faquanMain .text", function (e) {
    var pressValueList = $(this).find("p");
    timeOutEvent = setTimeout(function () {
        if (pressValueList) {
            //文字信息
            var pressText = "";
            for (var i = 0; i < pressValueList.length; i++) {
                pressText += $(pressValueList[i]).text();
            }
            if (pressText) {
                $('#textCopy').attr("value", pressText);
                copyText();
                if (isiOS == true) {
                    try {
                        window.action.app_sendCopyValue(pressText);
                    } catch (e) {
                        console.log(e);
                    }
                } else {
                    Dialog.init("复制成功", 500);
                }
            }
        }
        timeOutEvent = 0;
    }, 500);
    e.preventDefault();
});

function copyText() {
    var d = document.getElementById("textCopy");
    console.log(d);
    d.select(); // 选择对象
    document.execCommand("Copy"); // 执行浏览器复制命令
}

$(document).on("touchmove", ".faquanMain .text", function (e) {
    clearTimeout(timeOutEvent);
    timeOutEvent = 0;
});

$(document).on("touchend", ".faquanMain .text", function (e) {
    clearTimeout(timeOutEvent);
    if (timeOutEvent != 0) {
        if ($(this).attr("hotSaleGoodsMark") != 1) {
            checkGoodsDetail(this);
        }
    }
    return false;
});


/*  ---------------------------                 长按复制文本      ---------------------------                     */


/*  ---------------------------                 保存大图      ---------------------------                     */

//保存大图
function saveImg(imgObjectValue) {
    var sendImgUrl = $(imgObjectValue).attr("sendimg");
    if (sendImgUrl) {
        //app
        window.action.downImg(sendImgUrl);
    }
}

/*  ---------------------------                 保存大图      ---------------------------                     */

function closeCircleInfo() {
    $(".share-mask").css("display", "none");
}

function openCircleInfo() {
    $(".share-mask").css("display", "block");
}

window.onload = function () {
    if (seq) {
        $.ajax({
            type: "GET",	//定义提交的类型9
            url: "/localQuickPurchase/propagandaCircleAction/checkIsNewUser?userSeq=" + seq,
            async: false,	//是否异步请求，false为同步
            success: function (data) {
                if (data == true) {
                    $(".share-mask").css("display", "block");
                }
            }
        });
    }
};

/**
 * 解决发圈页面爆款特价点击分享分享栏被遮挡问题（滚动条自动拉到最底部）
 */
function goDownBottomParent(){
    var doc = document,
        win = window,
        $ScrollBottom = $(".explosive_product").height();
    console.log("距离底部距离bottom"+$ScrollBottom);
    // 速度
    var speed = 300;
    $('body,html').stop().animate({scrollTop :$ScrollBottom},speed);
}

/**
 * 点击二级tab
 */
function changeSecondTab(thisValue){
    var taggleList = $(".secondTaggle");
    //清除所有样式
    for(var i = 0; i < taggleList.length; i++){
        $(taggleList[i]).removeClass("active2");
    }
    //当前点击对象新增样式
    $(thisValue).addClass("active2");
    //触发相应事件
    var taggleMark = $(thisValue).attr("taggleMark");

    if(taggleMark == 1){

        if (isiOS == true) {
            window.location.reload()
        }else{
            $(".dropload-down").hide();
            pageIndex = 1;
            $('.extendList').html("");
            getCircleInfo1();
            $('.extendList').hide();
            $(".explosive_product").hide();
            $('.boomList').show();
        }
    }else if(taggleMark == 2){
        $('.extendList').hide();
        $('.boomList').hide();
        $(".explosive_product").show();

        if (!isLogin()) {
            var returnUrl = window.location.href;
            setCookie("loginRetrunUrl",returnUrl);
            loginPage();
        }
    }
}

window.onload = function(){
    var testValue = window.frames["mainIframe"].document.getElementById("explosiveHeader");
    var mescrollValue = window.frames["mainIframe"].document.getElementById("mescroll");
    var spikeWrapValue = window.frames["mainIframe"].document.getElementById("spike_wrap");
    $(testValue).css("display","none");
    $(mescrollValue).css("top","3.8rem");
    if(isiOS == true){
        $(mescrollValue).css("bottom","8rem");
    }

    // spikeWrapValue.addEventListener('touchmove', "handler", false);
};

/**
 * 重新设置二级tab
 */
function resetSecondTab(){
    var taggleList = $(".secondTaggle");
    //清除所有样式
    for(var i = 0; i < taggleList.length; i++){
        //触发相应事件
        var taggleMark = $(taggleList[i]).attr("taggleMark");
        if(taggleMark == 1){
            $(taggleList[i]).addClass("active2");
        }else{
            $(taggleList[i]).removeClass("active2");
        }
    }
}

/**
 * 分享悬浮自由拖动
 */
$(function () {
    var cont = $("#circleDetail");
    var contW = $("#circleDetail").width();
    var contH = $("#circleDetail").height();
    var startX, startY, sX, sY, moveX, moveY;
    // var winW = $(window).width();
    // var winH = $(window).height();
    var winW = document.body.clientWidth;
    var winH = document.body.clientHeight;
    var barrage_name = $("#circleDetail_name");
    var barrage_frame = $("#circleDetail_frame");
    var body = $("body");
    var PH = window.innerHeight; //可视高度
    var t = '';
    window.onscroll = function () {
        t = window.scrollY
        // console.log(t);
    }
    var bottomLength = $(".wBg").height();
    var topLength = $("#header").height();
    // var h=1800;


    cont.on({ //绑定事件
        touchstart: function (e) {
            startX = e.originalEvent.targetTouches[0].pageX; //获取点击点的X坐标
            startY = e.originalEvent.targetTouches[0].pageY; //获取点击点的Y坐标
            //console.log("startX="+startX+"************startY="+startY);
            sX = $(this).offset().left; //相对于当前窗口X轴的偏移量
            sY = $(this).offset().top; //相对于当前窗口Y轴的偏移量
            leftX = startX - sX; //鼠标所能移动的最左端是当前鼠标距div左边距的位置
            rightX = winW - contW + leftX; //鼠标所能移动的最右端是当前窗口距离减去鼠标距div最右端位置
            topY = startY - sY; //鼠标所能移动最上端是当前鼠标距div上边距的位置
            bottomY = winH - contH + topY; //鼠标所能移动最下端是当前窗口距离减去鼠标距div最下端位置
        },
        touchmove: function (e) {
            // console.log(h)
            e.preventDefault();
            moveX = e.originalEvent.targetTouches[0].clientX; //移动过程中X轴的坐标
            moveY = e.originalEvent.targetTouches[0].clientY; //移动过程中Y轴的坐标
            movepageY = e.originalEvent.targetTouches[0].pageY - t;
            //console.log("moveX="+moveX+"************moveY="+moveY);
            if (moveX < leftX) {
                moveX = leftX;
            }
            if (moveX > rightX) {
                moveX = rightX;
            }
            // if (moveY < topY) {
            //     moveY = topY;
            // }
            if (moveY > (bottomY- bottomLength)) {
                moveY = (bottomY - bottomLength);
            }
            if (moveY < topY + topLength) {
                moveY = (topY + topLength);
            }
            // topLength

            //初始化拖动值
            $(this).css({
                "left": moveX + sX - startX,
                "top": moveY + sY - startY,
            })
        },

    })

})

// jQuery(document).ready(function(){
//     $.ajax({
//         type: "get",
//         async: false,
//         url: "/localQuickPurchase/propagandaCircleAction/getCircleInfo?pageIndex=1&pageSize=2&choseMark=1&userSeq=5757774",
//         dataType: "jsonp",
//         jsonp: "callback",//传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(一般默认为:callback)
//         jsonpCallback:"flightHandler",//自定义的jsonp回调函数名称，默认为jQuery自动生成的随机函数名，也可以写"?"，jQuery会自动为你处理数据
//         success: function(json){
//             // console.log(json);
//         },
//         error: function(){
//             // alert('fail');
//         }
//     });
// });
