function mapseach(val){
	$.ajax({
		url:'https://api.map.baidu.com/place/v2/suggestion?region=全国&city_limit=false&output=json&ak=ufanROIB49bsOCK7FEU2o7Vr',
        type: 'GET',
        dataType: 'jsonp',
        data: {
        	query:val
        },
		success : function(msi) { //成功返回值执行函数
			if(msi.message == 'ok'){
                var _listhtml = '';
                if(msi.result == ''){
                    _listhtml += '<li class="mapitem nodata">~暂时没有找到您要的信息~</li>';
                }else{
                    $.each(msi.result,function(index,el){
                        _listhtml += '<li onclick="mapItem(this)" class="mapitem" data-lng="'+ el.location.lng +'" data-lat="'+ el.location.lat +'">';
                        _listhtml += '<p class="map-name">'+ el.name +'</p>';
                        _listhtml += '<p class="map-tips">'+ el.city + el.district +'</p></li>';
                    })
                }
                $("#mapaddress").html(_listhtml);
            }
		}
	})
}
function mapItem(obj){
	var lng=$(obj).attr("data-lng");
	var lat=$(obj).attr("data-lat");
	setCookie("a-lng",lng,1);
	setCookie("a-lat",lat,1);
	window.location.href = "index.jsp";
}

$(function(){
	$("input[name='addresskey']").keyup(function(event) {
        var value = $(this).val();
        mapseach(value);
    });
})