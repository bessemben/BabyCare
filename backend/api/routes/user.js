const express = require("express");
const router = express.Router();

const UserController = require('../controllers/user');
const checkAuth = require('../middleware/check-auth');

router.get("/users", UserController.users_get_all);
router.post("/signup", UserController.user_signup);

router.post("/login", UserController.user_login);


router.delete("/:userId", checkAuth, UserController.user_delete);
router.get("/userprofile/:userId", UserController.userProfile);


module.exports = router;
