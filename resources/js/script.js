import axios from "axios";
import moment from "moment";
import Noty from "noty";
import { initAdmin } from "./admin";

let addToCart = document.querySelectorAll(".add-to-cart");
let cartCounter = document.querySelector("#cartCounter");

// Update Cart
function updateCart(pizza) {
  axios
    .post("/update-cart", pizza)
    .then((res) => {
      console.log(res);
      cartCounter.innerText = res.data.totalQty;
      // JavaScript library for toast notifications
      new Noty({
        type: "success",
        timeout: 1000,
        text: "Item Added To Cart",
        progressBar: false,
      }).show();
    })
    .catch((err) => {
      // JavaScript library for toast notifications
      new Noty({
        type: "error",
        timeout: 1000,
        text: "Something Went Wrong",
        progressBar: false,
      }).show();
      console.log(err);
    });
}

addToCart.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    let pizza = JSON.parse(btn.dataset.pizza);
    updateCart(pizza);
    console.log(pizza);
  });
});

// Remove An Alert Message After XYZ Seconds
const alertMsg = document.querySelector("#success-alert");

if (alertMsg) {
  setTimeout(() => {
    alertMsg.remove();
  }, 2000);
}

// Change Order Status For Single Order Page
let statuses = document.querySelectorAll(".status-line");
// console.log(statuses);

let hiddenInput = document.querySelector("#hiddenInput");
let order = hiddenInput ? hiddenInput.value : null;
order = JSON.parse(order);

let time = document.createElement("small");
// console.log(order);

function updateStatus(order) {
  // Remove 'step-completed' and 'current' classes first
  statuses.forEach((status) => {
    status.classList.remove("step-completed");
    status.classList.remove("current");
  });

  let stepCompleted = true;
  statuses.forEach((status) => {
    let dataProp = status.dataset.status;
    if (stepCompleted) {
      status.classList.add("step-completed");
    }
    if (dataProp === order.status) {
      stepCompleted = false;
      time.innerText = moment(order.updatedAt).format("hh:mm A");
      status.appendChild(time);

      if (status.nextElementSibling) {
        status.nextElementSibling.classList.add("current");
      }
    }
  });
}
updateStatus(order);

// Socket
let socket = io();

// Join
if (order) {
  socket.emit("join", `order_${order._id}`);
}

// Admin
let adminAreaPath = window.location.pathname;
// console.log(adminAreaPath);
if (adminAreaPath.includes("admin")) {
  // Call initAdmin() function
  initAdmin(socket);
  socket.emit("join", "adminRoom");
}

socket.on("orderUpdated", (data) => {
  const updatedOrder = { ...order };
  updatedOrder.updatedAt = moment().format();
  updatedOrder.status = data.status;
  // console.log(data);
  updateStatus(updatedOrder);
  // JavaScript library for toast notifications
  new Noty({
    type: "success",
    timeout: 1000,
    text: "Order Updated",
    progressBar: false,
  }).show();
});
