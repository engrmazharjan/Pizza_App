const homeController = require("../app/http/controllers/homeController");
const authController = require("../app/http/controllers/authController");
const cartController = require("../app/http/controllers/customers/cartController");
const orderController = require("../app/http/controllers/customers/orderController");
const adminOrderController = require("../app/http/controllers/admin/orderController");

// Middleware
const guest = require("../app/http/middleware/guest");
const auth = require("../app/http/middleware/auth");
const admin = require("../app/http/middleware/admin");

function initRoutes(app) {
  // Home Route
  app.get("/", homeController().index);

  // Login Route
  app.get("/login", guest, authController().login);
  app.post("/login", authController().postLogin);

  // Registration Route
  app.get("/register", guest, authController().register);
  app.post("/register", authController().postRegister);

  // Logout Route
  app.post("/logout", authController().logout);

  // Cart Route
  app.get("/cart", cartController().index);
  app.post("/update-cart", cartController().update);

  // Customer Routes
  app.post("/orders", auth, orderController().store);
  app.get("/customer/orders", auth, orderController().index);

  // Admin Routes
  app.get("/admin/orders", admin, adminOrderController().index);
}

module.exports = initRoutes;
