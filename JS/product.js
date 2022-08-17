var baseUrl = "http://localhost:8080/api/v1";
var categories = [];
var product = {};
var category = {};
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
    },
    error(jqXHR, textStatus, errorThrown) {
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
}

async function getCategoryById(CategoryId) {
  var url = baseUrl + `/categories/${CategoryId}`;
  await $.ajax({
    url: url,
    type: "GET",
    contentType: "application/json",
    dataType: "json", // datatype return
    success: function (data, textStatus, xhr) {
      // success
      category = data.result.data;
    },
    error(jqXHR, textStatus, errorThrown) {
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
}

async function fillDetailProduct() {
  await getProductById(product_selected?.productId);
  await getCategoryById(product_selected?.categoryId);
  products_inCategory = category.products;
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
        <input onchange="handleChangeInput(event)" id="amount" class="inputRate" type="number" value="1" class="qty" min="1" style="margin-bottom: 10px;
        padding: 4px 8px;
        outline: none;
        font-size: 12px;">
    <br>
        <button class="first-btn" onclick="handleAddToCart(${product.id})">
            <i class="ti-shopping-cart" ></i> Thêm vài giỏ hàng
        </button>
        <button>
            <i class="ti-shopping-cart"></i> Mua ngay
        </button>
    `
  );
  $(".chi-tiet-sp").append(`
  
  <div class="a3">
    <div class="a3-1">
        Danh Mục
    </div>
    <div class="a3-2">
        <i class="ti-angle-right"></i>
        <ul class="danhMuc" style="display: flex; list-style:none; align-items: center; margin: 0;">
            <li style="display: flex; align-items:center">
                <a style="color: #05a; font-size: 16px" href="#">${category.name}</a>
            </li>
            <div style="margin: 0 12px;">>></div>
            <li style="display: flex; align-items:center">
                <a style="color: #05a; font-size: 16px" href="#">${product.title}</a>
            </li>
        </ul>
    </div>
  </div>        
  <div class="a3">
    <div class="a3-1">Thương Hiệu</div>
    <div class="a3-2 brand-name">
        <a style="padding-left: 20px;color: #05a; font-size: 16px" href="#">${category.name}</a>
    </div>
  </div>
  
  `);
  $(".mo-ta-sp").append(
    `
    <div class="c11">
        <p style="font-size: 20px; display: contents">
            ${product.descriptions}
        </p>
    </div>
    `
  );
  view_more_products();
}
function view_more_products() {
  var html_products = products_inCategory.map((item) => {
    var imgObj = item.productImages[0];
    return `
    <div class="col-lg-3">
    <a href="#">      
        <img src="../Images/Products/${
          imgObj.imageUrl
        }" style="width:228px;" alt="">
        <p class="name"><strong style="color: #444;font-size: 14px;">
            ${item.title}
        <br>   I Chính hãng VN/A</strong></p>
        <p>
            <strong>
                <h3></h3>
            </strong>
            <del>
                <h3>
                ${product.promotionPrice.toLocaleString("en-US")}VND
                </h3>
            </del>
        </p>
        <div id="button" style="height: 40px;width: 100%;">
            <a id="button-add-cart" href="#">         Thêm vào giỏ
            </a>
            <a id="button-detail" href="#">
                Xem chi tiết
            </a>
        </div>
    </a>
    </div>
  `;
  });
  $(".more-product-same").append(html_products);
}
function handleChangeInput(event) {
  amount = event.target.value;
}
function handleAddToCart(productId) {
  window.addEventListener("click", addToCart(productId, JSON.parse(amount)));
}
