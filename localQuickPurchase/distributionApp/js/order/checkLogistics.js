//返回上一级
function returnPreviousClick(){
    hui.Back();
};
var trackingNo = getQueryString("trackingNo");//快递单号
var orderno = getQueryString("orderno");//订单号
var carrier = getQueryString("carrier");//快递公司
if (trackingNo != "NaN") {
    var logisticsNo = trackingNo;
    $('.l_Courier').html(logisticsNo);
}
$('.l_orderno').html(orderno);
$('.l_name').html(carrier);
hui.refresh('#refreshContainer', refresh);
hui.loadMore(getMore);
function getMore(){
    if (logisticsNo == null && logisticsNo == "") {
        logisticsNo = 470761639882;
    }

    $.ajax({
        type : 'GET',
        dataType : 'json',
        url : '/localQuickPurchase/logistics/info',
        data : {"trackingNo" : logisticsNo},
        success : function(data){
            if (data.code == 200) {//data.code == 200
                hui.closeLoading();
                var list = data.data;
                var html = "";
                if (list.size != 0 && list != null) {
                    for (var i = 0; i < list.length; i++) {
                        var date = list[i].date;
                        var type = list[i].type;
                        var logisticsInfo = list[i].logisticsInfo;

                        //var name = checkCompany(type);

                        $('.l_name').html(type);
                        html +='<div class="logisticsitem">';
                        html +='<div class="itemState">';
                        html +='<i class="roundico"></i>';
                        html +='<i class="lineico"></i>';
                        html +='</div>';
                        html +='<div class="itemInfo">';
                        html +='<p class="infoTime">'+type+'</p>';
                        html +='<p class="infotxt">'+date+'</p>';
                        html +='<p class="infoPeople">'+logisticsInfo+'</p>';
                        html +='</div>';
                        html +='</div>';
                    }
                    hui('#list').html(html);
                    //重置加载更多状态
                    //hui.resetLoadMore();
                } else {
                    hui.endLoadMore(true, '没有更多数据了...');
                    return false;
                }
            } else {
                hui.closeLoading();
                hui.upToast(data.message,'error');
                hui('#list').html("<div class='more-log'>物流信息暂无</div>");
                hui.endRefresh();
                return false;
            }
        },
        error : function(error){
            hui.closeLoading();
            hui.upToast('无效的快递单号！');
            hui.endRefresh();
        }
    });
}

//下拉刷新
function refresh(){
    hui.loading('加载中...');
    //ajax请求初始化数据
    if (logisticsNo == null && logisticsNo == "") {
        logisticsNo = 470761639882;
    }
    $.ajax({
        type : 'GET',
        dataType : 'json',
        url : '/localQuickPurchase/logistics/info',
        data : {"trackingNo" : logisticsNo},
        success : function(data){
            if (data.code == 200) {
                hui.closeLoading();
                var list = data.data;
                var html = "";
                if (list.size != 0 && list != null) {
                    for (var i = 0; i < list.length; i++) {
                        var date = list[i].date;
                        var type = list[i].type;
                        var logisticsInfo = list[i].logisticsInfo;

                        //var name = checkCompany(type);

                        if (i == 0) {
                            html +='<div class="logisticsitem itemActive">';
                        } else {
                            html +='<div class="logisticsitem">';
                        }
                        $('.l_name').html(type);
                        html +='<div class="itemState">';
                        html +='<i class="roundico"></i>';
                        html +='<i class="lineico"></i>';
                        html +='</div>';
                        html +='<div class="itemInfo">';
                        html +='<p class="infoTime">'+type+'</p>';
                        html +='<p class="infotxt">'+date+'</p>';
                        html +='<p class="infoPeople">'+logisticsInfo+'</p>';
                        html +='</div>';
                        html +='</div>';
                    }
                    hui('#list').html(html);
                    //结束刷新
                    hui.endRefresh();
                    //重置加载更多状态
                    hui.resetLoadMore();
                    hui.endLoadMore(true, '没有更多数据了...');
                } else {
                    hui.endLoadMore(true, '没有更多数据了...');
                    hui.endRefresh();
                    return false;
                }
            } else {
                hui.closeLoading();
                hui.upToast(data.message,'error');
                hui('#list').html("<div class='more-log'>物流信息暂无</div>");
                hui.endRefresh();
                return false;
            }
        },
        error : function(error){
            hui.closeLoading();
            hui.upToast('无效的快递单号！');
            hui.endRefresh();
        }
    });
}