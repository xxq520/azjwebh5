//判断是否选择中item
function checkSelItem() {
	return $(".set_item.checked").length > 0;
}

/*禁用操作按钮*/
function activeBtn(id) {
	if(checkSelItem()) {
//		console.log(checkSelItem())
		$(id).addClass("active");
	} else {
		$(id).removeClass("active");
	}
}

//点击选择商品的方法
function selItem(obj){
	$(obj).closest(".set_item").toggleClass("checked");
	
	if(checkSelItem()){
		$("#to_pay").addClass("active");
	}else if($(".set_item.checked").length == $('#set_item').length && $(".set_item.checked").length != 0){
		$("#sel_all").addClass("active");
		$("#to_pay").addClass("active");
	}else if($(".set_item.checked").length == 0){
		$("#sel_all").removeClass("active");
		$("#to_pay").removeClass("active");
	}else{
		$("#sel_all").removeClass("active");
	}
}

//商品列表
function listMove(){
	if(isLoading){
		return;
	}
	isLoading = true;
	$.ajax({ 
		type: "POST", 
		url : '/goods/investmentGoods/giftList',
		data :{
			"pageIndex":pageIndex,
			"userType" : 1,
			"shareSeq":shareSeq,
			"userName":userName
		}, 
		async : true, 
		success :function(data) {
			if(data.code == 200){
				var goodsList =data.data.listGoods;
				var goodstandardList =data.data.goodstandardList;
				var mapActivity =data.data.mapActivity;
				selectMap = data.data.dataPack;
				standardList = data.data.standardList;
				if(goodsList.length > 0){
					
					var _html = appendHtml(goodsList,goodstandardList,mapActivity);
					$(".set-goods").append(_html);
					//$(".set-goods").css("height","2rem");
					pageIndex++;
					hui.endLoadMore(false);
					isLoading = false;
				}else{
					hui.endRefresh();
			        hui.loading('加载中...', true);
				}
			}else if(data.code == 404){
				hui.endLoadMore(true,'已经到头了...');
				return false;
			}
		}, 
		error : function(err) { 
			//alert("网络错误"); 
		}
	});
};

