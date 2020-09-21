var datas = {
	columnName:"罗莱家纺专场",
	pageIndex:1,
	pageSize:7
}
var url="/localQuickPurchase/selectionGoods/SelectionGoodsCom";
var proId='';
var list='';
$.ajax({
	type:"post",
	url:url,
	async:true,
	dataType:'json',
	data:JSON.stringify(datas),
	contentType : 'application/json;charset=UTF-8',
	success:function(data){
		console.log(data);
		if(data.code == 200 && data.data.list != null){
			for (var i=0;i<data.data.list.length;i++) {
				//<p class="pro-quan">【领券满减优惠】+ 产品方案</p>
				list+=`
					<li class="product-item">
						<div class="pro-img">
							<img src="${data.data.list[i].listGoodsImg[0].goodsImgPath}" />
						</div>
						<div class="pro-desc">
							<p class="pro-title">${data.data.list[i].goodsName}</p>
						</div>
						<div class="pro-price">
							<a href="javascript:void(0);">
								<span class="yuan">￥</span>
								<span class="new">${data.data.list[i].goodsProStandard[0].distributionPrice}</span>
								<span class="old">￥${data.data.list[i].goodsProStandard[0].goodsPrice}</span>
							</a>
						</div>
					</li>
				`;
				$('.product-list').html(list);
			}
		}
		
		$('.product-item').each(function(i){
			$('.product-item').eq(i).on('click',function(){
//				console.log(i);
//				console.log(data.data.list[i].goodsId)
				proId=data.data.list[i].goodsId	;
				if(proId=="" || proId==null){
					proId=0;
				}
				location.href='/localQuickPurchase/distributionVA/goodsDetail/'+proId+'/0/' + seq;
			})
		})
	}
	
});	

function bubbleSort(arr){
    var flag = false;  // 定义一个变量为false，未交换位置
    for(var i=0;i<arr.length-1;i++){
        for(var j=0;j<arr.length-1;j++){
            if(arr[j+1].distributionPrice<arr[j].distributionPrice){
                temp = arr[j+1];
                arr[j+1] = arr[j];
                arr[j] = temp;
                flag = true; //true，已交换位置
            }
        }
        if(flag){
            flag = false; //如果交换了位置，将flag重新设为false
        }else{
             break;       //如果未交换，则跳出循环
        }
    }
    return arr;
}

