const Product = require("../models/product");
exports.getIndex = (req, res, next) => {
  Product.find({}, (err, products) => {
    if (!err) {
      console.log("products", products);
      res.render("shop/home", { products: products });
    }
  });
};

exports.getProducts = (req, res, next) => {
  Product.find({}, (err, products) => {
    if (!err) {
      console.log("products", products);
      res.render("shop/products", { products: products });
    }
  });
};

exports.getProduct = (req, res, next) => {
  Product.findById({ _id: req.params.id }, (err, product) => {
    if (!err) {
      console.log("products", product);
      res.render("shop/productInfo", { product: product });
    }
  });
};