//下拉加载....
function downMove(){
	hui.loading('加载中...');
	isLoading = true;
	$.ajax({ 
		type: "POST", 
		url : '/goods/investmentGoods/giftList',
		data :{
			"pageIndex":pageIndex,
			"userType" : 1,
			"shareSeq":shareSeq
		}, 
		async : true, 
		success :function(data) {
			if(data.code == 200){
				var goodsList =data.data.listGoods;
				var goodstandardList =data.data.goodstandardList;
				var mapActivity =data.data.mapActivity;
				selectMap = data.data.dataPack;
				standardList = data.data.standardList;
				
				var _html = appendHtml(goodsList,goodstandardList,mapActivity);
				pageIndex++;
				setTimeout(function(){
					$(".set-goods").append(_html);
					
					//结束刷新
					hui.endRefresh();
					//重置加载更多状态
					hui.resetLoadMore();
					hui.loading('加载中了...', true);
					if(!first){
						hui.toast("下拉刷新成功");	            	
					}
					first = false;
					isLoading = false;
				},500)
			}else{
				if(pageIndex == 1){
					var html = '<p class="positionContent">暂时没有商品,请先去设置!</p>';
					$('.set-goods').html(html);
					$(".set-goods").addClass("nh");
				}
				
				//结束刷新
				hui.endRefresh();
				hui.loading('加载中...', true);
			}
		}, 
		error : function(err) { 
			hui.alert("网络错误"); 
		}
	});
};
var ImgHeight = $(document).width()/2 - 20; //控制商品的高度
//动态拼接html标签
function appendHtml(goodsList,goodstandardList,mapActivity){
	_html = "";
	var hostPic = goodsList[0].hostPic;
	var hostName = goodsList[0].hostName;
	var activityTitle = goodsList[0].activityTitle;
	$('#headImg').html('<img src="'+mapActivity.hostPic+'" />');
	var title = mapActivity.activityTitle;//title = null;
	$('#headTitle').html('<div class="trial-left"><p>'+(title == null || title == "null" ? "&nbsp" : title)+'</p><p class="font-sm color_darkgray">来自于'+mapActivity.hostName+'的邀请</p></div>');
//		_html = '<div class="set-goods">';
	for(var i = 0 ; i < goodsList.length;i++){
		var goodsName = goodsList[i].goodsName;
		var subLength = 6;
		//goodsName = "的的的的的的";
		if(goodsName != null && goodsName != "" && goodsName.length > subLength){
			goodsName = goodsName.substring(0,subLength);
		}
		///var goodsId = goodsList[i].goodsId;
		var goodsId = goodsList[i].goodsId;
		var shopSeq = goodsList[i].shopSeq;
		var thumbnail = goodsList[i].thumbnail;//图片
		var goodsProStandard = goodsList[i].goodsProStandard;
		var distributionPrice = parseFloat(getDistributionPrices(goodsProStandard)).toFixed(2);
		var supplierSeq = goodsList[i].supplierSeq;
		var goodsSku = goodsList[i].goodsSku;
//			var goodsSpec = goodsList[i].goodsSpec;
		var goodsCode = goodsList[i].goodsCode;
		var factoryPrice = goodsList[i].factoryPrice;
		var cost_unit_price = goodsList[i].cost_unit_price;
		var logisticsPrice = goodsList[i].logisticsPrice;
		var companyName = goodsList[i].companyName;
		var primitiveFactoryPrice = goodsList[i].primitiveFactoryPrice;
		var quantity = goodsList[i].quantity;
		unit = goodsList[i].unit;	
		var tatolProStandard = getGoodActivityQuantity(goodsProStandard);
		_html+=' <div id="check-box" pprice="'+distributionPrice+'" state="0" class="set_item pull-left" style="margin:0.3rem 0" checkId="'+goodsId+'"><img id="'+goodsId+'" class="goodsDatailClass" width="'+ ImgHeight +'" height="'+ ImgHeight +'" src="'+thumbnail+'"/>';
		_html+=' <input type="hidden" name="goodsId" class="goodsId" value="'+goodsId +'">';
//			_html+=' <input type="hidden" name="shopSeq" class="shopSeq" value="'+shopSeq+'">';
		_html+=' <input type="hidden" name="supplierSeq" class="supplierSeq" value="'+supplierSeq+'">';
		_html+=' <input type="hidden" name="userName" class="userName" value="'+userName+'">';
		_html+=' <input type="hidden" name="goodsSku" class="goodsSku" value="'+goodsSku+'">';
//			_html+=' <input type="hidden" name="goodsSpec" class="goodsSpec" value="'goodsSpec'">';
		_html+=' <input type="hidden" name="goodsCode" class="goodsCode" value="'+goodsCode+'">';
		_html+=' <input type="hidden" name="logisticsPrice" class="logisticsPrice" value="'+logisticsPrice+'">';
		_html+=' <input type="hidden" class="quantity" value="'+quantity+'">';
		_html+=' <input type="hidden" class="distributionPrice" state="0" value="'+distributionPrice+'">';
		_html+='<p class="margin-t-3 set-goods-title">'+goodsName+'&nbsp;库存：<span style="color:red;">'+tatolProStandard+'</span></p>';
		_html+='<p class="margin-t-3 set-goods-price pull-left">￥'+distributionPrice+'</p>';
//		_html+='<span class="margin-t-3">严选</span>';
		_html+='<div class="btn-check margin-t-3"></div></div>';
		var chooseSpec = '';
		var goodstandard = goodstandardList[i];
		for(var k = 0; k < goodstandard.length; k++) {
			var array_element = goodstandard[k];
			var elements = array_element.split(":");
			var name = elements[0];//规格参数名
			chooseSpec += '<div class="spec-list">';
			chooseSpec += '<div class="spec-title">' + name + '</div>';
			
			var chima = elements[1];
			var chimas = chima.split("^");//商品规格
			for (var j = 0; j < chimas.length; j++) {
				var array_element = chimas[j];
				chooseSpec += '<div class="spec-item" onclick="selSpec(this);getSpces(this)" goodsId="'+goodsId+'">' + array_element + '</div>';
			}
			chooseSpec += '</div>';
		}	
		
		_html+='<div class="sltBox" style="bottom: 0; display: none;" ide='+goodsId+'>';
		_html+='<div class="closeBtn"></div>';
		_html+='<div class="sltGood" >';
		_html+='<div class="sltImg"><img src="'+thumbnail+'"></div>';
		_html+='<div class="sltDetail">';
		_html+='<div class="slt-txt styleColor slt-price">';
		_html+='<input type="hidden" value="'+distributionPrice+'" name="dprice"/>';
		_html+='<span class="saleprice">￥'+distributionPrice+'</span>';
		_html+='</div>';
//		_html+='<div class="slt-txt">库存234件</div>';
		_html+='<div class="slt-txt slt-spec">选择颜色分类尺码</div>';
		_html+='</div>';
		_html+='</div>';
		_html+='<div class="spec-box">';
		_html+=chooseSpec;
		_html+='</div>';
		_html+='<div class="numBox">';
		_html+=' <label>数量</label>';
		_html+='<div class="nbox">';
		_html+=' <div class="nbox-item nbox-reduce" reduceid="'+goodsId+'"></div>';
		_html+='<div class="nbox-item nbox-input">';
		var saleslume = goodsList[i].salesVolume ;//起卖量暂时不需要，先设置为1
		saleslume = 1;
		_html+=' <input type="text" class="nbox-txt"  onkeypress="return event.keyCode>=48&&event.keyCode<=57" ng-pattern="/[^a-zA-Z]/"  name="numValue" maxlength="3" value="'+saleslume+'" />';
		
		_html+='</div>';
		_html+='<div class="nbox-item nbox-add" addid="'+goodsId+'"></div>';
		_html+='</div>';
		_html+='</div>';
		_html+='<div class="specBtn">';
		_html+=' <div style="width: 100%;" class="specBtn-item buyNow" comfirmId="'+goodsId+'">确定</div>';
		_html+=' </div>';
		_html+='</div>';
		_html+='</div>';
	}
	_html+='</div>';
	
	return _html;
}
//统计数量
function getGoodActivityQuantity(items){
	var goodsactivityQuantity = 0;
	for(var i = 0 ;i < items.length ; i++){
		goodsactivityQuantity += items[i].activityQuantity;
	}
	return goodsactivityQuantity;
}

