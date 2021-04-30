const homeController = require("../app/http/controllers/homeController");
const authController = require("../app/http/controllers/authController");
const cartController = require("../app/http/controllers/customers/cartController");
const guest = require("../app/http/middleware/guest");
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
}

module.exports = initRoutes;
