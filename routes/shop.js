const express = require("express");

const router = express.Router();

const shopController = require("../controllers/shop");

router.get('/', shopController.getIndex);

router.get('/allProducts', shopController.getProducts);

router.get('/productDetail/:id', shopController.getProduct);

router.get('/cart', shopController.getCart);

router.post('/cart', shopController.postCart);

router.get('/checkout', shopController.getCheckout);

router.get('/checkout/success', shopController.getCheckoutSuccess);

router.get('/checkout/cancel', shopController.getCheckout);

router.post('/cart-delete-item', shopController.postCartDeleteProduct);

// router.post('/create-order', shopController.postOrder);

router.get('/orders', shopController.getOrders);

router.get('/seller',shopController.getSeller);

module.exports = router;