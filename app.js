const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
var MongoDBStore = require('connect-mongodb-session')(session);
const flash = require('connect-flash');
const User = require('./models/user');
const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine','ejs');
app.use(express.static('public'));
mongoose.connect('mongodb://localhost:27017/store', {useNewUrlParser: true, useUnifiedTopology: true});
const store = new MongoDBStore({
    uri: 'mongodb://localhost:27017/store',
    collection: 'sessions'
  });
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store:store,
  }));

app.use(flash());
app.use((req, res, next)=>{
    if(!req.session.user){
        next();
    } else{
        User.findById(req.session.user._id, (err, user)=>{
             if(!err){
              req.user = user;
              next();
             }
        })
        
    }
});
app.use((req, res, next)=>{
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.isAdmin = req.session.adminLogged;
    res.locals.error = req.flash("error");
    res.locals.msg = req.flash("msg");
   
    next();
});

const shopRouter = require("./routes/shop");
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const errorController = require("./controllers/error");

app.use(adminRoutes);
app.use(shopRouter);
app.use(authRoutes);

app.use(errorController.get404);

app.listen(3000, ()=>{
    console.log("server is running on port 3000");
})