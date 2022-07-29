const route = (event) => {
  event = event || window.event;
  event.preventDefault();
  window.history.pushState({}, "", event.target.href);
  console.log(event);
};

const routes = {};

window.route = route;
