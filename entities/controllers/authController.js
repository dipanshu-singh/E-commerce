const authservices = require("../services/authServices");
const mailServices = require("../services/mailServices");
const jwt = require("jsonwebtoken");

function getSignup(req, res) {
  if (req.session.isAuthenticated) {
    return res.redirect("/");
  }
  return res.render("signup", {
    name: req.session.username,
    err: null,
    success: null,
  });
}

function postSignup(req, res) {
  const { email, password, confirmPassword, username } = req.body;
  if (password != confirmPassword) {
    return res.render("signup", {
      name: req.session.username,
      err: "Both Passwords should match",
      success: null,
    });
  }
  authservices.getUser({ email }).then((data) => {
    if (data.length > 0) {
      res.render("signup", {
        name: req.session.username,
        err: "User already exists",
        success: null,
      });
    }
    authservices.encrypt(password).then((hashed) => {
      authservices
        .create(email, hashed, username)
        .then((data) => {
          const token = jwt.sign({ userId: data._id }, "CQ");
          mailServices
            .accountVerificationMail(email, username, token)
            .then((result) => {
              res.render("signup", {
                name: req.session.username,
                success: `Verification email is sent to ${email}`,
                err: null,
              });
            })
            .catch((err) => {
              res.render("signup", {
                name: req.session.username,
                err: `Something went wrong while sending email for verification`,
                success: null,
              });
            });
        })
        .catch((err) => {
          console.log(err);
          res.render("signup", {
            name: req.session.username,
            err: `Something went wrong`,
            success: null,
          });
        });
    });
  });
}

function accountVerification(req, res) {
  const { token } = req.query;
  return res.render("emailVerification", {
    name: req.session.username,
    token: token,
    err: null,
  });
}

function postAccountVerification(req, res) {
  const { token } = req.query;
  const decoded = jwt.verify(token, "CQ");
  if (decoded && decoded.userId) {
    const id = decoded.userId;
    authservices
      .updateUser({ _id: id }, { $set: { isVerified: true } })
      .then((data) => {
        mailServices
          .sendWelcome(data.email, data.username)
          .then((sent) => {
            console.log("Welcome email: ", sent);
            res.redirect("/auth/login");
          })
          .catch((err) => {
            console.log(err);
            res.render("emailVerification", {
              name: req.session.username,
              token: token,
              err: "Something went wrong",
            });
          });
      })
      .catch((err) => {
        console.log(err);
        return res.render("emailVerification", {
          name: req.session.username,
          token: token,
          err: "account verification failed",
        });
      });
  } else {
    res.render("emailVerification", {
      name: req.session.username,
      token: token,
      err: "Something went wrong while sending email for verification",
    });
  }
}

function getLogin(req, res) {
  if (req.session.isAuthenticated) {
    return res.redirect("/");
  }
  return res.render("login", {
    name: req.session.username,
    err: null,
    success: null,
  });
}

function postLogin(req, res) {
  const { email, password } = req.body;
  authservices
    .getUser({ email })
    .then((data) => {
      if (data.length == 0) {
        return res.render("login", { name: null, err: "User not found" });
      }
      data = data[0];
      if (!data.isVerified) {
        return res.render("login", {
          name: null,
          err: "Your account is not verified, Please contact admin ",
        });
      }
      authservices
        .comparePassord(password, data.password)
        .then((d) => {
          if (d) {
            req.session.isAuthenticated = true;
            req.session.email = email;
            req.session.username = data.username;
            req.session.userId = data._id;
            res.redirect("/");
            return;
          }
          return res.render("login", {
            name: null,
            err: "Password doesn't match",
          });
        })
        .catch((err) => {
          return res.render("login", {
            name: null,
            err: "Something went wrong",
          });
        });
    })
    .catch((err) => {
      return res.render("login", { name: null, err: "Something went wrong" });
    });
}

function logout(req, res) {
  req.session.destroy((err) => {
    res.redirect("/auth/login");
  });
}

function changePassword(req, res) {
  if (req.session.email && req.session.username) {
    res.render("changePassword", { name: req.session.username, err: null });
  } else {
    res.redirect("/auth/login");
  }
}

