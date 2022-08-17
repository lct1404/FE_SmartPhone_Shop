var orderItems = [];
var amount = 0;
var userStore = localStorage.getItem("user");
userStore = JSON.parse(userStore);
$(this).ready(function () {
  fillOrderItems();
});

async function getListOrderItems() {
  var baseUrl = "http://localhost:8080/api/v1/orders/";
  var userId = userStore?.id;
  await $.ajax({
    url: baseUrl + userId,
    type: "GET",
    contentType: "application/json",
    dataType: "json",
    success: function (data, textStatus, xhr) {
      amount = data.amount;
      orderItems = data.orderItems;
    },
    error(jqXHR, textStatus, errorThrown) {
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
}
async function fillOrderItems() {
  await getListOrderItems();
  if (orderItems.length === 0) {
    $(".order").append(
      `
            <h3 style="font-size:20px;color: red;">
                Đơn hàng hiện đang rỗng ==>
                <a href="../index.html" style="text-decoration: none;">Quay lại mua hàng</a>
            </h3>
            `
    );
  } else {
    orderItems.forEach(function (item, index) {
      $(".order").append(
        `<tr class=${index % 2 == 0 ? "chan" : "le"}>
                <td>${index + 1}</td>
                <td>${item.id}</td>
                <td>${item.createdDate}</td>
                <td>${
                  item.receivedDate === null ? "Đang Chờ..." : item.receivedDate
                }</td>
                <td>${item.status}</td>
                <td>
                    <a onclick="handleClickToProduct(${
                      item.product.id
                    })" style="color: blue" href="#">Chi tiết</a>
                </td>
                </tr>`
      );
    });
  }
}
