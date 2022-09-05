const Joi = require("joi");
const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    maxlength: 50,
  },
  password: {
    type: String,
    required: true,
    maxlength: 1024,
    minlength: 5,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
});

module.exports.User = mongoose.model("users", userSchema);

module.exports.validate = (user) => {
  const schema = Joi.object({
    name: Joi.string().max(50).min(2).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(5).required(),
  });
  return schema.validate(user);
};
