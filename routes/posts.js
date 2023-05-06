const express = require("express");
const router = express.Router();
const passport = require('passport');


const postController = require('../controllers/posts_controller');

router.post('/create', passport.checkAthentication, postController.create);
router.get("/destroy/:id", passport.checkAthentication, postController.destroy);

module.exports = router;    