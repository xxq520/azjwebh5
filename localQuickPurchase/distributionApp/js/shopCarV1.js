var totalAmount = 0.00;//总金额
var countGoodsNum = 0;//商品总件数
//alert(distributorType);
var idAndSeqs = new Array();
//消费者2
var shareSeqCK = getCookie("shareSeq");
var userName = getUserName();
//按商品名称统计购物车个数
var goodsLocalItemsArr = new Array();
var goodsLocalItems;
var Coums=shopgd(seq);
console.info("Coums==="+Coums+"seq==="+seq);
var hrefUrl = "/localQuickPurchase/distributionVA/shopCar/noShopping";


//获取优惠券图标
function getYhqHtm(data){
    var goodsYhq = data.yHQ;
    var type=getRoleType();
    var yhqHtml = "";
    if (goodsYhq) {
        if (type==1||type==2||!type) {
            yhqHtml+='<img style="height: 25px;" class="haha"  src="/localQuickPurchase/coupons/images/home_icon_label_2@2x.png" onclick=jumpCoupon()>'
        }else if ((type==3 ||type==4)&& Coums<=100) {
            yhqHtml+='<img style="height: 25px;" class="haha"  src="/localQuickPurchase/coupons/images/home_icon_label_2@2x.png" onclick=jumpCoupon()>'
        }else {
            yhqHtml+=""
        }
    } else {yhqHtml+=""}
    return yhqHtml;
}
//返回个人中心页面
function backPersonalCenter(){
    //window.location.href=_content+"/distributionVA/personal/index";
}

//页面根目录
var path = "/localQuickPurchase";


/**购物车 无物品时下拉 刷新 效果  start ...**/
var xl = '<div class="shoppingRefresh"><div class="shoppingContent-img"><img src="/localQuickPurchase/distributionApp/images/shuaxin.gif" alt=""></div><div class="partake-text"><div>分 享 赚 钱， 自 购 省 钱</div><div class="shuanxziti">松开刷新</div></div></div>';

/**购物车 无物品时下拉 刷新 效果  end ...**/

/**
 * 购物车没有物品时显示的文案
 *
 */
function removeCalcContent(){

    var calcObj = $(".hui-wrap").find(".calc-box");
    calcObj.css("display","none");
    /*if(calcObj!=null && calcObj.length > 0){
        calcObj.remove();
    }*/

}
function addCalcContent(){
    var calcObj = $(".hui-wrap").find(".calc-box");
    calcObj.css("display","block");
}

function addCalcContent2(){
    removeCalcContent();
    var calc = '<div class="calc-box">\n' +
        '    <div class="pull-left">\n' +
        '        <div id="sel_all" class="sel-all"></div>\n' +
        '        <span>全选</span>\n' +
        '    </div>\n' +
        '    <div class="pull-right">\n' +
        '        <div class="heji">\n' +
        '            合计：\n' +
        '            <div class="hejishu txt-red"><span class="rmb">￥</span><span class="heji-num">0.00</span></div>\n' +
        '        </div>\n' +
        '        <div class="edit-btns">\n' +
        '            <div id="to_pay" class="to-pay">去结算</div>\n' +
        '            <!-- <div id="btn_del" class="btn-del">确认删除</div> -->\n' +
        '        </div>\n' +
        '    </div>\n' +
        '</div>';
    $("#hui-footer").before(calc);
}

function noShoppingContent(){
    removeNoShoppingContent();
    //文案1
    var nsc = '<div class="shoppingContent-img2"><img src="/localQuickPurchase/distributionApp/images/kong.png"></div>\n' +
        '        <div class="shoppingContent-text">\n' +
        '            <span>购 物 车 是 空 的 ~</span>\n' +
        '        </div>';
    $(".hui-list").before(nsc);
}

function removeNoShoppingContent(){
    $(".shoppingContent-img2").remove();
    $(".shoppingContent-text").remove();
}

