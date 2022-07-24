var baseUrl = "http://localhost:8080/api/v1";
var categories = [];
$("#listProductsFeatures").ready(function () {
  fillDataContent();
});

async function getListCategories() {
  var url = baseUrl + "/categories";
  await $.ajax({
    url: url,
    type: "GET",
    contentType: "application/json",
    dataType: "json", // datatype return
    success: function (data, textStatus, xhr) {
      // success
      categories = data.result.data;
    },
    error(jqXHR, textStatus, errorThrown) {
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
}

async function fillDataContent() {
  await getListCategories();

  fillListProducts();
}
function fillListProducts() {
  categories.forEach(function (item) {
    var htmlProductList = [];
    var products = item.products.slice(0, 4);
    products.forEach(function (product) {
      htmlProductList.push(
        `<div class="col-lg-3" onclick="handleClickToProduct(${product.id})">` +
          `<a href="#">` +
          '<img src="../Images/Products/' +
          product.productImages[0].imageUrl +
          '"' +
          ' style="width:228px;" alt="smartphone"> ' +
          '<p class="name"><strong style="color: #444;font-size: 14px;">' +
          product.title +
          "<br>   I Chính hãng VN/A</strong></p>" +
          "<strong><h3>" +
          product.originalPrice.toLocaleString("en-US") +
          "</h3></strong>" +
          '<div id="button" style="height: 40px;width: 100%;">' +
          '<button id="button-add-cart">Thêm vào giỏ</button>' +
          '<button id="button-buy-item">Mua Ngay</button>' +
          "</div>" +
          "</a>" +
          "</div>"
      );
    });
    $("#listProductsFeatures").append(
      "<br>" +
        "<br>" +
        '<div class="row">' +
        '<a class="col-lg-1" href="#">' +
        '<h5 style="margin-left: 0px;font-size: 20px;">' +
        item.name +
        "</h5>" +
        "</a>" +
        '<div class="col-lg-9"></div>' +
        '<a class="col-lg-2 xem-tat-ca" style="font-size:16px">Xem tất cả >>></a>' +
        "</div>" +
        "<br>" +
        `<div class="row" class="listProductsInCategories">${htmlProductList}</div>`
    );
  });
}

function handleClickToProduct(productId) {
  $("#body").load("../Components/productDetail.html", () => {
    window.addEventListener("click", getProductById(productId));
  });
}
