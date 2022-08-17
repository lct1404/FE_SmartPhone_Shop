function logout() {
  localStorage.removeItem("user");
  localStorage.setItem("IS_REMEMBER_ME", false);
  window.location.replace("/index.html");
}
