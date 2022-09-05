const productServices = require("../services/productServices");
const file = require("../data/file.json");

function getProduct(req, res) {
  const limit = req.query.limit || 1;
  productServices
    .getProducts({}, limit * 5)
    .then((data) => {
      if (data.length < 5) {
        productServices
          .addProduct(file, {}, limit * 5)
          .then((data) => {
            console.log(data, "2 hi add");
            res.render("home", {
              products: data,
              name: req.session.username,
              limit: limit,
            });
          })
          .catch((err) => console.log(err.messages));
      } else {
        res.render("home", {
          products: data,
          name: req.session.username,
          limit: limit,
        });
      }
    })
    .catch((err) => {
      console.log(err.messages);
    });
}
module.exports = { getProduct };
