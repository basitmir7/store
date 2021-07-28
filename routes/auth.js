const express = require("express");

const router = express.Router();

const authController = require("../controllers/auth");
const { route } = require("./shop");

router.get('/login', authController.getLogin);

router.get('/register', authController.getRegister);

router.post('/login', authController.postLogin);

router.post('/register', authController.postRegister);

router.get('/logout',authController.getLogout);


module.exports = router;