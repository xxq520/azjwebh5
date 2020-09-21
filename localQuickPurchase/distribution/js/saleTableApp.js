function showTable(days,seq){
		var userType = distributorType;
		var text;
		if (days == 7) {
			text = "7天销售趋势图";
		} else if (days == 30) {
			text = "30天销售趋势图";
		} else if (days == 90) {
			text = "90天销售趋势图";
		}
		 $.ajax({
			url : "/localQuickPurchase/dOrders/findOrdersByTime",
			type : "POST",
			data : {
				seq :seq,
				status : 1,
				begindate : AddDays(new Date(),days),
				enddate : AddDays(new Date(),1),
				userType :userType,
				orderStatus :8
			},
			async : true,
			dataType : "json",
			success : function(data) {
				if(data.code == 200){ 
				 listAmount = data.data.listAmount;// 金额数组
					listDate = data.data.listDate;// 时间数组
					listReturnAmount =data.data.listReturnAmount;//利润
					if (listAmount.length == 0 || listDate.length == 0
							|| listReturnAmount.length == 0) {
						alert("查询无数据显示!");
					}
					
					var series = new Array();
					series[0] = listAmount;
					series[1] = listReturnAmount;
					var opt = {series};
					console.info(opt);
					// 趋势图
					var myChart = echarts.init(document.getElementById('echarts'));
					// 指定图表的配置项和数据
					
					var option = {
							baseOption :{
									  title:{text :text},
								tooltip : {
									        trigger: 'axis',
									        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
									            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
									        }
									    },
									    legend: {
									        data: ['销售总额','销售总利润']
									    },
									    toolbox :{
									    	show : true,
									    	feature : {
									    		dataView :{
									    		show : true,
									    		title : '数据视图',
								                readOnly: true,
								                lang : ['数据视图', '关闭', '刷新'],
									              optionToContent: function (opt){
									            	 let series = opt.series; //折线图数据
									                    let tdHeads = '<td  style="padding: 0 10px">时间</td>'; //表头
									                    let tdBodys = ''; //数据
									                    series.forEach(function (item){
									                    	 //组装表头
									                        tdHeads += `<td style="padding: 0 10px">${item.name}</td>`;
									                    });
									                    let table = `<table border="1" width="100%" style="border-collapse:collapse;font-size:14px;text-align:center"><tbody><tr>${tdHeads} </tr>`;
									                    for (let i = 0, l = listDate.length; i < l; i++) {
									                        for (let j = 0; j < series.length; j++) {
									                            //组装表数据
									                            tdBodys += `<td>${ series[j].data[i]}</td>`;
									                        }
									                        table += `<tr><td style="padding: 0 10px">${listDate[i]}</td>${tdBodys}</tr>`;
									                        tdBodys = '';
									                    }
									                    table += '</tbody></table>';
									                    return table;
									             }
									    		},
									    		magicType : {
													type : [ 'line', 'bar' ]
												},
											saveAsImage : {}
									    }
									    	},
									    grid: {
									        left: '3%',
									        right: '4%',
									        bottom: '6%',
									        containLabel: true
									    },
									    xAxis:  {
									        type: 'value',
									        boundaryGap: [0, 0.2]
									    },
									    yAxis: {
									        //type: 'category',
									        data: listDate
									    },
									    series: [
									        {
									            name: '销售总额',
									            type: 'bar',
									          /*  label: {
									                normal: {
									                    show: true,
									                    position: 'insideRight'
									                }
									            },*/
									            data: listAmount
									        },
									        {
									            name: '销售总利润',
									            type: 'bar',
									            /*label: {
									                normal: {
									                    show: true,
									                    position: 'insideRight'
									                }
									            },*/
									            data: listReturnAmount
									        }
									    ]
							},
						    media: [
					            {
					                option: {
					                    legend: {
					                        right: 'center',
					                        bottom: 0,
					                        orient: 'horizontal'
					                    },
					                    series: [
					                        {
					                            radius: [20, '50%'],
					                            center: ['25%', '50%']
					                        }
					                    ]
					                }
					            },
					            {
					                query: {
					                    minAspectRatio: 1
					                },
					                option: {
					                    legend: {
					                        right: 'center',
					                        bottom: 0,
					                        orient: 'horizontal'
					                    },
					                    series: [
					                        {
					                            radius: [20, '50%'],
					                            center: ['25%', '50%']
					                        }
					                    ]
					                }
					            }
					        ]
							};
					
					// 使用刚指定的配置项和数据显示图表。
					myChart.setOption(option);
				}else{
					alert("网络问题,无法查询数据!");
				}
			}
				});
	//日期加上天数后的新日期.
	function AddDays(date, days) {
		var nd = new Date(date);
		nd = nd.valueOf();
		nd = nd - days * 24 * 60 * 60 * 1000;
		nd = new Date(nd);
		// alert("new Date(nd) : " +new Date(nd));//Tue Nov 07 2017 21:22:42
		// GMT+0800 (中国标准时间)
		// alert(nd.getFullYear() + "年" + (nd.getMonth() + 1) + "月" + nd.getDate() +
		// "日");
		var y = nd.getFullYear();
		var m = nd.getMonth() + 1;
		var d = nd.getDate();
		if (m <= 9)
			m = "0" + m;
		if (d <= 9)
			d = "0" + d;
		var cdate = y + "-" + m + "-" + d;
		return cdate;
	}
	}
	function formatTime(date) {
		var date = new Date(date);
		var y = date.getFullYear();
		var m = date.getMonth() + 1;
		m = m < 10 ? ('0' + m) : m;
		var d = date.getDate();
		d = d < 10 ? ('0' + d) : d;
		var h = date.getHours();
		h = h < 10 ? ('0' + h) : h;
		var minute = date.getMinutes();
		var second = date.getSeconds();
		minute = minute < 10 ? ('0' + minute) : minute;
		second = second < 10 ? ('0' + second) : second;
		return y + '-' + m + '-' + d + '  ' + h + ':' + minute + ':' + second;
	};
	
	//取url的参数
	function getQueryString(name) {
	    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
	    var r = window.location.search.substr(1).match(reg);
	    if (r != null) {
	        return decodeURI(r[2]);
	    }else{
	        return "";
	    }
	}
        // 为echarts对象加载数据 
        /* myChart.setOption(option); 
        myChart.hideLoading(); 
           resize();
         window.onresize = function(){
           resize();
        }
        function resize(){
            var height = document.documentElement.clientHeight - 50 + 'px';
            var width = document.documentElement.clientWidth + 'px';
            $('.echarts-l').height(height).width(width);
            $('.show').height(document.documentElement.clientHeight - 65 + 'px').width(width);
            myChart && myChart.resize();
        }  */