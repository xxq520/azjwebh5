// 选择图片
function clickImg(file) {
	var reader = new FileReader();
	reader.onload = function (evt) {
		$("#shopImg").attr("src",evt.target.result);
	}
	reader.readAsDataURL(file.files[0]);
	
	updateImgNum = 1;
	//$("#campaignFrom").submit(); //提交表单。
};

/*图片路径获取*/
function getObjectURL(file) {
	var url = null;
	if (file !== undefined) {
		if (window.createObjectURL != undefined) {
			url = window.createObjectURL(file)
		} else if (window.URL != undefined) {
			url = window.URL.createObjectURL(file)
		} else if (window.webkitURL != undefined) {
			url = window.webkitURL.createObjectURL(file)
		}
	}
	return url;
};

/**
 * 修改页面图片
 * @param file
 * @returns
 */
function uploadImg(file) {
	var srcs = getObjectURL(file.files[0]);
	if (file.files[0] !== undefined) {
		if (file.files[0].size > 2 * 1024 * 1024) {
			$(file)[0].outerHTML = $(file)[0].outerHTML;
			hui.toast("图片大小不能超过2M");
		} else {
			$("#huiarrow").removeClass("hui-arrow");
			$(file).siblings('#imgfile').html("<img src='" + srcs + "' />");
		}
	}
	uploadLicenseImgPath(file);
}

/**
 * 将图片路径转成base64
 * @param file
 * @returns
 */
function uploadLicenseImgPath(file) {
	var type = $(file).attr('id');
	var img = new Image();
	var reader = new FileReader();
	reader.onload = function(evt) {
		$(".imgUrl").attr('src', evt.target.result);
	}
	reader.readAsDataURL(file.files[0]);
};

/**
 * 获取修改店铺页面的店铺信息
 * @returns
 */
function getEditShopInfo() {
	$.ajax({
		url : "/localQuickPurchase/virtualShopAction/getShopEditInfo",
		type : "post",
		dataType : "json",
		//contentType : "application/json;charset=utf-8",
		data : {"seq" : seq},
		async : true,
		success : function(res){
			console.log(res);
			if(res.code == 200){
				$("#shopImg").attr("src", res.data.storeHeadImg == null?"":res.data.storeHeadImg);
				$("#shopName").val(res.data.storeName);
				$("#seq").html(res.data.seq);
			} else{
				console.log(res.message);
				hui.alert("系统异常,查询失败!");
			}
		}
	});
}