//初始化查询购物车asd
function initFindCart() {
    setCookie("idAndSeqs", "", 1);
    $.ajax({
        type : "post", // 定义提交的类型
        url : "/localQuickPurchase/dCart/findCartV1",// 请求的地址
        dataType : "json", // 设置返回值得类型
        data : {
            "userName" : userName,
            "comefrom" : 1// 1 : 店下详情的购物车, 2 : 单独页面的购物车
        },
        async : false, // 是否异步请求，false为同步
        success : function(data) { // 成功返回值执行函数
            if (data.code == 200) {
                console.info(data);
                /*var shopCarts = data.data.localCart.shopCarts;
                        var goodsPiece = data.data.goodsPiece;//
                        var shopAmount = data.data.totalAmount;//整个购物车的总额
                        var userName = data.data.localCart.userName;*/
                totalAmount = data.data.totalAmount;
                countGoodsNum = data.data.countGoodsNum;
                //alert(totalAmount);
                var localItems = data.data.localItems;
                /**
                 * 购物车用户体验业务升级
                 * 1.当购物车没有物品时，直接显示相关文案,不再跳转。
                 */
                if(localItems == null || localItems.length< 1){
                    // window.location.href=hrefUrl;
                    noShoppingContent();
                    removeCalcContent();
                }else{
                    removeNoShoppingContent()
                    addCalcContent();
                    /*var gliObj = $("goods-list-item");
                    if(gliObj.length <=0){
                        removeNoShoppingContent();
                    }*/

                    // goodsLocalItems = localItems.length;
                    // var number = document.getElementById("number");
                    // if(goodsLocalItems > 0){
                    //     setCookie("goodsLocalItems",goodsLocalItems);
                    //     number.innerHTML = goodsLocalItems;
                    // }else{
                    //     number.remove();
                    // }

                    //$("#good_num").html("(" + goodsPiece + ")");
                    $("#good_num").html("(" + countGoodsNum + ")");
                    //$(".heji-num").html(0);remove

                    /*if (localItems == null || localItems.length == 0) {
                            continue;
                        }*/

                    /*for (var i = 0; i < shopCarts.length; i++) {
                            var localItems = shopCarts[i].localItems;
                            var shopName = shopCarts[i].shopName;

                            shopName = shopCarts[i].shopName;

                            var supplierSeq = shopCarts[i].supplierSeq;
                            var shopSeq = shopCarts[i].shopSeq;*/
                    /**
                     * 购物车的商品进行区分
                     * 1.店铺（品牌）
                     * 2.爱之家自营
                     */

                    var data = data.data;
                    var bpArray = data.brandProducts;
                    var switchBool = data.switchBool;
                    for(var z = 0;z<bpArray.length;z++){
                        // var suppSeq = data.supplierList[z];
                        var shopDistinctionObj  = bpArray[z];

                        var bpShow ='';//显示品牌或者店家
                        if(shopDistinctionObj!=null){
                            localItems = shopDistinctionObj.localItemList;
                            var sdSeq = shopDistinctionObj.sdSeq;
                            bpShow = '<div class="shqshopping" seq="'+sdSeq+'" state="0" >\n' +
                                        '<div class="btn-check-shop" state="0"></div>\n' +
                                        '<div class="spn">\n' +
                                        '<div class="spa_img">\n';
                                if(sdSeq!=110){
                                    //品牌
                                    bpShow +='<img src="/localQuickPurchase/distributionApp/images/icon_1.png" alt="">\n';
                                    bpShow += '</div>\n' ;
                                }else{
                                    bpShow += '<img src="/localQuickPurchase/distributionApp/images/icon_logo.png" alt="">';
                                    bpShow += '</div>\n' ;

                                }
                                if(shopDistinctionObj.shopSupplierName!='爱之家自营'){
                                    bpShow +=  '<a href="'+shopDistinctionObj.shopUrlName+'"><div class="shqtext">'+shopDistinctionObj.shopSupplierName+'</div> </a>' ;
                                }else{
                                    bpShow +=  '<div class="shqtext">'+shopDistinctionObj.shopSupplierName+'</div>' ;
                                }
                                bpShow +=  '<div class="more">\n';

                            //店铺链接
                            if(sdSeq != 110){
                                //品牌
                                if("爱之家自营" != shopDistinctionObj.shopSupplierName){
                                    bpShow += '<a class="shopList" href="'+shopDistinctionObj.shopUrlName+'"></a>';
                                }
                            }

                            bpShow +=  '                        </div>\n' ;
                            bpShow +=  '                </div>\n' ;
                            if (switchBool || switchBool == "true"){
                                bpShow += '<div data-codeList='+shopDistinctionObj.codeList+' data-supplierSeqList='+shopDistinctionObj.supplierSeqList+' class="coupon" style="margin-left: 2.8rem;">优惠劵</div>'
                            }
                            bpShow +=  '            </div>';

                            if(localItems != null  && localItems.length  != 0){
                                $(".goods-list").append(bpShow);
                            }
                            // $(".goods-list").before(bpShow);
                    //购物车循环开始
                    for (var y = 0; y <= localItems.length-1; y++) {
                        goodsName = localItems[y].goodsName;
                        distributionPrice = localItems[y].distributionPrice;
                        /*var distributionPrice = localItems[y].distributionPrice;//分销价
                                var platformPrice = localItems[y].platformPrice;//市场价
                                //如果分销价是空的话就计算
                                if(distributionPrice == null || distributionPrice == 0) {
                                    var costPrice= parseFloat(platformPrice*1.15).toFixed(2);
                                    distributionPrice = parseFloat(costPrice*1.2).toFixed(2);
                                }*/
                        quantity = parseInt(localItems[y].quantity);
                        goodsAmount = localItems[y].goodsAmount;
                        var goodsId = localItems[y].goodsId;
                        //将商品的goodsId存放到数组中
                        if(!ifArray(goodsLocalItemsArr,goodsId)){
                            goodsLocalItemsArr.push(goodsId);
                        }
                        //alert(goodsLocalItemsArr.lenght);
                        var shopSeq = localItems[y].shopSeq;
                        var supplierSeq = localItems[y].supplierSeq;
                        imgUrl = localItems[y].imgUrl;
                        logisticsPrice = localItems[y].logisticsPrice;//运费
                        salesVolume = localItems[y].salesVolume;//起卖量
                        var goodsSku = localItems[y].goodsSku;//商品sku
                        var goodsSpec = localItems[y].goodsSpec;//商品规格参数

                        var goodsCode = localItems[y].goodsCode;//商品Code 唯一
                        var factoryPrice = localItems[y].factoryPrice;//出厂价
                        var cost_unit_price = localItems[y].cost_unit_price;//出厂单价
                        var primitiveFactoryPrice = localItems[y].primitiveFactoryPrice;//原始出厂价
                        var companyName = localItems[y].companyName;//
                        var isActivityGoods = localItems[y].isActivityGoods;//标识是什么商品 --- "1":秒杀商品 ; "0":普通商品
                        var seckillPrice = localItems[y].seckillPrice;//秒杀价格
                        var activityState = localItems[y].activityState;//秒杀商品的上下架状态		3：上架 ; 4:下架
                        var ifBrandProduct = localItems[y].ifBrandProduct;
                        var ifWYFcommodity = localItems[y].ifWYFcommodity;

                        console.info("goodsSku :" +goodsSku);
                        console.info("goodsSpec :" +goodsSpec);
                        console.info("isActivityGoods :" +isActivityGoods);
                        if(salesVolume == null || salesVolume == 0){
                            salesVolume = 1;
                        }
                        // 购物车店铺下的商品
                        var items = '';
                        //判断商品是否下架 商品状态: 0 正常, 1 不存在或者下架, 2 库存不足
                        var goodsStatus = localItems[y].goodsStatus;
                        if (isActivityGoods != null && isActivityGoods == "1") {
                            if (activityState != null && activityState == 4) {
                                items += '<li class="goods-list-item useless '+sdSeq+'">';
                            } else {
                                items += '<li class="goods-list-item '+sdSeq+'">';
                            }
                        } else {
                            if(goodsStatus == 1 ){
                                items += '<li class="goods-list-item useless '+sdSeq+'">';
                            }else{
                                items += '<li class="goods-list-item '+sdSeq+'">';
                            }
                        }

                        items += '<div class="check-box" state="0" cbseq="'+sdSeq+'" data-goodsAmount="'+goodsAmount+'" >';
                        items += '<div class="btn-check"></div></div>';
                        items += '<div class="good-content" state="0">';
                        items += '<div class="good-pic" goodsid='+goodsId+' num='+isActivityGoods+'>';
                        items += '<img src="' + imgUrl+ '" alt="" /></div>';
                        items += '<div class="good-info">';
                        items += '<h4 class="good-name overflow">' + goodsName+ '</h4>';
                        /*items += '<div class="good-des">' + shopName+ '</div>';goodsPrice="'+goodsPirce+'"*/
                        items +='<div class="spec">';
                        // items +='<span style="float: left; width: 30%">规格：</span>';
                        items +='<span style="width: 30%">规格：</span>';
                        // items +='<span style="float: left;">';
                        items +='<span>'
                        items +='<span>'+(goodsSpec==null?"暂无规格信息":goodsSpec)+'</span>';
                        items +='</span>';
                        /*if(ifBrandProduct == 1) {
                            items += '<span class="brandSquareProductSpan">品牌商品</span>';
                        }*/
                        items +='</div>';
                        /*items += '<div class="unit-price">';
                        items += '<span style="float: left;">单价：</span>';
                        items += '<span style="float: left;">';
                        if (isActivityGoods != null && isActivityGoods == "1") {//秒杀价格
                            items += '￥<span>'+parseFloat(seckillPrice).toFixed(2)+'</span>';
                        } else {//分销价格
                            items += '￥<span>'+parseFloat(distributionPrice).toFixed(2)+'</span>';
                        }

                        items += '</span>';
                        items += '<span style="float: left;margin-left:15px">';
                        items += '起卖量 :<span class="salesVolume">'+salesVolume+'</span>';
                        items += '</span>';
                        items += '</div>';*/

                        /**good-price-info开始**/

                        items +='<div class="good-price-info">';
                        items +='<div class="good-num-handle" >';
                        // items +='<div class="good-num-handle" style="float: none;  width: 100%;">';
                        items +='<span style="width: 30%">单价：</span>';
                        if (isActivityGoods != null && isActivityGoods == "1") {//秒杀价格
                            // items += '￥<span>'+parseFloat(seckillPrice).toFixed(2)+'</span>';
                            items +='<span>￥<span>'+parseFloat(seckillPrice).toFixed(2)+'</span></span>';
                        } else {//分销价格
                            items +='<span>￥<span>'+parseFloat(distributionPrice).toFixed(2)+'</span></span>';
                        }


                        if (isActivityGoods != null && isActivityGoods == "1") {//秒杀价格
                            items += '<div class="good-amount-box" ><span class="btn-muins" price = "'+seckillPrice+'">-</span>';
                            // items += '<div class="good-amount-box" style=" width: 51%;" ><span class="btn-muins" price = "'+seckillPrice+'">-</span>';
                        } else {//分销价格
                            items += '<div class="good-amount-box" ><span class="btn-muins" price = "'+distributionPrice+'">-</span>';
                            // items += '<div class="good-amount-box" style=" width: 51%;" ><span class="btn-muins" price = "'+distributionPrice+'">-</span>';
                        }
                        items += '<div class="amount-num">';
                        items += '<input type="text" name="goodnum" class="amount-inp" readonly="readonly" maxlength="3" value="'+ quantity + '"/></div>';//readonly="readonly"
                        items += '<input type="hidden" name="quantity" class="quantity" value="'+ quantity + '">';// 数据库查出的初始值
                        items += '<input type="hidden" name="goodsId" class="goodsId" value="'+ goodsId + '">';
                        items += '<input type="hidden" name="logisticsPrice" class="logisticsPrice" value="'+ logisticsPrice + '">';
                        items += '<input type="hidden" name="shopSeq" class="shopSeq" value="'+ shopSeq + '">';
                        items += '<input type="hidden" name="userName" class="userName" value="'+ userName + '">';
                        items += '<input type="hidden" name="supplierSeq" class="supplierSeq" value="'+ supplierSeq + '">';// 供应商seq
                        items += '<input type="hidden" name="totalAmont" class="totalAmont" value="'+ totalAmount +'">';// 总金额
                        items += '<input type="hidden" name="goodsSku" class="goodsSku" value="'+ goodsSku +'">';// sku
                        items += '<input type="hidden" name="goodsSpec" class="goodsSpec" value="'+ goodsSpec +'">';//规格
                        items += '<input type="hidden" name="salesVolume" class="salesVolume" value="'+ salesVolume +'">';//起卖量

                        items += '<input type="hidden" name="goodsCode" class="goodsCode" value="'+ goodsCode +'">';//goodsCode
                        items += '<input type="hidden" name="factoryPrice" class="factoryPrice" value="'+ factoryPrice +'">';///出厂价
                        items += '<input type="hidden" name="cost_unit_price" class="cost_unit_price" value="'+ cost_unit_price +'">';//出厂单价
                        items += '<input type="hidden" name="primitiveFactoryPrice" class="primitiveFactoryPrice" value="'+ primitiveFactoryPrice +'">';//原始出厂价
                        items += '<input type="hidden" name="companyName" class="companyName" value="'+ companyName +'">';//供应商名称
                        items += '<input type="hidden" name="isActivityGoods" class="isActivityGoods" value="'+ isActivityGoods +'">';//供应商名称
                        items += '<input type="hidden" name="seckillPrice" class="seckillPrice" value="'+ seckillPrice +'">';//供应商名称
                        items += '<input type="hidden" name="activityState" class="activityState" value="'+ activityState +'">';//供应商名称
                        items += '<input type="hidden" name="ifWYFcommodity" class="ifWYFcommodity" value="'+ ifWYFcommodity +'">';//供应商名称
                        if(ifBrandProduct == null || ifBrandProduct == undefined){
                            items += '<input type="hidden" name="ifBrandProduct" class="ifBrandProduct" value="'+ 0 +'">';//品牌商品标识
                        }else{
                            items += '<input type="hidden" name="ifBrandProduct" class="ifBrandProduct" value="'+ ifBrandProduct +'">';//品牌商品标识
                        }


                        /*items += '<input type="hidden" class="shopAmount" value="'+ shopAmount + '">';// 整个购物车总金额
                         */
                        if (isActivityGoods != null && isActivityGoods == "1") {//秒杀价格
                            items += '<span class="btn-add" price = "'+seckillPrice+'" >+</span></div></div>';
                        } else {//分销价格
                            items += '<span class="btn-add" price = "'+distributionPrice+'" >+</span></div></div>';
                        }

                        items +='</div>';
                        /**结束**/

                        items += '<div class="good-price color_red" style=" text-align: right; float: none;  width: 100%;">';
                        if (isActivityGoods != null && isActivityGoods == "1") {//秒杀价格
                            items += '<span class="rmb">￥</span><span class="price-num" name="gprice">'+  parseFloat(seckillPrice*quantity).toFixed(2) + '</span><span>元</span></div></div></div></div></li>';// onclick="addCart('+goodsId+','+shopSeq+')"
                        } else {//分销价格
                            items += '<span class="rmb">￥</span><span class="price-num" name="gprice">'+  parseFloat(distributionPrice*quantity).toFixed(2) + '</span><span>元</span></div></div></div></div></li>';// onclick="addCart('+goodsId+','+shopSeq+')"
                        }

                        /**good-price-info结束**/
                        $(".goods-list").append(items);
                    }
                        }
                    //购物车循环结束
                    }
                }
                countSelectGoods();
                //}
            } else {
                //alert("查询失败!");
            }
        }
    });
}
function countSelectGoods(){
    var $selectGoods  = $(".goods-list-item.checked");
    var goodsNum = 0;
    var  goodsItems = $(".goods-list-item").length;
    if(goodsItems == 0){
        //如果没有商品隐藏去结算
        $(".calc-box").hide();
    }else{
        $(".calc-box").show();
    }
    // 商品总数
    /*$selectGoods.each(function(){
        var goodsNumTmpe =  $(this).find("input[name='goodnum']").val();
        goodsNum += parseInt(goodsNumTmpe);
    })*/
    $("#to_pay").html("去结算("+$selectGoods.length+")");
}
//购物车输入数量校验为
$('.amount-inp').keyup(function(){
    var c=$(this);
    console.info(c);
    if(/[^\d]/.test(c.val())){//替换非数字字符
        var temp_amount=c.val().replace(/[^\d]/g,'');
        $(this).val(temp_amount);
    }
    var count = $(this).val();
    if(count==""){

    }else if(count==0){
        $(this).val(salesVolume);
    }
});
/*失去焦点事件数量不能为空*///购物车输入数量校验
$('.body').blur(function(){
    var count = $(this).val();
    if(count==""){
        $(this).val(1);
    }
});

