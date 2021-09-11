const express = require("express");

const router = express.Router();

const shopController = require("../controllers/shop");

router.get("/", shopController.getIndex);

router.get("/allProducts", shopController.getProducts);

router.get("/productDetail/:id", shopController.getProduct);

module.exports = router;
