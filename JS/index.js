var baseUrl = "http://localhost:8080/api/v1";
var categories = [];

$(document).ready(function () {
  localStorage.setItem("search-value", "");
  $("#header").load("../Components/header.html", () => {
    var user = localStorage.getItem("user");
    user = JSON.parse(user);
    if (user) {
      $(".h_menu-options").append(
        `
        <a
        href="#"
        style="
          color: #fff;
          font-size: 14px;
          font-weight: 500;
          display: flex;
          position: relative;
          align-items: center;
        "
        class="logout"
        onclick="showActionUser()"
      >
        <span> ${user?.full_name} </span>
        <div
          onclick="logout()"
          id="but"
          class="btn-logout"
          style="
            position: absolute;
            top: 40px;
            background: #f27474;
            left: 7px;
            color: #000;
            padding: 8px 18px 4px 6px;
            display: flex;
            align-items: center;
            border-radius: 10px;
            width: 126px;
          "
        >
          <i class="fa fa-user-circle fa-2x"></i>
          <p style="margin: 0">Đăng xuất</p>
        </div>
      </a>
        `
      );
    }
  });
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
  window.location.replace("../Pages/ProductsInCategory.html");
}
