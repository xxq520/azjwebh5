var keyWord;
var muiObj;
var pageSize = 10;	//分类显示条数
var classifyPageIndex = 1;	//分类页码
var downFlag = true; //滚动条标识 :true 为全部类别的商品 , false 单个分类下的商品
var categoryId;	//分类Id
$(function(){
	var  masterSeq=getQueryString("masterSeq");

	var initData={ 

			//是否有下一页
			"hasNextPage":true,
			//参数
			"param":{"masterSeq":masterSeq,"distributorSeq":userSeq,"pageSize":10,"pageIndex":1,"keyWord":'',"categoryId":''},
			"functions":{  
				"init" :function(json,obj){
					var goods = json.list;
					var html = "";
					for(var i = 0;i<goods.length;i++){
						html+='<div class="listitem">';
						html+='<div class="lt-info mui-tab-link" target="javascript:;">';
						html+='<img src="'+goods[i].distributionGoods.thumbnail+'" class="lti-img" />';
						html+='<div class="lti-con">';
						html+='<p class="ltic-name">'+goods[i].distributionGoods.goodsName+'</p>';
						html+='<p class="ltic-price">价格：'+(goods[i].distributionGoods.distributionPrice).toFixed(2)+'元/'+goods[i].distributionGoods.unit+'</p>';
						html+='</div>';
						html+='</div>';
						if(goods[i].isFavorites)
							html+='<a ><span goodsId="'+goods[i].distributionGoods.goodsId+'" isFavorites="'+goods[i].isFavorites+'" class="collect mui-tab-method yes" style="color:#999999"  data-state="collect" ><i class="iconfont icon-xin" ></i>移出收藏夹</span></a>';
						else
							html+='<a ><span goodsId="'+goods[i].distributionGoods.goodsId+'" isFavorites="'+goods[i].isFavorites+'" class="collect mui-tab-method yes" style="color:#999999"  data-state="collect" ><i class="iconfont icon-xin" style="color:#999999"></i>加入收藏夹</span></a>';
						//html+='<i class="mui-icon mui-icon-arrowright"></i>';
						html+='</div>';
						//alert(goods[i].distributionGoods.goodsId+"-->");
					}
					$("#serviceGoodslist").append(html);
					initData.hasNextPage = json.hasNextPage;
					obj.endPullupToRefresh(false);
					if(json.hasNextPage){
						$("#nothing").hide();
						$("#having").show();
					}else{
						$("#nothing").show();
						$("#having").hide();
					}
				},
				"initClass" :function(json,obj){
					var goods = json.list;
					var html = "";
					for(var i = 0;i<goods.length;i++){
						html+='<div class="listitem">';
						html+='<div class="lt-info mui-tab-link" target="javascript:;">';
						html+='<img src="'+goods[i].distributionGoods.thumbnail+'" class="lti-img" />';
						html+='<div class="lti-con">';
						html+='<p class="ltic-name">'+goods[i].distributionGoods.goodsName+'</p>';
						html+='<p class="ltic-price">价格：'+(goods[i].distributionGoods.distributionPrice).toFixed(2)+'元/'+goods[i].distributionGoods.unit+'</p>';
						html+='</div>';
						html+='</div>';
						if(goods[i].isFavorites)
							html+='<a ><span goodsId="'+goods[i].distributionGoods.goodsId+'" isFavorites="'+goods[i].isFavorites+'" class="collect mui-tab-method yes" style="color:#999999"  data-state="collect" ><i class="iconfont icon-xin" ></i>移出收藏夹</span></a>';
						else
							html+='<a ><span goodsId="'+goods[i].distributionGoods.goodsId+'" isFavorites="'+goods[i].isFavorites+'" class="collect mui-tab-method yes" style="color:#999999"  data-state="collect" ><i class="iconfont icon-xin" style="color:#999999"></i>加入收藏夹</span></a>';
						//html+='<i class="mui-icon mui-icon-arrowright"></i>';
						html+='</div>';
						//alert(goods[i].distributionGoods.goodsId+"-->");
					}
					$("#serviceGoodslist").append(html);
					initData.hasNextPage = json.hasNextPage;
					obj.endPullupToRefresh(false);
					if(json.hasNextPage){
						$("#nothing").hide();
						$("#having").show();
					}else{
						$("#nothing").show();
						$("#having").hide();
					}
				},
				"sendUrl":function(obj){
					$.ajax({
						type : 'POST',
						contentType: "application/json;charset=utf-8",

						url : '/localQuickPurchase/dGoodsAction/dgSH',

						data : JSON.stringify(initData.param),
						async : true,
						dataType : 'JSON',
						success : function(result) {
							var goods = result.data;
							if(goods==null){
								muiObj.endPullupToRefresh(false);
								return mui.toast("没数据");
							}
							initData.functions.init(goods,obj);
						},
						error : function(err) {
							mui.toast("error");
						}
					});
				},
				"getClassifyGoods" : function(categoryId, isEmpty) {
					$.ajax({
						type : "get",//定义提交的类型
						//contentType: "application/json;charset=utf-8",
						url : '/localQuickPurchase/dGoodsAction/queryByCIdD',
						data : {
							"seq" :	masterSeq,
							"categoryId" : categoryId,
							"pageSize" : pageSize,
							"distributorSeq" : userSeq,
							"pageIndex" : classifyPageIndex
						},
						async : false,//是否异步请求，false为同步
						success : function(data) {//成功返回值执行函数 
							//console.log(data);
							if (data.code == 200) {
								//classifyPageIndex++;
								if (isEmpty) {
									$("#serviceGoodslist").empty();
								}
								var goodss = data.data;
								if(goodss == null){
									muiObj.endPullupToRefresh(false);
									return mui.toast("没数据");
								}
								initData.functions.initClass(goodss, muiObj);
							} else {
								return mui.toast(data.message);
							}
						}
					});
				},

				/*,"a":function(){
					$(window).scroll(function(){  
						var $this =$(this),  
						viewH =$(this).height(),//可见高度  
						contentH =$(this).get(0).scrollHeight,//内容高度  
						scrollTop =$(this).scrollTop();//滚动高度  
						//if(contentH - viewH - scrollTop <= 100) { //到达底部100px时,加载新内容  
						if(scrollTop/(contentH -viewH)>=0.95){ //到达底部100px时,加载新内容  
							// 这里加载数据..  
							alert("1");
						}  
					});  

				}*/
				"pullDownLoading": function() {
		            if (this.loading) {
		                return;
		            }
		            if (!this.pullDownTips) {
		                this.initPullDownTips();
		                this.dragEndAfterChangeOffset(true);
		                return;
		            }
		            this.loading = true;
		            this.pullDownTips.classList.add(CLASS_TRANSITIONING);
		            this.pullDownTips.style.webkitTransform = 'translate3d(0,' + this.options.down.height + 'px,0)';
		            this.options.down.callback.apply(this);
		            /*下拉刷新把提示文字改回去*/
		            this.pullUpTipsIcon.innerHTML = this.options.up.contentdown;
		        }
			}
	}
	//data.functions.sendUrl();

	/*我的服务商列表下拉加载*/
	if($("#serviceGoodslist").length>0){
		mui.init({
			pullRefresh : {
				container:"#muiscroll",
				down: {
					callback: function() {
						window.location.reload(true);
					}
				},
				up : {
					height:50,
					auto:true,
					contentrefresh : "正在加载...",
					contentnomore:'没有更多数据了',
					//callback :moreServiceProvidersData 
					callback :function(){
						muiObj = this;
						if(!initData.hasNextPage){
							muiObj.endPullupToRefresh(false);
							if($(".noMoreTips").length==0){
								$("#serviceGoodslist").append('<p class="noMoreTips">没有更多数据了</p>');
							}
							return;
						}
						if (downFlag) {
							//console.log(initData.param.pageIndex);
							initData.functions.sendUrl(muiObj);
							initData.param.pageIndex++;
						} else {
							//initData.functions.initClass(goodss, muiObj);
							classifyPageIndex++; 
							initData.functions.getClassifyGoods(categoryId);
						}
					}
				}
			}
		});
	}


	//data.functions.a();
	//滚动条距底部的距离  
	/* var BOTTOM_OFFSET = 0;  

	 $(window).scroll(function () {  
     	$("#serviceGoodslist").val($(document).scrollTop());// 获取垂直滚动的距离  即当前滚动的地方的窗口顶端到整个页面顶端的距离
      console.info($("#serviceGoodslist").val());
     	  var $currentWindow = $(window);  
         //当前窗口的高度  
         var windowHeight = $currentWindow.height();  
         console.log("current widow height is " + windowHeight);  
       //  alert(windowHeight);
         //当前滚动条从上往下滚动的距离  
         var scrollTop = $currentWindow.scrollTop();  
         console.log("current scrollOffset is " + scrollTop);  
         //当前文档的高度  
         var docHeight = $(document).height();  
         console.log("current docHeight is " + docHeight);  
       //  alert(docHeight);
         //当 滚动条距底部的距离 + 滚动条滚动的距离 >= 文档的高度 - 窗口的高度  
         //换句话说：（滚动条滚动的距离 + 窗口的高度 = 文档的高度）  这个是基本的公式  
         if ((BOTTOM_OFFSET + scrollTop) >= docHeight - windowHeight) {  
        	 if(!data.hasNextPage)
        		 return;
        	 data.param.pageIndex++;
        	 data.functions.sendUrl();
         }  
     });*/

	var collectState = false;
	//收藏
	mui('body').on('tap','.collect',function(){
		if(collectState){
			return;
		}
		collectState=true;
		var $this = $(this);
		var isFavorites = $(this).attr("isFavorites");
		var goodsId = $(this).attr("goodsId");
		var url = "/localQuickPurchase/favoritesAction/";
		url+=isFavorites=="true"?"remove":"add";
		$.post(url,{"goodsId":goodsId,"distributorSeq":initData.param.distributorSeq},function(result){
			
			if(result.code==200){
				
				var msg = "";
				if(isFavorites=="true"){
					msg = "取消";
					$this.find(".iconfont").css("color","#999999");
					$this.attr("isFavorites","false");
				}else{
					msg = "收藏";
					$this.find(".iconfont").css("color","#f05936");
					$this.attr("isFavorites","true");
				}
				mui.toast(msg+"成功");
				//alert((isFavorites=="true"?"取消":"收藏")+"成功");
				/*setTimeout(function(){
					location.reload();
				},2000)*/
			}else{
				//alert("操作失败");
				mui.toast("操作失败");
			}
			collectState=false;
		});
	});
	

	//搜索
	mui('body').on('tap','.seaBtn',function(){
		//mui('#muiscroll').pullRefresh().refresh(true);
		mui('#muiscroll').pullRefresh().scrollTo(0, 0, 100);
		//mui("#muiscroll").scroll().scrollTo(0,-100,0);
		initData.param.pageIndex=1;
		downFlag = true;
		//muiObj.pullDownLoading();
		//$(this).siblings().val();
		keyWord = $(".seaWarp input").val();
		initData.param.keyWord = keyWord;
		initData.param.categoryId = categoryId;
		//var o = this;
		//data.functions.sendUrl(o);
		var param = {"masterSeq":masterSeq,"distributorSeq":userSeq,"pageSize":10,"pageIndex":1
				,"keyWord":keyWord,"categoryId":categoryId};
		//console.log(keyWord);
		//console.log(param);
		$.ajax({
			type : "post",//定义提交的类型
			contentType: "application/json;charset=utf-8",
			url : '/localQuickPurchase/dGoodsAction/dgSH',
			data : JSON.stringify(param),
			async : false,//是否异步请求，false为同步
			success : function(data) {//成功返回值执行函数 
				//console.log(data);
				var data1 = data.data;
				if(data1!=null)
					$("#serviceGoodslist").html("");
					initData.functions.init(data1,muiObj);
				/*if (data.code == 200) {
					var goods = data.data.list;
					var html = "";
					for(var i = 0;i<goods.length;i++){
						html+='<div class="listitem">';
						html+='<div class="lt-info mui-tab-link" target="javascript:;">';
						html+='<img src="'+goods[i].distributionGoods.thumbnail+'" class="lti-img" />';
						html+='<div class="lti-con">';
						html+='<p class="ltic-name">'+goods[i].distributionGoods.goodsName+'</p>';
						html+='<p class="ltic-price">价格：'+(goods[i].distributionGoods.distributionPrice).toFixed(2)+'元/'+goods[i].distributionGoods.unit+'</p>';
						html+='</div>';
						html+='</div>';
						if(goods[i].isFavorites)
							html+='<a ><span goodsId="'+goods[i].distributionGoods.goodsId+'" isFavorites="'+goods[i].isFavorites+'" class="collect mui-tab-method yes" style="color:#999999"  data-state="collect" ><i class="iconfont icon-xin" ></i>加入收藏夹</span></a>';
						else
							html+='<a ><span goodsId="'+goods[i].distributionGoods.goodsId+'" isFavorites="'+goods[i].isFavorites+'" class="collect mui-tab-method yes" style="color:#999999"  data-state="collect" ><i class="iconfont icon-xin" style="color:#999999"></i>加入收藏夹</span></a>';
						//html+='<i class="mui-icon mui-icon-arrowright"></i>';
						html+='</div>';
						//alert(goods[i].distributionGoods.goodsId+"-->");
					}
					//console.log(html);
					$("#serviceGoodslist").append(html);
//					data.hasNextPage = json.hasNextPage;
//					//obj.endPullupToRefresh(false);
//					if(json.hasNextPage){
//						$("#nothing").hide();
//						$("#having").show();
//					}else{
//						$("#nothing").show();
//						$("#having").hide();
//					}
				}*/
			}
		});
		/*mui.init({
			pullRefresh : {
				container:"#muiscroll",
				down: {
					callback: function() {
						window.location.reload(true);
					}
				},
				up : {
					height:50,
					auto:true,
					contentrefresh : "正在加载...",
					contentnomore:'没有更多数据了',
					//callback :moreServiceProvidersData,
					callback :function(){
						var o = this;
						if(!data.hasNextPage){
							setTimeout(function(){
								o.endPullupToRefresh(true);
							},1000);
							return;
						}
						data.param.keyWord=keyWord;
						console.log(data.param.keyWord);
						data.functions.sendUrl(o) ;
						data.param.pageIndex++;
					}
				}
			}
		});*/
	});
	
	//点击分类分类事件,并修改样式
	mui("body").on("tap",".group button",function(){
		classifyPageIndex = 1;
		downFlag = false;
		//console.log($(this).attr("id"));
		mui('#muiscroll').pullRefresh().scrollTo(0, 0, 100);
		categoryId = $(this).attr("id");
		console.log(categoryId);
		if (categoryId == "全部") {
			categoryId = null;
			console.log(categoryId);
		}
		initData.functions.getClassifyGoods(categoryId, true);
		$(this).addClass("active").siblings().removeClass("active");
	});
	
	test();
	function test() {
		$.ajax({
			type : "get",//定义提交的类型
			//contentType: "application/json;charset=utf-8",
			url : '/localQuickPurchase/dGoodsAction/getCategoryId',
			data : {
				"seq" : masterSeq,
				"queryType" : 2
			},
			async : true,//是否异步请求，false为同步
			success : function(data) {//成功返回值执行函数 
				if (data.code == 200) {
					console.log(data);
					for (var i = 0; i < data.data.length; i++) {
						if (i == 0) {
							$(".group-content").append('<button class="active" id="全部">全部</button>');
						}
						var id = data.data[i].id;
						var _html = '<button id="'+ id +'">'+ data.data[i].name +'</button>';
						$(".group-content").append(_html);
					}
				} else {
					
				}
			}
		});
	}
	
	//根据分类获取分类商品(不用)
	function getClassifyGoods(categoryId) {
		$.ajax({
			type : "get",//定义提交的类型
			//contentType: "application/json;charset=utf-8",
			url : '/localQuickPurchase/dGoodsAction/queryByCId',
			data : {
				"seq" :	masterSeq,
				"categoryId" : categoryId,
				"pageSize" : pageSize,
				"pageIndex" : classifyPageIndex
			},
			async : false,//是否异步请求，false为同步
			success : function(data) {//成功返回值执行函数 
				console.log(data);
			}
		});
	}
	
});
