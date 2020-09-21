//获取url上的某个参数
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURI(r[2]); return null;
}

$(function(){
    var shopSeq = getQueryString("shopSeq");
    var id = getQueryString("id");
    console.log(shopSeq+"<--------------------------------->"+id);

    //获取品牌广场主页数据信息
    $.ajax({
        type: 'POST',
        url: '/localQuickPurchase/brandSquareShopClassifyAction/findAllClassifyBySeq',
        async: false,
        data : {
            shopSeq : shopSeq,
            classifyId : id
        },
        success: function (data) {
            console.log(data.data);
            if (data.code == 200) {
                var goodsListData = data.data;
                var classifyName = goodsListData.classifyName;
                $("#hui-header-sreach").text(classifyName);

                var goodsList = goodsListData.onlineGoodsList;
                var goodsStr = "";


                for(var i = 0; i < goodsList.length; i++){
                    var data = goodsList[i];
                    var goodsProStandard = data.goodsProStandard;
                    var isActivityGoods = data.isActivityGoods;
                    var distributionPrice = getDistributionPrice(goodsProStandard);//分销价
                    var goodsPrice = getGoodsPrice(goodsProStandard);
                    var platformPrice = getPlatformPrice(goodsProStandard);//平台价
                    var seckillPrice = goodsProStandard[0].seckillPrice;
                    if(distributionPrice <= 0){
                        var costPrice = (platformPrice*1.15).toFixed(2);
                        distributionPrice = (costPrice*1.2).toFixed(2);
                    }
                    var salesVolume = getSalesVolume(goodsProStandard);//起卖量
                    var isDistrbutionGoods = data.isDistrbutionGoods;//
                    console.info(salesVolume)
                    if(salesVolume == null || salesVolume == 0){
                        salesVolume = 1;
                    }
                    var costPrices;

                    var _profit;

                    if(distributorType == 2) {
                        _profit = goodsProStandard[0].distributionProfit//分销商利润
                    } else if(distributorType == 3) {
                        _profit = numAdd(goodsProStandard[0].profitPrice, goodsProStandard[0].distributionProfit)//代理商利润
                    }

                    //日供货量
                    var actualPrice = data.actualPrice;//实际价格
                    var comparativePrice = data.comparativePrice;//展示价格
                    var canSaleStock = data.canSaleStock;//剩余库存

                    /*var stock = "";
                    if (canSaleStock <= 0 || canSaleStock == null) {
                        stock = "9999件";
                        if (isActivityGoods != null && isActivityGoods == "1"){
                            stock = "";
                        }
                    } else {
                        stock = canSaleStock + "件";
                    }*/

                    //标签集合
                    var labelList = data.listLabel;
                    var presellType = data.presellType;
                    costPrices = _profit;

                    var isFavorites = data.isFavorites;
                    var shop_id = data.seq == null ? 0 : data.seq;
                    var supplier_id = data.supplierSeq == null ? 0 : data.supplierSeq;

                    var isOk = 0;
                    var list = '<li class="backGroundColorLI" data_id="'+data.goodsId+'" state="'+data.state+'" shop_id="'+shop_id+'" supplier_id="'+supplier_id+'" salesvolume_num="'+ salesVolume +'" >';
                    list += "<img class='goGoodsDetail' src='"+data.thumbnail+"' alt='' goodsid='"+data.goodsId+"' isActivityGoods = '"+isActivityGoods+"'>";
                    list += "<div class='productInfo'>";

                    if(presellType != null && presellType == 1) {
                        var endTime = data.endTime;
                        var date = Date.parse(new Date());
                        if(endTime > date) {
                            isOk = 1;
                            list += "<div class='title goGoodsDetail' goodsid='"+data.goodsId+"' isActivityGoods = '"+isActivityGoods+"'><span style='color: red'>(预售商品)</span>"+data.goodsName+"</div>";
                        } else {
                            list += "<div class='title goGoodsDetail' goodsid='"+data.goodsId+"' isActivityGoods = '"+isActivityGoods+"'>"+data.goodsName+"</div>";
                        }
                    } else {
                        list += "<div class='title goGoodsDetail' goodsid='"+data.goodsId+"' isActivityGoods = '"+isActivityGoods+"'>"+data.goodsName+"</div>";
                    }

                    list += "<p class='price'>";
                    if(isActivityGoods && isActivityGoods == 1){
                        list += "<span class='special'>特卖价:"+actualPrice.toFixed(2)+"</span>";
                    }else{
                        list += "<span class='special'>¥"+actualPrice.toFixed(2)+"</span>";
                    }
                    list += "<span class='text_line'>¥"+comparativePrice.toFixed(2)+"</span>";
                    list += "</p>";
                   /* if (stock != "" && stock != null) {
                        list += "<p class='Stock'> 剩余数量：<span>" + stock + "</span></p>";
                    }*/
                    if (labelList && labelList.length > 0) {
                        list += "<div class='label'>";
                        for (var z = 0; z < labelList.length && z < 2; z++) {
                            var colour = labelList[z].colour;
                            var labelValue = labelList[z].labelValue;
                            list += "<p class='hotSaleGoods' style='color:"+ colour +";border:.0444rem solid "+ colour +"'>"+labelValue+"</p>";
                        }
                        if((distributorType == 2 || distributorType == 3) && costPrices > 0) {
                            list += "<span class='commissionPrice'>佣金：¥"+cutPriceDown(costPrices)+"</span>";
                        }
                        list += "</div>";
                    }
                    list += "</div></li>";
                    goodsStr += list;
                }
                $(".goods-box").append(goodsStr);
            }else{
                hui.alert(data.message,"确定",function(){
                    history.go(-1);
                });
            }
        }
    })
});


//商品图片点击  进入商品详情
$('#goods-ul').on('click', '.goGoodsDetail', function() {
    var goodsId = $(this).attr('goodsid');
    var isActivityGoods = $(this).attr('isActivityGoods');
    if(seq == null || seq == 0) {
        seq = 0;
    }
    // 进入原生商品详情界面
    try{
        window.action.app_goodsDetails(goodsId,0);
    }catch (e) {
    }

    if(isActivityGoods && isActivityGoods == 1){
        window.location.href= "/localQuickPurchase/distributionVA/seckill/sgDetail?goodsId=" + goodsId + "&distributorSeq="+seq+"&shareSeq=0";
    }else{
        window.location.href= "/localQuickPurchase/distributionVA/goodsDetail/"+goodsId+"/0/"+seq;
    }
});

function goBack(){
    try{
        // 调app原生返回
        window.action.app_back();
    }catch(e){

    }
    setTimeout(function(){
        javascript:history.go(-1);
    }, 200);
}