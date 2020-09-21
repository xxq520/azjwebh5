
// //入驻类型
var merTypeEnterprise = "00";
var merTypePersonal = "01";
var merTypesmall = "02";



function GetRequest() {
    var url = location.search; //获取url中"?"符后的字串
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
            theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
        }
    }
    return theRequest;
};

var userType = GetRequest().xtype
var shareSeq = getQueryString("shareSeq");
var sendCodeType = 0;
if (shareSeq != null && shareSeq != "") {
    setCookie("shareSeq", shareSeq, 1)
} else {
    shareSeq = getCookie("shareSeq");
}
//填写信息同步
function changeAddress(obj) {
    var _address = $(obj).val();
    $("#mailAddress").val(_address)
}


function changeName(obj) {
    var _userName = $(obj).val();
    $("#linkName").val(_userName);
    $("#mailUser").val(_userName);
}

function changetime(obj) {
    if (obj.checked) {
        $('#idCardEnd').val('9999-12-31')
        setBrandSquareSupplierInfo();
    } else {
        $('#idCardEnd').val('')
        setBrandSquareSupplierInfo();
    }
}

function changetime1(obj) {
    if (obj.checked) {
        $('#socialCodeEnd').val('9999-12-31')
        setBrandSquareSupplierInfo();
    } else {
        $('#socialCodeEnd').val('')
        setBrandSquareSupplierInfo();
    }
}

// 上一页
function lastBtn() {

    $(".step-1").show();
    $(".step-2").hide()
    $(".step-3").hide()
    $(".step-4").hide();


}

function lastBtn1() {

    $(".step-1").hide();
    $(".step-2").show()
    $(".step-3").hide();
    $(".step-4").hide()
}

function lastBtn2() {
    $(".step-1").hide();
    $(".step-2").hide()
    $(".step-3").show();
    $(".step-4").hide()
}
//  是否同意入驻协议
$('.agree .agreeCheck').on('click', function () {
    if (!$('.agreeCheck').hasClass('active')) {
        $('.agreeCheck').addClass('active');
        $('.agreeCheck .point').addClass('activePoint');
        $(".submitBtn").removeAttr("disabled");
        $(".submitBtn").css("background", "#F23E4D");
    } else {
        $('.agreeCheck').removeClass('active');
        $('.agreeCheck .point').removeClass('activePoint');
        $(".submitBtn").attr("disabled", "disabled")
        $(".submitBtn").css("background", "#c8c8c8");
    }
})

function popupShow() {
    $('.popup').show();
}

function popupClose() {
    $('.popup').hide();
}
var pickerBankAcctType;
var picker3;
var pickerBusinessType;
var businessData = [{
        "value": "0",
        "text": "多合一营业执照"
    },
    {
        "value": "0",
        "text": "多合一营业执照"
    },
    {
        "value": "1",
        "text": "普通营业执照"
    },
    {
        "value": "2",
        "text": "无营业执照"
    }
];

function initMerTypeData() {
    var merTypeData = [{
            "value": merTypeEnterprise,
            "text": "企业商户"
        },
        {
            "value": merTypeEnterprise,
            "text": "企业商户"
        },
        {
            "value": merTypePersonal,
            "text": "个体工商户"
        },
        {
            "value": merTypesmall,
            "text": "个人商户"
        }
    ];
    // 点击下一步
    var bankAcctTypeData
    if (userType == 1) {
        bankAcctTypeData = [{
                "value": "1",
                "text": "公司账户"
            },
            {
                "value": "1",
                "text": "公司账户"
            }

        ]
    } else if (userType == 2) {
        bankAcctTypeData = [{
                "value": "0",
                "text": "个人账户"
            },
            {
                "value": "0",
                "text": "个人账户"
            },
            {
                "value": "1",
                "text": "公司账户"
            }
        ];
    } else {
        bankAcctTypeData = [{
                "value": "0",
                "text": "个人账户"
            },
            {
                "value": "0",
                "text": "个人账户"
            }
        ];

    }



    /*微小型-法人性别*/
    var legalSexTypeData = [{
            "value": "0",
            "text": "未知的性别"
        },
        {
            "value": "1",
            "text": "男性"
        },
        {
            "value": "2",
            "text": "女性"
        },
        {
            "value": "5",
            "text": "女性改（变）为男性"
        },
        {
            "value": "6",
            "text": "男性改（变）为女性"
        },
        {
            "value": "9",
            "text": "未说明的性别"
        }
    ];
    /*微小型-是否有经营场地*/
    var havingFixedBusiAddrTypeData = [{
            "value": "1",
            "text": "是"
        },
        {
            "value": "1",
            "text": "是"
        },
        {
            "value": "0",
            "text": "否"
        }
    ];


    /*微小型-法人职业*/
    var legalOccupationTypeData = [{
            "value": "0",
            "text": "各类专业、技术人员"
        },
        {
            "value": "1",
            "text": "国家机关、党群组织、企事业单位的负责人"
        },
        {
            "value": "2",
            "text": "办事人员和有关人员"
        },
        {
            "value": "3",
            "text": "商业工作人员"
        },
        {
            "value": "4",
            "text": "服务性工作人员"
        },
        {
            "value": "5",
            "text": "农林牧渔劳"
        }
    ];
    try {
        picker3 = new huiPicker('#merType', function () {
            var val = picker3.getVal(0);
            var txt = picker3.getText(0);
            hui('#merType').attr("data-id", val);
            hui('#merType').val(txt);
            merTypeNeedData(val);
            setBrandSquareSupplierInfo();
        });
        picker3.bindData(0, merTypeData);

        pickerBankAcctType = new huiPicker('#bankAcctType', function () {
            var val = pickerBankAcctType.getVal(0);
            var txt = pickerBankAcctType.getText(0);
            hui('#bankAcctType').attr("data-id", val);
            hui('#bankAcctType').val(txt);
            bankAcctTypeNeedData(val);
            setBrandSquareSupplierInfo();
        });
        pickerBankAcctType.bindData(0, bankAcctTypeData);
        if(userType==3){
            hui('#businessType').val('无营业执照');
            hui('#businessType').attr("data-id", 0);
            setBrandSquareSupplierInfo();
            $('#enterpriseAddress').prop('placeholder', '与商铺地址一致')
        }else{
            pickerBusinessType = new huiPicker('#businessType', function () {
                var val = pickerBusinessType.getVal(0);
                var txt = pickerBusinessType.getText(0);
                hui('#businessType').attr("data-id", val);
                hui('#businessType').val(txt);
                setBrandSquareSupplierInfo();
            });
        }
      
        pickerBusinessType.bindData(0, businessData);

        var pickerHavingFixedBusiAddrType = new huiPicker('#havingFixedBusiAddr', function () {
            var val = pickerHavingFixedBusiAddrType.getVal(0);
            var txt = pickerHavingFixedBusiAddrType.getText(0);
            hui('#havingFixedBusiAddr').attr("data-id", val);
            hui('#havingFixedBusiAddr').val(txt);
            setBrandSquareSupplierInfo();
        });
        pickerHavingFixedBusiAddrType.bindData(0, havingFixedBusiAddrTypeData);

        var pickerLegalSexType = new huiPicker('#legalSexType', function () {
            var val = pickerLegalSexType.getVal(0);
            var txt = pickerLegalSexType.getText(0);
            hui('#legalSexType').attr("data-id", val);
            hui('#legalSexType').val(txt);
            setBrandSquareSupplierInfo();
        });
        pickerLegalSexType.bindData(0, legalSexTypeData);

        var pickerLegalOccupationType = new huiPicker('#legalOccupation', function () {
            var val = pickerLegalOccupationType.getVal(0);
            var txt = pickerLegalOccupationType.getText(0);
            hui('#legalOccupation').attr("data-id", val);
            hui('#legalOccupation').val(txt);
            setBrandSquareSupplierInfo();
        });
        pickerLegalOccupationType.bindData(0, legalOccupationTypeData);

    } catch (e) {}

}

function initManagementTypeData() {
    /*经营类型*/
    var operateTypeData = [{
            "value": "0",
            "text": "自有品牌"
        },
        {
            "value": "0",
            "text": "自有品牌"
        },
        {
            "value": "1",
            "text": "代理品牌"
        }
    ];
    /*微小型-法人性别*/
    var legalSexTypeData = [{
            "value": "0",
            "text": "未知的性别"
        },
        {
            "value": "1",
            "text": "男性"
        },
        {
            "value": "2",
            "text": "女性"
        },
        {
            "value": "5",
            "text": "女性改（变）为男性"
        },
        {
            "value": "6",
            "text": "男性改（变）为女性"
        },
        {
            "value": "9",
            "text": "未说明的性别"
        }
    ];
    /*微小型-是否有经营场地*/
    var havingFixedBusiAddrTypeData = [{
            "value": "1",
            "text": "是"
        },
        {
            "value": "0",
            "text": "否"
        },
        {
            "value": "1",
            "text": "是"
        }
    ];

    /*微小型-法人职业*/
    var legalOccupationTypeData = [{
            "value": "0",
            "text": "各类专业、技术人员"
        },
        {
            "value": "1",
            "text": "国家机关、党群组织、企事业单位的负责人"
        },
        {
            "value": "2",
            "text": "办事人员和有关人员"
        },
        {
            "value": "3",
            "text": "商业工作人员"
        },
        {
            "value": "4",
            "text": "服务性工作人员"
        },
        {
            "value": "5",
            "text": "农林牧渔劳"
        }
    ];

    try {
        var pickerOperateType = new huiPicker('#operateType', function () {
            var val = pickerOperateType.getVal(0);
            var txt = pickerOperateType.getText(0);
            hui('#operateType').attr("data-id", val);
            hui('#operateType').val(txt);
            setBrandSquareSupplierInfo();
          
              if(val == 0 ){
                  $('.imgfileListE1').hide()
              }else{
                   $('.imgfileListE1').show()

              }


        });
        pickerOperateType.bindData(0, operateTypeData);

        var pickerHavingFixedBusiAddrType = new huiPicker('#havingFixedBusiAddr', function () {
            var val = pickerHavingFixedBusiAddrType.getVal(0);
            var txt = pickerHavingFixedBusiAddrType.getText(0);
            hui('#havingFixedBusiAddr').attr("data-id", val);
            hui('#havingFixedBusiAddr').val(txt);
            setBrandSquareSupplierInfo();
        });
        pickerHavingFixedBusiAddrType.bindData(0, havingFixedBusiAddrTypeData);

        var pickerLegalSexType = new huiPicker('#legalSexType', function () {
            var val = pickerLegalSexType.getVal(0);
            var txt = pickerLegalSexType.getText(0);
            hui('#legalSexType').attr("data-id", val);
            hui('#legalSexType').val(txt);
            setBrandSquareSupplierInfo();
        });
        pickerLegalSexType.bindData(0, legalSexTypeData);

        var pickerLegalOccupationType = new huiPicker('#legalOccupation', function () {
            var val = pickerLegalOccupationType.getVal(0);
            var txt = pickerLegalOccupationType.getText(0);
            hui('#legalOccupation').attr("data-id", val);
            hui('#legalOccupation').val(txt);
            setBrandSquareSupplierInfo();
        });
        pickerLegalOccupationType.bindData(0, legalOccupationTypeData);

    } catch (e) {}
}
$(function () {
    refreshImgCode();
    // 表单切换   三证合一
    $('.type span i').click(function () {
        $(this).addClass('act');
        $(this).parent().siblings().children('i').removeClass('act');
        var idx = $(this).parent('span').index();
        $('.certificates ul').eq(idx).addClass('isShow').siblings().removeClass('isShow');
        $('.certificates ul').eq(idx).removeClass('fromChoose').siblings().addClass('fromChoose');
    })

    // 选择区域 模态框
    $('li #region2').click(function () {
        $('.windowArea').show();
        $('.windowArea .region_box2').show();
        //$('.supplier_warp').css('height','100vh');
    });
    // 选择区域 模态框
    $('li #region1').click(function () {
        $('.windowArea').show();
        $('.windowArea .region_box1').show();
        //$('.supplier_warp').css('height','100vh');
    });
    $('.windowArea .region_box').click(function (event) {
        event.stopPropagation(); //阻止冒泡
    })
    $('.windowArea').click(function () {
        //$('.supplier_warp').css('height','auto')
        $(this).hide();
        $('.windowArea .region_box').hide();
    })


    // 点击切换的选择省份城市区
    $('.windowArea ul.region li').click(function (e) {
        e.stopPropagation();
        //保存选择的当前index
        var idx = $(this).index();
        // console.log("省市区下标:" + idx);
        $(this).siblings().removeClass('act');
        for (var i = 0; i <= idx; i++) {
            $(this).parent().children('li').eq(i).addClass('act')
        }
        var _dataId = 0;
        if ($(this).parent().children('li').eq(idx - 1)) {
            _dataId = $(this).parent().children('li').eq(idx - 1).attr("data-id");
        }
        $(this).parent().parent().children('.Selection').find('div.title').find(' p').eq(idx).addClass('isShow').siblings().removeClass('isShow');
        $(this).parent().parent().children('.Selection').find('div.box').find('ul').eq(idx).addClass('isShow').siblings().removeClass('isShow');
        //console.log( $(this).parent());
        $(this).parent().css('dispaly', 'none');
        if ($(this).parent().hasClass("setup2")) {
            getShopRegion(idx + 1, _dataId)
        } else {
            region(idx + 1, _dataId);
        }
    })

    /*判断当前用户申请的状态*/
    // /judgeApplyStatus();
})

/*
  获取店铺地址的省市区

 */
function region(type, pid) {
    //加载省级数据
    if (type > 4) {
        return;
    }
    $.ajax({
        // url: "/localQuickPurchase/brandSquare/region",
        url: "/localQuickPurchase/brandSquare/shopregion",
        type: "GET",
        data: {
            'type': type,
            'pid': pid
        },
        
        async: true,
        dataType: "json",
        success: function (response) {
            var clazz = resetDate(type);
            if (response.code != 200 || type == "") {
                hui.alert("省市区初始化错误,请稍后重试");
                return;
            }
            var list = response.data;
            for (var i = 0; i < list.length; i++) {
                var listObj = list[i];
                $(".region_box1 ." + clazz).append('<li data-id="' + listObj.id + '" onclick="changeData(this,1)"> ' + listObj.value + ' </li>')
            }
        }
    });
}

/**
 * 更新选中的数据
 */
function changeData(obj, index) {
    var _text = $.trim($(obj).text());
    var _dataId = $.trim($(obj).attr("data-id"));
    $(obj).parent().removeClass('isShow');
    $(obj).parent().parent().prev().children('p').eq(1).addClass('isShow').siblings().removeClass('isShow');
    $(obj).parent().next().addClass('isShow').siblings().removeClass('isShow');
    $('.region_box ul.region').addClass('isShow').removeClass('hidden');
    var idx = $(obj).parent('ul').index();
    var tmpeClass = ".region_box" + index;
    var regionLenggth = $(tmpeClass + ' ul.region li');
    //第二次选择省市区要用 保存选中的省市区街道
    $(tmpeClass + ' ul.region').children().eq(idx).attr("data-id", _dataId);
    $(tmpeClass + ' ul.region').children().eq(idx).attr("data-value", _text);
    $(tmpeClass + ' ul.region').children().eq(idx).find('span').html(_text);
    $(tmpeClass + ' ul.region').children().eq(idx).addClass('act');
    var type = $(obj).parent().attr("type");
    var pid = $(obj).attr("data-id");
    //街道一下的地址不获取
    var typeInt = parseInt(type);
    for (var i = typeInt; i < regionLenggth.length; i++) {
        regionLenggth.eq(i).removeAttr("data-id");
        regionLenggth.eq(i).removeAttr("data-value");
        if (i == 1) {
            regionLenggth.eq(i).find("span").html("请选择市")
        } else if (i == 2) {
            regionLenggth.eq(i).find("span").html("请选择区镇")
        } else if (i == 3) {
            regionLenggth.eq(i).find("span").html("请选择街道")
        } else if (i == 4) {
            regionLenggth.eq(i).find("span").html("请选择街道")
        }
    }
    if (index == 1 && type != 3) {
        region(typeInt + 1, pid);
    } else if (index == 2 && type != 3) {
        getShopRegion(typeInt + 1, pid);
    }
    var _regionValue = "";
    for (var i = 0; i < regionLenggth.length; i++) {
        var _value = regionLenggth.eq(i).attr("data-value");
        if (!_value) {
            _value = ""
        }
        _regionValue += _value + " ";
    }
    $("#region" + index).val(_regionValue);
    if (regionLenggth.length == typeInt) {
        $('.supplier_warp').css('height', 'auto')
        $(".windowArea").hide();
        $(".windowArea .region_box").hide();
    }
}

function resetDate(type) {
    var clazz = '';
    if (type == 1) {
        clazz = "provinceData";
        $(".provinceData").html("");
        $(".cityData").html("");
        $(".cityData").append('<li class="current"> 暂不选择 </li>')
        $(".areaData").html("");
        $(".areaData").append('<li class="current"> 暂不选择 </li>')
        // $(".streetData").html("");
        // $(".streetData").append('<li class="current"> 暂不选择 </li>')
    } else if (type == 2) {
        clazz = "cityData";
        $(".cityData").html("");
        $(".areaData").html("");
        $(".areaData").append('<li class="current"> 暂不选择 </li>')
        // $(".streetData").html("");
        // $(".streetData").append('<li class="current"> 暂不选择 </li>')
    } else if (type == 3) {
        clazz = "areaData";
        $(".areaData").html("");
        // $(".streetData").html("");
        // $(".streetData").append('<li class="current"> 暂不选择 </li>')
    } else if (type == 4) {
        clazz = "streetData";
    }
    return clazz;
}

