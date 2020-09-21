var globalpagenum=1;
function bankCardTab(obj){
	var reg = /^(\d{4})\d+(\d{4})$/;
	var state = $(obj).parent(".carditem").attr("data-state");
	var cardNo = $(obj).siblings(".cardNo").attr("data-val");
	var cardUser =$(obj).siblings(".cardUser").attr("data-val");
	if(state=="invisible"){
		$(obj).parent(".carditem").removeClass("invisible").addClass("visible");
		$(obj).parent(".carditem").attr("data-state","visible");
		$(obj).siblings(".cardNo").html(cardNo);
		$(obj).siblings(".cardUser").html(cardUser);
	}else if(state=="visible"){
		$(obj).parent(".carditem").removeClass("visible").addClass("invisible");
		$(obj).parent(".carditem").attr("data-state","invisible");
		$(obj).siblings(".cardNo").html(cardNo.replace(reg,"$1 **** $2"));
		$(obj).siblings(".cardUser").html(cardUser[0]+"**");
	}
}

function bankCardExit(obj){
	var state = $(obj).attr("data-state");
	$(".banckCardBox").attr("value","0");
	if(state=="0"){
		$(obj).html("取消");
		$(obj).attr("data-state","1");
		$("#bankCardList .carditem .eyes").hide();
		$("#bankCardList .carditem input[name='banckCardBox']").show();
		$("#delbut").show();
	}else if(state=="1"){
		$(obj).html("编辑");
		$(obj).attr("data-state","0");
		$("#bankCardList .carditem .eyes").show();
		$("#bankCardList .carditem input[name='banckCardBox']").hide();
		$("#bankCardList .carditem input[name='banckCardBox']").attr("checked",false);
		$("#delbut").hide();
	}
}

/*获取账户明细列表*/
function getDetailedlist(globalpagenum,obj){
	var code;
	code = initOrders2(true, globalpagenum,stimeA, etimeA); // index 页码
	if(globalpagenum < totalPage){
		obj.endPullupToRefresh(false);
	}else{
		// code = initOrders2(false, globalpagenum); // bTime false 不带时间查询, true 带时间查询. index 页码
		setTimeout(function(){
			obj.endPullupToRefresh(true);
		},1000);
	}
	return code;
}
/*账户明细列表加载更多数据*/
function moreDetailedData(){
	var obj=this;
	var code = getDetailedlist(globalpagenum,obj);
	if (code == 200) {
		++globalpagenum;
	}
}

/*获取个人业绩列表*/
function getResultslist(globalpagenum,obj){
	if(globalpagenum<3){
		var _listhtml="";
		for(var n=0;n<10;n++){
			_listhtml+="<li class='mui-table-view-cell list-item mui-tab-link' target='javascript:;'>";
			_listhtml+="<div class='item-head'>";
			_listhtml+="<div class='order-time'>2017-03-18 17:50:33</div>";
			_listhtml+="<div class='order-num'>订单号:2017052078562</div>";
			_listhtml+="</div>";
			_listhtml+="<div class='item-content mui-tab-item' target='shopDetail.html'>";
			_listhtml+="<div class='content-media'>";
			_listhtml+="<img src='../../img/2.jpg' />";
			_listhtml+="</div>";
			_listhtml+="<div class='content-info'>";
			_listhtml+="<div class='shop-name'>佰音KTV(员村店)</div>";
			_listhtml+="<div>";
			_listhtml+="<div class='order-money'>订单总金额：<span class='money-num'>2000</span>元</div>";
			_listhtml+="<div class='order-amount'>订单利润额：<span class='achi-num txt-red'>380元</span></div>";
			_listhtml+="</div>";
			_listhtml+="</div>";
			_listhtml+="<div class='arrow-right font-ico'>&#xe937;</div>";
			_listhtml+="</div>";
			_listhtml+="</li>";
		}
		$("#personalResultslist").append(_listhtml);
		obj.endPullupToRefresh(false);
	}else{
		setTimeout(function(){
			obj.endPullupToRefresh(true);
		},1000);
	}
}
/*个人业绩列表加载更多数据*/
function moreResultsData(){
	var obj=this;
	getResultslist(globalpagenum,obj)
	++globalpagenum;
}

