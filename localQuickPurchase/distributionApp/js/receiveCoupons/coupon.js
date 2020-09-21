(function(){
	var coupon = {
		init:function(){
			this.clickUseinfo();
		},
		//查看使用说明
		clickUseinfo:function(){
            $(document).on('click','.info',function(){
                $('.mask').show();
			});
            $(document).on('click','.mask',function() {
            	$(this).hide();
            });
		}
	};
	coupon.init();
})(jQuery)
