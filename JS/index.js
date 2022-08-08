var baseUrl = "http://localhost:8080/api/v1";
var categories = [];

$(document).ready(function () {
  $("#header").load("../Components/header.html", () => {});
  $(".navigate").load("../Components/navBar.html", () => {
    fillCategories();
  });
  $("#content").load("../Components/content.html");
  $("#footer").load("../Components/footer.html", () => {});
});

async function fillCategories() {
  await getListCategories();
  categories.forEach(function (item) {
    $(".nav-list").append(
      `<li class='nav-item' onclick="showProduct(${item.id})">` +
        '<a style="width: 100%; font-size: 12px href="#">' +
        item.name +
        "</a>" +
        "</li>"
    );
  });
}
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
function showProduct(id) {
  localStorage.removeItem("category-sv");
  localStorage.setItem("category-sv", id);
  window.location.replace("./Pages/ProductsInCategory.html");
}
