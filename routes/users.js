const express = require('express');
const router = express.Router();
const passport = require('passport');

const usersConrtoller = require('../controllers/user_controller');

router.get("/profile/:id", passport.checkAthentication, usersConrtoller.profile);
router.post("/update/:id",passport.checkAthentication,usersConrtoller.update);


//signup and signin passport.checkAuthentication,es
router.get('/sign-up', usersConrtoller.signUp);
router.get('/sign-in', usersConrtoller.signIn);

router.post('/create', usersConrtoller.create);

router.post('/create-session', passport.authenticate("local", {
    failureRedirect: "/users/sign-in",
}), usersConrtoller.createSession);

router.get('/sign-out', usersConrtoller.destroySession);

router.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email']}));
router.get('/auth/google/callback', passport.authenticate('google', {failureRedirect: '/user/sign-in'}), usersConrtoller.createSession);






module.exports = router;