function uploadFile(obj, index) {
    var files = obj.files || [];
    if (files.length === 0) {
        return;
    }
    loadingdate("图片上传中,请稍后...");
    // console.log('选中 ' + files.length + ' 个文件');
    for (var i = 0; i < files.length; i++) {
        var file = files[i];
        var formdata = new FormData();
        formdata.append("fileList", file);
        var xhr = new XMLHttpRequest();
        // 绑定上传事件

        xhr.upload.addEventListener("progress", function (e) {
            // 回调到外部
        }, false);
        // 完成
        xhr.addEventListener("load", function (e) {
            // 从文件中删除上传成功的文件  false是不执行onDelete回调方法
            // console.log(e);
            if (e.srcElement.response != null) {
                var result = eval('(' + e.srcElement.response + ')');
                clearLoading();
                // console.log('上传接结果: ' + result.url);
                if (result.url == null || result.url == "") {
                    hui.alert("很抱歉上传失败了...");
                } else {
                    //上传成功
                    if (index != undefined && $(obj).parent(".newUpload").siblings().length >= 15) {
                        hui.toast("最多只能上传15张图片");
                        return;
                    }
                    if (index != undefined && $(obj).parents(".uploadbox").length == 0) {
                        var _img = $(obj).parents(".newUpload")
                        var _html = '<div class="newUpload uploadbox">';
                        _html += '<img class="closeimg" onclick="deleteimg(this)" src="./img/azj_mine2.png"/>'
                        _html += '<div class="picbox "><img class="imgFileList picture-viewer" src="' + result.url + '" route="' + result.route + '" filename="' + result.fileName + '"/></div>';
                        _html += '<input type="file" accept="image/*" onchange="uploadFile(this)" class="upload-input">';
                        _html += '<button class="btn"><img class="img" src="./img/azj_mine1.png"/><p>点击上传</p></button>'
                        _html += '</div>';
                        _img.before(_html);
                        //添加多一个DIV
                        // handlingImageProblems(index);                    
                    } else {
                        var _img = $(obj).parents(".uploadbox").find(".picbox img");
                        _img.attr("src", result.url);
                        _img.attr("fieldName", result.fieldName);
                        _img.attr("fileName", result.fileName);
                        _img.attr("fileSize", result.fileSize);
                        _img.attr("route", result.route);

                        _img.addClass('picture-viewer')

                    }

                    //$(".upload-div").before('<div class="imgs"><img class="pic  pic-url" src="'+result.url+'"/><i class="del-btn" onclick="delImg(this)">X</i></div>');
                   obj.value = '';
                    setBrandSquareSupplierInfo();
                }

            }
        }, false);
        // 错误
        xhr.addEventListener("error", function (e) {
            // 回调到外部
            hui.alert("很抱歉上传失败了...")
        }, false);


        xhr.open("POST", "/localQuickPurchase/goodsImgMongoAction/uploadImg", true);
        //选择包含中文名的图片会报错
        /*postcomment.js:125 Uncaught DOMException: Failed to execute 'setRequestHeader' on 'XMLHttpRequest':
         'QQ截图20180523151131.jpg' is not a valid HTTP header field value.*/
        xhr.setRequestHeader("X_FILENAME", encodeURI(file.name));
        xhr.send(formdata);
    }
}
//删除图片
function deleteimg(obj) {
      var braninfo = JSON.parse(localStorage.getItem("brandSquareSupplierInfo"));
     
     var index1 = $(obj).parents(".uploadbox").index();
     var classname = $(obj).parents(".uploadbox").parent().prop("className")
     var inp = $(obj).parents(".uploadbox").find("input");
     console.log(inp,88)
    //    console.log(index1, classname)
    $(obj).parents(".uploadbox").remove()

    if (classname == 'uploadListTwo'){
      braninfo.imgfileListX1.splice(index1, 1)
    } else if (classname == 'uploadListSix') {
      braninfo.imgfileListE1.splice(index1, 1)
    } else if (classname == 'uploadListFive'){
         braninfo.imgfileListH1.splice(index1, 1)
    }
   setBrandSquareSupplierInfo(braninfo);
}

 
//检测企业信息


function validateInfo1(brandSquareSupplierInfo) {

    if (userType == 1) {
        brandSquareSupplierInfo.merType = '00';
    } else if (userType == 2) {
        brandSquareSupplierInfo.merType = '01';
    } else if (userType == 3) {
        brandSquareSupplierInfo.merType = '02';
    }
    if (userType != 3) {
        if (brandSquareSupplierInfo.enterpriseName == null || brandSquareSupplierInfo.enterpriseName == "") {
            hui.toast('请输入企业名称');
            return false;
        }
        brandSquareSupplierInfo.socialCodesStart = $("input[name='socialCodesStart']").val();
        brandSquareSupplierInfo.socialCodeEnd = $("input[name='socialCodeEnd']").val();

        //微小商户入驻不需要统一社会信用代码
        if (brandSquareSupplierInfo.socialCode == null || brandSquareSupplierInfo.socialCode == "") {
            hui.toast('请输入统一社会信用代码');
            return false;
        }
        //微小商户入驻不需要统一社会信用代码
        if (!checkLetOrNum(brandSquareSupplierInfo.socialCode)) {
            hui.toast('统一社会信用代码不能含有特殊字符');
            return false;
        }
        if (brandSquareSupplierInfo.socialCodesStart == null || brandSquareSupplierInfo.socialCodesStart == "") {
            hui.toast('请输入信用代码有效期开始时间');
            return false;
        }
        if (brandSquareSupplierInfo.socialCodeEnd == null || brandSquareSupplierInfo.socialCodeEnd == "") {
            hui.toast('请输入信用代码有效期结束时间');
            return false;
        }
        if (brandSquareSupplierInfo.socialCodesStart >= brandSquareSupplierInfo.socialCodeEnd) {
            hui.toast('信用代码结束时间不能早于开始时间');
            return false;
        }
        if (brandSquareSupplierInfo.imgfileList2 == null || brandSquareSupplierInfo.imgfileList2 == "") {
            hui.toast('请上传营业执照');
            return false;
        }
    }


    localStorage.setItem("brandSquareSupplierInfo", JSON.stringify(brandSquareSupplierInfo));
    if (null == brandSquareSupplierInfo.businessType) {
        hui.toast('请选择营业执照类型');
        return false;
    }
    if (brandSquareSupplierInfo.road == null || brandSquareSupplierInfo.road == "") {
        hui.toast('请输入地址路名');
        return false;
    }
    if (brandSquareSupplierInfo.houseNo == null || brandSquareSupplierInfo.houseNo == "") {
        hui.toast('请输入地址门牌');
        return false;
    }
    if (brandSquareSupplierInfo.province == null || brandSquareSupplierInfo.province == "") {
        hui.toast('请选择省份');
        return false;
    }
    if (brandSquareSupplierInfo.city == null || brandSquareSupplierInfo.city == "") {
        hui.toast('请选择省份城市');
        return false;
    }
    if (brandSquareSupplierInfo.area == null || brandSquareSupplierInfo.area == "") {
        hui.toast('请选择县区');
        return false;
    }
    // if (brandSquareSupplierInfo.street == null || brandSquareSupplierInfo.street == "") {
    //     hui.toast('请选择街道');
    //     return false;
    // }
    if (brandSquareSupplierInfo.enterpriseAddress == null || brandSquareSupplierInfo.enterpriseAddress == "") {
        hui.toast('请输入与营业执照地址一致');
        return false;
    }

    return brandSquareSupplierInfo;
}
//检测 法人信息
function validateInfo2(brandSquareSupplierInfo) {

    if (userType == 3) {

        if (brandSquareSupplierInfo.legalOccupation == null || brandSquareSupplierInfo.legalOccupation == "") {
            hui.toast('请选择法人职业');
            return false;
        }
        if (brandSquareSupplierInfo.legalSexType == null || brandSquareSupplierInfo.legalSexType == "") {
            hui.toast('请选择法人性别');
            return false;
        }
    }
    brandSquareSupplierInfo.idCardStart = $("input[name='idCardStart']").val();
    brandSquareSupplierInfo.idCardEnd = $("input[name='idCardEnd']").val();


    if (brandSquareSupplierInfo.legalName == null || brandSquareSupplierInfo.legalName == "") {
        hui.toast('请输入法人名称');
        return false;
    }
    if (brandSquareSupplierInfo.idCard == null || brandSquareSupplierInfo.idCard == "" || !isIdCard(brandSquareSupplierInfo.idCard)) {
        hui.toast('法人身份证号格式有误');
        return false;
    }
    if (brandSquareSupplierInfo.idCardStart == null || brandSquareSupplierInfo.idCardStart == " ") {
        hui.toast('请输入身份证有效期开始时间');
        return false;
    }
    if (brandSquareSupplierInfo.idCardEnd == null || brandSquareSupplierInfo.idCardEnd == " ") {
        hui.toast('请输入身份证有效期结束时间');
        return false;
    }
    if (brandSquareSupplierInfo.idCardStart >= brandSquareSupplierInfo.idCardEnd) {
        hui.toast('身份证结束时间不能早于开始时间');
        return false;
    }
    localStorage.setItem("brandSquareSupplierInfo", JSON.stringify(brandSquareSupplierInfo));
    if (!isMail(brandSquareSupplierInfo.legalEmail)) {
        hui.toast('法人邮箱地址格式有误');
        return false;
    }
    if (!checkTel(brandSquareSupplierInfo.mobile)) {
        hui.toast('法人手机号码格式有误');
        return false;
    }

    if (brandSquareSupplierInfo.imgfileList57 == "" || brandSquareSupplierInfo.imgfileList57 == null) {
        hui.toast('请上传法人证件(正面照)');
        return false;
    }
    if (brandSquareSupplierInfo.imgfileList58 == "" || brandSquareSupplierInfo.imgfileList58 == null) {
        hui.toast('请上传法人证件(国徽面)');
        return false;
    }

    return brandSquareSupplierInfo;
}
//检测 银行信息
function validateInfo3(brandSquareSupplierInfo) {
    if (brandSquareSupplierInfo.bankAcctType == null || brandSquareSupplierInfo.bankAcctType == "") {
        hui.toast('请选择账户类型');
        return false;
    }

    if (brandSquareSupplierInfo.reservePhone == null || brandSquareSupplierInfo.reservePhone == "") {
        hui.toast('请输入预留电话号码');
        return false;
    }
    if (brandSquareSupplierInfo.bankCard == null || brandSquareSupplierInfo.bankCard == "" || !checkNumber(brandSquareSupplierInfo.bankCard)) {
        hui.toast('银行卡账号只能包含纯数字');
        return false;
    }
    if (brandSquareSupplierInfo.bankUser == null || brandSquareSupplierInfo.bankUser == "" || !checkPeopleName(brandSquareSupplierInfo.bankUser)) {
        hui.toast('银行卡户名格式有误！');
        return false;
    }
    // 银行所在省
    if (brandSquareSupplierInfo.shopProvince == null || brandSquareSupplierInfo.shopProvince == "") {
        hui.toast('请选择银行所在省');
        return false;
    }
    //银行所在市
    if (brandSquareSupplierInfo.shopCity == null || brandSquareSupplierInfo.shopCity == "") {
        hui.toast('请选择银行所在市');
        return false;
    }
    //银行所在区/县
    if (brandSquareSupplierInfo.shopArea == null || brandSquareSupplierInfo.shopArea == "") {
        hui.toast('请选择银行所在区/县');
        return false;
    }
    if (brandSquareSupplierInfo.bankName == null || brandSquareSupplierInfo.bankName == "") {
        hui.toast('请输入开户支行名称');
        return false;
    }
    if (brandSquareSupplierInfo.bankNo == null || brandSquareSupplierInfo.bankNo == "") {
        hui.toast('请输入开户支行行号');
        return false;
    }
    if (brandSquareSupplierInfo.imgfileList78 == null || brandSquareSupplierInfo.imgfileList78 == "") {
        if (userType == 3) {
            hui.toast('请上传开户许可证');
        } else {
            hui.toast('请上传银行卡照');
        }
        return false;
    }
    return brandSquareSupplierInfo;
}
//检测经营信息
function validateInfo4(brandSquareSupplierInfo) {


    if (null == brandSquareSupplierInfo.storeBrand) {
        hui.toast('请输入店铺品牌');
        return false;
    }
    if (null == brandSquareSupplierInfo.storeType) {
        hui.toast('请选择店铺类型');
        return false;
    }
    if (null == brandSquareSupplierInfo.operateType) {
        hui.toast('请选择经营类型');
        return false;
    }
    if (brandSquareSupplierInfo.mccCode == null) {
        hui.toast('请选择行业编码');
        return false;
    }

    if (userType == 3) {

        if (brandSquareSupplierInfo.havingFixedBusiAddr == null || brandSquareSupplierInfo.havingFixedBusiAddr == "") {
            hui.toast('请选择是否有经营场所');
            return false;
        }
    } else {

    

    }
    if (null == brandSquareSupplierInfo.storeName) {
        hui.toast('请输入店铺名称');
        return false;

    }
      if (brandSquareSupplierInfo.imgfileListX1 == null || brandSquareSupplierInfo.imgfileListX1 == "" || brandSquareSupplierInfo.imgfileListX1 == []) {
          hui.toast('请上传商标证书');
          return false;
      }
   
      if ( brandSquareSupplierInfo.operateType == 1){
        if (brandSquareSupplierInfo.imgfileListE1 == null || brandSquareSupplierInfo.imgfileListE1 == "" || brandSquareSupplierInfo.imgfileListX1 == []) {
            hui.toast('请上传商标商标授权证书');
            return false;
        }
      }
   

    //收银台照 路径
    if (brandSquareSupplierInfo.imgfileListF1 == null || brandSquareSupplierInfo.imgfileListF1 == "") {
        hui.toast('请上传前台照');
        return false;
    }
    //经营场景照片 路径
    if (brandSquareSupplierInfo.imgfileList24 == null || brandSquareSupplierInfo.imgfileList24 == "") {
        hui.toast('请上传经营场景照片');
        return false;
    }
    //门店照片 路径
    if (brandSquareSupplierInfo.imgfileList79 == null || brandSquareSupplierInfo.imgfileList79 == "") {
        hui.toast('请上传门店照片');
        return false;
    }
    //室内照片 路径
    if (brandSquareSupplierInfo.imgfileListI1 == null || brandSquareSupplierInfo.imgfileListI1 == "") {
        hui.toast('请上传办公场所照片');
        return false;
    }
    //法人手持证件 路径
    if (brandSquareSupplierInfo.imgfileListZ1 == null || brandSquareSupplierInfo.imgfileListZ1 == "") {
        hui.toast('请上传法人手持证件');
        return false;
    }
    if (userType == 3) {
        if ((brandSquareSupplierInfo.imgfileListLeasingAgreement == null || brandSquareSupplierInfo.imgfileListLeasingAgreement == "") &&
            (brandSquareSupplierInfo.imgfileListSecurities == null || brandSquareSupplierInfo.imgfileListSecurities == "") &&
            (brandSquareSupplierInfo.imgfileListQualificationCertificate == null || brandSquareSupplierInfo.imgfileListQualificationCertificate == "") &&
            (brandSquareSupplierInfo.imgfileListThirdPartyCertification == null || brandSquareSupplierInfo.imgfileListThirdPartyCertification == "") &&
            (brandSquareSupplierInfo.imgfileListCertificationMaterialsOfOtherMicroAndSmallMerchants == null || brandSquareSupplierInfo.imgfileListCertificationMaterialsOfOtherMicroAndSmallMerchants == "") 
            ) {
            hui.toast('租赁协议/产权证明/执业资质证照/第三方证明/其它微小型商户证明材料五张至少上传一张');
            return false;
        } 
         if (brandSquareSupplierInfo.imgfileListPicturesOfOperatingCommodities == null || brandSquareSupplierInfo.imgfileListPicturesOfOperatingCommodities == "") {
            hui.toast('微小商户必须上传经营商品图片');
            return false;
        }

    }


    if (brandSquareSupplierInfo.proofCode == null) {
        hui.toast('请输入短信验证码');
        return false;
    }

    return brandSquareSupplierInfo;
}

function validateInfo(brandSquareSupplierInfo) {
    if (!validateInfoIntention(brandSquareSupplierInfo)) {
        return;
    }
    return true;
}


//校验店铺名称和店铺品牌是否可用
function checkStoreNameOrBrand() {
    var storeName = $("input[name='storeName']").val();
    var storeBrand = $("input[name='storeBrand']").val();
    var result;
    $.ajax({
        type: "GET",
        url: "/localQuickPurchase/brandSquare/checkStoreName",
        dataType: "json",
        data: {
            seq: seq,
            storeName: storeName,
            storeBrand: storeBrand
        },
        async: true,
        success: function (data) {
            if (data.code == 400) {
                hui.toast(data.message);
                result = false;
            } else {
                result = true;
            }
        }
    });
}
//本地保存品牌商信息
function setBrandSquareSupplierInfo(bsInfo) {

    if (bsInfo == null) {
        bsInfo = getBrandSquareSupplierInfo();
    }

    if (bsInfo == null) {
        bsInfo = {};
    }

    bsInfo = getViewdata(bsInfo);
    localStorage.setItem("brandSquareSupplierInfo", JSON.stringify(bsInfo));

    bsInfo.temp = "1";
    bsInfo.isSubmit = "1";
    submitCompanyInfo(bsInfo);
}

function getBrandSquareSupplierInfo() {
    var brandSquareSupplierInfo = localStorage.getItem("brandSquareSupplierInfo");
    if (brandSquareSupplierInfo == null || brandSquareSupplierInfo == "") {
        return null;
    }
    return JSON.parse(brandSquareSupplierInfo);
}

function goBack(obj) {
    try {
        //返回移除缓存数据
        localStorage.removeItem("brandSquareSupplierInfo");
        //如果有上一页   则返回上一页
        if (document.referrer != null && document.referrer != "") {
            history.go(-1);
        } else {
            //判断是否是app
            var u = navigator.userAgent;
            var isappwebview = u.indexOf('app_webview') > -1;
            // 如果不是app打开的  则返回首页
            if (isappwebview) {
                try {
                    //如果没有上一页尝试返回原生
                    // 调app原生返回  webview
                    window.action.app_back();
                } catch (e) {}
                try {
                    var json = {
                        'function': 'goBack'
                    };
                    window.webkit.messageHandlers.goBack.postMessage(json);
                } catch (e) {}
            } else {
                window.location.href = "/localQuickPurchase/distributionVA/index";
            }
        }
    } catch (e) {}
}
/**
 * 数据回显
 */
