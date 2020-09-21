function countdown(start){
    // start 倒计时开始时间 
    var time_start = new Date(start);
    console.log(time_start);
    var now = time_start.getTime();
    console.log(now);
    // 结束时间 设定一个小时候后结束
    var time_end = time_start.setHours(time_start.getHours()+1);
    console.log(time_end);
    // 时间差
    var time_distance = time_end - now; 
    console.log(time_distance);
    time_distance = (time_distance ) / 1000;
    console.log(time_distance);
     // 设置定时器
     var timerId = setInterval(function(){
		if(time_distance <= 0 ){
			clearInterval(timerId);
			return false;
		}
		time_distance--;
		// 时
        var int_hour = Math.floor(time_distance/(60*60));
        // 分
        var int_minute = Math.floor(time_distance%3600/60);
        // 秒 
        var int_second = Math.floor(time_distance %60);
        // console.log(int_second);
        // 时分秒为单数时、前面加零 
        int_hour = int_hour > 10 ? int_hour : "0" + int_hour;
        int_minute = int_minute > 10 ? int_minute : '0' + int_minute;
        int_second = int_second > 10 ? int_second : '0' +int_second;
       
        // 显示时间 
        $("#timer em").eq(0).html(int_hour); 
        $("#timer em").eq(1).html(int_minute); 
        $("#timer em").eq(2).html(int_second); 

        },1000)
     
}