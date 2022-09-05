const mongoose = require("mongoose");
const { Cart } = require("../../database/models/cart");
const { User } = require("../../database/models/user");
const { Product } = require("../../database/models/product");

const strToObjectId = (id) => {
  return mongoose.Types.ObjectId(id);
};

const getCart = async (id) => {
  id = strToObjectId(id);
  const cartDetails = await Cart.aggregate([
    {
      $match: {
        userId: id,
      },
    },
    {
      $lookup: {
        from: "products",
        localField: "productId",
        foreignField: "_id",
        as: "products",
      },
    },
    {
      $unwind: "$products",
    },
    {
      $group: {
        _id: id,
        count: {
          $sum: "$quantity",
        },
        totalPrice: {
          $sum: { $multiply: ["$products.price", "$quantity"] },
        },
        products: {
          $push: "$products",
        },
        quantity: {
          $push: "$quantity",
        },
      },
    },
    {
      $project: {
        _id: false,
        count: true,
        totalPrice: true,
        products: true,
        quantity: true,
        totalPrice: { $round: ["$totalPrice", 2] },
      },
    },
  ]);
  return cartDetails[0];
};

function addToCart(filter, data) {
  return Cart.findOneAndUpdate(filter, data, {
    upsert: true,
    returnNewDocument: true,
  });
}

function deleteFromCart(filter) {
  return Cart.findOneAndDelete(filter);
}

module.exports = {
  getCart,
  addToCart,
  deleteFromCart,
};