function reappearData(bsInfoLocal) {
    if (bsInfoLocal == null) {
        bsInfoLocal = getBrandSquareSupplierInfo();
    }
    if (bsInfoLocal == null || bsInfoLocal == "") {
        return;
    }

    // 经营执照类型
    if (bsInfoLocal.businessType != null && bsInfoLocal.businessType != "") {
        $("input[name='businessType']").attr("data-id", bsInfoLocal.businessType);
        // 经营类型名称
        var businessType = "";
        if (bsInfoLocal.businessType == "0") {
            businessType = "多合一营业执照";
        } else if (bsInfoLocal.businessType == "1") {
            businessType = "普通营业执照";
        } else if (bsInfoLocal.businessType == "2") {
            businessType = "无营业执照";
        }
        $("input[name='businessType']").val(businessType);
        $(".operateTypeSelect option:contains('" + businessType + "')").prop("selected", true);
    }

    //根据经营类型显示需要上传的商标证明
    // if (bsInfoLocal.operateType != null && bsInfoLocal.operateType != "" && bsInfoLocal.operateType == "0") {
    //     $('.imgfileListX1 .contorl-titleX1').hide();
    //     $('.imgfileListX1 .contorl-title4').show();
    // } else if (bsInfoLocal.operateType != null && bsInfoLocal.operateType != "" && bsInfoLocal.operateType == "1") {
    //     $('.imgfileListX1 .contorl-titleX1').show();
    //     $('.imgfileListX1 .contorl-title4').hide();
    // }
    // 注册类型  00企业商户  01个人商户  02小微商户
    // if (bsInfoLocal.merTypeName != null && bsInfoLocal.merTypeName != "") {
    //     $("input[name='merType']").val(bsInfoLocal.merTypeName);
    // }
    // if (bsInfoLocal.merType != null && bsInfoLocal.merType != "") {
    //     merTypeNeedData(bsInfoLocal.merType);
    // }
    // 店铺id
    if (bsInfoLocal.backGroundObjectId != null && bsInfoLocal.backGroundObjectId != "") {
        $("input[id='backGroundObjectId']").val(bsInfoLocal.backGroundObjectId);
    }
    // 店铺名
    if (bsInfoLocal.storeName != null && bsInfoLocal.storeName != "") {
        $("input[name='storeName']").val(bsInfoLocal.storeName);
    }
    // 店铺品牌
    if (bsInfoLocal.storeBrand != null && bsInfoLocal.storeBrand != "") {
        $("input[name='storeBrand']").val(bsInfoLocal.storeBrand);
    }
    // 企业名称
    if (bsInfoLocal.enterpriseName != null && bsInfoLocal.enterpriseName != "") {
        $("input[id='enterpriseName']").val(bsInfoLocal.enterpriseName);
    }

    // 经营类型
    if (bsInfoLocal.operateType != null && bsInfoLocal.operateType != "") {
        $("input[name='operateType']").attr("data-id", bsInfoLocal.operateType);
        // 经营类型名称
        var operateTypeName = "";
        if (bsInfoLocal.operateType == "0") {
            operateTypeName = "自有品牌";
                $('.imgfileListE1').hide()
        } else if (bsInfoLocal.operateType == "1") {
            operateTypeName = "代理品牌";
             $('.imgfileListE1').show()
        }
        $("input[name='operateType']").val(operateTypeName);
        $(".operateTypeSelect option:contains('" + operateTypeName + "')").prop("selected", true);
    }

    // 是否有经营场所类型--微小型商户必填
    if (bsInfoLocal.havingFixedBusiAddr != null && bsInfoLocal.havingFixedBusiAddr != "") {
        $("input[name='havingFixedBusiAddr']").attr("data-id", bsInfoLocal.havingFixedBusiAddr);
        // 经营类型名称
        var havingFixedBusiAddrTypeName = "";
        if (bsInfoLocal.havingFixedBusiAddr == "1") {
            havingFixedBusiAddrTypeName = "有";
        } else if (bsInfoLocal.havingFixedBusiAddr == "0") {
            havingFixedBusiAddrTypeName = "无";
        }
        $("input[name='havingFixedBusiAddr']").val(havingFixedBusiAddrTypeName);
        $(".havingFixedBusiAddrSelect option:contains('" + havingFixedBusiAddrTypeName + "')").prop("selected", true);
    }

    // 法人性别--微小型商户必填
    if (bsInfoLocal.legalSexType != null && bsInfoLocal.legalSexType != "") {
        $("input[name='legalSexType']").attr("data-id", bsInfoLocal.legalSexType);
        // 经营类型名称
        var legalSexTypeTypeName = "";
        if (bsInfoLocal.legalSexType == "0") {
            legalSexTypeTypeName = "未知的性别";
        } else if (bsInfoLocal.legalSexType == "1") {
            legalSexTypeTypeName = "男性";
        } else if (bsInfoLocal.legalSexType == "2") {
            legalSexTypeTypeName = "女性";
        } else if (bsInfoLocal.legalSexType == "5") {
            legalSexTypeTypeName = "女性改（变）为男性";
        } else if (bsInfoLocal.legalSexType == "6") {
            legalSexTypeTypeName = "男性改（变）为女性";
        } else if (bsInfoLocal.legalSexType == "9") {
            legalSexTypeTypeName = "未说明的性别";
        }
        $("input[name='legalSexType']").val(legalSexTypeTypeName);
        $(".legalSexTypeSelect option:contains('" + legalSexTypeTypeName + "')").prop("selected", true);
    }

    // 法人职业--微小型商户必填
    if (bsInfoLocal.legalOccupation != null && bsInfoLocal.legalOccupation != "") {
        $("input[name='legalOccupation']").attr("data-id", bsInfoLocal.legalOccupation);
        // 经营类型名称
        var legalOccupationTypeName = "";
        if (bsInfoLocal.legalOccupation == "0") {
            legalOccupationTypeName = "各类专业、技术人员";
        } else if (bsInfoLocal.legalOccupation == "1") {
            legalOccupationTypeName = "国家机关、党群组织、企事业单位的负责人";
        } else if (bsInfoLocal.legalOccupation == "2") {
            legalOccupationTypeName = "办事人员和有关人员";
        } else if (bsInfoLocal.legalOccupation == "3") {
            legalOccupationTypeName = "商业工作人员";
        } else if (bsInfoLocal.legalOccupation == "4") {
            legalOccupationTypeName = "服务性工作人员";
        } else if (bsInfoLocal.legalOccupation == "5") {
            legalOccupationTypeName = "农林牧渔劳";
        }
        $("input[name='legalOccupation']").val(legalOccupationTypeName);
        $(".legalOccupationSelect option:contains('" + legalOccupationTypeName + "')").prop("selected", true);
    }

    // 行业类别编码
    if (bsInfoLocal.mccCodeName != null && bsInfoLocal.mccCodeName != "") {
        $("input[name='mccCode']").val(bsInfoLocal.mccCodeName);
        //$(".storeTypeSelect option:contains('"+bsInfoLocal.storeTypeName+"')").prop("selected",true);
    }

    //行业类别编码类型
    if (bsInfoLocal.mccCode != null && bsInfoLocal.mccCode != "") {
        $("input[name='mccCode']").attr("data-id", bsInfoLocal.mccCode);
        try {

            $(".mccCodeSelect option").each(function () { //遍历所有option
                var channlVal = $(this).val(); //获取option值

                if (bsInfoLocal.mccCode == channlVal) {
                    $(this).prop("selected", true);

                }
            })
            var mccCodeObj = JSON.parse(bsInfoLocal.mccCode);
            if (typeof mccCodeObj == 'object' && mccCodeObj) {
                // 店铺类型 id
                if (mccCodeObj.value != null && mccCodeObj.value != "") {
                    $("input[name='mccCode']").attr("data-id", mccCode.value);
                }
                // 店铺类型
                if (mccCode.label != null && mccCode.label != "") {
                    $("input[name='mccCode']").val(mccCode.label);
                }
            }
        } catch (e) {}
    }


    // 店铺类型
    if (bsInfoLocal.storeTypeName != null && bsInfoLocal.storeTypeName != "") {
        $("input[name='storeType']").val(bsInfoLocal.storeTypeName);
        //$(".storeTypeSelect option:contains('"+bsInfoLocal.storeTypeName+"')").prop("selected",true);
    }
    // 店铺类型
    if (bsInfoLocal.storeType != null && bsInfoLocal.storeType != "") {
        $("input[name='storeType']").attr("data-id", bsInfoLocal.storeType);
        try {
            $(".storeTypeSelect option").each(function () { //遍历所有option
                var channlVal = $(this).val(); //获取option值
                if (bsInfoLocal.storeType == channlVal) {
                    $(this).prop("selected", true);
                }
            })
            var storeTypeObj = JSON.parse(bsInfoLocal.storeType);
            if (typeof storeTypeObj == 'object' && storeTypeObj) {
                // 店铺类型 id
                if (storeTypeObj.value != null && storeTypeObj.value != "") {
                    $("input[name='storeType']").attr("data-id", storeTypeObj.value);
                }
                // 店铺类型
                if (storeTypeObj.label != null && storeTypeObj.label != "") {
                    $("input[name='storeType']").val(storeTypeObj.label);
                }
            }
        } catch (e) {}
    }
    // 省
    if (bsInfoLocal.province != null && bsInfoLocal.province != "") {
        $(".region_box1 .region.setup1 li").eq(0).attr("data-id", bsInfoLocal.province.id);
        $(".region_box1 .region.setup1 li").eq(0).attr("data-value", bsInfoLocal.province.name);
        $(".region_box1 .region.setup1 li").eq(0).find("span").text(bsInfoLocal.province.name);
        $("input[class='region1']").val(bsInfoLocal.province.name)
    }

    //市
    if (bsInfoLocal.city != null && bsInfoLocal.city != "") {
        $(".region_box1 .region.setup1 li").eq(1).attr("data-id", bsInfoLocal.city.id);
        $(".region_box1 .region.setup1 li").eq(1).attr("data-value", bsInfoLocal.city.name);
        $(".region_box1 .region.setup1 li").eq(1).find("span").text(bsInfoLocal.city.name);
        $("input[class='region1']").val($("input[class='region1']").val() + " " + bsInfoLocal.city.name)
    }
    //区镇
    if (bsInfoLocal.area != null && bsInfoLocal.area != "") {
        $(".region_box1 .region.setup1 li").eq(2).attr("data-id", bsInfoLocal.area.id);
        $(".region_box1 .region.setup1 li").eq(2).attr("data-value", bsInfoLocal.area.name);
        $(".region_box1 .region.setup1 li").eq(2).find("span").text(bsInfoLocal.area.name);
        $("input[class='region1']").val($("input[class='region1']").val() + " " + bsInfoLocal.area.name)
    }
    //街道
    // if (bsInfoLocal.street != null && bsInfoLocal.street != "") {
    //     $(".region_box1 .region.setup1 li").eq(3).attr("data-id", bsInfoLocal.street.id);
    //     $(".region_box1 .region.setup1 li").eq(3).attr("data-value", bsInfoLocal.street.name);
    //     $(".region_box1 .region.setup1 li").eq(3).find("span").text(bsInfoLocal.street.name);
    //     $("input[class='region1']").val($("input[class='region1']").val() + " " + bsInfoLocal.street.name);
    // }
    //营业地址路名
    if (bsInfoLocal.road != null && bsInfoLocal.road != "") {
        $("input[id='road']").val(bsInfoLocal.road);
    }
    //营业地址门牌
    if (bsInfoLocal.houseNo != null && bsInfoLocal.houseNo != "") {
        $("input[id='houseNo']").val(bsInfoLocal.houseNo);
    }
    //实际经营地址
    if (bsInfoLocal.actualAddress != null && bsInfoLocal.actualAddress != "") {
        $("input[class='actualAddress']").val(bsInfoLocal.actualAddress);
    }
    //企业详细地址
    if (bsInfoLocal.enterpriseAddress != null && bsInfoLocal.enterpriseAddress != "") {
        $("input[class='enterpriseAddress']").val(bsInfoLocal.enterpriseAddress);
    }
    //营业地址补充信息
    if (bsInfoLocal.addrExt != null && bsInfoLocal.addrExt != "") {
        $("input[id='addrExt']").val(bsInfoLocal.addrExt);
    }
    //联系人
    if (bsInfoLocal.linkName != null && bsInfoLocal.linkName != "") {
        $("input[id='linkName']").val(bsInfoLocal.linkName);
    }
    //联系人
    if (bsInfoLocal.linkMobile != null && bsInfoLocal.linkMobile != "") {
        $("input[id='linkMobile']").val(bsInfoLocal.linkMobile);
    }
    // 邮寄联系人
    if (bsInfoLocal.mailUser != null && bsInfoLocal.mailUser != "") {
        $("input[id='mailUser']").val(bsInfoLocal.mailUser);
    }
    // 邮寄联系人电话
    if (bsInfoLocal.mailMobile != null && bsInfoLocal.mailMobile != "") {
        $("input[id='mailMobile']").val(bsInfoLocal.mailMobile);
    }
    // 邮寄地址
    if (bsInfoLocal.mailAddress != null && bsInfoLocal.mailAddress != "") {
        $("input[id='mailAddress']").val(bsInfoLocal.mailAddress);
    }
    // 法人姓名
    if (bsInfoLocal.legalName != null && bsInfoLocal.legalName != "") {
        $("input[id='legalName']").val(bsInfoLocal.legalName);
    }
    // 法人邮箱
    if (bsInfoLocal.legalEmail != null && bsInfoLocal.legalEmail != "") {
        $("input[id='legalEmail']").val(bsInfoLocal.legalEmail);
    }
    // 法人身份证号码
    if (bsInfoLocal.idCard != null && bsInfoLocal.idCard != "") {
        $("input[name='idCard']").val(bsInfoLocal.idCard);
    }
    //法人身份证号码有效期开始时间
    if (bsInfoLocal.idCardStart != null && bsInfoLocal.idCardStart != "") {
        $("input[name='idCardStart']").val(bsInfoLocal.idCardStart);
    }
    //法人身份证号码有效期结束时间
    if (bsInfoLocal.idCardEnd != null && bsInfoLocal.idCardEnd != "") {
        $("input[name='idCardEnd']").val(bsInfoLocal.idCardEnd);
    }
    // 银行预留手机
    if (bsInfoLocal.reservePhone != null && bsInfoLocal.reservePhone != "") {
        $("input[id='reservePhone']").val(bsInfoLocal.reservePhone);
    }

    // 法人手机号码
    if (bsInfoLocal.mobile != null && bsInfoLocal.mobile != "") {
        $("input[id='mobile']").val(bsInfoLocal.mobile);
    }
    //店铺管理人姓名
    if (bsInfoLocal.custName != null && bsInfoLocal.custName != "") {
        $("input[id='custName']").val(bsInfoLocal.custName);
    }
    //店铺管理人邮箱
    if (bsInfoLocal.custEmail != null && bsInfoLocal.custEmail != "") {
        $("input[id='custEmail']").val(bsInfoLocal.custEmail);
    }
    //店铺管理人手机号码
    if (bsInfoLocal.custPhone != null && bsInfoLocal.custPhone != "") {
        $("input[id='custPhone']").val(bsInfoLocal.custPhone);
    }
    // 短信验证码
    if (bsInfoLocal.proofCode != null && bsInfoLocal.proofCode != "") {
        $("input[id='proofCode']").val(bsInfoLocal.proofCode);
    }
    // 法人证件照(正面照)
    if (bsInfoLocal.imgfileList57 != null && bsInfoLocal.imgfileList57 != "") {
        // 法人证件照(正面照) 路径
        var imgfileList57 = bsInfoLocal.imgfileList57[0];
        if (imgfileList57.path != null && imgfileList57.path != "") {
            $("#imgfileList57").attr("route", imgfileList57.path);
        }
        // 法人证件照(正面照) 图片名
        if (imgfileList57.name != null && imgfileList57.name != "") {
            $("#imgfileList57").attr("filename", imgfileList57.name);
        }
        // 营业执照 图片完整路径
        if (imgfileList57.src != null && imgfileList57.scr != "") {
            $("#imgfileList57").attr("src", imgfileList57.src);
        }
        // 法人证件照(正面照) 图片完整路径
        if (imgfileList57.imageHttp != null && imgfileList57.imageHttp != "") {
            $("#imgfileList57").attr("src", imgfileList57.imageHttp + imgfileList57.path + imgfileList57.name);
        }
        $("#imgfileList57").attr('class', 'picture-viewer')
    }

    // 法人证件照(国徽面)
    if (bsInfoLocal.imgfileList58 != null && bsInfoLocal.imgfileList58 != "") {
        // 法人证件照(国徽面) 路径
        var imgfileList58 = bsInfoLocal.imgfileList58[0];
        if (imgfileList58.path != null && imgfileList58.path != "") {
            $("#imgfileList58").attr("route", imgfileList58.path);
        }
        // 法人证件照(国徽面) 图片名
        if (imgfileList58.name != null && imgfileList58.name != "") {
            $("#imgfileList58").attr("filename", imgfileList58.name);
        }
        // 营业执照 图片完整路径
        if (imgfileList58.src != null && imgfileList58.scr != "") {
            $("#imgfileList58").attr("src", imgfileList58.src);
        }
        // 法人证件照(国徽面) 图片完整路径
        if (imgfileList58.imageHttp != null && imgfileList58.imageHttp != "") {
            $("#imgfileList58").attr("src", imgfileList58.imageHttp + imgfileList58.path + imgfileList58.name);
        }
        $("#imgfileList58").attr('class', 'picture-viewer')
    }

    /*微小型商户五张至少传一张*/
    // 租赁协议
    if (bsInfoLocal.imgfileListLeasingAgreement != null && bsInfoLocal.imgfileListLeasingAgreement != "") {
        // 租赁协议 路径
        var imgfileListLeasingAgreement = bsInfoLocal.imgfileListLeasingAgreement[0];
        if (imgfileListLeasingAgreement.path != null && imgfileListLeasingAgreement.path != "") {
            $("#imgfileListLeasingAgreement").attr("route", imgfileListLeasingAgreement.path);

        }
        // 租赁协议 图片名
        if (imgfileListLeasingAgreement.name != null && imgfileListLeasingAgreement.name != "") {
            $("#imgfileListLeasingAgreement").attr("filename", imgfileListLeasingAgreement.name);
        }
        // 租赁协议 图片完整路径
        if (imgfileListLeasingAgreement.src != null && imgfileListLeasingAgreement.scr != "") {
            $("#imgfileListLeasingAgreement").attr("src", imgfileListLeasingAgreement.src);
        }
        // 租赁协议 图片完整路径
        if (imgfileListLeasingAgreement.imageHttp != null && imgfileListLeasingAgreement.imageHttp != "") {
            $("#imgfileListLeasingAgreement").attr("src", imgfileListLeasingAgreement.imageHttp + imgfileListLeasingAgreement.path + imgfileListLeasingAgreement.name);
        }
        $("#imgfileListLeasingAgreement").attr('class', 'picture-viewer')
    }
    // 产权证明
    if (bsInfoLocal.imgfileListSecurities != null && bsInfoLocal.imgfileListSecurities != "") {
        // 产权证明 路径
        var imgfileListSecurities = bsInfoLocal.imgfileListSecurities[0];
        if (imgfileListSecurities.path != null && imgfileListSecurities.path != "") {
            $("#imgfileListSecurities").attr("route", imgfileListSecurities.path);
        }
        // 产权证明 图片名
        if (imgfileListSecurities.name != null && imgfileListSecurities.name != "") {
            $("#imgfileListSecurities").attr("filename", imgfileListSecurities.name);
        }
        // 产权证明 图片完整路径
        if (imgfileListSecurities.src != null && imgfileListSecurities.scr != "") {
            $("#imgfileListSecurities").attr("src", imgfileListSecurities.src);
        }
        // 产权证明 图片完整路径
        if (imgfileListSecurities.imageHttp != null && imgfileListSecurities.imageHttp != "") {
            $("#imgfileListSecurities").attr("src", imgfileListSecurities.imageHttp + imgfileListSecurities.path + imgfileListSecurities.name);
        }
        $("#imgfileListSecurities").attr('class', 'picture-viewer')
    }
    // 执业资质证照
    if (bsInfoLocal.imgfileListQualificationCertificate != null && bsInfoLocal.imgfileListQualificationCertificate != "") {
        // 执业资质证照 路径
        var imgfileListQualificationCertificate = bsInfoLocal.imgfileListQualificationCertificate[0];
        if (imgfileListQualificationCertificate.path != null && imgfileListQualificationCertificate.path != "") {
            $("#imgfileListQualificationCertificate").attr("route", imgfileListQualificationCertificate.path);
        }
        // 执业资质证照 图片名
        if (imgfileListQualificationCertificate.name != null && imgfileListQualificationCertificate.name != "") {
            $("#imgfileListQualificationCertificate").attr("filename", imgfileListQualificationCertificate.name);
        }
        // 执业资质证照 图片完整路径
        if (imgfileListQualificationCertificate.src != null && imgfileListQualificationCertificate.scr != "") {
            $("#imgfileListQualificationCertificate").attr("src", imgfileListQualificationCertificate.src);
        }
        // 执业资质证照 图片完整路径
        if (imgfileListQualificationCertificate.imageHttp != null && imgfileListQualificationCertificate.imageHttp != "") {
            $("#imgfileListQualificationCertificate").attr("src", imgfileListQualificationCertificate.imageHttp + imgfileListQualificationCertificate.path + imgfileListQualificationCertificate.name);
        }
        $("#imgfileListQualificationCertificate").attr('class', 'picture-viewer')
    }
    // 第三方证明
    if (bsInfoLocal.imgfileListThirdPartyCertification != null && bsInfoLocal.imgfileListThirdPartyCertification != "") {
        // 第三方证明 路径
        var imgfileListThirdPartyCertification = bsInfoLocal.imgfileListThirdPartyCertification[0];
        if (imgfileListThirdPartyCertification.path != null && imgfileListThirdPartyCertification.path != "") {
            $("#imgfileListThirdPartyCertification").attr("route", imgfileListThirdPartyCertification.path);
        }
        // 第三方证明 图片名
        if (imgfileListThirdPartyCertification.name != null && imgfileListThirdPartyCertification.name != "") {
            $("#imgfileListThirdPartyCertification").attr("filename", imgfileListThirdPartyCertification.name);
        }
        // 第三方证明 图片完整路径
        if (imgfileListThirdPartyCertification.src != null && imgfileListThirdPartyCertification.scr != "") {
            $("#imgfileListThirdPartyCertification").attr("src", imgfileListThirdPartyCertification.src);
        }
        // 第三方证明 图片完整路径
        if (imgfileListThirdPartyCertification.imageHttp != null && imgfileListThirdPartyCertification.imageHttp != "") {
            $("#imgfileListThirdPartyCertification").attr("src", imgfileListThirdPartyCertification.imageHttp + imgfileListThirdPartyCertification.path + imgfileListThirdPartyCertification.name);
        }
        $("#imgfileListThirdPartyCertification").attr('class', 'picture-viewer')
    }
    // 其它微小型商户证明材料
    if (bsInfoLocal.imgfileListCertificationMaterialsOfOtherMicroAndSmallMerchants != null && bsInfoLocal.imgfileListCertificationMaterialsOfOtherMicroAndSmallMerchants != "") {
        // 其它微小型商户证明材料 路径
        var imgfileListCertificationMaterialsOfOtherMicroAndSmallMerchants = bsInfoLocal.imgfileListCertificationMaterialsOfOtherMicroAndSmallMerchants[0];
        if (imgfileListCertificationMaterialsOfOtherMicroAndSmallMerchants.path != null && imgfileListCertificationMaterialsOfOtherMicroAndSmallMerchants.path != "") {
            $("#imgfileListCertificationMaterialsOfOtherMicroAndSmallMerchants").attr("route", imgfileListCertificationMaterialsOfOtherMicroAndSmallMerchants.path);
        }
        // 其它微小型商户证明材料 图片名
        if (imgfileListCertificationMaterialsOfOtherMicroAndSmallMerchants.name != null && imgfileListCertificationMaterialsOfOtherMicroAndSmallMerchants.name != "") {
            $("#imgfileListCertificationMaterialsOfOtherMicroAndSmallMerchants").attr("filename", imgfileListCertificationMaterialsOfOtherMicroAndSmallMerchants.name);
        }
        // 其它微小型商户证明材料 图片完整路径
        if (imgfileListCertificationMaterialsOfOtherMicroAndSmallMerchants.src != null && imgfileListCertificationMaterialsOfOtherMicroAndSmallMerchants.scr != "") {
            $("#imgfileListCertificationMaterialsOfOtherMicroAndSmallMerchants").attr("src", imgfileListCertificationMaterialsOfOtherMicroAndSmallMerchants.src);
        }
        // 其它微小型商户证明材料 图片完整路径
        if (imgfileListCertificationMaterialsOfOtherMicroAndSmallMerchants.imageHttp != null && imgfileListCertificationMaterialsOfOtherMicroAndSmallMerchants.imageHttp != "") {
            $("#imgfileListCertificationMaterialsOfOtherMicroAndSmallMerchants").attr("src", imgfileListCertificationMaterialsOfOtherMicroAndSmallMerchants.imageHttp + imgfileListCertificationMaterialsOfOtherMicroAndSmallMerchants.path + imgfileListCertificationMaterialsOfOtherMicroAndSmallMerchants.name);
        }
        $("#imgfileListCertificationMaterialsOfOtherMicroAndSmallMerchants").attr('class', 'picture-viewer')
    }
    // 经营商品图片--微小型商户必传
    if (bsInfoLocal.imgfileListPicturesOfOperatingCommodities != null && bsInfoLocal.imgfileListPicturesOfOperatingCommodities != "") {
        // 经营商品图片 路径
        var imgfileListPicturesOfOperatingCommodities = bsInfoLocal.imgfileListPicturesOfOperatingCommodities[0];
        if (imgfileListPicturesOfOperatingCommodities.path != null && imgfileListPicturesOfOperatingCommodities.path != "") {
            $("#imgfileListPicturesOfOperatingCommodities").attr("route", imgfileListPicturesOfOperatingCommodities.path);
        }
        // 经营商品图片 图片名
        if (imgfileListPicturesOfOperatingCommodities.name != null && imgfileListPicturesOfOperatingCommodities.name != "") {
            $("#imgfileListPicturesOfOperatingCommodities").attr("filename", imgfileListPicturesOfOperatingCommodities.name);
        }
        // 经营商品图片 图片完整路径
        if (imgfileListPicturesOfOperatingCommodities.src != null && imgfileListPicturesOfOperatingCommodities.scr != "") {
            $("#imgfileListPicturesOfOperatingCommodities").attr("src", imgfileListPicturesOfOperatingCommodities.src);
        }
        // 经营商品图片 图片完整路径
        if (imgfileListPicturesOfOperatingCommodities.imageHttp != null && imgfileListPicturesOfOperatingCommodities.imageHttp != "") {
            $("#imgfileListPicturesOfOperatingCommodities").attr("src", imgfileListPicturesOfOperatingCommodities.imageHttp + imgfileListPicturesOfOperatingCommodities.path + imgfileListPicturesOfOperatingCommodities.name);
        }
        $("#imgfileListPicturesOfOperatingCommodities").attr('class', 'picture-viewer')
    }


    // 银行卡账号
    if (bsInfoLocal.bankCard != null && bsInfoLocal.bankCard != "") {
        $("input[id='bankCard']").val(bsInfoLocal.bankCard);
    }
    // 注册类型  0 个人账号  1企业账号
    if (bsInfoLocal.bankAcctType != null && bsInfoLocal.bankAcctType != "") {
        $("input[id='bankAcctType']").attr("data-id", bsInfoLocal.bankAcctType);
        bankAcctTypeNeedData(bsInfoLocal.bankAcctType);
    }
    if (bsInfoLocal.bankAcctTypeName != null && bsInfoLocal.bankAcctTypeName != "") {
        $("input[id='bankAcctType']").val(bsInfoLocal.bankAcctTypeName);
        bankAcctTypeNeedData(bsInfoLocal.bankAcctTypename);
    }
    // 银行卡户名
    if (bsInfoLocal.bankUser != null && bsInfoLocal.bankUser != "") {
        $("input[id='bankUser']").val(bsInfoLocal.bankUser);
    }
    // 银行所在省
    if (bsInfoLocal.shopProvince != null && bsInfoLocal.shopProvince != "") {
        $(".region_box2 .region.setup2 li").eq(0).attr("data-id", bsInfoLocal.shopProvince.id);
        $(".region_box2 .region.setup2 li").eq(0).attr("data-value", bsInfoLocal.shopProvince.name);
        $(".region_box2 .region.setup2 li").eq(0).find("span").text(bsInfoLocal.shopProvince.name);
        $("input[class='region2']").val(bsInfoLocal.shopProvince.name)
    }
    //银行所在市
    if (bsInfoLocal.shopCity != null && bsInfoLocal.shopCity != "") {
        $(".region_box2 .region.setup2 li").eq(1).attr("data-id", bsInfoLocal.shopCity.id);
        $(".region_box2 .region.setup2 li").eq(1).attr("data-value", bsInfoLocal.shopCity.name);
        $(".region_box2 .region.setup2 li").eq(1).find("span").text(bsInfoLocal.shopCity.name);
        $("input[class='region2']").val($("input[class='region2']").val() + " " + bsInfoLocal.shopCity.name)
    }
    //银行所在区镇
    if (bsInfoLocal.shopArea != null && bsInfoLocal.shopArea != "") {
        $(".region_box2 .region.setup2 li").eq(2).attr("data-id", bsInfoLocal.shopArea.id);
        $(".region_box2 .region.setup2 li").eq(2).attr("data-value", bsInfoLocal.shopArea.name);
        $(".region_box2 .region.setup2 li").eq(2).find("span").text(bsInfoLocal.shopArea.name);
        $("input[class='region2']").val($("input[class='region2']").val() + " " + bsInfoLocal.shopArea.name)
    }

    // 开户支行code
    if (bsInfoLocal.bankNo != null && bsInfoLocal.bankNo != "") {
        $("input[id='bankNo']").val(bsInfoLocal.bankNo);
    }
    // 开户支行名称
    if (bsInfoLocal.bankName != null && bsInfoLocal.bankName != "") {
        $("input[id='bankName']").val(bsInfoLocal.bankName);
    }
    // 统一社会信用代码
    if (bsInfoLocal.socialCode != null && bsInfoLocal.socialCode != "") {
        $("input[id='socialCode']").val(bsInfoLocal.socialCode)
    }
    // 统一社会信用代码开始时间
    if (bsInfoLocal.socialCodesStart != null && bsInfoLocal.socialCodesStart != "") {
        $("input[id='socialCodesStart']").val(bsInfoLocal.socialCodesStart)
    }
    // 统一社会信用代码结束时间
    if (bsInfoLocal.socialCodeEnd != null && bsInfoLocal.socialCodeEnd != "") {
        $("input[id='socialCodeEnd']").val(bsInfoLocal.socialCodeEnd)
    }
    // 营业执照
    if (bsInfoLocal.imgfileList2 != null && bsInfoLocal.imgfileList2 != "") {
        // 营业执照 路径
        var imgfileList2 = bsInfoLocal.imgfileList2[0];
        if (imgfileList2.path != null && imgfileList2.path != "") {
            $("#imgfileList2").attr("route", imgfileList2.path);
        }
        // 营业执照 图片名
        if (imgfileList2.name != null && imgfileList2.name != "") {
            $("#imgfileList2").attr("filename", imgfileList2.name);
        }
        // 营业执照 图片完整路径
        if (imgfileList2.src != null && imgfileList2.scr != "") {
            $("#imgfileList2").attr("src", imgfileList2.src);
        }
        // 营业执照 图片完整路径
        if (imgfileList2.imageHttp != null && imgfileList2.imageHttp != "") {
            $("#imgfileList2").attr("src", imgfileList2.imageHttp + imgfileList2.path + imgfileList2.name);
        }
        $("#imgfileList2").attr('class', 'picture-viewer')
    }

    //开户许可证/银行卡
    if (bsInfoLocal.imgfileList78 != null && bsInfoLocal.imgfileList78 != "") {
        //开户许可证 路径
        var imgfileList78 = bsInfoLocal.imgfileList78[0];
        if (imgfileList78.path != null && imgfileList78.path != "") {
            $("#imgfileList78").attr("route", imgfileList78.path);
        }
        // 开户许可证 图片名
        if (imgfileList78.name != null && imgfileList78.name != "") {
            $("#imgfileList78").attr("filename", imgfileList78.name);
        }
        // 开户许可证 图片完整路径
        if (imgfileList78.src != null && imgfileList78.scr != "") {
            $("#imgfileList78").attr("src", imgfileList78.src);
        }
        // 开户许可证 图片完整路径查询入驻信息用到
        if (imgfileList78.imageHttp != null && imgfileList78.imageHttp != "") {
            $("#imgfileList78").attr("src", imgfileList78.imageHttp + imgfileList78.path + imgfileList78.name);
        }
        $("#imgfileList78").attr('class', 'picture-viewer')
    }
    //收银台照
    if (bsInfoLocal.imgfileListF1 != null && bsInfoLocal.imgfileListF1 != "") {
        //收银台照  路径
        var imgfileListF1 = bsInfoLocal.imgfileListF1[0];
        if (imgfileListF1.path != null && imgfileListF1.path != "") {
            $("#imgfileListF1").attr("route", imgfileListF1.path);
        }
        // 收银台照  图片名
        if (imgfileListF1.name != null && imgfileListF1.name != "") {
            $("#imgfileListF1").attr("filename", imgfileListF1.name);
        }
        // 收银台照 图片完整路径
        if (imgfileListF1.src != null && imgfileListF1.scr != "") {
            $("#imgfileListF1").attr("src", imgfileListF1.src);
        }
        // 收银台照  图片完整路径查询入驻信息用到
        if (imgfileListF1.imageHttp != null && imgfileListF1.imageHttp != "") {
            $("#imgfileListF1").attr("src", imgfileListF1.imageHttp + imgfileListF1.path + imgfileListF1.name);
        }
        $("#imgfileListF1").attr('class', 'picture-viewer')
    }

    //经营场景照片
    if (bsInfoLocal.imgfileList24 != null && bsInfoLocal.imgfileList24 != "") {
        //经营场景照片  路径
        var imgfileList24 = bsInfoLocal.imgfileList24[0];
        if (imgfileList24.path != null && imgfileList24.path != "") {
            $("#imgfileList24").attr("route", imgfileList24.path);
        }
        //经营场景照片  图片名
        if (imgfileList24.name != null && imgfileList24.name != "") {
            $("#imgfileList24").attr("filename", imgfileList24.name);
        }
        //经营场景照片 图片完整路径
        if (imgfileList24.src != null && imgfileList24.scr != "") {
            $("#imgfileList24").attr("src", imgfileList24.src);
        }
        // 经营场景照片  图片完整路径查询入驻信息用到
        if (imgfileList24.imageHttp != null && imgfileList24.imageHttp != "") {
            $("#imgfileList24").attr("src", imgfileList24.imageHttp + imgfileList24.path + imgfileList24.name);
        }
        $("#imgfileList24").attr('class', 'picture-viewer')
    }

    //门店照片
    if (bsInfoLocal.imgfileList79 != null && bsInfoLocal.imgfileList79 != "") {
        //门店照片  路径
        var imgfileList79 = bsInfoLocal.imgfileList79[0];
        if (imgfileList79.path != null && imgfileList79.path != "") {
            $("#imgfileList79").attr("route", imgfileList79.path);
        }
        //门店照片  图片名
        if (imgfileList79.name != null && imgfileList79.name != "") {
            $("#imgfileList79").attr("filename", imgfileList79.name);
        }
        //门店照片 图片完整路径
        if (imgfileList79.src != null && imgfileList79.scr != "") {
            $("#imgfileList79").attr("src", imgfileList79.src);
        }
        // 门店照片  图片完整路径查询入驻信息用到
        if (imgfileList79.imageHttp != null && imgfileList79.imageHttp != "") {
            $("#imgfileList79").attr("src", imgfileList79.imageHttp + imgfileList79.path + imgfileList79.name);
        }
        $("#imgfileList79").attr('class', 'picture-viewer')
    }
    //商标注册证书

    //室内照片
    if (bsInfoLocal.imgfileListI1 != null && bsInfoLocal.imgfileListI1 != "") {
        //室内照片  路径
        var imgfileListI1 = bsInfoLocal.imgfileListI1[0];
        if (imgfileListI1.path != null && imgfileListI1.path != "") {
            $("#imgfileListI1").attr("route", imgfileListI1.path);
        }
        //室内照片  图片名
        if (imgfileListI1.name != null && imgfileListI1.name != "") {
            $("#imgfileListI1").attr("filename", imgfileListI1.name);
        }
        //室内照片 图片完整路径
        if (imgfileListI1.src != null && imgfileListI1.scr != "") {
            $("#imgfileListI1").attr("src", imgfileListI1.src);
        }
        //室内照片  图片完整路径查询入驻信息用到
        if (imgfileListI1.imageHttp != null && imgfileListI1.imageHttp != "") {
            $("#imgfileListI1").attr("src", imgfileListI1.imageHttp + imgfileListI1.path + imgfileListI1.name);
        }
        $("#imgfileListI1").attr('class', 'picture-viewer')
    }
    //授权证书
    if (bsInfoLocal.imgfileListE1 != null && bsInfoLocal.imgfileListE1 != "") {
        //授权证书  路径
        var imgfileListE1 = bsInfoLocal.imgfileListE1[0];
        if (imgfileListE1.path != null && imgfileListE1.path != "") {
            $("#imgfileListE1").attr("route", imgfileListE1.path);
        }
        //授权证书  图片名
        if (imgfileListE1.name != null && imgfileListE1.name != "") {
            $("#imgfileListE1").attr("filename", imgfileListE1.name);
        }
        //授权证书 图片完整路径
        if (imgfileListE1.src != null && imgfileListE1.scr != "") {
            $("#imgfileListE1").attr("src", imgfileListE1.src);
        }
        //授权证书  图片完整路径查询入驻信息用到
        if (imgfileListE1.imageHttp != null && imgfileListE1.imageHttp != "") {
            $("#imgfileListE1").attr("src", imgfileListE1.imageHttp + imgfileListE1.path + imgfileListE1.name);
        }
        $("#imgfileListE1").attr('class', 'picture-viewer')
    }
    //法人手持证件
    if (bsInfoLocal.imgfileListZ1 != null && bsInfoLocal.imgfileListZ1 != "") {
        //法人手持证件照片  路径
        var imgfileListZ1 = bsInfoLocal.imgfileListZ1[0];
        if (imgfileListZ1.path != null && imgfileListZ1.path != "") {
            $("#imgfileListZ1").attr("route", imgfileListZ1.path);
        }
        //法人手持证件  图片名
        if (imgfileListZ1.name != null && imgfileListZ1.name != "") {
            $("#imgfileListZ1").attr("filename", imgfileListZ1.name);
        }
        //法人手持证件 图片完整路径
        if (imgfileListZ1.src != null && imgfileListZ1.scr != "") {
            $("#imgfileListZ1").attr("src", imgfileListZ1.src);
        }
        // 法人手持证件  图片完整路径查询入驻信息用到
        if (imgfileListZ1.imageHttp != null && imgfileListZ1.imageHttp != "") {
            $("#imgfileListZ1").attr("src", imgfileListZ1.imageHttp + imgfileListZ1.path + imgfileListZ1.name);
        }
        $("#imgfileListZ1").attr('class', 'picture-viewer')
    }
    //法人手持证件
    if (bsInfoLocal.imgfileListN3 != null && bsInfoLocal.imgfileListN3 != "") {
        //法人手持证件照片  路径
        var imgfileListN3 = bsInfoLocal.imgfileListN3[0];
        if (imgfileListN3.path != null && imgfileListN3.path != "") {
            $("#imgfileListN3").attr("route", imgfileListN3.path);
        }
        //法人手持证件  图片名
        if (imgfileListN3.name != null && imgfileListN3.name != "") {
            $("#imgfileListN3").attr("filename", imgfileListN3.name);
        }
        //法人手持证件 图片完整路径
        if (imgfileListN3.src != null && imgfileListN3.scr != "") {
            $("#imgfileListN3").attr("src", imgfileListN3.src);
        }
        // 法人手持证件  图片完整路径查询入驻信息用到
        if (imgfileListN3.imageHttp != null && imgfileListN3.imageHttp != "") {
            $("#imgfileListN3").attr("src", imgfileListN3.imageHttp + imgfileListN3.path + imgfileListN3.name);
        }
        $("#imgfileListN3").attr('class', 'picture-viewer')
    }
       if (userType == 1) {
           bsInfoLocal.bankAcctType = 1;
           bsInfoLocal.bankAcctTypeName = "企业账号"
            $("input[id='bankAcctType']").attr("data-id", 1);
            bankAcctTypeNeedData(1);
     
 
       } else if (userType == 2) {
           bsInfoLocal.bankAcctType = 1;
           bsInfoLocal.bankAcctTypeName = "企业账号"
            $("input[id='bankAcctType']").attr("data-id", 1);
            bankAcctTypeNeedData(1);
        
        
          
       } else if (userType == 3) {
           bsInfoLocal.bankAcctType = 0;
           bsInfoLocal.bankAcctTypeName = "个人账号"
            $("input[id='bankAcctType']").attr("data-id",0 );
            bankAcctTypeNeedData(0);
          
       }
    //品牌商标注册证书和销售授权书
    pictureEcho(bsInfoLocal.imgfileListX1, 2);
    //销售授权书
    pictureEcho(bsInfoLocal.imgfileListE1, 6);
    //产品质检报告（1年以内具有CMA资质第三方检测机构出具）
    pictureEcho(bsInfoLocal.imgfileListC1, 3);
    //报关单、进口货物检验检疫证证明（进口商品）
    pictureEcho(bsInfoLocal.imgfileListJ1, 4);
    //行业资质
    pictureEcho(bsInfoLocal.imgfileListH1, 5);
}

