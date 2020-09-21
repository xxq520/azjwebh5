var clientId = "520AiZhiJiaWap";
function conf(){
    return {
        "client_id":"520AiZhiJiaWap",
        "client_secret":"520",
        "Basic": "NTIwQWlaaGlKaWFXYXA6NTIw",
        "scope":"fenxiao"
    }
};

/**
 * 关系绑定
 */
function bindRelation() {
    var shareSeq = getShareId();
    var bindMsg;

    var bindLogin = {
        async: false,
        url: '/upms/userBind/loginBind',
        contentType: "application/json;charset=utf-8",
        type: "POST",
        data: JSON.stringify({"shareSeq":shareSeq}),
        dataType: "json",
        success:function(data){
            if(data.code == 1000) {
                bindMsg = data.data;
            }
        },
        error:function(res){

        }
    };
    refresh(bindLogin);
    return bindMsg;
}

var IP = getRootPath();

// 登录获取token信息，保留cookie
function login(userName,pwd){
    var config = conf();
    var form = new FormData();
    form.append("client_id", config["client_id"]);
    form.append("client_secret", config["client_secret"]);
    form.append("grant_type", "password");
    form.append("scope", config["scope"]);
    form.append("username", userName);
    form.append("password", pwd);
    loadingdate("登录中,请稍后...")
    $.ajax({
        async: true,
        crossDomain: true,
        url: IP+'/upms/oauth/token',
        method: "POST",
        type: "POST",
        headers: {
            "Authorization": "Basic "+config.Basic
        },
        processData: false,
        contentType: false,
        mimeType: "multipart/form-data",
        data: form,
        dataType: "json",
        success:function(data){
            clearLoading();
            setOauthToken(data);
            //加载部分经销商权限
            getUserWarrant();
            var bindMsg = bindRelation();
            if(bindMsg != null && bindMsg != "") {
                hui.alert(bindMsg, "确定", function(){
                    loginRefreshToken();
                    loginSuccess();
                });
                return;
            }
            hui.iconToast('登录成功!');
            loginSuccess();
        },
        error:function(res){
            clearLoading();
            if(res.status === 401) {
                var json = res.responseJSON;
                hui.iconToast(json.message,'error');
            }
            return false;
        }
    });
};

// 当expires_in少于或者等于登录时间和运行插件时间差则，cookie中access_token已过期无法使用，需要refresh_token重新刷新cookie
// 当refresh_token过期就会退出登录
function refresh(obj){

    var nowDate = new Date().getTime();

    //优先从localStorage取token,没有则从cookie
    var storage = window.localStorage;
    var access_token = storage.getItem("access_token");
    if(access_token == null || access_token == ""){
        access_token = expires_in = getCookie("access_token");
        var expires_in = getCookie("expires_in");
        var refresh_token = getCookie("refresh_token");
        var login_time = getCookie("login_time");
    }else{
        var expires_in = storage.getItem("expires_in");
        var refresh_token = storage.getItem("refresh_token");
        var login_time = storage.getItem("login_time");
    }

    // 获取cookie信息
    var mistiming = (nowDate - login_time)/1000;

    if(mistiming<expires_in - 60){
        if(obj.config) delete obj.config;
        obj.headers = {
            "Authorization": "Bearer "+access_token
        };
        $.ajax(obj);
    }else{
        var config = conf();
        config["grant_type"] = "refresh_token";
        if(obj.config){
            for(var i in obj.config){
                config[i] = obj.config[i];
            };
            delete obj.config;
        };
        var form = new FormData();
        form.append("client_id", config["client_id"]);
        form.append("client_secret", config["client_secret"]);
        form.append("grant_type", config["grant_type"]);
        form.append("refresh_token", refresh_token);

        var settings = {
            async: false,
            crossDomain: true,
            url: IP+'/upms/oauth/token',
            method: "POST",
            type: "POST",
            headers: {
                "Authorization": "Basic "+config["Basic"]
            },
            processData: false,
            contentType: false,
            mimeType: "multipart/form-data",
            data: form,
            success:function(data){
                var userdata = JSON.parse(data);
                setRefreshToken(userdata);
                obj.headers = {
                    "Authorization": "Bearer "+userdata.access_token
                };
                $.ajax(obj);
            },
            error:function(res){
                //refresh_token过期退出登录
                console.log(res.status);
                if(res.status == 401) {
                    loginOffByBack();
                }
            }
        };
        $.ajax(settings);
    };
    return this;
};


/**
 * token刷新
 * @param refresh_token
 */
