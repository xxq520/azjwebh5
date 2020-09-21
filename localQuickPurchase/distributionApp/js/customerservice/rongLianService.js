//接入容联平台对象 有两种方式  1使用js对接 如下所示  2使用固定连接 , 固定连接退出功能暂未找到
(function () {
    document.title = "爱之家商城";
    $.getScript('https://ykf-webchat.7moor.com/javascripts/7moorInit.js?accessId=44bb9a90-697f-11ea-b9c9-03d1435eea4d&autoShow=false&language=ZHCN',
        function () {
        });

})();
var goodsShow = getCookie("GoodsShow");
if (goodsShow) {
    try {
        var parse = JSON.parse(goodsShow);
        var m7CardInfo = {
            "left": {
                "url": parse.goodsImgUrl  // 左侧图片地址，可不填
            },
            "right1": {
                "text": parse.goodsName,  // 首行文字内容，展示时超出两行隐藏，卡片上单行隐藏
                "color": "#595959",                 // 字体颜色，支持十六位 #ffffff 格式的颜色，不填或错误格式默认#595959
                "fontSize": 18                      // 字体大小， 默认12 ， 请传入number类型的数字
            },
            "right2": {
                "text": "内饰做工精细，外观大气",        // 第二行文字内容，展示时超出两行隐藏，卡片上单行隐藏
                "color": "#595959",                 // 字体颜色，支持十六位 #ffffff 格式的颜色，不填或错误格式默认#595959
                "fontSize": 12                      // 字体大小， 默认12 ， 请传入number类型的数字
            },
            "right3": {
                "text": "¥" + parse.goodsdistributionPrice,           // 第三行文字内容，展示时超出两行隐藏，卡片上单行隐藏
                "color": "#ff6b6b",                 // 字体颜色，支持十六位 #ffffff 格式的颜色，不填或错误格式默认#ff6b6b
                "fontSize": 14                      // 字体大小， 默认14 ， 请传入number类型的数字
            },
            "extraInfos": ["随时随地－连接企业与客户"],             // 额外信息，访客不可见，座席点击卡片上的更多可见，可不填，字符串形式的文本数组
            "url": parse.goodsUrl                     // 点击可跳转的链接
        }

    } catch (e) {

    }
}


// function openCustomer() {
//     alert("456");
//     qimoChatClick();
// }