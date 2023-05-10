const User = require("../models/user");
const fs = require('fs');
const path = require('path');

module.exports.profile = async function (req, res) {
  User.findById(req.params.id, function(err, user){
      return res.render("user_profile", {
        title: "User Profile",
        profile_user: user
      });
  });
}

module.exports.update = async function(req, res){
  // if(req.user.id == req.params.id){
  //   User.findByIdAndUpdate(req.params.id, req.body, function(err, user){
  //     return res.redirect('back');
  //   });
  // }else{
  //   return res.status(401).send('Unauthorized');
  // }

  if(req.user.id == req.params.id){

    try{
      let user = await User.findById(req.params.id);
      User.uploadAvatars(req, res, function(err){
        if(err){console.log('***Multer Error:', err)}

        user.name = req.body.name;
        user.email = req.body.email;

        if(req.file){

          if(user.avatar){
            fs.unlinkSync(path.join(__dirname, '..', user.avatar));
          }
          user.avatar = User.avatarPath + '/' + req.file.filename;
        }
        user.save();
        return res.redirect('back');
      });

    }catch(err){
      req.flash('error', err);
      return res.redirect('back');
    }
  }else{
    req.flash('error', 'Unauthorized');
    return res.status(401).send('Unauthorized');
  }
}

// render the sign up page
module.exports.signUp = function (req, res) {
  if(req.isAuthenticated()){
    return res.redirect('/users/profile');
  }

  return res.render("user_sign_up", {
    title: "Codeial | Sign Up",
  });
};

// render the sign in page
module.exports.signIn = function (req, res) {
    if (req.isAuthenticated()) {
      return res.redirect("/users/profile");
    }
    
  return res.render("user_sign_in", {
    title: "Codeial | Sign In",
  });
};

// get the sign up data
module.exports.create = async function (req, res) {
  if (req.body.password != req.body.password_confirm) {
    console.log("password not same");
    return res.redirect("back");
  }

  try {
    let user = await User.findOne({ email: req.body.email });
    if(!user){
        let data = await User.create(req.body)

        console.log('Data: ', data);
        return res.render('user_sign_in',{
        title: 'Sign in'
        });
        
    }
    console.log('user have already in database')
    return res.redirect("back");
    
  } catch (e) {
    console.log(e, "error from signup side");
      return res.redirect("back");
  }
};

module.exports.createSession = function (req, res) {
  req.flash('success', 'Logged in Successfully');
  return res.redirect('/');
};

module.exports.destroySession = function(req,res){
  req.logout((e) => {

    if(e) {
      console.log(e);
      return;
    }
    req.flash("success", "Logged out Successfully");
    return res.redirect('/');
  });
}

