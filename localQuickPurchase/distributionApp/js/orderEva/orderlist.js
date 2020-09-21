(function(){
	var orderlist = {
		init:function(){
			this.ordertabtaggle();
			this.headerTabTaggle();
		},
		ordertabtaggle:function(){
			function setCurrentSlide(ele, index) {
                $("#swiper1 .swiper-slide span").removeClass("active");
                ele.addClass("active");
            }
			var swiper1 = new Swiper('#swiper1', {
                slidesPerView: 5,
                paginationClickable: true,
                freeMode: false, 
                loop: false,
                onTab: function(swiper) {
                    var n = swiper1.clickedIndex;
                }
            });
            swiper1.slides.each(function(index,val) {
                var ele = $("#swiper1 .swiper-slide span").eq(index);
                ele.on("click", function() {
                    setCurrentSlide(ele, index);
                    swiper2.slideTo(index, 500, false);
                    //mySwiper.initialSlide=index;
                });
            });
            var swiper2 = new Swiper('#swiper2',{
            	freeMode: true, 
                direction: 'horizontal', 
                loop: false,
                autoHeight: true,
                onSlideChangeEnd: function(swiper){
                    var n = swiper.activeIndex;
                    setCurrentSlide($("#swiper1 .swiper-slide").eq(n), n);
                    swiper1.slideTo(n, 500, false);
                }
            })
		},
		headerTabTaggle:function(){
			$('.header .tab span').each(function(i){
				$(this).on('click',function(){
					$('.header .tab span').eq(i).addClass('active').siblings().removeClass('active');
				})
			})
		}
	};
	orderlist.init();
})(jQuery);
