const Order = require("../../../models/order");
const moment = require("moment");
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);

function orderController() {
  return {
    store(req, res) {
      // console.log(req.body);
      //  Validate Request
      const { phone, address, stripeToken, paymentType } = req.body;
      if (!phone || !address) {
        return res
          .status(422)
          .json({ message: `Please Provide Your Phone Number and Address` });

        // req.flash("error", "Please Provide Your Phone Number and Address");
        // res.redirect("/cart");
      }

      const order = new Order({
        customerId: req.user._id,
        items: req.session.cart.items,
        phone: phone,
        address: address,
      });

      order
        .save()
        .then((result) => {
          Order.populate(result, { path: "customerId" }, (err, placedOrder) => {
            // req.flash("success", `Order Placed Successfully`);
            // Stripe Payment
            if (paymentType === "card") {
              stripe.charges
                .create({
                  amount: req.session.cart.totalPrice * 100,
                  source: stripeToken,
                  currency: "inr",
                  description: `Pizza Order: ${placedOrder._id}`,
                })
                .then(() => {
                  placedOrder.paymentStatus = true;
                  placedOrder.paymentType = paymentType;
                  placedOrder
                    .save()
                    .then((ord) => {
                      // console.log(ord);
                      const eventEmitter = req.app.get("eventEmitter");
                      eventEmitter.emit("orderPlaced", ord);
                      delete req.session.cart;

                      return res.json({
                        message: `Payment Successful, Order Placed Successfully`,
                      });
                    })
                    .catch((err) => {
                      console.log(err);
                    });
                })
                .catch((err) => {
                  delete req.session.cart;

                  return res.json({
                    message: `Order Placed But Payment Failed, You Can Pay At Delivery Time`,
                  });
                });
            } else {
              delete req.session.cart;
              return res.json({
                message: `Order Placed Successfully`,
              });
            }

            // return res.redirect("/customer/orders");
          });
        })
        .catch((err) => {
          return res.status(500).json({
            message: `Something Went Wrong: ${err}`,
          });
          // req.flash("error", `Something Went Wrong: ${err}`);
          // return res.redirect("/cart");
        });
    },
    async index(req, res) {
      const orders = await Order.find({ customerId: req.user._id }, null, {
        sort: { createdAt: -1 },
      });
      res.header(
        "Cache-Control",
        "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
      );
      res.render("customers/orders", { orders: orders, moment: moment });
      // console.log(orders);
    },
    async show(req, res) {
      const order = await Order.findById(req.params.id);
      // Authorize User
      if (req.user._id.toString() === order.customerId.toString()) {
        res.render("customers/singleOrder", { order: order });
      } else {
        res.redirect("/");
      }
    },
  };
}

module.exports = orderController;
