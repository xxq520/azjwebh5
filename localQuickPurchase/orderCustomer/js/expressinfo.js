

var orderno = getQueryString("orderno");
var sku = getQueryString("sku");
var carrier = getQueryString("carrier");
var waybill = getQueryString("waybill");

//waybill
var DeliverList;


var vm = new Vue({
    el:"#app",
    data:{
        orderno:orderno,
        selectedDeliver:{name:'请选择物流公司'},//选择的物流公司
        waybill:'',
        // deliverName:{},
    },
    created:function () {
        this.getDeliverCompany();

    },
    mounted:function(){
    },
    methods:{
        goBack:function () {
            utils.getBackClick();
        },
        //保存订单
        saveDeliver: function () {

            if (this.selectedDeliver.name == '请选择物流公司') {
                mui.toast('请选择物流公司');
                return
            } else if (!this.waybill) {
                mui.toast('请输入物流单号');
                return
            }

            var formData = {
                "seq": seq,
                "orderno":orderno ,
                sendspec:[],
            }

            var skus = JSON.parse(sku)

            // console.log(Array.isArray(skus));

            if (Array.isArray(skus)) {//第一次发货输入单号
                for (var i=0;i < skus.length;i++) {
                    formData.sendspec.push({
                        waybill:this.waybill,
                        carrier: this.selectedDeliver.code,
                        sku:skus[i]
                    });
                }
            } else {//修改物流单号
                formData.sendspec.push({
                    waybill:this.waybill,
                    carrier: this.selectedDeliver.code,
                    sku:sku
                });
            }


            sendApi.saveDeliverBill(formData);
        },
        //获取物流公司
        getDeliverCompany:function () {
            var that = this;
            var url = "/localQuickPurchase/logistics/company";
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
                        DeliverList = ret;

                        var deliverName = ret.data.reduce(function (pre,cur) {
                            pre[cur.code] = cur.name
                            return pre
                        },{});

                        // if (waybill && carrier) {
                            that.waybill = waybill || '';

                            that.selectedDeliver.name = deliverName[carrier] || '请选择物流公司';
                            that.selectedDeliver.code = carrier;
                        // }

                    }else if(ret.code==500){
                        mui.alert(ret.message);
                    }
                }
            });
        },
    }
});



var sendApi = {

    //提交物流信息
    saveDeliverBill: function (formData) {
        $.ajax({
            type : 'POST',
            dataType : 'json',
            contentType: "application/json;charset=utf-8",
            url : "/localQuickPurchase/dOrders/updateLogisticsInfo",
            data : JSON.stringify(formData),
            async : false,
            success : function(ret) {
                if(ret.code==200){
                    //保存物流单号后  跳转已发货
                    window.location.href="./shipments.html?deilverStatus=" + 2;
                }else if(ret.code==500){
                    mui.alert(ret.message);
                }
            }
        });
    }
};


// sendApi.getDeliverCompany();


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



    /******证件类型的选择器自调函数 **
     * 参数mui ——mui对象
     * 参数doc——document对象
     * ******/
;(function(mui, doc) {
    mui.init();
    mui('.mui-input-row input').input();
    mui.ready(function() {
        //普通示例
        userPicker = new mui.PopPicker();
        var cancelBtn = document.getElementsByClassName('mui-poppicker-btn-cancel')[0];
        var addH2 = document.createElement("h2");
        addH2.setAttribute("class","addTitle");
        addH2.innerHTML ="请选择物流公司";
        $(cancelBtn).after(addH2);
        for(var i=0;i<DeliverList.data.length;i++){
            DeliverList.data[i].text= DeliverList.data[i].name;
            DeliverList.data[i].vaule= i;
            // console.log( DeliverList.data[i].value)
        }
        userPicker.setData(DeliverList.data);//全局存储证件类型
        // console.log(wlname.data);
        var selectOther = document.getElementById('selectwl');
        var selectResult = document.getElementById('selectcompany');
        selectOther.addEventListener('tap', function(event) {
            // console.log(event)
            userPicker.show(function(item) {

                // console.log(wlname.data[items])
                items = DeliverList.data[item]
                // kdddh = items.code;
                vm.selectedDeliver = items;
                // selectResult.innerHTML=items.name;
                // console.log(items);
                selectResult.dataset.i=items.value;
                //返回 false 可以阻止选择框的关闭
                //return false;
            });
        }, false);
    });
})(mui, document);