//点击结算
$("body").on('click', '#to_pay', function() {
    var list;
    var flagUseless = false;
    //var idAndSeqs =[];
    var idAndSeqs =new Array();
    list = $(".checked");// 所有选择的商品
    //限制品牌广场与普通商品和合并支付标识
    var ifBrandProductMark = 0;
    var normalProductMark = 0;
    $(".goods-list-item.checked").each(function() {
        console.info($(this));
        if($(this).hasClass("useless")){
            var goodsName_useless = $(this).children(".good-content").children(".good-info").children(".good-name").html();
            hui.alert("["+goodsName_useless+"]已下架,请先移除!");
            flagUseless = true;
            return;
        }else{
            var data = {};
            var shopSeqD = $(this).children(".good-content")
                .children(".good-info").children(
                    ".good-price-info").children(
                    ".good-num-handle").children(
                    ".good-amount-box").find(
                    "input[name='shopSeq']").val();
            var goodsIdD = $(this).children(".good-content")
                .children(".good-info").children(
                    ".good-price-info").children(
                    ".good-num-handle").children(
                    ".good-amount-box").find(
                    "input[name='goodsId']").val();
            var supplierSeqD = $(this).children(".good-content")
                .children(".good-info").children(
                    ".good-price-info").children(
                    ".good-num-handle").children(
                    ".good-amount-box").find(
                    "input[name='supplierSeq']").val();
            var userNameD = $(this).children(".good-content")
                .children(".good-info").children(
                    ".good-price-info").children(
                    ".good-num-handle").children(
                    ".good-amount-box").find(
                    "input[name='userName']").val();
            var goodsSku = $(this).children(".good-content")
                .children(".good-info").children(
                    ".good-price-info").children(
                    ".good-num-handle").children(
                    ".good-amount-box").find(
                    "input[name='goodsSku']").val();

            var goodsSpec = $(this).children(".good-content")
                .children(".good-info")
                .children(".good-price-info")
                .children(".good-num-handle")
                .children(".good-amount-box")
                .find("input[name='goodsSpec']").val();
            var logisticsPrice = $(this).children(".good-content")
                .children(".good-info").children(
                    ".good-price-info").children(
                    ".good-num-handle").children(
                    ".good-amount-box").find(
                    "input[name='logisticsPrice']").val();

            var goodsCode = $(this).children(".good-content")
                .children(".good-info").children(
                    ".good-price-info").children(
                    ".good-num-handle").children(
                    ".good-amount-box").find(
                    "input[name='goodsCode']").val();

            var factoryPrice = $(this).children(".good-content")
                .children(".good-info").children(
                    ".good-price-info").children(
                    ".good-num-handle").children(
                    ".good-amount-box").find(
                    "input[name='factoryPrice']").val();

            var cost_unit_price = $(this).children(".good-content")
                .children(".good-info").children(
                    ".good-price-info").children(
                    ".good-num-handle").children(
                    ".good-amount-box").find(
                    "input[name='cost_unit_price']").val();

            var primitiveFactoryPrice = $(this).children(".good-content")
                .children(".good-info").children(
                    ".good-price-info").children(
                    ".good-num-handle").children(
                    ".good-amount-box").find(
                    "input[name='primitiveFactoryPrice']").val();

            var companyName = $(this).children(".good-content")
                .children(".good-info").children(
                    ".good-price-info").children(
                    ".good-num-handle").children(
                    ".good-amount-box").find(
                    "input[name='companyName']").val();

            var quantity = $(this).children(".good-content")
                .children(".good-info").children(
                    ".good-price-info").children(
                    ".good-num-handle").children(
                    ".good-amount-box").find(
                    "input[name='quantity']").val();

            var isActivityGoods = $(this).children(".good-content")
                .children(".good-info").children(
                    ".good-price-info").children(
                    ".good-num-handle").children(
                    ".good-amount-box").find(
                    "input[name='isActivityGoods']").val();

            var seckillPrice = $(this).children(".good-content")
                .children(".good-info").children(
                    ".good-price-info").children(
                    ".good-num-handle").children(
                    ".good-amount-box").find(
                    "input[name='seckillPrice']").val();

            var activityState = $(this).children(".good-content")
                .children(".good-info").children(
                    ".good-price-info").children(
                    ".good-num-handle").children(
                    ".good-amount-box").find(
                    "input[name='activityState']").val();

            //百业慧盟标识
            var ifWYFcommodity = $(this).children(".good-content")
                .children(".good-info").children(
                    ".good-price-info").children(
                    ".good-num-handle").children(
                    ".good-amount-box").find(
                    "input[name='ifWYFcommodity']").val();

            var ifBrandProductD = $(this).children(".good-content")
                .children(".good-info").children(
                    ".good-price-info").children(
                    ".good-num-handle").children(
                    ".good-amount-box").find(
                    "input[name='ifBrandProduct']").val();

            //限制品牌广场与普通商品和合并支付
            if(ifBrandProductD == 1){
                ifBrandProductMark = 1;
            }else{
                normalProductMark = 1;
            }

//				console.info("======>" + goodsCode + ":" + factoryPrice + ":"  + cost_unit_price + ":" + primitiveFactoryPrice+":"+companyName);

            data.shopSeq=shopSeqD;
            data.goodsId=goodsIdD;
            data.userName=userNameD;
            data.supplierSeq=supplierSeqD;
            data.logisticsPrice=logisticsPrice;
            data.goodsSku=goodsSku;
            data.goodsSpec=goodsSpec;
            data.quantity=quantity;

            data.goodsCode = goodsCode
            data.factoryPrice = factoryPrice;
            data.cost_unit_price = cost_unit_price;
            data.primitiveFactoryPrice = primitiveFactoryPrice;
            data.companyName = companyName;

            if(shareSeqCK != null && shareSeqCK != "") {
                data.shareSeq=shareSeqCK;
            }
            data.isActivityGoods = isActivityGoods;
            data.seckillPrice = seckillPrice;
            data.activityState = activityState;
            data.ifWYFcommodity = ifWYFcommodity;


            console.info(goodsSku);
            console.info(goodsSpec);
            idAndSeqs.push(data);
        }
    });
    // typeof(ifBrandProductMark);
    // typeof(normalProductMark);
    if (idAndSeqs == null || idAndSeqs.length == 0) {
        hui.alert("请先勾选要购买商品!");
        return;
    }
    if(ifBrandProductMark == normalProductMark){
        hui.alert("系统暂不支持品牌商品与分销商品合并支付,请单独支付,为您带来的不便深感歉意");
        return;
    }
    if(!flagUseless){

        //setCookie("idAndSeqs", JSON.stringify(idAndSeqs));
        //console.info(getCookie("idAndSeqs"));
        selectParam(idAndSeqs);
        console.log(idAndSeqs);
    }


});

