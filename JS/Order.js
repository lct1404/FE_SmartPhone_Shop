var baseUrl = "http://localhost:8080/api/v1/orders/"
var orderItems = [];
var amount = 0;
function getListOrderItems() {
    if (!storage.getItem("TOKEN"))
        window.location.replace("http://127.0.0.1:5500/login.html")
    else {
        var userId = storage.getItem("ID");
        $.ajax({
            url: baseUrl + userId,
            type: 'GET',
            contentType: "application/json",
            dataType: 'json',
            success: function (data, textStatus, xhr) {
                amount = data.amount;
                orderItems = data.orderItems;
                fillOrderItems();
            },
            error(jqXHR, textStatus, errorThrown) {
                console.log(jqXHR);
                console.log(textStatus);
                console.log(errorThrown);
            }
        });
    }
}
function fillOrderItems() {
    if(orderItems.length === 0){
        $('.order').append(
            `
            <h3 style="font-size:20px;color: red;">
                Đơn hàng hiện đang rỗng ==>
                <a href="../index.html" style="text-decoration: none;">Quay lại mua hàng</a>
            </h3>
            `
        );
    }
    else{
        orderItems.forEach(function (item, index) {
            $('.order').append(
                `<tr>
                <td>${index + 1}</td>
                <td>${item.id}</td>
                <td>${item.createdDate}</td>
                <td>${ item.receivedDate === null ? "Đang Chờ..." : item.receivedDate}</td>
                <td>${item.status}</td>
                <td>
                    <a href="#">Chi tiết</a>
                </td>
                </tr>`
            );
    
        });
    }
}

getListOrderItems();