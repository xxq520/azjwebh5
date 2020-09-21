/*
hui 选项卡组件
作者 : 深海  5213606@qq.com
官网 : http://hui.hcoder.net/
*/
hui.tab = function(selector,callBack){
	var tabLists = hui(selector);
	for(var i = 0; i < tabLists.length; i++){var tabRun = new huiTabListBase(tabLists.dom[i],callBack);}
}
huiTabListBase = function(dom,callBack){
	this.tab      = hui(dom);
	this.items    = this.tab.find('.hui-tab-item');
	this.itemSize = this.items.length;
	this.height   = 0;
	for(var i = 0; i < this.itemSize; i++){
		this.items.eq(i).dom[0].style.transform  = 'translate3d('+ (i * 100) +'%, 0px, 0px)';
		var itemHeight = this.items.eq(i).height();
		if(itemHeight > this.height){this.height = itemHeight;}
	}
	this.tab.find('.hui-tab-body').css({'height':this.height+'px'});
	this.tabListTitles = this.tab.find('.hui-tab-title').eq(0).find('div');
	this.tabListTitles.css({width: (100 / this.itemSize) + "%"});
	this.tabListTitles.eq(0).addClass('hui-tab-active');
	this.width = this.tab.width();
	this.index = 0;
	this.speed = 300;
	var _selfObj = this;
//	this.swpieMove = 0;
	this.change = function(){
		var i = 0;
		_selfObj.items.each(function(_item){
			_item.style.transform  = 'translate3d('+ ((i - _selfObj.index) * 100) +'%, 0px, 0px)';
			_item.style.transition = 'linear '+_selfObj.speed + 'ms';
			i++;
		});
		this.tab.find('.hui-tab-title').eq(0).find('div').eq(_selfObj.index).addClass('hui-tab-active').siblings().removeClass('hui-tab-active');
		if(callBack){callBack(_selfObj.index);}
	}
	this.tabListTitles.each(function(dom){
		hui(dom).click(function(){
			_selfObj.index = dom.index;
			_selfObj.change();
		});
	});
}