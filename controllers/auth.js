const bcrypt = require('bcryptjs');
const User = require('../models/user');
const crypto = require('crypto');
var nodemailer = require('nodemailer');
var sgTransport = require('nodemailer-sendgrid-transport');
var options = {
  auth: {
      api_key: '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'
  }
}
var mailer = nodemailer.createTransport(sgTransport(options));
exports.getLogin = (req, res, next)=>{
    res.render('auth/login');
}


exports.getRegister = (req, res, next)=>{
    res.render('auth/register');
}
exports.postRegister = (req, res, next)=>{
    const email = req.body.email;
    const password = req.body.password;
    bcrypt.hash(password, 12, (err, hashedPassword)=>{
        User.findOne({email:email}, (err, user)=>{
            if(user){
                req.flash('error','email already exist')
                console.log("email already exist");
                res.redirect('/register');
            }else{
                const user = new User({
                    email: email,
                    password: hashedPassword,
                    cart:{items:[]}
                });
                user.save((err)=>{
                    if(!err){
                        req.flash('msg','successfully registered!')
                        res.redirect('/login');
                        var email = {
                          to: req.body.email,
                          from: 'danishyousufmir@gmail.com',
                          subject: 'Hi there',
                          text: 'Awesome sauce',
                          html: `<h1>successfully registered in shop app</h1>
                          lksngls 
                          
                          `
                      };
                       
                      mailer.sendMail(email, function(err, res) {
                          if (err) { 
                              console.log(err) 
                          }
                          console.log(res);
                      });
                    }
                })
            }
        })
    })
    

}
exports.postLogin = (req, res, next)=>{
    const email = req.body.email;
    const password = req.body.password;
   
  User.findOne({email:email})
    .then(user => {
      if(!user){
        req.flash('error','invalid email or password')
        res.redirect("/login")
      }  else{
        bcrypt.compare(password, user.password, function(err, doMatch){
          if(doMatch){
            req.session.isLoggedIn = true;
            req.session.user = user;
            req.session.save(err => {
            req.flash('msg', 'user logged in with an email id ' +user.email);
            console.log(err);
             res.redirect('/');
               });
          }else{
            req.flash('error', 'invalid password!')
            res.redirect("/login")
          }
        })
      }
      
    })
    .catch(err => console.log(err));
}

exports.getLogout = (req, res, next)=>{
    req.session.destroy((err)=>{
        if(!err){
            res.redirect('/login');
        }
    })
}

exports.getResetPassword = (req, res, next)=>{
  res.render("auth/reset")
}
exports.postResetPassword = (req, res, next)=>{
  User.findOne({email:req.body.email}, (err, user)=>{
    if(!user){
      req.flash('error','email not found!!!');
      res.redirect('/resetPassword')
    } else{
      require('crypto').randomBytes(48, function(err, buffer) {
        if(!err){
          const token = buffer.toString('hex');
          user.resetToken = token;
          user.resetTokenExpire = Date.now() + 360000;
          user.save((err)=>{
            if(!err){
              var email = {
                to: req.body.email,
                from: 'danishyousufmir@gmail.com',
                subject: 'reset your password',
                text: 'Awesome sauce',
                html: `
                <p> click the link to change your password <a href="http://localhost:3000/reset/${token}">click here</a></p>
                
                `
            };
             
            mailer.sendMail(email, function(err, res) {
                if (err) { 
                    console.log(err) 
                }
                console.log(res);
               
            });
            }
          })
          
        }
      })
      req.flash('msg','link sent to your mail');
      res.redirect('/login')

    }
  })
}

exports.getUpdatePassword =(req, res, next)=>{
  const token = req.params.token;
  User.findOne({resetToken:token, resetTokenExpire : {$gt: Date.now()}}, (err, user)=>{
    if(!user){
      req.flash("error","your link has been expired");
      res.redirect('/login');
    }else{
      res.render('auth/newPassword', {
        token: req.params.token,
        userId : user._id
      });
    }
  })
}

exports.postUpdatePassword = (req, res, next)=>{
  // console.log(req.body.token);
  const password = req.body.password;
  userId = req.body.userId;
  rtoken = req.body.token.toString();
  User.findOne({resetToken:rtoken ,_id:userId, resetTokenExpire : {$gt: Date.now()}},(err, user)=>{
    if(!user){
      
      // console.log(err);
      req.flash("error", "something went wrong")
       res.redirect('/resetPassword');
    } 
    else{
      bcrypt.hash(password, 12).then(hashedPassword=>{
      user.password = hashedPassword;
      user.resetToken = undefined;
      user.resetTokenExpire = undefined;
      user.save((err)=>{
        if(!err){
          req.flash('msg','password changed successfully');
          res.redirect('/login');
        }
      })
    })
    }
  })
}

exports.getProfile = (req, res, next)=>{
  User.findById({_id:req.session.user._id}, (err, user)=>{
    res.render("auth/profile",{user:user});
  })
  
}

exports.postProfile = (req, res, next)=>{
  User.findById({_id:req.session.user._id}, (err, user)=>{
    if(!err){
      console.log("user",user);
      user.name = req.body.name;
      user.contact = req.body.contact;
      user.address = req.body.address;
      user.status = req.body.status;
      user.deals = req.body.deals;
      user.save((err,user)=>{
        if(!err){
          console.log("edited user",user);
          res.redirect("/profile");
        }
      })
    }
  })
}