//讲所选的商品参数传到后台
function selectParam(idAndSeqs) {
    $.ajax({
        type : "post",// 定义提交的类型
        url : "/localQuickPurchase/dCart/selectParam",
        //traditional :true,
        contentType : "application/json;charset=utf-8",
        dataType : "json",// 设置返回值得类型
        data : JSON.stringify(idAndSeqs),
        async : false,// 是否异步请求，false为同步
        success : function(data) {// 成功返回值执行函数
            if (data.code == 200) {
                window.location.href="/localQuickPurchase/distributionVA/submitOrder";
            } else if(data.code == 405){
                hui.alert(data.message);
            }else{
                hui.toast("跳转失败,系统异常请稍后再试!");
                window.location.href="/localQuickPurchase/distributionVA/submitOrder";
            }
        }
    });
}

//清空购物车
function emptyCart(){
    hui.confirm('确定清空购物车商品？', ['返回','确认'], function(){
        $.ajax({
            type : "post",// 定义提交的类型
            url : "/localQuickPurchase/dCart/emptyCart",
            //traditional :true,
            //contentType : "application/json;charset=utf-8",
            dataType : "json",// 设置返回值得类型
            data : {"userName" : userName},
            async : false,// 是否异步请求，false为同步
            success : function(data) {// 成功返回值执行函数
                if (data.code == 200) {
                    $(".goods-list").html("");
                    $("#sel_all").removeClass("active")
                    initFindCart();// 重新加载购物车
                } else {
                    hui.toast("操作失败!");
                }
            }
        });
    });

}
//删除购物车商品
function deleteGoods(){
    var idAndSeqs =new Array();
    var list = $(".goods-list-item.checked");// 所有选择的商品
    if (list.length == 0) {
        hui.toast("请选择商品!");
        return;
    }else{
        hui.confirm('确定删除选中的商品？', ['返回','确认'], function(){
            $(".goods-list-item.checked").each(// 所有选择的商品
                function() {
                    var shopSeqD = $(this).children(".good-content")
                        .children(".good-info").children(
                            ".good-price-info").children(
                            ".good-num-handle").children(
                            ".good-amount-box").find(
                            "input[name='shopSeq']").val();
                    /*var shopSeqD = $(this).children(".good-content")
                        .children(".good-info")*/

                    var goodsIdD = $(this).children(".good-content")
                        .children(".good-info").children(
                            ".good-price-info").children(
                            ".good-num-handle").children(
                            ".good-amount-box").find(
                            "input[name='goodsId']").val();
                    var supplierSeqD = $(this).children(".good-content")
                        .children(".good-info")
                        .children(".good-price-info")
                        .children(".good-num-handle")
                        .children(".good-amount-box")
                        .find("input[name='supplierSeq']").val();

                    var userNameD = $(this).children(".good-content")
                        .children(".good-info").children(
                            ".good-price-info").children(
                            ".good-num-handle").children(
                            ".good-amount-box").find(
                            "input[name='userName']").val();
                    var goodsSku = $(this).children(".good-content")
                        .children(".good-info").children(
                            ".good-price-info").children(
                            ".good-num-handle").children(
                            ".good-amount-box").find(
                            "input[name='goodsSku']").val();
                    var data = {};
                    data.shopSeq=shopSeqD;
                    data.goodsId=goodsIdD;
                    data.userName=userNameD;
                    data.goodsSku=goodsSku;
                    if(supplierSeqD =="null"){
                        supplierSeqD=0;
                    }
                    data.supplierSeq=supplierSeqD;
                    idAndSeqs.push(data);
                });
            $.ajax({
                type : "post",// 定义提交的类型
                url : "/localQuickPurchase/dCart/deleteGoods",
                traditional :true,
                contentType : "application/json;charset=utf-8",
                dataType : "json",// 设置返回值得类型
                data : JSON.stringify(idAndSeqs),
                async : false,// 是否异步请求，false为同步
                success : function(data) {// 成功返回值执行函数
                    if (data.code == 200) {
//						/window.location.load();
                        $(".goods-list").html("");
                        initFindCart();// 重新加载购物车
                        $(".heji-num").html("0.00");
                        findCheckboxList();
                    } else {
                        hui.toast("操作失败!");
                    }
                }
            });
        });
    }
}

//点击移除购物车商品
$("body").on('click','#btn_del',function() {
    //如果点了全选就清空购物车
    if($("#sel_all").hasClass("active")){
        emptyCart();
    }else{
        deleteGoods();
    }
    /**
     * 1.购物车无物品时，底部 全选按钮状态-> 未选中
     * 					合计->￥0.00 （$(".heji-num").html("0.00")）
     * 					去结算按钮-
     * 					> 未选中状态
     * 					客户图标
     */
    var gliObj = $("goods-list-item");
    if(gliObj.length <=0){
        /*$("#sel_all").removeClass("active");
        $(".heji-num").html("0.00");
        findCheckboxList();
        setBtn();*/
        removeCalcContent();
    }else{
        addCalcContent();
    }

});

