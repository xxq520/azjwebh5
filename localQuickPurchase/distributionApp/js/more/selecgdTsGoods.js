/**
 * 严选好货--更多商品
 */
var pageIndex = 1;
var isLoading = false;
var first = true;
var pageSize = 10;
var singState = getQueryString("name");
//var shareSeq =window.localStorage.getItem("seq");
var Coums=shopgd(seq);

//获取优惠券图标
function getYhqHtml(data){
    var goodsYhq = data.yHQ;
    var type=getRoleType();
    var yhqHtml = "";
    if (goodsYhq) {
        if (type==1||type==2||!type ) {
            yhqHtml+='<img style="height: 25px;" class="haha"  src="/localQuickPurchase/coupons/images/home_icon_label_2@2x.png" onclick=jumpCoupon()>'
        }else if ((type==3 || type ==4) && Coums<=100) {
            yhqHtml+='<img style="height: 25px;" class="haha"  src="/localQuickPurchase/coupons/images/home_icon_label_2@2x.png" onclick=jumpCoupon()>'
        }else {
            yhqHtml+=""
        }
    } else {yhqHtml+=""}
    return yhqHtml;
}


//var city = "";

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
    }

}

function getMore(city,labValue){

    if(!isLoading){
        if($('#fei').find("li").length ==0){
            var _html  = '<li style="width: 100%; position: fixed;bottom: 0;height: 80px;-webkit-overflow-scrolling: touch; "><p class=" weather " style=" " id="morn2" >' +
                                                  '<img style="position :absolute; top:6px;right:6px;width: 20px;height: 20px" src="/localQuickPurchase/coupons/images/page2_rztc_icon_1.png"' +
                ' onclick="closeme()" >' +

                                                  '<img src="/localQuickPurchase/coupons/images/page2_bgimage_bannergangao.png"  onclick=toIntion()  style="width: 100%；"></p></li>';
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
    $.ajax({
        type : 'post',
        dataType : 'JSON',
        contentType: "application/json;charset=utf-8",
        url : '/localQuickPurchase/selectionGoods/v2/selecLocalSpecialtyGoodsCom',
        data : JSON.stringify({
            labValue:labValue,
            city:city,
            adress:$("#adress").text(),
            province:$("#province").text(),
            pageIndex : pageIndex,
            pageSize : pageSize
        }),
        async : false,
        success : function(data){
            var code = data.code;
            var listData = data.data;
            console.log(listData,'5')
            if($('#city').html()==''){
                $('#city').html(city)
            }
            if(code == 200 && listData != null && listData.length > 0) {
                for(var i = 0; i < listData.length; i++){
                    var _data = listData[i];
                    html += getHTML(_data);
                }
                $(html).appendTo('#list');
                pageIndex++;
                // hui.endLoadMore(false);
                isLoading = true;
                $("#tanchuan").css("display","none");
                $(".quguan").css("display","none");
            } else {
                clearLoading();
                if (pageIndex == 1) {
                    $("#tanchuan").css("display","flex");
                    $(".quguan").css("display","flex");
                    $(".weather").hide()
                    isLoading = true;
                }else{
                    $(".weather").show()
                    isLoading = false;
                }
                // $(".mescroll-hardware").css("display","none");
                // $(".mescroll-upwarp").css("display","none");

                return false;
            }
        },
        error : function(error) {
        }
    });
}
//下拉刷新
function refresh(city,labValue){
    var aa =document.getElementById("adress");
    var html ='';
    pageIndex=1;
    $('#list').html("");
    console.log('refresh',2)
    $.ajax({
        type : 'post',
        dataType : 'json',
        contentType: "application/json;charset=utf-8",
        url : '/localQuickPurchase/selectionGoods/v2/selecLocalSpecialtyGoodsCom',
        data : JSON.stringify({
            labValue:labValue,
            city:city,
            adress: $("#adress").text(),
            province:$("#province").text(),
            pageIndex : pageIndex,
            pageSize : pageSize
        }),
        async : false,
        success : function(data) {
            if($('#city').html()==''){
                $('#city').html(city)
            }
            var code = data.code;
            var listData = data.data;
            if(code == 200 && listData != null && listData.length > 0) {
                var s = listData;
                for(var i = 0; i < s.length; i++){
                    var _data = s[i];
                    html += getHTML(_data);
                }
                pageIndex ++;
                $('#list').html(html);
                first = false;
               $("#tanchuan").css("display","none");
               $(".quguan").css("display","none");
            } else {
                clearLoading();
                if (pageIndex == 1) {
                    $("#tanchuan").css("display","flex");
                    $(".quguan").css("display","flex")
                    $(".weather").hide()
                }else{
                    $(".weather").show()
                }
                $('#list').html(html);
                /* $(".mescroll-hardware").css("display","none");
                 $(".mescroll-upwarp").css("display","none");*/
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
    var goodName = data.goodsName;//商品名字
    var goodsName='';
    var goodsImg = data.thumbnail;//商品图片
    var goodsId = data.goodsId;//商品ID
    console.log("yhq"+data.yhq);
    var isActivityGoods = data.isActivityGoods;//秒杀商品标识
    var goodsProStandard = data.goodsProStandard;
    var goodsPrice = goodsProStandard[0].goodsPrice;//商品原价
    var actualPrice = data.actualPrice;//实际价格
    var comparativePrice = data.comparativePrice;//展示价格
    var _labelHtml='&nbsp;';
    if(data.listLabel != null){
        var  listLabel = data.listLabel;
        for (var j = 0; j < listLabel.length; j++) {
            var label = listLabel[j];
            _labelHtml += ' <span style="color:'+label.colour+';border: 1px solid '+ label.colour +';border-radius: 0.59rem;padding: 0 4px;">'+ label.labelValue +'</span>';
        }
    }
    html += '<li  class="good-pic"  id="'+goodsId+'" isActivityGoods="'+isActivityGoods+'"> <div class="hotSaleImg">';
    html += '<img src=' + goodsImg + '>';
    html += getYhqHtml(data);
    if(goodName.length>23){
        goodsName=goodName.substring(0,23)+"...";
        html += '</div> <p class="hotSaleTitle">' + goodsName + '</p>';
    } else{
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
function jumpCoupon(){
    var oEvent = event;
    oEvent.cancelBubble = true;
    window.location.href="/localQuickPurchase/activity/baiye.html";
}
function closeme() {
    $(".weather").hide()
}

function toIntion() {
    window.location.href = "/localQuickPurchase/supplierEntry/supplierEntry.html";
}