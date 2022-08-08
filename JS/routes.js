$(function () {
  var wildcard = function () {
    console.log("Wildcard at: " + this.params["route"]);
  };

  $.sammy("#body", function () {
    this.get("#product/:id", function () {
      var id = this.params["id"];
      console.log(id);
      $("#body").load("../Components/productDetail.html", function () {
        window.addEventListener("click", getProductById(id));
      });
    });
    this.get("#:route", wildcard);
    this.bind("run-route", listener);
  }).run("#");
});
