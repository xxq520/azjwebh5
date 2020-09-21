/*$("body").on("click",".set-edit",function(){
      //var url ="/localQuickPurchase/distributionVA/localeRecruit/editGoods";
      //alert(url);
	  // window.location.href=url;
	  window.location.href="/localQuickPurchase/distributionVA/localeRecruit/editGoods";
 });*/
//返回上一页
function backClick(){
	//查看是否有写活动标题
	/*$.ajax({
		type:"post",
		url : '/localQuickPurchase/investmentGoods/findInvestmentBySeq',
		data:{"seq":seq},
		async:false,
		success : function(data){
			if(data.code == 200){
				var activityTitle = data.data.investmentGoods.activityTitle;
				if(activityTitle == null || activityTitle == ""){
					hui.alert("请先输入活动标题并点击保存!");
					return;
				}
			}
		},
		error : function(data){
			hui.toast("网络异常,请稍后再试!");
		}
	});*/
	//返回上一层
	window.history.go(-1);
};

var pageIndex = 1;
//hui.refresh('#refreshContainer', refreshInvestmentGoods);//下拉刷新（暂时先屏蔽）
$(function(){
	refreshInvestmentGoods();//调用刷新方法
});
hui.loadMore(getMoreInvestmentGoods);//上拉加载

var isLoading = false;
var first = true;
var backPageSize;
var ImgHeight = $(document).width()/2 - 20;
//将商品的goodsId保存到数组中
var goodsIdArray=new Array()
var seq = seq;
var loadState = 0;
function isLoad(){
	if(loadState == 0){
		return true;
	}
	return false;
}
//下拉刷新
function refreshInvestmentGoods(){
	var html2="";
	html2 += '<div class="set_left" id="set-add"  onclick="addGift()">'
	html2 += '<img src="/localQuickPurchase/distributionApp/images/localeRecruit/set-add.png"/>'
/*	html2 += '<p class="margin-t-3 set-goods-title">名称暂无</p>'
	html2 += '<p class="margin-t-3 set-goods-price">¥...</p>'
	html2 += '<span class="margin-t-3">严选</p>'*/
	html2 += '</div>'
	var t = isLoad();
	console.info(t);
	if(!t){
		return;
	}
	loadState = 1;
	$('#investmentGoods').html(html2);
	$.ajax({
		type : 'POST',
		dataType : 'json',
		url : '/localQuickPurchase/investmentGoods/findAllInvestmentGoods',
		data : {
			"seq" : seq,
			"pageIndex" : 1,
			"pageSize" : 10
			},
		success : function(data){
			var html = "";
			if(data.code == 200) {
				var distributionGoodsList = data.data.distributionGoodsList;//现场招商商品集合
				var activityTitle = data.data.investmentGoods.activityTitle;//店铺信息
				var virtualShop = data.data.virtualShop;//店铺信息
				var storeName = virtualShop.storeName;//店铺信息
				var storeHeadImg = virtualShop.storeHeadImg;//店铺信息
				if(storeHeadImg == null){
					storeHeadImg = "/localQuickPurchase/distributionApp/images/head.png";
				}
				$("#activityTitle").attr("value",activityTitle);
				console.log(storeHeadImg);
				$("#storeHeadImg").attr("src",storeHeadImg);
				if(distributionGoodsList != null && distributionGoodsList.length > 0){
					for (var i = 0; i < distributionGoodsList.length; i++) {
						var goodsName = distributionGoodsList[i].goodsName;
						var goodsId = distributionGoodsList[i].gid;
						//var goodsId = distributionGoodsList[i].goodsId;
						var goodsProStandard = distributionGoodsList[i].goodsProStandard;//多规格
						var distributionPrice = getDistributionPrice(goodsProStandard);//分销价
						var goodsImgPath = distributionGoodsList[i].listGoodsImg;
						if(goodsImgPath == null || goodsImgPath == ""){
							goodsImgPath = "/localQuickPurchase/distributionApp/images/default-classify.png";
						}else{
							if(distributionGoodsList[i].listGoodsImg[0] != null && distributionGoodsList[i].listGoodsImg[0] != ""){
								goodsImgPath = distributionGoodsList[i].listGoodsImg[0].goodsImgPath;//默认取第一个							
							}							
						}
						//html += '<div class="set-goods">'; 
						html += '<div class="set_left">'; 
						html += '<img id='+goodsId+","+goodsName+' class="set_del" src="/localQuickPurchase/distributionApp/images/localeRecruit/set-close.png" onclick="clickGoods(this)" />';
						html += '<img class="goodsDetails" width="'+ ImgHeight +'" height="'+ ImgHeight +'" src="'+goodsImgPath+'" id="'+goodsId+'"/>'; 
						html += '<p class="margin-t-3 set-goods-title">'+goodsName+'</p>'; 
						html += '<p class="margin-t-3 set-goods-price">¥'+distributionPrice+'</p>'; 
						html += '<span class="margin-t-3">严选</p>'; 
						html += '</div>'; 
						pageIndex = 2;
					}
					///setTimeout(function(){
						//$('#investmentGoods #set-add').html("");
						$("#investmentGoods #set-add").after(html);
						//结束刷新
						hui.endRefresh();
						//重置加载更多状态
						hui.resetLoadMore();
						hui.loading('加载中...', true);
						if(!first){
							hui.toast("下拉刷新成功");	            	
						}
						loadState = 0;
						first = false;
					///},500)
				}else{
					hui.toast("暂时没有商品,请先去设置!");
					//html += '<p class="positionContent">暂时没有商品,请先去设置!</p>';
					//$('#investmentGoods').html(html);
					$("#investmentGoods #set-add").after(html);
					hui.endRefresh();
			        hui.loading('加载中...', true);
				}
			}else{
				hui.toast("暂时没有商品,请先去设置!");
				//html += '<p class="positionContent">暂时没有商品,请先去设置!</p>';
				//$('#investmentGoods').html(html);
				//$("#investmentGoods #set-add").html(html);
				hui.endRefresh();
		        hui.loading('加载中...', true);
			}
		},
		error : function(data){
			if (data.message == undefined) {
				hui.alert("暂时没有商品,请先去设置吧！");
				$("#logisticsList").hide();
			}
		}
	});
	
};
//加载更多

