const router = require("express").Router();
const authController = require("../controllers/authController");

router
  .route("/signup")
  .get(authController.getSignup)
  .post(authController.postSignup);

router
  .route("/login")
  .get(authController.getLogin)
  .post(authController.postLogin);

router.route("/logout").get(authController.logout);

router
  .route("/verify")
  .get(authController.accountVerification)
  .post(authController.postAccountVerification);

router
  .route("/updatePassword")
  .get(authController.changePassword)
  .post(authController.postChangePassword);

router
  .route("/forgotpassword")
  .get(authController.forgotPassword)
  .post(authController.postForgotPassword);

router
  .route("/forgot/verify")
  .get(authController.reset)
  .post(authController.postReset);

router.route("/profile").get(authController.getProfile);

module.exports = router;
