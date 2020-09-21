var comeFrom = getQueryString("comeFrom");
var indexUrl = '/localQuickPurchase/distributionVA/index';
if(comeFrom != null && comeFrom != ""){
    indexUrl +='?comeFrom='+comeFrom;
    //单次回话有效
    setCookie("comeFrom",comeFrom,null);
}
//跳转商品详情
function goodsDetail(goodsId){
    visit(comeFrom,"点击商品");

    var url = '/localQuickPurchase/distributionVA/goodsDetail/'+goodsId+'/0/'+seq;
    location.href = url;
}
function goIndex(){
    visit(comeFrom,"点击进用商城首页");
    location.href = indexUrl;
}


//页面加载的时候调一次
visit(comeFrom,"访问");



//添加访问量
function addVisit(key,hashKey) {
    $.ajax({
        type: 'get',
        dataType: 'json',
        async: false,
        url: "/localQuickPurchase/visitCount/add",
        data: {
            "key" : key,
            "hashKey" : hashKey
        },
        async: false,
        success: function (data) {
            console.info(data);
        },
        error: function (error) {
            console.info(error);
        }
    });
}

function visit(comeFrom,name){
    if(comeFrom == ""){
        comeFrom = "fenxiao";
    }
    addVisit(comeFrom,name);
}
/*
$(function(){
    try{
        var cnzz_protocol = (("https:" == document.location.protocol) ? " https://" : " http://");
        $("body").append(unescape("%3Cspan style='display:none;'  id='cnzz_stat_icon_1275444738'%3E%3C/span%3E%3Cscript src='" + cnzz_protocol + "s5.cnzz.com/z_stat.php%3Fid%3D1275444738' type='text/javascript'%3E%3C/script%3E"));
    }catch (e) {
    }
})*/
