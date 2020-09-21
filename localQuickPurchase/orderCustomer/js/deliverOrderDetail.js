

//没有登录的用户强制跳转至未登录个人中心页面
(function(){
    if (!isLogin()) {
        var urlVal = window.location.href;
        // sltHide();
        setCookie("loginRetrunUrl",urlVal);
        noLoginPage();
        return;
    }
})();


var orderno = getQueryString("orderno");
var deliverStatus = getQueryString("deliverStatus");

//deliverStatus

var vm = new Vue({
    el:"#app",
    data:{
        isMulti:false,//是否批量输入
        deliverStatus:deliverStatus,//发货状态 1:待发货 2:已发货
        orderData:{},
        deliverName:{},
        oneHide:true,
    },
    created:function () {

    },
    mounted:function(){},
    methods:{
        changeInputBill:function () {
            this.isMulti = !this.isMulti;
        },
        goBack:function () {
            utils.getBackClick();
        },
        //去输入订单号
        inputBill:function (sku) {
            var temArr = []
            if (sku) {//单个输入单号
                temArr[0] = sku;
            } else {//批量输入单号
                this.orderData.detailsResultList.forEach(function (item) {
                    if (item.isSelect) {
                        temArr.push(item.sku);
                    }
                })
            }
            window.location.href = "./expressinfo.html?orderno=" + orderno + "&sku=" + JSON.stringify(temArr)
        },
        //修改物流单号
        modifyBill: function (sku,carrier,waybill) {
            window.location.href = "./expressinfo.html?orderno="+orderno+"&sku="+sku+"&carrier="+carrier||''+"&waybill="+waybill || ''
        }
    }
});


var sendApi = {
    getOrderDetail:function (orderno) {
        var url = "/localQuickPurchase/business/order/details";
        var obj = {
            supplierSeq: seq,
            orderno: orderno
        }
        $.ajax({
            type : 'POST',
            dataType : 'json',
            contentType: "application/json;charset=utf-8",
            url : url,
            data : JSON.stringify(obj),
            async : false,
            success : function(ret) {
                if (ret.code === 200) {
                    ret.data.detailsResultList.forEach(function (item) {
                        item.isSelect = false
                    });
                    vm.orderData = ret.data;

                    if (ret.data.detailsResultList.length == 1) {
                        vm.oneHide = false
                    }
                } else if (ret.code===400) {
                    mui.toast(ret.message)
                }
            }
        });
    },
    //获取物流公司
    getDeliverCompany:function () {
        var url ="/localQuickPurchase/logistics/company";
        var formData = {
            name:""
        };
        $.ajax({
            type : 'POST',
            dataType : 'json',
            contentType: "application/json;charset=utf-8",
            url : url,
            data : JSON.stringify(formData),
            async : false,
            success : function(ret) {
                if(ret.code==200){
                    var deliverName = ret.data.reduce(function (pre,cur) {
                        pre[cur.code] = cur.name
                        return pre
                    },{});

                    vm.deliverName = deliverName;
                }else {
                    mui.alert(ret.message);
                }
            }
        });
    },
};

sendApi.getDeliverCompany();

var utils = {
    //返回上一级
    getBackClick:function(){
        try{
            window.action.app_back();
        }catch(e){

        }
        window.history.go(-1);
    }
}


sendApi.getOrderDetail(orderno);


