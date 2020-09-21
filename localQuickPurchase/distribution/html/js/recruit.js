$(function(){
	//通过名称获取url链接带过来的参数
	function GetQueryString(name)
	{
		var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
		var r = window.location.search.substr(1).match(reg);
		if(r!=null)return  unescape(r[2]); return null;
	}
	if(userSeq==0){
		location.href="../login.jsp";
	}
	//请求的参数
	var param={masterSeq:userSeq,state:(state2=GetQueryString("state"))==null?0:state2,pageSize:10,pageIndex:1};//GetQueryString("state")通过url链接获取state的值
	var refuseapply_pageIndex=1;
	var mydistributors_pageIndex=1;
	var waitapply_pageIndex=1;
	//表示是否有下一页
	var hasNextPage=false;
	function init(){
		//初次加载待审核分销商
		$.get("/localQuickPurchase/dApplicationAction/findDistributor",param,function(json){
			var code = json.code;
			if(code==200){
				//获取data的list数据
				var distributors = json.data.list;
				if(distributors.length==0)
					return;
				hasNextPage = json.data.hasNextPage;
				if(param.state==0){
					//待审核分销商
					waitapply(distributors);
				}else if(param.state==1){
					//我的分销商
					mydistributors(distributors);
				}else if(param.state==2){
					//已拒绝的申请客户
					refuseapply(distributors);
				}
				if(json.data.hasNextPage){
					$("#nothing").hide();
					$("#having").show();
				}else{
					$("#nothing").show();
					$("#having").hide();
				}
			}else if(code==400){$("#nothing").show();
			$("#having").hide();
			}

			else
				mui.toast("error");
		});
	}
	//清空list列表数据
	function clean(){
		$("#refuseapplylist").html("");
		$("#distributorlist").html("");
		$("#waitapplylist").html("");
	}

	//下拉滚动
	var BOTTOM_OFFSET = 0;  

	$(window).scroll(function () {
		var selected = "";
		if(param.state==0){
			selected = "waitapplylist";
		}else if(param.state==1){
			selected = "distributorlist";
		}else if(param.state==2) {
			selected = "refuseapplylist";
		}
		$("#"+selected).val($(document).scrollTop());// 获取垂直滚动的距离  即当前滚动的地方的窗口顶端到整个页面顶端的距离
		//console.info($("#serviceGoodslist").val());
		var $currentWindow = $(window);  
		//当前窗口的高度  
		var windowHeight = $currentWindow.height();  
		//当前滚动条从上往下滚动的距离  
		var scrollTop = $currentWindow.scrollTop();  
		//当前文档的高度  
		var docHeight = $(document).height();  
		//当 滚动条距底部的距离 + 滚动条滚动的距离 >= 文档的高度 - 窗口的高度  
		//换句话说：（滚动条滚动的距离 + 窗口的高度 = 文档的高度）  这个是基本的公式  
		if ((BOTTOM_OFFSET + scrollTop) >= docHeight - windowHeight) { 
			//判断是否下一页
			if(!hasNextPage)
				return;
			param.pageIndex= param.state==0?++waitapply_pageIndex:param.state==1?++mydistributors_pageIndex:param.state==2?++refuseapply_pageIndex:3;
			setTimeout(function(){
				init();
			},1000);

		}  
	});

	//已拒绝的申请
	function refuseapply(result){
		var distributors = result
		var html="";
		for(var i=0;i<distributors.length;i++){
			html+='<div class="listitem">';
			html+='<img  src="../../img/user-pic.png" class="ltt-img" />';
			html+='<div class="ltt-info">';
			html+='<p class="ltti-top">';
			/*html+='<del class="lttit-name">欧阳盛通11111</del>';
			html+='<del class="lttit-tel">18524698675</del>';*/  
			//html+='<span class="lttit-name" style="font-size:.6rem;width:320px;">商家名称：'+((distributors[i].shop.shopName==null)?"":distributors[i].shop.shopName.length>11?distributors[i].shop.shopName.substring(0,11)+"...":distributors[i].shop.shopName)+'</span></p>';
			html+='<span class="lttit-name" style="font-size:.6rem;width:100%;">用户名称：'+((distributors[i].shop.userName==null)?"":distributors[i].shop.userName.length>11?distributors[i].shop.userName.substring(0,11)+"...":distributors[i].shop.userName)+'</span></p>';
			html+='<div class="lttit-tel">联系方式：'+distributors[i].DistributorApplication.mobile.substring(0,30);
			html+='<button type="button" type_dis="4" distributorSeq="'+distributors[i].DistributorApplication.distributorSeq+'" class="dis_remove delbut" dis_seq="'+distributors[i].DistributorApplication.id+'">删除</button>';
			html+='</div>';
			var adressDetail = distributors[i].shop.adressDetail;
			html+='<div class="ltti-address"><span>地址：</span><p>'+(adressDetail==null||adressDetail==""?"":adressDetail)+'</p></div>';
			html+='</div>';
			html+='</div>';
		};
		$("#refuseapplylist").append(html);
	}

	//我的分销商
	function mydistributors(result){
		var distributors = result
		var html="";
		for(var i=0;i<distributors.length;i++){
			html+='<div class="listitem"  >'; 
			html+='<img src="../../img/user-pic.png" class="ltt-img" />';
			html+='<div class="ltt-info">';
			html+='<p class="ltti-top">';

			html+='<span class="lttit-name" style="font-size:.6rem;width:100%;">用户名称：'+((distributors[i].shop.userName==null)?"":distributors[i].shop.userName.length>11?distributors[i].shop.userName.substring(0,13)+"...":distributors[i].shop.userName)+'</span></p>';
			html+='<span class="lttit-tel">联系方式：'+((distributors[i].DistributorApplication.mobile==null)?"":distributors[i].DistributorApplication.mobile.substring(0,30))+'</span>';
			var a = "padding:0 0 0 3rem;overflow:hidden;width:30%;margin:0 5%;border:1px solid #808080;color:#808080;padding:.1rem 0;font-size:.55rem;border:1px solid #f84949;color:#f84949;";

			var adressDetail = distributors[i].shop.adressDetail;
			html+='<div class="ltti-address"><span>地址：</span><p>'+(adressDetail==null||adressDetail==""?"":adressDetail)+'</p></div>';
			html+='<div class="ltti-but"><button type="button" type_dis="3" class="dis_remove delbut" distributorSeq="'+distributors[i].DistributorApplication.distributorSeq+'" dis_seq="'+distributors[i].DistributorApplication.id+'" >撤销分销商</button><button type="button"  class="xianShou delbut" dtype="0" masterSeq="'+distributors[i].DistributorApplication.masterSeq+'" distributorSeq="'+distributors[i].DistributorApplication.distributorSeq+'" >设置时间段</button></div>';
			html+='</div>';
			html+='</div>';
		};
		$("#distributorlist").append(html);


	}

	//申请成为分销商
	function waitapply(result){
		//console.info(result);
		var distributors = result;
		var html="";
		for(var i=0;i<distributors.length;i++){
			html+='<div class="listitem" id="waitapply">';
			html+='<div class="lt-top">';
			html+='<img src="../../img/user-pic.png" class="ltt-img" />';
			html+='<div class="ltt-info">';
			html+='<p class="ltti-top">';
			html+='<span class="lttit-name" style="font-size:.6rem;width:100%;">用户名称：'+((distributors[i].shop.userName==null)?"":distributors[i].shop.userName.length>11?distributors[i].shop.userName.substring(0,11)+"...":distributors[i].shop.userName)+'</span></br>';
			html+='<span class="lttit-tel">联系方式：'+((distributors[i].DistributorApplication.mobile==null)?"":distributors[i].DistributorApplication.mobile.substring(0,30))+'</span>';;
			html+='</p>';
			var adressDetail = distributors[i].shop.adressDetail;
			//adressDetail="偶时间哦该和佛光耦合功底好勾搭谁哦是赴死弘福寺哦到凤凰";
			html+='<div class="ltti-address"><span>地址：</span><p>'+(adressDetail==null||adressDetail==""?"":adressDetail)+'</p></div>';
			html+='</div>';
			html+='</div>';
			html+='<div class="lt-bottom">';
			html+='<button type="button" class="mui-btn mui-btn-danger mui-btn-outlined" masterSeq="'+distributors[i].DistributorApplication.masterSeq+'" distributorSeq="'+distributors[i].DistributorApplication.distributorSeq+'" state="1">同意申请</button>';
			html+='<button type="button" class="mui-btn mui-tab-method" masterSeq="'+distributors[i].DistributorApplication.masterSeq+'" distributorSeq="'+distributors[i].DistributorApplication.distributorSeq+'" state="2" >拒绝申请</button>';
			html+='</div>';
			html+='</div>';
		};
		$("#waitapplylist").append(html);
	}

	//处理分销商的申请(state=2 拒绝    state=1   接收)
	$(document).on('click', ".mui-btn", function() {
		var distributorSeq = $(this).attr("distributorSeq");//获取分销商的seq
		var masterSeq = $(this).attr("masterSeq");//获取服务商的seq
		var state = $(this).attr("state");//根据type值判断拒绝或接受    
		$.post("/localQuickPurchase/dApplicationAction/updateDistributor",{"masterSeq":masterSeq,"distributorSeq":distributorSeq,"state":state},function(result){
			var msg = state == "1" ? "同意成功" : "拒绝成功";
			if(result.code==200){
				mui.toast(msg);
			}else if(result.code==400){
				mui.toast("记录不存在,已被删除");
			}else{
				mui.toast("操作失败");
			}
			waitapply_pageIndex=1;
			param.pageIndex= 1;
			//刷新页面
			setTimeout(function(){
				clean();
				init();
			},1000);
		});
	});

	init();

	//切换分销商状态(待处理、已拒绝、我的分销商)
	$("a[name='href_url']").on("tap",function(e){
		var url = $(this).attr("urlName");
		var state = $(this).attr("state");
		var isChecked = $(this).hasClass("act");
		$("a[name='href_url']").removeClass();
		$(this).addClass("act");
		if(state==param.state)
			return;
		param.state=state;
		hideOrShow();
		clean();
		initPageIndex();
		param.pageIndex=1;
		init();
	});

	//初始化pageIndex
	function initPageIndex(){
		refuseapply_pageIndex=1;
		mydistributors_pageIndex=1;
		waitapply_pageIndex=1;
	}

	//根据状态隐藏对应的div
	function hideOrShow(){
		if(param.state==0){
			//待审核分销商
			$("#waitapplylist").show();
			$("#distributorlist").hide();
			$("#refuseapplylist").hide();
		}else if(param.state==1){
			//我的分销商
			$("#distributorlist").show();
			$("#waitapplylist").hide();
			$("#refuseapplylist").hide();
		}else if(param.state==2){
			//已拒绝的申请客户
			$("#refuseapplylist").show();
			$("#distributorlist").hide();
			$("#waitapplylist").hide();
		}
	}

	//招募分销商链接
	$(".recruitbut").on("tap",function(e){
		location.href="recruit.jsp?masterSeq="+userSeq;
	});

	//撤销分销商功能
	$(document).on('click', ".dis_remove", function() {
		//根据 type_dis 的值判断撤销还是删除    3   撤销    4 删除
		var type_dis = $(this).attr("type_dis");
		var dis_seq = $(this).attr("dis_seq"); 
		var distributorSeq = $(this).attr("distributorSeq");
		$.post("/localQuickPurchase/dApplicationAction/updateDistributor",{"distributorId":dis_seq,"distributorSeq":distributorSeq,"masterSeq":userSeq,"state":type_dis},function(data){
			if(data.code==200){
				if(type_dis==3){
					mui.toast("撤销成功");
					$(".complainpup").hide();
					$(".complainval").val("");
					mydistributors_pageIndex=1;

				}else if(type_dis==4){
					mui.toast("删除成功");
					refuseapply_pageIndex=1;
				}
				clean();
				param.pageIndex= 1;
				init();
			}else{
				mui.toast("error");
			}
		});
	});

	//弹窗操作
	mui("body").on("tap",".caozuo",function(){
		var dis_seq = $(this).attr("dis_seq");//分销商id
		var distributorSeq = $(this).attr("distributorSeq");//分销商seq 
		var masterSeq = $(this).attr("masterSeq");//服务商seq 
		if($(".complainpup").length==0){
			var _puphtml = "";
			_puphtml+="<div class='complainpup'>";
			_puphtml+="<div class='complainmask'></div>";
			_puphtml+="<div class='complaincon'><form>";
			_puphtml+="<span class='mui-icon mui-icon-closeempty closebut'></span>";
			_puphtml+='<center><button type="button" dis_seq="'+distributorSeq+'" masterSeq="'+masterSeq+'"  style="font-size: 0.55rem;margin-right: 15px;border:1px solid #f84949;color: #e43a3d;margin-right: 5px;" name="banned"  value="3">禁销3天</button>';
			_puphtml+='<button type="button" dis_seq="'+distributorSeq+'" masterSeq="'+masterSeq+'" style="font-size: 0.55rem;margin-right: 15px;border:1px solid #f84949;color: #e43a3d;margin-right: 5px;" name="banned"  value="5">禁销5天</button>';
			_puphtml+='<button type="button" dis_seq="'+distributorSeq+'" masterSeq="'+masterSeq+'" style="font-size: 0.55rem;margin-right: 15px;border:1px solid #f84949;color: #e43a3d;margin-right: 5px;" name="banned"  value="7">禁销7天</button></center>';
			_puphtml+='<center><button type="button" type_dis="3"  class="dis_remove delbut" dis_seq="'+dis_seq+'">撤销分销商</button></center>';
			_puphtml+="</form></div>";
			_puphtml+="</div>";
			$("body").append(_puphtml);
			$(".complainpup").show();
		}else{
			$(".complainpup").show();
		}

	});
	
	//关闭弹窗
	mui("body").on("tap",".closebut",function(){
		$(".complainpup").hide();
		$(".complainval").val("");
	});

	//禁销功能
	$("body").on("click","button[name='banned']",function(){
		var dis_seq = $(this).attr("dis_seq");//分销商seq 
		var masterSeq = $(this).attr("masterSeq");//服务商seq 
		var dayCount = $(this).val();//禁销天数
		var url = "/localQuickPurchase/dApplicationAction/prohibit";
		var json = {"distributorSeq":dis_seq,"dayCount":dayCount,"masterSeq":masterSeq};
		$.post(url,json,function(result){
			if(result.code==200){
				alert("OK");
				$(".complainpup").hide();
				$(".complainval").val("");
			}else{
				alert("error");
			}

		});
	});
	
	//限售
	mui("body").on("tap",".xianShou",function(){
		var dtype=$(this).attr("dtype");
		var distributorSeq=$(this).attr("distributorSeq");
		var masterSeq=$(this).attr("masterSeq");
		if(dtype==0){
			location.href="OpenTime.jsp?distributorSeq="+distributorSeq+"&masterSeq="+masterSeq;
		}
	});
	

});
