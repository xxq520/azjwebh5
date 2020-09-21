/**
 * Created by admin on 2018/7/24.
 */

var categoryAndGenre;
$(function () {
    //获取服务商的商品分类 (不包含商品)
    $.ajax({
        type: 'GET',
        contentType: "application/json;charset=utf-8",
        url: '/goods/goodsCategory/getCategory',
        data: {},
        async: true,
        dataType: 'JSON',
        success: function (data) {
            var data = data.data;
            if (data != null && data.length != 0) {
                categoryAndGenre = data;
                var list = "";
                var list2 = "";
                var num;
                var categoryId = getCookie("categoryId");
                $(".classifiy-ul").html("")

                for (var i = 0; i < data.length; i++) {
                    list += '<li value="' + data[i].id + '"><span class="clcon">' + data[i].name + '</span></li>';
                    if (i == 0) {
                        var listGenre = data[i].list;
                        if (listGenre == null || listGenre.length == 0) {
                            continue;
                        }
                        for (var j = 0; j < listGenre.length; j++) {
                            list2 += '<li data-id="' + listGenre[j].id + '">';
                            list2 += '<div class="right-img">';
                            var classifyImg = listGenre[j].imgPath;
                            if (classifyImg == null || classifyImg == "") {
                                classifyImg = "/goods/images/default-classify.png";
                            }
                            list2 += '<img src="' + classifyImg + '" /></div>';
                            list2 += '<p class="right-title">' + listGenre[j].name + '</p></li>';
                        }
                    }
                    if (categoryId != null && categoryId == data[i].id) {
                        num = i;
                        getCategoryGoods(true, 1, categoryId);
                    }
                }
                $(".classifiy-ul").append(list);
                if (categoryId == null || categoryId == "") {
                    $(".goods-ul").append(list2);
                }
                var $this = $(".classifiy-left").find("li").eq(num);

                $this.css({'color': '#E4393C', 'border-left': '0.13rem solid #E4393C'});
                $this.siblings().css({'color': '#212121', 'border-left': '0rem solid #E4393C'});

                $(".classifiy-left").show();
                $(".classifiy-right").show();
                $(".load-prompt").hide();
            } else {
                $(".load-prompt").html("<p>没有数据哦！！</p>");
            }
        },
        error: function (err) {
            hui.toast("网络错误");
        }
    });
});

function getCategoryGoods(async, pageIndex, categoryId) {
    for (var i = 0; i < categoryAndGenre.length; i++) {
        if (categoryId != categoryAndGenre[i].id) {
            continue;
        }
        var listGenre = categoryAndGenre[i].list;
        if (listGenre == null || listGenre.length == 0) {
            continue;
        }
        $(".goods-ul").html("");
        var list2 = "";
        for (var j = 0; j < listGenre.length; j++) {
            list2 += '<li data-id="' + listGenre[j].id + '">';
            list2 += '<div class="right-img">';
            var classifyImg = listGenre[j].imgPath;
            if (classifyImg == null || classifyImg == "") {
                classifyImg = "/goods/images/default-classify.png";
            }
            list2 += '<img src="' + classifyImg + '" /></div>';
            list2 += '<p class="right-title">' + listGenre[j].name + '</p></li>';
        }
        $(".goods-ul").append(list2);
    }
}

//分类广告横幅
$(function () {
    var identifyType = 4;
    var banner = {"identifyType": identifyType};
    $.ajax({
        type: 'POST',
        dataType: 'json',
        contentType: "application/json;charset=utf-8",
        url: '/goods/bannerAction/listAllBanner',
        data: JSON.stringify(banner),
        success: function (data) {
            if (data.code == 1000) {
                //返回list的数量
                var banners = data.data;
                var length = banners.length;
                var clientH = document.documentElement.clientHeight;
                var ccHeight = clientH - (document.querySelector('.classifiyHeader').clientHeight) - (document.querySelector('#hui-footer').clientHeight);

                $('.classifiyContent').css('height',ccHeight);
                window.onresize=function(){
                    $('.classifiyContent').css('height',ccHeight);
                }
                if (length == 0) {
                    //如果数据库没有酒水组相关广告图，则显示默认
                    $("#advertisement").append("<img src='/goods/images/classifiyImg8.png'/>");
                } else {
                    var banner = banners[0];
                    console.log(banner);
                    if (banner.jumpTarget == null || banner.jumpTarget == "") {
                        $("#advertisement").append("<img src='" +banner.imageLocation+ "'/>");
                    } else {
                        $("#advertisement").append("<a href='" + banner.jumpTarget + "'><img  src='" + banner.imageLocation + "' /></a>");
                    }
                }
                var subHeight = ccHeight - document.querySelector('#advertisement').clientHeight;
                $('.subclass').css('height',subHeight);
                window.onresize=function(){
                    $('.subclass').css('height',subHeight);
                }
                console.log(document.querySelector('#advertisement').clientHeight);
            } else {
                hui.alert(data.message);
            }
        }
    });
});