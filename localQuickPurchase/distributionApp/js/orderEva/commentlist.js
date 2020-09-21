(function(){
	var commentlist = {
		init:function(){
			this.imgSwiper();
		},
		//点击图片查看原图
		imgSwiper:function(){
			$('.img-item').on('click',function(){
				$('#swiper5').show();
				var imgs = $(this).parent().find('img');
//				var imgUrls = [];
				var html = '';
				for(var i = 0;i < imgs.length;i++){
//					imgUrls.push(imgs[i].src);
					html+=`
						<div class="swiper-slide">
							<img src="${imgs[i].src}">
						</div>
					`;
				}
				$('#swiper5 .swiper-wrapper').html(html);
//				console.log(html)
//				console.log(imgUrls)
				var swiper5 = new Swiper('#swiper5',{
					lazy:true,
			      	pagination: {
			        	el: '.swiper-pagination',
			        	type: 'fraction',
			      	},
			      	loop:true,
				})
				swiper5.slideTo($(this).index()+1, 1, false);
			})
			$('#swiper5').click(function(){
				$(this).hide();
			})
		}
	};
	commentlist.init();
})(jQuery);
