
$(function () {
    var $html = "<div id='div-onchat' style='position:fixed;top: 71%;right:6px;z-index: 100'>" +
        "<a ><img src='/localQuickPurchase/distributionApp/images/customer/icon_1.png' style='width:50px;height:50px;border-radius:25px' />" +
        "</a>" +
        "</div>";
    $('body').append($html);
    $("#div-onchat").click(function () {
         window.location.href = "/localQuickPurchase/distributionVA/customer/menu?type=1";
    })
    var cont = $("#div-onchat");
    var contW = $("#div-onchat").width();
    var contH = $("#div-onchat").height();
    var startX, startY, sX, sY, moveX, moveY;
    // var winW = $(window).width();
    // var winH = $(window).height();
    var winW = document.body.clientWidth;
    var winH = document.body.clientHeight;
    var barrage_name = $("#div-onchat");
    var barrage_frame = $("#div-onchat");
    var body = $("body");
    var firstDiv=$(".topBarsearch").height();
    var lastDiv = $("#hui-footer-bottom").height();
    var PH = window.innerHeight; //可视高度
    var t = '';
    window.onscroll = function () {
        // alert(111111)
        t = window.scrollY
        // console.log(t);
    }
    cont.on({ //绑定事件
        touchstart: function (e) {
            startX = e.originalEvent.targetTouches[0].pageX; //获取点击点的X坐标
            startY = e.originalEvent.targetTouches[0].pageY; //获取点击点的Y坐标
            //console.log("startX="+startX+"************startY="+startY);
            sX = $(this).offset().left; //相对于当前窗口X轴的偏移量
            sY = $(this).offset().top; //相对于当前窗口Y轴的偏移量
            leftX = startX - sX; //鼠标所能移动的最左端是当前鼠标距div左边距的位置
            rightX = winW - contW + leftX; //鼠标所能移动的最右端是当前窗口距离减去鼠标距div最右端位置
            topY = startY - sY; //鼠标所能移动最上端是当前鼠标距div上边距的位置
            bottomY = PH - contH + topY; //鼠标所能移动最下端是当前窗口距离减去鼠标距div最下端位置
        },
        touchmove: function (e) {
            e.preventDefault();
            moveX = e.originalEvent.targetTouches[0].clientX; //移动过程中X轴的坐标
            moveY = e.originalEvent.targetTouches[0].clientY; //移动过程中Y轴的坐标
            movepageY = e.originalEvent.targetTouches[0].pageY - t;
            if (moveX < leftX) {
                moveX = leftX+6;
            }
            if (moveX > rightX) {
                moveX = rightX-6;
            }
            if (moveY < (topY+firstDiv)) {
                moveY = topY+firstDiv;
            }
            if (moveY > (bottomY - lastDiv)) {
                moveY = (bottomY - lastDiv);
            }
            //初始化拖动值
            $(this).css({
                "left": moveX + sX - startX,
                "top": moveY + sY - startY,
            })
        },

    })
    changeLive()
    function changeLive() {
        var cont = $("#liveLiST");
        var contW = $("#liveLiST").width();
        var contH = $("#liveLiST").height();
        var startX, startY, sX, sY, moveX, moveY;
        // var winW = $(window).width();
        // var winH = $(window).height();
        var winW = document.body.clientWidth;
        var winH = document.body.clientHeight;
        var barrage_name = $("#liveLiST");
        var barrage_frame = $("#liveLiST");
        var body = $("body");
        var firstDiv=$(".topBarsearch").height();
        var lastDiv = $("#hui-footer-bottom").height();
        var PH = window.innerHeight; //可视高度
        var t = '';
        window.onscroll = function () {
            // alert(111111)
            t = window.scrollY
            // console.log(t);
        }
        cont.on({ //绑定事件
            touchstart: function (e) {
                startX = e.originalEvent.targetTouches[0].pageX; //获取点击点的X坐标
                startY = e.originalEvent.targetTouches[0].pageY; //获取点击点的Y坐标
                //console.log("startX="+startX+"************startY="+startY);
                sX = $(this).offset().left; //相对于当前窗口X轴的偏移量
                sY = $(this).offset().top; //相对于当前窗口Y轴的偏移量
                leftX = startX - sX; //鼠标所能移动的最左端是当前鼠标距div左边距的位置
                rightX = winW - contW + leftX; //鼠标所能移动的最右端是当前窗口距离减去鼠标距div最右端位置
                topY = startY - sY; //鼠标所能移动最上端是当前鼠标距div上边距的位置
                bottomY = PH - contH + topY; //鼠标所能移动最下端是当前窗口距离减去鼠标距div最下端位置
            },
            touchmove: function (e) {
                e.preventDefault();
                console.log(firstDiv)
                moveX = e.originalEvent.targetTouches[0].clientX; //移动过程中X轴的坐标
                moveY = e.originalEvent.targetTouches[0].clientY; //移动过程中Y轴的坐标
                movepageY = e.originalEvent.targetTouches[0].pageY - t;
                if (moveX < leftX) {
                    moveX = leftX+6;
                }
                if (moveX > rightX) {
                    moveX = rightX-6;
                }
                if (moveY < (topY+firstDiv)) {
                    moveY = topY+firstDiv;
                }
                if (moveY > (bottomY - lastDiv)) {
                    moveY = (bottomY - lastDiv);
                }
                //初始化拖动值
                $(this).css({
                    "left": moveX + sX - startX,
                    "top": moveY + sY - startY,
                })
            },

        })
    }

})