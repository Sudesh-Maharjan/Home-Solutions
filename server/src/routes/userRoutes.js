const express=require('express')
const { signup, postEmailConfirmation, signin, userDetails, getUsers, signout } = require('../controllers/userController')
const router=express.Router()


router.post('/signup',signup)
router.put('/confirmation/:token', postEmailConfirmation)
router.post('/signin',signin)
router.get('/userdetails/:id',userDetails)
router.get('/userlist' ,getUsers)
router.post('/signout',signout)


module.exports=router;