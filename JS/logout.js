function logout(){
    storage.removeItem("TOKEN");
    storage.removeItem("ID");
    storage.removeItem("FULL_NAME");
    storage.removeItem("ROLE");
    storage.saveRememberMe(false)
    window.location.replace("/index.html");
}
