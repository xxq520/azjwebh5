
  

// // 滑动导航栏
// var swiper = new Swiper('.swiper-container', {
//     slidesPerView: 5,
//     spaceBetween: 10,
//     pagination: {
//         el: '.swiper-pagination',
//         clickable: true,
//     },
// });


$(document).ready(function(){

    // // tab栏切换
    $('.swiper-container>.swiper-wrapper>.swiper-slide').click(function(){
        $(this).addClass("active").siblings().removeClass("active");
        var thatIdx = $(this).index();
        // console.log(thatIdx);
       var $plContent = $('.plContent');
    //    console.log($plContent);
       $plContent.eq(thatIdx).addClass('selected').siblings().removeClass('selected');
    });


    // 综合排序点击显示下拉框

    $('.total').click(function(){
        // $(this).toggleClass('.sort_active');
        $(this).parent().siblings('.drop_down').toggleClass('current');
        $(this).find('.down').toggleClass('rotate');
        // console.log($(this).find('.down'));
    })


    // 下拉框点击显示选中样式
    $('.drop_down ul li').click(function(){
        // alert($(this));
        $(this).addClass('active').siblings().removeClass('active');
        $(this).children().addClass('img_active').parent().siblings().children().removeClass('img_active');
    })


});

