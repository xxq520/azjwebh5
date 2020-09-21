var lngSave; //经度
var latSave; //纬度
var tLocation; //经纬度
var _content = "/localQuickPurchase";

var saveWhether = false;



//location.href=document.referrer;
var shippingAddressId = getQueryString("shippingAddressId");
var sheng ;
var shi;
var qu;
var keyword;
$(function(){
    if(!isLogin()){
        loginPage();
    }
    initAddress(shippingAddressId);
    getAddress();
})
$(".sexRadio").click(function(event) {
    if(!$(this).hasClass('checked')){
        $(this).addClass('checked').siblings().removeClass('checked');
    }
});
/* 普通选择器 非关联型绑定 */
var picker1 = new huiPicker('#btn1', function(){
    var val = picker1.getVal(0);
    var txt = picker1.getText(0);
    hui('#btn1').html(txt + '[' + val + ']');
});
picker1.bindData(0, [{value:1, text:'男'},{value:2, text:'女'}]);
/* 地区选择， 关联型数据 */
var picker2 = new huiPicker('#btn2', function(){
    sheng   = picker2.getText(0);
    shi     = picker2.getText(1);
    qu      = picker2.getText(2);

    var cityCode = picker2.getVal(1);
    console.log("城市编号: " + cityCode);
    flag = true; //选中状态
    keyword = sheng + shi + qu;
    hui('#btn2').html(keyword);
});
picker2.level = 3;
//cities 数据来源于 cities.js
picker2.bindRelevanceData(cities);







function setDefault(obj){
	var _this=$(obj);
	if($(_this).val()=="默认地址"){
		return;
	}
	var data={};
	data.userName = userName;
	data.shippingAddressId = $(obj).attr("data-code");
	
	//用户直接点击地址先修改默认地址shippingAddressId为空,则获取父级的shippingAddressId
	if($(obj).attr("data-code") == null){
		data.shippingAddressId =  $(obj).parent().attr("data-id");
	}
	$.ajax({
    		url:_content + "/shippingAddress/setDefault",
    		type:"POST",
    		contentType: "application/json; charset=utf-8",
    		data:JSON.stringify(data),
    		async:false, 
    		dataType:"json",
    		success:function(data){
    			////console.log(data);
    			if(data.code == 200){
    				$(".default-address").html("设为默认地址");
    				$(".default-address").attr("style","color:black");
    				
    				//obj为空表明用户直接点击地址,先修改默认再进行跳转,不需要把当前文本改成"默认地址"
    				if($(obj).attr("data-code") != null){
	    				$(_this).html("默认地址");
	    				$(_this).attr("style","color:red");
    				}
    			}
    		}
    	});
}

