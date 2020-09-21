document.writeln("	<style>");
document.writeln("	.hui-header{background:#db0020;color:white;border:none;}");
document.writeln("	.hui-header #hui-back:before, .hui-header #hui-header-menu:before{color:white;}");
document.writeln("	#hui-header-sreach{width:70%;border-radius:60px;display:inline-block;position:relative;}");
document.writeln("	#hui-header-sreach input{width:100%;background:white;border-radius:60px;display:inline-block;font-size:13px;line-height:28px;text-indent:40px;margin-top: 10px;}");
document.writeln("	#hui-header-sreach::after{font-family: \'hui-font\';content: \'\\e714\';color: #999999;display: block;position: absolute;z-index: 22;width: 28px height:32px;left: 15px;top: 0;}");
/*
document.writeln("	#hui-header-menu:before{content:\'\';display:block;width:100%;height:100%;background:url(\'image/brandSquare_icon-top-n.png\') no-repeat center center;background-size:60% auto;}");
*/
document.writeln("	#hui-header-menu:before{content:\'\';display:block;width:100%;height:100%;background-size:60% auto;}");
document.writeln("");
document.writeln("	</style>");

document.writeln("	<header class=\'hui-header\'>");
document.writeln("		<div id=\'hui-back\' onclick=\"javascript:history.go(-1);\"></div>	");
document.writeln("	    <div id=\'hui-header-sreach\'>");
document.writeln("	        <input id=\'searchKey\' readonly=\'readonly\' placeholder=\'请输入需要搜索的商品名称\'>");
document.writeln("	    </div>");
document.writeln("	    <div id=\'hui-header-menu\'>");
document.writeln("	    </div>");
document.writeln("	</header>");