//商品数量-1
$(document).on('click','.btn-muins',function() {//alert("111")
    //amount-num
    var quantity = $(this).parent(".good-amount-box").find(
        "input[name='goodnum']").val(); // 当前输入框的数量
    //var salesVolume =  $(this).parents().find(".good-info").contents().find(".salesVolume").html();
    // var salesVolume =  $(this).parent(".good-amount-box").parent(".good-num-handle").parent(".good-price-info").prev(".unit-price").find(".salesVolume").html();
    var salesVolume =  $(this).parent(".good-amount-box").find(".salesVolume").val();

    //console.info(quantity);
    //console.info(salesVolume);
    if (parseInt(quantity) <= parseInt(salesVolume)) {
        // var msg=confirm("如果你真不要我了,可以编辑删除~~");
        /*if(msg==true){
                  $(this).parent(".good-amount-box").parent(".good-num-handle").parent(".good-price-info").parent(".good-info").parent(".good-content").parent(".goods-list-item").addClass("checked");

                          //deleteGoods();
                    }else{
                        $(this).parent(".good-amount-box").parent(".good-num-handle").parent(".good-price-info").parent(".good-info").parent(".good-content").parent(".goods-list-item").removeClass("checked");
                        var goodAmount = parseFloat($(this).parent(".good-amount-box").parent(".good-num-handle").parent(".good-price-info").children(".good-price").children(".price-num").html()).toFixed(2);
                        //console.info(goodAmount);
                        var allAmount =  parseFloat($(".heji-num").html()).toFixed(2);
                        $(".heji-num").html((parseFloat(allAmount)-parseFloat(goodAmount)).toFixed(2));
                    }*/
        hui.alert("购买数量不能低于起卖量!");
        return;
    }else{
        //amount-num
        $(this).parent(".good-amount-box").find("input[name='goodnum']").val(parseInt(quantity)-1);
        var $parent = $(this).parent(".good-amount-box");
        var count = parseInt(quantity)-1;
        $parent.find("input[name='goodnum']").val();

        var danjia = parseFloat($(this).attr("price")).toFixed(2);//单价

        var totalPrice = parseFloat(danjia * count).toFixed(2);//总价

        var $price = $(this).parent(".good-amount-box").parent(".good-num-handle").parent(".good-price-info").find(".good-price .price-num");
        $price.html(totalPrice);
        //ture 为被选中,false先中
        var flg = false;
        flg = $(this).parent(".good-amount-box").parent(".good-num-handle").parent(".good-price-info").parent(".good-info").parent(".good-content").parent(".goods-list-item").hasClass("checked");

        //	if(){}

        /*var price = $parent.find("price-num']").val();
                var totalPrice = parseInt(price);//获取当前数量的总价
                var danjia = $parent.attr("goodsPrice");//获取当前商品的单价
                var pri = totalPrice - danjia;//当前总价格
                $parent.find("input[name='price-num']").val(pri);*/

    }
    /*var shopSeq = $(this).parent(".good-amount-box").find(
        "input[name='shopSeq']").val();
    var goodsId = $(this).parent(".good-amount-box").find(
        "input[name='goodsId']").val();
    var userName = $(this).parent(".good-amount-box").find(
        "input[name='userName']").val();
    var supplierSeq = $(this).parent(".good-amount-box").find(
        "input[name='supplierSeq']").val();
    var goodsSku = $(this).parent(".good-amount-box").find(
        "input[name='goodsSku']").val();
    var goodsSpec = $(this).parent(".good-amount-box").find(
        "input[name='goodsSpec']").val();
    var seckillPrice = $(this).parent(".good-amount-box").find(
        "input[name='seckillPrice']").val();
    var isActivityGoods = $(this).parent(".good-amount-box").find(
        "input[name='isActivityGoods']").val();
    var ifWYFcommodity = $(this).parent(".good-amount-box").find(
        "input[name='ifWYFcommodity']").val();
    var ifBrandProduct = $(this).parent(".good-amount-box").find(
        "input[name='ifBrandProduct']").val();*/
    var $gab = $(this).parent(".good-amount-box");
    var shopSeq = $gab.find(
        "input[name='shopSeq']").val();
    var goodsId = $gab.find(
        "input[name='goodsId']").val();
    var userName = $gab.find(
        "input[name='userName']").val();
    var supplierSeq = $gab.find(
        "input[name='supplierSeq']").val();
    var goodsSku = $gab.find(
        "input[name='goodsSku']").val();
    var goodsSpec = $gab.find(
        "input[name='goodsSpec']").val();
    var seckillPrice = $gab.find(
        "input[name='seckillPrice']").val();
    var isActivityGoods = $gab.find(
        "input[name='isActivityGoods']").val();
    var ifWYFcommodity = $gab.find(
        "input[name='ifWYFcommodity']").val();
    var ifBrandProduct = $gab.find(
        "input[name='ifBrandProduct']").val();
    console.info("goodsSku :" + goodsSku);
    $.ajax({
        type : "post",// 定义提交的类型
        url : "/localQuickPurchase/dCart/sub",
        dataType : "json",// 设置返回值得类型
        data : {
            "userName" : userName,
            "goodsId" : goodsId,
            "shopSeq" : parseInt(shopSeq),
            "supplierSeq" : parseInt(supplierSeq),
            "sku" : goodsSku,
            "goodsSpec" : goodsSpec,
            "isActivityGoods" : isActivityGoods,
            "ifWYFcommodity" : ifWYFcommodity,
            "ifBrandProduct" : parseInt(ifBrandProduct)
        },
        async : false,// 是否异步请求，false为同步
        success : function(data) {// 成功返回值执行函数
            if (data.code == 200) {
                --countGoodsNum;
                console.log("countGoodsNum: " + countGoodsNum);
                $("#good_num").html("(" + countGoodsNum + ")");
                var amount = parseFloat($(".heji-num").html()).toFixed(2);
                if(flg){
                    $(".heji-num").html(parseFloat(amount - danjia).toFixed(2));
                }
                //alert(amount);
                //window.location.reload();
            } else {
                //hui.alert("操作失败!");
            }
        }

    });
    countSelectGoods();
})

