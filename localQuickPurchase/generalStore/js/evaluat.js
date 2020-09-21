var eva=0;
var flagRequest=true;
function guessStoreEvaluation(n,eva,i){
	var seq = getQueryString("seq");
	$.ajax({
		type : "post",
		url : _content+"/evaMongo/queryEVASeq",
		dataType : "json", //设置返回值得类型
		async : false,
		data : {
			seq:seq,
			pageIndex:n,
			pageSize:i,
			eva:eva
		},
		async : true, //是否异步请求，false为同步
		success : function(msi) { //成功返回值执行函数
			if(msi.code==200){
				if($("#evalink").length>0){
					$("#evalink").html("查看全部"+msi.data.allEvaSize+"条评价<i class='font-ico'>&#xe937;</i>").attr("href","allevaluation.jsp?seq="+seq+"&eva=0")
				}
				if($("#evaclassify").length>0){
					$("#evaclassify").show();
					$("#evaclassify a").eq(0).html("全部("+msi.data.allEvaSize+")").attr("data_id","0");
					$("#evaclassify a").eq(1).html("差评("+msi.data.badSize+")").attr("data_id","1");
					$("#evaclassify a").eq(2).html("中评("+msi.data.middleSize+")").attr("data_id","2");
					$("#evaclassify a").eq(3).html("好评("+msi.data.excellentSize+")").attr("data_id","3");
				}
				if(msi.data.evaList.length>0){
					var _listevalust="";
					var n=0
					
					for(n;n<msi.data.evaList.length;n++){
						var userN=msi.data.evaList[n].userName;
						
						if(msi.data.evaList[n].anonymity){
							userN=userN.substring(0,3)+"****"; 
						}
						_listevalust+="<div class='evaluation-item'>";
						_listevalust+="<div class='ei-img'><img src='../images/face-no.png' /></div>";
						_listevalust+="<div class='ei-ifo'>";
						_listevalust+="<div class='eii-top'><span class='eiit-tel'>"+userN+"</span><span class='eiit-time'>"+getSmpFormatDateByLong(msi.data.evaList[n].updateTime,true)+"</span></div>";
						_listevalust+="<div class='eii-star'><img src='../images/level-"+parseInt(msi.data.evaList[n].service)+".png'></div>";
						_listevalust+="<div class='eii-txt'><p  style='word-break: break-all;'>"+msi.data.evaList[n].evaluationContent+"</p></div></div></div>";
					}
					$("#storeevalist").css("display","block");
					$("#storeevalist").append(_listevalust);
					if(n<10){
						flagRequest=false;
						$(".weui-loading").hide();
						$(".weui-loadmore__tips").html("~ 无更多数据 ~");
					}else{
						$(".weui-loadmore__tips").html("下拉查看更多评论...");
					}
				}else{
					flagRequest=false;
					$(".weui-loading").hide();
					$(".weui-loadmore__tips").html("~ 无更多数据 ~");
				}
			}else{
				$.toptip(msi.message, 'error');
			}
		}
	});
}
function guessGoodsEvaluation(n,eva,i){
	var goodsId = getQueryString("goodsId");
	$.ajax({
		type : "post",
		url : _content+"/evaMongo/queryEVAGoodsId",
		dataType : "json", //设置返回值得类型
		async : false,
		data : {
			goodsId:goodsId,
			pageIndex:n,
			pageSize:i,
			eva:eva
		},
		async : true, //是否异步请求，false为同步
		success : function(msi) { //成功返回值执行函数
			if(msi.code==200){
				if($("#evalink").length>0){
					$("#evalink").html("查看全部"+msi.data.allEvaSize+"条评价<i class='font-ico'>&#xe937;</i>").attr("href","allevaluation.jsp?seq="+seq+"&eva=0")
				}
				if($("#evaclassify").length>0){
					$("#evaclassify").show();
					$("#evaclassify a").eq(0).html("全部("+msi.data.allEvaSize+")").attr("data_id","0");
					$("#evaclassify a").eq(1).html("差评("+msi.data.badSize+")").attr("data_id","1");
					$("#evaclassify a").eq(2).html("中评("+msi.data.middleSize+")").attr("data_id","2");
					$("#evaclassify a").eq(3).html("好评("+msi.data.excellentSize+")").attr("data_id","3");
				}
				if(msi.data.evaList.length>0){
					var _listevalust="";
					for(var n=0;n<msi.data.evaList.length;n++){
						var userN=msi.data.evaList[n].userName;
						if(msi.data.evaList[n].anonymity){
							userN=userN.substring(0,3)+"****"; 
						}
						_listevalust+="<div class='evaluation-item'>";
						_listevalust+="<div class='ei-img'><img src='../images/face-no.png' /></div>";
						_listevalust+="<div class='ei-ifo'>";
						_listevalust+="<div class='eii-top'><span class='eiit-tel'>"+userN+"</span><span class='eiit-time'>"+getSmpFormatDateByLong(msi.data.evaList[n].updateTime,true)+"</span></div>";
						_listevalust+="<div class='eii-star'><img src='../images/level-"+parseInt(msi.data.evaList[n].service)+".png'></div>";
						_listevalust+="<div class='eii-txt'><p  style='word-break: break-all;'>"+msi.data.evaList[n].evaluationContent+"</p></div>";
						_listevalust+="</div></div>";
					}
					$("#allgoodseva").append(_listevalust);
					if(msi.data.evaList.length<i){
						flagRequest=false;
						$(".weui-loading").hide();
						$(".weui-loadmore__tips").html("~ 无更多数据 ~");
					}else{
						$(".weui-loadmore__tips").html("下拉查看更多评论...");
					}
				}else{
					flagRequest=false;
					$(".weui-loading").hide();
					$(".weui-loadmore__tips").html("~ 无更多数据 ~");
				}
				
			}else{
				$.toptip(msi.message, 'error');
			}
		}
	});
}

