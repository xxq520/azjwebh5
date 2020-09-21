var pageStart = 1; /*offset*/
var pageSize = 10; /*size*/
var isEnd = false;/*滚动结束标志*/
var lat, lng;

$(function() {
	//监听加载更多
	$('body').on('click', '.look-more', function(){ 
        pageStart ++;
        serverLists(lat,lng,pageStart, pageSize);
    });
	
});


//查询出附近商家列表
function serverLists(lat,lng,pageStart,pageSize){
	//mui.toast("lat :" +lat +"lng : "+lng);
	if(pageStart == null ||pageSize == null ){
		 pageStart = 1; 
		 pageSize = 10;
	}
	$.ajax({
		url : "/localQuickPurchase/shopMongo/findBroundServer",
		type : "POST",
		data : {
			lat : lat,	
			lng : lng,
			pageIndex : pageStart,
			pageSize : pageSize
		},
		async : true,
		dataType : "json",
		success : function(data) {
			if (data.code == 200) {
				var page = data.data.page;
				var list = page.list;
				var totalPage = page.totalPage;
				console.info(list);
						var html = "";
						for (var i = 0; i < list.length; i++) {
							$(".look-more").show();
							$(".sl-tit").show();
							isEnd = false;//没有更多了
							
							var shopHeadImgPath=list[i].shopHeadImgPath;//店头照
							var shopName=list[i].shopName;//店名
							var seq = list[i].seq;
							var mobile=list[i].mobile;//
							var dealName=list[i].dealName;//店铺类型
							var contact=list[i].contact;////业务联系人姓名
							var serverTime=list[i].serverTime;//时间
							var adressDetail=list[i].adressDetail;//地址全称(包括省市县镇村)  一般指收货地址 
							var adress = list[i].province+list[i].city+list[i].area+list[i].street;
							adressDetail = adressDetail==null ? adress:adressDetail;
							html+="<div class='list-item'>";
							html+="<div class='store-but' data-seq='"+seq+"'><input class='buttonRight' type='button' value='成为分销商' /></div>"
							html+="<div class='item-img'><img class='middle' src='"+shopHeadImgPath+"'></div>";
							html+="<div class='item-ifon'>";
							html+="<div class='store-tit'><i>[推荐]</i>"+shopName+"</div>";
							html+="<div class='store-date'>店铺类型 : "+dealName+"</div>";
							
							html+="<div class='store-address'>店铺地址 : "+ adressDetail +"</div></div>";
							html+="<div class='preferential-layer'>";
							html+="<div class='preferential-list'>";
							html+="</div></div></div></div>"
						}
						$('#s-loading-con').append(html);
						/*隐藏more按钮*/
			            if ( totalPage <= pageStart){
			                $(".look-more").hide();
			                isEnd = true;//没有更多了
			            }else{
			                $(".look-more").show();
			            }
			} else {
				$(".look-more").hide();
				$(".sl-tit").hide();
				isEnd = true;//没有更多了
				
				mui.toast(data.message);
				window.location.reload();
		}
			
		},
		error : function(error) {
			$(".look-more").hide();
			 isEnd = true;//没有更多了
			$(".sl-tit").hide();
			mui.toast("网络错误");
		}
	});
}

$("body").on("click",".store-but",function(){
	var seq = $(this).context.dataset.seq;
	beComeDistr(seq);
	
});

function beComeDistr(seq){
	mui.confirm('确定成为该服务商的分销商吗','提示',function(e) {
		if (e.index == 1) {
			var masterSeq = seq;
			var distributorSeq = userSeq;
			//mui.toast("seq : " +seq +"userSeq : " +userSeq);
			$.ajax({
				url:"/localQuickPurchase/dApplicationAction/addDistributor",
				type : "POST",
				data : {
					masterSeq : masterSeq,
					distributorSeq : distributorSeq
				},
				async : true,
				dataType : "json",
				success : function(data) {
					if(data.code == 200){
						mui.toast("你已成功申请,待服务商确认!");
						window.location.href="/localQuickPurchase/distribution/html/personalCenter/myCommon.jsp";
					}else{
						mui.toast(data.message);
					}
				}
			});
		} else{
			
		}
	  });
}