function initAddressList(){
    var data = {};
    data.userName = userName;
    $.ajax({
        url: _content+'/shippingAddress/allShippingAddress',
        type: 'POST',
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        data:JSON.stringify(data),
    })
    .done(function(res) {
        //console.log(res);
        if(res.code == 200){
            var data = res.data;
            var _html = '';
            if(data != null && data.shing.length > 0) {
                $.each(data.shing,function(index, el) {
                	//console.log(el);
                	var bdef=""
                	var sex = el.shippingSex;
                	var tipLocation = el.tipLocation;
                	var tipProvince = el.tipProvince;
                	var tipDistrict = el.tipDistrict;
                	var tipCity = el.tipCity;
                	if(tipProvince == null){
                		tipProvince = "";
                	}
                	if(tipCity == null){
                		tipCity = "";
                	}
                	tipCity = judgeCity(tipCity);
                	if(el.bDefault){
                		bdef='<span class="default-address user-default" onclick="setDefault(this)" data-code="'+el.shippingAddressId+'" style="color:red">默认地址</span>'
                	}else{
                		bdef='<span class="default-address user-default2" onclick="setDefault(this)" data-code="'+el.shippingAddressId+'" >设为默认地址</span>'
                	}
                    _html += '<div class="list-item" data-id="'+ el.shippingAddressId +'">';
                    _html += '<div class="aDetail" onclick="address(this);" is-default='+el.bDefault+' sex='+sex+' tipLocation='+tipLocation+' data-id="'+ el.shippingAddressId +'" >';
                   /* _html += '<div class="address">'+el.tipName + el.address +'</div><div class="name-tel">';*/
                    /*if(el.tipName.indexOf("市") > 0){//判断是否定位，没有的话就拼上市
                     	_html += '<div class="address">'+ tipProvince + el.tipName + el.address +'</div><div class="name-tel">';                    	
                     }else{
                     	_html += '<div class="address">'+ tipProvince +  tipCity +el.tipName + el.address +'</div><div class="name-tel">';                    	
                    }*/
                    _html += '<div class="address">'+ el.tipProvince + el.tipCity + el.tipDistrict  + el.address +'</div><div class="name-tel">';
                    _html +='<span class="user-name">'+ el.shippingName +'</span>';
                    _html += '<span class="user-tel">'+ el.shippingTelephone +'</span></div></div>';
                    _html += '<div class="operation">'+bdef+'<a href="javascript:;" onclick="editAddress(this)" class="eidt">';
                    _html += '<i class="font-ico">&#xe85d;</i>编辑</a>';
                    _html += '<a href="javascript:;" onclick="deleteAddress(this)"; class="del">';
                    _html += '<i class="font-ico">&#xe866;</i>删除</a></a></div></div>';
                });
                $(".address-list").html(_html);
                
            } else {
            	hui.confirm("收货地址为空,是否添加新的的收货地址",[ '取消', '添加' ],function() {
            		 window.location.href = '/localQuickPurchase/generalStore/html/address-add.jsp';
			    },function(){
			    	window.history.back(-1)
			    });
            }
            
        }
    })
    .fail(function() {
        //console.log("error");
    })
    .always(function() {
        //console.log("complete");
    });
}


function address(t) {
	var v = getQueryString("v");
	if(v != null && v == "2") {
		return;
	}
	setDefault(t);
	var shippingAddress = {}; 
	var address = $(t).children(".address").text();
	var userName = $(t).children(".name-tel").children(".user-name").text();
	var shippingTelephone = $(t).children(".name-tel").children(".user-tel").text();
	
	var isDefault = $(t).attr("is-default");
	var sex = $(t).attr("sex");
	var id = $(t).parent().attr("data-id");
	var tipLocation = $(t).attr("tipLocation");
	shippingAddress.address = address;
	shippingAddress.userName = userName;
	shippingAddress.shippingTelephone = shippingTelephone;
	shippingAddress.isDefault = isDefault;
	shippingAddress.sex = sex;
	shippingAddress.id = id;
	shippingAddress.tipLocation = tipLocation;
	$.cookie('shippingAddress', JSON.stringify(shippingAddress), { expires: 1, path: '/'});
	
	/**
	 * 处理在新增完地址 不跳转问题
	 */
	var href = window.location.href;
	var index = href.indexOf("?");
	if(index != -1) {
		//现场招商增加判断
		var temp = href.indexOf("?redisKey")
		if(temp != -1){
			href = href.substring(temp, href.length);
			window.location.href = '/localQuickPurchase/investmentGoods/settlement'+ href;
		}
	}
	var isAdd = getCookie("isAdd");
	if(isAdd != null && isAdd == "true") {
		setCookie("isAdd", "", -1);
		history.go(-2);
	} else {
		history.go(-1);
	}
}

function delAddress(id){
    var data = {};
    data.shippingAddressId = id;
    $.ajax({
        url: _content+'/shippingAddress/deleteShippingAddress',
        type: 'POST',
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        data:JSON.stringify(data),
    })
    .done(function(res) {
        //console.log(res);
        if(res.code == 200){
            $(".resultTip").text("删除成功！").show(300).delay(2000).hide(300);
            var t = setTimeout(function(){
                window.location.reload();
            },1500);
        }else{
            $(".resultTip").text("删除失败！").show(300).delay(2000).hide(300);
        }
    })
    .fail(function() {
        //console.log("error");
    });
}


