var giftSeq = getQueryString("giftSeq");

$(function(){
    //创建MeScroll对象,内部已默认开启下拉刷新,自动执行up.callback,重置列表数据;
    var mescroll = new MeScroll("mescroll", {
        up: {
            callback: getListData, //上拉回调,此处可简写; 相当于 callback: function (page) { getListData(page); }
            isBounce: false, //此处禁止ios回弹,解析(务必认真阅读,特别是最后一点): http://www.mescroll.com/qa.html#q10
            clearEmptyId: "dataList", //1.下拉刷新时会自动先清空此列表,再加入数据; 2.无任何数据时会在此列表自动提示空
            toTop:{ //配置回到顶部按钮
                src : "/localQuickPurchase/coupons/images/mescroll-totop.png", //默认滚动到1000px显示,可配置offset修改
                //offset : 1000
            }
        }
    });

    /*联网加载列表数据  page = {num:1, size:10}; num:当前页 从1开始, size:每页数据条数 */
    function getListData(page){
        //联网加载数据
        getListDataFromNet(page.num, page.size, function(curPageData){
            //联网成功的回调,隐藏下拉刷新和上拉加载的状态;
            //mescroll会根据传的参数,自动判断列表如果无任何数据,则提示空;列表无下一页数据,则提示无更多数据;
            console.log("page.num="+page.num+", page.size="+page.size+", curPageData.length="+curPageData.list.length);

            //方法一(推荐): 后台接口有返回列表的总页数 totalPage
            //mescroll.endByPage(curPageData.length, totalPage); //必传参数(当前页的数据个数, 总页数)

            //方法二(推荐): 后台接口有返回列表的总数据量 totalSize
            //mescroll.endBySize(curPageData.length, totalSize); //必传参数(当前页的数据个数, 总数据量)

            //方法三(推荐): 您有其他方式知道是否有下一页 hasNext
            mescroll.endSuccess(curPageData.pageSize, curPageData.hasNextPage); //必传参数(当前页的数据个数, 是否有下一页true/false)

            //方法四 (不推荐),会存在一个小问题:比如列表共有20条数据,每页加载10条,共2页.如果只根据当前页的数据个数判断,则需翻到第三页才会知道无更多数据,如果传了hasNext,则翻到第二页即可显示无更多数据.
            // mescroll.endSuccess(curPageData.list.length);

            //设置列表数据,因为配置了emptyClearId,第一页会清空dataList的数据,所以setListData应该写在最后;
            setListData(curPageData);
        }, function(){
            //联网失败的回调,隐藏下拉刷新和上拉加载的状态;
            mescroll.endErr();
        });
    }

    /*设置列表数据*/
    function setListData(data){
        var pageIndex = data.pageIndex;
        var giftRecord = data.list;
        var html = "";
        if (giftRecord != null && giftRecord.length > 0){
            for (var i = 0; i < giftRecord.length; i++) {
                var receiveName = giftRecord[i].receiveName;
                var giftPrice = giftRecord[i].giftPrice;
                var giftTime = giftRecord[i].giftTime;
                var useState = giftRecord[i].useState;
                if (pageIndex == 1 && i == 0){
                    html += '<tr>';
                    html += '<td>赠送对象</td>';
                    html += '<td>赠送金额</td>';
                    html += '<td>赠送时间</td>';
                    html += '<td>状态</td>';
                    html += '</tr>';
                }
                html += '<tr>';
                html += '<td>'+receiveName+'</td>';
                html += '<td>￥'+giftPrice+'</td>';
                html += '<td>'+formatDateTime(giftTime)+'</td>';
                if (useState == 0){
                    html += '<td class="unuse">未使用</td>';
                } else if (useState == 1){
                    html += '<td class="use">已使用</td>';
                } else {
                    html += '<td class="reback">已退回</td>';
                }
                html += '</tr>';
            }
        } else {
            html += '<tr>';
            html += '<td>赠送对象</td>';
            html += '<td>赠送金额</td>';
            html += '<td>赠送时间</td>';
            html += '<td>状态</td>';
            html += '</tr>';
        }
        $(".tabList").append(html);

    }

    /*联网加载列表数据
     在您的实际项目中,请参考官方写法: http://www.mescroll.com/api.html#tagUpCallback
     请忽略getListDataFromNet的逻辑,这里仅仅是在本地模拟分页数据,本地演示用
     实际项目以您服务器接口返回的数据为准,无需本地处理分页.
     * */
    function getListDataFromNet(pageNum,pageSize,successCallback,errorCallback) {
        var param = {"giftSeq":giftSeq,"pageIndex":pageNum,"pageSize":pageSize}
        //延时一秒,模拟联网
        setTimeout(function () {
            $.ajax({
                type: 'GET',
                url: '/localQuickPurchase/give/all',
                data : param,
                dataType: 'json',
                success: function(data){
                    var dataInfo = data.data.list;
                    //模拟分页数据
                    var listData=[];
                    for (var i = (pageNum-1)*pageSize; i < pageNum*pageSize; i++) {
                        if(i==dataInfo.length) break;
                        listData.push(dataInfo[i]);
                    }
                    successCallback(data.data);
                },
                error: errorCallback
            });
        },1000)
    }
    /*时间日期格式化*/
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
        //second = second < 10 ? ('0' + second) : second;
        return y + '-' + m + '-' + d;
        // return y + '-' + m + '-' + d+' &nbsp;'+h+':'+minute;// 有時間

        // return y + '-' + m + '-' + d ;  //沒有時間
    };

});