function getViewdata(bsInfoLocal) {
    var backGroundObjectId = $.trim($("input[id='backGroundObjectId']").val()); // 店铺id
    var storeName = $.trim($("input[name='storeName']").val()); // 店铺名
    var storeBrand = $.trim($("input[name='storeBrand']").val()); // 店铺品牌
    var storeType = $.trim($("input[name='storeType']").attr("data-id")); // 店铺类型Id
    var storeTypeName = $.trim($("input[name='storeType']").val()); // 店铺类型名称
    if ($(".storeTypeSelect").length != 0) {
        storeType = $.trim($(".storeTypeSelect").val());
        storeTypeName = $.trim($(".ostoreTypeSelect").find("option:selected").text());
    }
    var operateType = $.trim($("input[name='operateType']").attr("data-id")); // 经营类型:0自有品牌；1代理品牌
    var operateTypeName = $.trim($("input[name='operateType']").val()); // 经营类型名称
    if ($(".operateTypeSelect").length != 0) {
        operateType = $.trim($(".operateTypeSelect").val()); // 经营类型:0自有品牌；1代理品牌
        operateTypeName = $.trim($(".operateTypeSelect").find("option:selected").text()); // 经营类型名称
    }

    // 省
    var provinceId = $.trim($(".region_box .region.setup1 li").eq(0).attr("data-id"));
    var province = $.trim($(".region_box .region.setup1 li").eq(0).attr("data-value"));
    //市
    var cityId = $.trim($(".region_box .region.setup1 li").eq(1).attr("data-id"));
    var city = $.trim($(".region_box .region.setup1 li").eq(1).attr("data-value"));
    //区镇
    var areaId = $.trim($(".region_box .region.setup1 li").eq(2).attr("data-id"));
    var area = $.trim($(".region_box .region.setup1 li").eq(2).attr("data-value"));
    //街道
    var streetId = $.trim($(".region_box .region li").eq(3).attr("data-id"));
    // var street = $.trim($(".region_box .region li").eq(3).attr("data-value"));
        var street = {};
    var road = $.trim($('#road').val()); // 营业地址路名
    var houseNo = $.trim($('#houseNo').val()); // 营业地址门牌
    var linkName = $.trim($('#linkName').val()); // 意向联系人名称
    var linkMobile = $.trim($('#linkMobile').val()); // 意向联系人电话
    var addrExt = $.trim($('#addrExt').val()); // 营业地址补充信息
    var mailUser = $.trim($("input[id='mailUser']").val()); // 邮寄联系人
    var mailMobile = $.trim($("input[id='mailMobile']").val()); // 邮寄联系人电话
    var mailAddress = $.trim($("input[id='mailAddress']").val()); // 邮寄地址
    var legalName = $.trim($("input[id='legalName']").val()); // 法人姓名
    var idCard = $.trim($("input[id='idCard']").val()); // 法人身份证号码
    var idCardStart = $.trim($("input[id='idCardStart']").val()); // 法人身份证号码开始时间
    var idCardEnd = $.trim($("input[id='idCardEnd']").val()); // 法人身份证号码结束时间

    var legalEmail = $.trim($("#legalEmail").val()); // 法人邮箱
    var mobile = $.trim($("input[id='mobile']").val()); // 法人手机号码
    var imgfileList57 = $.trim($("#imgfileList57").attr("route")); // 法人证件照(正面照) 路径
    var imgfileList57Src = $.trim($("#imgfileList57").attr("src")); // 法人证件照(正面照) 图片完整路径
    var imgfileList57Name = $.trim($("#imgfileList57").attr("filename")); // 法人证件照(正面照) 图片名
    var imgfileList58 = $.trim($("#imgfileList58").attr("route")); // 法人证件照(国徽面) 路径
    var imgfileList58Src = $.trim($("#imgfileList58").attr("src")); // 法人证件照(国徽面) 图片完整路径
    var imgfileList58Name = $.trim($("#imgfileList58").attr("filename")); // 法人证件照(国徽面) 图片名
    var custName = $.trim($("input[id='custName']").val()); //店铺管理人姓名
    var custEmail = $.trim($("input[id='custEmail']").val()); //店铺管理人邮箱
    var custPhone = $.trim($("input[id='custPhone']").val()); //店铺管理人手机号码
    var verifyCode = $.trim($('#verifyCode').val()); // 图形验证码
    var proofCode = $.trim($('#proofCode').val()); // 店铺管理人手机号的验证码
    var businessType = $.trim($('#businessType').attr("data-id")); // 营业执照类型
    var reservePhone = $.trim($('#reservePhone').val()); // 预留手机号

    var legalSexType = $.trim($('#legalSexType').attr("data-id")); // 法人性别
    var legalOccupation = $.trim($('#legalOccupation').attr("data-id")); // 法人职业
    var mccCode = $.trim($('#mccCode').attr("data-id")); // 行业类别编码
    var mccCodeName = $.trim($("input[name='mccCode']").val()); // 店铺类型名称

    var havingFixedBusiAddr = $.trim($('#havingFixedBusiAddr').attr("data-id")); // 是否有营业场所--微小商户必填

    var imgfileListLeasingAgreement = $.trim($("#imgfileListLeasingAgreement").attr("route")); // 租赁协议
    var imgfileListLeasingAgreementSrc = $.trim($("#imgfileListLeasingAgreement").attr("src")); // 租赁协议图片完整路径
    var imgfileListLeasingAgreementName = $.trim($("#imgfileListLeasingAgreement").attr("filename")); // 租赁协议图片名

    var imgfileListSecurities = $.trim($("#imgfileListSecurities").attr("route")); // 产权证明
    var imgfileListSecuritiesSrc = $.trim($("#imgfileListSecurities").attr("src")); // 产权证明 图片完整路径
    var imgfileListSecuritiesName = $.trim($("#imgfileListSecurities").attr("filename")); // 产权证明 图片名

    var imgfileListQualificationCertificate = $.trim($("#imgfileListQualificationCertificate").attr("route")); // 执业资质证照
    var imgfileListQualificationCertificateSrc = $.trim($("#imgfileListQualificationCertificate").attr("src")); // 执业资质证照图片完整路径
    var imgfileListQualificationCertificateName = $.trim($("#imgfileListQualificationCertificate").attr("filename")); //执业资质证照图片名

    var imgfileListThirdPartyCertification = $.trim($("#imgfileListThirdPartyCertification").attr("route")); // 第三方证明
    var imgfileListThirdPartyCertificationSrc = $.trim($("#imgfileListThirdPartyCertification").attr("src")); // 第三方证明 图片完整路径
    var imgfileListThirdPartyCertificationName = $.trim($("#imgfileListThirdPartyCertification").attr("filename")); // 第三方证明 图片名

    var imgfileListCertificationMaterialsOfOtherMicroAndSmallMerchants = $.trim($("#imgfileListCertificationMaterialsOfOtherMicroAndSmallMerchants").attr("route")); // 其它微小型商户证明材料
    var imgfileListCertificationMaterialsOfOtherMicroAndSmallMerchantsSrc = $.trim($("#imgfileListCertificationMaterialsOfOtherMicroAndSmallMerchants").attr("src")); // 其它微小型商户证明材料 图片完整路径
    var imgfileListCertificationMaterialsOfOtherMicroAndSmallMerchantsName = $.trim($("#imgfileListCertificationMaterialsOfOtherMicroAndSmallMerchants").attr("filename")); // 其它微小型商户证明材料 图片名

    var imgfileListPicturesOfOperatingCommodities = $.trim($("#imgfileListPicturesOfOperatingCommodities").attr("route")); // 经营商品图片--微小型商户必传
    var imgfileListPicturesOfOperatingCommoditiesSrc = $.trim($("#imgfileListPicturesOfOperatingCommodities").attr("src")); // 经营商品图片--微小型商户必传 图片完整路径
    var imgfileListPicturesOfOperatingCommoditiesName = $.trim($("#imgfileListPicturesOfOperatingCommodities").attr("filename")); //经营商品图片--微小型商户必传 图片名

    // 注册类型  00企业商户  01个人商户  02小微商户
    var merType = $.trim($("input[id='merType']").attr("data-id"));
    var merTypeName = $.trim($("input[id='merType']").val());
    if ($(".merTypeSelect").length != 0) {
        merType = $.trim($(".merTypeSelect").val());
        merTypeName = $.trim($(".merTypeSelect").find("option:selected").text());
    }
    /*// 证件类型（是否为三证合一） 0：否 1：是
        var certificateType=$.trim($("span[id='certificateType'].active").attr('value'));*/
    // 注册类型  0 个人账号  1企业账号
    var bankAcctType = $.trim($("input[id='bankAcctType']").attr("data-id"));
    var bankAcctTypeName = $.trim($("input[id='bankAcctType']").val());
    if ($(".bankAcctTypeSelect").length != 0) {
        bankAcctType = $.trim($(".bankAcctTypeSelect").val());
        bankAcctTypeName = $(".bankAcctTypeSelect").find("option:selected").text();
    }
    // 统一社会信用代码
    var socialCode = $.trim($("input[id='creditcode']").val());

    // 营业执照注册号
    var businessLicense = $.trim($("input[id='licenseregistrationnumber']").val());
    // 营业执照有效期
    var businessDate = $.trim($("span[id='d1']").text());
    // 组织机构代码
    var organizingCode = $.trim($("input[class='organizationCode']").val());
    // 组织机构代码有效期
    var organizingDate = $.trim($("span[id='d2']").text());
    // 纳税人识别码
    var ratepayerCode = $.trim($("input[class='identificationcode']").val());
    // 商标类型    0：自有商标     1：授权商标
    var trademarkType = $.trim($("span[id='trademarkregistrationtype'].active").attr("value"));

    // 品牌授权截止日期
    var authorizationDate = $.trim($("span[id='d5']").text());
    // 税务登记证发证日期
    var taxregistrationDate = $.trim($("span[id='taxregistrationDate']").text());
    // 省
    var shopProvinceId = $.trim($(".region_box .region.setup2 li").eq(0).attr("data-id"));
    var shopProvince = $.trim($(".region_box .region.setup2 li").eq(0).attr("data-value"));
    //市
    var shopCityId = $.trim($(".region_box .region.setup2 li").eq(1).attr("data-id"));
    var shopCity = $.trim($(".region_box .region.setup2 li").eq(1).attr("data-value"));
    //区镇
    var shopAreaId = $.trim($(".region_box .region.setup2 li").eq(2).attr("data-id"));
    var shopArea = $.trim($(".region_box .region.setup2 li").eq(2).attr("data-value"));

    //营业执照
    var imgfileList2 = $.trim($("#imgfileList2").attr("route")); //营业执照 路径
    var imgfileList2Src = $.trim($("#imgfileList2").attr("src")); //营业执照 图片完整路径
    var imgfileList2Name = $.trim($("#imgfileList2").attr("filename")); //营业执照 图片名

    //开户许可证/银行卡照
    var imgfileList78 = $.trim($("#imgfileList78").attr("route")); //开户许可证/银行卡照 路径
    var imgfileList78Src = $.trim($("#imgfileList78").attr("src")); //开户许可证/银行卡照 图片完整路径
    var imgfileList78Name = $.trim($("#imgfileList78").attr("filename")); //开户许可证/银行卡照 图片名

    //收银台照
    var imgfileListF1 = $.trim($("#imgfileListF1").attr("route")); //收银台照 路径
    var imgfileListF1Src = $.trim($("#imgfileListF1").attr("src")); //收银台照 图片完整路径
    var imgfileListF1Name = $.trim($("#imgfileListF1").attr("filename")); //收银台照 图片名

    //经营场景照片
    var imgfileList24 = $.trim($("#imgfileList24").attr("route")); //经营场景照片 路径
    var imgfileList24Src = $.trim($("#imgfileList24").attr("src")); //经营场景照片 图片完整路径
    var imgfileList24Name = $.trim($("#imgfileList24").attr("filename")); //经营场景照片 图片名

    //门店照片
    var imgfileList79 = $.trim($("#imgfileList79").attr("route")); //门店照片 路径
    var imgfileList79Src = $.trim($("#imgfileList79").attr("src")); //门店照片 图片完整路径
    var imgfileList79Name = $.trim($("#imgfileList79").attr("filename")); //门店照片 图片名
    //商标注册证书


    //商标转让证明
    var imgfileListE1 = $.trim($("#imgfileListE1").attr("route")); //门店照片 路径
    var imgfileListE1Src = $.trim($("#imgfileListE1").attr("src")); //门店照片 图片完整路径
    var imgfileListE1Name = $.trim($("#imgfileListE1").attr("filename")); //门店照片 图片名

    //法人手持证件
    var imgfileListZ1 = $.trim($("#imgfileListZ1").attr("route")); //法人手持证件 路径
    var imgfileListZ1Src = $.trim($("#imgfileListZ1").attr("src")); //法人手持证件 图片完整路径
    var imgfileListZ1Name = $.trim($("#imgfileListZ1").attr("filename")); //法人手持证件 图片名


    //组织机构
    var imgfileListN1 = $.trim($("#imgfileListN1").attr("route")); //组织机构 路径
    var imgfileListN1Src = $.trim($("#imgfileListN1").attr("src")); //组织机构 图片完整路径
    var imgfileListN1Name = $.trim($("#imgfileListN1").attr("filename")); //组织机构 图片名

    //商标
    var imgfileListN3 = $.trim($("#imgfileListN3").attr("route")); //商标 路径
    var imgfileListN3Src = $.trim($("#imgfileListN3").attr("src")); //商标 图片完整路径
    var imgfileListN3Name = $.trim($("#imgfileListN3").attr("filename")); //商标 图片名

    //税务登记证明
    var imgfileListN2 = $.trim($("#imgfileList2N").attr("route")); // 税务登记证明 路径
    var imgfileListN2Src = $.trim($("#imgfileList2N").attr("src")); // 税务登记证明 图片完整路径
    var imgfileListN2Name = $.trim($("#imgfileList2N").attr("filename")); // 税务登记证明 图片名


    //商标注册证书
    var imgfileList4 = getPictureUploadData(1);
    if (imgfileList4 != null && imgfileList4.length > 0) {
        bsInfoLocal.imgfileList4 = imgfileList4;
    }

    //品牌商标注册证书和销售授权证书
    var imgfileListX1 = getPictureUploadData(2);
    if (imgfileListX1 != null && imgfileListX1.length > 0) {
        bsInfoLocal.imgfileListX1 = imgfileListX1;
    }

    var imgfileListE1 = getPictureUploadData(6);
    if (imgfileListE1 != null && imgfileListE1.length > 0) {
        bsInfoLocal.imgfileListE1 = imgfileListE1;
    }
    //产品质检报告
    var imgfileListC1 = getPictureUploadData(3);
    if (imgfileListC1 != null && imgfileListC1.length > 0) {
        bsInfoLocal.imgfileListC1 = imgfileListC1;
    }

    //报关单、进口货物检验检疫证明
    var imgfileListJ1 = getPictureUploadData(4);
    if (imgfileListJ1 != null && imgfileListJ1.length > 0) {
        bsInfoLocal.imgfileListJ1 = imgfileListJ1;
    }

    //行业资质
    var imgfileListH1 = getPictureUploadData(5);
    if (imgfileListH1 != null && imgfileListH1.length > 0) {
        bsInfoLocal.imgfileListH1 = imgfileListH1;
    }


    var enterpriseName = $.trim($("input[id='enterpriseName']").val()); //企业名称

    var enterpriseAddress = $.trim($("input[class='enterpriseAddress']").val()); //企业详细地址
    var actualAddress = $.trim($("input[class='actualAddress']").val()); //实际经营地址
    var invitSeq = $.trim($("input[id='invitSeq']").val()); //邀请人seq
    var trademarkCode;
    var trademarkDate;
    var imgfileListE1 = $.trim($("#imgfileListE1").attr("route")); //授权证书 路径
    var imgfileListE1Name = $.trim($("#imgfileListE1").attr("filename")); //授权证书 图片完整路径
    var imgfileListE1Src = $.trim($("#imgfileListE1").attr("src")); //授权证书 图片名
    var imgfileListI1 = $.trim($("#imgfileListI1").attr("route")); //室内照片 路径
    var imgfileListI1Name = $.trim($("#imgfileListI1").attr("filename")); //室内照片 图片完整路径
    var imgfileListI1Src = $.trim($("#imgfileListI1").attr("src")); //室内照片 图片名

    var bankTypeId = $.trim($("input[class='bankTypeId']").val()); // 银行卡类型
    var bankUser = $.trim($("input[id='bankUser']").val()); // 持卡人
    var bankCard = $.trim($("input[name='bankCard']").val()); // 银行卡账号
    var bankNo = $.trim($("input[id='bankNo']").val()); // 开户支行code
    var bankName = $.trim($("input[id='bankName']").val()); // 开户支行名称
    var socialCode = $.trim($("input[id='socialCode']").val()); // 统一社会信用代码
    // 统一社会信用代码开始时间
    var socialCodesStart = $.trim($("input[id='socialCodesStart']").val());
    // 统一社会信用代码结束时间
    var socialCodeEnd = $.trim($("input[id='socialCodeEnd']").val());
    var bsInfo = {};
    if (bsInfoLocal != null) {
        bsInfo = bsInfoLocal;
    }
    if (backGroundObjectId != "") {
        bsInfo.backGroundObjectId = backGroundObjectId;
    }
    if (enterpriseName != "") {
        bsInfo.enterpriseName = enterpriseName; //企业名称
    }
    if (storeName != "") {
        bsInfo.storeName = storeName; //店铺名称
    }
    if (storeType != "") {
        bsInfo.storeType = storeType; //店铺类型Id
    }
    if (storeTypeName != "") {
        bsInfo.storeTypeName = storeTypeName; //店铺类型
    }
    if (operateType != "") {
        bsInfo.operateType = operateType; //经营类型
    }
    if (storeBrand != "") {
        bsInfo.storeBrand = storeBrand; //店铺品牌
    }
    if (province != "" && provinceId != "") {
        var provinceObj = {
            "id": provinceId,
            "name": province
        }
        bsInfo.province = provinceObj; //省
    }

    if (city != "" && cityId != "") {
        var cityObj = {
            "id": cityId,
            "name": city
        }
        bsInfo.city = cityObj; //市
    }
    if (area != "" && areaId != "") {
        var areaObj = {
            "id": areaId,
            "name": area
        }
        bsInfo.area = areaObj; //区县
    }
    if (street != "" && streetId != "") {
        var streetObj = {
            "id": streetId,
            "name": street
        }
        // bsInfo.street = streetObj; //街道
        bsInfo.street = {}; //街道
    }
    if (invitSeq != "") {
        bsInfo.invitSeq = invitSeq; //邀请人seq
    }
    //注册类型  00：企业商户  01：个体工商户  02：个人商户
    if (merType != "") {
        bsInfo.merType = merType;
    }
    if (merTypeName != "") {
        bsInfo.merTypeName = merTypeName;
    }
    //注册类型  0 个人账号  1企业账号
    if (bankAcctType != "") {
        bsInfo.bankAcctType = bankAcctType;
    }
    if (bankAcctTypeName != "") {
        bsInfo.bankAcctTypeName = bankAcctTypeName;
    }
    if (shopProvince != "" && shopProvinceId != "") {
        var shopProvinceObj = {
            "id": shopProvinceId,
            "name": shopProvince
        }
        bsInfo.shopProvince = shopProvinceObj; //支行所在省份
    }
    if (shopCity != "" && shopCityId != "") {
        var shopCityObj = {
            "id": shopCityId,
            "name": shopCity
        }
        bsInfo.shopCity = shopCityObj; //支行所在市
    }

    if (shopArea != "" && shopAreaId != "") {
        var shopAreaObj = {
            "id": shopAreaId,
            "name": shopArea
        }
        bsInfo.shopArea = shopAreaObj; //支行所在县区
    }

    if (road != "") {
        bsInfo.road = road; //营业地址路名
    }
    if (houseNo != "") {
        bsInfo.houseNo = houseNo; //营业地址路名
    }
    if (addrExt != "") {
        bsInfo.addrExt = addrExt; //营业地址补充信息
    }
    if (linkName != "") {
        bsInfo.linkName = linkName; //联系人
    }
    if (linkMobile != "") {
        bsInfo.linkMobile = linkMobile; //联系人手机号
    }
    if (legalName != "") {
        bsInfo.legalName = legalName; //法人身份证
    }
    if (idCard != "") {
        bsInfo.idCard = idCard; //法人身份证
    }
    if (idCardStart != "") {
        bsInfo.idCardStart = idCardStart; //身份证开始时间
    }
    if (idCardEnd != "") {
        bsInfo.idCardEnd = idCardEnd; //身份结束时间
    }
    if (mobile != "") {
        bsInfo.mobile = mobile; //法人手机号码
    }
    if (custName != "") {
        bsInfo.custName = custName; //店铺管理人姓名
    }
    if (custEmail != "") {
        bsInfo.custEmail = custEmail; //店铺管理人邮箱
    }
    if (custPhone != "") {
        bsInfo.custPhone = custPhone; //店铺管理人手机号
    }
    if (socialCode != "") {
        bsInfo.socialCode = socialCode; //统一社会信用代码
    }
    if (socialCodesStart != "") {
        bsInfo.socialCodesStart = socialCodesStart;
    }

    if (socialCodeEnd != "") {
        bsInfo.socialCodeEnd = socialCodeEnd;
    }
    if (imgfileList57 != "" && imgfileList57Src != "" && imgfileList57Name != "") {
        var imgfileList57Arr = []
        var imgfileList57Obj = {
            "path": imgfileList57,
            "name": imgfileList57Name,
            "src": imgfileList57Src
        }
        imgfileList57Arr.push(imgfileList57Obj)
        bsInfo.imgfileList57 = imgfileList57Arr; //法人证件(正面照)  图片路径
    }
    if (imgfileList58 != "" && imgfileList58Name != "" && imgfileList58Src != "") {
        var imgfileList58Arr = []
        var imgfileList58Obj = {
            "path": imgfileList58,
            "name": imgfileList58Name,
            "src": imgfileList58Src
        }
        imgfileList58Arr.push(imgfileList58Obj)
        bsInfo.imgfileList58 = imgfileList58Arr; //法人证件(国徽面)  图片路径
    }


    /*微小型商户五张至少传一张*/
    if (imgfileListLeasingAgreement != "" && imgfileListLeasingAgreementSrc != "" && imgfileListLeasingAgreementName != "") {
        var imgfileListLeasingAgreementArr = []
        var imgfileListLeasingAgreementObj = {
            "path": imgfileListLeasingAgreement,
            "name": imgfileListLeasingAgreementName,
            "src": imgfileListLeasingAgreementSrc
        }
        imgfileListLeasingAgreementArr.push(imgfileListLeasingAgreementObj)
        bsInfo.imgfileListLeasingAgreement = imgfileListLeasingAgreementArr; //租赁协议  图片路径
    }
    if (imgfileListSecurities != "" && imgfileListSecuritiesSrc != "" && imgfileListSecuritiesName != "") {
        var imgfileListSecuritiesArr = []
        var imgfileListSecuritiesObj = {
            "path": imgfileListSecurities,
            "name": imgfileListSecuritiesName,
            "src": imgfileListSecuritiesSrc
        }
        imgfileListSecuritiesArr.push(imgfileListSecuritiesObj)
        bsInfo.imgfileListSecurities = imgfileListSecuritiesArr; //产权证明  图片路径
    }
    if (imgfileListQualificationCertificate != "" && imgfileListQualificationCertificateSrc != "" && imgfileListQualificationCertificateName != "") {
        var imgfileListQualificationCertificateArr = []
        var imgfileListQualificationCertificateObj = {
            "path": imgfileListQualificationCertificate,
            "name": imgfileListQualificationCertificateName,
            "src": imgfileListQualificationCertificateSrc
        }
        imgfileListQualificationCertificateArr.push(imgfileListQualificationCertificateObj)
        bsInfo.imgfileListQualificationCertificate = imgfileListQualificationCertificateArr; //执业资质证照  图片路径
    }
    if (imgfileListThirdPartyCertification != "" && imgfileListThirdPartyCertificationSrc != "" && imgfileListThirdPartyCertificationName != "") {
        var imgfileListThirdPartyCertificationArr = []
        var imgfileListThirdPartyCertificationObj = {
            "path": imgfileListThirdPartyCertification,
            "name": imgfileListThirdPartyCertificationName,
            "src": imgfileListThirdPartyCertificationSrc
        }
        imgfileListThirdPartyCertificationArr.push(imgfileListThirdPartyCertificationObj)
        bsInfo.imgfileListThirdPartyCertification = imgfileListThirdPartyCertificationArr; //第三方证明  图片路径
    }
    if (imgfileListCertificationMaterialsOfOtherMicroAndSmallMerchants != "" && imgfileListCertificationMaterialsOfOtherMicroAndSmallMerchantsSrc != "" && imgfileListCertificationMaterialsOfOtherMicroAndSmallMerchantsName != "") {
        var imgfileListCertificationMaterialsOfOtherMicroAndSmallMerchantsArr = []
        var imgfileListCertificationMaterialsOfOtherMicroAndSmallMerchantsObj = {
            "path": imgfileListCertificationMaterialsOfOtherMicroAndSmallMerchants,
            "name": imgfileListCertificationMaterialsOfOtherMicroAndSmallMerchantsName,
            "src": imgfileListCertificationMaterialsOfOtherMicroAndSmallMerchantsSrc
        }
        imgfileListCertificationMaterialsOfOtherMicroAndSmallMerchantsArr.push(imgfileListCertificationMaterialsOfOtherMicroAndSmallMerchantsObj)
        bsInfo.imgfileListCertificationMaterialsOfOtherMicroAndSmallMerchants = imgfileListCertificationMaterialsOfOtherMicroAndSmallMerchantsArr; //其它微小型商户证明材料  图片路径
    }
    if (imgfileListPicturesOfOperatingCommodities != "" && imgfileListPicturesOfOperatingCommoditiesSrc != "" && imgfileListPicturesOfOperatingCommoditiesName != "") {
        var imgfileListPicturesOfOperatingCommoditiesArr = []
        var imgfileListPicturesOfOperatingCommoditiesObj = {
            "path": imgfileListPicturesOfOperatingCommodities,
            "name": imgfileListPicturesOfOperatingCommoditiesName,
            "src": imgfileListPicturesOfOperatingCommoditiesSrc
        }
        imgfileListPicturesOfOperatingCommoditiesArr.push(imgfileListPicturesOfOperatingCommoditiesObj)
        bsInfo.imgfileListPicturesOfOperatingCommodities = imgfileListPicturesOfOperatingCommoditiesArr; //经营商品图片--微小型商户必传  图片路径
    }

    if (enterpriseAddress != "") {
        bsInfo.enterpriseAddress = enterpriseAddress; //企业详细地址
    }
    if (actualAddress != "") {
        bsInfo.actualAddress = actualAddress; //实际经营地址
    }
    if (socialCode != "") {
        bsInfo.socialCode = socialCode; //统一社会信用代码
    }
    if (businessLicense != "") {
        bsInfo.businessLicense = businessLicense; //营业执照注册号
    }
    if (businessDate != "") {
        bsInfo.businessDate = businessDate; //营业执照有效期
    }
    if (organizingCode != "") {
        bsInfo.organizingCode = organizingCode; //组织机构代码
    }
    if (organizingDate != "") {
        bsInfo.organizingDate = organizingDate; //组织机构代码有效期
    }
    if (ratepayerCode != "") {
        bsInfo.ratepayerCode = ratepayerCode; //纳税人识别码
    }
    /*if(trademarkType != ""){
        bsInfo.trademarkType = trademarkType;//商标类型    0：自有商标     1：授权商标
    }*/
    if (trademarkCode != "") {
        bsInfo.trademarkCode = trademarkCode; //商标注册号
    }
    if (trademarkDate != "") {
        bsInfo.trademarkDate = trademarkDate; //商标注册期
    }
    if (authorizationDate != "") {
        bsInfo.authorizationDate = authorizationDate; //品牌授权截止日期
    }
    if (taxregistrationDate != "") {
        bsInfo.taxregistrationDate = taxregistrationDate; //品牌授权截止日期
    }

    if (mailUser != "") {
        bsInfo.mailUser = mailUser; //邮寄联系人
    }
    if (mailMobile != "") {
        bsInfo.mailMobile = mailMobile; //邮寄联系人手机号
    }
    if (mailAddress != "") {
        bsInfo.mailAddress = mailAddress; //邮寄地址
    }
    if (mailUser != "") {
        bsInfo.mailUser = mailUser; //邮寄联系人手机号
    }
    /*if(bankAddress != ""){
        bsInfo.bankAddress = bankAddress;//开卡支行
    }*/
    if (legalName != "") {
        bsInfo.legalName = legalName; //法人姓名
    }
    if (legalEmail != "") {
        bsInfo.legalEmail = legalEmail; //法人邮箱
    }
    if (bankCard != "") {
        bsInfo.bankCard = bankCard; //银行卡号
    }
    if (bankTypeId != "") {
        bsInfo.bankTypeId = bankTypeId; //银行卡类型
    }
    if (bankUser != "") {
        bsInfo.bankUser = bankUser; //持卡人
    }
    if (bankNo != "") {
        bsInfo.bankNo = bankNo; //开户支行code
    }
    if (bankName != "") {
        bsInfo.bankName = bankName; //开户支行名称
    }
    if (proofCode != "") {
        bsInfo.proofCode = proofCode; //短信验证码
    }
    if (verifyCode != "") {
        bsInfo.verifyCode = verifyCode; //图形验证码
    }
    if (shareSeq != "") {
        bsInfo.shareSeq = shareSeq; //分享人
    }

    if (imgfileList2 != "" && imgfileList2Name != "" && imgfileList2Src != "") {
        var imgfileList2Arr = []
        var imgfileList2Obj = {
            "path": imgfileList2,
            "name": imgfileList2Name,
            "src": imgfileList2Src
        }
        imgfileList2Arr.push(imgfileList2Obj)
        bsInfo.imgfileList2 = imgfileList2Arr; //营业执照图片路径
    }
    //开户行许可证路径
    if (imgfileList78 != "" && imgfileList78Name != "" && imgfileList78Src != "") {
        var imgfileList78Arr = []
        var imgfileList78Obj = {
            "path": imgfileList78,
            "name": imgfileList78Name,
            "src": imgfileList78Src
        }
        imgfileList78Arr.push(imgfileList78Obj)
        bsInfo.imgfileList78 = imgfileList78Arr;
    }

    if (imgfileListF1 != "" && imgfileListF1Name != "" && imgfileListF1Src != "") {
        var imgfileListF1Arr = []
        var imgfileListF1Obj = {
            "path": imgfileListF1,
            "name": imgfileListF1Name,
            "src": imgfileListF1Src
        }
        imgfileListF1Arr.push(imgfileListF1Obj)
        bsInfo.imgfileListF1 = imgfileListF1Arr; //收银台照
    }
    //经营场景照片
    if (imgfileList24 != "" && imgfileList24Name != "" && imgfileList24Src != "") {
        var imgfileList24Arr = []
        var imgfileList24Obj = {
            "path": imgfileList24,
            "name": imgfileList24Name,
            "src": imgfileList24Src
        }
        imgfileList24Arr.push(imgfileList24Obj)
        bsInfo.imgfileList24 = imgfileList24Arr;
    }

    //门店照片
    if (imgfileList79 != "" && imgfileList79Name != "" && imgfileList79Src != "") {
        var imgfileList79Arr = []
        var imgfileList79Obj = {
            "path": imgfileList79,
            "name": imgfileList79Name,
            "src": imgfileList79Src
        }
        imgfileList79Arr.push(imgfileList79Obj)
        bsInfo.imgfileList79 = imgfileList79Arr;
    }

    //法人手持证件
    if (imgfileListZ1 != "" && imgfileListZ1Name != "" && imgfileListZ1Src != "") {
        var imgfileListZ1Arr = []
        var imgfileListZ1Obj = {
            "path": imgfileListZ1,
            "name": imgfileListZ1Name,
            "src": imgfileListZ1Src
        }
        imgfileListZ1Arr.push(imgfileListZ1Obj)
        bsInfo.imgfileListZ1 = imgfileListZ1Arr;
    }

    if (imgfileListN1 != "" && imgfileListN1Name != "" && imgfileListN1Src != "") {
        var imgfileListN1Arr = []
        var imgfileListN1Obj = {
            "path": imgfileListN1,
            "name": imgfileListN1Name,
            "src": imgfileListN1Src
        }
        imgfileListN1Arr.push(imgfileListN1Obj)
        bsInfo.imgfileListN1 = imgfileListN1Arr; //组织代码机构证路径
    }
    if (imgfileListN2 != "" && imgfileListN2Name != "" && imgfileListN2Src != "") {
        var imgfileListN2Arr = []
        var imgfileListN2Obj = {
            "path": imgfileListN2,
            "name": imgfileListN2Name,
            "src": imgfileListN2Src
        }
        imgfileListN2Arr.push(imgfileListN2Obj)
        bsInfo.imgfileListN2 = imgfileListN2Arr; //税务登记证明路径
    }

    if (imgfileListN3 != "" && imgfileListN3Name != "" && imgfileListN3Src != "") {
        var imgfileListN3Arr = []
        var imgfileListN3Obj = {
            "path": imgfileListN3,
            "name": imgfileListN3Name,
            "src": imgfileListN3Src
        }
        imgfileListN3Arr.push(imgfileListN3Obj)
        bsInfo.imgfileListN3 = imgfileListN3Arr; //品牌授权证明路径
    }

    if (imgfileListE1 != "" && imgfileListE1Name != "" && imgfileListE1Src != "") {
        var imgfileListE1Arr = []
        var imgfileListE1Obj = {
            "path": imgfileListE1,
            "name": imgfileListE1Name,
            "src": imgfileListE1Src
        }
        imgfileListE1Arr.push(imgfileListE1Obj)
        bsInfo.imgfileListE1 = imgfileListE1Arr; //授权证书
    }
    if (imgfileListI1 != "" && imgfileListI1Name != "" && imgfileListI1Src != "") {
        var imgfileListI1Arr = []
        var imgfileListI1Obj = {
            "path": imgfileListI1,
            "name": imgfileListI1Name,
            "src": imgfileListI1Src
        }
        imgfileListI1Arr.push(imgfileListI1Obj)
        bsInfo.imgfileListI1 = imgfileListI1Arr; //室内照片
    }

    if (businessType != "") {
        bsInfo.businessType = businessType; //营业执照类型
    }
    if (reservePhone != "") {
        bsInfo.reservePhone = reservePhone; //预留手机号
    }

    if (legalSexType != "") {
        bsInfo.legalSexType = legalSexType; //法人性别
    }
    if (legalOccupation != "") {
        bsInfo.legalOccupation = legalOccupation; //法人职业
    }
    if (mccCode != "") {
        bsInfo.mccCode = mccCode; //行业类别名称
    }
    if (mccCodeName != "") {
        bsInfo.mccCodeName = mccCodeName; //行业类别名称
    }
    if (havingFixedBusiAddr != "") {
        bsInfo.havingFixedBusiAddr = havingFixedBusiAddr; //是否有营业场所
    }
    return bsInfo;
}
// //隐藏入驻类型 非必要信息
function merTypeNeedData(merType) {

    var text;
    var font;
    var textPlaceholder;
    var fontPlaceholder;
    var merTypeName;
    var bankAcctTypeData1;
    var bankAcctTitle;
    $(".bankAcctTypeSelect").html("");
    if (merType == merTypePersonal) {
        merTypeName = "个体工商户";
        var text = "账号（私账）";
        $(".legalSexType").hide();
        $(".legalOccupation").hide();
        $(".havingFixedBusiAddr").hide();
        $(".merType0").hide();
        $(".imgfileList2").show();
        $(".merType1").show();
        $(".facePublic").show();
        $(".miniShop").hide();
        getMccCode(1);

        textPlaceholder = "请填写法人银行卡号";
        fontPlaceholder = "请填写法人银行卡户名";
        bankAcctTitle = "个人银行卡";
        $(".bankAcctTypeSelect").append("<option value='0'>个人账户</option>");
        $(".bankAcctTypeSelect").append("<option value='1'>公司账户</option>");
        bankAcctTypeData1 = [{
                "value": "0",
                "text": "个人账户"
            },
            {
                "value": "0",
                "text": "个人账户"
            },
            {
                "value": "1",
                "text": "公司账户"
            }
        ]
    } else if (merType == merTypesmall) {
        var text = "账号（私账）";
        merTypeName = "个人商户";
        $(".merType0").hide();
        $(".imgfileList2").hide();
        $(".merType1").show();
        $(".legalOccupation").show();
        $(".facePublic").hide();
        $("#enterpriseName").val("");
        $("#socialCode").val("");
        $(".miniShop").show();
        getMccCode(2);

        textPlaceholder = "请填写银行卡号";
        fontPlaceholder = "请填写银行卡户名";
        bankAcctTitle = "个人银行卡";
        /*显示必填项和提示*/
        $(".legalSexType").show();
        $(".legalOccupation").show();
        $(".havingFixedBusiAddr").show();
        

        $(".bankAcctTypeSelect").append("<option value='0'>个人账户</option>");
        bankAcctTypeData1 = [{
                "value": "0",
                "text": "个人账户"
            },
            {
                "value": "0",
                "text": "个人账户"
            }
        ];
    } else {
        var text = "账号（公账）";
        merTypeName = "企业商户";
        $(".legalSexType").hide();
        $(".legalOccupation").hide();
        $(".havingFixedBusiAddr").hide();
        $(".merType0").show();
        $(".merType1").hide();
        $(".imgfileList2").show();
        $(".facePublic").show();
        $(".miniShop").hide();
        getMccCode(1);

        textPlaceholder = "请填写对公账号";
        fontPlaceholder = "请填写对公户名";
        bankAcctTitle = "银行开户许可证";
        $(".bankAcctTypeSelect").append("<option value='1'>公司账户</option>");
        bankAcctTypeData1 = [{
                "value": "1",
                "text": "公司账户"
            },
            {
                "value": "1",
                "text": "公司账户"
            }
        ];
    }
    $("input[name='mccCode']").attr("data-id", "");
    $("input[name='mccCode']").val("");
    $("input[class='merType']").attr("data-id", merType);
    $("input[class='merType']").val(merTypeName);
    $("input[id='bankAcctType']").attr("data-id", bankAcctTypeData1[0].value);
    $("input[id='bankAcctType']").val(bankAcctTypeData1[0].text);
    $('.bankAccitle').html(bankAcctTitle + "<span style=\"color: red\">*</span>");
    $('.account').html(text + "<span style=\"color: red\">*</span>");

    $("#bankCard").attr("placeholder", textPlaceholder)
    $("#bankUser").attr("placeholder", fontPlaceholder)
    $(".merTypeSelect option:contains('" + merTypeName + "')").prop("selected", true);
    if (pickerBankAcctType) {
        pickerBankAcctType.bindData(0, bankAcctTypeData1);
    }
}
//隐藏入驻类型 非必要信息
function bankAcctTypeNeedData(type) {
    var bankAcctType1;
    var bankAcctTitle1;
    var text1;
    var font1;
    var textPlaceholder1;
    var fontPlaceholder1;

    if (type == "0") {
        bankAcctType1 = "个人账号";
        $(".imgfileList2").show();
        textPlaceholder1 = "请填写法人银行卡号"
        fontPlaceholder1 = "请填写法人银行卡户名"
        bankAcctTitle1 = "个人银行卡"
    } else {
        bankAcctType1 = "企业账号";
        $(".imgfileList2").show();


        textPlaceholder1 = "请填写对公账号"
        fontPlaceholder1 = "请填写对公户名"
        bankAcctTitle1 = "银行开户许可证"
    }
    $('.bankAcctTitle').html(bankAcctTitle1 + "<span style=\"color: red\">*</span>");
    $("input[id='bankAcctType']").val(bankAcctType1);
    $("input[id='bankAcctType']").attr("data-id", type);
    $(".bankAcctTypeSelect option:contains('" + bankAcctType1 + "')").prop("selected", true)

}

