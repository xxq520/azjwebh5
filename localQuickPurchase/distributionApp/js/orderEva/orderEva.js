(function(){
	var commonBg = {
		init:function(){
			this.getClientHeight();
			this.resizeHeight();
			//this.back();
		},
		//获取页面可视区域高度
		getClientHeight:function(){
			var cHeight = document.documentElement.clientHeight;
			$('.container').css('height',cHeight+'px');
		},
		resizeHeight:function(){
			window.onresize = function(){
				var cHeight = document.documentElement.clientHeight;
				$('.container').css('height',cHeight+'px');
			}
		},
		/*back:function(){
			$('.back').on('click',function(){
				window.history.go(-1);
			})
		}*/
	}
	commonBg.init();
})(jQuery)
