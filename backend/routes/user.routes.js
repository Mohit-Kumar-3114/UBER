const express = require('express');
const router = express.Router();
const {registerUser, loginUser, getUserProfile,logoutUser}=require("../controller/user.controller")
const {authUser}=require("../middlewares/auth.middlewares")


router.post('/register',  registerUser);
router.post("/login", loginUser)
router.get("/profile",authUser, getUserProfile)
router.get("/logout",authUser,logoutUser)

module.exports = router;