function getMoreInvestmentGoods(){
	if(backPageSize < 10){
		hui.endLoadMore(true, '已经到头了...');
		return;
	}
	if(isLoading){
		return;
	}
	/*if(!isLoad){
		return;
	}*/
	isLoading = true;
    $.ajax({
    	type : 'POST',
		dataType : 'json',
		url : '/localQuickPurchase/investmentGoods/findAllInvestmentGoods',
		data : {
			"seq" : seq,
			"pageIndex" : pageIndex,
			"pageSize" : 10
			},
		async : false,
		success : function(data) {
			if(data.code == 200) {
				var distributionGoodsList = data.data.distributionGoodsList;//现场招商商品集合
				var localeRecruitGoods = data.data.localeRecruitGoods.length;//现场招商商品个数集合
				var html = "";
				if (distributionGoodsList.length > 0) {
					backPageSize = localeRecruitGoods - (pageIndex-1)*10;
					var length = distributionGoodsList.length;
					for (var i = 0; i < distributionGoodsList.length; i++) {
						var goodsName = distributionGoodsList[i].goodsName;
						//var goodsId = distributionGoodsList[i].goodsId;
						var goodsId = distributionGoodsList[i].gid;
						
						var goodsProStandard = distributionGoodsList[i].goodsProStandard;//多规格
						var distributionPrice = getDistributionPrice(goodsProStandard);//分销价
						var goodsImgPath = distributionGoodsList[i].listGoodsImg;
						if(goodsImgPath == null || goodsImgPath == ""){
							goodsImgPath = "/localQuickPurchase/distributionApp/images/default-classify.png";
						}else{
							if(distributionGoodsList[i].listGoodsImg[0] != null && distributionGoodsList[i].listGoodsImg[0] != ""){
								goodsImgPath = distributionGoodsList[i].listGoodsImg[0].goodsImgPath;//默认取第一个							
							}							
						}
					    //html += '<div class="set-goods">'; 
					    html += '<div class="set_left" id="'+goodsId+'">'; 
					    html += '<img id='+goodsId+","+goodsName+' class="set_del" src="/localQuickPurchase/distributionApp/images/localeRecruit/set-close.png" onclick="clickGoods(this)" />';
					    html += '<img class="goodsDetails" width="'+ ImgHeight +'" height="'+ ImgHeight +'" src="'+goodsImgPath+'" id="'+goodsId+'"/>'; 
					    html += '<p class="margin-t-3 set-goods-title">'+goodsName+'</p>'; 
					    html += '<p class="margin-t-3 set-goods-price">¥'+distributionPrice+'</p>'; 
					    html += '<span class="margin-t-3">严选</p>'; 
					    html += '</div>'; 
					}
					$("#investmentGoods").append(html);
					//$(html).appendTo('#investmentGoods');
					pageIndex++;
		            hui.endLoadMore(false);
		            isLoading = false;
			} else {
				hui.endLoadMore(true, '已经到头了...');
                return false;
			}
		  }
		},
		error : function(error) {
			hui.toast(error);
		}
	});
}
//删除商品
function clickGoods(obj){
	var goodsIdAndGoodsName = $(obj).attr("id").split(",");
	console.log(goodsIdAndGoodsName);
	var goodsId = goodsIdAndGoodsName[0];
	var goodsName = goodsIdAndGoodsName[1];
	hui.confirm(""+goodsName+",您确定删除此商品么",[ '取消', '确定' ],function() {
		 $.ajax({
			 type:'POST',
			 url:'/localQuickPurchase/investmentGoods/deleteInvestmentGoods',
			 data:{
				 seq:seq,
				 goodsId:goodsId
			 },
			 async:false,
			 success:function(data){
				 if(data.code == 200){
					 hui.toast("删除成功!");
					 $('#investmentGoods #set-add').html("");
					 //$("#investmentGoods").html("");
					 location.reload();//刷新整个页面
					 //refreshInvestmentGoods();//调用刷新方法
				 }
			 }
		 });
   });
}

