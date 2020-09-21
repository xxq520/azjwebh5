/*验证快递公司名称*/
function checkCompany(type){
	var name = "";
	switch(type){
/*分类：A --- num ：3*/	
	case "auspost":  
		name = "澳大利亚邮政";  
		break;  
	case "aae":  
		name = "AAE";  
		break;  
	case "anxindakuaixi":  
		name = "安信达";  
		break;
/*分类：B --- num ：5*/
	case "huitongkuaidi":  
		name = "百世汇通";  
		break;  
	case "baifudongfang":  
		name = "百福东方";  
		break;  
	case "bht":  
		name = "BHT";  
		break;  
	case "youzhengguonei":  
		name = "平邮";  
		break;  
	case "bangsongwuliu":  
		name = "邦送物流";  
		break; 
/*分类：C --- num ：5*/		
	case "cces":  
		name = "希伊艾斯（CCES）";  
		break;  
	case "coe":  
		name = "中国东方（COE）";  
		break;  
	case "chuanxiwuliu":  
		name = "传喜物流";  
		break;  
	case "canpost":  
		name = "加拿大邮政";  
		break;  
	case "canpostfr":  
		name = "加拿大邮政";  
		break; 
/*分类：D --- num ：8*/		
	case "datianwuliu":  
		name = "大田物流";  
		break;  
	case "debangwuliu":  
		name = "德邦物流";  
		break;  
	case "dpex":  
		name = "DPEX";  
		break;  
	case "dhl":  
		name = "DHL-中国件";  
		break;  
	case "dhlen":  
		name = "DHL-国际件";  
		break;  
	case "dhlde":  
		name = "DHL-德国件";  
		break;  
	case "dsukuaidi":  
		name = "D速快递";  
		break;  
	case "disifang":  
		name = "递四方";  
		break;
/*分类：E --- num ：4*/
	case "ems":  
		name = "E邮宝";  
		break;
	case "emsen":  
		name = "EMS";  
		break;
	case "emsguoji":  
		name = "EMS-（中国-国际）件";  
		break;
	case "emsinten":  
		name = "EMS-（中国-国际）件";  
		break;
/*分类：F ---num ：8*/
	case "fedex":  
		name = "Fedex-国际件";  
		break;
	case "fedexcn":  
		name = "Fedex-国际件";  
		break;
	case "fedexus":  
		name = "Fedex-美国件";  
		break;
	case "feikangda":  
		name = "飞康达物流";  
		break;
	case "feikuaida":  
		name = "飞快达";  
		break;
	case "rufengda":  
		name = "凡客如风达";  
		break;
	case "fengxingtianxia":  
		name = "风行天下";  
		break;
	case "feibaokuaidi":  
		name = "飞豹快递";  
		break;
/*分类：G --- num ：7*/		
	case "ganzhongnengda":  
		name = "港中能达";  
		break;
	case "guotongkuaidi":  
		name = "国通快递";  
		break;
	case "guangdongyouzhengwuliu":  
		name = "广东邮政";  
		break;
	case "youzhengguonei":  
		name = "国内邮件";  
		break;
	case "youzhengguoji":  
		name = "国际邮件";  
		break;
	case "gls":  
		name = "GLS";  
		break;
	case "gongsuda":  
		name = "共速达";  
		break;
/*分类：H --- num ：11*/
	case "huitongkuaidi":  
		name = "汇通快运";  
		break;
	case "huiqiangkuaidi":  
		name = "汇强快递";  
		break;
	case "tiandihuayu":  
		name = "华宇物流";  
		break;
	case "hengluwuliu":  
		name = "恒路物流";  
		break;
	case "huaxialongwuliu":  
		name = "华夏龙";  
		break;
	case "tiantian":  
		name = "海航天天";  
		break;
	case "haiwaihuanqiu":  
		name = "海外环球";  
		break;
	case "hebeijianhua":  
		name = "河北建华";  
		break;
	case "haimengsudi":  
		name = "海盟速递";  
		break;
	case "huaqikuaiyun":  
		name = "华企快运";  
		break;
	case "haihongwangsong":  
		name = "山东海红";  
		break;
/*分类：J --- num ：9*/
	case "jiajiwuliu":  
		name = "佳吉物流";  
		break;
	case "jiayiwuliu":  
		name = "佳怡物流";  
		break;
	case "jiayunmeiwuliu":  
		name = "加运美";  
		break;
	case "jinguangsudikuaijian":  
		name = "京广速递";  
		break;
	case "jixianda":  
		name = "急先达";  
		break;
	case "jinyuekuaidi":  
		name = "晋越快递";  
		break;
	case "jietekuaidi":  
		name = "捷特快递";  
		break;
	case "jindawuliu":  
		name = "金大物流";  
		break;
	case "jialidatong":  
		name = "嘉里大通";  
		break;
/*分类：K --- num ：3*/		
	case "kuaijiesudi":  
		name = "快捷速递";  
		break;
	case "kangliwuliu":  
		name = "康力物流";  
		break;
	case "kuayue":  
		name = "跨越物流";  
		break;
/*分类：L --- num ：8*/		
	case "lianhaowuliu":  
		name = "联昊通";  
		break;
	case "longbanwuliu":  
		name = "龙邦物流";  
		break;
	case "lanbiaokuaidi":  
		name = "蓝镖快递";  
		break;
	case "lejiedi":  
		name = "乐捷递";  
		break;
	case "lianbangkuaidi":  
		name = "联邦快递";  
		break;
	case "lianbangkuaidien":  
		name = "联邦快递";  
		break;
	case "lijisong":  
		name = "立即送";  
		break;
	case "longlangkuaidi":  
		name = "隆浪快递";  
		break;
/*分类：M --- num ：3*/
	case "menduimen":  
		name = "门对门";  
		break;
	case "meiguokuaidi":  
		name = "美国快递";  
		break;
	case "mingliangwuliu":  
		name = "明亮物流";  
		break;
/*分类：O --- num ：2*/
	case "ocs":  
		name = "OCS";  
		break;
	case "ontrac":  
		name = "onTrac";  
		break;
/*分类：Q --- num ：6*/
	case "quanchenkuaidi":  
		name = "全晨快递";  
		break;
	case "quanjitong":  
		name = "全际通";  
		break;
	case "quanritongkuaidi":  
		name = "全日通";  
		break;
	case "quanyikuaidi":  
		name = "全一快递";  
		break;
	case "quanfengkuaidi":  
		name = "全峰快递";  
		break;
	case "sevendays":  
		name = "七天连锁";  
		break;
/*分类：R --- num ：1*/
	case "rufengda":  
		name = "如风达快递";  
		break;
/*分类：S --- num ：13*/
	case "shentong":  
		name = "申通快递";  
		break;
	case "shunfeng":  
		name = "顺丰速递";  
		break;
	case "shunfengen":  
		name = "顺丰";  
		break;
	case "santaisudi":  
		name = "三态速递";  
		break;
	case "shenghuiwuliu":  
		name = "盛辉物流";  
		break;
	case "suer":  
		name = "速尔物流";  
		break;
	case "shengfengwuliu":  
		name = "盛丰物流";  
		break;
	case "shangda":  
		name = "上大物流";  
		break;
	case "haihongwangsong":  
		name = "山东海红";  
		break;
	case "saiaodi":  
		name = "赛澳递";  
		break;
	case "sxhongmajia":  
		name = "山西红马甲";  
		break;
	case "shenganwuliu":  
		name = "圣安物流";  
		break;
	case "suijiawuliu":  
		name = "穗佳物流";  
		break;
/*分类：T --- num : 5*/		
	case "tiandihuayu":  
		name = "天地华宇";  
		break;
	case "tiantian":  
		name = "天天快递";  
		break;
	case "tnt":  
		name = "TNT";  
		break;
	case "tnten":  
		name = "TNT";  
		break;
	case "tonghetianxia":  
		name = "通和天下";  
		break;
/*分类：U --- num : 4*/		
	case "ups":  
		name = "UPS";  
		break;
	case "upsen":  
		name = "UPS";  
		break;
	case "youshuwuliu":  
		name = "优速物流";  
		break;
	case "usps":  
		name = "USPS";  
		break;
/*分类： W --- num ：3*/
	case "wanjiawuliu":  
		name = "万家物流";  
		break;
	case "wanxiangwuliu":  
		name = "万象物流";  
		break;
	case "weitepai":  
		name = "微特派";  
		break;
/*分类：X --- num ：4*/
	case "xinbangwuliu":  
		name = "新邦物流";  
		break;
	case "xinfengwuliu":  
		name = "信丰物流";  
		break;
	case "neweggozzo":  
		name = "新蛋奥硕物流";  
		break;
	case "hkpost":  
		name = "香港邮政";  
		break;
/*分类： Y --- num ：17*/
	case "yuantong":  
		name = "圆通速递";  
		break;
	case "yunda":  
		name = "韵达快运";  
		break;
	case "yuntongkuaidi":  
		name = "运通快递";  
		break;
	case "youzhengguonei":  
		name = "邮政包裹";  
		break;
	case "yuanchengwuliu":  
		name = "远成物流";  
		break;
	case "yafengsudi":  
		name = "亚风速递";  
		break;
	case "yibangwuliu":  
		name = "一邦速递";  
		break;
	case "youshuwuliu":  
		name = "优速物流";  
		break;
	case "yuanweifeng":  
		name = "源伟丰快递";  
		break;
	case "yuanzhijiecheng":  
		name = "元智捷诚";  
		break;
	case "yuefengwuliu":  
		name = "越丰物流";  
		break;
	case "yuananda":  
		name = "源安达";  
		break;
	case "yuanfeihangwuliu":  
		name = "原飞航";  
		break;
	case "zhongxinda":  
		name = "忠信达快递";  
		break;
	case "zhimakaimen":  
		name = "芝麻开门";  
		break;
	case "yinjiesudi":  
		name = "银捷速递";  
		break;
	case "yitongfeihong":  
		name = "一统飞鸿";  
		break;
/*分类：Z --- num ：*/		
	case "zhongtong":  
		name = "中通速递";  
		break;
	case "zhaijisong":  
		name = "宅急送";  
		break;
	case "zhongyouwuliu":  
		name = "中邮物流";  
		break;
	case "zhongxinda":  
		name = "忠信达";  
		break;
	case "zhongsukuaidi":  
		name = "中速快件";  
		break;
	case "zhengzhoujianhua":  
		name = "郑州建华";  
		break;
	case "zhongtianwanyun":  
		name = "中天万运";  
		break;
	}
	return name;
}