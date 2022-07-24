function logout(){
    storage.removeItem("TOKEN");
    storage.removeItem("ID");
    storage.removeItem("FULL_NAME");
    storage.removeItem("ROLE");
    storage.saveRememberMe(false)
    window.location.replace("http://127.0.0.1:5500/index.html");
}
