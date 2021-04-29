const Menu = require("../../models/menu");

// Controller For Home
function homeController() {
  return {
    async index(req, res) {
      const pizzas = await Menu.find();
      // console.log(pizzas);
      return res.render("home", { pizzas: pizzas });

      // Menu.find().then((pizzas) => {
      //   console.log(pizzas);
      //   return res.render("home", { pizzas: pizzas });
      // });
    },
  };
}

module.exports = homeController;
