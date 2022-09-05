const router = require("express").Router();
const cartController = require("../controllers/cartController");

router.route("/").get(cartController.getCart);
router.route("/add").post(cartController.addToCart);
router.route("/sub").post(cartController.subFromCart);
router.route("/delete").post(cartController.deleteFromCart);

module.exports = router;