function submitCompanyInfo(brandSquareSupplierInfo) {

    if (userType == 1) {
        brandSquareSupplierInfo.merType = '00';
    } else if (userType == 2) {
        brandSquareSupplierInfo.merType = '01';
    } else if (userType == 3) {
        brandSquareSupplierInfo.merType = '02';
        brandSquareSupplierInfo.businessType = "2";
    }

    brandSquareSupplierInfo.seq = seq;


    if (brandSquareSupplierInfo.temp != "1") {

        if (brandSquareSupplierInfo.isSubmit == "1") {
            if (!validateInfo1(getViewdata({}))) {
                return;
            }
            //临时存储
            $(".step-1").hide();
            $(".step-2").show();
            $(".step-3").hide();
            $(".step-4").hide();
            window.scrollTo(0, 0);
            return;
        } else if (brandSquareSupplierInfo.isSubmit == "2") {
            if (!validateInfo2(getViewdata({}))) {
                return;
            }
            $(".step-1").hide();
            $(".step-2").hide();
            $(".step-3").show();
            $(".step-4").hide();
            window.scrollTo(0, 0);
            return;

        } else if (brandSquareSupplierInfo.isSubmit == "3") {
            if (!validateInfo3(getViewdata({}))) {
                return;
            }
            $(".step-1").hide();
            $(".step-2").hide();
            $(".step-3").hide();
            $(".step-4").show();
            window.scrollTo(0, 0);
            return;

        } else if (!validateInfo4(getViewdata({}))) {
            return;
        }

        loadingdate("保存中,请稍后...");
    }
    console.log(brandSquareSupplierInfo, '55')
    $.ajax({
        type: "POST",
        url: "/localQuickPurchase/brandSquare/v2/save",
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        data: JSON.stringify(brandSquareSupplierInfo),
        async: true,
        success: function (data) {
            if (data.code == 200) {
                clearLoading();
                var path = data.data.path;
                var password = data.data.password;
                var name = data.data.name;
                //提交移除缓存数据
                localStorage.removeItem("brandSquareSupplierInfo");
                window.location.href = "/localQuickPurchase/distributionVA/brandSquare/supplierRegisterMsg?admissionName=" + name + "&password=" + password + "&path=" + path;
            } else if (data.code == 201) {
                clearLoading();
                hui.toast("请填写完所有栏目!");
            } else if (data.code == 1000) {

            } else {
                clearLoading();
                hui.toast(data.message, 2000);
            }
        },
        error: function (respone) {
            clearLoading()
        }
    });
}

