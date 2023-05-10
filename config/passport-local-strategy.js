const passport = require("passport");
const User = require("../models/user");

const LocalStrategy = require("passport-local").Strategy;

// authentication using passport
passport.use(new LocalStrategy({
  usernameField: 'email',
  passReqToCallback: true
},
function(req, email, password, done){
  // find a user and establish the identity
  User.findOne({email: email}, function(err, user)  {
      if (err){
          req.flash('error', err);
          return done(err);
      }

      if (!user || user.password != password){
          req.flash('error', 'Invalid Username/Password');
          return done(null, false);
      }

      return done(null, user);
  });
}


));

passport.serializeUser(function (user, done) {
  return done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id)
    .then((user) => {
      return done(null, user);
    })
    .catch((e) => {
      return done(e);
    });
});

//check the user is authenticated
passport.checkAthentication = function (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  return res.redirect("/users/sign-in");
};

passport.setAuthenticatedUser = function (req, res, next) {
  if (req.isAuthenticated()) {
    res.locals.user = req.user;
  }

  return next();
};

module.exports = passport;
