
/*var res = false;
var myGeo = new BMap.Geocoder();
var province ='';//省
var city = ''; //市
var district = ''; //区
*/
//解析定位地址
function init(lng,lat){
	var lg = lng;
	var lt = lat;
	if(lg == '' || lt == ''){
		return false;
	}
	/*var adds = [
		new BMap.Point(lng,lat),
		];
	var pt = adds[0];
	myGeo.getLocation(pt, function(rs){
		var addComp = rs.addressComponents;
		province= addComp.province; //省
		city = addComp.city ;  //市
		district = addComp.district; // 区
	});*/
}
//初始化位置,省市区,如果重新定位指定请调  init() 方法重置一下省市区
init(lng,lat);

//判断当前区域是否限制分销
function allowDistribution(){
	var res = false;
	var province =getCookie("fxProvince");//省fxCity
	var city = getCookie("fxCity"); //市
	var district = getCookie("fxDistrict"); //区
	var lg = getCookie("fxLng");
	var lt = getCookie("fxLat");
	if(province == '' || city == '' || district == '' || lg == '' || lt == ''){
		return false;
	}
	var rs = false;
	var url = "/localQuickPurchase/proAreaRestriction/allowDistribution";
	var param = {"province":province,"city":city,"district":district};
	console.info(param);
	$.ajax({
		url:url,
		type:"POST",
		data:param,
		async:false,
		dataType:"json",
		success:function(result){
			if(result.code == 200){
				rs = true;
			}else{
				rs = false;
			}
		},
		error:function(error){
			rs =  false;
		}
	})
	return rs;
}