//时间控件
function datepicker(id1, id2) {
    var selectDateDom = $(id1);
    var showDateDom = $(id2);
    // 初始化时间
    var now = new Date();
    var nowYear = now.getFullYear();
    var nowMonth = now.getMonth() + 1;
    var nowDate = now.getDate();
    showDateDom.attr('data-year', nowYear);
    showDateDom.attr('data-month', nowMonth);
    showDateDom.attr('data-date', nowDate);
    // 数据初始化
    function formatYear(nowYear) {
        var arr = [];
        for (var i = nowYear - 5; i <= nowYear + 5; i++) {
            arr.push({
                id: i + '',
                value: i + '年'
            });
        }
        return arr;
    }

    function formatMonth() {
        var arr = [];
        for (var i = 1; i <= 12; i++) {
            arr.push({
                id: i + '',
                value: i + '月'
            });
        }
        return arr;
    }

    function formatDate(count) {
        var arr = [];
        for (var i = 1; i <= count; i++) {
            arr.push({
                id: i + '',
                value: i + '日'
            });
        }
        return arr;
    }
    var yearData = function (callback) {
        callback(formatYear(nowYear))
    }
    var monthData = function (year, callback) {
        callback(formatMonth());
    };
    var dateData = function (year, month, callback) {
        if (/^(1|3|5|7|8|10|12)$/.test(month)) {
            callback(formatDate(31));
        } else if (/^(4|6|9|11)$/.test(month)) {
            callback(formatDate(30));
        } else if (/^2$/.test(month)) {
            if (year % 4 === 0 && year % 100 !== 0 || year % 400 === 0) {
                callback(formatDate(29));
            } else {
                callback(formatDate(28));
            }
        } else {
            throw new Error('month is illegal');
        }
    };
    var oneLevelId = showDateDom.attr('data-year');
    var twoLevelId = showDateDom.attr('data-month');
    var threeLevelId = showDateDom.attr('data-date');
    var iosSelect = new IosSelect(3,
        [yearData, monthData, dateData], {
            title: '日期选择',
            itemHeight: 35,
            oneLevelId: oneLevelId,
            twoLevelId: twoLevelId,
            threeLevelId: threeLevelId,
            showLoading: false,
            callback: function (selectOneObj, selectTwoObj, selectThreeObj) {
                showDateDom.attr('data-year', selectOneObj.id);
                showDateDom.attr('data-month', selectTwoObj.id);
                showDateDom.attr('data-date', selectThreeObj.id);
                showDateDom.html(selectOneObj.value + selectTwoObj.value + selectThreeObj.value);
            }
        });
}
//获取验证码
$('body').on('click', '#code', function () {
    var element = $(this);
    var sendState = element.attr("sendState");
    if (sendState == 0) {
        return;
    }
    element.attr("sendState", "0");
    //倒计时
    var smsTime = addCountdown(element);
    var verifyCode = $("#verifyCode").val();
    $.ajax({
        type: "post", // 定义提交的类型
        url: "/localQuickPurchase/brandSquare/sendCode",
        dataType: "json", // 设置返回值得类型
        data: {
            'mobile': $("input[id='custPhone']").val(),
            'type': sendCodeType,
            'verifyCode': verifyCode
        },
        async: true, // 是否异步请求，false为同步
        success: function (data) { // 成功返回值执行函数
            if (data.code == 200) {
                hui.toast(data.message);
            } else {
                hui.toast(data.message);
                element.attr("sendState", "1");
                //清除倒计时
                clearInterval(smsTime);
                element.html("重发验证码");
            }
        }
    });
})
// //手动刷新图片验证码
function refreshImgCode() {
    $("#imgCode img").attr("src", "/upms/basic/validateCode?time=" + new Date().toLocaleTimeString() + "&mobile=" + getUserName())
}
//倒计时
function addCountdown(element) {
    var $this = $(element);
    var countdown = 60;
    var smsTime = setInterval(function () {
        --countdown;
        if (countdown == 0) {
            clearInterval(smsTime);
            $this.css("color", "#f35f5f");
            $this.html("重发验证码");
            $this.removeAttr('disabled');
            $this.attr("sendState", "1");
        } else {
            $this.html(countdown + "秒后重发");
            $this.attr("sendState", "0");
        }
    }, 1000);
    return smsTime;
}
// 把获取的数组转换成h-ui picker 的类型
function getType(Arr) {
    var newArr = [];
    var obj = {};
    for (var i = 0; i < Arr.length; i++) {
        if (i == 0) {
            //占位默认显示
            obj = {
                value: Arr[i].id,
                text: Arr[i].value
            };
            newArr.push(obj);
        }

        obj = {
            value: Arr[i].id,
            text: Arr[i].value
        };
        newArr.push(obj);
    }
    return newArr;
}