function refreshToken(refresh_token) {
    var config = conf();
    var accessToken;

    var form = new FormData();
    form.append("client_id", config["client_id"]);
    form.append("client_secret", config["client_secret"]);
    form.append("grant_type", "refresh_token");
    form.append("refresh_token", refresh_token);
    $.ajax({
        async: false,
        crossDomain: true,
        url: IP+'/upms/oauth/token',
        method: "POST",
        type: "POST",
        processData: false,
        contentType: false,
        mimeType: "multipart/form-data",
        data: form,
        success:function(data){
            accessToken = JSON.parse(data);
        },
        error:function(res){
            //refresh_token过期退出登录
            console.log(res.status);
            if(res.status == 401) {
                loginOffByBack();
            }
        }
    });

    return accessToken;
}

/**
 * 普通用户登录绑定关系 角色发送变化后刷新token操作
 */
function loginRefreshToken() {
    var refresh_token;
    if (compatibleStorage()) {
        refresh_token = window.localStorage.getItem("refresh_token");
    } else {
        refresh_token = getCookie("refresh_token");
    }

    if (isRoleConsumer()) {
        var accessToken = refreshToken(refresh_token);
        setOauthToken(accessToken);
    }
}


/**
 * 获取项目地址
 * @returns {string}
 */
function getRootPath() {
    //获取当前网址，如： http://localhost:8083/uimcardprj/share/meun.jsp
    var path = window.document.location.href;
    //获取主机地址之后的目录，如： uimcardprj/share/meun.jsp
    var pathName = window.document.location.pathname;
    var pos = path.indexOf(pathName);
    //获取主机地址，如： http://localhost:8083
    var localhostPaht = path.substring(0, pos);
    //获取带"/"的项目名，如：/uimcardprj
    var projectName = pathName.substring(0, pathName.substr(1).indexOf('/') + 1);
    return localhostPaht;
}


//保存OAuthToken
function setOauthToken(oAuth2AccessToken) {
    var u = navigator.userAgent;
    var isappwebview = u.indexOf('app_webview') > -1;
    try {
        if (!compatibleStorage()) {
            //存cookie
            setOauthTokenCookie(oAuth2AccessToken);
            setOAuthTokenStorage(oAuth2AccessToken);
        } else {
            //存localStorage
            setOAuthTokenStorage(oAuth2AccessToken);
            setOauthTokenCookie(oAuth2AccessToken);
        }
    } catch (error) {
        //存cookie
        setOauthTokenCookie(oAuth2AccessToken);
    }
}

//将OAuthToken存入cookie
function setOauthTokenCookie(oAuth2AccessToken) {
    //存cookie
    setCookie("login_time", new Date().getTime(), 180);
    setCookie("access_token", oAuth2AccessToken.access_token, 180);
    setCookie("token_type", oAuth2AccessToken.token_type, 180);
    setCookie("refresh_token", oAuth2AccessToken.refresh_token, 180);
    setCookie("expires_in", oAuth2AccessToken.expires_in, 180);
    setCookie("scope", oAuth2AccessToken.scope, 180);
    setCookie("seq", oAuth2AccessToken.id, 180);
    setCookie("login_time", new Date().getTime(), 180);
    setCookie("username", oAuth2AccessToken.username, 180);
    setCookie("userName", oAuth2AccessToken.username, 180);
    for (var i = 0; i < oAuth2AccessToken.authorities.length; i++) {
        var author = oAuth2AccessToken.authorities[i];
        for (var k in author) {
            setCookie("authority", author.authority, 180);
        }
    }
}

//将OAuthToken存入Storage
function setOAuthTokenStorage(oAuth2AccessToken) {
    //存localStorage
    var storage = window.localStorage;
    storage.setItem("login_time", new Date().getTime());
    storage.setItem("access_token", oAuth2AccessToken.access_token);
    storage.setItem("token_type", oAuth2AccessToken.token_type);
    storage.setItem("refresh_token", oAuth2AccessToken.refresh_token);
    storage.setItem("expires_in", oAuth2AccessToken.expires_in);
    storage.setItem("scope", oAuth2AccessToken.scope);
    storage.setItem("seq", oAuth2AccessToken.id);
    storage.setItem("username", oAuth2AccessToken.username);
    storage.setItem("userName", oAuth2AccessToken.username);

    for (var i = 0; i < oAuth2AccessToken.authorities.length; i++) {
        var author = oAuth2AccessToken.authorities[i];
        for (var k in author) {
            storage.setItem("authority", author.authority);
        }
    }
}

//token刷新之后存放
function setRefreshToken(oAuth2AccessToken) {
    if (compatibleStorage()) {
        //存localStorage
        var storage = window.localStorage;
        storage.setItem("login_time", new Date().getTime());
        storage.setItem("access_token", oAuth2AccessToken.access_token);
        storage.setItem("refresh_token", oAuth2AccessToken.refresh_token);
    } else {
        setCookie("login_time", new Date().getTime(), 180);
        setCookie("access_token", oAuth2AccessToken.access_token, 180);
        setCookie("refresh_token", oAuth2AccessToken.refresh_token, 180);
    }
}


//是否兼容Storage
function compatibleStorage() {
    return window.Storage && window.localStorage && window.localStorage instanceof Storage;
}