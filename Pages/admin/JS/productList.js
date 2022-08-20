var products = [];
var curPage = 1;
var productCount = 0;
var listCategoties = [];
var oldFile;
var form = new FormData();
const serverUrl = "http://127.0.0.1:8887";
// var curImage = 0;

$(".container").ready(function () {
  fillDataContent();
});

async function fillDataContent() {
  await getListProducts();
  fillListProducts();
}

async function getListProducts() {
  var url = `http://localhost:8080/api/v1/products?page=${curPage}&perPage=5`;
  await $.ajax({
    url: url,
    type: "GET",
    contentType: "application/json",
    dataType: "json", // datatype return
    success: function (data, textStatus, xhr) {
      // success
      products = data.result.data;
    },
    error(jqXHR, textStatus, errorThrown) {
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
}

async function getCountProducts() {
  await $.ajax({
    url: "http://localhost:8080/api/v1/products/count",
    type: "GET",
    contentType: "application/json",
    dataType: "json", // datatype return
    success: function (data, textStatus, xhr) {
      // success
      productCount = data;
    },
    error(jqXHR, textStatus, errorThrown) {
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
}

async function fillListProducts() {
  await getListProducts();
  await getCountProducts();
  $(".list tbody").empty();
  $(".pagination").empty();
  products.forEach(function (item, index) {
    $(".list tbody").append(
      `
            <tr>
            <td>${item.id}</td>
            <td>${item.title}</td>
            <td><img class="image-cart" src="${serverUrl}/${
        item?.productImages[item?.productImages?.length - 1]?.imagePublicId ==
        null
          ? item?.productImages[item?.productImages?.length - 1]?.imageUrl
          : item?.productImages[item?.productImages?.length - 1]?.imagePublicId
      }" alt=""></td>
            <td>${item.originalPrice.toLocaleString("en-US")} VND</td>
            <td>${item.promotionPrice.toLocaleString("en-US")} VND</td>
            <td>${item.amount}</td>
            <td>${item.status == "OPENING" ? "Mở" : "Đóng"}</td>
            <td>
                <a href="#" data-toggle="modal" data-target="#addAndUpdateProductModal" onclick="openModalUpdate(${
                  item.id
                })">Xem/Sửa</a><br>
                <button id="btn-active-pro" onclick="handleClickActive(${
                  item.id
                })">
                    ${item.status == "OPENING" ? "Đóng" : "MỞ"}
                </button>
            </td>
            </tr>
        `
    );
  });
  var pages = Math.ceil(productCount / 5);
  for (let index = 1; index <= pages; index++) {
    $(".pagination").append(
      `
                <button class="${
                  index == curPage ? "active" : null
                }" onclick="handleClick(${index})">
                    ${index}
                </button>
            `
    );
  }
}

async function handleClick(index) {
  curPage = index;
  console.log(curPage);
  products = [];
  await fillDataContent();
}

async function handleClickActive(id) {
  var conf = "";
  var product = products.filter((item) => {
    return item.id == id;
  });
  var url;
  if (product[0].status == "OPENING") {
    url = `http://localhost:8080/api/v1/products/lock/${id}`;
    conf = "khóa";
  } else {
    url = `http://localhost:8080/api/v1/products/unlock/${id}`;
    conf = "mở"
  }

  var confirm = window.confirm("Bạn có chắc chắn muốn " + conf);
  if(confirm){
    await $.ajax({
      url: url,
      type: "PUT",
      contentType: "application/json",
      success: function (data) {
        console.log(data);
      },
      error(jqXHR, textStatus, errorThrown) {
        console.log(jqXHR);
        console.log(textStatus);
        console.log(errorThrown);
      },
    });
    await fillListProducts();
  }
}

async function showProductModal() {
  $("#modal-cat-select").empty();
  await $.ajax({
    url: "http://localhost:8080/api/v1/categories",
    type: "GET",
    contentType: "application/json",
    success: function (data) {
      listCategoties = data.result.data;
    },
    error(jqXHR, textStatus, errorThrown) {
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
  listCategoties = listCategoties.filter((item) => {
    return item.status == "ACTIVE";
  });
  listCategoties.forEach((item) => {
    $("#modal-cat-select").append(
      `
                <option value="${item.id}">${item.name}</option>
            `
    );
  });
}

function hideProductModal() {
  $("[data-dismiss=modal]").trigger({ type: "click" });
}

// save
function saveProduct() {
  var id = document.getElementById("product-id").value;
  if (!id) {
    openAddProductModal();
  } else {
    updateProduct(id);
  }
  resetForm();
}

// open create modal
function openAddProductModal() {
  document.getElementById("exampleModalLabel").innerHTML = "Thêm sản phẩm mới";
  var title = document.getElementById("modal-title").value;
  var originalPrice = document.getElementById("modal-originalPrice").value;
  var promotionPrice = document.getElementById("modal-promotionPrice").value;
  var cat = $("#modal-cat-select option:selected").val();
  var amount = document.getElementById("modal-amount").value;
  var des = document.getElementById("modal-descriptions").value;

  // // validation data
  // var valTitle = isValidProductTitle(title);
  // var valDes = isValidProductDes(des);
  // if(!valTitle || !valDes)
  //     return;

  // check product title existed
  $.get(
    "http://localhost:8080/api/v1/products/existsTitle/" + title,
    function (data, status) {
      // error
      if (status == "error") {
        // TODO
        alert("Error when loading data");
        return;
      }
      if (data) {
        // show error message
        showFieldErrorMessage(
          "modal-input-errMess-title",
          "modal-title",
          "Sản phẩm này đã tồn tại!"
        );
        return;
      } else {
        createProductViaAPI(
          title,
          originalPrice,
          promotionPrice,
          cat,
          amount,
          des
        );
      }
    }
  );
}

async function createProductViaAPI(
  title,
  originalPrice,
  promotionPrice,
  cat,
  amount,
  des
) {
  // call api create department
  var newProduct = {
    title: title,
    descriptions: des,
    originalPrice: originalPrice,
    promotionPrice: promotionPrice,
    amount: amount,
    categoryId: cat,
  };
  var createdProduct = {};
  await $.ajax({
    url: "http://localhost:8080/api/v1/products",
    type: "POST",
    data: JSON.stringify(newProduct), // body
    contentType: "application/json",
    // type of body (json, xml, text)
    success: function (data, textStatus, xhr) {
      // success
      createdProduct = data;
      hideProductModal();
      alert("Success! New Product created!");
      fillDataContent();
    },
    error(jqXHR, textStatus, errorThrown) {
      alert("Error when create product");
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
  await callApiPostOrPutProductImages(createdProduct.id);
}

function createProductImages(e) {
  $("#image_product").empty();
  var file = e.target.files[0];
  var reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onloadend = (e) => {
    $("#image_product").append(
      `<img id="image_preview" src="${reader.result}" width="128px" height="128px" alt=""></img>`
    );
    form.append("files", file);
  };
}

async function callApiPostOrPutProductImages(id) {
  await $.ajax({
    url: `http://localhost:8080/api/v1/product-images?productId=${id}`,
    type: "POST",
    data: form, // body
    contentType: false, // NEEDED, DON'T OMIT THIS (requires jQuery 1.6+)
    processData: false,
    // type of body (json, xml, text)
    success: function (data, textStatus, xhr) {
      console.log(data);
    },
    error(jqXHR, textStatus, errorThrown) {
      alert("Error when upload images");
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
}

function resetForm() {
  document.getElementById("exampleModalLabel").innerHTML = "";
  document.getElementById("modal-title").value = "";
  document.getElementById("modal-originalPrice").value = "";
  document.getElementById("modal-promotionPrice").value = "";
  document.getElementById("modal-amount").value = "";
  document.getElementById("modal-descriptions").value = "";
}

// functions validation properties of product
function isValidProductTitle(name) {
  if (!name) {
    // show error message
    // showFieldErrorMessage("modal-input-errMess-title", "modal-title", error_message_title);
    return false;
  }
  // validate format
  var regex = new RegExp("^(?=.*[a-z])[a-zA-Z0-9_.-]{6,50}$");
  if (!regex.test(name)) {
    // showFieldErrorMessage("modal-input-errMess-title", "modal-title", error_message_tile);
    return false;
  }
  hideFieldErrorMessage("modal-input-errMess-title", "modal-title");
  return true;
}

function isValidProductDes(name) {
  if (!name) {
    // show error message
    // showFieldErrorMessage("modal-input-errMess-des", "modal-descriptions", error_message_name);
    return false;
  }
  // validate format
  var regex = new RegExp("^(?=.*[a-z])[a-zA-Z0-9_.-]{6,50}$");
  if (!regex.test(name)) {
    // showFieldErrorMessage("modal-input-errMess-des", "modal-descriptions", error_message_name);
    return false;
  }
  hideFieldErrorMessage("modal-input-errMess-des", "modal-descriptions");
  return true;
}

function openModalUpdate(id) {
  resetForm();
  document.getElementById("exampleModalLabel").innerHTML = "Sửa thông tin sản phẩm";
  $("#input-item-categories").hide();
  $("#image_product").empty();
  var product = products.filter((item) => {
    return item.id == id;
  });
  console.log(product);
  document.getElementById("product-id").value = product[0].id;
  document.getElementById("modal-title").value = product[0].title;
  document.getElementById("modal-originalPrice").value =
    product[0].originalPrice;
  document.getElementById("modal-promotionPrice").value =
    product[0].promotionPrice;
  document.getElementById("modal-amount").value = product[0].amount;
  document.getElementById("modal-descriptions").value = product[0].amount;
  $("#image_product").append(
    `<img id="image_preview" src="${serverUrl}/${
      products[0]?.productImages[products[0]?.productImages?.length - 1]
        ?.imagePublicId == null
        ? products[0]?.productImages[products[0]?.productImages?.length - 1]
            ?.imageUrl
        : products[0]?.productImages[products[0]?.productImages?.length - 1]
            ?.imagePublicId
    }" width="128px"alt=""></img>`
  );
}

async function updateProduct(id) {
  var title = document.getElementById("modal-title").value;
  var originalPrice = document.getElementById("modal-originalPrice").value;
  var promotionPrice = document.getElementById("modal-promotionPrice").value;
  var amount = document.getElementById("modal-amount").value;
  var des = document.getElementById("modal-descriptions").value;

  // vali data

  var updateProduct = {
    title: title,
    descriptions: des,
    originalPrice: originalPrice,
    promotionPrice: promotionPrice,
    amount: amount,
  };
  await $.ajax({
    url: "http://localhost:8080/api/v1/products/" + id,
    type: "PUT",
    data: JSON.stringify(updateProduct), // body
    contentType: "application/json",
    // type of body (json, xml, text)
    success: function (data, textStatus, xhr) {
      // success
      hideProductModal();
      alert("Success! updated Success");
      
    },
    error(jqXHR, textStatus, errorThrown) {
      alert("Error when update product");
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
  await callApiPostOrPutProductImages(id);
  fillDataContent();
}

// show message error
function showFieldErrorMessage(messageId, inputId, message) {
  document.getElementById(messageId).innerHTML = message;
  document.getElementById(messageId).style.display = "block";
  document.getElementById(inputId).style.border = "1px solid red";
}

// hide message error
function hideFieldErrorMessage(messageId, inputId) {
  document.getElementById(messageId).style.display = "none";
  document.getElementById(inputId).style.border = "1px solid #ccc";
}