//讲所选的商品参数传到后台
var investmentAccounts="";
function selectParam(idAndSeqs) {
	$.ajax({
		type : "post",// 定义提交的类型
		url : "/localQuickPurchase/investmentGoods/selectParam",
		//traditional :true,
		contentType : "application/json;charset=utf-8",
		dataType : "json",// 设置返回值得类型
		data : JSON.stringify(idAndSeqs),
		async : false,// 是否异步请求，false为同步
		success : function(data) {// 成功返回值执行函数
			if (data.code == 200) {
				investmentAccounts = data.data.redisKEY;
				//判断是否登录
				if(userInfo==""){
					$('#to_pay').addClass("active");
					noLogin();
					return;
				}else{
					setCookie("investmentSeq",shareSeq);//现场招商商家的seq
				}
 				window.location.href="/localQuickPurchase/investmentGoods/settlement?redisKey="+data.data.redisKEY;
			} else {
				hui.toast("跳转失败,系统异常请稍后再试!");
			}
		}
	});
}

//判断是否登录
function noLogin(){
    sltHide();
    hui.confirm('为了给您提供完整的服务，请登录后再进行该操作', ['暂不登录','马上登录'], function(){
        setCookie("loginRetrunUrl",urlVal);
        setCookie("investmentSeq",shareSeq);//现场招商商家的seq
        setCookie("investmentAccounts",investmentAccounts);//现场招商商家的seq
        var url = "/localQuickPurchase/distributionVA/login/passwordLogin";
		window.location.href = url;
    });
}

function sltHide(){
	$(".mask").fadeOut("normal");
	$(".sltBox").fadeOut("normal");
}
function sltShow(id){
	$(".mask").fadeIn("normal");
	$('div[ide='+id+']').fadeIn("normal");
};

function changeGoodsInfo(div){
    selItem($(div).find('.btn-check'));
	
	var inde = $(div).find(".btn-check.padding-t-1").length;
	var number = $(div).find("#check-box.checked").length;
	if(number==inde){
		$("#sel_all").addClass("active");
	}else{
		$("#sel_all").removeClass("active");
	}
	var state = $(div).children('.distributionPrice').attr("state");
	if(state == "0"){
		//var goodsPrice = $(div).next('.sltBox').find('.slt-price').html();
		//var goodsPrice = $(div).next('.sltBox').find('input[name="dprice"]').val();
		var goodsPrice = $(div).attr("pprice");
		if(goodsPrice.indexOf('￥') != -1){
			goodsPrice = goodsPrice.substring(1,goodsPrice.length);
		}
		var goodsAmount = parseFloat(goodsPrice).toFixed(2);
		var quality = parseInt($(div).next('.sltBox').find('input[name="numValue"]').val());
//			console.info(goodsAmount);
		var hejiPrice = parseFloat($(".heji-num").html());
		$(".heji-num").html((parseFloat(hejiPrice) + numMulti(goodsAmount,quality)).toFixed(2));
		$(div).children('.distributionPrice').attr("state","1");
	}else if(state == "1"){
		//var goodsPrice = $(div).next('.sltBox').find('.slt-price').html();
		//var goodsPrice = $(div).next('.sltBox').find('input[name="dprice"]').val();
		var goodsPrice = $(div).attr("pprice");
		if(goodsPrice.indexOf('￥') != -1){
			goodsPrice = goodsPrice.substring(1,goodsPrice.length);
		}
		var goodsAmount = parseFloat(goodsPrice).toFixed(2);
		var quality = parseInt($(div).next('.sltBox').find('input[name="numValue"]').val());
//			console.info(goodsAmount);
		var hejiPrice = parseFloat($(".heji-num").html());//.toFixed(2)
		$(".heji-num").html((parseFloat(hejiPrice) - numMulti(goodsAmount,quality)).toFixed(2));
		$(div).children('.distributionPrice').attr("state","0");
	}
	var totalNum = 0;
	$("div[class='set_item pull-left checked']").each(function(){
		totalNum ++;
	});
	$(".sel-total").html('('+totalNum+')');
}

