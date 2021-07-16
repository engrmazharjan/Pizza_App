import { loadStripe } from "@stripe/stripe-js";
import { placeOrder } from "./apiService";
import { CardWidget } from "./CardWidget";

export async function initStripe() {
  // Payment
  const stripe = await loadStripe(
    `pk_test_51InhaNSH8wugdTbMQ1b8448LDQ5WcS4VFGVU3CC5n8MrgMQyNm9jF7lox5fjKzzKskxcbhIBx5aPrnZwxSouudmj00TFkbzt1s`
  );

  let card = null;

  // Mount Widget
  function mountWidget() {
    // const elements = stripe.elements();
    // let style = {
    //   base: {
    //     color: "#32325d",
    //     fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
    //     fontSmoothing: "antialiased",
    //     fontSize: "16px",
    //     "::placeholder": {
    //       color: "#aab7c4",
    //     },
    //   },
    //   invalid: {
    //     color: "#fa755a",
    //     iconColor: "#fa755a",
    //   },
    // };
    // card = elements.create("card", { style: style, hidePostalCode: true });
    // card.mount("#cardElement");
  }

  const paymentType = document.querySelector("#paymentType");
  if (!paymentType) {
    return;
  }
  paymentType.addEventListener("change", (e) => {
    // console.log(e.target.value);
    if (e.target.value === "card") {
      // Display Widget
      card = new CardWidget(stripe);
      card.mount();
    } else {
      // Default
      card.destroy();
    }
  });

  // Ajax Call
  const paymentForm = document.querySelector("#payment-form");
  if (paymentForm) {
    paymentForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      let formData = new FormData(paymentForm);
      let formObject = {};
      for (let [key, value] of formData.entries()) {
        formObject[key] = value;
      }

      if (!card) {
        // Ajax Call
        placeOrder(formObject);
        // console.log(formObject);
        return;
      }
      // Verify Card
      const token = await card.createToken();
      formObject.stripeToken = token.id;
      placeOrder(formObject);

      // stripe
      //   .createToken(card)
      //   .then((result) => {
      //     //   console.log(result);
      //     formObject.stripeToken = result.token.id;
      //     placeOrder(formObject);
      //   })
      //   .catch((err) => {
      //     console.log(err);
      //   });

      // console.log(formObject);
    });
  }
}
