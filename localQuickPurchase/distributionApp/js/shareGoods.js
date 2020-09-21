
$(function() {
	 soshm('#share', {
         // 分享的链接，默认使用location.href
         url: '',
         // 分享的标题，默认使用document.title
         title: '',
         // 分享的摘要，默认使用<meta name="description" content="">content的值
         digest: '',
         // 分享的图片，默认获取本页面第一个img元素的src
         pic: '',
         // 默认显示的网站为以下六个个,支持设置的网站有
         // weixin,weixintimeline,qq,qzone,yixin,weibo,tqq,renren,douban,tieba
         sites: ['weixin', 'weixintimeline', 'yixin', 'weibo', 'qq', 'qzone']
       });
});