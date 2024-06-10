const express=require('express')
const router=express.Router()

const { signup, signin,  } = require('../controllers/userController')
const { isRequestValidated, validateSignupRequest, validateSigninRequest } = require('../validators/userValidation')
const { requireSignin } = require('../middlewares')


router.post('/signin',signin)
router.post('/signup',signup)

router.post('/profile', requireSignin, (req,res)=>{
    res.status(200).json({user:'profile'})
})

module.exports=router;