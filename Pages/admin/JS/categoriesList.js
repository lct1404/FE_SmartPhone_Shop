var categoties = [];
var curPage = 1;

$(".container").ready(function () {
  fillDataContent();
});

async function fillDataContent() {
  await getListCategories();
  fillListCategories();
}

async function getListCategories() {
  var url = `http://localhost:8080/api/v1/categories?page=${curPage}&perPage=5`;
  await $.ajax({
    url: url,
    type: "GET",
    contentType: "application/json",
    dataType: "json", // datatype return
    success: function (data, textStatus, xhr) {
      // success
      categoties = data.result.data;
    },
    error(jqXHR, textStatus, errorThrown) {
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
}

async function fillListCategories() {
  await getListCategories();
  $(".list tbody").empty();
  $(".pagination").empty();

  

  categoties.forEach(function (item, index) {
    $(".list tbody").append(
      `
                <tr>
                    <td>${index + 1}</td>
                    <td>${item.name}</td>
                    <td>${item.status == "ACTIVE" ? "Mở" : "Đóng"}</td>
                    <td>
                        <a href="#" data-toggle="modal" data-target="#addAndUpdateCategoryModal" onclick="openUpdateCategory(${
                          item.id
                        })">Xem/Sửa</a><br>
                        <button id="btn-active-pro"  onclick="handleClickActive(${
                          item.id
                        })">
                            ${item.status == "ACTIVE" ? "Đóng" : "MỞ"}
                        </button>
                    </td>
                </tr>
            `
    );
  });
  console.log("leng = " + categoties.length);
  var pages = Math.ceil(categoties.length / 3);
  console.log("hihi = " + pages);
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
  categoties = [];
  await fillDataContent();
}

async function handleClickActive(id) {
  var conf = "";
  var category = categoties.filter((item) => {
    return item.id == id;
  });
  var url;
  if (category[0].status == "ACTIVE") {
    url = `http://localhost:8080/api/v1/categories/lockCategory/${id}`;
    conf = "khóa";
  } else {
    url = `http://localhost:8080/api/v1/categories/unLockCategory/${id}`;
    conf = "mở";
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
    await fillListCategories();
  }
}

function hideCategoryModal() {
  $("[data-dismiss=modal]").trigger({ type: "click" });
}

// save
function saveCategory() {
  var id = document.getElementById("cat-id").value;
  console.log(id);
  if (!id) {
    openAddCategoryModal();
    resetForm();
  } else {
    updateCategory();
  }
}

// open create modal
function openAddCategoryModal() {
  document.getElementById("exampleModalLabel").innerHTML = "Thêm danh mục mới";
  var name = document.getElementById("modal-name").value;

  // // validation data
  // var valTitle = isValidProductTitle(title);
  // var valDes = isValidProductDes(des);
  // if(!valTitle || !valDes)
  //     return;

  // check product title existed
  $.get(
    "http://localhost:8080/api/v1/categories/existed/" + name,
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
          "modal-input-errMess-name",
          "modal-title",
          "Sản phẩm này đã tồn tại!"
        );
        return;
      } else {
        createCategoryViaAPI(name);
      }
    }
  );
}

function createCategoryViaAPI(name) {
  // call api create department
  var newCat = {
    name: name,
  };
  $.ajax({
    url: "http://localhost:8080/api/v1/categories",
    type: "POST",
    data: JSON.stringify(newCat), // body
    contentType: "application/json",
    // type of body (json, xml, text)
    success: function (data, textStatus, xhr) {
      // success
      hideCategoryModal();
      alert("Success! New Category created!");
      fillDataContent();
    },
    error(jqXHR, textStatus, errorThrown) {
      alert("Error when create product");
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
}

function resetForm() {
  document.getElementById("exampleModalLabel").innerHTML = "";
  document.getElementById("modal-name").value = "";
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
  hideFieldErrorMessage("modal-input-errMess-name", "modal-name");
  return true;
}

function openUpdateCategory(id) {
  var cat = categoties.filter((item) => {
    return item.id == id;
  });
  document.getElementById("exampleModalLabel").innerHTML = "Sửa thông tin danh mục";
  document.getElementById("cat-id").value = cat[0].id;
  document.getElementById("modal-name").value = cat[0].name;
}

function updateCategory() {
  var id = document.getElementById("cat-id").value;
  var name = document.getElementById("modal-name").value;

  $.get(
    "http://localhost:8080/api/v1/categories/existed/" + name,
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
          "modal-input-errMess-name",
          "modal-title",
          "Danh mục này đã tồn tại!"
        );
        return;
      } else {
        callApiUpdateCat(id, name);
      }
    }
  );
}

function callApiUpdateCat(id, name) {
  var updateCat = {
    name: name,
  };
  $.ajax({
    url: `http://localhost:8080/api/v1/categories/${id}`,
    type: "PATCH",
    data: JSON.stringify(updateCat), // body
    contentType: "application/json",
    // type of body (json, xml, text)
    success: function (data, textStatus, xhr) {
      // success
      hideCategoryModal();
      alert("Success! Category Updated!");
      fillDataContent();
      resetForm();
    },
    error(jqXHR, textStatus, errorThrown) {
      alert("Error when update category");
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
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
