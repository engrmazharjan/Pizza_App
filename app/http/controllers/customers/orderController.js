const Order = require("../../../models/order");
const moment = require("moment");

function orderController() {
  return {
    store(req, res) {
      //   console.log(req.body);
      //  Validate Request
      const { phone, address } = req.body;
      if (!phone || !address) {
        req.flash("error", "Please Provide Your Phone Number and Address");
        res.redirect("/cart");
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
            req.flash("success", `Order Placed Successfully`);
            delete req.session.cart;
            // Emit Event
            const eventEmitter = req.app.get("eventEmitter");
            eventEmitter.emit("orderPlaced", placedOrder);

            return res.redirect("/customer/orders");
          });
        })
        .catch((err) => {
          req.flash("error", `Something Went Wrong: ${err}`);
          return res.redirect("/cart");
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
