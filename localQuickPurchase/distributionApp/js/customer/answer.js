var subclassificationId = getQueryString("subclassificationId");
seq;
var id = getQueryString("id");
if (subclassificationId == null && id == null) {
	subclassificationId = getCookie("smallId");
	id = getCookie("id");
} else {
	setCookie("smallId",subclassificationId,30);
	setCookie("id",id,30);
}
getList();

function getList(){
	$.ajax({
		type : 'GET',
		dataType : 'json',
		data : {"id":subclassificationId,"userSeq":seq},
		url : '/localQuickPurchase/customer/information',
		success : function(data){
		
			if (data.code == 200) {
			
				var information = data.data.information;
				if (information != null  && information != "[]") {
					var obj = JSON.parse(information); 
					console.log(obj);
					var html = '';
                    var ISStatus;
					for (var i = 0; i < obj.length; i++) {
						var infoId = obj[i].Id;// 自增Id
						var Issue = obj[i].Issue;// 问题
						var Answer = obj[i].Answer;// 答案
						var Sort = obj[i].Sort;// 排序

                        // 小分类Id
						var SubclassificationId = obj[i].SubclassificationId;
						var ThrowingFlowers;// 点赞次数
						var ThrowingEgg;// 被彩次数
						
						if (id == infoId) {
                            //是否已点赞 0：未操作；1：已点赞；2：已踩
                            ISStatus = obj[i].ISStatus;
							ThrowingFlowers = obj[i].ThrowingFlowers;// 点赞次数
							ThrowingEgg = obj[i].ThrowingEgg;// 被彩次数
							//html += '<div class="answer-title">账号登录</div>';
							html += '<div class="answer-des">';
							html += '<div class="des-detail">'+Sort+'.'+Issue+'？</div>';
							html += '<div class="des-detail">答:'+Answer+'</div>';
							html += '</div>';
						}
					}
					html += '<div class="handle-bar">';
					html += '<div class="btn-good bd-right" onclick=right("'+subclassificationId+'","'+id+'","'+1+'","'+ISStatus+'")><img src="/localQuickPurchase/distributionApp/images/customer/zan.png"/>('+ThrowingFlowers+') 给个赞</div>';
					html += '<div class="btn-bad" onclick=bad("'+subclassificationId+'","'+id+'","'+2+'","'+ISStatus+'")><img src="/localQuickPurchase/distributionApp/images/customer/cai.png"/>('+ThrowingEgg+') 踩一下</div>';
					html += '</div>';
					$('.answer-panel').html(html);
				} else {
					var html ='<div class="menu-list">没有更多数据了...';
					html+= '</div>';
					$('.content').html(html);
				}
				
			} else {
				var html ='<div class="menu-list">没有更多数据了...';
				html+= '</div>';
				$('.content').html(html);
			}
		},
		error : function(data){

		}
	})
}




/*var id = getQueryString("id");
var subclassificationId = getQueryString("subclassificationId");
var Issue = getQueryString("Issue");

if (id == null && subclassificationId == null && Issue == null) {
	id = getCookie("sId");
	subclassificationId = getCookie("subId");
	Issue = getCookie("Issue");
} else {
	setCookie("sId",id,30);
	setCookie("subId",subclassificationId,30);
	setCookie("Issue",Issue,30);
}
if (Issue != null) {
	$('.answer-title').html(Issue+"?");
}
$.ajax({
	type : 'GET',
	dataType : 'json',
	data : {"subclassificationId":subclassificationId,"qAId":id,"type":0},
	url : '/localQuickPurchase/customer/manage',
	success : function(data){
		var manage = data.data.manage;
		if (manage != null) {
			var obj = JSON.parse(manage); 
			console.log(obj);
			var Answers = obj.Answers;
			var list = obj.list;
			var html = '<div class="des-detail">'+Answers+'</div>';
			$('.answer-des').html(html);
		} else {
			hui.alert("没有更多数据！");
		}
	},
	error : function(data){
		
	}
})*/

/*点击事件*/
function right(subclassificationId,qAId,type,ISStatus){
    /*if (ISStatus != 0){
        hui.alert("您已经点赞或踩一下，不能继续操作！")
    } else {*/
        operation(subclassificationId,qAId,type,ISStatus);
   /* }*/
};
function bad(subclassificationId,qAId,type,ISStatus){
    /*if (ISStatus != 0){
        hui.alert("您已经点赞或踩一下，不能继续操作！")
    } else {*/
        operation(subclassificationId,qAId,type,ISStatus);
	/*}*/
};

function operation(subclassificationId,qAId,type,ISStatus){
		/*if ((type == 1 && qAId != num) || (type == 2 && qAId != nums)) {*/
    if (ISStatus != 0){
        hui.alert("您已经点赞或踩一下，不能继续操作！")
    } else {
        if (type == 1) {
            var text = "点赞成功";
        } else {
            var text = "踩一下成功";
        }
        $.ajax({
            type: 'GET',
            dataType: 'json',
            data: {"subclassificationId": subclassificationId, "qAId": qAId, "type": type, "userSeq": seq},
            url: '/localQuickPurchase/customer/manage',
            success: function (data) {
                if (data.code == 200) {
                    hui.alert(text);
                    getList();
                }
            },
            error: function (data) {

            }
        })
    }
}
//客服
/*$(function () {
	$.getScript("//kefu.easemob.com/webim/easemob.js?tenantId=35647&hide=true&sat=false");
})
function customer(){
	Airlines();
};*/
