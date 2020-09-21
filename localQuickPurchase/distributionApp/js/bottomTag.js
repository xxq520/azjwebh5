
var _hmt = _hmt || [];
/*(function() {
  var hm = document.createElement("script");
  hm.src = "https://hm.baidu.com/hm.js?57760ed3c8fe28c8a3ac0e142fabdab6";
  var s = document.getElementsByTagName("script")[0]; 
  s.parentNode.insertBefore(hm, s);
    try{
        var cnzz_protocol = (("https:" == document.location.protocol) ? " https://" : " http://");
        $("body").append(unescape("%3Cspan style='display:none;'  id='cnzz_stat_icon_1275444738'%3E%3C/span%3E%3Cscript src='" + cnzz_protocol + "s5.cnzz.com/z_stat.php%3Fid%3D1275444738' type='text/javascript'%3E%3C/script%3E"));
    }catch (e) {
    }
})();*/

document.writeln("<div id=\'popup\' style=\'position:fixed;background:rgba(0,0,0,.5);top:0;left:0;width:100%;height:100%;z-index:9999;display:none;\'>");
document.writeln("		");
document.writeln("		<div  class=\'popup animated bounceIn\'>");
document.writeln("			<div class=\'popup-head bd-bot\'>");
document.writeln("				<div class=\'popup-title\'>消息通知</div>");
document.writeln("				<b id=\'btn-close\' class=\'btn-close\'></b>");
document.writeln("			</div>");
document.writeln("			<div class=\'popup-body bd-bot\'>");
document.writeln("				<div class=\'welcome-txt\'>");
document.writeln("						亲爱的朋友！感谢选购爱之家商城 平台商品，我们货真价实、服务至上。520，我爱您！");
document.writeln("					您已经具备零成本成为分享经济平台爱之家商城的尊贵代理商的资格，将有大波福利等待您分享！");
document.writeln("						建议您现在就申请成为我们的代理商，请按下面按钮：");
document.writeln("				</div>");
document.writeln("				<div class=\'wel-btns\'>");
document.writeln("					<div class=\'btn-cancel\'>拒绝</div>");
document.writeln("					<div class=\'btn-sure\'>同意</div>");
document.writeln("				</div>");
document.writeln("			</div>");
document.writeln("			<div  id=\'look_more\' class=\'look-more bd-bot\'>");
document.writeln("				<div class=\'look-more-txt\'>");
document.writeln("					查看代理商的福利");
document.writeln("				</div>");
document.writeln("				<div class=\'arrow\'></div>");
document.writeln("			</div>");
document.writeln("			<div class=\'popup-footer\'>");
document.writeln("				<div class=\'duty\'>");
document.writeln("					<p>共享经济平台爱之家商城尊贵代理商的福利：</p>");
document.writeln("					<p>1、自购省钱，成为尊贵代理商后，您自购自用本平台商品则单单享有超级优惠。</p>");
document.writeln(" 					<p>2、享有共享经济平台爱之家商城全品类商品的网络分享经营权。</p>");
document.writeln(" 					<p>3、通过您分享给好友在爱之家商城购物后，您能获得高比例的销售返佣。</p>");
document.writeln(" 					<p>4、享有爱之家商城平台为代理商临时量身订制的其它福利。</p>");
document.writeln(" 					<p>合理合法赚钱光荣，但名额有限，赶紧行动吧！</p>");
document.writeln("				</div>");
document.writeln("			</div>");
document.writeln("		</div>");
document.writeln("		");
document.writeln("	</div>");


$(".client-name").text(userName);

$(".btn-close,.btn-cancel").click(function(){
	$("#popup").hide();
});


$(".btn-sure").click(function(){
	$.ajax({
		type : "post",	//定义提交的类型9
		contentType : "application/json;charset=utf-8",
		url : "/localQuickPurchase/dApplicationAction/submitApply",
		dataType : "json",	//设置返回值得类型
		//contentType : "application/json;charset=utf-8",
		data : JSON.stringify({"seq" : parseInt(seq)}),
		async : false,	//是否异步请求，false为同步
		success : function(data) {
			if(data.code == 200){
				
				$("#popup").hide();
				if(isRoleConsumer()) {
					hui.alert("升级成功,请退出重新登录", "确认", function(){
						loginOffByBack();
						setTimeout(function () {
							window.location.href="${path}/distributionVA/personal/index";
						 }, 1000);
					});
				} else {
					hui.alert("升级申请已提交,请等待审核.", "确认", function(){
						
					});
				}
				
			}
		}
	});
});

//默认隐藏
$(function(){
	var footer = document.querySelector(".popup-footer");
	footer.classList.toggle("hide");
});

//展开查看更多
document.getElementById("look_more").addEventListener("click",function(){
	var footer = document.querySelector(".popup-footer");
	footer.classList.toggle("hide");
	document.getElementById("look_more").classList.toggle("bd-bot");
	document.querySelector(".arrow").classList.toggle("rotate");
},true);

function submitApply() {
	$.ajax({
		type : "POST",//定义提交的类型
		contentType : "application/json;charset=utf-8",
		url : "/localQuickPurchase/dApplicationAction/submitApply",
		dataType : "json",//设置返回值得类型
		data : JSON.stringify({"seq" : parseInt(seq)}),
		async : false,//是否异步请求，false为同步
		success : function(data) {//成功返回值执行函数 
			if (data.code == 200) {
				hui.toast("申请提交成功~");
			} else {
				hui.toast("申请失败,请重试！");
			}
		},
		error: function (jqXHR, textStatus, errorThrown) {
           
        }
	});
}