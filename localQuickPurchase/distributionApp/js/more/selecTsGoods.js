/**
 * 严选好货--更多商品
 */
var pageIndex = 1;
var isLoading = false;
var first = true;
var pageSize = 10;
var singState = getQueryString("name");
var Coums=shopgd(seq);


/*获取 农副特产 手工制品 工业品*/







//var city = "";
//获取优惠券图标
function getYhqHtml(data){
    var goodsYhq = data.yHQ;
    var type=getRoleType();
    var yhqHtml = "";
    if (goodsYhq) {
        if (type==1||type==2 ||!type ) {
            yhqHtml+='<img style="height: 25px;" class="haha"  src="/localQuickPurchase/coupons/images/home_icon_label_2@2x.png" onclick=jumpCoupon()>'
        }else if ((type==3 || type==4)&& Coums<=100) {
            yhqHtml+='<img style="height: 25px;" class="haha"  src="/localQuickPurchase/coupons/images/home_icon_label_2@2x.png" onclick=jumpCoupon()>'
            }else {
            yhqHtml+=""
        }
        } else {yhqHtml+=""}
    return yhqHtml;
}


if(singState != null) {
    try{
        //进行URL解码
        var singStateD = decodeURI(singState);
        singState = singStateD;
    }catch (e){
        console.log(e);
    }
    $("._title").text(singState);
    $("._title_H1").text(singState);
    if (singState == "本地特产"){
        $("#classify").show();
        $(".search_box").show();
    }else{
        $("#list").css("margin-top","1.8rem")
    }

}


/*城市的区js*/
function SelCity(obj, e) {
    var ths = obj;
    var dal = '<div style="z-index: 20000" class="_citys";"><span title="关闭" id="cColse" >×</span><ul style="z-index: 20000" id="_citysheng" class="_citys0"><li class="citySel">省份</li><li>城市</li><li>区县</li></ul><div style="z-index: 20000" id="_citys0" class="_citys1"></div><div style="display:none" id="_citys1" class="_citys1"></div><div style="display:none" id="_citys2" class="_citys1"></div></div>';
    Iput.show({id: ths, event: e, content: dal, width: "470"});
    $("#cColse").click(function () {
        Iput.colse();
    });
    var tb_province = [];
    var b = province;
    for (var i = 0, len = b.length; i < len; i++) {
        tb_province.push('<a data-level="0" data-id="' + b[i]['id'] + '" data-name="' + b[i]['name'] + '">' + b[i]['name'] + '</a>');
    }
    $("#_citys0").append(tb_province.join(""));
    $("#_citys0 a").click(function () {
        var g = getCity($(this));
        $("#_citys1 a").remove();
        $("#_citys1").append(g);
        $("._citys1").hide();
        $("._citys1:eq(1)").show();
        $("#_citys0 a,#_citys1 a,#_citys2 a").removeClass("AreaS");
        $(this).addClass("AreaS");
        var lev = $(this).data("name");
        ths.value = $(this).data("name");
        if (document.getElementById("hcity") == null) {
            var hcitys = $('<input>', {
                type: 'hidden',
                name: "hcity",
                "data-id": $(this).data("id"),
                id: "hcity",
                val: lev
            });
            $(ths).after(hcitys);
        }
        else {
            $("#hcity").val(lev);
            $("#hcity").attr("data-id", $(this).data("id"));
        }
        $("#_citys1 a").click(function () {
            $("#_citys1 a,#_citys2 a").removeClass("AreaS");
            $(this).addClass("AreaS");
            var lev = $(this).data("name");
            if (document.getElementById("hproper") == null) {
                var hcitys = $('<input>', {
                    type: 'hidden',
                    name: "hproper",
                    "data-id": $(this).data("id"),
                    id: "hproper",
                    val: lev
                });
                $(ths).after(hcitys);
            }
            else {
                $("#hproper").attr("data-id", $(this).data("id"));
                $("#hproper").val(lev);
            }
            var bc = $("#hcity").val();
            ths.value = bc + "-" + $(this).data("name");
            var ar = getArea($(this));
            $("#_citys2 a").remove();
            $("#_citys2").append(ar);
            $("._citys1").hide();
            $("._citys1:eq(2)").show();
            $("#_citys2 a").click(function () {
                $("#_citys2 a").removeClass("AreaS");
                $(this).addClass("AreaS");
                var lev = $(this).data("name");
                if (document.getElementById("harea") == null) {
                    var hcitys = $('<input>', {
                        type: 'hidden',
                        name: "harea",
                        "data-id": $(this).data("id"),
                        id: "harea",
                        val: lev
                    });
                    $(ths).after(hcitys);
                }
                else {
                    $("#harea").val(lev);
                    $("#harea").attr("data-id", $(this).data("id"));
                }
                var bc = $("#hcity").val();
                var bp = $("#hproper").val();
                ths.value = bc + "-" + bp + "-" + $(this).data("name");
                Iput.colse();
                var str =  $("#hcity").attr("value")  +  $("#hproper").attr("value") + $("#harea").attr("value");
                $("#city").attr({"value" : str});
                adderss.innerHTML = $("#harea").attr("value");

                console.log($("#city").attr("value"));


                console.log("city222 " + adderss.innerHTML);
                //
                var city=lev;
                getMore(city);

            });
        });
    });
    $("#_citysheng li").click(function () {
        $("#_citysheng li").removeClass("citySel");
        $(this).addClass("citySel");
        var s = $("#_citysheng li").index(this);
        $("._citys1").hide();
        $("._citys1:eq(" + s + ")").show();
    });

}