/*获取提现列表*/
function getWithdrawalList(globalpagenum,obj){
	var seq = userSeq;
	$.ajax({
		url : '/localQuickPurchase/withdrawalsAction/findWithdrawals',
		type : 'POST',
		data : {
			seq : seq,
			pageIndex : globalpagenum,
			pageSize : 10
		},
		async : false,
		dataType : 'json',
		success : function(data) {
			var text = data.data;
			if(text.length > 0){
				var _listhtml="";
				for(var n=0;n<text.length;n++){
					var applyDate;
					if(text[n].applyDate != null){
						applyDate = Format(new Date(text[n].applyDate),"yyyy-MM-dd HH:mm:ss");
					}
					_listhtml+="<div class='listitem'>";
					_listhtml+="<div class='itemtop'>";
					_listhtml+="<span class='it-account'>"+text[n].bankCarNumber+"</span>";
					_listhtml+="<span class='it-date'>"+applyDate+"</span>";
					_listhtml+="</div>";
					_listhtml+="<div class='itembottom'>";
					_listhtml+="<span class='ib-amount'>提现金额：<i>&yen;<b>"+text[n].cashMoney+"</b></i></span>";
					if(text[n].state == 1){
						_listhtml+="<span class='ib-state blue-txt'>已提款</span>";
					}else if(text[n].state == 2){
						_listhtml+="<span class='ib-state red-txt'>审核失败</span>";
					} else{
						_listhtml+="<span class='ib-state red-txt'>处理中</span>";
					}
					
					_listhtml+="</div></div>";
				}
				$("#withdrawallist").append(_listhtml);
				obj.endPullupToRefresh(false);
			}else{
				setTimeout(function(){
					obj.endPullupToRefresh(true);
				},1000);
			}
		},
		error : function(error) {
			$.alert("网络错误！！");
		}
	});
	
}
/*提现列表加载更多数据*/
function moreWithdrawalData(){
	var obj=this;
	getWithdrawalList(globalpagenum,obj)
	++globalpagenum;
}

