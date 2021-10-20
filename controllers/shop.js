const Product = require("../models/product");
const User = require('../models/user');
const Order = require('../models/order');
const stripe = require('stripe')('sk_test_51Jf7QDSHAPHrUHE0uWqzAE9JvSvrpGrF395q5JiR0Ho7cIEEiOtZS4jW7GJKmoSp351tPDIgAzk0WzMqzgagshcZ00zEsdk5ze');

// exports.getIndex = (req, res, next) =>{
//  Product.find({}, (err, products)=>{
//    if(!err){
//        console.log("products",products);
//        res.render("shop/home",{products:products});
//    }
// });
// }
exports.getIndex = (req, res, next) => {
  Product.find({})
    // .select('title price -_id')
    .populate('userId', 'name')
    .exec(function(err, complete){
      if(!err){
        console.log(complete);
        res.render('shop/home', {
          products: complete,
        });
      }
    })
    // .then(products => {
    //   console.log("prod",products);
      
    // })
    // .catch(err => console.log(err));
};

exports.getProducts = (req, res, next) =>{
  Product.find({})
  // .select('title price -_id')
  .populate('userId', 'name')
  .exec(function(err, complete){
    if(!err){
      console.log(complete);
      res.render('shop/products', {
        products: complete,
      });
    }
  })
}

exports.getProduct = (req, res, next) =>{
    Product.findById({_id:req.params.id}, (err, product)=>{
       if(!err){
           console.log("products",product);
           res.render("shop/productInfo",{product:product});
       }
    });
}

exports.getCheckout = (req, res, next) => {
  let products;
  let total = 0;
  req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(user => {
      products = user.cart.items;
      total = 0;
      products.forEach(p => {
        total += p.quantity * p.productId.price;
      });

      return stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: products.map(p => {
          return {
            name: p.productId.title,
            description: p.productId.description,
            amount: p.productId.price * 100,
            currency: 'INR',
            quantity: p.quantity
          };
        }),
        success_url: req.protocol + '://' + req.get('host') + '/checkout/success', // => http://localhost:3000
        cancel_url: req.protocol + '://' + req.get('host') + '/checkout/cancel'
      });
    })
    .then(session => {
      res.render('shop/checkout', {
        path: '/checkout',
        pageTitle: 'Checkout',
        products: products,
        totalSum: total,
        sessionId: session.id
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};
exports.getCheckoutSuccess = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(user => {
      const products = user.cart.items.map(i => {
        return { quantity: i.quantity, product: { ...i.productId._doc } };
      });
      const order = new Order({
        user: {
          email: req.user.email,
          userId: req.user
        },
        products: products
      });
      return order.save();
    })
    .then(result => {
      return req.user.clearCart();
    })
    .then(() => {
      res.redirect('/orders');
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};
exports.getCart = (req, res, next) => {
    req.user
      .populate('cart.items.productId')
      .execPopulate()
      .then(user => {
        const products = user.cart.items;
        res.render('shop/cart', {
          path: '/cart',
          pageTitle: 'Your Cart',
          products: products,
          isAuthenticated: req.session.isLoggedIn
        });
      })
      .catch(err => console.log(err));
  };
  
  exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findById(prodId)
      .then(product => {
        return req.user.addToCart(product);
      })
      .then(result => {
        console.log(result);
        res.redirect('/cart');
      });
  };
  
  exports.postCartDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    req.user
      .removeFromCart(prodId)
      .then(result => {
        res.redirect('/cart');
      })
      .catch(err => console.log(err));
  };
  
  exports.postOrder = (req, res, next) => {
    req.user
      .populate('cart.items.productId')
      .execPopulate()
      .then(user => {
        const products = user.cart.items.map(i => {
          return { quantity: i.quantity, product: { ...i.productId._doc } };
        });
        const order = new Order({
          user: {
            email: req.user.email,
            userId: req.user
          },
          products: products
        });
        return order.save();
      })
      .then(result => {
        return req.user.clearCart();
      })
      .then(() => {
        res.redirect('/orders');
      })
      .catch(err => console.log(err));
  };
  
  exports.getOrders = (req, res, next) => {
    Order.find({ 'user.userId': req.user._id })
      .then(orders => {
        res.render('shop/orders', {
          path: '/orders',
          pageTitle: 'Your Orders',
          orders: orders,
          isAuthenticated: req.session.isLoggedIn
        });
      })
      .catch(err => console.log(err));
  };
exports.getSeller = (req, res, nexr)=>{
  let y = 1;
  User.find({status:"seller"},(err, sellers)=>{
    if(!err){
      console.log("seller",sellers);
      res.render("shop/seller",{sellers:sellers,x:y});
    }

  })
}


