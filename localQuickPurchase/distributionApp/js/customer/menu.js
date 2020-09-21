/*客服问题：大分类数据*/
var num = 0;
var type = getQueryString("type");
$.ajax({
    type: 'GET',
    dataType: 'json',
    url: '/localQuickPurchase/customer/bigCategories',
    success: function (data) {
        if (data.code == 200) {
            var customer = data.data.customer;
            var domainName = data.data.domainName;//图片域名
            if (customer != null) {
                var obj = JSON.parse(customer);
                console.log(obj);
                var list = '';
                for (var i = 0; i < obj.length; i++) {
                    var id = obj[i].Id;// 自增Id
                    var CreateName = obj[i].CreateName;// 添加人
                    var ImgUrl = obj[i].ImgUrl;// 图片地址
                    var MacroeconomyName = obj[i].MacroeconomyName;// 大分类名称
                    var picUrl = domainName + ImgUrl.substr(1);
                    num = i;
                    list += '<div class="menu-panel bd-bot bd-top account">';
                    list += '<div class="menu-logo bd-right">';
                    list += '<div class="logo">';
                    list += '<img src="' + picUrl + '" />';
                    list += '</div>';
                    list += '<div class="panel-title">' + MacroeconomyName + '</div>';
                    list += '</div>';
                    list += '<div class="panel-content" id="panel-content' + id + '" num="' + id + '">';
                    //var app = getSmallCategories(id)
                    $.ajax({
                        type: 'GET',
                        dataType: 'json',
                        data: {"id": id},
                        url: '/localQuickPurchase/customer/smallCategories',
                        success: function (data) {
                            var small = data.data.small;
                            var obj = JSON.parse(small);
                            console.log(obj);
                            var domainName = data.data.domainName;

                            var html = '';
                            var MacroeconomyId = null;
                            for (var i = 0; i < obj.length; i++) {
                                var id = obj[i].Id;// 自增Id
                                MacroeconomyId = obj[i].MacroeconomyId;// 自增Id
                                var SubclassficationName = obj[i].SubclassficationName;// 添加人
                                html += '<div class="answer-link">';
                                //var astr = "./answerList?id=" + id + "&type=" + type;
                                //html += '<a href="./answerList?id=' + id+"&type="+type + '">' + SubclassficationName + '</a>';
                                html += '<a href="./answerList?id=' + id+"&type="+type + '">' + SubclassficationName + '</a>';
                                html += '</div>';
                            }
                            console.log(SubclassficationName);
                            /*	var num = $('.panel-content').attr("num");
                                if (MacroeconomyId == num) {*/
                            $('#panel-content' + MacroeconomyId).append(html);
                            /*}*/
                        },
                        error: function (data) {

                        }
                    })
                    //插入小分类内容
                    /*list += '<div class="panel-content">';
                        list += '<div class="answer-link">';
                            list += '<a href="./answerList">账户登录</a>';
                        list += '</div>';
                    list += '</div>';*/
                    list += '</div>';
                    list += '</div>';
                }
                $('.content').html(list);
            } else {
                hui.alert("没有更多数据！");
            }

        } else {
            var html = '<div class="menu-list">没有更多数据了...';
            html += '</div>';
            $('.content').html(html);
        }
    },
    error: function (data) {

    }
})

/*获取小分类内容*/
function getSmallCategories(id) {
    var html = '';
    $.ajax({
        type: 'GET',
        dataType: 'json',
        data: {"id": id},
        url: '/localQuickPurchase/customer/smallCategories',
        success: function (data) {
            var small = data.data.small;
            var obj = JSON.parse(small);
            console.log(obj);
            var domainName = data.data.domainName;

            html += '<div class="panel-content">';
            for (var i = 0; i < obj.length; i++) {
                var id = obj[i].Id;// 自增Id
                var MacroeconomyId = obj[i].MacroeconomyId;// 自增Id
                var SubclassficationName = obj[i].SubclassficationName;// 添加人


                html += '<div class="answer-link">';
                html += '<a href="./answerList">' + SubclassficationName + '</a>';
                html += '</div>';

            }
            html += '</div>';
        },
        error: function (data) {

        }
    });
    return list;
}
//客服
/*$(function () {
	$.getScript("//kefu.easemob.com/webim/easemob.js?tenantId=35647&hide=true&sat=false");
})
var flag = false;
function customer(){
	if (flag) {
		return console.log("请勿重复提交!");
	}
	Airlines();
	flag = true;
};
*/