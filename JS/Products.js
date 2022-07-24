var baseUrl = "http://localhost:8080/api/v1";
var products = [];
var listProductsFeatures = [];

// var page = 1;





function getListProductsFeatures(){
    var url = baseUrl + "/products?";
    $.ajax({
        url: url,
        type: 'GET',
        contentType: "application/json",
        dataType: 'json', // datatype return
        // beforeSend: function (xhr) {
        //     xhr.setRequestHeader("Authorization", "Basic " + btoa(storage.getItem("USERNAME") + ":" + storage.getItem("PASSWORD")));
        // },
        success: function (data, textStatus, xhr) {
            // success
            products = data.result.data;
            fillProducts();
        },
        error(jqXHR, textStatus, errorThrown) {
            console.log(jqXHR);
            console.log(textStatus);    
            console.log(errorThrown);
        }
    });
}





function fillProducts() {
    products.forEach(function (item) {
        
        $('#listProducts').append(
            '<div class="col-lg-3">' +
            '<a href="#">' +
            '<img src="../Images/Products/' + item.productImages[0].imageUrl + '"' + ' style="width:228px;" alt="smartphone"> ' +
            '<p class="name"><strong style="color: #444;font-size: 14px;">' + item.title + '<br>   I Chính hãng VN/A</strong></p>' + 
            '<strong><h3>' + item.originalPrice.toLocaleString('en-US') +'</h3></strong>'+
            '<div id="button" style="height: 40px;width: 100%;">' +
            '<button id="button-add-cart" href="">Thêm vào giỏ</button>'+
            '<button id="button-buy-item" href="">Mua Ngay</button>'+
            '</div>' +
            '</div>'
        );
 
    });
}   


function ToDetailProductPage(id){
    window.location.href = "detail"
}
