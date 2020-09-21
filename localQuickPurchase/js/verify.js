
/**
 * 该js是用户于校验
 */

/**
 * 校验身份证号是否正确
 * @param str
 * @returns	false 不合格, true 合格
 */

function taxMark(taxpayerId) {
    if (taxpayerId.length != 15 && taxpayerId.length != 18 && taxpayerId.length != 20) {
        return false;
    }else{
        return true;
    }
}

/**
 * 校验身份证号是否正确
 * @param str
 * @returns	false 不合格, true 合格
 */
function checkTaxpayerId(taxpayerId){
    if(taxpayerId!="" && taxpayerId.length===15){
        var addressCode = taxpayerId.substring(0,6);
        // 校验地址码
        var check = checkAddressCode(addressCode);
        if(!check){
            return false;
        }
        // 校验组织机构代码
        var orgCode = taxpayerId.substring(6,9);
        check = isValidOrgCode(orgCode);
        if(!check){
            return false;
        }
        return true;
    }else{
        return false;
    }
}
/**
 * 验证组织机构代码是否合法
 * @param str
 * @returns	false 不合格, true 合格
 */
function isValidOrgCode(value){
    if(value!=""){
        var part1=value.substring(0,8);
        var part2=value.substring(value.length-1,1);
        var ws = [3, 7, 9, 10, 5, 8, 4, 2];
        var str = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        var reg = /^([0-9A-Z]){8}$/;
        if (!reg.test(part1))
        {
            return true
        }
        var sum = 0;
        for (var i = 0; i< 8; i++)
        {
            sum += str.indexOf(part1.charAt(i)) * ws[i];
        }
        var C9 = 11 - (sum % 11);
        var YC9=part2+'';
        if (C9 == 11) {
            C9 = '0';
        } else if (C9 == 10) {
            C9 = 'X' ;
        } else {
            C9 = C9+'';
        }
        return YC9!=C9;
    }
}
/**
 * 验证地址码
 * @param str
 * @returns	false 不合格, true 合格
 */
function checkAddressCode(addressCode){
    var provinceAndCitys={11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江",
        31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北",43:"湖南",44:"广东",
        45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",
        65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外"};
    var check = /^[1-9]\d{5}$/.test(addressCode);
    if(!check) return false;
    if(provinceAndCitys[parseInt(addressCode.substring(0,2))]){
        return true;
    }else{
        return false;
    }

}

/**
 * 校验手机号是否正确
 * @param str
 * @returns	false 不合格, true 合格
 */
function isPoneAvailable(str) {
    var myreg=/^[1][3,4,5,6,7,8,9,][0-9]{9}$/;
    //var myreg = /^1[3|4|5|7|8|9][0-9]\d{4,8}$/;
    //var myreg = /^((1[3,5,8][0-9])|(14[5,7])|(17[0,6,7,8])|(19[7]))\d{8}$/;
    if (!myreg.test(str)) {
        return false;
    } else {
        return true;
    }
}

/**
 * 校验邮箱格式是否正确
 * @returns
 */
function isMail(mailStr) {
    var myemail = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
    if (!myemail.test(mailStr)) {
        return false;
    } else {
        return true;
    }
}

/**
 * 校验固话
 * @param str
 * @returns
 */
function checkPhone(str){
    var re = /^0\d{2,3}-?\d{7,8}$/;
    if(re.test(str)){
        return true;
        //alert("正确");
    }else{
        //alert("错误");
        return false;
    }
}

/**
 * 校验身份证号是否正确
 * @param str
 * @returns	false 不合格, true 合格
 */
function isIdCard(IdCardCode) {
    var regIdCard = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;
    if (!regIdCard.test(IdCardCode)) {
        return false;
    } else {
        return true;
    }
}

/**
 * 判空
 * @param str
 * @returns	false 不合格, true 合格
 */
function sentencedEmpty(str) {
    if (str == null || str == "") {
        return false;
    } else {
        return true;
    }
}






