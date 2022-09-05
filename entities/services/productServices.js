const { Product, validateProduct } = require("../../database/models/product");

function addProduct(data, filter, limit) {
  console.log("services");
  data.forEach(async (data) => {
    try {
      const aproduct = new Product({
        productId: data.id,
        title: data.title,
        quantity: data.rating.count,
        image: data.image,
        price: data.price,
        description: data.description,
        rating: data.rating.rate,
      });
      const result = await aproduct.save();
      console.log(result);
    } catch (err) {
      console.log(err);
    }
    //console.log(validateProduct(product));
  });
  return Product.find(filter).sort({ _id: -1 }).limit(limit);
}

function getProducts(filter, limit) {
  return Product.find(filter).sort({ _id: -1 }).limit(limit);
}

function getProduct(productId) {
  return Product.findOne({ _id: productId });
}

module.exports = {
  addProduct,
  getProducts,
  getProduct,
};