//商品数量+1
$(document).on('click','.btn-add',function() {
    var _this = this;
    //goodnum
    var quantity = $(this).parent(".good-amount-box").find(
        "input[name='goodnum']").val(); // 当前输入框的数量
    if (parseInt(quantity) >= 999) {
        hui.alert("最大下单数为999!");
        return;
    }else{
        //amount-num
        var $parent = $(this).parent(".good-amount-box");
        var count = parseInt(quantity)+1;
        $parent.find("input[name='goodnum']").val();
        var $goodnum = $(this).parent(".good-amount-box").find("input[name='goodnum']")
        var danjia = parseFloat($(this).attr("price")).toFixed(2);
        var totalPrice = parseFloat(danjia * count).toFixed(2); //总价
        //console.info("totalPrice :" +totalPrice);
        var $price = $(this).parent(".good-amount-box").parent(".good-num-handle").parent(".good-price-info").find(".good-price .price-num");
        //ture 为被选中,false先中
        var flg = false;
        flg = $(this).parent(".good-amount-box").parent(".good-num-handle").parent(".good-price-info").parent(".good-info").parent(".good-content").parent(".goods-list-item").hasClass("checked");
        //console.info(flg);

    }
    var $gabObj = $(this).parent(".good-amount-box");
    var shopSeq = $gabObj.find("input[name='shopSeq']").val();
    var goodsId = $gabObj.find("input[name='goodsId']").val();
    var userName = $gabObj.find("input[name='userName']").val();
    var supplierSeq = $gabObj.find("input[name='supplierSeq']").val();
    var goodsSku = $gabObj.find("input[name='goodsSku']").val();
    var goodsSpec = $gabObj.find("input[name='goodsSpec']").val();
    var isActivityGoods = $gabObj.find("input[name='isActivityGoods']").val();
    var ifWYFcommodity = $gabObj.find("input[name='ifWYFcommodity']").val();
    var seckillPrice = $gabObj.find("input[name='seckillPrice']").val();
    var activityState = $gabObj.find("input[name='activityState']").val();
    var ifBrandProduct = $gabObj.find("input[name='ifBrandProduct']").val();
/*
    var shopSeq = $(this).parent(".good-amount-box").find("input[name='shopSeq']").val();
    var goodsId = $(this).parent(".good-amount-box").find("input[name='goodsId']").val();
    var userName = $(this).parent(".good-amount-box").find("input[name='userName']").val();
    var supplierSeq = $(this).parent(".good-amount-box").find("input[name='supplierSeq']").val();
    var goodsSku = $(this).parent(".good-amount-box").find("input[name='goodsSku']").val();
    var goodsSpec = $(this).parent(".good-amount-box").find("input[name='goodsSpec']").val();
    var isActivityGoods = $(this).parent(".good-amount-box").find("input[name='isActivityGoods']").val();
    var ifWYFcommodity = $(this).parent(".good-amount-box").find("input[name='ifWYFcommodity']").val();
    var seckillPrice = $(this).parent(".good-amount-box").find("input[name='seckillPrice']").val();
    var activityState = $(this).parent(".good-amount-box").find("input[name='activityState']").val();
    var ifBrandProduct = $(this).parent(".good-amount-box").find("input[name='ifBrandProduct']").val();
*/
    var th = $(this);
    $.ajax({
        type : 'POST',
        dataType : 'json',
        contentType: "application/json;charset=utf-8",
        url : '/localQuickPurchase/dCart/add',

        data : JSON.stringify({
            "supplierSeq" : parseInt(supplierSeq),
            "userName" : userName,
            "goodsId" : goodsId,
            "shopSeq" : parseInt(shopSeq),
            "goodsNum" : 1,// 默认为1
            // "distributorType" : parseInt(distributorType),
            "sku" : goodsSku,
            "spec" : goodsSpec,
            "isActivityGoods" : isActivityGoods,
            "seckillPrice" : seckillPrice,
            "activityState" : activityState,
            "ifWYFcommodity" : ifWYFcommodity,
            "ifBrandProduct" : parseInt(ifBrandProduct)
        }),
        async : false,// 是否异步请求，false为同步
        success : function(data) {// 成功返回值执行函数
            if (data.code == 200) {
                var amount = parseFloat($(".heji-num").html()).toFixed(2);
                ++countGoodsNum;
                console.log("countGoodsNum: " + countGoodsNum);
                $("#good_num").html("(" + countGoodsNum + ")");
                $goodnum.val(parseInt(quantity)+1);
                $price.html(totalPrice);
                if(flg){

                    $(".heji-num").html((parseFloat(amount)+parseFloat(danjia)).toFixed(2));
                }
            } else if(data.code == 501){
                hui.toast(data.message);
                //window.location.reload();
            } else {
                hui.toast("加入购物车失败");
            }
        }

    });
    countSelectGoods();
})

var pageIndex = 1;
var pageSize = 4;
//购物车下拉时 显示相关文案
var  firstRef = true;
hui.refresh('#noShoppingRefreshContainer', downMove,xl,xl);
hui.loadMore(listMove);
var isLoading = false;
var first = true;


