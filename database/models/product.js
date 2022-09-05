const mongoose = require("mongoose");
const Joi = require("joi");

const productSchema = {
  productId: {
    type: String,
    unique: true,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
  },
  rating: {
    type: Number,
  },
};
module.exports.Product = mongoose.model("products", productSchema);

module.exports.validateProduct = (product) => {
  const schema = Joi.object({
    quantity: Joi.number().integer().positive().required(),
    productId: Joi.string(),
    price: Joi.number().positive().required(),
    title: Joi.string().required(),
    image: Joi.string(),
    description: Joi.string().max(100000),
    rating: Joi.number().positive().max(5),
  });
  return schema.validate(product);
};
