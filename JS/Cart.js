var cartItemUrl = "http://localhost:8080/api/v1/cartitem";

var cartItems = [];
var user = {};
var amount = 0;
let value = null;
var userId = storage.getItem("ID");

function handleClickToCart() {
  if (!storage.getItem("TOKEN"))
    window.location.replace("http://127.0.0.1:5500/login.html");
  else {
    $.ajax({
      url: "http://localhost:8080/api/v1/carts/" + userId,
      type: "GET",
      contentType: "application/json",
      dataType: "json",
      success: function (data, textStatus, xhr) {
        amount = data.amount;
        cartItems = data.cartItemList;
        user = data.user;
        fillCartItems();
      },
      error(jqXHR, textStatus, errorThrown) {
        console.log(jqXHR);
        console.log(textStatus);
        console.log(errorThrown);
      },
    });
  }
}

function fillCartItems() {
  if (cartItems.length === 0) {
    $(".container-single").empty();
    $(".container-single").append(
      `
            <h3 style="font-size:20px;color: red;">
                Giỏ hàng hiện đang rỗng ==>
                <a href="../index.html" style="text-decoration: none;">Quay lại mua hàng</a>
            </h3>
            `
    );
  } else {
    $(".order tbody").empty();
    cartItems.forEach(function (item, index) {
      $(".order tbody").append(
        `<tr>
                    <td>${index + 1}</td>
                    <td>${item.product.title}</td>
                    <td>
                        <img class="image-cart" src="../Images/Products/${
                          item.product.productImages[0].imageUrl
                        }">
                    </td>
                    <td>${item.product.promotionPrice.toLocaleString(
                      "en-US"
                    )} VND </td>
                    <td>
                        <input class="inputRate" onchange="handleChangeInputValue(event)" id="${
                          item.product.id
                        }" type="number" 
                         class="qty" value="${item.amount}" min="1">
                    </td>
                    <td>
                        <button  onclick="deleteCartItem(${
                          item.id
                        })">Xóa</button>
                        <button  onclick="buyCartItem(${
                          item.id
                        })">Thanh Toán</button>
                    </td>
                </tr>`
      );
    });
    fillUserInfor();
  }
}

function addToCart(productId, amount = 1) {
  console.log(productId, amount);
  if (!productId) return;
  else {
    var body = {
      userId: userId,
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
        console.log(jqXHR);
        console.log(textStatus);
        console.log(errorThrown);
      },
    });
  }
}

function buyCartItem(id) {
  if (!id) return;
  else {
    $.ajax({
      url: `http://localhost:8080/api/v1/carts/buyCartItem?userId=${userId}&cartItemId=${id}`,
      type: "POST",
      contentType: "application/json",
      success: function () {
        alert("Thanh toán thành công!");
        getListCartItems();
      },
      error(jqXHR, textStatus, errorThrown) {
        console.log(jqXHR);
        console.log(textStatus);
        console.log(errorThrown);
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
            <div class="buy-btn" align="center">
                <a href="#">Tiến hành đặt hàng</a>
            </div>
        `
  );
}

function deleteCartItem(id) {
  $.ajax({
    url: cartItemUrl + `?userId=${userId}&id=${id}`,
    type: "DELETE",
    success: function (result) {
      showSuccess("Success!");
      getListCartItems();
    },
    error(jqXHR, textStatus, errorThrown) {
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
}

function showSuccess(message) {
  alert(message);
}

// getListCartItems();
