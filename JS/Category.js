var baseUrl = "http://localhost:8080/api/v1/categories";
var categories = [];


function getListCategories(){
    var url = baseUrl;
    $.ajax({
        url: url,
        type: 'GET',
        contentType: "application/json",
        dataType: 'json', // datatype return
        success: function (data, textStatus, xhr) {
            // success
            categories = data.result.data;
            fillCategories();
            fillListProducts();
            fillCategoriesMenu();
        },
        error(jqXHR, textStatus, errorThrown) {
            console.log(jqXHR);
            console.log(textStatus);    
            console.log(errorThrown);
        }
    });
}



function fillCategories(){
    categories.forEach(function (item) {
        $('.list-menu').append(
            '<li style="padding-left: 10px;">' +
                '<a style="width: 100%;" href="#">' +
                    item.name + 
                '</a>' +
            '</li>'
        );
    });
}


function fillListProducts() {
    categories.forEach((function (item) {
        var htmlProductList = [];
        var products = item.products.slice(0,4);
        products.forEach((function (product) {          
            htmlProductList.push(
                '<div class="col-lg-3">' +
                `<a href="/detailProduct.html">`+
                '<img src="../Images/Products/' + product.productImages[0].imageUrl + '"' + ' style="width:228px;" alt="smartphone"> ' +
                '<p class="name"><strong style="color: #444;font-size: 14px;">' 
                    + product.title + '<br>   I Chính hãng VN/A</strong></p>' + 
                '<strong><h3>' +
                    product.originalPrice.toLocaleString('en-US') +
                '</h3></strong>'+
                '<div id="button" style="height: 40px;width: 100%;">' +
                    '<button id="button-add-cart">Thêm vào giỏ</button>'+
                    '<button id="button-buy-item">Mua Ngay</button>'+
                '</div>' +
                '</a>'+
                '</div>'         
            )               
        }))      
        $('.list-products').append(
            '<br>'+
            '<br>'+
            '<div class="row">'+
            '<a class="col-lg-1" href="#">'+
                '<h5 style="margin-left: 0px;font-size: 20px;">' + item.name + '</h5>'+
            '</a>'+
            '<div class="col-lg-9"></div>'+
            '<a class="col-lg-2 xem-tat-ca" style="font-size:16px">Xem tất cả >>></a>'+
            '</div>'+
            '<br>'+
            `<div class="row" class="listProductsInCategories">${htmlProductList}</div>`
        ); 
    }));

}
function fillCategoriesMenu(){
    categories.forEach((function (item) {
        $('#menu-Categories').append(
            `<option value=${item.id}>${item.name}
            </option>`
        );

    }));


}

// if ($value['id'] == $_GET['cateId']) { ?>
//     <option selected value="productList.php?cateId=<?= $value['id'] ?>"><?= $value['name'] ?></option>
// <?php } else { ?>
//     <option value="productList.php?cateId=<?= $value['id'] ?>"><?= $value['name'] ?></option>
// <?php } ?>

  
getListCategories();
