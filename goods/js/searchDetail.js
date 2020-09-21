/**
 * Created by admin on 2018/7/24.
 */

function getRequestData(){
    if(requestType=="GET"){
        var dataG={};
        dataG.genreId=genreId;
        dataG.pageSize=10;
        dataG.pageIndex=pageIndex;
        dataG.productThreeId = _productThreeId;
        dataG.keyWords = keyword;
        data=dataG;
    }else{
        var dataP={};
        dataP.keyword=keyword;
        dataP.pageSize=10;
        dataP.pageIndex=pageIndex;
        data=JSON.stringify(dataP);
    }
}


function getThirdId(num) {
    $.ajax({
        type : 'GET',
        dataType : 'json',
        url : '/goods/goodsCategory/getThirdId',
        data : {
            genreId : parseInt(num)
        },
        async : false,
        success : function(data) {
            var list = data.data;
            var html = '<div class="classify-item" id="0" onclick="productThreeId(this)">全部</div>';
            if(list != null && list.length > 0) {
                for (var i = 0; i < list.length; i++) {
                    var productThree = list[i];
                    var id = productThree.id;
                    var name = productThree.name;
                    if(name != "香烟") {
                        html += '<div class="classify-item" id='+id+' onclick="productThreeId(this)">'+name+'</div>';
                    }
                }
            }
            $("#slideshow1").append(html);
            hui('#classify_container').scrollX(5, '.classify-item');
            $(".classify-item").first().addClass("active");
        },
    });
}