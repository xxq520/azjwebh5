$(".shq-nav-tab li").on('click',function(){
	$(this).siblings().removeClass("tab-item active");
	$(this).siblings().addClass("tab-item");
	$(this).addClass("tab-item active");	
});