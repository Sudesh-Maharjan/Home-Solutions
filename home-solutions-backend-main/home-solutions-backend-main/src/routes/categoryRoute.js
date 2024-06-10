const express = require('express')
const router = express.Router()



const { addCategory, getCategories, filterbycategory } = require('../controllers/categoryController')
// const { requireSignin, adminMiddleware } = require('../middlewares')

const multer=require('multer')

const shortid=require('shortid')
const path=require('path')
// const { requireSignin, adminMiddleware } = require('../middlewares')

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

router.post('/category/create', upload.single('categoryImage'),addCategory)
router.get('/category/getcategory',getCategories)
router.get('/category/getcategory/:id',filterbycategory)



module.exports = router;