//为你推荐列表
function listMove(){
    if(isLoading){
        return;
    }
    isLoading = true;
    $.ajax({
        type : 'post',
        dataType : 'JSON',
        contentType: "application/json;charset=utf-8",
        url : '/localQuickPurchase/selectionGoods/v2/selectionGoodsCom',
        data : JSON.stringify({
            columnName: "为您推荐",
            pageIndex : pageIndex,
            pageSize : pageSize
        }),
        async : true,
        success :function(data) {
            if(data.code == 200){
                console.info(data);
                var _html="";
                console.info(data);
                var goodsList =data.data;
                if(goodsList.length > 0){
                    for(var i = 0 ; i < goodsList.length;i++){
                        goodsName = goodsList[i].goodsName;
                        var goodsId = goodsList[i].goodsId;
                        var thumbnail = goodsList[i].thumbnail;//图片
                        var goodsProStandard = goodsList[i].goodsProStandard;
                        var listLableArray = goodsList[i].listLabel;
                        var colours = '';
                        distributionPrice = parseFloat(getDistributionPrices(goodsProStandard)).toFixed(2);
                        getGoodsPrice = parseFloat(getGoodsPrices(goodsProStandard)).toFixed(2);
                        unit = goodsList[i].unit;
                        _html+=' <div class="recommend-good-item">';
                        _html+=' <div class="recommend-good-pic" >';//onclick="goodsDetail('+goodsId+')"
                        _html+=' <input type="hidden" name="goodsId" class="goodsId" value="'+goodsId +'">';
                        _html+=' <img src="'+thumbnail+'" alt="" /></div>';
                        _html +=getYhqHtm(goodsList[i]);
                        var presellType = goodsList[i].presellType;
                        if(presellType != null && presellType == 1) {
                            var endTime = goodsList[i].endTime;
                            var date = Date.parse(new Date());
                            if(endTime > date) {
                                _html+=' <div class="recommend-good-name" ><span style="color: red">(预售商品)</span>'+goodsName+'</div>';
                            } else {
                                _html+=' <div class="recommend-good-name">'+goodsName+'</div>';
                            }
                        } else {
                            _html+=' <div class="recommend-good-name">'+goodsName+'</div>';
                        }

                        /*if(listLableArray!=null && listLableArray.length>0) {
                            _html += '<div class="price-pic" style="border: 1px solid '+colours+';color: '+colours+';">'+labelValues+'</div>';
                        }*/
                        _html+=' <div class="recommend-sale">';
                        _html += '<div class="label">';
                        if(goodsList[i].listLabel != null){
                            var  listLabel = goodsList[i].listLabel;
                            for (var j = 0; j < listLabel.length; j++) {
                                var label = listLabel[j];
                                _html += ' <span style="color:'+label.colour+';border: 1px solid #a4a4a4;border-radius: 0.59rem;' +
                                    'padding: 0 4px;word-break: keep-all;">'+ label.labelValue +'</span>'
                            }
                        }
                        _html+=' </div>';

                        _html+=' <div class="recommend-good-price txt-red">';
                        _html+=' <span class="rmb">￥'+distributionPrice+'</span>';

                        // _html+=' <span class="price-num">'+distributionPrice+'/'+unit+'</span><span class="oldprice-num">￥'+getGoodsPrice+'</span></div>';
                        // _html+=' <span class="price-num">'+distributionPrice+'</span><span class="oldprice-num">￥'+getGoodsPrice+'</span></div>';
                        //_html+=' <span class="price-num"></span><span class="oldprice-num">￥'+getGoodsPrice+'</span></div>';
                        //_html+=' </div></div>';
                        _html+=' <span class="price-num"></span><span class="oldprice-num">￥'+getGoodsPrice+'</span>';
                        _html+='</div></div></div>';
                    }
                    $(".goods-content").append(_html);
                    pageIndex++;
                    hui.endLoadMore(false);
                    isLoading = false;
                }else{
                    hui.endLoadMore(true, '没有更多了...');
                    return false;
                }
            }
        },
        error : function(err) {
            //alert("网络错误");
        }
    });
};
//下拉加载刷新....
function downMove(){
    var tom=$('.hui-refresh-content').offset().top;
 if(tom>50 || firstRef){
     firstRef = false;
     hui.loading('加载中...');
     pageIndex = 1;
     isLoading = false;
     $(".goods-content").html("");
     $.ajax({
         type : 'post',
         dataType : 'JSON',
         contentType: "application/json;charset=utf-8",
         url : '/localQuickPurchase/selectionGoods/v2/selectionGoodsCom',
         data : JSON.stringify({
             columnName: "为您推荐",
             pageIndex : pageIndex,
             pageSize : pageSize
         }),
         async : true,
         success :function(data) {
             console.info(data);
             if(data.code == 200){
                 var _html="";
                 var goodsList =data.data;
                 for(var i = 0 ; i < goodsList.length;i++){
                     goodsName = goodsList[i].goodsName;
                     /*if(goodsName == null || goodsName == ''){
                          continue;
                      }*/
                     var goodsId = goodsList[i].goodsId;
                     var thumbnail = goodsList[i].thumbnail;//图片
                     var goodsProStandard = goodsList[i].goodsProStandard;
                     var listLableArray = goodsList[i].listLabel;
                     var colours = '';
                     var labelValues = '';
                     if(listLableArray!=null && listLableArray.length>0){
                         colours = listLableArray[0].colour;
                         labelValues = listLableArray[0].labelValue;
                     }
                     distributionPrice = parseFloat(getDistributionPrices(goodsProStandard));
                     // distributionPrice = parseFloat(getDistributionPrices(goodsProStandard)).toFixed(2);
                     // goodsPrice = parseFloat(getGoodsPrices(goodsProStandard)).toFixed(2);
                     goodsPrice = parseFloat(getGoodsPrices(goodsProStandard));
                     /*distributionPrice = parseFloat(goodsList[i].distributionPrice).toFixed(2);*/
                     unit = goodsList[i].unit;
                     _html+=' <div class="recommend-good-item">';
                     _html+=' <div class="recommend-good-pic" >';//onclick="goodsDetail('+goodsId+')"
                     _html+=' <input type="hidden" name="goodsId" class="goodsId" value="'+goodsId +'">';
                     _html+=' <img src="'+thumbnail+'" alt="" /></div>';
                     _html +=getYhqHtm(goodsList[i]);
                     var presellType = goodsList[i].presellType;
                     if(presellType != null && presellType == 1) {
                         var endTime = goodsList[i].endTime;
                         var date = Date.parse(new Date());
                         if(endTime > date) {
                             _html+=' <div class="recommend-good-name"><span style="color: red">(预售商品)</span>'+goodsName+'</div>';
                         } else {
                             _html+=' <div class="recommend-good-name">'+goodsName+'</div>';
                         }
                     } else {
                         _html+=' <div class="recommend-good-name">'+goodsName+'</div>';
                     }

                     _html+=' <div class="recommend-sale">'
                     _html += '<div class="label">';
                     if(goodsList[i].listLabel != null){
                         var  listLabel = goodsList[i].listLabel;
                         for (var j = 0; j < listLabel.length; j++) {
                             var label = listLabel[j];
                             _html += ' <span style="color:'+label.colour+';border: 1px solid #a4a4a4;border-radius: 0.59rem;' +
                                 'padding: 0 4px;word-break: keep-all;">'+ label.labelValue +'</span>'
                         }
                     }

                     _html += '</div>';

                     _html+=' <div class="recommend-good-price txt-red">';
                     _html+=' <span class="rmb">￥'+distributionPrice+'</span>';
                     // _html+=' <span class="price-num">'+distributionPrice+'/'+unit+'</span><span class="oldprice-num">￥'+goodsPrice+'</span>';
                     // _html+=' <span class="price-num">'+distributionPrice+'</span><span class="oldprice-num">￥'+goodsPrice+'</span>';
                     _html+=' <span class="price-num"></span><span class="oldprice-num">￥'+goodsPrice+'</span>';
                     _html+='</div></div></div>';
                 }
                 pageIndex++;
                 setTimeout(function(){
                     $(".goods-content").append(_html);
                     //结束刷新
                     hui.endRefresh();
                     //重置加载更多状态
                     hui.resetLoadMore();
                     hui.closeLoading();
                 },500)
             }
         },
         error : function(err) {
         }
     });
 }else {
     hui.endRefresh();
 }

};
//单选商品
$(document).on("click",".check-box",function(){
    $(this).closest(".goods-list-item").toggleClass("checked");
    setBtn();
    if($(".goods-list-item.checked").length == $(".goods-list-item").length){
        $("#sel_all").addClass("active");
    }else{
        $("#sel_all").removeClass("active");
    }
    //判断店铺商品是否全选
    var seq = $(this).attr("cbseq");
    //店铺div对象
    var $shqObj = $("div[seq="+seq+"]");
    //店铺全选按钮
    var shopState = $shqObj.find(".btn-check-shop");

    if($(".goods-list-item.checked."+seq).length == $(".goods-list-item."+seq).length){
        $shqObj.addClass("checked");
        $shqObj.attr("state","1");//选中状态
        shopState.attr("state","1");//选中状态
    }else{
        $shqObj.removeClass("checked");
        $shqObj.attr("state","0");//未选中状态
        shopState.attr("state","0");//未选中状态
    }

    var state = $(this).attr("state");

    /**价格重新计算 ... v1版本 start **/
    var goodsAmount =  0.00;
    var goodContentObj= $(this).parent(".goods-list-item").children(".good-content");
    var count = goodContentObj.find(".amount-inp").val();
    var price = goodContentObj.find(".btn-add").attr("price");
    if(count == null ){
        count = 1;
    }
    if(price == null){
        price = 0;
    }
    count = parseInt(count);
    price = parseFloat(price).toFixed(2);
    goodsAmount = count * price;
    /**价格重新计算 ... v1版本 end **/
    //console.info(state);
    if(state == "0"){ //未选中
        // var goodsAmount = parseFloat($(this).parent(".goods-list-item").children(".good-content").children(".good-info").children(".good-price-info").children(".good-price").children(".price-num").html()).toFixed(2);
        // var goodsAmount = parseFloat($(this).parent(".goods-list-item").children(".good-content").children(".good-info").children(".good-price-info").children(".good-price").children(".price-num").html()).toFixed(2);

        console.info(goodsAmount);
        //var add_amount=parseFloat($(this)["0"].dataset.goodsamount);//得到当前的总额.toFixed(2)
        //var goodsAmount = parseFloat($(this).attr("goodsAmount"));
        var hejiPrice = parseFloat($(".heji-num").html());
        //console.info(hejiPrice);
        //console.info($(this)["0"].dataset.goodsamount);
        $(".heji-num").html((parseFloat(hejiPrice)+parseFloat(goodsAmount)).toFixed(2));
        $(this).attr("state","1");
        $(this).parent(".goods-list-item").find(".good-content").attr("state","1");
    }else if(state == "1"){//取消
        // var goodsAmount = parseFloat($(this).parent(".goods-list-item").children(".good-content").children(".good-info").children(".good-price-info").children(".good-price").children(".price-num").html()).toFixed(2);
        console.info(goodsAmount);

        //var sub_amount = parseFloat($(this)["0"].dataset.goodsamount);//得到当前的总额.toFixed(2)
        //console.info($(this)["0"].dataset.goodsamount);
        //var goodsAmount = parseFloat($(this).attr("goodsAmount"));
        var hejiPrice = parseFloat($(".heji-num").html());//.toFixed(2)
        $(".heji-num").html((parseFloat(hejiPrice)-parseFloat(goodsAmount)).toFixed(2));
        $(this).attr("state","0");
        $(this).parent(".goods-list-item").find(".good-content").attr("state","0");
    }
    findCheckboxList();
});