function postChangePassword(req, res) {
  const { email, userId, username } = req.session;
  const { currPassword, newPassword, confirmPassword } = req.body;
  if (!email || !userId || !username) {
    return res.redirect("/auth/login");
  }
  if (newPassword != confirmPassword) {
    res.render("changePassword", {
      name: req.session.username,
      err: "Both Passwords should match",
    });
  }
  const { error } = authservices.validatePasswordChange(req.body);
  console.log(error);
  if (error) {
    return res.render("changePassword", {
      name: req.session.username,
      err: error.message,
    });
  }
  authservices.getUser({ email }).then((users) => {
    const hash = users[0].password;
    authservices.comparePassord(currPassword, hash).then((f) => {
      if (f) {
        authservices.encrypt(newPassword).then((hashed) => {
          const filter = {
            email,
            _id: userId,
          };
          const formData = {
            password: hashed,
          };
          authservices
            .updateUser(filter, formData)
            .then((data) => {
              mailServices
                .changePasswordEmail(email, username)
                .then((result) => {
                  res.render("changePassword", {
                    name: req.session.username,
                    err: "Your password is changed successfully!",
                  });
                })
                .catch((err) => {
                  console.log(err);
                  res.render("changePassword", {
                    name: req.session.username,
                    err: "Something went wrong while sending email of passord reset",
                  });
                });
            })
            .catch((err) => {
              console.log(err);
              res.render("changePassword", {
                name: req.session.username,
                err: "Something went wrong",
              });
            });
        });
      } else {
        res.render("changePassword", {
          name: req.session.username,
          err: "Current Password did not Match!",
        });
      }
    });
  });
}

function forgotPassword(req, res) {
  res.render("forgetPassword", {
    name: req.session.username,
    err: null,
    success: null,
  });
}

function postForgotPassword(req, res) {
  const { email } = req.body;
  authservices.getUser({ email }).then((users) => {
    if (users.length == 0) {
      res.render("forgetPassword", {
        name: req.session.username,
        err: "user not found",
        success: null,
      });
    }
    const { email, username, _id } = users[0];
    const token = jwt.sign({ userId: _id }, "CQ");
    console.log("token : ", token);
    mailServices
      .forgotPasswordEmail(email, username, token)
      .then((result) => {
        res.render("forgetPassword", {
          name: req.session.username,
          err: null,
          success:
            "Instructions to reset your Password has been sent to your email",
        });
      })
      .catch((err) => {
        console.log(err.message);
        res.render("forgetPassword", {
          name: req.session.username,
          err: "Something went wrong while sending email of passord reset",
          success: null,
        });
      });
  });
}

function reset(req, res) {
  const { token } = req.query;
  res.render("resetPassword", {
    name: req.session.username,
    token: token,
    err: null,
  });
}

function postReset(req, res) {
  const { token } = req.query;
  const { newPassword, confirmPassword } = req.body;
  if (newPassword != confirmPassword) {
    res.render("resetPassword", {
      name: req.session.username,
      token: token,
      err: "Password should be matched",
    });
  }
  const decoded = jwt.verify(token, "CQ");
  if (decoded && decoded.userId) {
    const { userId, email, username } = decoded;
    authservices.encrypt(newPassword).then((hashed) => {
      const filter = {
        email,
        _id: userId,
      };
      const formData = {
        password: hashed,
      };
      authservices
        .updateUser(filter, formData)
        .then((data) => {
          mailServices
            .changePasswordEmail(email, username)
            .then((result) => {
              return res.redirect("/");
            })
            .catch((err) => {
              console.log(err);
              res.render("resetPassword", {
                name: req.session.username,
                token: token,
                err: "Something went wrong while sending email of passord reset",
              });
            });
        })
        .catch((err) => {
          console.log(err);
          res.render("resetPassword", {
            name: req.session.username,
            token: token,
            err: "Something went wrong",
          });
        });
    });
  } else {
    res.render("resetPassword", {
      name: req.session.username,
      token: token,
      err: "Something went wrong",
    });
  }
}

function getProfile(req, res) {
  if (req.session.email && req.session.username) {
    res.render("userProfile", {
      name: req.session.username,
      email: req.session.email,
    });
  } else {
    res.redirect("/auth/login");
  }
}

module.exports = {
  getSignup,
  postSignup,
  getLogin,
  postLogin,
  logout,
  accountVerification,
  postAccountVerification,
  changePassword,
  postChangePassword,
  reset,
  postReset,
  forgotPassword,
  postForgotPassword,
  getProfile,
};
