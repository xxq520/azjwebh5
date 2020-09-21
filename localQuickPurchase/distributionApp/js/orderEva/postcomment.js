var  orderno = getQueryString("orderno");
var  goodsCode = getQueryString("goodsCode");
var  seq = getQueryString("seq");
var  sku = getQueryString("sku");
/*if(seqQS != seq){
	//不是自己的订单  不能评价 返回首页
	window.location.href ="../index";
}*/
(function(){
	var postcomment = {
		init:function(){
			this.initData()
			this.isniming();
			this.postcm();
			this.hrefmc();
		},
		isniming:function(){
			var i = 0;
			$('.isni').on('click',function(){
				if(i == 0){
					$('.isni img').attr('src','/localQuickPurchase/distributionApp/images/orderEva/gou2.png');
					i++;
				}else{
					$('.isni img').attr('src','/localQuickPurchase/distributionApp/images/orderEva/gou1.png');
					i--;
				}
			})
		},
		postcm:function(){
			/*$('.post-btn').on('click',function(){
				$('.mask').show();
			})*/
		},
		hrefmc:function(){
			$('.gomc').on('click',function(){
				window.location.href = 'mycomment?seq='+seq;
			})
		},
		initData:function(){
			$.ajax({
				type : 'POST',
				dataType : 'json',
				url : '/localQuickPurchase/dOrders/findDetail',
				data : {
					'orderno' : orderno,
					"from":"h5"
				},
				async : false,
				success : function(result) {
					if(result.code == 200){
						var order = result.data.dOrders;
						for (var i = 0; i < order.listOrderDetails.length; i++) {
							var orderDetails = order.listOrderDetails[i];
							if(orderDetails.goodsCode == goodsCode){
								//商品图片
								$(".pro-info").find("img").attr("src",orderDetails.goodsImgUrl);
								$(".goodsName").html(orderDetails.goodsName);
							}
						}
					}
				}
				/*error : function(error) {
					hui.toast(error);
				}*/
			})
		}
	}
	postcomment.init();
})(jQuery)

function uploadFile(ojb){
    var files = ojb.files || [];
    if (files.length === 0) {
        return;
	}
	var imgsLength =  $(".imgs").length;
	if(imgsLength>9){
		hui.toast("最多只能上传9张图片");
	}
	loadingdate("图片上传中,请稍后...");
    console.log('选中 ' + files.length + ' 个文件');
   /* $.fileUploadXhr({
        url:"/localQuickPurchase/goodsImgMongoAction/uploadImg",
        fileElementId: "upload", //文件上传域的ID，这里是input的ID，而不是img的
        dataType: 'json', //返回值类型 一般设置为json
        contentType: "application/x-www-form-urlencoded; charset=utf-8",
        success: function (result) {
            console(result.code+" "+ result.message);
            if (result.code==200){

            }
        }

    });*/
    var file = ojb.files[0];
	 var self = this;  // 在each中this指向没个v  所以先将this保留
		
		var formdata = new FormData();
		formdata.append("fileList", file);	         		
		var xhr = new XMLHttpRequest();
		// 绑定上传事件
		// 进度
		console.log(file);
	    xhr.upload.addEventListener("progress",	 function(e){
	    	// 回调到外部
	    	//self.onProgress(file, e.loaded, e.total);
	    }, false); 
	    // 完成
	    xhr.addEventListener("load", function(e){
		// 从文件中删除上传成功的文件  false是不执行onDelete回调方法
	    	//self.funDeleteFile(file.index, false);
	    	// 回调到外部
			//self.onSuccess(file, xhr.responseText);
			clearLoading();
	    	console.log(e);
	    	if(e.srcElement.response != null){
	    		var result = eval('(' + e.srcElement.response + ')');
	    		if(result.url == ""){
	    			hui.alert("很抱歉上传失败了...")
				}else{
                    //上传成功
                    $(".upload-div").before('<div class="imgs"><img class="pic  pic-url" src="'+result.url+'"/><i class="del-btn" onclick="delImg(this)">X</i></div>');
                }

	    	}
	    	/*if(self.uploadFile.length==0){
	    		// 回调全部完成方法
	    		//self.onComplete("全部完成");
	    	}*/
	    }, false);  
	    // 错误
	    xhr.addEventListener("error", function(e){
	    	// 回调到外部
	    	//self.onFailure(file, xhr.responseText);
            hui.alert("很抱歉上传失败了...")
	    }, false);  
		
		xhr.open("POST","/localQuickPurchase/goodsImgMongoAction/uploadImg", true);
		//选择包含中文名的图片会报错      
		/*postcomment.js:125 Uncaught DOMException: Failed to execute 'setRequestHeader' on 'XMLHttpRequest':
		 'QQ截图20180523151131.jpg' is not a valid HTTP header field value.*/
		xhr.setRequestHeader("X_FILENAME", encodeURI(file.name));
		xhr.send(formdata);
}
function delImg(obj){
	$(obj).parent().remove();
}
function eva(obj){
	var evaluateContent =  $('.eva-content').val();
	if(evaluateContent == null || evaluateContent == ""){
		hui.alert("请输入评论内容");
		return;
	}
	var isAnonymous = $('.isni img').attr('src').indexOf("2.png") > -1 ? 1 :0;
	var imgsPathList= [];
	var listPocUrl = $(".pic-url");
	for (var i = 0; i < listPocUrl.length; i++) {
		imgsPathList[i] = listPocUrl.eq(i).attr("src");
	}
	$.ajax({
		type : 'POST',
		dataType : "json",	//设置返回值得类型
		contentType: "application/json;charset=utf-8",
		url : '/localQuickPurchase/api/eva/save',
		data : JSON.stringify( {
			 "orderNo" : orderno,
			 "goodsCode" : goodsCode,
			 "sku":sku,
			 "userSeq" : seq,
			 "evaluateContent": evaluateContent,
			 "isAnonymous" : isAnonymous,
			 "imgsPathList" : imgsPathList,
			 "deviceType" : "H5",
		}),
		async : false,
		success : function(result) {
			if(result.code == 200){
				$('.mask').show();
			}
			if(result.code == 405) {
				hui.alert("请勿重复评价");
			}
			if(result.code == 501) {
				hui.alert(result.message,"确定",function (){
					window.location.href = '../index';
				});
			}
		}
		/*error : function(error) {
			hui.toast(error);
		}*/
	})
}