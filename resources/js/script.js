import axios from "axios";
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

// Call initAdmin() function
initAdmin();