//查找商品二级分类
/*$(function (){
	getGenreId();
});*/
function getGenreId(){
	var seq = getCookie("seq");
	$.ajax({
		type : 'POST',
		//contentType: "application/json;charset=utf-8",
		dataType : 'json',
		url : '/localQuickPurchase/ogMongoAction/getGenreId?seq='+seq,
		data : {},
		async : false,
		success : function(data) {
			var list = data.data;
			if(list != null && list.length > 0) {
				var html = '<li id="0" class="active" onclick="genreId(this)">全部</li>';
				for (var i = 0; i < list.length; i++) {
					var genreId = list[i];
					var id = genreId.id;
					var name = genreId.name;
					if(name == "烟酒茶"){
						name = "酒茶";
					}
					if(name != "烟") {
						html += '<li id="'+id+'" onclick="genreId(this)">'+name+'</li>';
					}
				}
				$("#getGenreId").html(html);
			}
		},
	}); 
	
};
//点击添加礼品
/*$("#set-add").click(function(){
	$("html").css("overflow","hidden");
	$("html").css("height","100%");
	$("body").css("overflow","hidden");
	$("body").css("height","100%");
	$(".set-add").fadeToggle("slow");
	$(".set-add").attr("type-flag","1");
	console.log($(".set-add").attr("type-flag"));
	getGenreId();
	genreIdRefresh();
})*/
function addGift(){
	$("html").css("overflow","hidden");
	$("html").css("height","100%");
	$("body").css("overflow","hidden");
	$("body").css("height","100%");
	$(".set-add").fadeToggle("slow");
	$(".set-add").attr("type-flag","1");
	console.log($(".set-add").attr("type-flag"));
	getGenreId();
	genreIdRefresh();
}
//分类商品
var _genreId;
function genreId(obj){
	$(obj).addClass("active").siblings("li").removeClass("active");
	_genreId = $(obj).attr("id");
	keyword = null;
	if(loadState == 1){
		return ;
	}
	loadState = 1;
	$("#genreId-Goods-ul").html("");
	genreIdRefresh();
	//hui.refresh('#refreshContainerGenreId', genreIdRefresh);
}