// 把获取的数组转换成h-ui picker 的类型
function handleData(Arr) {
    var newArr = [];
    var obj = {};
    for (var i = 0; i < Arr.length; i++) {
        if (i == 0) {
            //占位默认显示
            obj = {
                value: Arr[i].bankNo,
                text: Arr[i].bankName
            };
            newArr.push(obj);
        }
        obj = {
            value: Arr[i].bankNo,
            text: Arr[i].bankName
        };
        newArr.push(obj);
    }
    return newArr;
}

var picker2;
try {
    picker2 = new huiPicker('.bankSearch-but', function () {
        var val = picker2.getVal(0);
        var txt = picker2.getText(0);
        if ("object" === typeof val) {
            hui.toast("支行检索失败,请重试");
            return;
        }
        hui('#bankNo').val(val);
        hui('#bankName').val(txt);
    });
} catch (e) {}

function bankSearch(obj) {
    var key = $("#bankSearch").val();
    var idx = $(".region_box2 ul.region li").length;
    //console.log(idx);
    var cityId = $('.region_box2 ul.region').children().eq(idx - 1).attr("data-id");
    if (cityId == "" || cityId == null) {
        hui.toast("请选择银行所在地区");
        huiPickerHide();
        return;
    }
    if (key == "" || key == null) {
        hui.toast("请输入检索关键字");
        huiPickerHide();
        return;
    }
    loadingdate("加载中");
    //初始刷  每次获取最新数据
    picker2.bindData(0, [])
    $.ajax({
        url: "/localQuickPurchase/brandSquare/branchBankList",
        type: "GET",
        data: {
            "cityId": cityId,
            "key": key
        },
        async: true,
        dataType: "json",
        success: function (response) {
            clearLoading();
            if (response.code == 200) {
                var listData = handleData(response.data);
                picker2.bindData(0, listData);
                picker2.pickerMain.show();
            } else {
                huiPickerHide();
                hui.toast("支行检索失败,请重试");
            }
        }
    });
}
//  1 省份 2 市区 3 地区
 
