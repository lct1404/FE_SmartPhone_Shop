var baseUrl = "http://localhost:8080/api/v1";
var categories = [];
var product = {};
var productImage = [];
var productRates = [];
var product_selected = localStorage.getItem("product-sv");
product_selected = JSON.parse(product_selected);
var products_inCategory = [];
var amount = 1;
var userStore = localStorage.getItem("user");
userStore = JSON.parse(userStore);
$(this).ready(function () {
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
        <input onchange="handleChangeInput(event)" id="amount" class="inputRate" type="number" value="1" class="qty" min="1" style="margin-bottom: 10px;
        padding: 4px 8px;
        outline: none;
        font-size: 12px;">
    <br>
        <button class="first-btn" onclick="handleAddToCart(${product.id})">
            <i class="ti-shopping-cart" ></i> Thêm vài giỏ hàng
        </button>
        <button >
            <i class="ti-shopping-cart"></i> Mua ngay
        </button>
    `
  );
}
function handleChangeInput(event) {
  amount = event.target.value;
}
function handleAddToCart(productId) {
  window.addEventListener("click", addToCart(productId, JSON.parse(amount)));
}

// window.addEventListener("click", handleAddToCart(userId, productId));
>>>>>>> 6fff4ebd0502e3d0fd880e3cc757f2e245866ce7
