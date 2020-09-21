document.writeln("<div id=\'hint\' style=\'position:fixed;background:rgba(0,0,0,.5);top:0;left:0;width:100%;height:100%;z-index:9999;display: none;\'>");

document.writeln("	</div>");



$("body").on('click','.btn-close',function(){
    $("#hint").hide();
});
