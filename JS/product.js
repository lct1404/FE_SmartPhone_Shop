var baseUrl = "http://localhost:8080/api/v1";
var categories = [];
var product = {};
var productImages = [];
var productRates = [];
var productId;
var userId = storage.getItem("ID");

$(".detailProduct").ready(function () {
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
      productImages = product.productImages;
      fillDetailProduct();

      window.location.hash = `detailProduct?id=${productId}`;
    },
    error(jqXHR, textStatus, errorThrown) {
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
}
function fillDetailProduct() {
  $(".product-image").append(
    `<img src="../Images/Products/${productImages[0].imageUrl}" alt="Los Angeles" class="d-block w-100">   `
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
  $(".product-decription").append(
    `<p style="white-space: pre-wrap;
    color: rgba(0,0,0,.8);
    font-size: 18px;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.7;
    margin: 0"> ${product.descriptions}</p>`
  );
}

// window.addEventListener("click", handleAddToCart(userId, productId));
