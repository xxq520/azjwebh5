


$(function(){
	if(userSeq==0){
		location.href="../login.jsp"
	}
	var param = {
			"distributorSeq":userSeq,//分销商seq
			"pageSize":10,
			"pageIndex":1
	};

	var data={
			"hasNextPage":true,
			"init":function(obj){
				$.ajaxSetup({ 
				    async : false 
				}); 
				$.post("/localQuickPurchase/dApplicationAction/findDistributorService",param,function(result){
					if(result.code==200){
						var shops = result.data.list;
						var html="";
						for(var i = 0;i<shops.length;i++){
							if(shops[i]==null)
								continue;
							html+='<div class="listitem mui-tab-link">';
							html+='<a href="javascript:void(0);" >';
							html+='<div class="li-img"><img src="'+shops[i].shop.shopHeadImgPath+'" onerror="this.src=\'/localQuickPurchase/distribution/img/head.png;this.onerror=null;\'" /></div>';
							html+='<div class="li-info">';
							html+='<p class="lii-name">'+((shops[i].shop.shopname==null)?"":shops[i].shop.shopname)+'</p>';
							html+='<p class="lii-tel">电话：'+shops[i].shop.mobile+'</p>';
							html+='<div class="lii-address">';
							html+='<span>地址：</span>';
							html+='<p>'+shops[i].shop.adressdetail+'</p>';
							html+='</div>';
							html+='<div class="lii-address">';
							html+='<span>状态：</span>';
							var state = shops[i].dis.state;
							if(state==0){
								html+='<p style="color:red;">待审批</p>';
							}else if(state==1){
								html+='<p style="color:#333">已通过</p>';
							}else if(state==2){
								html+='<p style="color:red;">已拒绝</p>';
							}
							html+='</div>';
							html+='</div>';
							html+='</a>';
							html+='</div>';
						}

						$("#serviceProviderslist").append(html);
						obj.endPullupToRefresh(false);
						data.hasNextPage=result.data.hasNextPage;
						
						if(data.hasNextPage){
							mui('#muiscroll').pullRefresh().enablePullupToRefresh();
						}else{
							mui('#muiscroll').pullRefresh().pullupLoading();
						}
						
					}else if(result.code==400){
					//	alert("没数据");
					}else
						alert("加载失败");
				});
			}
	};
//	data.init();
	
	  //滚动条距底部的距离  
 /*   var BOTTOM_OFFSET = 0;  
	
	 $(window).scroll(function () {  
     	$("#serviceProviderslist").val($(document).scrollTop());// 获取垂直滚动的距离  即当前滚动的地方的窗口顶端到整个页面顶端的距离
      console.info($("#serviceProviderslist").val());
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
        	 param.pageIndex++;
        	 setTimeout(function(){
        		 data.init();
				},500)
         }  
     });*/
	
	/*我的服务商列表下拉加载*/
	if($("#serviceProviderslist").length>0){
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
						var o = this;
						if(!data.hasNextPage){
							setTimeout(function(){
								o.endPullupToRefresh(true);
							},1000);
							return;
						}
						//data.functions.sendUrl(o) ;
						//data.param.pageIndex++;
						data.init(o);
						param.pageIndex++;
					}
				}
			}
		});
	}
	
	$(document).on("tap",".a_serviceGoods",function(){
		//alert($(this).attr("href"));
		location.href=$(this).attr("href");
	});
});
function toHref(str){
	return location.href=str;
}
