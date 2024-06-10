const express = require('express');
const { addItemToCart } = require('../controllers/cartController');
const router = express.Router()
const {userMiddleware, requireSignin}=require('../middlewares')


router.post('/user/cart/addtocart',requireSignin, userMiddleware,addItemToCart)


module.exports = router;
