(function(){
	var common = {
		init:function(){
			this.getClientHeight();
			this.resizeHeight();
			this.backStap();
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
		backStap:function(){
			$('.back').on('click',function(){
				window.history.go(-1);
			})
		}
	};
	common.init();
})(jQuery)
