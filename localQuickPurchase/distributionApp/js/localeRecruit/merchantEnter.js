$("#hui-back").click(function(){
	appGoBack();
});

//手机端返回上一页
function appGoBack(){
	try{
		// Android  调app原生返回  
		window.action.app_back();
	}catch(e){
	}
	try{
		// ios  调app原生返回  
		var json = {'function':'goBack'};
		window.webkit.messageHandlers.goBack.postMessage(json);
	}catch(e){
	}
}