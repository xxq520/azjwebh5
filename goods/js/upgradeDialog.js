/**
 * Created by lvjian on 2018/8/8.
 */

var flowState;//流程
var flowMessage;//说明
var agentPassage;//代理商通道
var passage;//网络店主通道
var operation;//操作

var u = navigator.userAgent;
var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);

if (isLogin()) {
    findUserMessage();
}

function findUserMessage() {
    var applyProcess = {
        type: 'GET',
        dataType: 'json',
        url: '/upms/applyProcess/findUserApplyProcess',
        data: {"userType": getRoleType()},
        success: function (data) {
            if (data.code == 1000) {
                var flowAisle = data.data;
                //流程
                flowState = flowAisle.flowState;
                //说明
                flowMessage = flowAisle.flowMessage;
                //代理商通道 0 全显，1 显示升级普通代理商通道, 2 显示升级企业级代理商通道, 3 全都隐藏
                agentPassage = flowAisle.agentPassage;
                //网络店主通道
                passage = flowAisle.passage;
                //操作  0 无， 1 绑定上级，2 升级网络店主，3 升级代理商
                operation = flowAisle.operation;


                //弹窗显示
                windowShow();
                if (flowState == 2) {
                    hui.confirm(flowMessage, ['取消', '确定'], function () {
                        if (!isRoleAgent()) {
                            if (submitApply()) {
                                hui.toast("操作成功~")
                            }
                        } else {
                            $("#distributorScancode").show();
                        }
                    }, function () {

                    });
                }

                if (flowState == 3) {
                    hui.confirm(flowMessage, ['取消', '确定'], function () {
                        window.location.href = '/localQuickPurchase/distributionVA/applyComplaint';
                    }, function () {
                    });
                }

                //升级成功或者角色变化
                if (flowState === 9 || flowState === 11) {
                    hui.alert(flowMessage, "确认", function () {
                        loginOffByBack();
                        setTimeout(function () {
                            window.location.href = "/upms/static/noLogin.html";
                        }, 1000);
                    });
                }

            }
        },
    };
    refresh(applyProcess);

    $("#nav-home").addClass("active");
    $("#nav-home").find("img").attr("src", "/localQuickPurchase/distributionApp/images/home_01.png");
}


var popupDistriIndex = getCookie("popupDistriIndex");//网络店主升级弹窗控制
//弹窗显示
function windowShow() {
    if (operation === 2) {
        setCookie("popupDistriIndex", "true", 30);//网络店主弹窗控制
        $("#popup").css('display', 'block');
        return;
    }

    //弹窗绑定显示
    if (operation === 1) {
        var bindingWindows = getCookie("bindingWindows");
        if (bindingWindows != "three") {
            //修改绑定弹窗次数的值
            setBindingWindowsVal(bindingWindows);
            hui.confirm(alertMessage, ['下次再说', '立即绑定'], function () {
                window.location.href = "/upms/views/bind/bindingRole.html";
            });
        }
    }

    //代理商
    if (operation === 3) {
        hui.confirm(flowMessage, ['取消', '确定'], function () {
            window.location.href = "/localQuickPurchase/distributionVA/upgradeAgent?distributorSeq=" + seq + "&upgradeType=1";
        }, function () {

        });
    }
}