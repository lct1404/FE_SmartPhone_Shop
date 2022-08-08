var categories = [];
var category = {};
var products = [];
var categoryId = localStorage.getItem("category-sv");
$(this).ready(function () {
  $("#header").load("../Components/header.html", () => {});
  $("#footer").load("../Components/footer.html", () => {});

  fillCategoryItem();
  fillListProducts();
});

async function getListCategory() {
  var url = "http://localhost:8080/api/v1" + `/categories`;
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

async function getProductsbyCategoryId(id) {
  var url = "http://localhost:8080/api/v1" + `/categories/${id}`;
  await $.ajax({
    url: url,
    type: "GET",
    contentType: "application/json",
    dataType: "json", // datatype return
    success: function (data, textStatus, xhr) {
      // success
      category = data.result.data;
      products = category.products;
      fillListProducts();
    },
    error(jqXHR, textStatus, errorThrown) {
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
}

async function fillCategoryItem() {
  await getListCategory();
  await getProductsbyCategoryId(categoryId);
  categories.forEach(function (item, index) {
    if (item.id === category.id) {
      $("#menu-Categories").append(
        `<option selected  value="${item.id}">${item.name}</option>`
      );
    } else {
      $("#menu-Categories").append(
        `<option value="${item.id}">${item.name}</option>`
      );
    }
  });
}

function fillListProducts() {
  $(".list_Product_In_Category").empty();
  products.forEach(function (item, index) {
    $(".list_Product_In_Category").append(
      `
      <div class="col-lg-3" style="margin-top:20px">
						<a href="#">      
							<img src="../Images/Products/${
                item.productImages[0].imageUrl
              }" style="width:228px;" alt="">
							<p class="name"><strong style="color: #444;font-size: 14px;">
                ${item.title}
							<br>   I Chính hãng VN/A</strong></p>
							<p>
              <h1>${item.promotionPrice.toLocaleString("en-US")}VNĐ</h1>
							</p>
							<div id="button" style="height: 40px;width: 100%;">
                <button onclick="handleAddToCart(${
                  item.id
                })" id="button-add-cart">Thêm vào giỏ</button>
                <button id="button-buy-item">Xem chi tiết</button>
							</div>
						</a>
					</div>
      `
    );
  });
}

$("#menu-Categories").change(function () {
  var selectedCat = $(this).children("option:selected").val();
  category = categories.filter((item) => {
    return item.id === JSON.parse(selectedCat);
  });
  products = category[0].products;
  fillListProducts();
});
