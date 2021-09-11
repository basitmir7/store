const Product = require("../models/product");

const path = require("path");

exports.getAddProducts = (req, res, next) => {
  res.render("admin/addProducts");
};

// exports.postAddProducts =( req, res, next)=>{
//     if(req.body.hid ===''){
//       var imageFile=req.file.filename;
//       var product = new Product({
//           description: req.body.description,
//           image: imageFile,
//           category: req.body.category,
//           price: req.body.price,
//       });
//       product.save(function(err, post){
//           if(err){
//               console.log(err);
//           } else{
//               console.log(post);
//               req.flash('msg','product uploaded successfully')
//               res.redirect("/");
//           }
//       })
//     } else{
//       Product.findById({_id:req.body.hid},(err, room)=>{
//           product.category = req.body.category;
//           product.description = req.body.description;
//           product.image = req.file.filename;
//           product.price = req.body.price;
//           product.save((err)=>{
//               if(!err){
//                   req.flash('msg','product updated successfully');
//                   res.redirect('/');
//               }
//           })
//       })

//     }

// }
exports.postAddProducts = (req, res, next) => {
  const title = req.body.title;
  var imageFile = req.file.filename;
  const price = req.body.price;
  const description = req.body.description;
  const product = new Product({
    title: title,
    price: price,
    description: description,
    file: imageFile,
    userId: req.user,
  });
  product
    .save()
    .then((result) => {
      // console.log(result);
      console.log("Created Product");
      req.flash("msg", "product added successfully!!!");
      console.log(result);
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
    });
};
