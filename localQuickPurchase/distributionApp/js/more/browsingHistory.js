
//增加浏览历史
function addGoodsHistoryBySeq(seq, goodsId) {
	var userSeq;
//	if(seq != null && seq != 0) {
		userSeq = "userGoodsHistory";
//	 } else {
//		 return
//	 }
	
/*	 //只保存十个
	 var cookieValue = getGoodsHistoryBySeq(userSeq);
	 var goodsValueCookie = cookieValue;
	 var goodsValue;//
	 var objList = goodsValueCookie.split(",");//切割字符串
	 //
	 var indexOf = cookieValue.indexOf(goodsId);//查看是否有重复的goodsId
	 if(cookieValue != null && cookieValue != "") {
		 
		 if(indexOf != -1) {
			 var cr = cookieValue.replace(goodsId + ",", "");
			 if(objList.length >= 10) {
				 var list9 = objList[9];
				 var crs = cookieValue.replace(list9 + ",", "");
				 goodsValue = (goodsId + "," + crs)
			 } else {
				 goodsValue = goodsId + "," + cr
			 }
			 
		 } else {
			 if(objList.length >= 10) {
				 var list9 = objList[9];
				 var crs = cookieValue.replace(list9 + ",", "");
				 goodsValue = (goodsId + "," + crs)
			 } else {
				 goodsValue = (cookieValue += "," + goodsId)
			 }
		 }
	 } else {
		 goodsValue = goodsId + ",";
	 }*/
	 var date = new Date();
	 date.setHours(date.getHours() + (24 * 120)); //保存六个月
	 setGoodsHistory(userSeq, goodsId, date);

}

//设置Cookie
function setGoodsHistory(seq, goodsId, expiredays) {
	 var exdate = new Date();
	 exdate.setDate(exdate.getDate() + expiredays);
	 document.cookie = seq + "=" + encodeURIComponent(goodsId) + ((expiredays==null) ? "" : ";expires=" + exdate.toGMTString() + ";path=/");
}

//获取浏览历史
function getGoodsHistoryBySeq(seq) {
	var arr = document.cookie.split('; ');
	var i = 0;
	for(i = 0; i<arr.length; i++) {
		var arr2=arr[i].split('=');
		if(arr2[0] == seq) {  
			var getC = decodeURIComponent(arr2[1]);
			return getC;
		}
	}
	return '';
}

//删除浏览历史
function deleteGoodsHistoryBySeq(userGoodsHistory) {
	setGoodsHistory(userGoodsHistory, '1', -1);
}