function gussMyEvaluation(n){
	$.ajax({
		type : "post",
		url : _content+"/evaMongo/findByUserName",
		dataType : "json", //设置返回值得类型
		data : {
			userName:userName,
			pageIndex:n,
			pageSize:10
		},
		async : true, //是否异步请求，false为同步
		success : function(msi) { //成功返回值执行函数
			if(msi.code==200){
				if(msi.data.list.length>0){
					var _listevalust="";
					var n=0;
					for(n;n<msi.data.list.length;n++){
						var userN=msi.data.list[n].evaluation.userName;
						if(msi.data.list[n].evaluation.anonymity){
							userN=userN+"(匿名)"; 
							//userN=userN.substring(0,3)+"****"; 
						}
						_listevalust+="<div class='evaluation-item'>";
						_listevalust+="<div class='ei-img'><img src='../images/face-no.png' /></div>";
						_listevalust+="<div class='ei-ifo'>";
						_listevalust+="<div class='eii-top'><span class='eiit-tel'>"+userN+"</span><span class='eiit-time'>"+getSmpFormatDateByLong(msi.data.list[n].evaluation.updateTime,true)+"</span></div>";
						_listevalust+="<div class='eii-star'><img src='../images/level-"+parseInt(msi.data.list[n].evaluation.service)+".png'></div>";
						_listevalust+="<div class='eii-txt'><p style='word-break: break-all;'>"+msi.data.list[n].evaluation.evaluationContent+"</p></div>";
						_listevalust+="</div></div>";
					}
					$("#myevaluation").append(_listevalust);
					if(n<10){
						flagRequest=false;
						$(".weui-loading").hide();
						$(".weui-loadmore__tips").html("~ 无更多数据 ~");
					}else{
						$(".weui-loadmore__tips").html("下拉查看更多评论...");
					}
				}else{
					flagRequest=false;
					$(".weui-loading").hide();
					$(".weui-loadmore__tips").html("~ 无更多数据 ~");
				}
			}else{
				$.toptip(msi.message, 'error');
			}
		}
	});
}
var n = 1;
$("#evaclassify a").click(function(e){
	if($(this).hasClass("active")){
		return;
	}
	n = 1;
	flagRequest=true;
	eva=$(this).attr("data_id");
	
	$("#evaclassify a").removeClass("active");
	$(this).addClass("active");
	if($("#allstoreeva").length>0){
		$("#storeevalist").html("");
		guessStoreEvaluation(1,eva,10)
	}else{
		$("#allgoodseva").html("");
		guessGoodsEvaluation(1,eva,10);
	}
});
$(function(){
	n = 2;
	if($("#allstoreeva").length>0){
		$("#evaclassify a").eq(0).addClass("active");
		guessStoreEvaluation(1,eva,10);
		var loading = false;  //状态标记
		$(document.body).infinite().on("infinite", function() {
		  	if(loading) return;
	  		loading = true;
		  	setTimeout(function() {
		  		if(flagRequest){
		  			guessStoreEvaluation(n,eva,10);
		  			n=n+1
		  		}
    			loading = false;
		  	},500);   //模拟延迟
		});
	}
	if($("#allgoodseva").length>0){
		$("#evaclassify a").eq(0).addClass("active");
		guessGoodsEvaluation(1,eva,10);
		var loading = false;  //状态标记
		$(document.body).infinite().on("infinite", function() {
		  	if(loading) return;
	  		loading = true;
		  	setTimeout(function() {
		  		if(flagRequest){
		  			guessGoodsEvaluation(n,eva,10);
		  			n=n+1
		  		}
    			loading = false;
		  	},500);   //模拟延迟
		});
	}	
	if($("#myevaluation").length>0){
		gussMyEvaluation(1);
		var n = 2;
		var loading = false;  //状态标记
		$(document.body).infinite().on("infinite", function() {
		  	if(loading) return;
	  		loading = true;
		  	setTimeout(function() {
		  		if(flagRequest){
		  			gussMyEvaluation(n);
		  		}
    			loading = false;
    			n=n+1
		  	},500);   //模拟延迟
		});
	}	
})