//hui.refresh('#refreshContainerGenreId', genreIdRefresh);	//绑定下拉刷新
//hui.loadMore(genreIdGetMore);		//绑定上拉加载
$("#genreId-Goods-ul").ready(function () { 
    $("#refreshContainerGenreId").scroll(function () {
        //$(window).scrollTop()这个方法是当前滚动条滚动的距离
        //$(window).height()获取当前窗体的高度
        //$(document).height()获取当前文档的高度
    	
        if (($("#refreshContainerGenreId").scrollTop()) >= ($("#genreId-Goods-ul").height() - $("#refreshContainerGenreId").height())) {
           //当滚动的高度〉=文档的高度-窗体的高度时；
           //我们需要去异步加载数据了
        	console.log($("#genreId-Goods-ul").height())
        	genreIdGetMore();
        }else{
        	return;
        }
    });
});
var genreIdIsLoading = false;
var genreIdFirst = true;
var hasNextPage = true;
var genreIdPageIndex;
//var local_url = '/localQuickPurchase/ogMongoAction/queryByGId';
var local_url = '/localQuickPurchase/localeRecruitGoodsVO/findLocaleRecruitGoodsVOBySeq';
//分类商品下拉刷新加载
function genreIdRefresh(){
	if(_genreId == 0){
		_genreId = null;
	}
    //请求数据包装
	var dataG={}
	dataG.genreId=_genreId;
	dataG.pageSize=10;
	dataG.pageIndex=1;
	dataG.state=2;//已上架商品
	dataG.investment=true;
	dataG.userSeq = seq;
    $.ajax({
		type : 'GET',
		dataType : 'json',
		url : local_url,
		data :dataG,
		contentType: 'application/x-www-form-urlencoded',
		async : false,
		success : function(data) {
			if(data!=null && data.code == 200){
				$("#genreId-Goods-ul").html("");
				var data = data.data;
				hasNextPage=data.hasNextPage;
				var  listGoods=data.list;
				var list="";
				if(listGoods.length == null || listGoods.length == 0){
					list = '<p class="positionContent">对不起,暂时没有商品!</p>';
					$("#genreId-Goods-ul").append(list);
					loadState = 0;
					return;
				}else{
					for(var i=0;i<listGoods.length;i++){
						list += getDataHtml(listGoods[i]);
					}				
				}
				genreIdPageIndex = 2;
				setTimeout(function(){
					loadState = 0;
					$('#genreId-Goods-ul').append(list);
					if(!hasNextPage){
						hui.endLoadMore(true, '没有更多了...');
						if(listGoods.length==0){
							list = '<p class="positionContent">对不起,暂时没有商品!</p>';
							$("#genreId-Goods-ul").html(list);
						}
					}else{
						//重置加载更多状态
			            hui.resetLoadMore();
			            hui.loading('加载中...', true);
					}
					//重置不可加载状态
					genreIdIsLoading=false;
		            if(!genreIdFirst){
		            	hui.toast("下拉刷新成功");	            	
		            }
		            genreIdFirst = false;
		            //结束刷新
		            hui.endRefresh();
		            genreIdRefresh
		           // loadState = 0;
				},500)
			}else{
				hui.endLoadMore(true, '没有更多了...');
				loadState = 0;
                return false;
			}
		},
		error : function(error) {
			hui.toast(error);
		}
	});
	
}
//加载更多 默认加载第二页
function genreIdGetMore(){
	var dataG={}
	dataG.genreId=_genreId;
	dataG.pageSize=10;
	dataG.pageIndex=genreIdPageIndex;
	dataG.state=2;//已上架商品
	dataG.investment=true;
	dataG.userSeq = seq;
	if(genreIdIsLoading){
		return;
	}
	genreIdIsLoading = true;
    $.ajax({
		type : 'GET',
		dataType : 'json',
		url : local_url,
		contentType: 'application/x-www-form-urlencoded',
		data : dataG,
		async : false,
		success : function(data) {
			if(data!=null && data.code == 200){
				var data = data.data;
				hasNextPage=data.hasNextPage;
				var listGoods=data.list;
				var list="";
				for(var i=0;i<listGoods.length;i++){
					list += getDataHtml(listGoods[i]);
				}
				$('#genreId-Goods-ul').append(list);
				genreIdPageIndex++;
				genreIdIsLoading=false;
				hui.endLoadMore(false);
				if(!hasNextPage){
					hui.endLoadMore(true, '没有更多了...');
					if(listGoods.length==0){
						hui.toast('对不起,暂时没有更多商品！');
					}
				}
			}else{
				hui.toast('加载异常请稍后重试！！');
			}
		},
		error : function(error) {
			hui.toast(error);
		}
	});
}
//页面数据展示
function getDataHtml (data){
	
	var html = '';
	var goodsName = data.goodsName;//商品名称
	///var goodsId = data.goodsId;//商品goodsId
	var goodsId = data.gid;//商品goodsId
	var goodsProStandard = data.goodsProStandard;//多规格
	var distributionPrice = getDistributionPrice(goodsProStandard);//分销价
	var platformPrice = getPlatformPrice(goodsProStandard);//平台价
	if(distributionPrice <= 0){
		var costPrice = (platformPrice*1.15).toFixed(2);
		distributionPrice = (costPrice*1.2).toFixed(2);
	};
	var goodsImgPath;
	if(data.listGoodsImg != null && data.listGoodsImg.length > 0){
		goodsImgPath = data.listGoodsImg[0].goodsImgPath;//默认取第一个
	}
	if(goodsImgPath == null){
		goodsImgPath = "/localQuickPurchase/distributionApp/images/default-classify.png";
	}
	html += '<div class="set-list-item" id="'+_genreId+'">';
	html += '<img class="img-left" id="'+goodsId+'" src="'+goodsImgPath+'" />';
	html += '<div class="img-right" id="'+goodsId+'" onclick="genreIdGoodsAdd(this)">';
	html += '<img src="/localQuickPurchase/distributionApp/images/localeRecruit/set-add2.png" />';
	html += '</div>';
	html += '<div class="item-center">';
	html += '<p class="margin-t-3">'+goodsName+'</p>';
	//html += '<p class="font-sm color_gray margin-t-3">一句话简介，反正好厉害</p>';
	html += '<p class="font-lg margin-t-3">¥'+distributionPrice+'</p>';
	html += '</div>';
	html += '</div>';
	return html;
}