function getCity(obj) {
    var c = obj.data('id');
    var e = province;
    var f;
    var g = '';
    for (var i = 0, plen = e.length; i < plen; i++) {
        if (e[i]['id'] == parseInt(c)) {
            f = e[i]['city'];
            break
        }
    }
    for (var j = 0, clen = f.length; j < clen; j++) {
        g += '<a data-level="1" data-id="' + f[j]['id'] + '" data-name="' + f[j]['name'] + '" title="' + f[j]['name'] + '">' + f[j]['name'] + '</a>'
    }
    $("#_citysheng li").removeClass("citySel");
    $("#_citysheng li:eq(1)").addClass("citySel");
    return g;
}

function getArea(obj) {
    var c = obj.data('id');
    var e = area;
    var f = [];
    var g = '';
    for (var i = 0, plen = e.length; i < plen; i++) {
        if (e[i]['pid'] == parseInt(c)) {
            f.push(e[i]);
        }
    }
    for (var j = 0, clen = f.length; j < clen; j++) {
        g += '<a data-level="1" data-id="' + f[j]['id'] + '" data-name="' + f[j]['name'] + '" title="' + f[j]['name'] + '">' + f[j]['name'] + '</a>'
    }
    $("#_citysheng li").removeClass("citySel");
    $("#_citysheng li:eq(2)").addClass("citySel");


    return g;
}

function getMore(city, labValue){
    if(!isLoading){
        if($('#fei').find("li").length ==0){

            var _html  = '<li style="width: 100%;"><p class="drp_bottom font-sm person1 nothing" style="position: fixed; bottom:0.2rem; padding: 1px; z-index: 999;" id="morn2" >' +
                '<img style="position :absolute; top:6px;right:6px;width: 20px;height: 20px" src="/localQuickPurchase/coupons/images/page2_rztc_icon_1.png"' +
                ' onclick="closeme()" >' +

                '<img src="/localQuickPurchase/coupons/images/page2_bgimage_bannergangao.png" class="weather" onclick=toIntion() ></p></li>';
            $("#fei").append(_html);
            $(".weather").hide();

        }else{
            $(".weather").show();
            $(".nothing").show();
        }
        return;
    }
    if (city =="undefined"){
        city= "";

    }else {
            goodlist(city,labValue);
    }
}

function goodlist(city,labValue) {

    var html = '';
    console.log(html);
    $.ajax({
        type : 'post',
        dataType : 'JSON',
        contentType: "application/json;charset=utf-8",
        url : '/localQuickPurchase/selectionGoods/v2/selecCitySpecialtyGoodsCom',
        data : JSON.stringify({
            city: city,
            labValue,labValue,
            pageIndex : pageIndex,
            pageSize : pageSize
        }),
        async : false,
        success : function(data){

            var code = data.code;
            var listData = data.data;
            if(code == 200 && listData != null && listData.length > 0) {

                for(var i = 0; i < listData.length; i++){
                    var _data = listData[i];
                    html += getHTML(_data);
                }

                $(html).appendTo('#list');
                pageIndex++;
                isLoading = true;
                $("#tanchuan").css("display","none");
                $(".quguan").css("display","none");
            } else {
                console.log('2',pageIndex)
                clearLoading();
                if(pageIndex==1){
                    console.log('2')
                    $("#tanchuan").css("display","flex");
                    $(".quguan").css("display","flex");
                    $(".weather").hide();
                    isLoading = true;
                    return false;
                }else {
                    console.log('3')
                    $(".weather").show()
                    isLoading = false;
                }
            }

        },
        error : function(error) {
        }
    });
}

