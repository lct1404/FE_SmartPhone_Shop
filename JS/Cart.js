var cartItemUrl = "http://localhost:8080/api/v1/cartitem";
const serverUrl = "http://127.0.0.1:8887";
var cartItems = [];
var user = {};
var amount = 0;
let value = null;
var userStore = localStorage.getItem("user");
userStore = JSON.parse(userStore);

$(this).ready(function () {
  fillCartItems();
});

async function getCartItems() {
  if (userStore) {
    await $.ajax({
      url: "http://localhost:8080/api/v1/carts/" + userStore.id,
      type: "GET",
      contentType: "application/json",
      dataType: "json",
      success: function (data, textStatus, xhr) {
        amount = data.amount;
        cartItems = data.cartItemList;
        user = data.user;
      },
      error(jqXHR, textStatus, errorThrown) {
        // console.log(jqXHR);
        // console.log(textStatus);
       },
    });
  }
}
async function fillCartItems() {
  await getCartItems();
  if (cartItems.length === 0) {
    $(".container-single").empty();
    $(".container-single").append(
      `
            <h3 style="font-size:20px;color: red;">
                Giỏ hàng hiện đang trống ! Cùng mua sắm thêm nào ... ==>
                <a href="../index.html" style="text-decoration: none;">Quay lại mua hàng</a>
            </h3>
            `
    );
  } else {
    $(".order tbody").empty();
    cartItems.forEach(function (item, index) {
      $(".order tbody").append(
        `<tr class=${index % 2 == 0 ? "chan" : "le"}>
                    <td>${index + 1}</td>
                    <td>${item.product.title}</td>
                    <td>
                        <img class="image-cart" src="${serverUrl}/${
          item?.product.productImages[item?.product.productImages?.length - 1]
            ?.imagePublicId == null
            ? item?.product.productImages[
                item?.product.productImages?.length - 1
              ]?.imageUrl
            : item?.product.productImages[
                item?.product.productImages?.length - 1
              ]?.imagePublicId
        }">
                    </td>
                    <td>${item.product.promotionPrice.toLocaleString(
                      "en-US"
                    )} VND </td>
                    <td>
                        <input class="inputRate" onchange="handleChangeInputValue(event)" id="${
                          item.product?.id
                        }" type="number" 
                         class="qty" value="${item.amount}" min="1">
                    </td>
                    <td>
                        <button style="
                        border: none;
                        border-radius: 10px;
                        padding: 4px 12px;
                        background: red;
                        color: #fff;
                    "  onclick="deleteCartItem(${item.id})">Xóa</button>
                        <button style="
                        border: none;
                        border-radius: 10px;
                        padding: 4px 12px;
                        background: #1da1f2;
                        color: #fff;
                    "  onclick="buyCartItem(${item.id})">Thanh Toán</button>
                    </td>
                </tr>`
      );
    });
    fillUserInfor();
  }
}

function addToCart(productId, amount = 1) {
  if (!productId) return;
  else {
    var body = {
      userId: user?.id,
      productId: productId,
      amount: amount,
    };
    $.ajax({
      url: "http://localhost:8080/api/v1/carts/addCartItem",
      type: "POST",
      data: JSON.stringify(body), // body
      contentType: "application/json",
      success: function () {
        alert("Thêm vào giỏ hàng thành công!");
      },
      error(jqXHR, textStatus, errorThrown) {
        // console.log(jqXHR);
        // console.log(textStatus);
       },
    });
  }
}

function buyCartItem(id) {
  if (!id) return;
  else {
    $.ajax({
      url: `http://localhost:8080/api/v1/carts/buyCartItem?userId=${user?.id}&cartItemId=${id}`,
      type: "POST",
      contentType: "application/json",
      success: function () {
        alert("Thanh toán thành công!");
        fillCartItems();
      },
      error(jqXHR, textStatus, errorThrown) {
        // console.log(jqXHR);
        // console.log(textStatus);
       },
    });
  }
}

function buyListCartItem() {
  var conf = confirm(
    "Bạn có chắc chắn muốn tiến hành đặt cả giỏ hàng hiện tại ?"
  );
  if (conf) {
    $.ajax({
      url: `http://localhost:8080/api/v1/carts/buyListCartItems/${user?.id}`,
      type: "POST",
      contentType: "application/json",
      beforeSend: function (xhr) {
        xhr.setRequestHeader("Accept", "*/*");
      },
      success: function () {
        alert("Thanh toán thành công!");
        fillCartItems();
      },
      error(jqXHR, textStatus, errorThrown) {
        fillCartItems();
      },
    });
  }
}

function fillUserInfor() {
  var sumMoney = 0;
  cartItems.forEach(function (item) {
    sumMoney += item.amount * item.product.promotionPrice;
  });
  $(".buy").empty();
  $(".buy").append(
    `
            <h3>Thông tin đơn đặt hàng</h3>
            <div>
                Người đặt hàng: <b>${user.fullName}</b>
            </div>
            <div>
                Số lượng: <b id="qtycart">${amount} đơn</b>
            </div>
            <div>
                Tổng tiền: <b id="totalcart">${sumMoney.toLocaleString(
                  "en-US"
                )} VND</b>
            </div>
            <div>
                Địa chỉ nhận hàng: <b>${user.address}</b>
            </div>
            <div class="buy-btn" align="center" onclick="buyListCartItem()" >
                <a href="#">Tiến hành đặt hàng</a>
            </div>
        `
  );
}

function deleteCartItem(id) {
  $.ajax({
    url: cartItemUrl + `?userId=${userStore.id}&id=${id}`,
    type: "DELETE",
    success: function (result) {
      showSuccess("THành công !");
      fillCartItems();
    },
    error(jqXHR, textStatus, errorThrown) {
      // console.log(jqXHR);
      // console.log(textStatus);
      alert("Đã xảy ra lỗi ! Vui lòng kiểm tra lại ...");
    },
  });
}

function showSuccess(message) {
  alert(message);
}

// getListCartItems();
