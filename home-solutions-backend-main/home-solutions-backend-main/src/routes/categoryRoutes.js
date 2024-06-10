const express = require('express')
const router = express.Router()


const { addCategory, getCategories, categoryDetails, updateCategory, deleteCategory, getCategoryCount } = require('../controllers/categoryController')

router.post('/category/create',addCategory)
router.get('/category/getcategory',getCategories)
router.get('/categorydetails/:id',categoryDetails)
router.put('/updatecategory/:id', updateCategory)
router.delete('/deletecategory/:id',deleteCategory)
router.get('/categorycount', getCategoryCount)

module.exports = router;