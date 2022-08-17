$(function () {
  setupEnterLoginEvent();
  setDefaultRememberme();
});

function setupEnterLoginEvent() {
  $("#username").on("keyup", function (event) {
    // enter key code = 13
    if (event.keyCode === 13) {
      login();
    }
  });

  $("#password").on("keyup", function (event) {
    // enter key code = 13
    if (event.keyCode === 13) {
      login();
    }
  });
}

function setDefaultRememberme() {
  var isRememberMe = storage.getRememberMe();
  document.getElementById("rememberMe").checked = isRememberMe;
}

function ShowPassword() {
  const ipnElement = document.getElementById("password");
  const btnElement = document.getElementById("eye");
  btnElement.addEventListener("click", function () {
    const currentType = ipnElement.getAttribute("type");
    ipnElement.setAttribute(
      "type",
      currentType === "password" ? "text" : "password"
    );
  });
}

function login() {
  // Get username & password
  var username = document.getElementById("username");
  var password = document.getElementById("password");

  username = username.value;
  password = password.value;
  // validate
  var validUsername = isValidUsername(username);
  var validPassword = isValidPassword(password);

  // format
  if (!validUsername || !validPassword) {
    return;
  }

  // validate username 6 -> 30 characters
  if (
    username.length < 6 ||
    username.length > 50 ||
    password.length < 6 ||
    password.length > 50
  ) {
    // show error message
    showLoginFailMessage();
    return;
  }

  callLoginAPI(username, password);
}

async function callLoginAPI(username, password) {
  var body = {
    username: username,
    password: password,
  };
  await $.ajax({
    url: "http://localhost:8080/api/v1/auth/login",
    type: "POST",
    data: JSON.stringify(body), // body
    contentType: "application/json",
    // beforeSend: function (xhr) {
    //     xhr.setRequestHeader("Authorization", "Basic " + btoa(username + ":" + password));
    // },
    success: function (data, textStatus, xhr) {
      // save remember me
      var isRememberMe = document.getElementById("rememberMe").checked;
      storage.saveRememberMe(isRememberMe);

      // save data to storage
      // https://www.w3schools.com/html/html5_webstorage.asp
      localStorage.setItem(
        "user",
        JSON.stringify({
          token: data.token,
          id: data.user.id,
          full_name: data.user.fullName,
          role: data.user.role,
        })
      );
      if (data.user.role === "CLIENT")
        window.location.replace("http://127.0.0.1:5500/index.html");
      else
      window.location.replace("http://127.0.0.1:5500/Pages/admin/Pages/productList.html");
    },
    error(jqXHR, textStatus, errorThrown) {
      if (jqXHR.status == 401) {
        showLoginFailMessage();
      } else {
        alert(jqXHR.responseJSON.message);
      }
    },
  });
}

var error_message_username = "Vui lòng nhập username của bạn để đăng nhập!";
var error_message_password = "Vui lòng nhập mật khẩu của bạn để đăng nhập!";

function isValidUsername(username) {
  if (!username) {
    // show error message
    showFieldErrorMessage("incorrect-mess", "username", error_message_username);
    return false;
  }

  hideFieldErrorMessage("incorrect-mess", "username");
  return true;
}

function isValidPassword(password) {
  if (!password) {
    // show error message
    showFieldErrorMessage("incorrect-mess", "password", error_message_password);
    return false;
  }

  hideFieldErrorMessage("incorrect-mess", "password");
  return true;
}

function showLoginFailMessage() {
  showFieldErrorMessage(
    "incorrect-mess",
    "username",
    "Đăng nhập thất bại , vui lòng thử lại!"
  );
  showFieldErrorMessage(
    "incorrect-mess",
    "password",
    "Đăng nhập thất bại , vui lòng thử lại!"
  );
}

function showFieldErrorMessage(messageId, inputId, message) {
  document.getElementById(messageId).innerHTML = message;
  document.getElementById(messageId).style.display = "block";
  document.getElementById(inputId).style.border = "1px solid red";
}

function hideFieldErrorMessage(messageId, inputId) {
  document.getElementById(messageId).style.display = "none";
  document.getElementById(inputId).style.border = "1px solid #ccc";
}
