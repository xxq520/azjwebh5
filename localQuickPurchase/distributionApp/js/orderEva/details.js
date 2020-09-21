(function(){
	var details = {
		init:function(){
			this.banner();
		},
		//swiper
		banner:function(){
		    var swiper3 = new Swiper('#swiper3', {
		    	lazy:true,
		      	pagination: {
		        	el: '.swiper-pagination',
		        	type: 'fraction',
		      	},
		      	loop:true
	      	})
		}
	};
	details.init();
})(jQuery);
