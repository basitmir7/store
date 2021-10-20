const express = require("express");

const router = express.Router();

const authController = require("../controllers/auth");
const { route } = require("./shop");

router.get('/login', authController.getLogin);

router.get('/register', authController.getRegister);

router.post('/login', authController.postLogin);

router.post('/register', authController.postRegister);

router.get('/logout',authController.getLogout);

router.get('/resetPassword',authController.getResetPassword);

router.post('/resetPassword',authController.postResetPassword);

router.get('/reset/:token',authController.getUpdatePassword);

router.post('/new-password',authController.postUpdatePassword);

router.get('/profile',authController.getProfile);

router.post('/profile',authController.postProfile);

module.exports = router;