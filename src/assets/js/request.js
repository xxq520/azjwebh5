import hostUrl from "./request"

// 请求封装
function request(type, url, data) {
    return new Promise(((resolve, reject) => {
        var xhr = new XMLHttpRequest();
        xhr.addEventListener("load", function (e) {
            var response = JSON.parse(e.srcElement.response);
            resolve(response);
        }, false);
        xhr.open(type, url, false);
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhr.send(JSON.stringify(data));
        xhr.addEventListener("error", function (e) {
            // 回调到外部
            hui && hui.loading(false, true);
        }, false);
    }));
}

export default request