function getShopRegion(type, pid) {
    if (type >= 4 || pid == null) {
        return;
    }
    $.ajax({
        url: "/localQuickPurchase/brandSquare/shopregion",
        type: "GET",
        data: {
            "pid": pid,
            "type": type
        },
        async: true,
        dataType: "json",
        success: function (response) {
            var clazz = resetShopDate(type);
            if (response.code != 200 || type == "") {
                hui.alert("省市区初始化错误,请稍后重试");
                return;
            }
            var list = response.data;
            for (var i = 0; i < list.length; i++) {
                var listObj = list[i];
                $(".region_box2 ." + clazz).append('<li data-id="' + listObj.id + '" onclick="changeData(this,2)"> ' + listObj.value + ' </li>')
            }
        }
    });
}

function resetShopDate(type) {
    var clazz = '';
    if (type == 1) {
        clazz = "shopProvinceData";
    } else if (type == 2) {
        clazz = "shopCityData";
        $(".shopCityData").html("");
        $(".shopCityData").append('<li class="current"> 暂不选择 </li>');
        $(".shopAreaData").html("");
        $(".shopAreaData").append('<li class="current"> 暂不选择 </li>');
        $(".shopStreetData").html("");
        $(".shopStreetData").append('<li class="current"> 暂不选择 </li>');
    } else if (type == 3) {
        clazz = "shopAreaData";
        $(".shopAreaData").html("");
        $(".shopAreaData").append('<li class="current"> 暂不选择 </li>');
        $(".shopStreetData").html("");
        $(".shopStreetData").append('<li class="current"> 暂不选择 </li>');
    } else if (type == 4) {
        clazz = "shopStreetData";
        $(".shopStreetData").html("");
        $(".shopStreetData").append('<li class="current"> 暂不选择 </li>');
    }
    return clazz;
}

$("input").each(function () {
    $(this).change(function () {
        setBrandSquareSupplierInfo()
    });
});

/**
 * 上传图片时处理多图片问题
 */
function handlingImageProblems(index) {
    var _html = "";
    var className = getClassName(index);
    _html = getSuperfluousHtml(_html, index);
    $('.' + className).append(_html);
}

//图片回显 商标注册证书；2 - 商标注册和授权证书；3 - 产品质检报告；4 - 报关单；5 - 行业资质
 
function pictureEcho(picList, index) {
    var className = getClassName(index);
    var _html = '';
    if (picList != null && picList.length > 0) {
        for (var i = 0; i < picList.length; i++) {
            var src = picList[i].src;
            var imageHttp = picList[i].imageHttp;
            var name = picList[i].name;
            var path = picList[i].path;
            var srcStr = (src == undefined ? (imageHttp + path + name) : src);
            _html += '<div class="newUpload uploadbox">';
            _html += '<img class="closeimg" onclick="deleteimg(this)" src="./img/azj_mine2.png"/>'
            _html += '<div class="picbox"><img class="imgFileList picture-viewer" src="' + srcStr + '" route="' + path + '" filename="' + name + '"/></div>';
            _html += '<input type="file" accept="image/*" onchange="uploadFile(this)" class="upload-input">';
            _html += '<button class="btn"><img class="img" src="./img/azj_mine1.png"/><p>点击上传</p></button>'
            _html += '</div>';
        }
    }
    _html = getSuperfluousHtml(_html, index);
    $('.' + className).html(_html);
}

 //获取多余的一个DIV

 
function getSuperfluousHtml(_html, index) {
    var multiple = "";
    if (window.location.href.indexOf("pc") > -1 && index != 1) {
        multiple = ' multiple ="multiple "';
    }
    _html += '<div class="newUpload c5">';
    _html += '<div class="picbox"><img class="imgFileList " src="./img/1587469330.jpg" /></div>';
    _html += '<input type="file" accept="image/*" onchange="uploadFile(this,' + index + ')" class="upload-input"'

    _html += multiple + ' >';
    _html += '<button class="btn"><img class="img" src="./img/azj_mine1.png"/><p>点击上传</p></button>'
    _html += '</div>';
    return _html;
}
//获取类型
function getClassName(index) {
    var className = "";
    switch (index) {
        case 1:
            className = "uploadListOne";
            break;
        case 2:
            className = "uploadListTwo";
            break;
        case 3:
            className = "uploadListThree";
            break;
        case 4:
            className = "uploadListFour";
            break;
        case 5:
            className = "uploadListFive";
            break;
        case 6:
            className = "uploadListSix";
            break;
        default:
    }
    return className;
}
 //获取上传的图片

function getPictureUploadData(index) {
    var className = getClassName(index);
    // console.log("循环的次数：" + $('.' + className).find('.newUpload').length);
    var imgfileListArr = []
    $('.' + className).find('.newUpload').each(function (index, dom) {
        var filename = $(this).find(".picbox img").attr("filename");
        var src = $(this).find(".picbox img").attr("src");
        var route = $(this).find(".picbox img").attr("route");
        if (route != undefined && filename != undefined && src != undefined) {
            if (route != "" && filename != "" && src != "") {
                var imgfileListJ1Obj = {
                    "path": route,
                    "name": filename,
                    "src": src
                }
                imgfileListArr.push(imgfileListJ1Obj);
            }
        }
    })
    return imgfileListArr;
}

function applystatus(userName) {
    $("#custPhone").val(userName);
    $("#mailMobile").val(userName);
    $("#linkMobile").val(userName);
    $("#mobile").val(userName);
    $.ajax({
        type: "POST",
        url: "/localQuickPurchase/brandSquare/applystatus",
        data: {
            'userName': userName
        },
        dataType: 'json',
        async: true,
        success: function (data) {
            if (data.code == 200) {
                var info = data.data;
                if (info == null) {
                    sendCodeType = 2;
                    localStorage.removeItem("" +
                        "");
                    //初始化注册类型
                    initMerTypeData();
                    //初始化经营类型
                    initManagementTypeData();
                    return;
                }
                if (info.id == null) {
                    sendCodeType = 2;
                }
                var bsInfo = getBrandSquareSupplierInfo();

                if (bsInfo != null && bsInfo.loginName == info.loginName) {
                    bsInfo.backGroundObjectId = info.id;
                    reappearData(bsInfo);
                } else {
                    info.backGroundObjectId = info.id;
                    localStorage.removeItem("brandSquareSupplierInfo");
                    reappearData(info);
                    setBrandSquareSupplierInfo(info);
                }
                if (info.backGroundObjectId != null) {
                    info.proofCode = null;
                    info.verifyCode = null;
                    $("#proofCode").val("");
                    $("#verifyCode").val("");
                }
                var dstime;
                //applyStatus   00签约中  02入网审核中  03入网成功  04入网失败  05入驻成功  99其他错误
                //status  2商家审核通过 0商家待审核 1商家审核中 4商家审核驳回 3商家入驻未生效
                if (info.status == "2" || info.status == "1") {
                    var brandInfo = $(".brandInfo").find("input");
                    //如果内容为空
                    for (var i = 0; i < brandInfo.length; i++) {
                        var _this = brandInfo.eq(i);
                        _this.attr("readonly", "readonly");
                        _this.siblings("select").attr("disabled", "disabled");
                    }
                    var brandInfoImg = $(".brandInfoImg");
                    //如果内容为空
                    for (var i = 0; i < brandInfoImg.length; i++) {
                        var brandInfoImgArr = brandInfoImg.eq(i).find("img");
                        for (var j = 0; j < brandInfoImgArr.length; j++) {
                            var _this = brandInfoImgArr.eq(j);
                            $(".brandInfoImg").eq(i).find("input").eq(j).hide();
                        }
                    }
                    $('.proofCode').hide();
                   
                    setTimeout(function(){
                        $('.c5').hide();
                        $(".hui-picker").remove();
                         $('.closeimg').hide();
                    }, 2000);
                    
                    dstime = setInterval(function(){
                        $("#hui-mask").hide();
                    }, 500);

                    $("#region1").off('click');
                    //银联入驻信息不能修改
                    $("#region2").off('click');
                    $(".bankSearch-but").hide();
                    $('.text-aqua').hide();

                    var pnionPay = $(".pnionPay").find("input");
                    //如果内容为空
                    for (var i = 0; i < pnionPay.length; i++) {
                        var _this = pnionPay.eq(i);
                        if (_this.val() != '') {
                            _this.attr("readonly", "readonly");
                        }
                    }

                    var pnionPayImg = $(".pnionPayImg");
                    for (var i = 0; i < pnionPayImg.length; i++) {
                        var _this = pnionPayImg.eq(i).find("img");
                        //如果内容为空 可以修改
                        if (!(_this.attr("route") == null || _this.attr("route") == "")) {
                            pnionPayImg.eq(i).find("input").hide();
                        }
                        // pnionPayImg.eq(i).find("input").hide();
                    }

                    var importantType = $(".importantType").find("input");
                    //如果内容为空
                    for (var i = 0; i < importantType.length; i++) {
                        var _this = importantType.eq(i);
                        if (_this.val() != '') {
                            _this.attr("readonly", "readonly");
                            _this.siblings("select").attr("disabled", "disabled");
                        }
                    }

                    var businessType = $("#businessType");

                    if (businessType.val() == "") {
                        pickerBusinessType = new huiPicker('#businessType', function () {
                            var val = pickerBusinessType.getVal(0);
                            var txt = pickerBusinessType.getText(0);
                            hui('#businessType').attr("data-id", val);


                            hui('#businessType').val(txt);
                            setBrandSquareSupplierInfo();
                        });
                        pickerBusinessType.bindData(0, businessData);
                    }


                    var mccCode = $(".mccCode").find("input");

                    //判断行业编码是否为空，为空则可以进行编辑
                    if (mccCode.val() != "") {
                        mccCode.attr("readonly", "readonly");
                        $(".showMccCode").html(mccCode.val());
                        $(mccCode).hide();
                        $(".showMccCode").css({
                            "text-align": " right",
                            "font-size": ".5778rem",
                            "width": "100%"
                        })
                    }



                    if (info.applyStatus == "00" || info.applyStatus == "06" || info.applyStatus == "07") {
                        if (info.applyStatus == "00") {
                            $(".content").hide();
                        } else if (info.applyStatus == "06") {
                            $(".content").hide();
                            // 上传成功过了并且审核已经通过，提示提示商户输入对公账户金额
                            hui.prompt('输入银联汇款过来的验证金额，例如0.03元', ['取消', '确认'], function (autonym) {
                                /*判断是否是数字或者字母*/
                                if (isRealNum(autonym)) {
                                    autonymVerify = autonym;
                                    /*把金额发送给代理商后台*/
                                    $.ajax({
                                        type: "POST",
                                        url: "/localQuickPurchase/brandSquare/verificationUnionPayAmount",
                                        data: {
                                            'seq': seq,
                                            'amount': autonym
                                        },
                                        dataType: 'json',
                                        async: true,
                                        //applyStatus   入网状态 00：签约中  01：签约成功  02：入网审核中 03：入网成功  04：入网失败  99：其它错误  05：入驻成功(后台配置完信息)待认证金额06(对公账户) 07认证失败
                                        //status  2商家审核通过 0商家待审核 1商家审核中 4商家审核驳回 3商家入驻未生效
                                        success: function (data) {
                                            var data_alert = data.code;
                                            var message = "";
                                            if (data_alert == 200) {
                                                message = "认证成功";
                                            } else {
                                                message = "认证失败"
                                            }
                                            hui.alert(message, "确认", function () {});
                                            return;
                                        }
                                    });
                                } else {
                                    hui.alert("请输入有效的数字金额")
                                }
                            })
                            return;
                        } else if (info.applyStatus == "07") {
                            $(".content").hide();
                            hui.alert("您已经连续认证失败错误次数达到五次，请联系客服处理")
                        }
                        return;
                    }
                    return;
                } else {
                    // 经营类型
                    clearInterval(dstime)
                    initManagementTypeData();

                    if ((info.applyStatus != "04" && info.applyStatus != "99") && info.applyStatus) {
                        //银联入驻信息暂时生效不能修改
                        $("#region2").off('click');
                        $(".bankSearch-but").hide();

                        var pnionPay = $(".pnionPay").find("input");
                        //如果内容为空
                        for (var i = 0; i < pnionPay.length; i++) {
                            var _this = pnionPay.eq(i);
                            if (_this.val() != '') {
                                _this.attr("readonly", "readonly");
                            }
                        }



                        var importantType = $(".importantType").find("input");
                        //如果内容为空
                        for (var i = 0; i < importantType.length; i++) {
                            var _this = importantType.eq(i);
                            if (_this.val() != '') {
                                _this.attr("readonly", "readonly");
                                _this.siblings("select").attr("disabled", "disabled");
                            }
                        }

                        var businessType = $("#businessType");
                        //判断行业编码是否为空，为空则可以进行编辑
                        if (businessType.val() == "") {
                            pickerBusinessType = new huiPicker('#businessType', function () {
                                var val = pickerBusinessType.getVal(0);
                                var txt = pickerBusinessType.getText(0);
                                hui('#businessType').attr("data-id", val);
                                hui('#businessType').val(txt);
                                setBrandSquareSupplierInfo();
                            });
                            pickerBusinessType.bindData(0, businessData);
                        }


                        var mccCode = $(".mccCode").find("input");
                        //判断行业编码是否为空，为空则可以进行编辑
                        if (mccCode.val() != "") {
                            mccCode.attr("readonly", "readonly");
                            $(".showMccCode").html(mccCode.val());
                            $(mccCode).hide();
                            $(".showMccCode").css({
                                "text-align": " right",
                                "font-size": ".5778rem",
                                "width": "100%"
                            })
                        }

                        var pnionPayImg = $(".pnionPayImg");
                        for (var i = 0; i < pnionPayImg.length; i++) {
                            var _this = pnionPayImg.eq(i).find("img");
                            //如果内容为空 可以修改
                            if (!(_this.attr("route") == null || _this.attr("route") == "")) {
                                pnionPayImg.eq(i).find("input").hide();
                            }
                            // pnionPayImg.eq(i).find("input").hide();
                        }
                    } else {
                        // 经营类型
                        initManagementTypeData();
                        //初始化注册类型
                        initMerTypeData();
                    }
                }
                if ((info.status == "2" || info.status == "1") && (info.applyStatus != "04" && info.applyStatus != "99" && info.applyStatus)) {

                    var text = "<ul style='text-align:left;padding-left:0.8rem;'>" +
                        "<li style='list-style-type:disc;'>您可以上传商品了！</li>" +
                        "<li class='copy-btn' style='left;list-style-type:disc;'><p style='word-break:break-all;'>上传地址:" + info.bgURL + "</p></li>" +
                        "<li style=''><button class='path_p_btn' style='display:block;margin: 0 auto;font-size: 16px; border:1px solid #ffcc66;outline: none'>复制地址</button></li>" +
                        "</ul>"
                    hui.alert(text, '确定', function () {});
                }
                if (info.status == 4) {
                    hui.alert("驳回建议:" + info.suggestion, '确定', function () {});
                }
            } else {
                sendCodeType = 2;
                localStorage.removeItem("brandSquareSupplierInfo");
                //初始化注册类型
                initMerTypeData();
                //初始化经营类型
                initManagementTypeData();
                //证书上传选择框
                handlingImageProblems(1);
                handlingImageProblems(2);
                handlingImageProblems(3);
                handlingImageProblems(4);
                handlingImageProblems(5);
                handlingImageProblems(6);
            }
        }
    });
    //初始化店铺类型
    getshopType();
    getMccCode();



}