//选中规格
function selSpec(t){
	if($(t).hasClass("nogood")){
		return;
	}
	$(t).addClass("checked").siblings(".spec-item").removeClass("checked");
}

/* 获取规格的内容 */
function getSpces(obj){
    var sn = $(this).offsetParent().find(".spec-item.checked").length;
    var an = $(this).offsetParent().find(".spec-item.checked").parent(".spec-list").length;
    if(an == sn){
        var standard = '';
        $(obj).parent('.spec-list').parent('.spec-box').find(".spec-item.checked").each(function(i){
        	//debugger;
            if(i==0) {
            	standard += $(this).text();
            } else{
            	standard += ','+$(this).text();
            }
        });
        $(obj).offsetParent().find('.sltGood').find(".slt-spec").html("已选择 " + standard);
    } else {
    	$(obj).offsetParent().find('.sltGood').find(".slt-spec").html("选择规格");
    }
}

function choiceStandard(){
  	//选择规格
    $(".spec-list").on("click",".spec-item",function() {
        var sn = $(this).offsetParent().find(".spec-item.checked").length;
        var an = $(this).offsetParent().find(".spec-list").length;
        var spec = '';
        if(an == sn){
            $(this).parent('.spec-list').parent('.spec-box').find(".spec-item.checked").each(function(i){
            	//debugger;
                if(i==0) {
                	spec += $(this).text();
                } else{
                	spec += ','+$(this).text();
                }
            });
        }
        var id = $(this).attr("goodsId");//获取商品id
        if(spec !=null && spec!="") {
        	var entity;
        	for(var f = 0; f < standardList.length; f++){
        		var helperMap = standardList[f];
        		var mapKey;
        		var mapValue;
        		for(var m in helperMap){	//通过定义一个局部变量k遍历获取到了map中所有的key值  
        			mapValue = helperMap[m];//获取到了key所对应的value的值！
        			mapKey = m;
        		}
        		if(mapKey == id){
        			var sMap = mapValue;
        			if(sMap != null){
        				for(var v = 0; v<sMap.length;v++){
        					var mapSta = sMap[v];
        					var mapKey;
        					var mapValue;
        					for(var t in mapSta){
        						mapValue = mapSta[t];
        						mapKey = t;
        					}
        					if(spec == t){
        						entity=mapValue;
        					}
        				}
        			}
        		}
        	}
        	
        	if(entity != null) {
        		orderSku = entity.sku;//goodsSku
    			distributionPrice = entity.distributionPrice;//分销价
    			platformPrice = entity.platformPrice;//平台价
    			salesVolume = entity.salesVolume;//起卖量
    			salesVolume = 1;//不设置起卖量  默认是1
    			goodsCode = entity.goodsCode;//商品Code
    			factoryPrice = entity.factoryPrice;//出厂价
    			gcost_unit_price = entity.cost_unit_price;//出厂单价
    			primitiveFactoryPrice = entity.primitiveFactoryPrice;//原始出厂价
    			companyName = entity.companyName;//供应商名称
    			
    			$(this).offsetParent().find('.stock-num').html(salesVolume);//起卖量
    			$(this).offsetParent().find(".slt-price").html("￥" + (distributionPrice));//分销价
    			$(this).offsetParent().find("input[name=numValue]").val(salesVolume);
    			$(this).offsetParent().prev('#check-box').find("input[name='goodsSku']").val(orderSku);
//    			$(this).offsetParent().prev('#check-box').find("input[name='logisticsPrice']").val();
    			$(this).offsetParent().prev('#check-box').find("input[class='distributionPrice']").val(distributionPrice);
    			//获取下单优惠价
    			var PreferentialPrice = 0.0;
    			if(isRoleAgent() || isRoleDealer()){
    				
    				var _distributionProfit = entity.distributionProfit;//分销商佣
    				var _profitPrice = entity.profitPrice;//代理商佣金
    				if(_distributionProfit != null && _distributionProfit > 0.0 && _profitPrice != null && _profitPrice > 0.0) {
    					if(isRoleAgent()) {
    						PreferentialPrice = entity.distributionProfit;//分销商佣金
    					} else if(isRoleDealer()) {
    						PreferentialPrice = numAdd(entity.profitPrice, entity.distributionProfit);//代理商佣金
    					}
    				}
    				
    				_html = '<div class="slt-txt styleColor slt-price">优惠:'+PreferentialPrice+'</div>';
    				$(this).offsetParent().find('.slt-price').append(_html);//sltDetail
    			}
    	    	console.info(entity);
        	}
        }
    	    
    	//spec-item
        var specOne = "";
        $(this).offsetParent().find(".spec-item.checked").each(function(i){
    		if(i==0) {
            	specOne = $(this).text();
            }
    	});
    	if(specOne != null && specOne != "") {
    		
    		var value;
    		var standard;
    		for(var i = 0; i < selectMap.length; i++) {
    			var standardMap = selectMap[i];
    			var standardKey;
    			var standardValue;
    			for(var k in standardMap){  //通过定义一个局部变量k遍历获取到了map中所有的key值  
    				standardValue = standardMap[k]; 	//获取到了key所对应的value的值！   
    				standardKey = k;
    			}
    			if(standardKey==id){
    				standard = standardValue;
    			}
    		}
    			
    		for(var i=0;i<standard.length;i++){
    			var _arrayElement = standard[i];
    			if(specOne == _arrayElement[0]) {
    				value = _arrayElement[1].toString();
    			}
    		}
    		console.info("value: " + value);
    		var div =$(this).parent('.spec-list').parent('.spec-box');
    		var an = $(this).parent('.spec-list').parent('.spec-box').find(".spec-list").length;//一共有多少个规格参数
    		var qwe = "";
    		for(var l = 0; l < an; l++) {
    			$(this).parent('.spec-list').parent('.spec-box').find(".spec-list:eq("+(1+l)+") .spec-item").each(function(index,item,array){
    		        qwe += $(this).html() + ",";
                 })
                qwe = qwe.substring(0, qwe.length -1); 
                qwe += ":";
    		}
    	    qwe = qwe.substring(0, qwe.length -1); 
            console.info("qwe: " + qwe);
            
    		//第一个规格
    		var text = $(this).text();
    		
            if(value != qwe) {
//            	$(".slt-spec").html("选择规格");
    			console.info("选择到的属性: " + text);
    			var _Text;
    			for(var i = 0; i < standard.length; i++) {
    				var _arrayElement = standard[i];
    				if(text == _arrayElement[0]) {
    					_Text = _arrayElement[1].toString();
    				}
    			}
    			//以:分割的是规格三个以上的 ，以,分割的是两个
    			//选切割":" 判断是否是三个以上 
    			if(_Text != null) {
    				console.info("获取到的属性: " + _Text);
    				var _one = _Text.indexOf(":");
    				if(_one == -1) {
    					var sps = _Text.split(",");
    					var newHtml = "";
    					for (var i = 0; i < sps.length; i++) {
    						var sp = sps[i];
    						newHtml += '<div class="spec-item" onclick="selSpec(this);getSpces(this)" goodsid="'+id+'">'+sp+'</div>';
    					}
    					$(this).offsetParent().find(".spec-list:eq(1)").html(newHtml);
    				} else {
    					var _two = _Text.split(":");//例子: 180CM,190CM:黑色,白色-->数组 [180CM,190CM] [黑色,白色] 
    					for(var i = 0; i < _two.length; i++) {
    						var _element = _two[i];//[180CM,190CM]
    						var _e = _element.indexOf(",");
    						if(_e == -1) {
    							$(".spec-box").children(".spec-list:eq("+(1+i)+")").children(".spec-item:eq(0)").removeClass("checked")
    							$(".spec-box").children(".spec-list:eq("+(1+i)+")").children(".spec-item:eq(0)").html(_element);
    						} else {
    							var _f = _element.split(",");//例子: [180CM,190CM]--> [180CM] [190CM]
    							for(var g = 0; g < _f.length; g++) {
    								var _v = _f[g];
    								$(".spec-box").children(".spec-list:eq("+(1+i)+")").children(".spec-item:eq("+(g)+")").removeClass("checked")
    								$(".spec-box").children(".spec-list:eq("+(1+i)+")").children(".spec-item:eq("+(g)+")").html(_v);
    							}
    						}
    					}
    				}
    			}
            	
            }
    	}
    });
}
