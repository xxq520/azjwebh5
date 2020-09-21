(function () {
	//请求的参数
	var params = {
		columnName: "荣事达活动专场秒杀",
        pageIndex: 1,
        pageSize: 7,
        seckill: 1
	};
	//判断返回数据是否有内容
	var totalPage = 0;
	//判断秒杀（0）  专场（1）
	var type = 0;
	//货存比
	var arr = [];
	var seckill = {
			init:function(){
				this.linkTo();
				this.tabTaggle();
				this.getData();
				hui.loadMore(this.getMore)
			},
			//优惠券跳转
			linkTo:function(){
				$('.coupon-item').on('click', function () {
			        window.location.href = '/localQuickPurchase/distributionVA/receiveCoupons';
			    });
			},
			//tab切换
			tabTaggle:function(){
				var that = this;
				$('.sec-kill-area .pro-list .pro-item:nth-child(2) .pro-img').css('float', 'right');

			    $('.coupon-area .pro-list .pro-item:nth-child(2) .pro-img').css('float', 'left');
			    $('.tab span').each(function () {
			        $(this).on('click', function () {
			            $(this).addClass('active').siblings().removeClass('active');
			        })
			    });
			    $('.seckill-tab').on('click', function () {
			        $('.sec-kill-area').show();
			        $('.coupon-area').hide();
			        params.columnName= "荣事达活动专场秒杀";
			        params.seckill= 1;
			        type=0;
			        params.pageIndex = 1;
			        //hui.endRefresh();
		            //重置加载更多状态
		            hui.resetLoadMore();
			        $("#seckillList").html("");
			        that.getData();
			    });
			    $('.coupon-tab').on('click', function () {
			        $('.coupon-area').show();
			        $('.sec-kill-area').hide();
			        params.columnName= "荣事达活动专场";
			        params.seckill= "";
			        type=1;
			        params.pageIndex = 1;
			        //hui.endRefresh();
		            //重置加载更多状态
		            hui.resetLoadMore();
			       $("#couponList").html("");
			        that.getData();
			    });
			},
			//倒计时
			datetime_to_unix:function() {
			    var date = "2018-7-26 23:59:59";//设置到期时间
			    date = new Date(Date.parse(date.replace(/-/g, "/")));
			    date = date.getTime();
			    return parseInt(date / 1000);
			},
			GetRTime:function() {
				var that = this;
			    //当前时间戳
			    var timestamp = (Date.parse(new Date())) / 1000;

			    //设定时间的时间戳
			    var timestamp_set = seckill.datetime_to_unix();

			    //时间戳差
			    var cha_timestamp = timestamp_set - timestamp;

			    //剩余天数
			    var sy_day = parseInt(cha_timestamp / (3600 * 24))

			    //剩余小时
			    var sy_hour = parseInt((cha_timestamp - sy_day * 3600 * 24) / 3600);

			    //剩余分钟
			    var sy_min = parseInt((cha_timestamp - sy_hour * 3600 - sy_day * 24 * 3600) / 60);

			    //剩余秒数
			    var sy_miao = cha_timestamp - sy_day * 3600 * 24 - sy_hour * 3600 - sy_min * 60;

			   /* $(".day").val(sy_day);
			    $(".hours").val(sy_hour);
			    $(".min").val(sy_min);
			    $(".sec").val(sy_miao);*/
			},
			//定时执行，每秒刷新
			refreshTime:function(longDate){
				console.log(longDate);
				var that = this;
				//that.GetRTime()
				var timer_rt = setInterval(seckill.GetRTime(), 1000);
				var now = new Date();
				var endDate = new Date(longDate);
			    //时间结束，清除定时器
				console.log(now.getTime()-endDate.getTime()>=0);
			    if(now.getTime()-endDate.getTime()>=0){
			    	window.clearInterval(timer_rt);
			        $(".day").val(0);
			        $(".hours").val(0);
			        $(".min").val(0);
			        $(".sec").val(0);
			    }
			},
			//加载数据
			getData:function(){
				var that = this;
				$.ajax({
					url:"/localQuickPurchase/selectionGoods/SelectionGoodsCom",
					type:"POST",
					contentType:"application/json",
					dataType:"json",
					data:JSON.stringify(params),
					success:function(res){
						if(res.code != 200) return;
						totalPage = res.data.list;
						if(totalPage === undefined) return;
						if(type == "0"){
							var index = 0;//商品下标标识
							var dataIndex = params.pageIndex;
							dataIndex++;//分页标识
							var i = 0;
							var filds = 2;//文案
							var html = "";
							$.map(res.data.list,function(item){
								index++;
								i++;
								var price= "";//秒杀价
								var oldPrice = "";//原价
								var hc = 0;//货存
								var ys = 0;//已售
								var ysb = 0;//已售比
								// --->>> 1.开始时间  2.现在的时间	3.结束时间	4.客户端的服务器的时间	5.定时器ID <<<---
								var beginTime,timeNow,endTime,timeServerClient,timerID;
								var endTime = (new Date(item.goodsProStandard[0].activityFinishTime).getTime());//结束时间
								timeNow = new Date().getTime();//当前时间
								timeServerClient = endTime - timeNow;//剩余时间 = 结束时间 - 当前时间
								
								price = item.goodsProStandard[0].seckillPrice;
								oldPrice = item.goodsProStandard[0].goodsPrice;
								
								$.map(item.goodsProStandard,function(index){
									//已售
									hc += index.activityQuantity;
									ys += index.sellActivityQuantity;
									ysb = parseInt(ys/hc*100);
								});
								item.number = ysb;
								item.seckillPrice = price;
								item.goodsPrice = oldPrice;
								arr.push(ysb);
								that.refreshTime(item.goodsProStandard[0].activityFinishTime*1000);
								html += that.seckillTemp(item,dataIndex,index,i);
								setTimeout("show_time("+endTime+","+timeServerClient+","+dataIndex+","+index+","+i+","+filds+")",1000);
								//show_time(endTime,timeServerClient,dataIndex,index,i,filds);
								$("#seckillList").html(html);
								if(ysb==100){
									$('.timer').css('color','#ccc');
									$('.selled').show();
									$('.hui-progress span').css('background','#ccc');
									$('.price').css('color','#666');
									$('.go-buy-btn').css('background','#ccc');
									$('.go-buy-btn').html('已抢光');
								}
							});
							$('.progressBar').each(function(i){
								$('.progressBar').eq(i).css('width',arr[i]+'%')
							})
							
						}else{
							
							$.map(res.data.list,function(item){
								console.log(item);
								var price= "";//秒杀价
								var oldPrice = "";//原价
								price = item.goodsProStandard[0].distributionPrice;
								oldPrice = item.goodsProStandard[0].goodsPrice;
								item.distributionPrice = price;
								item.goodsPrice = oldPrice;
								$("#couponList").append(that.yhqTemp(item))
							})
							/*$('.coupon-area .go-buy-btn').each(function(i){
								$('.coupon-area .go-buy-btn').eq(i).on('click',function(){
									var goodsId=res.data.list[i].goodsId;
									console.log(goodsId)
									window.location.href="/localQuickPurchase/distributionVA/goodsDetail/"+goodsId+"/0/0";
								})
							})*/
						}
					},
					error:function(res){
						
					}
				})
			},
			//秒杀模板
			seckillTemp:function(item,dataIndex,index,i){
				var temp = $("#seckill").text();
				temp = temp.replace("{img}",item.thumbnail);
				//temp = temp.replace("{selled}",item.selled);
				temp = temp.replace("{title}",item.goodsName);
				temp = temp.replace("{number}",item.number);
				temp = temp.replace("{price}",item.seckillPrice);
				temp = temp.replace("{oldPrice}",item.goodsPrice);
				temp = temp.replace("{goodsId}",item.goodsId);
				temp = temp.replace("{index}",1);
				temp = temp.replace("{timer}","timer"+dataIndex+index+i);
				//this.hcb();
				return temp;
			},
			//优惠券专场
			yhqTemp:function(item){
				var temp = $("#couponTemp").text();
				temp = temp.replace("{img}",item.thumbnail);
				temp = temp.replace("{title}",item.goodsName);
				temp = temp.replace("{price}",item.distributionPrice);
				temp = temp.replace("{goodsId}",item.goodsId);
				temp = temp.replace("{index}",2);
				temp = temp.replace("{oldPrice}",item.goodsPrice);
				return temp;
			},
			//上拉记载
			getMore:function(){
				var that = this;
				if(totalPage === undefined){
					hui.endLoadMore(true);
		            return false;
				}
				params.pageIndex++;
				seckill.getData();
	            hui.endLoadMore();
			},
			//填充货存比
			hcb:function(){
				if(arr.length == 0) return;
				$.each(arr,function(i){
					console.log(arr[i]);
					hui(".hui-progress").eq(i).progressBar(arr[i]);
				})
			}
	};
	seckill.init();
})(jQuery);

function goodsJump(goodsId,index){
	if (index == 1) {
		window.location.href="/localQuickPurchase/distributionVA/seckill/sgDetail?goodsId="+goodsId+"&distributorSeq="+seq+"&shareSeq="+seq+"&num=2&indexNum=0";
	} else {
		window.location.href="/localQuickPurchase/distributionVA/goodsDetail/"+goodsId+"/0/"+seq;
	}
}
function goBack(obj){
	try{
		// 调app原生返回  
		window.action.app_back();
	}catch(e){
	}
	setTimeout(function(){
		history.go(-1);
	}, 200);
	
}

