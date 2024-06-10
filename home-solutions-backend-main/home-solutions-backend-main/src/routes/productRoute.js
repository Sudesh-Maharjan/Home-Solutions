const express=require('express')
// const { requireSignin, adminMiddleware } = require('../middlewares')
const router=express.Router()
const { createProduct, getProducts, getProductsbyid, getproductbycategory } = require('../controllers/productController')
const multer=require('multer')

const shortid=require('shortid')
const path=require('path')

// from multer docs
const storage = multer.diskStorage({
        destination: function (req, file, cb) {
          cb(null,path.join(path.dirname(__dirname),'uploads'))
        },
        filename: function (req, file, cb) {
          cb(null, shortid.generate() + '-' + file.originalname)
        }
      })

const upload=multer({
       storage
})
router.post('/product/create', upload.array('productPicture'),createProduct)
router.get('/product/getproduct', getProducts)
router.get('/product/getproductbyid/:id', getProductsbyid)
router.get("/product/getproductbycatid/:id",getproductbycategory)

module.exports=router