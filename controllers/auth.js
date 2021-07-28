const bcrypt = require('bcryptjs');
const User = require('../models/user');
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
            res.redirect('/login')
        }
    })
}