/*获取收藏夹列表*/
function getFavoritesList(globalpagenum,obj){
	if(globalpagenum<3){
		var _listhtml="";
		for(var n=0;n<10;n++){
			_listhtml+="<div class='listitem'>";
			_listhtml+="<div class='mui-tab-link li-left' target='javascript:;'>";
			_listhtml+="<div class='lil-img'><img src='../../img/goods-img.png' /></div>";
			_listhtml+="<div class='lil-ifon'>";
			_listhtml+="<p class='lili-tit'>好日子香烟真的好</p>";
			_listhtml+="<p class='lili-price'>分销价格：24元/包</p>";
			_listhtml+="<p class='lili-sales'>销售量：25468条</p>";
			_listhtml+="</div></div>";
			_listhtml+="<div class='li-right'>";
			_listhtml+="<div class='mui-tab-method lir-share' onclick='javascript:shareGoods();'>分享商品</div>";
			_listhtml+="<div class='mui-tab-method lir-cancel' onclick='javascript:cancelCollect();'>取消收藏</div>";
			_listhtml+="</div></div>";
		}
		$("#favoriteslist").append(_listhtml);
		obj.endPullupToRefresh(false);
	}else{
		setTimeout(function(){
			obj.endPullupToRefresh(true);
		},1000);
	}
}
/*收藏夹列表加载更多数据*/
function moreFavoritesData(){
	var obj=this;
	getFavoritesList(globalpagenum,obj)
	++globalpagenum;
}
/*收藏夹分享商品*/
function shareGoods(obj){
	var favoritesId=$(obj).attr("data-id");
	location.href="shareGoods.jsp?favoritesId="+favoritesId;
}
/*收藏夹取消收藏*/
function cancelCollect(){
	alert("cancel");
}
/*商品列表收藏按钮*/
function collect(obj){
	var state=$(obj).attr("data-state");
	if(state=="collect"){
		$(obj).removeClass("yes");
		$(obj).attr("data-state","notcollect");
	}else if(state=="notcollect"){
		$(obj).addClass("yes");
		$(obj).attr("data-state","collect");		
	}
}
/*获取我的服务商列表*/
function getServiceProviderslist(globalpagenum,obj){
	if(globalpagenum<3){
		var _listhtml="";
		for(var n=0;n<10;n++){
			_listhtml+="<div class='listitem mui-tab-link' target='serviceGoods.html'>";
			_listhtml+="<div class='li-img'><img src='../../img/store-img.png' /></div>";
			_listhtml+="<div class='li-info'>";
			_listhtml+="<p class='lii-name'>欧阳盛通</p>";
			_listhtml+="<p class='lii-tel'>电话：18524698675</p>";
			_listhtml+="<div class='lii-address'>";
			_listhtml+="<span>地址：</span>";
			_listhtml+="<p>广东省汕尾市XXXXXXXXXXX路23号</p>";
			_listhtml+="</div></div>";
			_listhtml+="<i class='mui-icon mui-icon-arrowright'></i></div>";
		}
		$("#serviceProviderslist").append(_listhtml);
		obj.endPullupToRefresh(false);
	}else{
		setTimeout(function(){
			obj.endPullupToRefresh(true);
		},1000);
	}
}
/*我的服务商列表加载更多数据*/
function moreServiceProvidersData(){
	var obj=this;
	getServiceProviderslist(globalpagenum,obj)
	++globalpagenum;
}
/*获取商品列表*/
function getServiceGoodslist(globalpagenum,obj){
	if(globalpagenum<3){
		var _listhtml="";
		for(var n=0;n<10;n++){
			_listhtml+="<div class='listitem'>";
			_listhtml+="<div class='lt-info mui-tab-link' target='javascript:;'>";
			_listhtml+="<img src='../../img/goods-img.png' class='lti-img' />";
			_listhtml+="<div class='lti-con'>";
			_listhtml+="<p class='ltic-name'>好日子香烟真的好</p>";
			_listhtml+="<p class='ltic-price'>价格：24元/包</p>";
			_listhtml+="</div></div>";
			_listhtml+="<span class='collect mui-tab-method yes' onclick='javascript:collect(this);' data-state='collect' ><i class='iconfont icon-xin'></i>加入收藏夹</span>";
			_listhtml+="<i class='mui-icon mui-icon-arrowright'></i></div>";
		}
		$("#serviceGoodslist").append(_listhtml);
		obj.endPullupToRefresh(false);
	}else{
		setTimeout(function(){
			obj.endPullupToRefresh(true);
		},1000);
	}
}
/*商品列表加载更多数据*/
function moreServiceGoodsData(){
	var obj=this;
	//getServiceGoodslist(globalpagenum,obj)
	data.functions.init();
	++globalpagenum;
}
/*获取投诉信息列表*/
function getComplaintlist(globalpagenum,obj){
	var seq = userSeq;
	$.ajax({
		url : '/localQuickPurchase/complainAction/findByUserSeq',
		type : 'POST',
		data : {
			userSeq : seq,
			pageIndex : globalpagenum,
			pageSize : 10
		},
		async : false,
		dataType : 'json',
		success : function(data) {
			var text = data.data;
			var code = data.code;
			if(code == 200){
				if(text.length > 0){
					var _listhtml="";
					for(var n=0;n<text.length;n++){
						var complainDate;
						if(text[n].complain.complainDate != null){
							complainDate = Format(new Date(text[n].complain.complainDate),"yyyy-MM-dd HH:mm:ss");
						}
						var imgUrl = text[n].goodsImgUrl;
						if(imgUrl == ""){
							imgUrl = "/localQuickPurchase/imgback/shopDefault.jpg";
						}
						_listhtml+="<div class='listitem'>";
						_listhtml+="<div class='li-top'>";
						_listhtml+="<span class='lit-tel'>"+text[n].complain.userName+"</span>";
						_listhtml+="<span class='lit-time'>"+complainDate+"</span>";
						_listhtml+="</div>";
						_listhtml+="<div class='li-info'>"+text[n].complain.remarks+"</div>";
						_listhtml+="<div class='li-goods'>";
						_listhtml+="<img src='"+imgUrl+"' class='lig-img' />";
						_listhtml+="<p class='lig-name'>"+text[n].goodsName+"</p>";
						_listhtml+="</div>";
						_listhtml+="</div>";
					}
					$("#complaintlist").append(_listhtml);
					obj.endPullupToRefresh(false);
				}else{
					setTimeout(function(){
						obj.endPullupToRefresh(true);
					},1000);
				}
				
			}else{
				setTimeout(function(){
					obj.endPullupToRefresh(true);
				},1000);
			}
		},
		error : function(error) {
			$.alert("网络错误！！");
		}
	});
	
}
/*投诉信息列表加载更多数据*/
function moreComplaintData(){
	var obj=this;
	getComplaintlist(globalpagenum,obj)
	++globalpagenum;
}
/*招募信息列表*/
function getRecruitlist(globalpagenum,obj){
	if(globalpagenum<3){
		var _listhtml="";
		for(var n=0;n<10;n++){
			_listhtml+="<div class='listitem'>";
			_listhtml+="<div class='lt-top'>";
			_listhtml+="<img src='../../img/store-img.png' class='ltt-img' />";
			_listhtml+="<div class='ltt-info'>";
			_listhtml+="<p class='ltti-top'>";
			_listhtml+="<span class='lttit-name'>欧阳盛通</span>";
			_listhtml+="<span class='lttit-tel'>18524698675</span>";
			_listhtml+="</p>";
			_listhtml+="<p class='ltti-address'>地址：广东省汕尾市XXXXXXXXXXX路23号</p>";
			_listhtml+="</div>";
			_listhtml+="</div>";
			_listhtml+="<div class='lt-bottom'>";
			_listhtml+="<button type='button' class='mui-btn mui-tab-method' onclick='javascript:refused();'>拒绝</button>";
			_listhtml+="<button type='button' class='mui-btn mui-btn-danger mui-tab-method' onclick='javascript:accept();'>接受</button>";
			_listhtml+="</div>";
			_listhtml+="</div>";
		}
		$("#recruitlist").append(_listhtml);
		obj.endPullupToRefresh(false);
	}else{
		setTimeout(function(){
			obj.endPullupToRefresh(true);
		},1000);
	}
}
/*招募信息列表加载更多数据*/
function moreRecruitData(){
	var obj=this;
	getRecruitlist(globalpagenum,obj)
	++globalpagenum;
}
/*招募信息拒绝按钮*/
function refused(){
	alert("我拒绝");
}
/*招募信息接受按钮*/
function accept(){
	alert("我接受");
}

