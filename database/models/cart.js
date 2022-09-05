const mongoose = require("mongoose");
const Joi = require("joi");
const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "products",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports.Cart = mongoose.model("carts", cartSchema);

module.exports.validateCart = (user) => {
  const schema = Joi.object({
    quantity: Joi.number().greater(-1),
    productId: Joi.string()
      .regex(/^[0-9a-fA-F]{24}$/, "not a valid product Id")
      .required(),
  });
  return schema.validate(user);
};
