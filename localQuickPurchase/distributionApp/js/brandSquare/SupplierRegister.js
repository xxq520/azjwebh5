$(function(){
	getClientHeight();
	resizeHeight();
	checkPwd();
	papersTypeTabTaggle();
    registerTypeTabTaggle();
	trademarkTabTaggle();
})

//获取页面可视区域高度
function getClientHeight(){
	var cHeight = document.documentElement.clientHeight;
	$('.container').css('height',cHeight+'px');
}

function resizeHeight(){
	window.onresize = function(){
		var cHeight = document.documentElement.clientHeight;
		$('.container').css('height',cHeight+'px');
	}
}

function checkPwd(){
	$('.submit-box button').on('click',function(){
		var uname = $('#uname').val();
		var pwd = $('#upwd').val();
		var repwd = $('#repwd').val();
		var reg = /^[a-zA-Z\d]\w{3,11}[a-zA-Z\d]$/;
		if(!reg.test(uname)){
			hui.toast("请输入正确的用户名");
			return false;
		}else if(!reg.test(pwd)){
			hui.toast("请输入正确的密码");
			return false;
		}else if(!reg.test(repwd)){
			hui.toast("请输入正确的密码");
			return false;
		}else if(repwd !=pwd){
			hui.toast("请输入正确的密码");
			return false;
		}
	})
}

//证件类型tab
function papersTypeTabTaggle(){
	$('.papers-type .tab1').on('click',function(){
		var i = $(this).index();
		console.log(i)
		if(i == 0){
            console.log($('.t1').attr('value'))
            checkChange($('.t1').attr('value'),'certificateType')
			$('.t1').addClass('active');
			$('.t1 .point').addClass('activePoint');
			$('.t2').removeClass('active');
			$('.t2 .point').removeClass('activePoint');
			$('.shi').show();
			$('.fou').hide();
		}else{
            console.log($('.t2').attr('value'))
            checkChange($('.t2').attr('value'),'certificateType')
			$('.t2').addClass('active');
			$('.t2 .point').addClass('activePoint');
			$('.t1').removeClass('active');
			$('.t1 .point').removeClass('activePoint');
			$('.fou').show();
			$('.shi').hide();
		}
	})
}
//注册类型
function registerTypeTabTaggle(){
    $('.registerType .tab3').on('click',function(){
        var i = $(this).index();
        console.log(i)
        if(i == 0){
            $('.t7').addClass('active');
            $('.t7 .point').addClass('activePoint');
            $('.t8').removeClass('active');
            $('.t8 .point').removeClass('activePoint');
            $('.t9').removeClass('active');
            $('.t9 .point').removeClass('activePoint');
            $('.socialCode').show();
        }else if(i == 1){
            $('.t8').addClass('active');
            $('.t8 .point').addClass('activePoint');
            $('.t7').removeClass('active');
            $('.t7 .point').removeClass('activePoint');
            $('.t9').removeClass('active');
            $('.t9 .point').removeClass('activePoint');
            $('.socialCode').show();
        }else{
            $('.t9').addClass('active');
            $('.t9 .point').addClass('activePoint');
            $('.t7').removeClass('active');
            $('.t7 .point').removeClass('activePoint');
            $('.t8').removeClass('active');
            $('.t8 .point').removeClass('activePoint');
            $('.socialCode').hide();
        }
    })
}

//注册类型(用于数据回写)
function registerTypeTab(j){
	var i;
	if(j=="00"){
		i=0;
	}else if(j=="01"){
		i=1;
	}
        if(i == 0){
            $('.t7').addClass('active');
            $('.t7 .point').addClass('activePoint');
            $('.t8').removeClass('active');
            $('.t8 .point').removeClass('activePoint');
            $('.t9').removeClass('active');
            $('.t9 .point').removeClass('activePoint');
            $('.socialCode').show();
        }else if(i == 1){
            $('.t8').addClass('active');
            $('.t8 .point').addClass('activePoint');
            $('.t7').removeClass('active');
            $('.t7 .point').removeClass('activePoint');
            $('.t9').removeClass('active');
            $('.t9 .point').removeClass('activePoint');
            $('.socialCode').show();
        }else{
            $('.t9').addClass('active');
            $('.t9 .point').addClass('activePoint');
            $('.t7').removeClass('active');
            $('.t7 .point').removeClass('activePoint');
            $('.t8').removeClass('active');
            $('.t8 .point').removeClass('activePoint');
            $('.socialCode').hide();
        }
}
//用于异步返回数据后单选按钮自动切换
function papersTypeTab(i){
	if(i == 1){
		$('.t1').addClass('active');
		$('.t1 .point').addClass('activePoint');
		$('.t2').removeClass('active');
		$('.t2 .point').removeClass('activePoint');
		$('.shi').show();
		$('.fou').hide();
	}else{
		$('.t2').addClass('active');
		$('.t2 .point').addClass('activePoint');
		$('.t1').removeClass('active');
		$('.t1 .point').removeClass('activePoint');
		$('.fou').show();
		$('.shi').hide();
	}
}

//伤悲类型tab
function trademarkTabTaggle(){
	$('.trademark .tab2').on('click',function(){
		var j = $(this).index();
		if(j == 0){
            checkChange($('.t3').attr('value'),'trademarkType');
			$('.t3').addClass('active');
			$('.t3 .point').addClass('activePoint');
			$('.t4').removeClass('active');
			$('.t4 .point').removeClass('activePoint');
			$('.ziyou').show();
			$('.shouquan').hide();
		}else{
            checkChange($('.t4').attr('value'),'trademarkType');
			$('.t4').addClass('active');
			$('.t4 .point').addClass('activePoint');
			$('.t3').removeClass('active');
			$('.t3 .point').removeClass('activePoint');
			$('.shouquan').show();
			$('.ziyou').hide();
		}
	})
}

//用于异步返回数据后单选按钮自动切换
function trademarkTab(j){
	if(j == 0){
		$('.t3').addClass('active');
		$('.t3 .point').addClass('activePoint');
		$('.t4').removeClass('active');
		$('.t4 .point').removeClass('activePoint');
		$('.ziyou').show();
		$('.shouquan').hide();
	}else{
		$('.t4').addClass('active');
		$('.t4 .point').addClass('activePoint');
		$('.t3').removeClass('active');
		$('.t3 .point').removeClass('activePoint');
		$('.shouquan').show();
		$('.ziyou').hide();
	}
}

// input输入保存localstorage
function inputChange(classed,list) {
    var flag = true;
    var seqString = seq.toString();
    var post = localStorage.getItem(seqString)? JSON.parse(localStorage.getItem(seqString)) : {};
    // console.log(typeof JSON.parse(localStorage.getItem("MerchantEntryData")) == 'object')
    $(classed).on('compositionstart', function () {
        flag = false;
    });
    $(classed).on('compositionend', function () {
        flag = true;
    });
    $(classed).on('input', function () {
        var that = this;
        setTimeout(function () {
            if (flag) {
                post[list] = that.value;
                localStorage.setItem(seqString, JSON.stringify(post));
                // console.log(that.value)
            }
        }, 1);
    });
};
// input选择输入保存localstorage
function checkChange(val,list){
    var seqString = seq.toString();
    var post = localStorage.getItem(seqString)?JSON.parse(localStorage.getItem(seqString)):{};
    post[list] = val;
    localStorage.setItem(seqString, JSON.stringify(post));
}

