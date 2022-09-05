const cartServices = require("../services/cartServices");
const productServices = require("../services/productServices");

function getCart(req, res) {
  const { email, userId, username } = req.session;
  if (!email || !userId || !username) {
    return res.redirect("/auth/login");
  }
  cartServices
    .getCart(userId)
    .then((data) => {
      console.log("data=>>", data);
      res.render("cart", { cart: data, name: req.session.username });
    })
    .catch((err) => {
      console.log(err.messages);
    });
}

function updateCart({ productId, userId, data, req, res }) {
  productServices
    .getProduct(productId)
    .then((p) => {
      if (p.quantity > 0) {
        const filter = { userId: userId, productId: productId };
        cartServices
          .addToCart(filter, data)
          .then((d) => {
            console.log(d);
            res.redirect("/cart");
          })
          .catch((err) => {
            console.log(err);
            res.redirect("/");
          });
      } else {
        res.redirect("/");
      }
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/");
    });
}

function addToCart(req, res) {
  const { email, userId } = req.session;
  if (!email || !userId) {
    return res.render("login", {
      name: req.session.username,
      err: `Please Login to add to Cart`,
      success: null,
    });
  }
  const productId = req.body.productId;
  const qty = 1;
  const data = {
    userId: userId,
    productId: productId,
    $inc: { quantity: qty },
  };
  return updateCart({ productId, userId, data, req, res });
}

function subFromCart(req, res) {
  const { email, userId } = req.session;
  if (!email || !userId) {
    return res.render("login", {
      name: req.session.username,
      err: `Please Login to add to Cart`,
      success: null,
    });
  }
  const productId = req.body.productId;
  const qty = -1;
  const data = { $inc: { quantity: qty } };
  updateCart({ productId, userId, data, req, res });
}

function deleteFromCart(req, res) {
  const { email, userId } = req.session;
  if (!email || !userId) {
    return res.render("login", {
      name: req.session.username,
      err: `Please Login to add to Cart`,
      success: null,
    });
  }
  const productId = req.body.productId;
  const filter = { userId: userId, productId: productId };
  cartServices
    .deleteFromCart(filter)
    .then((d) => {
      console.log(d);
      res.redirect("/cart");
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/");
    });
}

module.exports = {
  getCart,
  addToCart,
  subFromCart,
  deleteFromCart,
};

// 6307150048e2f79be2954e70
// 63083986fb12c7fbbd917896
// ed9f4c2009842bb7944c0138a7e8af05
// 4e0874383fe8f079bc05ae398515a75d