//下拉刷新
function refresh(city, labValue){
    $(".weather").hide();
    var html ='';
    pageIndex = 1;
    $('#list').html("");
    $.ajax({
        type : 'post',
        dataType : 'json',
        contentType: "application/json;charset=utf-8",
        url : '/localQuickPurchase/selectionGoods/v2/selecCitySpecialtyGoodsCom',
        data : JSON.stringify({
            city:city,
            labValue,labValue,
            pageIndex : pageIndex,
            pageSize : pageSize
        }),
        async : false,
        success : function(data) {
            var code = data.code;
            var listData = data.data;
            if(code == 200 && listData != null && listData.length > 0) {
                var s = listData;
                for(var i = 0; i < s.length; i++){
                    var _data = s[i];
                    html += getHTML(_data);
                }
                pageIndex++;
                $('#list').html(html);
                first = false;
                $("#tanchuan").css("display","none");
                $(".quguan").css("display","none");
                $("#mescroll").scrollTop(0)
            } else {
                clearLoading();
                if (pageIndex == 1) {
                    $("#tanchuan").css("display","flex");
                    $(".quguan").css("display","flex");
                    $(".weather").hide();
                }else{

                }
            }
        },
        error : function(error) {
        }
    });
}

/*商品详情*/
$(document).on('click', '.good-pic', function() {
    var goodsId = $(this).attr('id');
    var isActivityGoods = $(this).attr('isActivityGoods');
    if(seq == null || seq == '') {
        seq = 0;
    }
    if (isActivityGoods != null && isActivityGoods == "1"){
        window.location.href= "/localQuickPurchase/distributionVA/seckill/sgDetail?goodsId=" + goodsId + "&distributorSeq="+seq+"&shareSeq=0";
    } else {
        window.location.href="/localQuickPurchase/distributionVA/goodsDetail/"+goodsId+"/0"+"/"+seq;
    }
});



function getHTML(data) {

    var html = "";
  //  var result =shopgd();
    //var type=getRoleType();
    var goodName = data.goodsName;//商品名字
    var goodsName='';
    var goodsImg = data.thumbnail;//商品图片
    var goodsId = data.goodsId;//商品ID
    /*linngqinchang 2019 11 7 增加标签*/
    var coupon =data.coupon;
    var isActivityGoods = data.isActivityGoods;//秒杀商品标识
    //var buyingPrice = data.goodsProStandard[0].buyingPrice;//商品价格
    var goodsProStandard = data.goodsProStandard;
    var distributionPrice = getDistributionPrice(goodsProStandard);//分销价
    var goodsPrice = goodsProStandard[0].goodsPrice;//商品原价
    var seckillPrice = goodsProStandard[0].seckillPrice;//秒杀价
    var actualPrice = data.actualPrice;//实际价格
    var comparativePrice = data.comparativePrice;//展示价格
    var canSaleStock = data.canSaleStock;//剩余库存
    //var platformPrice = getPlatformPrice(goodsProStandard);//平台价
    var _labelHtml='&nbsp;';
    if(data.listLabel != null){
        var  listLabel = data.listLabel;
        for (var j = 0; j < listLabel.length; j++) {
            var label = listLabel[j];
            _labelHtml += ' <span style="color:'+label.colour+';border: 1px solid '+ label.colour +';border-radius: 0.59rem;padding: 0 4px;">'+ label.labelValue +'</span>';
        }
    }
    html += '<li id="'+goodsId+'" isActivityGoods="'+isActivityGoods+'" class="good-pic"> <div class="hotSaleImg">';
    html += '<img id="'+goodsId+'" isActivityGoods="'+isActivityGoods+'" src=' + goodsImg + ' >';
    html += getYhqHtml(data);
    if(goodName.length>23){
        goodsName=goodName.substring(0,23)+"...";
        html += '</div> <p class="hotSaleTitle">' + goodsName + '</p>';
    }
    else{
        html += '</div> <p class="hotSaleTitle">' + goodName + '</p>';
    }
    html += ' <p class="hotLabel">' + _labelHtml + '</p>';
    html += '<p class="hotSalePrice">';
    html += '<span>￥</span>'+ actualPrice + '&nbsp;';
    if(goodsPrice != null && goodsPrice > 0){
        html += '<span style="text-decoration:line-through;color: #999">￥'+ comparativePrice + '</span>';
    }
    html += '</li>';
    return html;
}

function  jumpCoupon(){
    var oEvent = event;
    oEvent.cancelBubble = true;
    window.location.href="/localQuickPurchase/activity/baiye.html";
}

function goClassifyWyf(){
    var oEvent = event;
    oEvent.cancelBubble = true;
    window.location.href="/localQuickPurchase/distributionVA/classify/classifyWyf?moduleName="+columnName;


}

function closeme() {
    $(".weather").hide()
}


function toIntion() {
    window.location.href = "/localQuickPurchase/supplierEntry/supplierEntry.html";
}


