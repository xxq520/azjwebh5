$.fn.slideDel = function(funcDel,options) {
	var slides = this;
	var move = 0;
	var defaults = {
	    wrapEle:""
	}
	var opt = $.extend({}, defaults, options);
	this.each(function (i, v) {
	    $(v).css("overflow", "hidden");
	    if (opt.wrapEle && typeof opt.wrapEle == "string") {
	        $(v).find(opt.wrapEle).wrapInner(function () {
	            return "<div class='slide-content'></div>";
	        });
	        $(v).find(opt.wrapEle).css("overflow", "hidden");
	    } else {
	        $(v).wrapInner(function () {
	            return "<div class='slide-content'></div>";
	        });
	        $(v).css("overflow", "hidden");
	    }
	    var btnHeight = 0;
	    if (opt.wrapEle && typeof opt.wrapEle == "string") {
	        btnHeight = $(opt.wrapEle).height();
	    } else {
	        btnHeight = $(v).height();
	    }
	    $(v).find(".slide-content").append($("<span class='btn-del'>删除</span>"));
	    $(v).find(".slide-content .btn-del").css("line-height", btnHeight + "px");
		var btnW = $(v).find(".btn-del").width();
		var curPos = 0;
		var sTime = 0;
		var endTime = 0;
		var $slideContent = $(v).find(".slide-content");

		//给删除按钮绑定传入的事件
		if(funcDel && typeof funcDel == "function") {
			$slideContent.find(".btn-del").on("click", funcDel);
		}

		$slideContent.on("touchstart", function (e) {
			var e = e || window.event;
			sTime = new Date().getTime();
			var self = this;
			$(self).css("transition", "");
			//console.log(e);
			var ts = e.originalEvent.touches[0];
			if (opt.wrapEle && typeof opt.wrapEle == "string") {
			    var initX = parseInt($(self).offset().left) - parseInt($(self).parent().offset().left);
			} else {
			    var initX = parseInt($(self).offset().left);
			}
			
			var posstart = ts.clientX;
			$(document).on("touchmove", function(e) {
				var e = e || window.event;
				var tm = e.originalEvent.touches[0];
				var moveX = tm.clientX - posstart;
				if (opt.wrapEle && typeof opt.wrapEle == "string") {
				    curPos = parseInt($slideContent.offset().left) - parseInt($slideContent.parent().offset().left);
				} else {
				    curPos = parseInt($slideContent.offset().left);
				}
				//console.log(-btnW);
				if(curPos >= -btnW ) {	//&& curPos <= 0
				    var oLeft = initX + moveX;
				    //console.log(oLeft);
					$(self).css("transform", "translate3d(" + oLeft + "px,0,0)");
				}
			})

		})
		$slideContent.on("touchend", function() {
			var self = this;
			endTime = new Date().getTime();
			$(this).css("transition", "all 0.4s ease");
			var pLeft = $slideContent.offset().left;
			if((endTime - sTime) <= 300) {
				if(curPos < -btnW / 2) {
					setTimeout(function() {
						$(self).css("transform", "translate3d(" + -btnW + "px,0,0)");
					}, 0)
					$(document).off("touchmove");
					return;
				} else if(curPos > -btnW / 2) {
					setTimeout(function() {
						$(self).css("transform", "translate3d(0,0,0)");
					}, 0)
					$(document).off("touchmove");
					return;
				}

				//$(this).css("left",-btnW);
			} else {
				if(curPos < -btnW / 2) {
					setTimeout(function() {
						$(self).css("transform", "translate3d(" + -btnW + "px,0,0)");
					}, 0)
					$(document).off("touchmove");
					return;
				}
				if(curPos > 0 || curPos > -btnW / 2) {
					setTimeout(function() {
						$(self).css("transform", "translate3d(0,0,0)");
					}, 0)
					$(document).off("touchmove");
					return;

				}
			}

		})
	})
}