$(document).on("click",".btn-check-shop",function () {

    var $shopBtnObj = $(this);
    var $shqshopping = $shopBtnObj.parent(".shqshopping");
    var seq = $shqshopping.attr("seq");
    var hnObj = $(".heji-num").html();
    if(hnObj == null ){
        hnObj = 0.00;
    }
    // $(".heji-num").html(totalAmount);
    // var isShopCheck = $shopBtnObj.hasClass("checked");
    var state = $shopBtnObj.attr("state");
    if(state == "0"){ //未选中

        $("."+seq).addClass("checked");
        $shqshopping.addClass("checked");

        var price = 0;
        //全选时 店铺下商品价格 累计
        $("."+seq+" div[class='good-content']div[state='0'] .good-price-info .good-amount-box").each(function(){
            var onePrice = $(this).find(".btn-muins").attr("price");
            var oneTotal = $(this).find(".amount-inp").val();
            price += parseFloat(parseFloat(onePrice) * parseInt(oneTotal));//.toFixed(2)
        });
/*
        $("."+seq+" div[class='good-content']div[state='0'] span[name='gprice']").each(function(){
            price += parseFloat($(this).html());//.toFixed(2)
        });
*/

        //累计后添加在合计中
        // var hejiPrice = parseFloat($(".heji-num").html());//.toFixed(2)
        var hejiPrice = parseFloat(hnObj);//.toFixed(2)

        //店铺下已经有 选中商品时，累计有减去 选中商品价格

        $(".heji-num").html((parseFloat(hejiPrice)+parseFloat(price)).toFixed(2));

        //店铺按钮状态
        $shqshopping.find(".btn-check-shop").attr("state","1");
        //店铺下按钮按钮
        $("."+seq).each(function(){
            $(this).children().attr("state","1");
        });

    }else{ //选中

        $("."+seq).removeClass("checked");
        $shqshopping.removeClass("checked");


        var price = 0;
        //全选时 店铺下商品价格 累计
        $("."+seq+" div[class='good-content']div[state='1'] .good-price-info .good-amount-box").each(function(){
            var onePrice = $(this).find(".btn-muins").attr("price");
            var oneTotal = $(this).find(".amount-inp").val();
            price += parseFloat(parseFloat(onePrice) * parseInt(oneTotal));//.toFixed(2)
        });
/*
        $("."+seq+" div[class='good-content']div[state='1'] span[name='gprice']").each(function(){
            price += parseFloat($(this).html());//.toFixed(2)
        });
*/
        //累计后添加在合计中

        // var hejiPrice = parseFloat($(".heji-num").html());//.toFixed(2)
        var hejiPrice = parseFloat(hnObj);//.toFixed(2)
        $(".heji-num").html((parseFloat(hejiPrice)-parseFloat(price)).toFixed(2));

        //店铺下按钮按钮
        $("."+seq).each(function(){
            $(this).children().attr("state","0");
        });
        //店铺按钮状态
        $shqshopping.find(".btn-check-shop").attr("state","0");

    }

    /*if($shopBtnObj.hasClass("active")){

        $("."+seq).addClass("checked");
        $shqshopping.addClass("checked");
        $("."+seq).each(function(){
            $(this).children().attr("state","1");
        });
        var price = 0;
        //全选时 店铺下商品价格 累计
        $("."+seq+" span[name='gprice']").each(function(){
            price += parseFloat($(this).html());//.toFixed(2)
        });

        //累计后添加在合计中
        var hejiPrice = parseFloat($(".heji-num").html());//.toFixed(2)
        $(".heji-num").html((parseFloat(hejiPrice)+parseFloat(price)).toFixed(2));
        //店铺按钮状态
        $(".shqshopping").each(function(){
            $(this).children(".btn-check-shop").attr("state","1");
        });

    }else{
        $("."+seq).removeClass("checked");
        $shqshopping.removeClass("checked");
        //alert("1price2-num ");
        //var shopAmount=$(".totalAmont").val();
        //$(".heji-num").html("0");
        $("."+seq).each(function(){
            $(this).children().attr("state","0");
        });
        //店铺按钮状态
        $(".shqshopping").each(function(){
            $(this).children(".btn-check-shop").attr("state","1");
        });
        var price = 0;
        //全选时 店铺下商品价格 累计
        $("."+seq+" span[name='gprice']").each(function(){
            price += parseFloat($(this).html());//.toFixed(2)
        });
        //累计后添加在合计中
        var hejiPrice = parseFloat($(".heji-num").html());//.toFixed(2)
        $(".heji-num").html((parseFloat(hejiPrice)-parseFloat(price)).toFixed(2));
    }*/

    //店铺按钮状态
    var state = $shopBtnObj.attr("state");
    //全选按钮
    if($(".shqshopping.checked").length == $(".shqshopping").length){
        $("#sel_all").addClass("active");
    }else{
        $("#sel_all").removeClass("active");
    }

    findCheckboxList();
    setBtn();
});

//全选
$("#sel_all").on("click",function(){
    var $self = $(this)
    $self.toggleClass("active");
    /*$(".checked").each(function(){
        console.info($(this));
    });*/
    console.info($self);
    $(".heji-num").html(totalAmount);
    if($self.hasClass("active")){
        $(".goods-list-item").addClass("checked");
        $(".shqshopping").addClass("checked");

        var shopAmount = 0 ;
        $("#goodsListEditCheck .goods-list-item").each(function(){
            // shopAmount += parseFloat($(this).children(".good-content").children(".good-info").children(".good-price-info").children(".good-price").children(".price-num").html()).toFixed(2);
            // var $gli = $(this);
            // var saCount = $gli.find("input[name='goodnum']").val();
            // shopAmount += parseFloat(saCount).toFixed(2);
            var $gab = $(this).find(".good-amount-box");
            var onePrice = parseFloat($gab.find(".btn-muins").attr("price"));
            var oneCount = parseInt($gab.find(".amount-inp").val());

            shopAmount += (onePrice * oneCount);
        });

       /* $(this).parent(".good-amount-box").find("input[name='goodnum']").val(parseInt(quantity)-1);
        var $parent = $(this).parent(".good-amount-box");
        var count = parseInt(quantity)-1;
        $parent.find("input[name='goodnum']").val();

        var danjia = parseFloat($(this).attr("price")).toFixed(2);//单价

        var totalPrice = parseFloat(danjia * count).toFixed(2);//总价*/



        $(".heji-num").html(shopAmount.toFixed(2));

        $(".goods-list-item").each(function(){
            $(this).children().attr("state","1");
        })

        //店铺div
        $(".shqshopping").each(function(){
            $(this).attr("state","1");
        })
        //店铺按钮 状态
        $(".shqshopping").each(function(){
            $(this).children(".btn-check-shop").attr("state","1");
        });

        /*var price = 0;
        $("span[name='gprice']").each(function(){
            price += parseFloat($(this).html());//.toFixed(2)
        });
        $(".heji-num").html(price.toFixed(2));*/
    }else{
        $(".goods-list-item").removeClass("checked");
        $(".shqshopping").removeClass("checked");
        //alert("1price2-num ");
        //var shopAmount=$(".totalAmont").val();
        //$(".heji-num").html("0");
        $(".goods-list-item").each(function(){
            $(this).children().attr("state","0");
        });
        //店铺div
        $(".shqshopping").each(function(){
            $(this).attr("state","0");
        })
        $(".shqshopping").each(function(){
            $(this).children(".btn-check-shop").attr("state","0");
        });
        $(".heji-num").html("0");
    }
    findCheckboxList();
    setBtn();
})


//商品详情
$('body').on("click",".recommend-good-pic",function(){
    /*if(isRoleAgent()){//登录的用户类型（1 普通用户,2 网络店主,3 线下服务中心
        distributorSeq = seq;
    }else {
        distributorSeq = 0;
    }*/

    var goodsId = $(this).children(".goodsId").val();
    if(seq == null || seq == 0) {
        seq = 0;
    }
    //暂时默认取平台商品
    window.location.href="/localQuickPurchase/distributionVA/goodsDetail/"+goodsId+"/"+0+"/"+seq;
});
$('body').on("click",".good-pic",function(){
    /*if(isRoleAgent()){//登录的用户类型（1 普通用户,2 网络店主,3 线下服务中心
        distributorSeq = seq;
    }else {
        distributorSeq = 0;
    }*/
    var goodsId = $(this).attr("goodsid");
    var isActivityGoods = $(this).attr("num");
    if(seq == null || seq == 0) {
        seq = 0;
    }
    //暂时默认取平台商品
    if (isActivityGoods != null && isActivityGoods == "1") {
        window.location.href="/localQuickPurchase/distributionVA/seckill/sgDetail?goodsId="+goodsId+"&distributorSeq="+seq+"&shareSeq="+seq;
    } else {
        window.location.href="/localQuickPurchase/distributionVA/goodsDetail/"+goodsId+"/"+0+"/"+seq;
    }
});

/**
 * 获取分销价
 * @returns
 */
function getDistributionPrices(data) {
    var distributionPrice = data[0].distributionPrice;
    if(distributionPrice == null) {
        var costPrice = (data[0].platformPrice*1.15).toFixed(2);;
        distributionPrice = (costPrice*1.2).toFixed(2);
    }
    return distributionPrice;
}
/**
 * 获取原厂家价格
 * @returns
 */
function getGoodsPrices(data) {

    return data[0].goodsPrice;
}



findCheckboxList();
function edit(obj){
    var _edit = $("#edit").text();
    if(_edit ==="编辑"){
        $("#btn_del").show();
        $("#to_pay").hide();
        $("#edit").text("完成");
    }else{
        $("#to_pay").show();
        $("#btn_del").hide();
        $("#edit").text("编辑");
    }
}
function findCheckboxList(){
    $("#msg").hide();
    //$("#btn_del").show();
    countSelectGoods();
}

//点击消息时间
$("#msg").click(function(){
    location.href = "/localQuickPurchase/distributionVA/customer/menu";
});
function  jumpCoupon(){
    window.location.href="/localQuickPurchase/activity/baiye.html";
};