//添加商品
function genreIdGoodsAdd(obj){
	console.log(obj);
	var goodsId = $(obj).attr('id');
	//唯一性判断
	if(ifArray(goodsIdArray,goodsId)){
		hui.toast("该商品已添加！");
		return;
	}
	var add_html = '';
	var imgurl = $(obj).siblings("img").attr("src");
	add_html += '<li>';
	add_html += '<img src="'+imgurl+'" />';
	add_html += '<img id="'+goodsId+'" src="/localQuickPurchase/distributionApp/images/localeRecruit/set-close.png" onclick="del(this)" />';
	add_html += '</li>';
    $('.pull-left-add').append(add_html);
    //将商品的goodsId添加到数组中
    goodsIdArray.push(goodsId);
    console.log(goodsIdArray);
}
//删除添加礼包的
function del(obj){
	var goodsId = $(obj).attr("id");
	console.log(goodsId);
	$(obj).parent("li").remove();
	//根据goodsId删除指定的商品
	goodsIdArray.remove(goodsId);
}
//保存商品
function saveInvestmentGoods(){
	var activityTitle = document.getElementById('activityTitle').value.trim();//获取标题
	var dataG = {'seq':seq,'goodsId':goodsIdArray,'activityTitle':activityTitle,'type':"goods"}
	$.ajax({
		type:'POST',
		url:'/localQuickPurchase/investmentGoods/saveInvestmentGoods',
		dataType:'json',
		contentType: "application/json;charset=utf-8",
		data :JSON.stringify(dataG),
		async : true,//异步请求
		success:function(data){
			if(data.code == 200){
				hui.toast("商品保存成功！");
				//清空添加礼品列表
			    $(".pull-left-add").html("");
				//清空礼品链表数组
				goodsIdArray.splice(0,goodsIdArray.length); 
				console.log(goodsIdArray);
				//点击取消添加商品
				$("#close").click(function(){  
					
				});
				//刷新页面
				location.reload();//刷新整个页面
				//refreshInvestmentGoods();
				//$('#investmentGoods #set-add').html("");
			}else if(data.code == 404){
				var goodsName = null;
				var goods = data.data;
				if(goods != null && goods.length > 0){
					for(var i = 0; i < goods.length; i++){
						if(goods.length[i] != null && goods.length[i] != ""){
							goodsName =+ goods[i].goodsName+",";							
						}
					}
					/*hui.confirm(""+goodsName+"这些商品已下架",[ '取消', '确定' ],function() {
						
					});*/
					if(goodsName == null || goodsName == ""){
						goodsName = "";
					}
					hui.alert(""+goodsName+"这些商品已下架");
				}else{
					hui.alert("商品保存失败,请重新选择");
				}
			}else{
				hui.alert("商品保存失败");
				
			}
		},
		error:function(){
			hui.alert("网络异常,请稍后重试");
		}
	});
	
}
//保存活动标题
function saveActivityTitle(){
	//获取标题
	//var activityTitle = $("#activityTitle").attr("value");
	var activityTitle = document.getElementById('activityTitle').value.trim();
	if(activityTitle == null || activityTitle == ""){
		hui.alert("请填入广告标题！");
		return;
	}
	var dataG = {'seq':seq,'goodsId':goodsIdArray,'activityTitle':activityTitle,'type':"title"}
	$.ajax({
		type:"post",
		url:'/localQuickPurchase/investmentGoods/saveInvestmentGoods',
		dataType:'json',
		contentType: "application/json;charset=utf-8",
		data :JSON.stringify(dataG),
		async : true,//异步请求
		success:function(data){
			if(data.code == 200){
				hui.toast("保存成功");
	            setTimeout(function(){
	            	//跳转到现场招商商品页面
	            	window.location.href="/localQuickPurchase/distributionVA/localeRecruit/setGoods";
				},500)
			}else if(data.code == 404){
				console.log(data.data.length);
				if(data.data.length == 0){
					hui.toast("请添加礼包!");
					return;					
				}
			}
		},
		error:function(data){
			hui.toast("网络异常,请稍后重试！");
		}
	});
}
//商品详情页
$(document).on('click', '.goodsDetails', function() {
	var goodsId = $(this).attr('id');
	var url = "/localQuickPurchase/distributionVA/goodsDetail/"+goodsId+"/0"+"/"+seq;
	window.location.href = url;
});
//礼包商品详情页
$(document).on('click', '.img-left', function() {
	var goodsId = $(this).attr('id');
	var url = "/localQuickPurchase/distributionVA/goodsDetail/"+goodsId+"/0"+"/"+seq;
	window.location.href = url;
});
/**
 <li>
	<img src="${base}/distributionApp/images/localeRecruit/set-goods.png" />
	<img src="${base}/distributionApp/images/localeRecruit/set-close.png" />
</li>
<li>
	<img src="${base}/distributionApp/images/localeRecruit/set-goods.png" />
	<img src="${base}/distributionApp/images/localeRecruit/set-close.png" />
</li>
<li>
	<img src="${base}/distributionApp/images/localeRecruit/set-goods.png" />
	<img src="${base}/distributionApp/images/localeRecruit/set-close.png" />
</li>
<li>
	<img src="${base}/distributionApp/images/localeRecruit/set-goods.png" />
	<img src="${base}/distributionApp/images/localeRecruit/set-close.png" />
</li>
<li>
	<img src="${base}/distributionApp/images/localeRecruit/set-goods.png" />
	<img src="${base}/distributionApp/images/localeRecruit/set-close.png" />
</li>
<li>
	<img src="${base}/distributionApp/images/localeRecruit/set-goods.png" />
	<img src="${base}/distributionApp/images/localeRecruit/set-close.png" />
</li>
<li>
	<img src="${base}/distributionApp/images/localeRecruit/set-goods.png" />
	<img src="${base}/distributionApp/images/localeRecruit/set-close.png" />
</li>
 
 */