$(function(){
	/*银行卡页面初始化*/
	if($("#bankCardList").length>0){
		var reg = /^(\d{4})\d+(\d{4})$/;
		$(".carditem").each(function(){
			var cardNo = $(this).find(".cardNo").attr("data-val");
			var cardUser =$(this).find(".cardUser").attr("data-val");
			$(this).find(".cardNo").html(cardNo.replace(reg,"$1 **** $2"));
			$(this).find(".cardUser").html(cardUser[0]+"**");
		})
	}
	/*添加银行卡*/
	$(".addcard").click(function(){
		$("#addbut").html("添加银行卡");
		$("#addbut").attr("value","");
		$("#addpanel").show();
	});
	$("#addpanel").on("click","#cancelbut",function(){
		$("#addpanel").hide();
		$("#user").val("");
		$("#typeId").val("");
		$("#typeCode").val("");
		$("#cardName").val("");
		$("#cardAddress").val("");
		$("#cardNumber").val("");
		// 隐藏删除按钮
		$("#delbut").hide();
		// 移除disabled属性
//		$("#user").removeAttr("disabled");
//		$("#cardName").removeAttr("disabled");
//		$("#cardAddress").removeAttr("disabled");
//		$("#cardNumber").removeAttr("disabled");
	})
	/*提现申请全部提现*/
	$("#withdrawalfrom").on("click",".mentionbut",function(){
		var amount = $(this).attr("data-val");
		$("#withdrawalfrom input[name='amount']").val(amount);
	})
	/*账户明细下拉加载*/
	if($("#accountlist").length>0){console.info(1);
		mui.init({
		  	pullRefresh : {
			  	container:"#muiscroll",
			  	down: {
					callback: function() {
//						var self = this;
//						setTimeout(function() {
//							var ul = self.element.querySelector('.mui-table-view');
//							globalpagenum = 1; // 刷新重置页码
//							var code0 = initOrders2(globalpagenum); // index 页码
//							if (code0 == 200) {
//								globalpagenum++;
//							}
//							 self.endPullDownToRefresh();
//						}, 1000);
						window.location.reload(true);
					}
				},
		  		up : {
			  		height:50,
			  		auto:true,
		  			contentrefresh : "正在加载...",
			  		contentnomore:'没有更多数据了',
			  		callback :moreDetailedData 
				}
			}
		});
	}
	/*个人业绩下拉加载*/
	if($("#personalResultslist").length>0){
		mui.init({
		  	pullRefresh : {
			  	container:"#muiscroll",
		  		up : {
			  		height:50,
			  		auto:true,
		  			contentrefresh : "正在加载...",
			  		contentnomore:'没有更多数据了',
			  		callback :moreResultsData 
				}
			}
		});
	}
	/*提现列表下拉加载*/
	if($("#withdrawallist").length>0){
		mui.init({
		  	pullRefresh : {
			  	container:"#muiscroll",
		  		up : {
			  		height:50,
			  		auto:true,
		  			contentrefresh : "正在加载...",
			  		contentnomore:'没有更多数据了',
			  		callback :moreWithdrawalData 
				}
			}
		});
	}
	/*收藏夹列表下拉加载*/
	if($("#favoriteslist").length>0){
		mui.init({
		  	pullRefresh : {
			  	container:"#muiscroll",
		  		up : {
			  		height:50,
			  		auto:true,
		  			contentrefresh : "正在加载...",
			  		contentnomore:'没有更多数据了',
			  		callback :moreFavoritesData 
				}
			}
		});
	}
	/*我的服务商列表下拉加载*/
	if($("#serviceProviderslist").length>0){
		mui.init({
		  	pullRefresh : {
			  	container:"#muiscroll",
		  		up : {
			  		height:50,
			  		auto:true,
		  			contentrefresh : "正在加载...",
			  		contentnomore:'没有更多数据了',
			  		callback :moreServiceProvidersData 
				}
			}
		});
	}
	/*商品列表下拉加载*/
	if($("#serviceGoodslist").length>0){
		mui.init({
		  	pullRefresh : {
			  	container:"#muiscroll",
		  		up : {
			  		height:50,
			  		auto:true,
		  			contentrefresh : "正在加载...",
			  		contentnomore:'没有更多数据了',
			  		callback :moreServiceGoodsData 
				}
			}
		});
	}
	/*投诉信息下拉加载*/
	if($("#complaintlist").length>0){
		mui.init({
		  	pullRefresh : {
			  	container:"#muiscroll",
		  		up : {
			  		height:50,
			  		auto:true,
		  			contentrefresh : "正在加载...",
			  		contentnomore:'没有更多数据了',
			  		callback :moreComplaintData 
				}
			}
		});
	}
	/*招募信息下拉加载*/
	if($("#recruitlist").length>0){
		mui.init({
		  	pullRefresh : {
			  	container:"#muiscroll",
		  		up : {
			  		height:50,
			  		auto:true,
		  			contentrefresh : "正在加载...",
			  		contentnomore:'没有更多数据了',
			  		callback :moreRecruitData 
				}
			}
		});
	}
})