function editAddress(that){
    var id = $(that).parents(".list-item").attr("data-id");
    window.location.href = 'address-add.jsp?shippingAddressId='+id;
};

$(document).on("click",".list-item",function(){
    var shippingAddressId = $(this).attr("data-id");
    if(shoppingCartId || seq){
        var url = 'placeOrder.jsp?shoppingCartId='+shoppingCartId+'&seq='+ seq +'&addressId='+shippingAddressId;
        console.log("url: " + url);
        //window.location.href = url;
    }
})
/*$(".del").on("click",function(){
    var shippingAddressId = $(this).parents(".list-item").attr("data-id");
    delAddress(shippingAddressId);
})*/
function deleteAddress(obj){
    // $(obj)
	var shippingAddressId = $(obj).parents(".list-item").attr("data-id");
/*	if($(obj).parents(".operation").children().eq(0).html()=="默认地址"){
		$(".resultTip").text("默认地址不能删除！").show(300).delay(2000).hide(300);
	}else{*/
		hui.confirm('确认删除该地址？', ['取消','确定'], function(){
			$.cookie('shippingAddress', null, {path: '/'});
			delAddress(shippingAddressId);
		});
	/*}*/
}
$(".go-back").on("click",function(){
	//alert("上个页面的url: " +  document.referrer);
	if (document.referrer.indexOf("address-add.jsp") > 0) {
		window.history.go(-2);
	} else {
		window.history.back(-1);
	}
})
function initAddress(i){
    var data={};
    data.shippingAddressId = i;
    $.ajax({
        url: _content+'/shippingAddress/queryShippingAddress',
        type: 'post',
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(data),
    })
    .done(function(res) {
        //console.log(res);
        if(res.code == 200){
        	$(".top-bar-tit").text("修改地址");
           var data = res.data.shipping;
           var city = data.tipCity;
           var tipName = data.tipName;
           var locationCity = data.tipProvince  + city + data.tipDistrict
           var tipAddress = data.tipAddress;
           var username = data.shippingName;
           var phone = data.shippingTelephone;
           var sex = data.shippingSex;
           var nowDistrict = data.tipDistrict;
           var tipLocation = data.tipLocation;
           if(tipLocation!=''||tipLocation!=null){
               lng = tipLocation.split(',')[0];
               lat = tipLocation.split(',')[1];
            }
           
           $("input[name=citySeach]").val(city);         
           $("#btn2").html(locationCity);
           keyword = locationCity;

           $(".street").html(data.address);
           $("input[name=username]").val(username);
           $("input[name=tel]").val(phone);
           if(sex=='先生'){
                $(".sexRadio").eq(0).addClass('checked').siblings().removeClass('checked');
           }else{
                $(".sexRadio").eq(1).addClass('checked').siblings().removeClass('checked');
           }
       }
    })
    .fail(function() {
        //console.log("error");
    })
    .always(function() {
        //console.log("complete");
    });
}
$("input[name=setadderss]").click(function(event) {  
	var flag = $("#btn2").html();
	if (flag == "选择地区") {
    	return hui.alert("请先选择地区!");
    }
	var topName = $(".top-bar-tit").html();
	var address = $("textarea[name=detailed]").val(); //详细地址
	processAjaxRequest(keyword , topName == "修改地址" ? true : false);
	/*var shippingAddressId = getQueryString("shippingAddressId");
    var tSex = $(".sexRadio.checked").text(); //性别
    var address = $("textarea[name=detailed]").val(); //详细地址
    var citySeach = $("input[name=citySeach]").val();
    var shippingName = $("input[name=username]").val();
    var tipProvince = sheng; //省
    var tCity = shi; //城市
    var tArea = qu; //区
    var mobile = $("input[name=tel]").val();
    var tLocation = processAjaxRequest(keyword + address); //获取经纬度并复制
    console.log("经纬度: " + tLocation);
    var tName = keyword;
    var flag = $("#btn2").html();
    if( address == ''){
        $(".resultTip").text("请输入详细地址").show(300).delay(2000).hide(300);
        return;
    }
    else if( shippingName == ''){
        $(".resultTip").text("请输入收货人").show(300).delay(2000).hide(300);
        return;
    }else if( mobile == ''){
        $(".resultTip").text("请输入电话").show(300).delay(2000).hide(300);
        return;
    }else if(!(isPoneAvailable(mobile))){
    	$(".resultTip").text("请输入正确的电话").show(300).delay(2000).hide(300);
        return;
    }*/
    /*var tLocation = tLng+','+tLat;
    var tLng = $("input[name=l_lng]").val();
    var tLat = $("input[name=l_lat]").val();
    var cityArea = $("input[name=cityArea]").val();
    var myreg =  /^1\d{10}$/; 
    if( cityArea == ''){
        $(".resultTip").text("请选择城市分区").show(300).delay(2000).hide(300);
        return;
    }else if( address == ''){
        $(".resultTip").text("请输入详细地址").show(300).delay(2000).hide(300);
        return;
    }else if( citySeach == ''){
        $(".resultTip").text("请输入城市").show(300).delay(2000).hide(300);
        return;
    }
    else if( shippingName == ''){
        $(".resultTip").text("请输入收货人").show(300).delay(2000).hide(300);
        return;
    }else if( mobile == ''){
        $(".resultTip").text("请输入电话").show(300).delay(2000).hide(300);
        return;
    }else if(!(isPoneAvailable(mobile))){
    	$(".resultTip").text("请输入正确的电话").show(300).delay(2000).hide(300);
        return;
    }
<<<<<<< HEAD
    $(this).unbind("click");
    updateAddress(shippingAddressId,shippingName,address,tName,tCity,tArea,mobile,tLocation,tSex);
});
function updateAddress(shippingAddressId,shippingName,address,tName,tCity,tArea,mobile,tLocation,tSex){
=======
    if(tCity.indexOf("香港") >= 0 || tCity.indexOf("澳门") >= 0 || tCity.indexOf("台湾") >= 0){
    	hui.confirm("爱之家尚未开通港澳台等偏远地区的物流配送,请重新选择收货地址、由此为您带来的不便我们深感歉意!",[ '取消', '确定' ],function() {
	    },function(){
	    });
		return;
    }
    var tipProvince = findProvinceByCity(tCity);
    if(tipProvince == null || tipProvince == ""){
    	$(".resultTip").text("请输入正确的地级市").show(300).delay(2000).hide(300);
    	return;
    }
    var boole = limitAddress(tipProvince);
    if(boole){
    	hui.confirm("爱之家尚未开通港澳台等偏远地区的物流配送,请重新选择收货地址、由此为您带来的不便我们深感歉意!",[ '取消', '确定' ],function() {
	    } ,function(){
	    });
		return;
    }*/
    //updateAddress(shippingAddressId,shippingName,address,tName,tCity,tArea,mobile,tLocation,tSex);
});
function updateAddress(shippingAddressId,shippingName,address,tName,tCity,tArea,mobile,tLocation,tSex){
	console.log(shippingAddressId+"--"+shippingName+"--"+address+"--"+tName+"--"+tCity+"--"+tArea+"--"+mobile+"--"+tLocation+"--"+tSex);
	var urlNow = _content+'/shippingAddress/editShippingAddress';
    var data = {};
    if(null == shippingAddressId){
    	urlNow = _content+'/shippingAddress/saveShippingAddress';
    }
    if("" == shippingAddressId){
    	shippingAddressId = null;
    }
    data.shippingAddressId = shippingAddressId;
    data.shippingName = shippingName;
    data.address = address;
    data.tipName = tName;
    data.tipCity = tCity;
    data.tipDistrict = tArea;
    data.userName = userName;
    data.shippingTelephone = mobile;
    data.tipLocation = tLocation;
    data.shippingSex = tSex;
    data.tipProvince = sheng;
    
    $.ajax({
        url: urlNow,
        type: 'post',
        dataType: 'json',
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        sync:true,
    })
    .done(function(res) {
        ////console.log(res);
        if(res.code == 200){
            saveWhether = true;
        	$("input[name=setadderss]")
            var tempAddress = JSON.stringify(data);
            setCookie("tempAddress",tempAddress,365);
            setCookie("isAdd", true);
            hui.toast("保存成功！");
            // $(".resultTip").text("保存成功！").show(300).delay(2000).hide(300);
            var t = setTimeout(function(){
            	//window.history.back(-1);
            	window.location.replace(document.referrer);
            	//window.location.href = document.referrer + "?ios=" + getRandom(10000000);
            },150);
        } else {
            hui.toast(res.message);
        	// $(".resultTip").text(res.message).show(300).delay(2000).hide(300);
        }
    })
    .fail(function() {
        //console.log("error");
    })
    .always(function() {
        //console.log("complete");
    });
}
function selectAddr(obj){
	var _self = $(obj);
	var city = _self.attr("data-city");
    var area = _self.attr("data-area");
    var cityArea = city + area;
    var lng = _self.attr("data-lng");
    var lat = _self.attr("data-lat");
    var _name=_self.attr("data-name");
    $("input[name=cityArea]").val(_self.text());
    $("input[name=detailed]").val(_self.text());
    $("input[name=l_city]").val(city);
    $("input[name=l_area]").val(area);
    $("input[name=l_lng]").val(lng);
    $("input[name=l_lat]").val(lat);
    $("input[name=l_name]").val(_self.text());
    $(".suggestion").hide();
}
$("input[name=cityArea]").keyup(function(event) {
	var citySeach = $("input[name=citySeach]").val();
    var value = $(this).val();
    getAddress(citySeach,value);
    
    $(".suggestion").css("overflow-y","auto");
    $(".suggestion").css("height","700%");
    $(".suggestion").show();
    $(document).on("click",".suggestionItem",function(){
        var city = $(this).attr("data-city");
        var district = $(this).attr("data-district")
        var name = $(this).attr("data-name");
        var area = $(this).attr("data-area");
        var cityArea =  district + name;
        var lng = $(this).attr("data-lng");
        var lat = $(this).attr("data-lat");
        $("input[name=cityArea]").val(cityArea);
        $("input[name=detailed]").val($(this).text());
        $("input[name=l_city]").val(city);
        $("input[name=l_area]").val(area);
        $("input[name=l_district]").val(district);
        $("input[name=l_lng]").val(lng);
        $("input[name=l_lat]").val(lat);
        $("input[name=l_name]").val($(this).text());
        $(".suggestion").hide();
    });
    $(document).click(function(){
        $(".suggestion").hide();
    })
});
function getAddress(citySeach,i){
    $.ajax({
        url: 'https://api.map.baidu.com/place/v2/suggestion?region='+citySeach+'&city_limit=true&output=json&ak=ufanROIB49bsOCK7FEU2o7Vr',
        type: 'GET',
        dataType: 'jsonp',
        data: {query:i},
    })
    .done(function(res) {
        //console.log(res);
        if(res.message == 'ok'){
            var _html = '';
            //alert(res.result.length);
            if(res.result == ''){
                _html += '<li class="suggestionItem">暂时没有找到您要的信息...</li>';
            }else{
                $.each(res.result,function(index,el){
                	var _name=el.name;
                	if(_name.indexOf(el.city)!=-1){
                		_name=(el.name).split(el.city)[1]; 
                	}
                	if(_name.indexOf(el.district)!=-1){
                		_name=(el.name).split(el.district)[1]; 
                	} 
                	//console.log(el);
                    _html += '<li class="suggestionItem" onclick="selectAddr(this)" data-city="'+ el.city +'" data-area="'+ el.district +'" data-name="'+_name+'"  data-lng="'+ el.location.lng +'" data-lat="'+ el.location.lat +'" " data-district="'+ el.district +'">' + el.city + el.district + _name +'</li>';
                })
            }
            $(".suggestionList").html(_html);
        }
    })
    .fail(function() {
        //console.log("error");
    })
    .always(function() {
        //console.log("complete");
    });
}
//根据城市来查找省
function findProvinceByCity(tipCity){
	var tipProvince = null;
	var data1 = {};
    data1.tipCity = tipCity;
	if(tipCity == null){
		return false;
	}
	$.ajax({
		url:_content+'/shippingAddress/findProvinceByCity',
		type: 'post',
		contentType: "application/json;charset=utf-8",
		dataType: 'json',
		data: JSON.stringify(data1),
		async:false,
		success : function(data){
			if(data.code == 200){
				tipProvince = data.data.name;
			}
		},
		error : function(){
			
		}
	})
	return tipProvince;
}
//新疆、西藏、宁夏、青海、内蒙古、甘肃、黑龙江、吉林、辽宁、香港、台湾、澳门等偏远地区限制
function limitAddress(tipProvince){
	if(tipProvince.indexOf("新疆") >= 0 || tipProvince.indexOf("西藏") >= 0 || tipProvince.indexOf("宁夏") >= 0 || 
			tipProvince.indexOf("青海") >= 0 || tipProvince.indexOf("内蒙古") >= 0 || tipProvince.indexOf("甘肃") >= 0 || 
			tipProvince.indexOf("黑龙江") >= 0 || tipProvince.indexOf("吉林") >= 0 || tipProvince.indexOf("辽宁") >= 0 || judgeTipProvince.indexOf("海南") >= 0){
		return true;
    }else{
    	return false;
    }
}