/**
 <div id="set-list-1" style="display: block;" class="set-list">
	 <div class="set-list-item">
		<img class="img-left" src="${base}/distributionApp/images/localeRecruit/set-goods.png" />
		<div class="item-center">
			<p class="margin-t-3">好吃的粮油</p>
			<p class="font-sm color_gray margin-t-3">一句话简介，反正好厉害</p>
			<p class="font-lg margin-t-3">¥263</p>
		</div>
		<div class="img-right">
			<img src="${base}/distributionApp/images/localeRecruit/set-add2.png" />
			<p>加入礼包</p>
		</div>
	</div>
 </div>
 */
/**
<div class="set-goods">
			<div class="set_left">
				<img src="${base}/distributionApp/images/set-goods.png"/>
				<p class="margin-t-3 set-goods-title">来自法国的葡萄美酒</p>
				<p class="margin-t-3 set-goods-price">¥26.5</p>
				<span class="margin-t-3">严选</p>
			</div>
			<div class="set_right">
				<img src="${base}/distributionApp/images/set-goods.png"/>
				<p class="margin-t-3 set-goods-title">来自法国的葡萄美酒</p>
				<p class="margin-t-3 set-goods-price">¥26.5</p>
				<span class="margin-t-3">严选</p>
			</div>
		</div>
		<div class="set-goods">
			<div class="set_left">
				<img src="${base}/distributionApp/images/set-goods.png"/>
				<p class="margin-t-3 set-goods-title">来自法国的葡萄美酒</p>
				<p class="margin-t-3 set-goods-price">¥26.5</p>
				<span class="margin-t-3">严选</p>
			</div>
			<div class="set_right">
				<img src="${base}/distributionApp/images/set-goods.png"/>
				<p class="margin-t-3 set-goods-title">来自法国的葡萄美酒</p>
				<p class="margin-t-3 set-goods-price">¥26.5</p>
				<span class="margin-t-3">严选</p>
			</div>
		</div>
**/



