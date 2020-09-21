var totalAmount = 0.00;//总金额
var countGoodsNum = 0;//商品总件数
var idAndSeqs = new Array();
//按商品名称统计购物车个数
var goodsLocalItemsArr = new Array();
var goodsLocalItems;
var hrefUrl = "/localQuickPurchase/distributionVA/shopCar/noShopping";
var userName = getUserName();

var shareSeqCK = getCookie("shareSeq");
//返回个人中心页面
function backPersonalCenter(){
    //window.location.href=_content+"/distributionVA/personal/index";
}

//页面根目录
var path = "/localQuickPurchase";

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
    $("#noShoppingRefreshContainer").append(nsc);
}

function removeNoShoppingContent(){
    var nscObj = $("#noShoppingRefreshContainer").find(".noShopping-content");
    if(nscObj!=null && nscObj.length > 0){
        nscObj.remove();
    }
}

//初始化查询购物车
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
                if(localItems == null){
                    // window.location.href=hrefUrl;
                    noShoppingContent();
                    removeCalcContent();
                }else{
                    if (localItems.sizi < 1) {
                        // window.location.href=hrefUrl;
                        noShoppingContent();
                        removeCalcContent();
                    }else{
                        removeNoShoppingContent()
                        addCalcContent();
                    }
                    var goodsPiece = localItems.length;
                    if (parseInt(goodsPiece) < 1) {
                        // window.location.href=hrefUrl;
                        noShoppingContent();
                        removeCalcContent();
                    }else{
                        removeNoShoppingContent();
                        addCalcContent();
                    }
                    /*var gliObj = $("goods-list-item");
                    if(gliObj.length <=0){
                        removeNoShoppingContent();
                    }*/

                    goodsLocalItems = localItems.length;
                    /*var number = document.getElementById("number");
                    if(goodsLocalItems > 0){
                        setCookie("goodsLocalItems",goodsLocalItems);
                        number.innerHTML = goodsLocalItems;
                    }else{
                        number.remove();
                    }*/

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
                    for(var z = 0;z<bpArray.length;z++){
                        // var suppSeq = data.supplierList[z];
                        var shopDistinctionObj  = bpArray[z];

                        var bpShow ='';//显示品牌或者店家
                        if(shopDistinctionObj!=null){
                            // localItems = bpArray[z][suppSeq];
                            localItems = shopDistinctionObj.localItemList;
                            // bpShow += '<div class="shqshopping">'+data.supplierName[suppSeq]+'<div></div>></div>';
                            bpShow += '<div class="shqshopping"><div class="spn">'+shopDistinctionObj.shopSupplierName+'<img src="'+shopDistinctionObj.shopPictureName+'" alt=""></div></div>';
                            // $(".goods-list").before(bpShow);
                    //购物车循环开始
                    for (var y = localItems.length-1; y >= 0; y--) {
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
                                items += '<li class="goods-list-item useless">';
                            } else {
                                items += '<li class="goods-list-item">';
                            }
                        } else {
                            if(goodsStatus == 1 ){
                                items += '<li class="goods-list-item useless">';
                            }else{
                                items += '<li class="goods-list-item">';
                            }
                        }

                        items += '<div class="check-box" state="0" data-goodsAmount="'+goodsAmount+'" >';
                        items += '<div class="btn-check"></div></div>';
                        items += '<div class="good-content">';
                        items += '<div class="good-pic" goodsid='+goodsId+' num='+isActivityGoods+'>';
                        items += '<img src="' + imgUrl+ '" alt="" /></div>';
                        items += '<div class="good-info">';
                        items += '<h4 class="good-name overflow">' + goodsName+ '</h4>';
                        /*items += '<div class="good-des">' + shopName+ '</div>';goodsPrice="'+goodsPirce+'"*/
                        items +='<div class="spec">';
                        items +='<span style="float: left;">规格：</span>';
                        items +='<span style="float: left;">';
                        items +='<span>'+(goodsSpec==null?"暂无规格信息":goodsSpec)+'</span>';
                        items +='</span>';
                        if(ifBrandProduct == 1) {
                            items += '<span class="brandSquareProductSpan">品牌商品</span>';
                        }
                        items +='</div>';
                        items += '<div class="unit-price">';
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
                        items += '</div>';
                        items += '<div class="good-price-info" >';
                        items += '<div class="good-num-handle" style="float: none;  width: 100%;">';
                        if (isActivityGoods != null && isActivityGoods == "1") {//秒杀价格
                            items += '<div class="good-amount-box" style=" width: 50%;" ><span class="btn-muins" price = "'+seckillPrice+'">-</span>';
                        } else {//分销价格
                            items += '<div class="good-amount-box" style=" width: 50%;" ><span class="btn-muins" price = "'+distributionPrice+'">-</span>';
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
                        items += '<div class="good-price color_red" style=" text-align: right; float: none;  width: 100%;">';
                        if (isActivityGoods != null && isActivityGoods == "1") {//秒杀价格
                            items += '<span class="rmb">￥</span><span class="price-num" name="gprice">'+  parseFloat(seckillPrice*quantity).toFixed(2) + '</span><span>元</span></div></div></div></div></li>';// onclick="addCart('+goodsId+','+shopSeq+')"
                        } else {//分销价格
                            items += '<span class="rmb">￥</span><span class="price-num" name="gprice">'+  parseFloat(distributionPrice*quantity).toFixed(2) + '</span><span>元</span></div></div></div></div></li>';// onclick="addCart('+goodsId+','+shopSeq+')"
                        }

                        $(".goods-list").prepend(items);
                        if(y == 0){
                            $(".goods-list").prepend(bpShow);
                        }
                    }
                    //购物车循环结束
                        }
                    }
                }
                //}
            } else {
                //alert("查询失败!");
            }
        }
    });
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
    $(".checked").each(function() {
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

            var goodsSpec = $(this).children(".good-content").children(".good-info").children(".good-price-info").children(
                ".good-num-handle").children(".good-amount-box").find("input[name='goodsSpec']").val();
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
    if(ifBrandProductMark == normalProductMark){
        hui.alert("系统暂不支持品牌商品与分销商品合并支付,请单独支付,为您带来的不便深感歉意");
        flagUseless = true;
    }
    if(!flagUseless){
        if (idAndSeqs == null || idAndSeqs.length == 0) {
            return hui.alert("请先勾选要购买商品!");
        }
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
//				/window.location.load();
                $(".goods-list").html("");
                initFindCart();// 重新加载购物车
            } else {
                hui.toast("操作失败!");
            }
        }
    });
}
//删除购物车商品
function deleteGoods(){
    var idAndSeqs =new Array();
    var list = $(".checked");// 所有选择的商品
    if (list.length == 0) {
        hui.toast("请选择商品!");
        return;
    }else{
        hui.confirm('确定删除选中的商品？', ['返回','确认'], function(){
            $(".checked").each(// 所有选择的商品
                function() {
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
                    var supplierSeqD = $(this).children(".good-content").children(".good-info").children(
                        ".good-price-info").children(".good-num-handle").children(
                        ".good-amount-box").find("input[name='supplierSeq']").val();

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
    }

});

//商品数量-1
$(document).on('click','.btn-muins',function() {//alert("111")
    var quantity = $(this).parent(".good-amount-box").find(
        "input[name='goodnum']").val(); // 当前输入框的数量
    //var salesVolume =  $(this).parents().find(".good-info").contents().find(".salesVolume").html();
    var salesVolume =  $(this).parent(".good-amount-box").parent(".good-num-handle").parent(".good-price-info").prev(".unit-price").find(".salesVolume").html();
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
    var shopSeq = $(this).parent(".good-amount-box").find(
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
})

//商品数量+1
$(document).on('click','.btn-add',function() {
    var _this = this;
    var quantity = $(this).parent(".good-amount-box").find(
        "input[name='goodnum']").val(); // 当前输入框的数量
    if (parseInt(quantity) >= 999) {
        hui.alert("最大下单数为999!");
        return;
    }else{

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
            "distributorType" : parseInt(distributorType),
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
})

var pageIndex = 1;
var pageSize = 4;
hui.refresh('.goods-content', downMove);
hui.loadMore(listMove);
var isLoading = false;
var first = true;

/**购物车 无物品时下拉 刷新 效果  start ...**/
var xl = '<div class="shoppingRefresh"><div class="shoppingContent-img"><img src="/localQuickPurchase/distributionApp/images/shuaxin.gif" alt=""></div><div class="partake-text"><div>分 享 赚 钱， 自 购 省 钱</div><div class="shuanxziti">松开刷新</div></div></div>';
hui.refresh('#noShoppingRefreshContainer', nsrc,xl,xl);

function nsrc(){
    if(hui.refreshNumber < 1){hui.loading('加载中...');}
    hui.endRefresh();
}
/**购物车 无物品时下拉 刷新 效果  end ...**/

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
                        distributionPrice = parseFloat(getDistributionPrices(goodsProStandard)).toFixed(2);
                        getGoodsPrice = parseFloat(getGoodsPrices(goodsProStandard)).toFixed(2);
                        unit = goodsList[i].unit;
                        _html+=' <div class="recommend-good-item">';
                        _html+=' <div class="recommend-good-pic" >';//onclick="goodsDetail('+goodsId+')"
                        _html+=' <input type="hidden" name="goodsId" class="goodsId" value="'+goodsId +'">';
                        _html+=' <img src="'+thumbnail+'" alt="" /></div>';

                        var presellType = goodsList[i].presellType;
                        if(presellType != null && presellType == 1) {
                            var endTime = goodsList[i].endTime;
                            var date = Date.parse(new Date());
                            if(endTime > date) {
                                _html+=' <div class="recommend-good-name" style="-webkit-line-clamp: 1;"><span style="color: red">(预售商品)</span>'+goodsName+'</div>';
                            } else {
                                _html+=' <div class="recommend-good-name" style="-webkit-line-clamp: 1;">'+goodsName+'</div>';
                            }
                        } else {
                            _html+=' <div class="recommend-good-name" style="-webkit-line-clamp: 1;">'+goodsName+'</div>';
                        }

                        _html+=' <div class="recommend-sale">';
                        _html+=' <div class="recommend-good-price txt-red">';
                        _html+=' <span class="rmb">￥'+distributionPrice+'</span>';
                        // _html+=' <span class="price-num">'+distributionPrice+'/'+unit+'</span><span class="oldprice-num">￥'+getGoodsPrice+'</span></div>';
                        // _html+=' <span class="price-num">'+distributionPrice+'</span><span class="oldprice-num">￥'+getGoodsPrice+'</span></div>';
                        _html+=' <span class="price-num"></span><span class="oldprice-num">￥'+getGoodsPrice+'</span></div>';
                        _html+=' </div></div>';
                    }
                    $(".goods-content").append(_html);

                    pageIndex++;
                    hui.endLoadMore(false);
                    isLoading = false;
                }else{
                    hui.endLoadMore(true, '已经到头了...');
                    return false;
                }
            }
        },
        error : function(err) {
            //alert("网络错误");
        }
    });
};
// 旧的接口
/*
function listMove(){
    if(isLoading){
        return;
    }
    isLoading = true;
    $.ajax({
        type: "POST",
        url : '/localQuickPurchase/commodityShow/goodsHot',
        data :{
            "pageIndex":pageIndex,
            "pageSize":pageSize,
            "userType" : 1,
            "seq":seq,
            "userName":userName
        },
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
                        distributionPrice = parseFloat(getDistributionPrices(goodsProStandard)).toFixed(2);
                        unit = goodsList[i].unit;
                        _html+=' <div class="recommend-good-item">';
                        _html+=' <div class="recommend-good-pic" >';//onclick="goodsDetail('+goodsId+')"
                        _html+=' <input type="hidden" name="goodsId" class="goodsId" value="'+goodsId +'">';
                        _html+=' <img src="'+thumbnail+'" alt="" /></div>';

                        var presellType = goodsList[i].presellType;
                        if(presellType != null && presellType == 1) {
                            var endTime = goodsList[i].endTime;
                            var date = Date.parse(new Date());
                            if(endTime > date) {
                                _html+=' <div class="recommend-good-name" style="-webkit-line-clamp: 1;"><span style="color: red">(预售商品)</span>'+goodsName+'</div>';
                            } else {
                                _html+=' <div class="recommend-good-name" style="-webkit-line-clamp: 1;">'+goodsName+'</div>';
                            }
                        } else {
                            _html+=' <div class="recommend-good-name" style="-webkit-line-clamp: 1;">'+goodsName+'</div>';
                        }

                        _html+=' <div class="recommend-sale">';
                        _html+=' <div class="recommend-good-price txt-red">';
                        _html+=' <span class="rmb">￥</span>';
                        _html+=' <span class="price-num">'+distributionPrice+'/'+unit+'</span></div>';
                        _html+=' </div></div>';
                    }
                    $(".goods-content").append(_html);

                    pageIndex++;
                    hui.endLoadMore(false);
                    isLoading = false;
                }else{
                    hui.endLoadMore(true, '已经到头了...');
                    return false;
                }
            }
        },
        error : function(err) {
            //alert("网络错误");
        }
    });
};
*/
//下拉加载....
function downMove(){
    hui.loading('加载中...');
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

                    var presellType = goodsList[i].presellType;
                    if(presellType != null && presellType == 1) {
                        var endTime = goodsList[i].endTime;
                        var date = Date.parse(new Date());
                        if(endTime > date) {
                            _html+=' <div class="recommend-good-name" style="-webkit-line-clamp: 1;"><span style="color: red">(预售商品)</span>'+goodsName+'</div>';
                        } else {
                            _html+=' <div class="recommend-good-name" style="-webkit-line-clamp: 1;">'+goodsName+'</div>';
                        }
                    } else {
                        _html+=' <div class="recommend-good-name" style="-webkit-line-clamp: 1;">'+goodsName+'</div>';
                    }

                    _html+=' <div class="recommend-sale">';
                    _html+=' <div class="recommend-good-price txt-red">';
                    _html+=' <span class="rmb">￥'+distributionPrice+'</span>';
                    // _html+=' <span class="price-num">'+distributionPrice+'/'+unit+'</span><span class="oldprice-num">￥'+goodsPrice+'</span>';
                    // _html+=' <span class="price-num">'+distributionPrice+'</span><span class="oldprice-num">￥'+goodsPrice+'</span>';
                    _html+=' <span class="price-num"></span><span class="oldprice-num">￥'+goodsPrice+'</span>';
                    if(listLableArray!=null && listLableArray.length>0) {
                        _html += '<div class="price-pic" style="border: 1px solid '+colours+';color: '+colours+';">'+labelValues+'</div>';
                    }
                    _html+='</div></div></div>';
                }
                pageIndex++;
                setTimeout(function(){
                    $(".goods-content").append(_html);
                    //结束刷新
                    hui.endRefresh();
                    //重置加载更多状态
                    hui.resetLoadMore();
                    hui.loading('加载中...', true);
                    if(!first){
                        hui.toast("下拉刷新成功");
                    }
                    first = false;
                },500)
            }else{
                //结束刷新
                hui.endRefresh();
                hui.loading('加载中...', false);
            }
        },
        error : function(err) {
            hui.alert("网络错误");
        }
    });
};
/*
function downMove(){
    hui.loading('加载中...');
    isLoading = true;
    $.ajax({
        type: "POST",
        url : '/localQuickPurchase/commodityShow/goodsHot',
        data :{
            "pageIndex":pageIndex,
            "userType" : 1,
            "seq":seq
        },
        async : true,
        success :function(data) {
            console.info(data);
            if(data.code == 200){
                var _html="";
                var goodsList =data.data;
                for(var i = 0 ; i < goodsList.length;i++){
                    goodsName = goodsList[i].goodsName;
                    /!*if(goodsName == null || goodsName == ''){
                         continue;
                     }*!/
                    var goodsId = goodsList[i].goodsId;
                    var thumbnail = goodsList[i].thumbnail;//图片
                    var goodsProStandard = goodsList[i].goodsProStandard;
                    distributionPrice = parseFloat(getDistributionPrices(goodsProStandard)).toFixed(2);
                    /!*distributionPrice = parseFloat(goodsList[i].distributionPrice).toFixed(2);*!/
                    unit = goodsList[i].unit;
                    _html+=' <div class="recommend-good-item">';
                    _html+=' <div class="recommend-good-pic" >';//onclick="goodsDetail('+goodsId+')"
                    _html+=' <input type="hidden" name="goodsId" class="goodsId" value="'+goodsId +'">';
                    _html+=' <img src="'+thumbnail+'" alt="" /></div>';

                    var presellType = goodsList[i].presellType;
                    if(presellType != null && presellType == 1) {
                        var endTime = goodsList[i].endTime;
                        var date = Date.parse(new Date());
                        if(endTime > date) {
                            _html+=' <div class="recommend-good-name" style="-webkit-line-clamp: 1;"><span style="color: red">(预售商品)</span>'+goodsName+'</div>';
                        } else {
                            _html+=' <div class="recommend-good-name" style="-webkit-line-clamp: 1;">'+goodsName+'</div>';
                        }
                    } else {
                        _html+=' <div class="recommend-good-name" style="-webkit-line-clamp: 1;">'+goodsName+'</div>';
                    }

                    _html+=' <div class="recommend-sale">';
                    _html+=' <div class="recommend-good-price txt-red">';
                    _html+=' <span class="rmb">￥</span>';
                    _html+=' <span class="price-num">'+distributionPrice+'/'+unit+'</span></div>';
                    _html+=' </div></div>';
                }
                pageIndex++;
                setTimeout(function(){
                    $(".goods-content").append(_html);
                    //结束刷新
                    hui.endRefresh();
                    //重置加载更多状态
                    hui.resetLoadMore();
                    hui.loading('加载中...', true);
                    if(!first){
                        hui.toast("下拉刷新成功");
                    }
                    first = false;
                },500)
            }else{
                //结束刷新
                hui.endRefresh();
                hui.loading('加载中...', false);
            }
        },
        error : function(err) {
            hui.alert("网络错误");
        }
    });
};
*/
//单选商品
$(document).on("click",".check-box",function(){
    $(this).closest(".goods-list-item").toggleClass("checked");
    setBtn();
    if($(".goods-list-item.checked").length == $(".goods-list-item").length){
        $("#sel_all").addClass("active");
    }else{
        $("#sel_all").removeClass("active");
    }
    var state = $(this).attr("state");
    //console.info(state);
    if(state == "0"){ //选中
        var goodsAmount = parseFloat($(this).parent(".goods-list-item").children(".good-content").children(".good-info").children(".good-price-info").children(".good-price").children(".price-num").html()).toFixed(2);
        console.info(goodsAmount);
        //var add_amount=parseFloat($(this)["0"].dataset.goodsamount);//得到当前的总额.toFixed(2)
        //var goodsAmount = parseFloat($(this).attr("goodsAmount"));
        var hejiPrice = parseFloat($(".heji-num").html());
        //console.info(hejiPrice);
        //console.info($(this)["0"].dataset.goodsamount);
        $(".heji-num").html((parseFloat(hejiPrice)+parseFloat(goodsAmount)).toFixed(2));
        $(this).attr("state","1");
    }else if(state == "1"){//取消
        var goodsAmount = parseFloat($(this).parent(".goods-list-item").children(".good-content").children(".good-info").children(".good-price-info").children(".good-price").children(".price-num").html()).toFixed(2);
        console.info(goodsAmount);

        //var sub_amount = parseFloat($(this)["0"].dataset.goodsamount);//得到当前的总额.toFixed(2)
        //console.info($(this)["0"].dataset.goodsamount);
        //var goodsAmount = parseFloat($(this).attr("goodsAmount"));
        var hejiPrice = parseFloat($(".heji-num").html());//.toFixed(2)
        $(".heji-num").html((parseFloat(hejiPrice)-parseFloat(goodsAmount)).toFixed(2));
        $(this).attr("state","0");
    }
    findCheckboxList();
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
        var shopAmount = 0 ;
        $(".goods-list-item").each(function(){
            shopAmount += parseFloat($(this).children(".good-content").children(".good-info").children(".good-price-info").children(".good-price").children(".price-num").html()).toFixed(2);
        });

        $(".heji-num").html(shopAmount);

        $(".goods-list-item").each(function(){
            $(this).children().attr("state","1");
        });
        var price = 0;
        $("span[name='gprice']").each(function(){
            price += parseFloat($(this).html());//.toFixed(2)
        });
        $(".heji-num").html(price.toFixed(2));
    }else{
        $(".goods-list-item").removeClass("checked");
        //alert("1price2-num ");
        //var shopAmount=$(".totalAmont").val();
        //$(".heji-num").html("0");
        $(".goods-list-item").each(function(){
            $(this).children().attr("state","0");
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
function findCheckboxList(){
    var length = $(".check-box[state=1]").length;
    if(length <= 0 ){
        $("#btn_del").hide();
        $("#msg").show();
    }else {
        $("#msg").hide();
        $("#btn_del").show();
    }
}
//点击消息时间
$("#msg").click(function(){
    location.href = "/localQuickPurchase/distributionVA/customer/menu";
});
