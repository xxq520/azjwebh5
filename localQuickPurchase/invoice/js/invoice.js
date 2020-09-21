
var invoice = {};
var invoiceCookie = getCookie("invoice");
if (invoiceCookie != null && invoiceCookie != ""){
    dataPackaging(JSON.parse(invoiceCookie));
}else {
    findInvoiceBySeq();
}
function findInvoiceBySeq(){
    $.ajax({
        url:"/localQuickPurchase/invoice/findInvoiceBySeq",
        type:"POST",
        data:{
            seq: seq
        },
        async:true,
        dataType:"json",
        success:function(data){
            if(data.code == 200){
                var invoiceValue = data.data;
                if (invoiceValue != null){
                    /*数据渲染*/
                    dataPackaging(invoiceValue);
                }
            }
        }
    });
}

/**获取invoice相关参数
 * @param	this	当前点击的dom对象那
 * @returns
 */
function getInvoice() {
    var invoiceType = 1; //发票类型   1 普通发票, 2 增值税专用发票  默认为1
    if ($('.active').html()  == "增值税专用发票"){
        invoiceType = 2;
    }
    var invoicetitleType = 1; //发票抬头类型   1 个人, 2 单位
    if ($('.act').parent().text()  == "单位"){
        invoicetitleType = 2;
    }
    /*数据封装*/
    return generalInvoice(invoiceType,invoicetitleType);;
}

/**
 * invoiceType 发票类型 1:普通发票  2:增值税发票
 * invoicetitleType 普通发票的抬头类型 1:个人  2:单位
 * */
function generalInvoice(invoiceType,invoicetitleType) {

    var title = ''; //发票抬头
    var shuihao = '';//纳税人识别号
    var username = '';//收票抬头姓名
    var idNum = '';//身份证号码
    var phoneNum = '';//收票人手机
    var email = '';//收票人邮箱
    var address = '';//地址
    var telNum = '';//电话
    var bank = '';//开户行
    var account = '';//账号

    /*普通发票 个人*/
    if (invoiceType == 1 && invoicetitleType == 1){
        username = $('.hui-form-items input[name="username1"]').val();//收票抬头姓名
        idNum = $('.hui-form-items input[name="idNum1"]').val();//身份证号码
        phoneNum = $('.hui-form-items input[name="phoneNum1"]').val();//收票人手机
        email = $('.hui-form-items input[name="email1"]').val();//收票人邮箱
    }

    /*普通发票 单位*/
    if (invoiceType == 1 && invoicetitleType == 2){
        title = $('.hui-form-items input[name="title2"]').val(); //发票抬头
        shuihao = $('.hui-form-items input[name="shuihao2"]').val();//纳税人识别号
        username = $('.hui-form-items input[name="username2"]').val();//收票抬头姓名
        idNum = $('.hui-form-items input[name="idNum2"]').val();//身份证号码
        phoneNum = $('.hui-form-items input[name="phoneNum2"]').val();//收票人手机
        email = $('.hui-form-items input[name="email2"]').val();//收票人邮箱
    }

    /*增值税发票*/
    if (invoiceType == 2 ){
        title = $('.hui-form-items input[name="title"]').val(); //发票抬头
        shuihao = $('.hui-form-items input[name="shuihao"]').val();//纳税人识别号
        username = $('.hui-form-items input[name="username"]').val();//收票抬头姓名
        idNum = $('.hui-form-items input[name="idNum"]').val();//身份证号码
        phoneNum = $('.hui-form-items input[name="phoneNum"]').val();//收票人手机
        email = $('.hui-form-items input[name="email"]').val();//收票人邮箱
        address = $('.hui-form-items input[name="address"]').val();//地址
        telNum = $('.hui-form-items input[name="telNum"]').val();//电话
        bank = $('.hui-form-items input[name="bank"]').val();//开户行
        account = $('.hui-form-items input[name="account"]').val();//账号
        if (address == ""){
            hui.toast('请输入地址!');
            return false;
        }
        if (!checkPhone(telNum)){
            hui.toast('请输入正确的电话!');
            return ;
        }
        if (bank == ""){
            hui.toast('请输入开户行!');
            return false;
        }
        if (account == ""){
            hui.toast('请输入账号!');
            return false;
        }
    }
    if (!sentencedEmpty(username)){
        hui.toast('请输入收票抬头姓名!');
        return false;
    }
    if(!isIdCard(idNum)){
        hui.toast('请输入正确的身份证号码!');
        return false;
    }
    if (!isPoneAvailable(phoneNum)){
        hui.toast('请输入正确的收票人手机号!');
        return false;
    }
    if (!isMail(email)){
        hui.toast('请输入正确的收票人邮箱!');
        return false;
    }
    if (invoicetitleType == 2 || invoiceType == 2 ) {
        if (!sentencedEmpty(title)){
            hui.toast('请输入收票抬头姓名!');
            return false;
        }
        if(!taxMark(shuihao)){
            hui.toast('请输入正确的纳税人识别号!');
            return false;
        }
    }
    invoice.invoicetype = invoiceType;
    invoice.invoicecontent = "商品明细";
    invoice.phone = phoneNum;
    invoice.mailbox = email;
    invoice.idNumber = idNum;
    invoice.invoicename = username;
    if (invoiceType == 1 && invoicetitleType == 1){
        title = "个人";
    }
    invoice.invoicetitle = title;
    if (invoicetitleType != 1) {
        invoice.ghf_nsrsbh = shuihao;
    }
    if (invoiceType == 2){
        invoice.ghf_dz = address;
        invoice.ghf_gddh = telNum;
    }
    bankAddress = bank + "  ";
    invoice.ghf_yhzh = bankAddress + account;
    invoice.mobile = getCookie("userName");
    return invoice;
}

