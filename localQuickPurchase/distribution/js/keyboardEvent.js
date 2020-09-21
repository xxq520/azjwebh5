document.onkeydown=function(event){
    var e = event || window.event || arguments.callee.caller.arguments[0];
    // if(e && e.keyCode==27){ // 按 Esc
    //     //要做的事情
    //     alert("Esc");
    // }
    // if(e && e.keyCode==113){ // 按 F2
    //     //要做的事情
    //     alert("F2");
    // }
    if(e && e.keyCode==13){ // enter 键
        //要做的事情
        searchDetailClick();
    }
};