/**
 * 根据完整地址得到一组经纬度
 * @param keyword	完整地址
 * @returns
 */
function processAjaxRequest(keyword, editFlag){
	var shippingAddressId = getQueryString("shippingAddressId");
    var tSex = $(".sexRadio.checked").text(); //性别
    var address = $("textarea[name=detailed]").val(); //详细地址
    var citySeach = $("input[name=citySeach]").val();
    var shippingName = $("input[name=username]").val();
    var tipProvince = sheng; //省
    var tCity = shi; //城市
    var tArea = qu; //区
    var mobile = $("input[name=tel]").val();
    var tName = keyword;
    var flag = $("#btn2").html();
    if( address == ''){
        $(".resultTip").text("请输入详细地址").show(300).delay(2000).hide(300);
        return;
    }
    else if( shippingName == ''){
        $(".resultTip").text("请输入收货人").show(300).delay(2000).hide(300);
        return;
    }else if( mobile == ''){
        $(".resultTip").text("请输入电话").show(300).delay(2000).hide(300);
        return;
    }else if(!(isPoneAvailable(mobile))){
    	$(".resultTip").text("请输入正确的电话").show(300).delay(2000).hide(300);
        return;
    }
	var sendUrl = "https://api.map.baidu.com/geocoder/v2/?address=" + keyword +
					"&output=json&ak=ufanROIB49bsOCK7FEU2o7Vr&callback=processAjaxResponse";
	if (keyword) {
	    $.ajax({ 
	        type:"get",       //http请求方法,默认:"post" 
	        url:sendUrl,   //发送请求的地址 
	        dataType:"jsonp",   //预期服务器返回的数据类型
	        async: true,
	        success:function(data) {
	        	if (data.status == 0) {
	        		lngSave = data.result.location.lng; //经度
	        		latSave = data.result.location.lat; //纬度
	        		tLocation = latSave + "," + lngSave;
	        		console.log("保存的经度: " + lngSave);
	        		console.log("保存的纬度: " + latSave);
	        	}
	        	if (!saveWhether){
                    updateAddress(shippingAddressId,shippingName,address,tName,tCity,tArea,mobile,tLocation,tSex);
                }
	        }
	     }); 
	}
	return tLocation;
} 