/**
 * 数据渲染 
 */
function dataPackaging(invoiceValue) {
    var invoicetype = invoiceValue.invoicetype;/*发票类型*/
    var invoicetitle = invoiceValue.invoicetitle;/*抬头类型*/
    var invoicename = invoiceValue.invoicename;/*发票抬头姓名*/
    var idNumber = invoiceValue.idNumber;/*身份证*/
    var mobile  = invoiceValue.phone;/*手机号*/
    var mailbox = invoiceValue.mailbox;/*邮箱*/
    var txpno = invoiceValue.ghf_nsrsbh;/*纳税人识别号*/
    var address = invoiceValue.ghf_dz;/*地址*/
    var ghf_gddh = invoiceValue.ghf_gddh;/*电话*/
    var bankAddress = invoiceValue.ghf_yhzh;/*开户行*/
    var account = null;/*账号*/
    if(bankAddress != null){
        var str = bankAddress.split(" ");
        bankAddress = str[0];
        account = str[2];
    }
    /!*增值税发票*!/
    if (invoicetype == 2){
        $("#common").removeClass("active");
        $("#tax").addClass('active');
        $("#plain").removeClass("current");
        $('#vat').addClass('current');
    }else {
        /!*普通发票*!/
        if(invoicetitle != "个人"){
            $("#personage").removeClass("act");
            $("#units").addClass('act');
            $("#personal").removeClass("curr");
            $("#company").addClass('curr');
        }
    }
    $("input[name='username1']").val(invoicename);
    $("input[name='idNum1']").val(idNumber);
    $("input[name='phoneNum1']").val(mobile);
    $("input[name='email1']").val(mailbox);

    $("input[name='title2']").val(invoicetitle);
    $("input[name='shuihao2']").val(txpno);
    $("input[name='username2']").val(invoicename);
    $("input[name='idNum2']").val(idNumber);
    $("input[name='phoneNum2']").val(mobile);
    $("input[name='email2']").val(mailbox);

    $("input[name='title']").val(invoicetitle);
    $("input[name='shuihao']").val(txpno);
    $("input[name='username']").val(invoicename);
    $("input[name='idNum']").val(idNumber);
    $("input[name='phoneNum']").val(mobile);
    $("input[name='email']").val(mailbox);
    $("input[name='address']").val(address);
    $("input[name='telNum']").val(ghf_gddh);
    $("input[name='bank']").val(bankAddress);
    $("input[name='account']").val(account);
}

//取消
$('body').on('click','.cancel', function(){
    /*清空cookie*/
    setCookie("invoice","",-1)
    /*返回*/
    backBtn();
});
//确定
$('div .submit').click(function(){
    if (!getInvoice()) {
        return
    }
    invoice = JSON.stringify(invoice)
    setCookie("invoice",invoice,7)
    /*返回*/
    backBtn();
});
/*返回*/
$('body').on('click','.backBtn',function () {
    backBtn();
})

function backBtn() {
    window.history.go(-1);
}





