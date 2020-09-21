 //登录之后调用接口
            function Airlines() {
                $.support.cors = true;
                $.ajax({
                    type: "POST",
                    dataType: "json",
                    //cache: true,
                    async: true,
                    url: "http://ndhapi.520shq.com/HXUser?strUserName=" +userName +"&strPwd=" +userName +"",
                    success: function (data) {
                        easemobim.config = {
                            hide: true,
                            //下班后，允许访客发送消息时创建会话
                            offDutyType: 'chat',
                            //访客主动发起满意度评价
                            satisfaction: true,
                            ////以便访客端聊天窗口最小化时，收到新消息提醒
                            autoConnect: true,
                            ////启用收消息同步,同一浏览器打开多个Tab页或窗口时
                            resources: true,
                            ////网页版聊天窗口不需要显示会话创建、接起、转接、结束等会话状态提示
                            hideStatus: true,
                            //访客自动上报
                            //eventCollector: true,
                            //agentName: "574815064@qq.com",
                            emgroup: "客服组",
                            appKey: data.Appkey,
                            //手机App绑定的IM号
                            to: data.to,
                            visitor: {
                                trueName: userName,
                                phone: userName,
                                companyName: '华项科技',
                                userNickname: '我是 '+userName,
                                description: '描述信息'
                            },
                            //集成用户体系，验证的方式二选一，必填，另一项为空即可
                            user: {
                                //指定用户名，集成时必填
                                username: userName,
                                //password验证方式
                                password: userName
                            }
                        };
                        easemobim.bind({ tenantId: data.tenantId, to: data.to, appKey: data.Appkey });
                    }
                });
            }
