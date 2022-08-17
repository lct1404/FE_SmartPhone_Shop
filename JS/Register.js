var form_register = {};
async function register() {
  getAndValidForm();
  awaitRegistration();
}
function getAndValidForm() {
  var fullName_val = document.getElementById("fullName");
  var username_val = document.getElementById("username");
  var phone_num = document.getElementById("phonenumber");
  var email_val = document.getElementById("email");
  var password_val = document.getElementById("password");
  var repassword_val = document.getElementById("repassword");
  var address_val = document.getElementById("address");
  var date = document.getElementById("dob");
  var fileImg = document.getElementById("fileupload").value;

  form_register = {
    username: username_val.value,
    email: email_val.value,
    fullName: fullName_val.value,
    password: password_val.value,
    phoneNumber: phone_num.value,
    address: address_val.value,
    avatar: fileImg.split("\\").pop(),
  };
}
async function awaitRegistration() {
  $(".btn-context").hide();
  $(".btn-loading").show();
  $(".submit-registration").attr("disabled", true);
  await callRegisterAPI();
}
async function callRegisterAPI() {
  await $.ajax({
    url: "http://localhost:8080/api/v1/auth/signup",
    type: "POST",
    data: JSON.stringify(form_register), // body
    contentType: "application/json",
    // beforeSend: function (xhr) {
    //     xhr.setRequestHeader("Authorization", "Basic " + btoa(username + ":" + password));
    // },
    success: function (data, textStatus, xhr) {
      console.log(data);
      alert("Đăng ký thành công !");
      window.location.replace("http://127.0.0.1:5500/Pages/login.html");
    },
    error(jqXHR, textStatus, errorThrown) {
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
}
