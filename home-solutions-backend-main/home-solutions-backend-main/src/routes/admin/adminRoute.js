const express=require('express')
const router=express.Router()

const { signup, signin } = require('../../controllers/admin/adminController')
// const { validateSignupRequest, isRequestValidated, validateSigninRequest } = require('../../validators/userValidation')


router.post('/admin/signin',signin)
router.post('/admin/signup',signup)



module.exports=router;