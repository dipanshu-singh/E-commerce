const { User, validate } = require("../../database/models/user");
const bcrypt = require("bcryptjs");
const Joi = require("joi");

function create(email, password, username) {
  const user = { email, password, username };
  console.log(validate(user));
  return User.create({ email, password, username });
}

function getUser(filter) {
  console.log(filter);
  return User.find(filter);
}

function updateUser(filter, formData) {
  return User.findOneAndUpdate(filter, formData);
}

function encrypt(password) {
  return bcrypt.hash(password, 10);
}

function comparePassord(password, hashed) {
  return bcrypt.compare(password, hashed);
}

function validatePasswordChange(req) {
  const schema = Joi.object({
    currPassword: Joi.string().required(),
    newPassword: Joi.string().required().min(5),
    confirmPassword: Joi.string().required().valid(Joi.ref("newPassword")),
  });
  return schema.validate(req);
}

module.exports = {
  create,
  getUser,
  encrypt,
  comparePassord,
  updateUser,
  validatePasswordChange,
};
