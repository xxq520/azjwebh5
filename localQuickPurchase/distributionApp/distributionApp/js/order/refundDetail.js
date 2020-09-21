var saleType = getQueryString("saleType");//售后类型(退款退货, 换货)
var orderno = getQueryString("orderno");
var route = getQueryString("route");
var totalAmmount = getQueryString("totalAmmount");
var seq = seq;
var afterState = 0;//售后状态(0 等待审核, 1 退款、退货 , 2 换货, 3 仅退款)
var supplierSeqStr = getQueryString("supplierSeq");//供应商Seq
var supplierSeq = Number(supplierSeqStr);
if(route == 2){
    $("#btnbutton").removeClass("btn");
}
$('.order').html(orderno);
$('.refundspan').html('￥'+parseFloat(totalAmmount).toFixed(2));
if (route == 1) {//换货
    $("#exchange-h1").css("display","block");
    $("#exchange-text").css("display","block");
    $("#exchange-foot").css("display","block");
    afterState = 2;
} else if(route == 2){//退款、退货
    $("#aRefund-h1").css("display","block");
    $("#aRefund-text").css("display","block");
    $("#aRefund-foot").css("display","block");
    afterState = 1;
} else if(route == 3){//仅退款
    $("#onlyRefund-h1").css("display","block");
    $("#onlyRefund-text").css("display","block");
    $("#aRefund-foot").css("display","block");
    afterState = 3;
} else if(route == 4){//仅退款
    $("#onlyRefund-h1").css("display","block");
    $("#onlyRefund-text").css("display","block");
    $("#aRefund-foot").css("display","block");
    afterState = 3;
    route = 3;
}
var imgIdArr = new Array();
//上传图片
function uploadImg(file){
    var img = new Image();
    var reader = new FileReader();
    reader.onload = function(evt){
        img.src = evt.target.result;
        //if (!/\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(img.src)) {
        if (img.src.substr(11,4) != 'jpeg'  && img.src.substr(11,3) != 'png' && img.src.substr(11,3) != 'jpg' && img.src.substr(11,3) != 'PNG' && img.src.substr(11,3) != 'JPG' && img.src.substr(11,3) != 'gif') {
            hui.alert("您上传的图片类型不对,请重新上传！");
            return false;
        }
        //console.log(evt.target.result);
        if($("#pc_1").html()==""){
            var list="";
            list +='<img class="upload_cancel" src="/localQuickPurchase/distributionApp/images/classfiyImg2.png" />'+
                '<img  class="imgs" src="'+evt.target.result+'" />'
            $("#pc_1").html(list);
            //imgIdArr.push(evt.target.result);
        }else if($("#pc_2").html()==""){
            var list="";
            list +='<img class="upload_cancel" src="/localQuickPurchase/distributionApp/images/classfiyImg2.png" />'+
                '<img class="imgs"  src="'+evt.target.result+'" />'
            $("#pc_2").html(list);
            //imgIdArr.push(evt.target.result);
        }else{
            var list="";
            list +='<img class="upload_cancel" src="/localQuickPurchase/distributionApp/images/classfiyImg2.png" />'+
                '<img class="imgs" src="'+evt.target.result+'" />'
            $("#pc_3").html(list);
            //imgIdArr.push(evt.target.result);
        }

    }
    reader.readAsDataURL(file.files[0]);
}

