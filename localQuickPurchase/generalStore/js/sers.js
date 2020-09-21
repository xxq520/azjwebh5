$(function() {
	var serchUrl = lxcPath+"search/api/thesaurus/searchByWord";
	var focusNum = 0;
	$("#mou_input2").attr("autocomplete","off");
    $('#mou_input').focus(function() {
    	window.scrollTo(0,0);
        $('#ser_page').show();
        var str = $(this).val();
        $('#mou_input2').val("").focus().val(str);
        foucinput2();
        focusNum = 0;
        /*window.ontouchmove = function(e) {
            e.preventDefault && e.preventDefault();
            e.returnValue = false;
            e.stopPropagation && e.stopPropagation();
            return false;
        }*/
    });
    $('#close_serc').click(function() {
        $('#ser_page').hide();
        /*window.ontouchmove = function(e) {
            e.preventDefault && e.preventDefault();
            e.returnValue = true;
            e.stopPropagation && e.stopPropagation();
            return true;
        }*/
    });
    $(".sum_page_form").click(function(){
    	if(!(trimsd($('#mou_input').val()) != null && trimsd($('#mou_input').val()).length>0)){
    		$('#mou_input').val(titleSearcher);
    	}
    	$('#formInput1').submit();$('#formInput').submit();
    });
    $(".sum_page_form2").click(function(){
    	if(!(trimsd($('#mou_input2').val()) != null && trimsd($('#mou_input2').val()).length>0)){
    		$('#mou_input2').val(titleSearcher);
    	}
    	$('#formInput2').submit();
    });
    
    $("#formInput2").submit(function(){
    	if(!(trimsd($('#mou_input2').val()) != null && trimsd($('#mou_input2').val()).length>0)){
    		$('#mou_input2').val(titleSearcher);
    	}
    	return true;
    })
    
    //去除空格
	function trimsd(str) {
		return str.replace(/\s/g, "");
	}
	
	var titleSearcher = trimsd($("#mou_input").val());
	if($("#ser_keys").val() != null && $("#ser_keys").val().length>0){
		titleSearcher = $("#ser_keys").val();
	}
	$('#mou_input').attr("placeholder",titleSearcher)
	$('#mou_input2').attr("placeholder",titleSearcher)
   /* $('#mou_input2').focus(function() {
    	
    })
    */
    function foucinput2(){
		if(focusNum == 0){
    		$("#lxc_ul").html("");
    		$(".lxc_sec").show();
    		if($("#se_in_type").length < 1){
    			$('#mou_input2').val("");
    		}
    	}
    	focusNum ++;
	}
    
    $('#mou_input2').blur(function(){
    	if(!(trimsd($(this).val()) != null && trimsd($(this).val()).length>0)){
    		$(this).val(titleSearcher);
    	}
    });
    
    $('.clear_in_val').click(function() {
        $('#mou_input').val('');
    });
    $('.clear_in_val2').click(function() {
        $('#mou_input2').val('');
        $("#lxc_ul").html("");
		$(".lxc_sec").show();
    });
    $('#clear_all_hist').click(function() {
        var myUrl = '/wap/touch/user.do?m=clearKeys';
        $.ajax({
            url: myUrl,
            success: function(data) {
                $('.page_content').html("<div class='no_search'><span>没有历史搜索记录</span></div>");
            }
        });
    })
    /* 自动实时搜索  */
    var $serInput = $("#mou_input2");
    var flag;  //全局变量用于标识是否延时执行keyup事件
    var kw;
   /* $serInput.keyup(function(event){
    	//clearTimeout(flag);
    	//flag = setTimeout(function(){
			//获取输入框
			kw = $serInput.val();
			//去掉输入字符串两端的空格
			kw = kw.replace(/(^\s*)|(\s*$)/g,"");
			if (kw == "") {
				$("#lxc_ul").html("");
	    		$(".lxc_sec").show();
			} else {
				runSearchAjax(kw);
			}
        //}, 500);
	});*/
    
    var bind_name="input";//定义所要绑定的事件名称
    if(navigator.userAgent.indexOf("MSIE")!=-1) bind_name="propertychange";//判断是否为IE内核 IE内核的事件名称要改为propertychange
    /*输入框键盘离开事件绑定bind('keyup',fun)*/
    $serInput.bind(bind_name,function(){
    	clearTimeout(flag);
    	flag = setTimeout(function(){
	    	kw = $serInput.val();
	    	//去掉输入字符串两端的空格
			kw = kw.replace(/(^\s*)|(\s*$)/g,"");
			if (kw == "") {
				$("#lxc_ul").html("");
	    		$(".lxc_sec").show();
			} else {
				runSearchAjax(kw);
			}
		}, 500);
    });
    var funKey = function(){
    	kw = $serInput.val();
    	//去掉输入字符串两端的空格
		kw = kw.replace(/(^\s*)|(\s*$)/g,"");
		if (kw == "") {
			$("#lxc_ul").html("");
    		$(".lxc_sec").show();
		} else {
			runSearchAjax(kw);
		}
    }
    
    function runSearchAjax(kw){
    	$.ajax({
    		type:"get",
    		async:false,
    		dataType:"jsonp",
    		url:serchUrl,
            data: {t:encodeURI(kw),"version":"v1","source":"touch","ip":ipsinput,"mmbId":mmbuidinput,},
    		timeout:1500,
    		jsonpCallback:'showCallback',
    		success:function(data){
    			showCallback(data);
	    	}
    	})
    }
    function showCallback(data){
    	if(data == null || data == 'undefined' || data == ''){
    		$("#lxc_ul").html("");
    		$(".lxc_sec").show();
    		return false;
    	}
    	var cata_htmls = "";
    	var couns_tot = 0;
    	$.each(data, function(i) {
    		if(data[i].count > 0){
	    		var enStr="";
	    		if(data[i].type == 'suggest_'){//联想词id
	    			enStr = '/wap/shop/searchproduct.do?keyword='+data[i].name;
	    			cata_htmls += "<li><a href='"+enStr+"'>"+data[i].name+"<span class='shopList_Num'>约"+data[i].count+"件</span></li>";
	    		}else if(data[i].type == 'product_brand_'){//品牌
	    			enStr = '/wap/shop/searchproduct.do?keyword='+kw+"&brands="+data[i].id+"&searchType="+1;
	    			cata_htmls += "<li><a href='"+enStr+"'>在<span class='shop_lists'> "+data[i].name+" </span>品牌中搜索<span class='shopList_Num'>约"+data[i].count+"件</span></a></li>";
	    		}else if(data[i].type == 'product_catelog_'){//分类
	    			var cataType = data[i].level;//分类层次
	    			enStr = '/wap/shop/searchproduct.do?keyword='+kw+"&cataType="+cataType+"&cataSerId="+data[i].id+"&searchType="+2;
	    			cata_htmls += "<li><a href='"+enStr+"'>在<span class='shop_lists'> "+data[i].name+" </span>分类中搜索<span class='shopList_Num'>约"+data[i].count+"件</span></a></li>";
	    		}
	    		couns_tot++;
    		}
    	});
    	if(couns_tot > 0){
	    	$("#lxc_ul").html(cata_htmls);
	    	$(".lxc_sec").hide();
    	}else{
    		$("#lxc_ul").html("");
    		$(".lxc_sec").show();
    	}
    }
})