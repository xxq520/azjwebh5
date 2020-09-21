(function(){
	var page = 2;
	var totalPage = 0;
	var params = {
		columnName: "中秋节优惠活动",
        pageIndex: 1,
        pageSize: 8
	};
	var index = {
		init:function(){
			this.getData();
			hui.loadMore(this.getMore);
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
					console.log(res);
					if(res.data.list == null || res.data.list.length == 0){
                        hui.endRefresh();
                        hui.endLoadMore(true, '没有更多了...');
					}else{
                        var data = {
                            list : res.data.list
                        }
                        $('.goods-list').append(template('proItem',data));
                    }

				},
				error:function(res){
					
				}
			})
		},
		//上拉记载
		getMore:function(){
			$.ajax({
		        url: '/localQuickPurchase/selectionGoods/SelectionGoodsCom',
		        type: 'POST',
		        data: '{"columnName":"中秋节优惠活动" ,"pageIndex":'+page+',"pageSize":8}',
		        contentType:'application/json;charset=UTF-8',
		        success:function(result){
		            var data = {
		            	list :　result.data.list
		            }
		            console.log(data.list);
		            if(data.list == null){
		                hui.endLoadMore(true, '没有更多了...');
		                return false;
		            }
	                $('.goods-list').append(template('proItem',data));
		            page++;
		            hui.endLoadMore();
		        },
		        error:function(result){
		            hui.closeLoading();
		            //hui.upToast('连接服务器失败！');
		            hui.endRefresh();
		        }
			})
		}
	};
	index.init();
})(jQuery)
// 商品二维码
var urlVal = window.location.href;//活动页的地址
var appUrl = urlVal+"?checkShare=1&shareSeq="+seq;
var urlValStr =  escape(appUrl);
$(".ewmcode img").attr("src","/localQuickPurchase/shareQRCode/stringQRCode?urlVal="+urlValStr);
function qrCode(){
    var ewmcodeVal = $(".ewmcode").attr("value");
    if(ewmcodeVal == "0"){
        $(".mask").show();
        $(".ewmcode").show();
        $(".ewmcode").attr("value","1");
    } else{
        $(".mask").hide();
        $(".ewmcode").hide();
        $(".ewmcode").attr("value","0");
    }
}
// 复制链接
var clipboard = new Clipboard('.copylink', {
    // 点击copy按钮，直接通过text直接返回复印的内容
    text: function() {
        var link = urlVal+"?checkShare=1&shareSeq="+seq;
        return link;
    }
});
clipboard.on('success', function(e) {
    var $copysuc = $("<div class='copy-tips'><div class='copy-tips-wrap'>☺ 复制成功</div></div>");
    $("body").find(".copy-tips").remove().end().append($copysuc);
    $(".copy-tips").fadeOut(2000);
    e.clearSelection();
});
clipboard.on('error', function(e) {
    hui.toast('复制失败!');
});
function hiddend() {
    $("html,body").css("overflow", "visible");
    hui.dialogClose();
    $(".share-block").slideUp(200);
    qeCodehiddend()
}

function qeCodehiddend() {
    $(".ewmcode").hide();
    $(".mask").hide();
    $(".ewmcode").attr("value","0");
}

//点击分享按钮
function share() {
    // 分享
    //判断是否是app
    var u = navigator.userAgent;
    //var shareGoodsPic = $(".hui-swipe-item").find("img:first").attr("src");
    var isappwebview = u.indexOf('app_webview') > -1
    if(isappwebview){
        //点击分享
        share520Love(appUrl,'爱之家商城中秋专题活动','','','.share-content');
    } else{
        share520LoveWeb(appUrl,'爱之家商城中秋专题活动','','','.share-content');
        hui.dialogBase();
        $(".share-block").slideDown(200);
    }
}

function goodsJump(goodsId,index,filds){
    if (index == 1) {
        window.location.href="/localQuickPurchase/distributionVA/seckill/sgDetail?goodsId="+goodsId+"&distributorSeq="+seq+"&shareSeq="+seq+"&num="+filds+"&indexNum="+filds;
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
    	if(document.referrer == ""){
            window.location.href="/localQuickPurchase/distributionVA/index";
        }else{
            history.go(-1);
        }
    }, 200);
}