//删除图片
$("body").on('click','.upload_cancel' , function(){
    $(this).parent("li").html("");
    imgIdArr.splice(0,imgIdArr.length);//清空图片数组
})
//点击放大图片
function sltHide(){
    $(".mask").fadeOut("slow");
    $(".blow_up").html("");
};
function sltShow(){
    $(".mask").fadeIn("slow");
};
$("body").on('click','.imgs' , function(){
    sltShow();
    var src=$(this).attr("src");
    $(".blow_up").append("<img src='"+src+"' />");
})
$("body").on('click','.mask' , function(){
    sltHide();
})
$(document).on('click','.footer-btn',function(){
    //获取售后图片
    imgIdArr.splice(0,imgIdArr.length);//清空图片数组
    var imgs = $(".imgs");
    for(var i=0;i<imgs.length;i++){
        //添加售后图片到数组
        imgIdArr.push(imgs.eq(i).attr("src"));
    }
    //alert(imgIdArr.length);
    /*if (afterState == 2) {*/
    var afterReason = $("#refund").val();//售后原因
    var afterWhy = $(".after-text").val();//售后理由
    //var Courier = $("#afterOrder").val();//快递理由
    var afterOrderno = Trim($(".afterOrder-text").val(),"g");//快递单号
    /*if (Courier == "") {
        hui.iconToast("请选择快递凭证！", 'error');
    }else{
        if (Courier == "有快递单号") {*/
    /*if (afterOrderno != "") {*/
    if (afterWhy != "" || bankvalue == 8) {
        if (afterOrderno != "") {

            var bool = checkNum(afterOrderno);
            if (bool) {
                var datas = {"seq":seq,"orderno":orderno,"afterOrderno":afterOrderno,"afterType":saleType,"afterState":afterState,"afterWhy":afterWhy,"afterReason":afterReason,"supplierSeq":supplierSeq,"route":route,"imgIdArr":imgIdArr};
                datas = getParamDatas(route,datas);
                if(datas == null){
                    return;
                }
                loadingdate("申请正在提交中！");
                $.ajax({
                    type : 'POST',
                    dataType : 'json',
                    contentType: "application/json;charset=utf-8",
                    url : '/localQuickPurchase/afterSales/insert',
                    data :JSON.stringify(datas),
                    async : true,//异步请求
                    success : function(data){
                        clearLoading();
                        if (data.code == 200) {
                            $(".ex_number").addClass("addDisplay");
                            var after = data.data;
                            if(true == data.equipmentData){
                                hui.alert(data.message,"确定",function(){
                                    cobakc(after)
                                });
                                return;
                            }else{
                                hui.alert(data.message,"确定",function(){
                                    cobakc(after)
                                });
                                return;
                            }
                        } else {
                            hui.alert(data.message);
                        }
                    },
                    error : function(error){
                        hui.alert(data.message);
                    }
                });
            } else {
                hui.alert("快递单号只能输入数字");
            }
        } else {
            hui.alert("请提供返货的快递单号！！");
        }
    } else {
        hui.alert("售后理由不能为空！！");
    }
    /*}else{
        hui.iconToast("输入快递单号！", 'error');
    }*/
    /*} else {
        var datas = {"seq":seq,"orderno":orderno,"afterOrderno":afterOrderno,"afterType":saleType,"afterState":afterState,"afterWhy":afterWhy,"afterReason":afterReason,"supplierSeq":supplierSeq};
        $.ajax({
            type : 'POST',
            dataType : 'json',
            contentType: "application/json;charset=utf-8",
            url : '/localQuickPurchase/afterSales/insert',
            data :JSON.stringify(datas),
            success : function(data){
                var after = data.data;
                if (after != null && after != "") {
                    hui.iconToast(data.message, 'success');
                    setTimeout(function(){
                        window.location.href = "/localQuickPurchase/distributionVA/order/index?i=4";
                    },500);
                } else {
                    hui.iconToast(error.message, 'error');
                }
            },
            error : function(error){
                hui.iconToast(error.message, 'error');
            }
        });
    }
}*/
    /*var datas = {"seq":seq,"orderno":orderno,"afterType":saleType,"afterState":afterState,"afterWhy":afterWhy,"afterReason":afterReason,"supplierSeq":supplierSeq};
    $.ajax({
        type : 'POST',
        dataType : 'json',
        contentType: "application/json;charset=utf-8",
        url : '/localQuickPurchase/afterSales/insert',
        data :JSON.stringify(datas),
        success : function(data){
            var after = data.data;
            if (after != null && after != "") {
                hui.iconToast(data.message, 'success');
                window.location.href = "/localQuickPurchase/distributionVA/order/index?i=4";
            } else {
                hui.iconToast(error.message, 'error');
            }
        },
        error : function(error){
            hui.iconToast(error.message, 'error');
        }
    });*/
    /*
    } else {
        hui.iconToast("支付功能暂未开放！", 'error');
    }*/
});
/*检验纯数字*/
function checkNum(obj){
    var reg = new RegExp("^[0-9]*$");
    //var obj = document.getElementById("orderno");
    if(!reg.test(obj)){
        return false;
    }
    return true;
}
function cobakc(after){
    if (after != null && after != "") {
        setTimeout(function(){
            window.location.href = "/localQuickPurchase/distributionVA/order/index?tabNum=4";
        },1000);
    } else {
        setTimeout(function(){
            window.location.href = "/localQuickPurchase/distributionVA/order/index?tabNum=3";
        },1000);
    }
}
/*去除空格*/
function Trim(str,is_global){
    var result;
    result = str.replace(/(^\s+)|(\s+$)/g,"");
    if(is_global.toLowerCase()=="g"){
        result = result.replace(/\s/g,"");
    }
    return result;
}