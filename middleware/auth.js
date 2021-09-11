exports.authenticate = (req, res, next) => {
  if (!req.session.isLoggedIn) {
    req.flash("error", "you must have login first!!");
    res.redirect("/login");
    next();
  } else {
    next();
  }
};
