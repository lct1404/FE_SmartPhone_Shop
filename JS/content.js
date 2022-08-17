var baseUrl = "http://localhost:8080/api/v1";
var categories = [];
var featureProducts = [];

$("#listProductsFeatures").ready(function () {
  localStorage.removeItem("product-sv");
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

async function getListFeatureProducts() {
  var url = baseUrl + "/products?mnOPrice=20000000";
  await $.ajax({
    url: url,
    type: "GET",
    contentType: "application/json",
    dataType: "json", // datatype return
    success: function (data, textStatus, xhr) {
      // success
      featureProducts = data.result.data;
    },
    error(jqXHR, textStatus, errorThrown) {
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
}
async function fillListProducts_hot() {
  await getListFeatureProducts();

  featureProducts.forEach(function (item, index) {
    console.log(item)
    var productImage = item.productImages[0];
    $(".spnew").append(
      `
      <li style="cursor: pointer;" class="col-lg-3" style="margin-top:20px">
        <div style="cursor: pointer;" onclick="handleClickToProduct(${
          item.id
        })" >
              <img src="../Images/Products/${
                item.productImages[0].imageUrl
              }" style="width:228px;" alt="">
              <br>
              <p class="name">
                <strong style="color: #444;font-size: 14px;">${item.title}
                </strong>
              </p>
      
              <p>
                  <strong>
                      <h3>${item.promotionPrice.toLocaleString("en-US")}VNĐ</h3>
                  </strong>
              </p>
        </div>
        <div id="button" style="height: 40px;width: 100%;">
            <button onclick="handleAddToCart(${
              item.id
            })" id="button-add-cart">Thêm vào giỏ</button>
            <button  onclick="handleClickToProduct(${
              item.id
            })" id="button-buy-item">Xem chi tiết</button>
        </div>
      </li>
      `
    );
  });
}
async function fillDataContent() {
  await fillListProducts_hot();
  await getListCategories();
  fillListProducts();
}

function fillListProducts() {
  categories.forEach(function (item) {
    var htmlProductList = [];
    var products = item.products.slice(0, 4);
    products.forEach(function (product) {
      var productImage = product.productImages[0];
      htmlProductList.push(
        `<div class="col-lg-3" >` +
          `<div style="cursor: pointer;" onclick="handleClickToProduct(${product.id}, ${item.id})" >` +
          '<img src="../Images/Products/' +
          productImage.imageUrl +
          '"' +
          ' style="width:228px;" alt="smartphone"> ' +
          '<p class="name"><strong style="color: #444;font-size: 14px;">' +
          product.title +
          "<br>I Chính hãng VN/A</strong></p>" +
          "<strong><h3>" +
          product.originalPrice.toLocaleString("en-US") +
          " VNĐ</h3> </strong>" +
          `</div>` +
          '<div id="button" style="height: 40px;width: 100%;">' +
          `<button onclick="handleAddToCart(${product.id})" id="button-add-cart">Thêm vào giỏ</button>` +
          '<button onclick="handleClickToProduct(${product.id}, ${item.id})" id="button-buy-item">Xem chi tiết</button>' +
          "</div>" +
          "</div>"
      );
    });
    $("#listProductsFeatures").append(
      "<br>" +
        "<br>" +
        '<div class="row" style="justify-content: space-between">' +
        '<a class="col-lg-1">' +
        '<h5 style="margin-left: 0px;font-size: 20px;">' +
        item.name +
        "</h5>" +
        "</a>" +
        `<a onclick="showProduct(${item.id})" class="col-lg-2 xem-tat-ca" style="font-size:16px; cursor: pointer">Xem tất cả >>></a>` +
        "</div>" +
        "<br>" +
        `<div class="row" class="listProductsInCategories">${htmlProductList}</div>`
    );
  });
}
function handleAddToCart(productId) {
  var userStore = localStorage.getItem("user");
  userStore = JSON.parse(userStore);
  if (!userStore?.token) window.location.replace("../Pages/login.html");
  else {
    window.addEventListener("click", addToCart(productId));
  }
}

function handleClickToProduct(productId, categoryId = 1) {
  localStorage.removeItem("product-sv");
  localStorage.setItem(
    "product-sv",
    JSON.stringify({
      productId,
      categoryId,
    })
  );
  window.location.replace("http://127.0.0.1:5500/Pages/productDetail.html");
}
