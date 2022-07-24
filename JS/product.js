var baseUrl = "http://localhost:8080/api/v1";
var categories = [];
var product = {};
var productImage = [];
var productRates = [];
var productId;
var userId = storage.getItem("ID");

$(".detailProduct").ready(function () {
  window.location.hash = `/detailProduct?id=${productId}`;
  fillDetailProduct();
});

async function getProductById(productId) {
  var url = baseUrl + `/products/${productId}`;
  await $.ajax({
    url: url,
    type: "GET",
    contentType: "application/json",
    dataType: "json", // datatype return
    success: function (data, textStatus, xhr) {
      // success
      product = data.result.data;
      productImage = product.productImages;
      fillDetailProduct();
    },
    error(jqXHR, textStatus, errorThrown) {
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
}
async function fillDetailProduct() {
  $(".product-image").append(
    `<img src="../Images/Products/${productImage[0].imageUrl}" alt="Los Angeles" class="d-block w-100">   `
  );
  $(".category-name").append(
    ` <p style="font-weight: bold;font-size: 40px;">Điện thoại ${product.title}</p>`
  );
  $(".product-rate").append(
    `<h1>${product.promotionPrice.toLocaleString("en-US")}VNĐ</h1>`
  );
  $(".giohang").append(
    `
        <button onclick="handleAddToCart(${(userId, productId)})">
            <i class="ti-shopping-cart" ></i> Thêm vài giỏ hàng
        </button>
        <button>
            <i class="ti-shopping-cart"></i> Mua ngay
        </button>
    `
  );
}

window.addEventListener("click", handleAddToCart(userId, productId));
