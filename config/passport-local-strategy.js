// const passport = require('passport');

// const LocalStrategy = require("passport-local").Strategy;

// const User = require('../models/user');

// new LocalStrategy(
//   {
//     usernameField: "email",
//     passReqToCallback: true,
//   },
//   function (req, email, password, done) {
//     User.findOne({ email })
//       .then((user) => {
//         if (!user || user.password != password) {
//         //   req.flash("error", "Invalid username or password!");
//           return done(null, false);
//         }

//         return done(null, user);
//       })
//       .catch((error) => {
//         // req.flash("error", "Somting wrong!");
//         return done(error);
//       });
//   }
// );

// //serializing the user to decide which key is to kept in the cookies
// passport.serializeUser(function(user, done) {
//     done(null, user.id);
// });

// //deserializing the user from the key in the cokies
// passport.deserializeUser(function (id, done) {
//   User.findById(id)
//     .then((user) => {
//       return done(null, user);
//     })
//     .catch((e) => {
//       return done(e);
//     });
// });

// //check if the user is authenticated
// passport.checkAuthentication = function(req, res, next){
//     if(req.isAuthenticated()){
//         return next();
//     }
//     //if the user is not signed in
//         return res.redirect('/users/sign-in');
// }

// passport.setAuthenticatedUser = function (req, res, next) {
//   if (req.isAuthenticated()) {
//     res.locals.user = req.user;
//   }

//   return next();
// };

// module.exports = passport;

//passport locals
const passport = require("passport");
const User = require("../models/user");

const LocalStrategy = require("passport-local").Strategy;

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passReqToCallback: true,
    },
    function (req, email, password, done) {
      User.findOne({ email })
        .then((user) => {
          if (!user || user.password != password) {
            // req.flash("error", "Invalid username or password!");
            return done(null, false);
          }

          return done(null, user);
        })
        .catch((error) => {
          //   req.flash("error", "Somting wrong!");
          return done(error);
        });
    }
  )
);

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
