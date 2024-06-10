const express=require('express')
const router=express.Router()
const app = express();

const upload=require('../middlewares/file-upload')
const { createProduct, getProducts, deleteProduct, productDetails, getProductsByCategory, updateProduct, getProductsCount } = require('../controllers/productController')
// router.post('/product/create', upload.array('productPictures',4),createProduct)
router.post('/product/create', upload.array('productPictures', 5),createProduct);
router.get('/product/getproduct', getProducts)
router.delete('/deleteproduct/:id', deleteProduct)
router.get('/productdetails/:id', productDetails)
router.get('/getproductbycategory/:id', getProductsByCategory)
router.put('/updateproduct/:id', upload.array('productPictures',5), updateProduct)
router.get('/productcount', getProductsCount)
module.exports=router