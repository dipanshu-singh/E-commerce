const authRoute = require("./routes/users");
const productRoute = require("./routes/products");
const cartRoute = require("./routes/cart");

module.exports = function (app) {
  app.use("/", productRoute);
  app.use("/auth", authRoute);
  app.use("/cart", cartRoute);
};
