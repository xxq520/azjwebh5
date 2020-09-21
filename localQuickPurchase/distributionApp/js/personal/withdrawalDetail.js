var pageIndex = 1;
var pageSize = 10;
var isLoading = false;
var first = true;
$(function(){
	hui.refresh('#refreshContainer', refresh);
	hui.loadMore(getMore);
	//下拉刷新
	function refresh(){
		hui.loading('加载中...');
		pageIndex = 1;
		// 因渲染时获取分享图片路径找不到，固ajax方法放在jsp中
		refreshWithdrawals();
	}
	//加载更多
	function getMore(){
		if(isLoading){
			return;
		}
		isLoading = true;
		// 因渲染时获取分享图片路径找不到，固ajax方法放在jsp中
		findWithdrawals();
	}

})
//上拉加载数据
function findWithdrawals(){
	$.ajax({
		type:'post',
		dataType:'json',
		url:'/localQuickPurchase/withdrawalsAction/findWithdrawals',
		data:{
			 seq:seq,
			 pageSize:10,
			 pageIndex:pageIndex,
		},
		async : false,
		success:function(data){
			var Withdrawals = data.data;
			var totalCount = data.data.totalCount;
			var _html="";
			if (Withdrawals != null && Withdrawals.length > 0) {
				for(var i = 0; i < Withdrawals.length; i++){
					_html+=getHtml(Withdrawals[i]);
				}
				$(_html).appendTo('#list');
				pageIndex++;
	            hui.endLoadMore(false);
	            isLoading = false;
			} else {
				hui.endLoadMore(true, '没有更多了...');
                return false;
			}
		}
	})
}

//下拉刷新数据
function refreshWithdrawals(){
	$.ajax({
		type:'post',
		dataType:'json',
		url:'/localQuickPurchase/withdrawalsAction/findWithdrawals',
		data:{
			 seq:seq,
			 pageSize:10,
			 pageIndex:1,
		},
		async : false,
		success:function(data){
			$('#list').html("");
			var Withdrawals = data.data;
			var totalCount = data.data.totalCount;
			var _html="";
			if (Withdrawals != null && Withdrawals.length > 0) {
				for(var i = 0; i < Withdrawals.length; i++){
					_html+=getHtml(Withdrawals[i]);
				}
				pageIndex = 2;
				setTimeout(function(){
					$(_html).appendTo('#list');
		            //结束刷新
		            hui.endRefresh();
		            //重置加载更多状态
		            hui.resetLoadMore();
		            hui.loading('加载中...', true);
		            if(!first){
		            	hui.toast("下拉刷新成功");	            	
		            }
		            first = false;
				},500)
			} else {
				_html += "<p style='text-align:  center;color: #e3e3e3;'>没有更多了</p>";
				$('#list').html(_html);
				 //结束刷新
	            hui.endRefresh();
	            hui.loading('加载中...', true);
			}
		}
	})
}

function getHtml(obj){
	var _html = "";
	if(obj != null){
		  var bankCarNumber =obj.bankCarNumber;//银行卡号
          var cashMoney = obj.cashMoney;//提现金额
          var withdrawalNo = obj.withdrawalNo;//提现金额
          var applyDate = obj.applyDate;//申请日期
          applyDate = formatDateTime(applyDate);
         /* var finishDate = obj.finishDate==null?"":obj.finishDate;//完成日期
          var date = "";//完成日期
          if(finishDate != ""){
        	  date = formatDateTime(finishDate);
          }*/
          var remarks = obj.remarks;//回调后返回的信息
          var remarksStr = obj.userRemarks== null?"":obj.userRemarks;
          var encryptMoney = obj.encryptMoney;//扣税金额
          
		_html+='<li>';
		_html+='<div class="detailTop">';
		_html+='<div class="withdrawalOrder">提现单号:<span>'+withdrawalNo+'</span></div>';
		_html+='<div class="orderTime">'+ applyDate +'</div>';
		_html+='</div>';
		_html+='<div class="detailCenter">';
		_html+='<div class="withdrawalMoney">提现金额:<span>'+cashMoney+'</span></div>';
		_html+='<div class="detailType">'+remarksStr+'</div>';
		_html+='</div>';
		_html+='<div class="failReason">扣税后金额：'+encryptMoney.toFixed(2)+'</div>';
		_html+='</li>';
	}
	return _html;
}
//转化时间格式margin-t-3
function formatDateTime(inputTime) {    
    var date = new Date(inputTime);  
    var y = date.getFullYear();    
    var m = date.getMonth() + 1;    
    m = m < 10 ? ('0' + m) : m;    
    var d = date.getDate();    
    d = d < 10 ? ('0' + d) : d;    
    var h = date.getHours();  
    h = h < 10 ? ('0' + h) : h;
    var minute = date.getMinutes();   
    var second = date.getSeconds();  
    minute = minute < 10 ? ('0' + minute) : minute;    
    second = second < 10 ? ('0' + second) : second;   
    return y + '-' + m + '-' + d+'  '+h+':'+minute+':'+second;
    return y + '-' + m + '-' + d+' &nbsp;'+h+':'+minute;  
    return y + '-' + m + '-' + d;
};