/**
 * 严选好货--更多商品
 */
var pageIndex = 1;
var isLoading = false;
var first = true;
var pageSize = 10;
var columnName = "";
var singState = getQueryString("name");
if(singState != null) {
	if(singState == "严选好货"){
		$("._title").text("严选精品");
		$("._title_H1").text("严选精品");
	}else if(singState == "臻实惠") {
		$("._title").text("真实惠");
		$("._title_H1").text("真实惠");
	}
	else {
		$("._title").text(singState);
		$("._title_H1").text(singState);
	}
	columnName  = singState;
}

function getMore(){
	if(!isLoading){
		if($(".nothing").length == 0){
			var _html  = '<li style="width: 100%;"><p class="drp_bottom font-sm person1 nothing" style="text-align: center;margin-top: 1rem;" id="morn2" >没有更多了</p></li>';
			$("#list").append(_html);
		}else{
			$(".nothing").show();
		}
		return;
	}
	var html = '';
	$.ajax({
		type : 'post',
		dataType : 'JSON',
		contentType: "application/json;charset=utf-8",
		url : '/goods/selectionGoods/SelectionGoodsCom',
		data : JSON.stringify({
			columnName: columnName,
			pageIndex : pageIndex,
			pageSize : pageSize
		}),
		async : false,
		success : function(data){
			var code = data.code;
			var listData = data.data.list;
			if(code == 200 && listData != null && listData.length > 0) {
				for(var i = 0; i < listData.length; i++){
					var _data = listData[i];
					html += getHTML(_data);
				}
				$(html).appendTo('#list');
				pageIndex++;
			} else {
				isLoading = false;
                return false;
			}
		},
		error : function(error) {
			hui.toast(error);
		}
	});
}

//下拉刷新
function refresh(){ 
    var html ='';
    $.ajax({
		type : 'post',
		dataType : 'json',
		contentType: "application/json;charset=utf-8",
		url : '/goods/selectionGoods/SelectionGoodsCom',
		data : JSON.stringify({
			columnName: columnName,
			pageIndex : 1,
			pageSize : pageSize
		}),
		async : false,
		success : function(data) {
			var code = data.code;
			var listData = data.data.list;
			if(code == 1000 && listData != null && listData.length > 0) {
				var s = listData;
				for(var i = 0; i < s.length; i++){
					var _data = s[i];
					html += getHTML(_data);
				}
				pageIndex = 2;
				$('#list').html(html);
				first = false;
			} else {
				html += "<h3>没有商品了，去逛逛其他的吧</h3>";
				$('#list').html(html);
			}
		},
		error : function(error) {
			hui.toast(error);
		}
	});
}


/*商品详情*/
$(document).on('click', '.good-pic', function() {
	var goodsId = $(this).attr('id');
	if(seq == null || seq == '') {
		seq = 0;
	}
    window.location.href="./goodsDetail/goodsDetail.html?goodsId="+goodsId+"&distributorSeq=0&shareSeq="+seq;
});

function getHTML(data) {
	var html = "";
	var goodsName = data.goodsName;//商品名字
	var goodsImg = data.thumbnail;//商品图片
	var goodsId = data.goodsId;//商品ID
	var goodsProStandard = data.goodsProStandard;
	var distributionPrice = getDistributionPrice(goodsProStandard);//分销价

	html += '<li> <div class="hotSaleImg">'
	html += '<img id="'+goodsId+'"src=' + goodsImg + ' class="good-pic">'
	html += '</div> <p class="hotSaleTitle">' + goodsName + '</p>'
	html += '<p class="hotSalePrice">'
	html += '<span>￥</span>'+ distributionPrice + '</p> </li>'
	return html;
}