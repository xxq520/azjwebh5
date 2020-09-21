
(function () {
    var api = {

        w_post: function (url, data, fn) {
            $.ajax({
                //url: "http://172.168.0.101:18081" + url,
                url: url,
                method: "POST",
                dataType: "json",
                data: JSON.stringify(data),
                success: fn,
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    //debugger;
                }
            });
        },
        w_get: function (url, data, fn) {
            $.ajax({
                //url: "http://172.168.0.101:18081" + url,
                url: url,
                type: "GET",
                dataType: "json",
                async: true,
                success: fn,
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    //debugger;
                }

            });
        },
        w_type: function (url, data, fn) {
            $.ajax({
                //url: "http://172.168.0.101:18081" + url,
                url: url,
                type: "GET",
                async: true,
                success: fn,
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    //debugger;
                }

            });
        },
    };

    this.w_base = api;
})();
function loadAjax(url,data,fn){
    $.ajax({
        url: url,
        async: true,
        type: "GET",
        dataType:"json",
        data:data,
        success: fn,
        error: function () {
            $.toast("网络异常", "text");
        }
    });

}