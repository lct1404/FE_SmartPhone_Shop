var listOrder = [];
var Status = "Processing";
var detailOrderItem = {};
var userBuy = {};


$(".container").ready(function () {
    fillDataContent();
});

function transferStatus(Status) {
    if (Status == "Processing") return "Đang xử lý";
    if (Status == "Processed") return "Đã xử lý";
    if (Status == "Delivering") return "Đang vận chuyển";
    if (Status == "Complete") return "Hoàn thành";
}

async function openTab(tabName) {
    Status = tabName;
    listOrder = [];
    await fillDataContent();
    console.log(listOrder);
}

async function fillDataContent() {
    await getListOrdersByStatus();
    fillListOrderByStatus();
}

async function getListOrdersByStatus() {
    var url = `http://localhost:8080/api/v1/orderitems?status=${Status}`;
    await $.ajax({
        url: url,
        type: "GET",
        contentType: "application/json",
        dataType: "json", // datatype return
        success: function (data, textStatus, xhr) {
            // success
            listOrder = data;
        },
        error(jqXHR, textStatus, errorThrown) {
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
        },
    });
}

async function fillListOrderByStatus() {
    await getListOrdersByStatus();
    $(`.tabcontent`).empty();
    $(".tabcontent").append(
        `
            <div id="${Status}" >
                <table class="list">
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th>Mã đơn hàng</th>
                            <th>Ngày đặt</th>
                            <th>Ngày giao hàng</th>
                            <th>Tình trạng</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>

                    </tbody>
                </table>
            </div>
        `
    );
    if(listOrder.length == 0){
        $(`#${Status} .list tbody`).append(
            `
                <tr>
                    <td colspan="6">Không có sản phẩm nào ${transferStatus(Status)}!</td>
                </tr>
            `
        );
    }

    listOrder.forEach(function (item, index) {
        $(`#${Status} .list tbody`).append(
            `
                <tr>
                    <td>${index + 1}</td>
                    <td>${item.id}</td>
                    <td>${item.createdDate}</td>
                    <td>${item.receivedDate ? item.receivedDate : "Hãy xác nhận đơn hàng để biết ngày nhận hàng"}</td>
                    <td>${transferStatus(Status)}</td>
                    <td>
                        ${item.status == "Processed"? `<a href="#" onclick="handleClickConfirm(${item.id})">Giao Hàng</a>` : `<a href="#" onclick="handleClickDetail(${item.id})">Chi tiết</a>`}
                    </td>   
                </tr>
            `
        );
    });
}

async function getDetailOrderItem(id){
    var url = `http://localhost:8080/api/v1/orderitems/${id}`;
    await $.ajax({
        url: url,
        type: "GET",
        contentType: "application/json",
        dataType: "json", // datatype return
        success: function (data, textStatus, xhr) {
            // success
            detailOrderItem = data;
        },
        error(jqXHR, textStatus, errorThrown) {
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
        },
    });
}

async function getUserBuy(id){
    var url = `http://localhost:8080/api/v1/orderitems/userBuy/${id}`;
    await $.ajax({
        url: url,
        type: "GET",
        contentType: "application/json",
        dataType: "json", // datatype return
        success: function (data, textStatus, xhr) {
            // success
            userBuy = data;
        },
        error(jqXHR, textStatus, errorThrown) {
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
        },
    });
}

var innerHTML = "";
function generateHtmlStatus(status , id) {
    if(status == "Processing")
        innerHTML = 
            `<a href='#' class="handleFunction" onclick='handleClickConfirm(${id})'> Xác nhận </a>
             <a href='#' class="handleFunction" onclick='handleClickDelete(${id})'> Xóa </a>`
        
    if(status == "Delivering")
        innerHTML =
            `<a href='#' class="handleFunction" onclick='handleClickConfirm(${id})'> Xác nhận </a>`
}

async function handleClickDetail(id) {

    $(".tabcontent").empty();
    await getDetailOrderItem(id);
    await getUserBuy(id);
    innerHTML = "";
    generateHtmlStatus(detailOrderItem?.status ,detailOrderItem?.id);
    var detail = `
        
        <tr>
            <td>${detailOrderItem?.product?.title}</td>
            <td>
            <img class="image-cart" src="../../../Images/Products/${
            detailOrderItem?.product?.productImages[0]?.imageUrl
            }" alt="">
            </td>
            <td>${detailOrderItem?.product?.promotionPrice}</td>
            <td>${detailOrderItem.amount}</td>
            <td>${(
            detailOrderItem?.product?.promotionPrice * detailOrderItem.amount
            ).toLocaleString("en-US")}</td>
            <td>${userBuy.fullName}</td>
            <td>${userBuy.phoneNumber}</td>
            <td>${userBuy.address}</td>
        </tr>
       
    `;
    $(".tabcontent").append(
        `   
            <div class="title">
                <h5>Chi tiết đơn đặt hàng ${detailOrderItem.id}</h5>
            </div>
            <table class="list">
                <thead>
                    <tr>
                        <th rowspan="2">Tên sản phẩm</th>
                        <th rowspan="2">Hình ảnh</th>
                        <th rowspan="2">Đơn giá</th>
                        <th rowspan="2">Số lượng</th>
                        <th rowspan="2">Thành tiền</th>
                        <th colspan="3" width="300px">
                            Người Mua
                        </th>
                    </tr>
                    <tr >
                        <th width="100px">Tên người mua</th>
                        <th>SĐT</th>
                        <th width="150px">Địa chỉ</th>
                    </tr>
                </thead>
                <tbody>
                    ${detail}
                </tbody>
            </table>
            ${innerHTML}
        `
    );
}


async function handleClickConfirm(id){
    await getDetailOrderItem(id);
    var updateStatus = "";
    if(detailOrderItem.status == "Processing")
        updateStatus = "Processed";
    if(detailOrderItem.status == "Processed")
        updateStatus = "Delivering";
    if(detailOrderItem.status == "Delivering")
        updateStatus = "Complete";
    await $.ajax({
        url: `http://localhost:8080/api/v1/orderitems?status=${updateStatus}&id=${id}`,
        type: 'PUT',
        success: function (data, textStatus, xhr) {
            fillListOrderByStatus();
        },
        error(jqXHR, textStatus, errorThrown) {
            alert("Error when update order status");
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
        }
    });
}

async function handleClickDelete(id){
    await $.ajax({
        url: `http://localhost:8080/api/v1/orderitems/${id}`,
        type: 'DELETE',
        success: function (data, textStatus, xhr) {
            fillListOrderByStatus();
        },
        error(jqXHR, textStatus, errorThrown) {
            alert("Error when update order status");
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
        }
    });
}