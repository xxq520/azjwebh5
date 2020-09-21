function countChar(textareaName,spanName){
	$(".word-num i").html($(".feedback-con").val().length);
}
$(function(){
	if($(".swiper-container").length>0){
		$(".swiper-container").swiper({
			loop: true,
			autoHeight: true,
			autoplay: 2000,
			autoplayDisableOnInteraction: false
		});
	}

	if($("#s-loading-con").length>0){
		var loading = false;  //状态标记
		$(document.body).infinite().on("infinite", function() {
		  if(loading) return;
		  loading = true;
		  var _html ="";
		  for (var i = 0; i < 4; i++) {
		  	_html+="<div class='list-item'><div class='item-img'><a href='javascript:;'><img class='middle' src='../images/product/product-7.png'></a></div><div class='item-ifon'><a href='javascript:;'><div class='store-tit'><i>[推荐]</i>肯德基（员村店）<img src='../images/level-4.png'></div><div class='store-tips'><span class='red'>商家配送-40分钟</span></div><div class='store-date'>月销500单 | 小于500米</div><div class='store-txt'>知名品牌，肯德基给您带来最健康的食品</div></a></div><div class='preferential-layer'><div class='preferential-line'><i>优惠</i>满30减5，满100减20</div><div class='preferential-list'><div class='preferential-product'><a href='javascript:;'><div class='pp-img'><img class='middle' src='../images/product/product-8.png'></div><div class='pp-price'>&yen;6.0</div></a></div><div class='preferential-product'><a href='javascript:;'><div class='pp-img'><img class='middle' src='../images/product/product-8.png'></div><div class='pp-price'>&yen;6.0</div></a></div><div class='preferential-product'><a href='javascript:;'><div class='pp-img'><img class='middle' src='../images/product/product-8.png'></div><div class='pp-price'>&yen;6.0</div></a></div><div class='preferential-product'><a href='javascript:;'><div class='pp-img'><img class='middle' src='../images/product/product-8.png'></div><div class='pp-price'>&yen;6.0</div></a></div></div></div></div>";
		  }
		  setTimeout(function() {
		    $("#s-loading-con").append(_html);
		    loading = false;
		  },1500);   //模拟延迟
		});
	}

	if($("#n-loading-con").length>0){
		var loading = false;  //状态标记
		$(document.body).infinite().on("infinite", function() {
		  if(loading) return;
		  loading = true;
		  var _html ="";
		  for (var i = 0; i < 4; i++) {
		  	_html+="<div class='list-item'><div class='item-img'><a href='javascript:;'><i class='new-ico'></i><img class='middle' src='../images/product/product-11.png'></a></div><div class='item-ifon'><a href='javascript:;'><div class='store-tit'>天天爱你蛋糕坊<img src='../images/level-4.png'></div><div class='store-tips'><span class='gray'>仅支持上门自提</span></div><div class='store-date'>月销500单 | 小于500米</div><div class='store-txt'>良品铺子，让嘴巴去旅行</div></a></div><div class='preferential-layer'><div class='preferential-line'><i>优惠</i>满30减5，满100减20</div><div class='preferential-line'><i>活动</i>新店特惠，首单立减5元</div></div></div>";
		  }
		  setTimeout(function() {
		    $("#n-loading-con").append(_html);
		    loading = false;
		  },1500);   //模拟延迟
		});
	}

	if($("#h-loading-con").length>0){
		var loading = false;  //状态标记
		$(document.body).infinite().on("infinite", function() {
		  if(loading) return;
		  loading = true;
		  var _html ="";
		  for (var i = 0; i < 4; i++) {
		  	_html+="<div class='list-item'><div class='item-img'><a href='javascript:;'><img class='middle' src='../images/product/product-11.png'></a></div><div class='item-ifon'><a href='javascript:;'><div class='store-tit'>天天爱你蛋糕坊<img src='../images/level-4.png'></div><div class='store-tips'><span class='gray'>仅支持上门自提</span></div><div class='store-date'>月销500单 | 小于500米</div><div class='store-txt'>良品铺子，让嘴巴去旅行</div></a></div><div class='preferential-layer'><div class='preferential-line'><i>优惠</i>满30减5，满100减20</div><div class='preferential-line'><i>活动</i>新店特惠，首单立减5元</div></div></div>";
		  }
		  setTimeout(function() {
		    $("#h-loading-con").append(_html);
		    loading = false;
		  },1500);   //模拟延迟
		});
	}

	if($("#l-loading-con").length>0){
		var loading = false;  //状态标记
		$(document.body).infinite().on("infinite", function() {
		  if(loading) return;
		  loading = true;
		  var _html ="";
		  for (var i = 0; i < 4; i++) {
		  	_html+="<div class='list-item'><div class='item-img'><img class='middle' src='../images/product/product-4.png'></div><div class='item-ifon'><div class='product-tit'>康师傅红烧牛肉面<i class='sales'>月销1000包</i></div><div class='product-tips'>员村士多店</div><div class='product-buttom'><span class='product-price'>&yen;<i>3.</i>5<del>原价：￥5.0</del></span><span class='product-time'>仅剩18小时</span></div></div></div>";
		  }
		  setTimeout(function() {
		    $("#l-loading-con").append(_html);
		    loading = false;
		  },1500);   //模拟延迟
		});
	}

	if($("#allevaluation").length>0){
		var loading = false;  //状态标记
		$(document.body).infinite().on("infinite", function() {
		  if(loading) return;
		  loading = true;
		  var _html ="";
		  for (var i = 0; i < 4; i++) {
		  	_html+="<div class='evaluation-item'><div class='ei-img'><img src='../images/face-no.png' /></div><div class='ei-ifo'><div class='eii-top'><span class='eiit-tel'>134******08</span><span class='eiit-time'>2017/3/9&nbsp;&nbsp;&nbsp;12:03</span></div><div class='eii-star'><img src='../images/level-5.png'></div><div class='eii-txt'>好吃，实惠，下单20分钟就送到了,大品牌就是不一样</div><div class='eii-praise'><i class='font-ico'>&#xe9eb;</i><span>红薯干</span><span>奶香味碧根果</span><span>原味碧根果</span></div></div></div>";
		  }
		  setTimeout(function() {
		    $("#allevaluation").append(_html);
		    loading = false;
		  },1500);   //模拟延迟
		});
	}

	if($("#city-picker").length>0){
		$("#city-picker").cityPicker({
			title: "请选择城市分区",
			onChange: function(){
				setTimeout(function(){
					var picker_val = $("#city-picker").val();
					var ary= new Array();
						ary=picker_val.split(" ");
					if(ary[1]==undefined){
						ary[1]="";
					}
					if(ary[2]==undefined){
						ary[2]="";
					}
					$("input[name='picker']").val(ary[1]+" "+ary[2]);
				},100)
			}
		});
	}
	$("body").on("click",".pli-tit",function(){
		$(this).siblings(".pli-con").toggle();
		$(this).find(".down-ico").toggle();
		$(this).find(".up-ico").toggle();
	})
	$("body").on("click",".pli-tit",function(){
		$(this).siblings(".pli-con").toggle();
		$(this).find(".down-ico").toggle();
		$(this).find(".up-ico").toggle();
	})
	if($(".shopping-top-preferential").length>0){
		if($(".stp-list .stp-item").length>1){
			$(".shopping-top-preferential .more-but").show();
			$(".stp-list .stp-item").each(function(){
				$(this).css("padding","0 .75rem 0 0")
				if($(this).index()>0){
					$(this).hide();
				}
			})
		}
	}
	$(".shopping-top-preferential .more-but").click(function(){
		$(".stp-list .stp-item").show();
		$(".shopping-top-preferential .more-but").hide();
		$(".shopping-top-preferential .pack-up").show();
	})
	$(".shopping-top-preferential .pack-up").click(function(){
		$(".stp-list .stp-item").each(function(){
			if($(this).index()>0){
				$(this).hide();
			}
		})
		$(".shopping-top-preferential .more-but").show();
		$(".shopping-top-preferential .pack-up").hide();
	});
	$("body").on("click",".spl-right li",function(){
		$(this).addClass("act").siblings("li").removeClass("act");
		var n = $(this).index();
		var mainContainer = $('#spl-con'),
		scrollToContainer = mainContainer.find('.splc-item:eq('+n+')');
		mainContainer.scrollTop(
			scrollToContainer.offset().top - mainContainer.offset().top + mainContainer.scrollTop()-20
		);
	});
	/*商品加减*/
	$("body").on("click",".buy_num .reduction-but",function(){
		var num = $(this).siblings(".product-num").text();
		var sum = parseInt(num)-1;
		if(sum==0){
			$(this).siblings(".product-num").text("");
			$(this).hide();
		}else{
			$(this).siblings(".product-num").text(sum);
		}
	});
	$("body").on("click",".buy_num .add-but",function(){
		var num = $(this).siblings(".product-num").text();
		if(num==""){
			$(this).siblings(".product-num").text("1");
			$(this).siblings(".reduction-but").css("display","inline-block");
		}else{
			var sum = parseInt(num)+1;
			$(this).siblings(".product-num").text(sum);
		}
	});
	$("body").on("click",".product-list-num .reduction-but",function(){
		var num = $(this).siblings(".product-num").text();
		var sum = parseInt(num)-1;
		if(sum==0){
			$(this).siblings(".product-num").text("");
			$(this).hide();
		}else{
			$(this).siblings(".product-num").text(sum);
		}
	});
	$("body").on("click",".product-list-num .add-but",function(){
		var num = $(this).siblings(".product-num").text();
		if(num==""){
			$(this).siblings(".product-num").text("1");
			$(this).siblings(".reduction-but").css("display","inline-block");
		}else{
			var sum = parseInt(num)+1;
			$(this).siblings(".product-num").text(sum);
		}
	});
})


