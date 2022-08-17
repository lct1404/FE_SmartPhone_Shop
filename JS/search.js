var products_search = [];

var search_value = localStorage.getItem("search-value");
$(this).ready(function () {
  if (search_value) {
    fillSeachLayout();
  }
});

async function fillSeachLayout() {
  await getListProductBySearched();
  document.getElementById(
    "search"
  ).innerHTML = `Kết quả tìm kiếm: ${search_value}`;

  products_search.forEach(function (item, index) {
    $(".list-product_searched").append(
      `
      <li style="cursor: pointer;" class="col-lg-3" style="margin-top:20px">
        <div style="cursor: pointer;" onclick="handleClickToProduct(${
          item.id
        })" >
              <img src="${serverUrl}/${item?.productImages[item?.productImages?.length - 1]?.imageUrl}" style="width:228px;" alt="">
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
            <button onclick="handleClickToProduct(${
              item.id
            })" id="button-buy-item">Xem chi tiết</button>
        </div>
      </li>
      `
    );
  });
}
async function getListProductBySearched() {
  var baseUrl = "http://localhost:8080/api/v1";
  var url = baseUrl + "/products?search=" + search_value;
  await $.ajax({
    url: url,
    type: "GET",
    contentType: "application/json",
    dataType: "json", // datatype return
    success: function (data, textStatus, xhr) {
      // success
      products_search = data.result.data;
    },
    error(jqXHR, textStatus, errorThrown) {
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
}
