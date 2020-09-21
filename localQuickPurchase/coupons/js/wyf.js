var pageIndex = 1;
var pageSize = 10;
var first = true;
var isLoading = false;
var genreId = getQueryString("genreId");
var keyword = getQueryString("keyword");
var Coums = shopgd(seq);


var mescroll;
$(function () {
    //创建MeScroll对象,内部已默认开启下拉刷新,自动执行up.callback,重置列表数据;
    mescroll = new MeScroll("mescroll", {
        up: {
            callback: getListData, //上拉回调,此处可简写; 相当于 callback: function (page) { getListData(page); }
            isBounce: false, //此处禁止ios回弹,解析(务必认真阅读,特别是最后一点): http://www.mescroll.com/qa.html#q10
            clearEmptyId: "list", //1.下拉刷新时会自动先清空此列表,再加入数据; 2.无任何数据时会在此列表自动提示空
            toTop: { //配置回到顶部按钮
                src: "/localQuickPurchase/coupons/images/mescroll-totop.png", //默认滚动到1000px显示,可配置offset修改
                //offset : 1000
            },
        }
    });
    mescroll.lockDownScroll(true);//锁定下拉刷新

    /*联网加载列表数据  page = {num:1, size:10}; num:当前页 从1开始, size:每页数据条数 */
    function getListData(page) {
        //联网加载数据
        getListDataFromNet(page.num, page.size, function (curPageData) {
            //联网成功的回调,隐藏下拉刷新和上拉加载的状态;
            //mescroll会根据传的参数,自动判断列表如果无任何数据,则提示空;列表无下一页数据,则提示无更多数据;
            console.log("page.num=" + page.num + ", page.size=" + page.size + ", curPageData.length=" + curPageData.list.length);

            //方法一(推荐): 后台接口有返回列表的总页数 totalPage
            //mescroll.endByPage(curPageData.length, totalPage); //必传参数(当前页的数据个数, 总页数)

            //方法二(推荐): 后台接口有返回列表的总数据量 totalSize
            //mescroll.endBySize(curPageData.length, totalSize); //必传参数(当前页的数据个数, 总数据量)

            //方法三(推荐): 您有其他方式知道是否有下一页 hasNext
            mescroll.endSuccess(curPageData.pageSize, curPageData.hasNextPage); //必传参数(当前页的数据个数, 是否有下一页true/false).hasNextPage

            //方法四 (不推荐),会存在一个小问题:比如列表共有20条数据,每页加载10条,共2页.如果只根据当前页的数据个数判断,则需翻到第三页才会知道无更多数据,如果传了hasNext,则翻到第二页即可显示无更多数据.
            // mescroll.endSuccess(curPageData.list.length);

            //设置列表数据,因为配置了emptyClearId,第一页会清空dataList的数据,所以setListData应该写在最后;
            setListData(curPageData);
        }, function () {
            //联网失败的回调,隐藏下拉刷新和上拉加载的状态;
            mescroll.endErr();
        });
    }


    function seqlist(shareSeq) {
        var result = null;
        $.ajax({
            type: "GET",//定义提交的类型
            url: "/localQuickPurchase/shopMongo/queryUserInfo",
            data: {
                "seq": shareSeq
            },
            dataType: "json",//设置返回值得类型

            async: true,//是否异步请求，false为同步
            success: function (data) {//成功返回值执行函数
                if (data.code == 1000) {
                    result = data.data;
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                console.log('error');
                console.log(XMLHttpRequest.status);
                console.log(XMLHttpRequest.readyState);
                console.log(textStatus);
            }
        });
        return result;
    }


    /*设置列表数据*/
    function setListData(data) {
        if (data.htmlList != null && data.htmlList != "") {
            $(".clearfix").html(data.htmlList);
            var wyf_scrollTop = localStorage.getItem("wyf_scrollTop");
            try {
                console.info(wyf_scrollTop);
                localStorage.removeItem("wyf_list");
                localStorage.removeItem("wyf_scrollTop");
                setTimeout(function () {
                    mescroll.scrollTo(wyf_scrollTop, 100);
                }, 500);
            } catch (e) {
            }


            return;
        }
        var commodity = data.list;
        var html = "";
        if (commodity != null && commodity.length > 0) {
            html = getHTML(commodity)
            $(".clearfix").append(html);
        } else {
            $(".bottomTip").show()
        }
    }

    /*联网加载列表数据
     在您的实际项目中,请参考官方写法: http://www.mescroll.com/api.html#tagUpCallback
     请忽略getListDataFromNet的逻辑,这里仅仅是在本地模拟分页数据,本地演示用
     实际项目以您服务器接口返回的数据为准,无需本地处理分页.
     * */
    function getListDataFromNet(pageNum, pageSize, successCallback, errorCallback) {
        var htmlList = localStorage.getItem("wyf_list");
        if (htmlList != null && htmlList != "") {
            $(".clearfix").html("");
            $(".clearfix").html(htmlList);
            var liSize = $(".clearfix").find("li").length;
            pageIndex = Math.ceil(liSize / pageSize) + 1;
            mescroll.setPageNum(pageIndex);
            var paramTemp = {
                "totalCount": liSize,
                "num": pageIndex,
                "pageIndex": pageIndex,
                "pageSize": 10,
                "totalPage": pageIndex + 1,
                "htmlList": htmlList,
                "list": [],
                "hasNextPage": true
            };
            successCallback(paramTemp);
            return;
        }
        var param = {"pageIndex": pageNum, "pageSize": pageSize, "keyword": keyword, "genreId": genreId};
        var jsonParam = JSON.stringify(param);
        //延时一秒,模拟联网
        setTimeout(function () {
            $.ajax({
                type: 'post',
                url: '/localQuickPurchase/dGoodsAction/findOfWYF',
                data: jsonParam,
                contentType: "application/json",
                dataType: 'json',
                async: true, // 是否异步请求，false为同步
                success: function (data) {
                    var dataInfo = data.data.list;
                    //模拟分页数据
                    var listData = [];
                    for (var i = (pageNum - 1) * pageSize; i < pageNum * pageSize; i++) {
                        if (i == dataInfo.length) break;
                        listData.push(dataInfo[i]);
                    }
                    successCallback(data.data);
                },
                error: errorCallback
            });
        }, 1000)
    }

})
function  jumpCoupon(){
    var oEvent = event;
    oEvent.cancelBubble = true;
    window.location.href="/localQuickPurchase/activity/baiye.html";
}
function getHTML(data) {
    var html = "";
    // var result=shopgd(shareSeq);
    for (var i = 0; i < data.length; i++) {
        var goodName = data[i].goodsName;//商品名字
        var goodsName='';

        var goodsImg = data[i].thumbnail;//商品图片
        var goodsId = data[i].goodsId;//商品ID
        var goodsProStandard = data[i].goodsProStandard;
        var maxDiscounts = data[i].maxDiscounts;//最高优惠
        /*linngqinchang 2019 11 7 增加标签*/
        var coupon = data[i].coupon;
        var distributionPrice = getDistributionPrice(goodsProStandard);//分销价

        var goodsPrice = goodsProStandard[0].goodsPrice;//商品原价
        //var platformPrice = getPlatformPrice(goodsProStandard);//平台价
        // var _labelHtml='&nbsp;';
        var type = getRoleType();
        html += '<li class="good-pic" id="' + goodsId + '"> <div class="hotSaleImg">';
        html += '<img src=' + goodsImg + ' >';
        html += '<img id="maxDiscounts" src="../images/maxDiscounts.png">';
        html += '<p class="maxDiscountsValue">下单最高优惠<span style="color: gold;font-size: 0.6rem">￥' + maxDiscounts + '</span></p>';
        // html += '<img id="coupon" src="../images/hmvip_icon_label_1.png" onclick="" href="/localQuickPurchase/activity/baiye.html?shareSeq"+shareSeq>';
        /*代理商以下的身份才有优惠券领*/
        /*根据seq查询用户身份*/
        if (type==1||type==2 || !type) {
            html += '<a  href="javascript:;"><img id="coupon" onclick="jumpCoupon()" src="../images/hmvip_icon_label_1.png"></a>';
        } else  if ((type==3 ||type==4) && Coums<=100) {
            html += '<a  href="javascript:;"><img id="coupon" onclick="jumpCoupon()" src="../images/hmvip_icon_label_1.png"></a>';
        }else {
            html+="";
        }
        if(goodName.length>23){
            goodsName=goodName.substring(0,23)+"...";
            html += '</div> <p class="hotSaleTitle">' + goodsName + '</p>';
        } else{
            html += '</div> <p class="hotSaleTitle">' + goodName + '</p>';
        }
        html += '<p class="hotSalePrice">';
        html += '<span>￥</span>' + distributionPrice + '&nbsp;';
        if (goodsPrice != null && goodsPrice > 0) {
            html += '<span style="text-decoration:line-through;color: #999">￥' + goodsPrice + '</span>';
        }
        if (data[i].listLabel != null) {
            var listLabel = data[i].listLabel;
            var label = listLabel[0];
            if (label != null) {
                html += ' <span id="listLabel_btn"style="color:' + label.colour + ';border: 1px solid ' + label.colour + ';border-radius: 0.59rem;padding: 0 4px;">' + label.labelValue + '</span>';
            }
        }
        html += '</p>';
        html += '</li>';
    }
    return html;
}

function goBack(obj) {

    try {
        localStorage.removeItem("wyf_list");
        localStorage.removeItem("wyf_scrollTop");
    } catch (e) {
    }
    try {
        // 调app原生返回
        window.action.app_back();
    } catch (e) {
    }
    var a = document.referrer;
    hui.back();
}

/*商品详情*/
$(document).on('click', '.good-pic', function () {
    var goodsId = $(this).attr('id');
    if (seq == null || seq == '') {
        seq = 0;
    }
    localStorage.setItem("wyf_list", $(".clearfix").html());
    localStorage.setItem("wyf_scrollTop", mescroll.getScrollTop());
    window.location.href = "/localQuickPurchase/distributionVA/goodsDetail/" + goodsId + "/0/" + seq;
});

function goClassifyWyf() {
    window.location.href = "/localQuickPurchase/distributionVA/classify/classifyWyf?moduleName=百业联盟";
}


